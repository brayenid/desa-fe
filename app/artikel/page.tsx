import { FetchedNews } from '@/components/generals/news'
import NewsList from '@/components/generals/news/news-list'
import NotFoundBox from '@/components/generals/not-found-box'
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
    title: `Artikel - ${websiteInfo.webName}`
  }
}

export default async function Article({ searchParams }: SearchParams) {
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
      populate: ['categories', 'thumbnail'],
      filters: filters.keyword
        ? {
            $or: [
              {
                title: { $containsi: filters.keyword }
              },
              { categories: { category: { $containsi: filters.keyword } } }
            ]
          }
        : undefined
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const requestPath = `${baseConfig.server.host}/api/articles?${query}`

  const data = (await fetcher(requestPath)) ?? []

  if (!data) {
    return <NotFoundBox text="Tidak ada ditampilkan!" />
  }

  const mappedNews = ((data?.data as FetchedNews[]) ?? []).map((mappedData) => {
    return {
      title: mappedData?.title ?? '',
      thumbnail: ((mappedData?.thumbnail?.url as string) ?? '').slice(1),
      description: mappedData?.description ?? '',
      publishedAt: mappedData?.publishedAt ? baseConfig.helpers.formatDate(mappedData.publishedAt) : '',
      category: (mappedData?.categories[0]?.category as string | undefined) ?? '',
      slug: mappedData?.slug
    }
  })

  const pageMeta: PageMeta = data?.meta?.pagination

  return (
    <div className="main-container">
      <h1 className="text-2xl font-extrabold tracking-widest uppercase text-center w-full">Artikel</h1>
      <Search placeholder="Cari judul atau kategori artikel..." />
      {mappedNews.length > 0 ? (
        <NewsList newsArr={mappedNews} isLoading={false} />
      ) : (
        <NotFoundBox text="Maaf kami tidak menemukan publikasi" />
      )}
      {pageMeta?.pageCount > 1 && (
        <PaginationCustom page={pageMeta.page ?? 1} size={pageMeta.pageCount ?? 0} search={filters.keyword} />
      )}
    </div>
  )
}
