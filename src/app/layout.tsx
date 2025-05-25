import './globals.css'
import { SessionProvider } from '../components/SessionProvider'
import { getServerSession } from 'next-auth'
import { Inter, Poppins } from 'next/font/google'
import { authOptions } from '@/lib/auth'

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
  icons: {
    icon: [
      { url: '/assets/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/assets/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: {
      url: '/assets/apple-touch-icon.png',
      type: 'image/png',
    },
    other: [
      {
        rel: 'mask-icon',
        url: '/assets/favicon.svg',
      },
    ],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (    <html lang="en" className={`${poppins.variable} h-full`}>
      <head>
        <link rel="manifest" href="/assets/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
