import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Instrument_Serif, Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

const geist = Geist({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Амур — знакомства с характером",
  description:
    "Более 50 000 счастливых пар нашли друг друга в Амуре. Элегантный сервис знакомств для тех, кто ищет серьезные отношения. Присоединяйтесь бесплатно!",
  openGraph: {
    title: "Амур — Найдите свою настоящую любовь",
    description:
      "Более 50 000 счастливых пар нашли друг друга в Амуре. Элегантный сервис знакомств для тех, кто ищет серьезные отношения.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fae3e6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${geist.variable} ${instrumentSerif.variable} scroll-smooth bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}