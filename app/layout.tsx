import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { ThemeInjector } from '@/components/ui/ThemeInjector'
import { PlanetBackground } from '@/components/ui/PlanetBackground'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', weight: ['300','400','500','600','700','800'] })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://zohaib.dev'),
  title: 'Zohaib Ehtesham | Software & AI Engineer',
  description: 'Portfolio of Zohaib Ehtesham — software engineer, AI researcher, hackathon winner',
  openGraph: {
    title: 'Zohaib Ehtesham',
    description: 'Software Engineer · AI Researcher · Hackathon Winner',
    url: 'https://zohaib.dev',
    siteName: 'Zohaib Ehtesham',
    type: 'website',
    locale: 'en_GB',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zohaib Ehtesham — Software & AI Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zohaib Ehtesham | Software & AI Engineer',
    description: 'Portfolio of Zohaib Ehtesham — software engineer, AI researcher, hackathon winner',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans bg-bg text-white">
        <ThemeInjector />
        <PlanetBackground />
        {children}
      </body>
    </html>
  )
}
