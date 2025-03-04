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

const data: WebsiteInfo =
  (
    await fetcher(
      `${baseConfig.server.host}/api/organization?populate[0]=logo&populate[1]=chiefImg&populate[2]=favicon`
    )
  ).data ?? []

export const metadata: Metadata = {
  title: data.webName ?? 'Website',
  description: data.webDesc ?? 'Deskripsi',
  icons: {
    icon: `${baseConfig.server.host}/${data?.favicon?.url.slice(1)}`
  }
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${baseConfig.style.font.poppins.className} antialiased w-full overflow-x-hidden`}>
        <ErrorBoundary>
          <NextTopLoader showSpinner={false} />
          <TopHeader websiteInfo={data} />
          <Navigation websiteInfo={data} />
          <main className="min-h-[60svh]">
            <>{children}</>
          </main>
          <BottomNav websiteInfo={data} />
          <Credit websiteInfo={data} />
        </ErrorBoundary>
      </body>
    </html>
  )
}
