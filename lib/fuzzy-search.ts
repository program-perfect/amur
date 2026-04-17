/**
 * Fuzzy, diacritic-insensitive substring matching used by the messenger
 * chat list search box.
 *
 * Design goals:
 *   1. Recognise substrings — typing "маэ" should match "Маэстро".
 *   2. Ignore case, diacritics, and common Cyrillic confusables
 *      (ё↔е, й↔и) so users get forgiving results when they type fast.
 *   3. Tolerate small typos — a query token matches if it appears
 *      verbatim OR if it has high bigram-similarity with any word in
 *      the haystack (handles single-character mistakes, e.g.
 *      "маэтро" → "маэстро").
 *   4. Multiple query tokens are AND-ed together — every token has to
 *      match somewhere in the haystack.
 *   5. Zero external dependencies; cheap enough to run on every
 *      keystroke for dozens of conversations.
 */

/** Strip diacritics, lowercase, fold common Cyrillic confusables. */
export function normalizeForSearch(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    // Remove combining marks (accents / diacritics).
    .replace(/[\u0300-\u036f]/g, "")
    // Fold Russian confusables — users often drop the diacritic on ё
    // and confuse й with и when typing quickly.
    .replace(/ё/g, "е")
    .replace(/й/g, "и")
    // Collapse anything that isn't a letter, digit, or space into a
    // single space so punctuation/emoji never blocks a match.
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Split a normalised string into word-tokens. */
function tokenize(normalised: string): string[] {
  if (!normalised) return []
  return normalised.split(" ").filter(Boolean)
}

/**
 * Produce the set of 2-character "bigrams" for a token, used to score
 * approximate similarity between two words. Short tokens (<= 2 chars)
 * degrade to an exact-substring check at the call site.
 */
function bigrams(token: string): string[] {
  if (token.length < 2) return []
  const out: string[] = []
  for (let i = 0; i < token.length - 1; i++) {
    out.push(token.slice(i, i + 2))
  }
  return out
}

/**
 * Dice-coefficient similarity on bigrams, in [0, 1]. 1.0 means
 * identical; 0.0 means no overlap.
 */
function bigramSimilarity(a: string, b: string): number {
  if (a === b) return 1
  const ba = bigrams(a)
  const bb = bigrams(b)
  if (ba.length === 0 || bb.length === 0) return 0
  const counts = new Map<string, number>()
  for (const g of ba) counts.set(g, (counts.get(g) ?? 0) + 1)
  let overlap = 0
  for (const g of bb) {
    const c = counts.get(g) ?? 0
    if (c > 0) {
      overlap++
      counts.set(g, c - 1)
    }
  }
  return (2 * overlap) / (ba.length + bb.length)
}

/**
 * How tolerant the fuzzy match is — a token "matches" a haystack word
 * if their bigram similarity is at or above this threshold. 0.7 lets
 * "маэтро" find "маэстро" and "татяна" find "татьяна" without
 * flooding the results with false positives.
 */
const FUZZY_THRESHOLD = 0.7

/**
 * Returns true when every query token either appears as a substring
 * of the haystack OR has a fuzzy-similar word in the haystack.
 * An empty query matches everything.
 */
export function matchesQuery(query: string, haystack: string): boolean {
  const q = normalizeForSearch(query)
  if (!q) return true
  const h = normalizeForSearch(haystack)
  if (!h) return false

  const tokens = tokenize(q)
  if (tokens.length === 0) return true
  const words = tokenize(h)

  for (const token of tokens) {
    // 1. Fast path — direct substring anywhere in the haystack.
    if (h.includes(token)) continue

    // 2. Short tokens (<= 2 chars) never fuzzy-match — not enough
    //    signal, and they'd cause noisy hits.
    if (token.length <= 2) return false

    // 3. Fuzzy — does any word in the haystack have high enough
    //    bigram similarity?
    let matched = false
    for (const word of words) {
      // Skip overly-short words; they can't reliably match a typo.
      if (word.length < 3) continue
      if (bigramSimilarity(token, word) >= FUZZY_THRESHOLD) {
        matched = true
        break
      }
    }
    if (!matched) return false
  }
  return true
}
