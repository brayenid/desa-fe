import { SuggestionForm } from '@/components/generals/form'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const webInfo: WebsiteInfo =
  (
    await fetcher(
      `${baseConfig.server.host}/api/organization?populate[0]=logo&populate[1]=chiefImg&populate[2]=favicon`
    )
  ).data ?? []

export const metadata: Metadata = {
  title: `Kotak Pesan - ${webInfo.webName}`
}

export default function SuggestionPage() {
  return (
    <div className="main-container">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-widest uppercase w-full mb-2">Kotak Pesan</h1>
        <p>Silahkan mengirimkan pesan atau saran untuk desa.</p>
      </header>
      <SuggestionForm />
    </div>
  )
}
