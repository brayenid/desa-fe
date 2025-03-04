'use client'

import type { Potential } from '@/utils/types'
import useSWR from 'swr'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import PotentialList from './potential/potential-list'
import LinkButton from '../ui/link-button'

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
      thumbnail: (pot?.thumbnail?.url).slice(1),
      slug: pot?.slug,
      publishedAt: pot?.publishedAt
    }
  })

  return (
    <div className="bg-[url(/assets/bg-sky-dark.svg)] bg-no-repeat bg-cover">
      <div className="main-container">
        <div className="mb-4 text-white">
          <h2 className="text-2xl font-bold tracking-widest uppercase">Potensi Desa</h2>
          <p>Kenali potensi desa</p>
        </div>
        <PotentialList potential={potentialMapped} isLoading={isLoading} />
        <div className="flex justify-center md:justify-end my-6">
          <LinkButton url="/potensi">Selengkapnya</LinkButton>
        </div>
      </div>
    </div>
  )
}
