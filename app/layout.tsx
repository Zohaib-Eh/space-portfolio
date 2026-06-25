import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { ThemeInjector } from '@/components/ui/ThemeInjector'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Zohaib Ehtesham',
  description: 'Software Engineer · AI Researcher · Hackathon Winner',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans bg-bg text-white">
        <ThemeInjector />
        {children}
      </body>
    </html>
  )
}
