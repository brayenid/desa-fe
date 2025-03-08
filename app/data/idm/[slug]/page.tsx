import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import qs from 'qs'
import LinkButton from '@/components/ui/link-button'
import { BreadcrumbCustom, BreadcrumbData } from '@/components/generals/breadcrumb'
import { FetchedIdm } from '../page'
import { Download } from 'lucide-react'
import { ReactNode } from 'react'
import { PageParams } from '@/utils/types'
import NotFoundBox from '@/components/generals/not-found-box'

interface IDMCardType {
  label: string
  children: ReactNode
}

interface IDMList {
  label: string
  value: string | number
}

function IDMCard({ label, children }: IDMCardType) {
  return (
    <div className="p-8 bg-primary-100 text-primary-600 text-center rounded-xl border border-primary-200">
      <h3 className="text-lg">{label}</h3>
      <div className="text-2xl font-bold uppercase tracking-widest">{children}</div>
    </div>
  )
}

export default async function IDM({ params }: { params: PageParams }) {
  const param = (await params).slug

  const query = qs.stringify({
    filters: {
      year: {
        $eq: param
      }
    },
    pagination: {
      pageSize: 1
    }
  })

  let data: FetchedIdm | null = null

  try {
    const response = await fetcher(`${baseConfig.server.host}/api/idms?${query}`)
    data = response.data[0] ?? null
  } catch (error) {
    console.error('Fetch error:', error)
  }

  if (!data) {
    return <NotFoundBox text="Tidak ada ditampilkan!" />
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
      title: 'IDM',
      isLast: false,
      url: '/data/idm'
    },
    {
      title: await param,
      isLast: true,
      url: '#'
    }
  ]

  const idmDataList: IDMList[] = [
    {
      label: 'Skor Saat Ini',
      value: data.currentScore
    },
    {
      label: 'Status Saat Ini',
      value: data.stats
    },
    {
      label: 'Target Status',
      value: data.statsTarget
    },
    {
      label: 'Indeks Sosial',
      value: data.social
    },
    {
      label: 'Indeks Ekonomi',
      value: data.economy
    },
    {
      label: 'Indeks Ekologi',
      value: data.ecology
    }
  ]

  return (
    <div className="main-container">
      <BreadcrumbCustom data={breadcrumbs} className="mb-8" />
      <div className="">
        <h1 className="w-full uppercase font-bold text-2xl mb-4">
          IDM Tahun Anggaran <span className="text-primary-600">{param}</span>
        </h1>
        <p>
          Indeks Desa Membangun (IDM) merupakan indeks komposit yang dibentuk dari tiga indeks, yaitu Indeks Ketahanan
          Sosial, Indeks Ketahanan Ekonomi, dan Indeks Ketahanan Ekologi/Lingkungan.
        </p>
      </div>
      <main>
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3 my-8">
          {idmDataList.map((idm, i) => (
            <IDMCard key={i} label={idm.label}>
              {idm.value}
            </IDMCard>
          ))}
        </div>
        {data.url ? (
          <div className="">
            <LinkButton url={data.url ?? '/'} className="flex items-center w-full lg:w-max gap-4 justify-center">
              <Download className="w-4 h-4" />
              <p>Unduh Berkas Lengkap</p>
            </LinkButton>
          </div>
        ) : (
          ''
        )}
      </main>
    </div>
  )
}
