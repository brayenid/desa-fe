import ContentList from './content-list'
import qs from 'qs'
import { FetchedNews } from './news'
import { fetcher } from '@/utils/fetched-data'
import { baseConfig } from '@/utils/config'
import NotFoundBox from './not-found-box'
import { FetchedGallery } from './gallery'
import Link from 'next/link'
import { FetchedShop } from './shop'

export default async function PostSideBar({ param }: { param: Promise<string> | string | string[] }) {
  const queryLatestArticles = qs.stringify(
    {
      filters: param
        ? {
            slug: {
              $ne: param
            }
          }
        : undefined,
      pagination: {
        pageSize: 3
      },
      fields: ['title', 'publishedAt', 'slug'],
      populate: {
        thumbnail: {
          fields: ['url']
        }
      },
      sort: {
        publishedAt: 'desc'
      }
    },
    { encodeValuesOnly: true }
  )

  const articles: FetchedNews[] = (await fetcher(`${baseConfig.server.host}/api/articles?${queryLatestArticles}`)).data

  const queryLatestGalleries = qs.stringify(
    {
      filters: {
        slug: {
          $ne: param
        }
      },
      pagination: {
        pageSize: 3
      },
      fields: ['title', 'publishedAt', 'slug'],
      populate: {
        thumbnail: {
          fields: ['url']
        }
      }
    },
    { encodeValuesOnly: true }
  )

  const galleries: FetchedGallery[] = (await fetcher(`${baseConfig.server.host}/api/galleries?${queryLatestGalleries}`))
    .data

  return (
    <div className="sticky top-20 space-y-8">
      <div>
        <header className="flex items-center justify-between gap-3 before:w-2 before:h-2 before:bg-rose-300 before:absolute before:left-0">
          <h2 className="tracking-widest uppercase font-bold pl-5">Artikel Terbaru</h2>
          <Link href="/artikel" className="text-primary-500 text-sm p-2 hover:underline">
            Lihat
          </Link>
        </header>
        {articles.length < 1 ? (
          <NotFoundBox text="Belum ada konten" className="bg-gray-100 text-gray-500 border-gray-300m mt-2" />
        ) : (
          <ContentList datas={articles} prefixUrl="/artikel" />
        )}
      </div>
      <div>
        <header className="flex items-center justify-between gap-3 before:w-2 before:h-2 before:bg-primary-300 before:absolute before:left-0">
          <h2 className="tracking-widest uppercase font-bold pl-5">Galeri Terbaru</h2>
          <Link href="/galeri" className="text-primary-500 text-sm p-2 hover:underline">
            Lihat
          </Link>
        </header>
        {galleries.length < 1 ? (
          <NotFoundBox text="Belum ada konten" className="bg-gray-100 text-gray-500 border-gray-300m mt-2" />
        ) : (
          <ContentList datas={galleries} prefixUrl="/galeri" />
        )}
      </div>
    </div>
  )
}

export async function ShopSideBar({ param }: { param: Promise<string> | string | string[] }) {
  const queryLatestShops = qs.stringify(
    {
      filters: param
        ? {
            slug: {
              $ne: param
            }
          }
        : undefined,
      pagination: {
        pageSize: 3
      },
      sort: {
        publishedAt: 'desc'
      },
      fields: ['title', 'publishedAt', 'slug', 'price'],
      populate: {
        thumbnail: {
          fields: ['url']
        }
      }
    },
    { encodeValuesOnly: true }
  )

  const shops: FetchedShop[] = (await fetcher(`${baseConfig.server.host}/api/shops?${queryLatestShops}`)).data

  return (
    <div className="sticky top-20 space-y-8">
      <div>
        <header className="flex items-center justify-between gap-3 before:w-2 before:h-2 before:bg-primary-300 before:absolute before:left-0">
          <h2 className="tracking-widest uppercase font-bold pl-5">Penjualan Terbaru</h2>
          <Link href="/belanja" className="text-primary-500 text-sm p-2 hover:underline">
            Lihat
          </Link>
        </header>
        {shops.length < 1 ? (
          <NotFoundBox text="Belum ada konten" className="bg-gray-100 text-gray-500 border-gray-300m mt-2" />
        ) : (
          <ContentList datas={shops} prefixUrl="/belanja" />
        )}
      </div>
    </div>
  )
}
