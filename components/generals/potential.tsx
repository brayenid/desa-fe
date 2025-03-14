'use client'

import type { Potential } from '@/utils/types'
import useSWR from 'swr'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import PotentialList from './potential/potential-list'
import LinkButton from '../ui/link-button'
import MainHeader from './main-header'
import { ChevronRight } from 'lucide-react'

export interface FetchedPotential {
  title: string
  thumbnail: {
    url: string
    caption: string
  }
  slug: string
  publishedAt: string
  blocks: []
}

export default function Potential() {
  const { data, isLoading } = useSWR(`${baseConfig.server.host}/api/potentials?populate[0]=thumbnail`, fetcher)

  const potentialData = data?.data as FetchedPotential[]

  const potentialMapped = (potentialData ?? []).map((pot) => {
    return {
      title: pot?.title,
      thumbnail: pot?.thumbnail?.url
        ? `${baseConfig.server.host}/${pot?.thumbnail?.url.slice(1)}`
        : '/assets/noimg.svg',
      slug: pot?.slug,
      publishedAt: pot?.publishedAt
    }
  })

  return (
    <div className="bg-[url(/assets/bg-sky-dark.svg)] bg-no-repeat bg-cover">
      <div className="main-container relative">
        {potentialMapped.length ? (
          <div className="h-full w-12 absolute right-0 top-0 z-40 flex items-center justify-center bg-gradient-to-r from-transparent to-primary-800 sm:hidden">
            <ChevronRight className="text-white" />
          </div>
        ) : (
          ''
        )}
        <MainHeader title="Potensi Desa" description="Kenali potensi desa" className="text-white" />
        <PotentialList potential={potentialMapped} isLoading={isLoading} isMobile />
        {potentialMapped.length ? (
          <div className="flex justify-center md:justify-end my-6">
            <LinkButton url="/potensi">Selengkapnya</LinkButton>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
