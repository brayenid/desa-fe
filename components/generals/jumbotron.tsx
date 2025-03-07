'use client'

import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import Image from 'next/image'
import useSWR from 'swr'
import { Skeleton } from '../ui/skeleton'
import { WebsiteInfo } from '@/utils/types'

function JumbotronSkel() {
  return (
    <div className="flex justify-center flex-col md:flex-row gap-8">
      <div className="flex-1">
        <Skeleton className="w-full h-96" />
      </div>
      <div className="space-y-4 flex-1">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-6 w-full max-w-20" />
      </div>
    </div>
  )
}

export default function Jumbotron({ websiteInfo }: { websiteInfo: WebsiteInfo }) {
  const { data, isLoading } = useSWR(
    `${baseConfig.server.host}/api/main-page?populate[0]=jumbotron.jumbotron.bigImage`,
    fetcher
  )
  const jumbotron = data?.data?.jumbotron?.jumbotron
  const jumbotronImg = jumbotron?.bigImage?.url
    ? `${baseConfig.server.host}/${jumbotron?.bigImage?.url.slice(1)}`
    : '/assets/noimg.svg'

  return (
    <div className="main-container">
      {isLoading ? (
        <JumbotronSkel />
      ) : (
        <div className={`flex justify-center flex-col lg:flex-row gap-8 ${baseConfig.style.font.poppins.className}`}>
          <div className="flex-1">
            <Image
              src={jumbotronImg}
              width={600}
              height={600}
              className="rounded-xl"
              style={{
                width: '100%'
              }}
              alt="Jumbotron"></Image>
          </div>
          <div className="flex-1">
            <h2 className="font-extrabold text-xl md:text-2xl uppercase mb-4">{jumbotron?.title}</h2>
            <p className="text-base md:text-lg font-thin tracking-widest">{jumbotron?.description}</p>
            <p className="text-base md:text-lg tracking-widest mt-6 font-bold">
              {websiteInfo.chief} - <span className="text-primary-600">Kepala Desa</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
