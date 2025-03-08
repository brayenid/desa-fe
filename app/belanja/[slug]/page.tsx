import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { Calendar, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import qs from 'qs'
import { Metadata } from 'next'
import { PageParams, WebsiteInfo } from '@/utils/types'
import { generateMeta, MetaImage } from '@/utils/meta'
import SharerSocials from '@/components/generals/sharer'
import { FetchedShop } from '@/components/generals/shop'
import LinkButton from '@/components/ui/link-button'
import NotFoundBox from '@/components/generals/not-found-box'
import MasonryGridImage, { ImageType } from '@/components/generals/gallery/masonry/gallery-masonry'
import { ShopSideBar } from '@/components/generals/post-sidebar'
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

  const shop: FetchedShop = (await fetcher(`${baseConfig.server.host}/api/shops?${query}`)).data[0]

  return await generateMeta({
    title: shop?.title,
    description: shop.description ?? 'Belanja dari desa.',
    image: shop?.thumbnail as unknown as MetaImage,
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
      populate: ['thumbnail', 'blocks.images']
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const shop: FetchedShop = (await fetcher(`${baseConfig.server.host}/api/shops?${query}`)).data[0]
  if (!shop) {
    notFound()
  }

  const breadcrumbs: BreadcrumbData[] = [
    {
      title: 'Beranda',
      isLast: false,
      url: '/'
    },
    {
      title: 'Belanja',
      isLast: false,
      url: '/belanja'
    },
    {
      title: shop.title,
      isLast: true,
      url: '#'
    }
  ]

  return (
    <div className="main-container flex gap-8 flex-col xl:flex-row">
      <div className="space-y-4 w-full xl:max-w-screen-md">
        <header className="space-y-2 mx-auto max-w-screen-lg">
          <BreadcrumbCustom data={breadcrumbs} />
          <h1 className="text-2xl md:text-3xl font-black py-2">{shop.title}</h1>
          <div className="flex gap-4 items-center text-sm md:text-base">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <p>{shop.seller}</p>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 " />
              <p>{baseConfig.helpers.formatDate(shop.publishedAt)}</p>
            </div>
          </div>
        </header>
        <div
          className="my-2 
        ">
          <div className="rounded-xl overflow-hidden mb-4">
            {shop?.thumbnail ? (
              <Image
                src={`${baseConfig.server.host}/${shop.thumbnail.url.slice(1)}`}
                width={500}
                height={500}
                title={shop.title}
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: 'clamp(450px, 30vh, 550px)'
                }}
                alt={shop.title}
              />
            ) : (
              ''
            )}
          </div>
          {shop?.thumbnail?.caption ? (
            <p className="pb-4 text-sm text-gray-600 text-center">{shop.thumbnail?.caption}</p>
          ) : (
            ''
          )}
        </div>
        <main>
          <div className="relative pb-8">
            <header className="flex items-center justify-between gap-3 before:w-2 before:h-2 before:bg-primary-300 before:absolute before:left-0">
              <h3 className="tracking-widest uppercase font-bold pl-5">Deskripsi Produk</h3>
            </header>
            {shop.description ? (
              <p className="mt-4 leading-relaxed">{shop.description}</p>
            ) : (
              <NotFoundBox className="mt-4" text="Tidak ada deskripsi ditampilkan" />
            )}
          </div>
          <div className="relative">
            <header className="flex items-center justify-between gap-3 before:w-2 before:h-2 before:bg-rose-300 before:absolute before:left-0">
              <h3 className="tracking-widest uppercase font-bold pl-5">Foto Produk</h3>
            </header>
            {(shop?.blocks ?? [])?.length < 1 ? (
              <NotFoundBox className="mt-4" text="Tidak ada foto ditampilkan" />
            ) : (
              <MasonryGridImage className="mt-4" data={shop.blocks?.[0]?.images as unknown as ImageType[]} />
            )}
          </div>
          <SharerSocials url={`${baseConfig.server.public}/${shop.slug}`} />
        </main>
      </div>
      <div className="w-full flex-[1]">
        <div className="sticky top-24 space-y-6">
          <div className="flex flex-col gap-4 text-center p-4 border rounded-xl">
            <p className="text-3xl font-bold text-primary-600">{baseConfig.helpers.currencyFormat(shop.price)}</p>
            <LinkButton url={`https://wa.me/${shop.phone}?text=Halo,%20saya%20mau%20beli:%20${shop.title}`}>
              Hubungi Penjual
            </LinkButton>
          </div>
          <ShopSideBar param={param} />
        </div>
      </div>
    </div>
  )
}
