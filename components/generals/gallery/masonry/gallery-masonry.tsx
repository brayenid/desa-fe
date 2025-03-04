'use client'

import * as React from 'react'
import useMasonry from '.'
import Image from 'next/image'
import { baseConfig } from '@/utils/config'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { cn } from '@/lib/utils'

export interface ImageType {
  name: string
  url: string
}

export default function MasonryGridImage({ data, className }: { data: ImageType[]; className?: string }) {
  const masonryContainer = useMasonry()

  return (
    <div ref={masonryContainer} className={cn('grid items-start gap-4 sm:grid-cols-3 md:gap-6', className)}>
      {data.map((img, i) => (
        <Zoom key={i}>
          <Image
            src={`${baseConfig.server.host}/${img?.url.slice(1)}`}
            alt={img.name}
            height={200}
            width={200}
            style={{
              width: '100%'
            }}
            className="rounded-xl"
          />
        </Zoom>
      ))}
    </div>
  )
}
