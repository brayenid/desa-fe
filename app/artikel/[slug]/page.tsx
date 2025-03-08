import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { Calendar, Hash, Pen } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import qs from 'qs'
import { FetchedNews } from '@/components/generals/news'
import BlocksView, { BlocksType } from '@/components/generals/blocks/blocks'
import Link from 'next/link'
import { Metadata } from 'next'
import { PageParams, WebsiteInfo } from '@/utils/types'
import { generateMeta, MetaImage } from '@/utils/meta'
import PostSideBar from '@/components/generals/post-sidebar'
import SharerSocials from '@/components/generals/sharer'
import { BreadcrumbCustom, BreadcrumbData } from '@/components/generals/breadcrumb'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const param = (await params).slug

  // FIX LATER
  const websiteInfo: WebsiteInfo = (await fetcher(`${baseConfig.server.host}/api/organization`)).data ?? []

  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: param
        }
      },
      pagination: {
        pageSize: 1
      },
      fields: ['title', 'publishedAt', 'slug', 'description'],
      populate: {
        thumbnail: {
          fields: ['url', 'width', 'height']
        }
      }
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const article: FetchedNews = (await fetcher(`${baseConfig.server.host}/api/articles?${query}`)).data[0] ?? {}

  return await generateMeta({
    title: article.title,
    description: article.description ?? 'Baca artikel terbaru.',
    image: article?.thumbnail as unknown as MetaImage,
    websiteName: websiteInfo.webName,
    type: 'article'
  })
}

export default async function Page({ params }: { params: PageParams }) {
  const param = (await params).slug

  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: param
        }
      },
      pagination: {
        pageSize: 6
      },
      populate: ['categories', 'thumbnail', 'blocks.images']
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const article: FetchedNews = (await fetcher(`${baseConfig.server.host}/api/articles?${query}`)).data[0] ?? {}

  if (!article) {
    notFound()
  }

  const breadcrumbs: BreadcrumbData[] = [
    {
      title: 'Beranda',
      isLast: false,
      url: '/'
    },
    {
      title: 'Artikel',
      isLast: false,
      url: '/artikel'
    },
    {
      title: article.title,
      isLast: true,
      url: '#'
    }
  ]

  return (
    <div className="main-container md:!p-12">
      <div className="flex gap-8 flex-col xl:flex-row">
        <div className="space-y-4 w-full xl:max-w-screen-md">
          <header className="space-y-2 mx-auto max-w-screen-lg">
            <BreadcrumbCustom data={breadcrumbs} className="mb-4 " />
            <h1 className="text-2xl md:text-3xl font-black py-2">{article.title}</h1>
            <div className="flex gap-4 items-center text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Pen className="w-4 h-4" />
                <p>Admin</p>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 " />
                <p>{baseConfig.helpers.formatDate(article.publishedAt)}</p>
              </div>
            </div>
          </header>
          {article.categories.length > 0 ? (
            <div className="flex gap-4 items-center justify-end">
              <Hash className="w-4 h-4" />
              {article.categories.map((art, i) => (
                <div key={i}>
                  <Link
                    className="text-primary-600 text-sm md:text-base hover:underline"
                    href={`/artikel?page=1&q=${art.category}`}>
                    {art.category}
                  </Link>
                  {i < article.categories.length - 1 ? <span className="w-1 h-1 bg-primary-200"></span> : ''}
                </div>
              ))}
            </div>
          ) : (
            ''
          )}
          <div
            className="my-2 border-b border-gray-200
        ">
            <div className="rounded-xl overflow-hidden mb-4">
              {article.thumbnail ? (
                <Image
                  src={`${baseConfig.server.host}/${article.thumbnail.url.slice(1)}`}
                  width={500}
                  height={500}
                  title={article.title}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: 'clamp(450px, 30vh, 550px)'
                  }}
                  alt={article.title}
                />
              ) : (
                ''
              )}
            </div>
            {article.thumbnail?.caption ? (
              <p className="pb-4 text-sm text-gray-600 text-center">{article.thumbnail?.caption}</p>
            ) : (
              ''
            )}
          </div>
          <main>
            <BlocksView blocks={article?.blocks as BlocksType[]} />
            <SharerSocials url={`${baseConfig.server.public}/${article.slug}`} />
          </main>
        </div>
        <div className="w-full flex-[1]">
          <PostSideBar param={param} />
        </div>
      </div>
    </div>
  )
}
