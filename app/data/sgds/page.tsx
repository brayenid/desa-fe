import { BreadcrumbCustom, BreadcrumbData } from '@/components/generals/breadcrumb'
import NotFoundBox from '@/components/generals/not-found-box'
import LinkButton from '@/components/ui/link-button'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { Download, Goal } from 'lucide-react'
import { Metadata } from 'next'
import qs from 'qs'

const webInfo: WebsiteInfo =
  (
    await fetcher(
      `${baseConfig.server.host}/api/organization?populate[0]=logo&populate[1]=chiefImg&populate[2]=favicon`
    )
  ).data ?? []

export const metadata: Metadata = {
  title: `SGDs - ${webInfo.webName}`
}

interface SGDsType {
  url: string
  sgds: {
    indicator: string
    value: number
  }[]
}

function SGDsCard({ label, value, order }: { label: string; value: number; order: number }) {
  return (
    <div className="flex rounded-xl gap-4 overflow-hidden border border-primary-300 bg-primary-50">
      <div className="min-w-24 text-xl font-bold text-white bg-[url(/assets/bg-dark.svg)] bg-no-repeat bg-cover flex items-center justify-center h-full">
        <p>{order}</p>
      </div>
      <div className="p-2 w-full flex justify-center flex-col">
        <h3 className="uppercase tracking-widest">{label}</h3>
        <div className="relative min-h-12 w-full">
          <div className="font-bold text-xl w-min absolute right-0 bottom-0 p-2 rounded-tl-xl flex items-center gap-3">
            <Goal className="w-4 h-4 text-orange-400" />
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}

function getAvgData(data: SGDsType): number {
  const total = data.sgds.reduce((acc, curr) => acc + curr.value, 0)

  return total / data.sgds.length
}

export default async function SGDs() {
  const query = qs.stringify(
    {
      populate: ['sgds']
    },
    {
      encodeValuesOnly: true
    }
  )

  const data: SGDsType = (await fetcher(`${baseConfig.server.host}/api/sgds?${query}`)).data

  const avgSgds = getAvgData(data)

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
      title: 'SGDs',
      isLast: true,
      url: '#'
    }
  ]

  return (
    <div className="main-container">
      <BreadcrumbCustom data={breadcrumbs} className="mb-8" />
      <header className="flex gap-14 mb-8 flex-col md:flex-row">
        <div className="text-left mb-8">
          <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase w-full mb-4">
            Data SGDs <span className="text-primary-600">{webInfo.webName}</span>
          </h1>
          <p className="mb-6">
            Sustainable Development Goals (SDGs) Desa adalah upaya terpadu mewujudkan Desa tanpa kemiskinan dan
            kelaparan, Desa ekonomi tumbuh merata, Desa peduli kesehatan, Desa peduli lingkungan, Desa peduli
            pendidikan, Desa ramah perempuan, Desa berjejaring, dan Desa tanggap budaya untuk percepatan pencapaian
            Tujuan Pembangunan Berkelanjutan.
          </p>
          <>
            {data.url ? (
              <div className="my-4">
                <LinkButton url={data.url ?? '/'} className="flex items-center w-full lg:w-max gap-4 justify-center">
                  <Download className="w-4 h-4" />
                  <p>Unduh Berkas Lengkap</p>
                </LinkButton>
              </div>
            ) : (
              ''
            )}
          </>
        </div>
        <div className="border rounded-xl bg-[url(/assets/bg-stars.svg)] bg-no-repeat bg-cover p-5 min-w-64 text-center flex flex-col items-center justify-center">
          <p className="font-bold uppercase text-lg">Indeks SGDs</p>
          <div className="font-bold text-3xl p-2 rounded-tl-xl flex items-center gap-3">
            <Goal className="w-5 h-5 text-orange-400" />
            {avgSgds}
          </div>
        </div>
      </header>
      <main className="grid gap-8 xl:grid-cols-3">
        {data.sgds.length ? (
          <>
            {data.sgds.map((s, i) => (
              <SGDsCard label={s.indicator} value={s.value} key={i} order={i + 1} />
            ))}
          </>
        ) : (
          <NotFoundBox text="Tidak ada data ditampilkan" />
        )}
      </main>
    </div>
  )
}
