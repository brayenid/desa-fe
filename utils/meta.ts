import { Metadata } from 'next'
import { OpenGraphType } from 'next/dist/lib/metadata/types/opengraph-types'
import { headers } from 'next/headers'
import { baseConfig } from './config'
import noImg from '@/public/assets/noimg.png'

export type MetaImage = {
  id: string
  url: string
  width: number
  height: number
  title: string
  description: string
}

export type Meta = {
  title?: string | null
  description?: string | null
  image?: MetaImage | null
  type: OpenGraphType
  websiteName: string
}

export async function generateMeta({ title, description, image, type, websiteName }: Meta): Promise<Metadata> {
  const images = []
  const header = await headers()
  const url = header.get('x-current-url') as string
  // const origin = baseConfig.server.public

  if (image) {
    images.push({
      url: `${baseConfig.server.host}/${image.url.slice(1)}`,
      width: image.width ?? 64,
      height: image.height ?? 64,
      alt: title ?? ''
    })
  } else {
    images.push({
      url: `${baseConfig.server.public}/${noImg.src.slice(1)}`,
      width: 64,
      height: 64,
      alt: 'Website Desa'
    })
  }

  title = title ?? 'Website Desa'
  description = description ?? 'Website Desa'

  const metadata: Metadata = {
    metadataBase: new URL(baseConfig.server.public),
    title: `${title} - ${websiteName}`,
    description,
    openGraph: {
      title,
      description,
      type,
      images,
      url,
      countryName: 'indonesia',
      locale: 'id',
      siteName: websiteName
    },
    twitter: {
      images
    }
  }

  return metadata
}
