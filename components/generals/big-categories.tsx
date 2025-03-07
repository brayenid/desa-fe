'use client'

import { baseConfig } from '@/utils/config'
import {
  ChartAreaIcon,
  File,
  GalleryHorizontalEndIcon,
  HomeIcon,
  MessageCircle,
  Newspaper,
  ShoppingBagIcon
} from 'lucide-react'
import Link from 'next/link'
import { WebsiteInfo } from '@/utils/types'
import { ReactNode } from 'react'
import MainHeader from './main-header'

interface BigCategory {
  label: string
  url: string
  icon: ReactNode
}

export default function BigCategory({ websiteInfo }: { websiteInfo: WebsiteInfo }) {
  const bigCategoryArr: BigCategory[] = [
    {
      label: 'Profil',
      url: '/profil/desa',
      icon: <HomeIcon className="w-4 h-4 md:w-6 md:h-6" />
    },
    {
      label: 'Data',
      url: '/data',
      icon: <ChartAreaIcon className="w-4 h-4 md:w-6 md:h-6" />
    },
    {
      label: 'PPID',
      url: '/ppid',
      icon: <File className="w-4 h-4 md:w-6 md:h-6" />
    },
    {
      label: 'Artikel',
      url: '/artikel',
      icon: <Newspaper className="w-4 h-4 md:w-6 md:h-6" />
    },
    {
      label: 'Belanja',
      url: '/belanja',
      icon: <ShoppingBagIcon className="w-4 h-4 md:w-6 md:h-6" />
    },
    {
      label: 'Galeri',
      url: '/galeri',
      icon: <GalleryHorizontalEndIcon className="w-4 h-4 md:w-6 md:h-6" />
    },
    {
      label: 'Saran',
      url: '/saran',
      icon: <MessageCircle className="w-4 h-4 md:w-6 md:h-6" />
    }
  ]

  return (
    <div
      className={`bg-[url(/assets/bg-dark.svg)] bg-no-repeat bg-cover py-8 ${baseConfig.style.font.poppins.className} p-8`}>
      <div className="main-container !p-0">
        <MainHeader
          title="Jelajahi Desa"
          description={`Eksplorasi informasi mengenai desa ${websiteInfo.webName}`}
          className="text-white text-center"
        />
        <div className="grid gap-4 text-sm grid-cols-[repeat(auto-fit,minmax(80px,1fr))] grid-auto-flow-dense my-4">
          {bigCategoryArr.map((data, i) => (
            <Link href={data.url} key={i}>
              <div className="bg-white p-2 md:p-4 rounded-xl flex flex-col items-center gap-2 shadow  w-full hover:text-primary-700 relative overflow-hidden group">
                <div className="group-hover:scale-110">{data.icon}</div>
                <h3 className="text-center">{data.label}</h3>
                <div className="absolute w-20 rotate-12 h-[150%] bg-primary-700 -right-24 -top-4 group-hover:-translate-x-10 transition-all opacity-70"></div>
                <div className="absolute w-20 -rotate-12 h-[150%] bg-primary-700 -right-24 -top-4 group-hover:-translate-x-10 transition-all opacity-40"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
