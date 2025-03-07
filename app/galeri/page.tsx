import { FetchedGallery } from '@/components/generals/gallery'
import GalleryList from '@/components/generals/gallery/gallery-list'
import { PageHeader } from '@/components/generals/main-header'
import PaginationCustom from '@/components/ui/pagination-form'
import { Search } from '@/components/ui/search-form'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
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

export async function generateMetadata(): Promise<Metadata> {
  // FIX LATER
  const websiteInfo: WebsiteInfo = (await fetcher(`${baseConfig.server.host}/api/organization`)).data ?? []

  return {
    title: `Galeri - ${websiteInfo.webName}`
  }
}

export default async function Gallery({ searchParams }: SearchParams) {
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

  const requestPath = `${baseConfig.server.host}/api/galleries?${query}`

  const data = (await fetcher(requestPath)) ?? []

  const mappedGallery = ((data?.data as FetchedGallery[]) ?? []).map((mappedData) => {
    return {
      title: mappedData?.title ?? '',
      thumbnail: mappedData?.thumbnail?.url
        ? `${baseConfig.server.host}/${mappedData?.thumbnail?.url.slice(1)}`
        : '/assets/noimg.svg',
      publishedAt: mappedData?.publishedAt ? baseConfig.helpers.formatDate(mappedData.publishedAt) : '',
      category: (mappedData?.categories[0]?.category as string | undefined) ?? '',
      slug: mappedData?.slug
    }
  })

  const pageMeta: PageMeta = data?.meta?.pagination

  return (
    <div className="main-container">
      <PageHeader title="Galeri" />
      <Search placeholder="Cari judul atau kategori galeri..." />
      <GalleryList galleryArr={mappedGallery} isLoading={false} />
      {pageMeta?.pageCount > 1 && (
        <PaginationCustom page={pageMeta.page ?? 1} size={pageMeta.pageCount ?? 0} search={filters.keyword} />
      )}
    </div>
  )
}
