import { BreadcrumbCustom, BreadcrumbData } from '@/components/generals/breadcrumb'
import { PageHeader } from '@/components/generals/main-header'
import NotFoundBox from '@/components/generals/not-found-box'
import PaginationCustom from '@/components/ui/pagination-form'
import { Search } from '@/components/ui/search-form'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { Metadata } from 'next'
import Link from 'next/link'
import qs from 'qs'

export const dynamic = 'force-dynamic'

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

interface PageMeta {
  page: number
  pageSize: number
  pageCount: number
}

export async function generateMetadata(): Promise<Metadata> {
  // FIX LATER
  const websiteInfo: WebsiteInfo = (await fetcher(`${baseConfig.server.host}/api/organization`)).data ?? []

  return {
    title: `Anggaran - ${websiteInfo.webName}`
  }
}

export interface FetchedBudgets {
  publishedAt: string
  year: number
  budget: {
    expenditure: {
      govExpenditure: number
      villageDevelopment: number
      communityDev: number
      communityEmpowerment: number
      emergencyExpenditure: number
    }
    income: {
      originalIncome: number
      transferIncome: number
      miscIncome: number
    }
    financing: {
      label: string
      total: number
      role: 'Penerimaan' | 'Pengeluaran'
    }[]
    url: string
  }
}

export default async function Budgets({ searchParams }: SearchParams) {
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
      filters: {
        year: { $containsi: filters.keyword }
      },
      populate: ['budget'],
      sort: {
        year: 'desc'
      }
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const requestPath = `${baseConfig.server.host}/api/budgets?${query}`

  const data = (await fetcher(requestPath)) ?? []

  const mappedBudgets = ((data?.data as FetchedBudgets[]) ?? []).map((mappedData) => {
    return {
      year: mappedData?.year ?? 0,
      publishedAt: mappedData?.publishedAt ? baseConfig.helpers.formatDate(mappedData.publishedAt) : ''
    }
  })

  const pageMeta: PageMeta = data?.meta?.pagination

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
      title: 'Anggaran',
      isLast: true,
      url: '#'
    }
  ]

  return (
    <div className="main-container">
      <BreadcrumbCustom data={breadcrumbs} className="mb-8" />
      <div className="text-left md:text-center mb-8">
        <PageHeader
          title="APBDes"
          description="Cari data informasi APBDes berdasarkan tahun anggaran"
          className="text-left md:text-center"
        />
      </div>

      <Search placeholder="Cari data sesuai tahun anggaran ..." />
      {mappedBudgets.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {mappedBudgets.map((data, i) => (
            <div className="" key={i}>
              <Link href={`/data/anggaran/${data.year}`}>
                <div className="bg-gray-50 text-2xl font-bold p-8 text-center bg-[url(/assets/bg-light-gold.svg)] border-2 rounded-xl border-gray-200 bg-cover hover:border-yellow-200 transition-all">
                  <p>{data.year}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <NotFoundBox text="Tidak ada data ditampilkan" />
      )}
      {pageMeta?.pageCount > 1 && (
        <PaginationCustom page={pageMeta.page ?? 1} size={pageMeta.pageCount ?? 0} search={filters.keyword} />
      )}
    </div>
  )
}
