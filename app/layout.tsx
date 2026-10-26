import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = 'https://find.isamelorealestate.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Find Your Ideal Dubai Property | Isamelo Real Estate',
  description: 'Answer 8 quick questions and get a hand-picked Dubai property shortlist on WhatsApp, with payment plans, full costs and Golden Visa guidance included.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Isamelo Real Estate',
    title: 'Find Your Ideal Dubai Property | Isamelo Real Estate',
    description: 'Answer 8 quick questions and get a hand-picked Dubai property shortlist on WhatsApp, with payment plans, full costs and Golden Visa guidance included.',
    locale: 'en_US',
    images: [
      {
        url: '/samelo-logo.png',
        alt: 'Isamelo Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Find Your Ideal Dubai Property | Isamelo Real Estate',
    description: 'Answer 8 quick questions and get a hand-picked Dubai property shortlist on WhatsApp, with payment plans, full costs and Golden Visa guidance included.',
    images: ['/samelo-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/samelo-logo.png',
        type: 'image/png',
      },
    ],
    apple: '/samelo-logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

const agentSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Isamelo Real Estate',
  url: siteUrl,
  logo: `${siteUrl}/samelo-logo.png`,
  image: `${siteUrl}/isa-melo-agent.jpg`,
  areaServed: { '@type': 'City', name: 'Dubai' },
  knowsAbout: [
    'Off-plan property Dubai',
    'Ready property Dubai',
    'Dubai Golden Visa',
    'Dubai property payment plans',
    'Dubai rental yields',
    'Dubai Marina',
    'Palm Jumeirah',
    'Downtown Dubai',
  ],
}

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Isamelo Real Estate',
  url: siteUrl,
  inLanguage: ['en', 'pt-BR', 'es'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(agentSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
