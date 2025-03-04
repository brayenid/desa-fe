'use client'

import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { TagsIcon } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { Skeleton } from '../ui/skeleton'
import { WebsiteInfo } from '@/utils/types'

interface BigCategory {
  label: string
  url: string
}

function BigCategorySkel() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="p-12 font-bold uppercase text-lg text-transparent">
          Loading
        </Skeleton>
      ))}
    </>
  )
}

export default function BigCategory({ websiteInfo }: { websiteInfo: WebsiteInfo }) {
  const { data, isLoading } = useSWR(`${baseConfig.server.host}/api/main-page?populate[0]=bigCategory`, fetcher)

  const bigCategory = (data?.data?.bigCategory as BigCategory[]) ?? []

  return (
    <div
      className={`bg-[url(/assets/bg-dark.svg)] bg-no-repeat bg-cover py-8 ${baseConfig.style.font.poppins.className} p-8`}>
      <div className="main-container">
        <div className="text-center p-4 text-white">
          <h2
            className="w-full text-center uppercase tracking-widest text-2xl font-bold
      ">
            Jelajahi Desa
          </h2>
          <p className="font-thin tracking-wide text-lg">Eksplorasi informasi mengenai desa {websiteInfo.webName}</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <BigCategorySkel />
          ) : (
            <>
              {bigCategory.map((data, i) => (
                <Link href={data.url} key={i}>
                  <div className="bg-white p-9 rounded-xl flex flex-col items-start gap-4 shadow  w-full hover:text-primary-700 relative overflow-hidden group">
                    <TagsIcon />
                    <h3 className="font-bold uppercase text-lg">{data.label}</h3>
                    <div className="absolute w-20 rotate-12 h-[150%] bg-primary-700 -right-24 -top-4 group-hover:-translate-x-14 transition-all opacity-70"></div>
                    <div className="absolute w-20 -rotate-12 h-[150%] bg-primary-700 -right-24 -top-4 group-hover:-translate-x-16 transition-all opacity-40"></div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
