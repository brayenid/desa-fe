import { PageHeader } from '@/components/generals/main-header'
import NotFoundBox from '@/components/generals/not-found-box'
import { FetchedShop } from '@/components/generals/shop'
import ShopList from '@/components/generals/shop/shop-list'
import PaginationCustom from '@/components/ui/pagination-form'
import { Search } from '@/components/ui/search-form'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { Metadata } from 'next'
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
    title: `Belanja - ${websiteInfo.webName}`
  }
}

export default async function Shop({ searchParams }: SearchParams) {
  const params = await searchParams

  const filters = {
    page: Number(params.page ?? 1),
    limit: 8,
    keyword: params.q ?? ''
  }

  const query = qs.stringify(
    {
      pagination: {
        pageSize: filters.limit,
        page: filters.page
      },
      populate: [, 'thumbnail'],
      filters: filters.keyword
        ? {
            title: { $containsi: filters.keyword }
          }
        : undefined
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const requestPath = `${baseConfig.server.host}/api/shops?${query}`

  const data = (await fetcher(requestPath)) ?? []

  if (!data) {
    return <NotFoundBox text="Tidak ada ditampilkan!" />
  }

  const mappedShop = ((data?.data as FetchedShop[]) ?? []).map((mappedData) => {
    return {
      title: mappedData?.title ?? '',
      thumbnail: mappedData?.thumbnail?.url
        ? `${baseConfig.server.host}/${mappedData?.thumbnail?.url.slice(1)}`
        : '/assets/noimg.svg',
      description: mappedData?.description ?? '',
      publishedAt: mappedData?.publishedAt ? baseConfig.helpers.formatDate(mappedData.publishedAt) : '',
      slug: mappedData?.slug,
      seller: mappedData?.seller,
      price: mappedData?.price
    }
  })

  const pageMeta: PageMeta = data?.meta?.pagination

  return (
    <div className="main-container">
      <PageHeader title="Belanja Dari Desa" />
      <Search placeholder="Cari judul penjualan..." />
      {mappedShop.length > 0 ? (
        <ShopList shopsArr={mappedShop} isLoading={false} />
      ) : (
        <NotFoundBox text="Tidak ada data ditampilkan" />
      )}
      {pageMeta?.pageCount > 1 && (
        <PaginationCustom page={pageMeta.page ?? 1} size={pageMeta.pageCount ?? 0} search={filters.keyword} />
      )}
    </div>
  )
}
