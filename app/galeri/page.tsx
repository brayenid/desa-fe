import { FetchedGallery } from '@/components/generals/gallery'
import GalleryList from '@/components/generals/gallery/gallery-list'
import NotFoundBox from '@/components/generals/not-found-box'
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

const data: WebsiteInfo =
  (
    await fetcher(
      `${baseConfig.server.host}/api/organization?populate[0]=logo&populate[1]=chiefImg&populate[2]=favicon`
    )
  ).data ?? []

export const metadata: Metadata = {
  title: `Galeri - ${data.webName}`
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

  if (!data?.data?.length) {
    return <NotFoundBox text="Tidak ada ditampilkan!" />
  }

  const mappedGallery = ((data?.data as FetchedGallery[]) ?? []).map((mappedData) => {
    return {
      title: mappedData?.title ?? '',
      thumbnail: ((mappedData?.thumbnail?.url as string) ?? '').slice(1),
      publishedAt: mappedData?.publishedAt ? baseConfig.helpers.formatDate(mappedData.publishedAt) : '',
      category: (mappedData?.categories[0]?.category as string | undefined) ?? '',
      slug: mappedData?.slug
    }
  })

  const pageMeta: PageMeta = data?.meta?.pagination

  return (
    <div className="main-container">
      <h2 className="text-2xl font-extrabold tracking-widest uppercase text-center w-full">Galeri</h2>
      <Search placeholder="Cari judul atau kategori galeri..." />
      {mappedGallery.length > 0 ? (
        <GalleryList galleryArr={mappedGallery} isLoading={false} />
      ) : (
        <NotFoundBox text="Maaf kami tidak menemukan publikasi" />
      )}
      {pageMeta?.pageCount > 1 && (
        <PaginationCustom page={pageMeta.page ?? 1} size={pageMeta.pageCount ?? 0} search={filters.keyword} />
      )}
    </div>
  )
}
