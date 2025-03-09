import NotFoundBox from '@/components/generals/not-found-box'
import { FetchedPotential } from '@/components/generals/potential'
import PotentialList from '@/components/generals/potential/potential-list'
import PaginationCustom from '@/components/ui/pagination-form'
import { Search } from '@/components/ui/search-form'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { Metadata } from 'next'
import qs from 'qs'
import noImg from '@/public/assets/noimg.png'

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
    title: `Potensi - ${websiteInfo.webName}`
  }
}

export default async function Potential({ searchParams }: SearchParams) {
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
      populate: ['thumbnail'],
      filters: {
        title: { $containsi: filters.keyword }
      }
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const requestPath = `${baseConfig.server.host}/api/potentials?${query}`

  const data = (await fetcher(requestPath)) ?? []

  const mappedPotential = ((data?.data as FetchedPotential[]) ?? []).map((mappedData) => {
    return {
      title: mappedData?.title ?? '',
      thumbnail: mappedData?.thumbnail ? `${baseConfig.server.host}/${mappedData?.thumbnail?.url.slice(1)}` : noImg.src,
      publishedAt: mappedData?.publishedAt ? baseConfig.helpers.formatDate(mappedData.publishedAt) : '',
      slug: mappedData?.slug
    }
  })

  const pageMeta: PageMeta = data?.meta?.pagination

  return (
    <div className="main-container">
      <h2 className="text-2xl font-bold tracking-widest uppercase text-center w-full">Potensi Desa</h2>
      <Search placeholder="Cari judul potensi..." />
      {mappedPotential.length > 0 ? (
        <PotentialList potential={mappedPotential} isLoading={false} isMobile={false} />
      ) : (
        <NotFoundBox text="Tidak ada data ditampilkan" />
      )}
      {pageMeta?.pageCount > 1 && (
        <PaginationCustom page={pageMeta.page ?? 1} size={pageMeta.pageCount ?? 0} search={filters.keyword} />
      )}
    </div>
  )
}
