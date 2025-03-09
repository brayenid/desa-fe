import { BreadcrumbCustom, BreadcrumbData } from '@/components/generals/breadcrumb'
import { PageHeader } from '@/components/generals/main-header'
import { SafetynetForm } from '@/components/generals/safetynet-form'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  // FIX LATER
  const websiteInfo: WebsiteInfo = (await fetcher(`${baseConfig.server.host}/api/organization`)).data ?? []

  return {
    title: `Data Bantuan Sosial - ${websiteInfo.webName}`
  }
}

const breadcrumbs: BreadcrumbData[] = [
  {
    title: 'Beranda',
    isLast: false,
    url: '/'
  },
  {
    title: 'Data',
    isLast: false,
    url: '/data'
  },
  {
    title: 'Data Bantuan Sosial',
    isLast: true,
    url: '#'
  }
]

export default function SafetyNet() {
  return (
    <div className="main-container">
      <BreadcrumbCustom data={breadcrumbs} className="mb-8" />

      <PageHeader title="Data Bantuan Sosial" description="Cek data anda apakah sebagai penerima bantuan sosial" />
      <main>
        <SafetynetForm />
      </main>
    </div>
  )
}
