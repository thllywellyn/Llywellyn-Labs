import './globals.css'
import { SessionProvider } from '../components/SessionProvider'
import { getServerSession } from 'next-auth'
import { Inter, Poppins } from 'next/font/google'
import { authOptions } from '@/lib/auth'
import Script from 'next/script'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const viewport = {
  themeColor: '#FF4500',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export const metadata = {
  title: 'Llywellyn Labs',
  description: 'Freelancer specializing in social media management, website development, domain consultation, and email solutions',
  manifest: '/assets/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Llywellyn Labs',
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: true,
    url: false,
  },
  applicationName: 'Llywellyn Labs',
  referrer: 'origin-when-cross-origin',
  keywords: ['web development', 'social media', 'domain consultation', 'email solutions'],
  authors: [{ name: 'Llywellyn Sana Thaoroijam' }],
  creator: 'Llywellyn Sana Thaoroijam',
  publisher: 'Llywellyn Labs',
  metadataBase: new URL('https://lsanalab.xyz'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/assets/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/assets/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/assets/favicon.svg' }
    ]
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <head>
        <link rel="manifest" href="/assets/site.webmanifest" />
        <meta name="theme-color" content="#FF4500" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Llywellyn Labs" />
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
        <link
          rel="apple-touch-startup-image"
          href="/assets/apple-touch-icon.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"        />
      </head>
      <body className="h-full">        <SessionProvider session={session}>
          {children}
          <ServiceWorkerRegistration />
        </SessionProvider>
      </body>
    </html>
  )
}
