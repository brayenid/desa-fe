import { PageHeader } from '@/components/generals/main-header'
import NotFoundBox from '@/components/generals/not-found-box'
import LinkButton from '@/components/ui/link-button'
import PaginationCustom from '@/components/ui/pagination-form'
import { Search } from '@/components/ui/search-form'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { Calendar, Download, TagIcon } from 'lucide-react'
import { Metadata } from 'next'
import qs from 'qs'

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

interface PageMeta {
  page: number
  pageSize: number
  pageCount: number
}

interface FetchedPPID {
  title: string
  url: string
  description: string
  category: string
  publishedAt: string
}

export async function generateMetadata(): Promise<Metadata> {
  // FIX LATER
  const websiteInfo: WebsiteInfo = (await fetcher(`${baseConfig.server.host}/api/organization`)).data ?? []

  return {
    title: `PPID - ${websiteInfo.webName}`
  }
}

function PPIDCard({ data }: { data: FetchedPPID }) {
  return (
    <div className="flex flex-col lg:flex-row gap-2 justify-between bg-gray-50 p-4 rounded-xl border border-gray-300">
      <div className="">
        <h2 className="font-bold">{data.title}</h2>
        <div className="text-sm space-y-1">
          <p className="my-4">{data.description}</p>
          <div className="flex items-center gap-4 text-gray-600">
            <TagIcon className="w-4 h-4" />
            {data.category}
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <Calendar className="w-4 h-4" />
            {baseConfig.helpers.formatDate(data.publishedAt)}
          </div>
        </div>
      </div>
      <div className="lg:self-end mt-4">
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm p-2 bg-primary-200 rounded-xl block hover:bg-primary-300 transition-all">
          <div className="flex items-center gap-4 justify-center">
            <Download className="w-4 h-4" />
            Unduh
          </div>
        </a>
      </div>
    </div>
  )
}

function PPIDButtons() {
  const buttons: { label: string; url: string }[] = [
    {
      label: 'Secara Berkala',
      url: '/ppid?q=Secara Berkala'
    },
    {
      label: 'Serta Merta',
      url: '/ppid?q=Serta Merta'
    },
    {
      label: 'Setiap Saat',
      url: '/ppid?q=Setiap Saat'
    }
  ]

  return (
    <div className="space-x-4 my-4 mb-8">
      {buttons.map((b, i) => (
        <LinkButton
          url={b.url}
          key={i}
          className="!bg-primary-200 !text-gray-600 hover:!text-white hover:!bg-primary-500">
          {b.label}
        </LinkButton>
      ))}
    </div>
  )
}

export default async function Document({ searchParams }: SearchParams) {
  const params = await searchParams
  const filters = {
    page: Number(params.page ?? 1),
    limit: 6,
    keyword: params.q ?? ''
  }

  const query = qs.stringify(
    {
      pagination: {
        pageSize: filters.limit,
        page: filters.page
      },
      sort: {
        publishedAt: 'desc'
      },
      filters: filters.keyword
        ? {
            $or: [
              {
                title: { $containsi: filters.keyword }
              },
              { category: { $containsi: filters.keyword } }
            ]
          }
        : undefined
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const data = (await fetcher(`${baseConfig.server.host}/api/ppids?${query}`)) ?? {}

  const ppidData: FetchedPPID[] = data?.data
  const pageMeta: PageMeta = data?.meta?.pagination

  return (
    <div className="main-container">
      <header className="mb-4">
        <PageHeader title="PPID" className="text-left mb-4" />
        <p>
          Pejabat Pengelola Informasi dan Dokumentasi Desa (PPID Desa) adalah pejabat yang bertanggung jawab di bidang
          penyimpanan, pendokumentasian, penyediaan, dan/atau pelayanan Informasi Publik Desa.
        </p>
        <PPIDButtons />
      </header>
      <Search placeholder="Cari judul atau kategori data..." />
      <main className="">
        {ppidData.length ? (
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {ppidData.map((p, i) => (
              <PPIDCard data={p} key={i} />
            ))}
          </div>
        ) : (
          <NotFoundBox text="Tidak ada data ditampilkan" />
        )}
      </main>
      {pageMeta?.pageCount > 1 && (
        <PaginationCustom page={pageMeta.page ?? 1} size={pageMeta.pageCount ?? 0} search={filters.keyword} />
      )}
    </div>
  )
}
