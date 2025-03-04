'use client'

import type { Gallery } from '@/utils/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { useRef } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import LinkButton from '../ui/link-button'
import useSWR from 'swr'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { Skeleton } from '../ui/skeleton'
import GalleryCardSwiper from './gallery/gallery-card-swiper'
import qs from 'qs'

export interface FetchedGallery {
  title: string
  thumbnail: {
    url: string
    caption: string
  }
  publishedAt: string
  categories: {
    category: string
  }[]
  slug: string
  blocks?: {
    images: []
  }[]
}

function GallerySkel() {
  return <Skeleton className="w-full min-h-64" />
}

export default function Gallery() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null)

  const query = qs.stringify(
    {
      populate: ['categories', 'thumbnail']
    },
    { encodeValuesOnly: true } // Menghindari encoding pada tanda []
  )

  const { data, isLoading } = useSWR(`${baseConfig.server.host}/api/galleries?${query}`, fetcher)

  const mappedGallery = ((data?.data as FetchedGallery[]) ?? []).map((mappedData) => {
    return {
      title: mappedData?.title ?? '',
      thumbnail: ((mappedData?.thumbnail?.url as string) ?? '').slice(1),
      publishedAt: mappedData?.publishedAt ? baseConfig.helpers.formatDate(mappedData.publishedAt) : '',
      category: (mappedData?.categories[0]?.category as string | undefined) ?? '',
      slug: mappedData?.slug
    }
  })

  return (
    <div className="bg-gray-50">
      <div className="main-container">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-widest uppercase ">Galeri</h2>
          <p>Desa dalam visual</p>
        </div>
        {isLoading ? (
          <GallerySkel />
        ) : (
          <>
            <Swiper
              spaceBetween={20}
              slidesPerView={4}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Navigation, Autoplay]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false
              }}
              loop={true}
              breakpoints={{
                320: {
                  slidesPerView: 1
                },
                580: {
                  slidesPerView: 2,
                  spaceBetween: 30
                },
                800: {
                  slidesPerView: 4
                }
              }}>
              {mappedGallery.map((gallery, i) => (
                <SwiperSlide key={i}>
                  <GalleryCardSwiper gallery={gallery} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="flex gap-6 justify-center items-center md:justify-end p-3">
              <button
                className="rounded-full p-2 border active:border-gray-100"
                onClick={() => {
                  swiperRef.current?.slidePrev()
                }}>
                <ChevronLeft />
              </button>
              <button
                className="rounded-full p-2 border active:border-gray-100"
                onClick={() => {
                  swiperRef.current?.slideNext()
                }}>
                <ChevronRight />
              </button>
              <LinkButton url="/galeri" className="bg-white border !text-gray-700 hover:!bg-gray-100 !rounded-full">
                <Maximize2 />
              </LinkButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
