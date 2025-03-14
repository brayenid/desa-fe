'use client'

import type { News } from '@/utils/types'
import LinkButton from '../ui/link-button'
import NewsList from './news/news-list'
import useSWR from 'swr'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import MainHeader from './main-header'
import { ChevronRight } from 'lucide-react'

export interface FetchedNews {
  title: string
  thumbnail: {
    url: string
    caption: string
  }
  description: string
  publishedAt: string
  categories: {
    category: string
  }[]
  slug: string
  blocks?: []
}

export default function News() {
  const { data, isLoading } = useSWR(
    `${baseConfig.server.host}/api/articles?populate[0]=categories&populate[1]=thumbnail&sort[2]=publishedAt:desc`,
    fetcher
  )

  const mappedNews = ((data?.data as FetchedNews[]) ?? []).map((mappedData) => {
    return {
      title: mappedData?.title ?? '',
      thumbnail: mappedData?.thumbnail?.url
        ? `${baseConfig.server.host}/${mappedData?.thumbnail?.url.slice(1)}`
        : '/assets/noimg.svg',
      description: mappedData?.description ?? '',
      publishedAt: mappedData?.publishedAt ? baseConfig.helpers.formatDate(mappedData.publishedAt) : '',
      category: (mappedData?.categories[0]?.category as string | undefined) ?? '',
      slug: mappedData?.slug
    }
  })

  return (
    <div className="main-container relative">
      {mappedNews.length ? (
        <div className="h-full w-20 absolute right-0 top-0 z-40 flex items-center justify-center bg-gradient-to-r from-transparent to-white sm:hidden">
          <ChevronRight />
        </div>
      ) : (
        ''
      )}
      <MainHeader title="Artikel Desa" description="Dapat informasi aktual dari desa" />
      <NewsList newsArr={mappedNews} isLoading={isLoading} isMobile={true} />
      {mappedNews.length ? (
        <div className="flex justify-center md:justify-end my-6">
          <LinkButton url="/artikel">Selengkapnya</LinkButton>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
