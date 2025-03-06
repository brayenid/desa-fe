'use client'

import type { News } from '@/utils/types'
import LinkButton from '../ui/link-button'
import NewsList from './news/news-list'
import useSWR from 'swr'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'

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
      thumbnail: ((mappedData?.thumbnail?.url as string) ?? '').slice(1),
      description: mappedData?.description ?? '',
      publishedAt: mappedData?.publishedAt ? baseConfig.helpers.formatDate(mappedData.publishedAt) : '',
      category: (mappedData?.categories[0]?.category as string | undefined) ?? '',
      slug: mappedData?.slug
    }
  })

  return (
    <div className="main-container">
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-widest uppercase">Artikel Desa</h2>
        <p>Dapat informasi aktual dari desa</p>
      </div>
      <NewsList newsArr={mappedNews} isLoading={isLoading} />
      <div className="flex justify-center md:justify-end my-6">
        <LinkButton url="/artikel">Selengkapnya</LinkButton>
      </div>
    </div>
  )
}
