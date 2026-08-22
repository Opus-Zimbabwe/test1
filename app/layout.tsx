import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Opus Zimbabwe — Digital Services for Zimbabwe',
  description:
    'Websites, software systems, AI automation, branding, domains, hosting and integrations for Zimbabwean organisations.',
  icons: { icon: '/images/favicon-96x96.png', apple: '/images/logo.png' },
}

export const viewport: Viewport = {
  themeColor: '#f97316',
  colorScheme: 'light',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} bg-white`}>
      <body className="font-poppins bg-white text-zinc-900 antialiased">
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  )
}
