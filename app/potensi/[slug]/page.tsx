import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { Calendar, Pen } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import qs from 'qs'
import BlocksView, { BlocksType } from '@/components/generals/blocks/blocks'
import { Metadata } from 'next'
import { PageParams, WebsiteInfo } from '@/utils/types'
import { generateMeta, MetaImage } from '@/utils/meta'
import PostSideBar from '@/components/generals/post-sidebar'
import SharerSocials from '@/components/generals/sharer'
import { FetchedPotential } from '@/components/generals/potential'
import { BreadcrumbCustom, BreadcrumbData } from '@/components/generals/breadcrumb'

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
      fields: ['title', 'publishedAt', 'slug'],
      populate: {
        thumbnail: {
          fields: ['url', 'width', 'height']
        }
      }
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const potential: FetchedPotential = (await fetcher(`${baseConfig.server.host}/api/potentials?${query}`)).data[0] ?? {}

  return await generateMeta({
    title: potential.title,
    description: `Baca potensi desa tentang ${potential.title}`,
    image: potential?.thumbnail as unknown as MetaImage,
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
        pageSize: 1
      },
      populate: ['thumbnail', 'blocks.images']
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const potential: FetchedPotential = (await fetcher(`${baseConfig.server.host}/api/potentials?${query}`)).data[0] ?? {}

  if (!potential) {
    notFound()
  }

  const breadcrumbs: BreadcrumbData[] = [
    {
      title: 'Beranda',
      isLast: false,
      url: '/'
    },
    {
      title: 'Potensi',
      isLast: false,
      url: '/potensi'
    },
    {
      title: potential.title,
      isLast: true,
      url: '#'
    }
  ]

  return (
    <div className="main-container md:!p-12 flex gap-8 flex-col xl:flex-row">
      <div className="space-y-4 w-full xl:max-w-screen-md">
        <header className="space-y-2 mx-auto max-w-screen-lg">
          <BreadcrumbCustom data={breadcrumbs} className="mb-4 " />

          <h1 className="text-2xl md:text-3xl font-black py-2">{potential.title}</h1>
          <div className="flex gap-4 items-center text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Pen className="w-4 h-4" />
              <p>Admin</p>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 " />
              <p>{baseConfig.helpers.formatDate(potential.publishedAt)}</p>
            </div>
          </div>
        </header>
        <div
          className="my-2 border-b border-gray-200
        ">
          <div className="rounded-xl overflow-hidden mb-4">
            {potential.thumbnail ? (
              <Image
                src={`${baseConfig.server.host}/${potential.thumbnail.url.slice(1)}`}
                width={500}
                height={500}
                title={potential.title}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: 'clamp(450px, 30vh, 550px)'
                }}
                alt={potential.title}
              />
            ) : (
              ''
            )}
          </div>
          {potential.thumbnail?.caption ? (
            <p className="pb-4 text-sm text-gray-600">{potential.thumbnail?.caption}</p>
          ) : (
            ''
          )}
        </div>
        <main>
          <BlocksView blocks={potential?.blocks as BlocksType[]} />
          <SharerSocials url={`${baseConfig.server.public}/${potential.slug}`} />
        </main>
      </div>
      <div className="w-full flex-[1]">
        <PostSideBar param={param[0]} />
      </div>
    </div>
  )
}
