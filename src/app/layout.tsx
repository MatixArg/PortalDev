import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/shared/providers'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'PortalDev - Build your reputation with projects',
    template: '%s | PortalDev',
  },
  description: 'PortalDev helps developers build a reputation based on real projects and helps companies find technical talent that ships.',
  openGraph: {
    title: 'PortalDev - Show what you build',
    description: 'Build your reputation with projects, not words.',
    type: 'website',
    siteName: 'PortalDev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PortalDev - Show what you build',
    description: 'Build your reputation with projects, not words.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
