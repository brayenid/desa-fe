/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { useRef } from 'react'
import useSWR from 'swr'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import LinkButton from '../ui/link-button'
import { Skeleton } from '../ui/skeleton'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import StaffCard from './staff/staff-card'
import NotFoundBox from './not-found-box'
import MainHeader from './main-header'

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
  const swiperRef = useRef<any>(null)
  const { data, isLoading } = useSWR(`${baseConfig.server.host}/api/sotks?populate[0]=img`, fetcher)

  const staffs = ((data?.data as FetchedStaff[]) ?? []).map((staff) => ({
    name: staff?.name ?? '',
    role: staff?.role ?? '',
    img: staff?.img?.url
  }))

  return (
    <div className="main-container">
      <MainHeader title="SOTK" description="Struktur Organisasi dan Tata Kerja" />
      {isLoading ? <StaffSkel /> : <StaffSlider staffs={staffs} swiperRef={swiperRef} />}
    </div>
  )
}

function StaffSlider({
  staffs,
  swiperRef
}: {
  staffs: { name: string; role: string; img: string }[]
  swiperRef: React.MutableRefObject<any>
}) {
  if (!staffs.length) return <NotFoundBox text="Tidak ada data ditampilkan" />
  return (
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
        {staffs.map((staff, i) => (
          <SwiperSlide key={i}>
            <StaffCard name={staff.name} img={staff.img} role={staff.role} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex gap-6 justify-center items-center md:justify-end p-3">
        <LinkButton url="/profil/sotk" className="bg-white border !text-gray-700 hover:!bg-gray-100">
          Selengkapnya
        </LinkButton>
      </div>
    </>
  )
}
