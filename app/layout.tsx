import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

const siteUrl = 'https://find.isamelorealestate.com'
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

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
        {metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`,
          }} />
        )}
        {children}
        {metaPixelId && (
          <noscript>
            <img height="1" width="1" style={{ display: 'none' }} alt="" src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`} />
          </noscript>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(agentSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
