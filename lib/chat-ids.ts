import { conversations } from "./amur-data"

/**
 * Generates a deterministic chat ID from a character's name.
 * The ID is URL-safe and stable across builds.
 */
function generateChatId(name: string, index: number): string {
  // Create a simple hash from the name for uniqueness
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  // Combine with index for guaranteed uniqueness
  const hashStr = Math.abs(hash).toString(36).slice(0, 4)
  // Transliterate Cyrillic name to Latin for URL-safe ID
  const transliterated = transliterate(name).toLowerCase().replace(/[^a-z0-9]/g, "")
  return `${transliterated}-${hashStr}-${index}`
}

/**
 * Simple Cyrillic to Latin transliteration
 */
function transliterate(str: string): string {
  const map: Record<string, string> = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
    "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
    "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch",
    "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
    "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E", "Ё": "Yo",
    "Ж": "Zh", "З": "Z", "И": "I", "Й": "Y", "К": "K", "Л": "L", "М": "M",
    "Н": "N", "О": "O", "П": "P", "Р": "R", "С": "S", "Т": "T", "У": "U",
    "Ф": "F", "Х": "Kh", "Ц": "Ts", "Ч": "Ch", "Ш": "Sh", "Щ": "Sch",
    "Ъ": "", "Ы": "Y", "Ь": "", "Э": "E", "Ю": "Yu", "Я": "Ya",
  }
  return str.split("").map(char => map[char] || char).join("")
}

/**
 * Map of original conversation ID to generated chat ID.
 * Generated at build time for consistent routing.
 */
export const chatIdMap: Record<string, string> = {}

/**
 * Reverse map: chat ID to original conversation ID.
 * Used for URL-based navigation to specific dialogs.
 */
export const reverseChatIdMap: Record<string, string> = {}

// Generate IDs for all conversations at module load time (build time)
conversations.forEach((conv, index) => {
  const chatId = generateChatId(conv.name, index)
  chatIdMap[conv.id] = chatId
  reverseChatIdMap[chatId] = conv.id
})

/**
 * Get the URL-safe chat ID for a conversation
 */
export function getChatId(conversationId: string): string | undefined {
  return chatIdMap[conversationId]
}

/**
 * Get the original conversation ID from a URL-safe chat ID
 */
export function getConversationId(chatId: string): string | undefined {
  return reverseChatIdMap[chatId]
}

/**
 * Get all chat IDs with their corresponding names for debugging/listing
 */
export function getAllChatIds(): Array<{ chatId: string; conversationId: string; name: string }> {
  return conversations.map(conv => ({
    chatId: chatIdMap[conv.id],
    conversationId: conv.id,
    name: conv.name,
  }))
}
