'use client'

import type { Staff } from '@/utils/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { useRef } from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import LinkButton from '../ui/link-button'
import useSWR from 'swr'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { Skeleton } from '../ui/skeleton'
import StaffCard from './staff/staff-card'

interface FetchedStaff {
  name: string
  role: string
  img: {
    url: string
  }
}

function StaffSkel() {
  return <Skeleton className="w-full min-h-64" />
}

export default function Staff() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null)
  const { data, isLoading } = useSWR(`${baseConfig.server.host}/api/sotks?populate[0]=img`, fetcher)

  const staffs = (data?.data as FetchedStaff[]) ?? []

  return (
    <div className="main-container">
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-widest uppercase ">SOTK</h2>
        <p>Struktur Organisasi dan Tata Kerja</p>
      </div>
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
        {isLoading ? (
          <StaffSkel />
        ) : (
          <>
            {staffs.map((staff, i) => (
              <SwiperSlide key={i}>
                <StaffCard name={staff.name} img={staff.img.url} role={staff.role} />
              </SwiperSlide>
            ))}
          </>
        )}
      </Swiper>
      <div className="flex gap-6 justify-center items-center md:justify-end p-3">
        <LinkButton url="/profil/sotk" className="bg-white border !text-gray-700 hover:!bg-gray-100">
          Selengkapnya
        </LinkButton>
      </div>
    </div>
  )
}
