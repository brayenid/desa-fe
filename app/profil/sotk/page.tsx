import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import qs from 'qs'
import { Metadata } from 'next'
import { WebsiteInfo } from '@/utils/types'
import { generateMeta, MetaImage } from '@/utils/meta'
import StaffCard, { FetchedSOTK } from '@/components/generals/staff/staff-card'
import NotFoundBox from '@/components/generals/not-found-box'

export async function generateMetadata(): Promise<Metadata> {
  // FIX LATER
  const websiteInfo: WebsiteInfo =
    (await fetcher(`${baseConfig.server.host}/api/organization?populate[0]=logo`)).data ?? {}

  return await generateMeta({
    title: `SOTK ${websiteInfo.webName}`,
    description: `Mengenal jajaran SOTK ${websiteInfo.webName}`,
    image: websiteInfo?.logo as unknown as MetaImage,
    websiteName: websiteInfo.webName,
    type: 'article'
  })
}

function SOTKRender({ sotk }: { sotk: FetchedSOTK[] }) {
  if (!sotk.length) return <NotFoundBox text="Tidak ada data ditampilkan" />

  const sotkChief = sotk.filter((data) => data.level === 'L1')[0]
  const sotkMember = sotk.filter((data) => data.level !== 'L1')

  return (
    <>
      <div className="w-max m-auto max-w-96 mb-4">
        <StaffCard name={sotkChief.name} img={sotkChief?.img?.url} role={sotkChief.role} />
      </div>
      <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {sotkMember.map((data, i) => (
          <StaffCard key={i} img={data?.img?.url} name={data.name} role={data.role} />
        ))}
      </div>
    </>
  )
}

export default async function Page() {
  const query = qs.stringify(
    {
      populate: ['img'],
      sort: ['level:asc']
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const sotk: FetchedSOTK[] = (await fetcher(`${baseConfig.server.host}/api/sotks?${query}`)).data

  return (
    <div className="main-container md:!p-12 flex gap-8 flex-col xl:flex-row">
      <div className="space-y-4 w-full">
        <header className="space-y-2 mx-auto max-w-screen-lg text-center">
          <h1 className="text-2xl md:text-3xl font-black py-2">SOTK</h1>
          <p>Stuktur Organisasi dan Tata Kerja</p>
        </header>
        <main className="text-center ">
          <SOTKRender sotk={sotk} />
        </main>
      </div>
    </div>
  )
}
