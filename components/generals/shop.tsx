'use client'

import type { Shop } from '@/utils/types'
import LinkButton from '../ui/link-button'
import { baseConfig } from '@/utils/config'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetched-data'
import ShopList from './shop/shop-list'
import MainHeader from './main-header'

export interface FetchedShop {
  title: string
  description: string
  thumbnail: {
    url: string
    caption: string
  }
  price: number
  seller: string
  publishedAt: string
  phone: string
  slug: string
  blocks?: {
    images: []
  }[]
}

export default function Shop() {
  const { data, isLoading } = useSWR(
    `${baseConfig.server.host}/api/shops?populate[0]=thumbnail&sort[1]=publishedAt:desc`,
    fetcher
  )

  const shops = (data?.data as FetchedShop[]) ?? []

  const shopsMapped = shops.map((shop) => {
    return {
      title: shop?.title,
      description: shop?.description,
      thumbnail: shop?.thumbnail?.url
        ? `${baseConfig.server.host}/${shop?.thumbnail?.url.slice(1)}`
        : '/assets/noimg.svg',
      price: shop?.price,
      seller: shop?.seller,
      phone: shop?.phone,
      slug: shop?.slug
    }
  })

  return (
    <div className="main-container">
      <MainHeader title="Belanja Dari Desa" description="Beli produk lokal desa" />
      <ShopList shopsArr={shopsMapped} isLoading={isLoading} />
      {shopsMapped.length ? (
        <div className="flex justify-end my-6">
          <LinkButton url="/belanja">Selengkapnya</LinkButton>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
