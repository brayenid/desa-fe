import type { Metadata } from 'next'
import './globals.css'
import { baseConfig } from '@/utils/config'
import ErrorBoundary from './ErrorBoundary'
import { fetcher } from '@/utils/fetched-data'
import TopHeader from '@/components/generals/top-header'
import BottomNav from '@/components/generals/bottom-nav'
import Credit from '@/components/generals/credit'
import { Navigation } from '@/components/generals/navigation'
import { WebsiteInfo } from '@/utils/types'
import NextTopLoader from 'nextjs-toploader'
import FloatingMenu from '@/components/generals/floating-menu'
import { GoogleAnalytics } from '@next/third-parties/google'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  // FIX LATER
  const websiteInfo: WebsiteInfo =
    (
      await fetcher(
        `${baseConfig.server.host}/api/organization?populate[0]=logo&populate[1]=chiefImg&populate[2]=favicon`
      )
    ).data ?? []

  const favicon = `${baseConfig.server.host}/${websiteInfo?.favicon?.url.slice(1)}`

  return {
    title: websiteInfo.webName ?? 'Website',
    description: websiteInfo.webDesc ?? 'Deskripsi',
    icons: {
      icon: favicon
    }
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const data: WebsiteInfo =
    (
      await fetcher(
        `${baseConfig.server.host}/api/organization?populate[0]=logo&populate[1]=chiefImg&populate[2]=favicon`
      )
    ).data ?? []

  return (
    <html lang="en">
      <body className={`${baseConfig.style.font.poppins.className} antialiased pb-[4.2rem] sm:pb-0`}>
        <ErrorBoundary>
          <NextTopLoader showSpinner={false} />
          <TopHeader websiteInfo={data} />
          <Navigation websiteInfo={data} />
          <main className="min-h-[60svh]">
            <>{children}</>
          </main>
          <BottomNav websiteInfo={data} />
          <Credit websiteInfo={data} />
          <FloatingMenu />
        </ErrorBoundary>
      </body>
      {baseConfig.meta.gaId ? <GoogleAnalytics gaId={baseConfig.meta.gaId} /> : ''}
    </html>
  )
}
