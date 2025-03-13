'use client'
import Image from 'next/image'
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer'
import { baseConfig } from '@/utils/config'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Autoplay } from 'swiper/modules'
import { cn } from '@/lib/utils'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

type Props = {
  blocks: BlocksType[]
  className?: string
}

export interface BlocksType {
  __component: string
  id: number
  richText: BlocksContent[]
  images: BlockImages[]
  ckmd: string
}

interface BlockImages {
  url?: string
}

function BlockImageView({ blocks }: { blocks: BlockImages[] }) {
  return (
    <div className="w-full">
      {blocks.length > 1 ? (
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          modules={[Autoplay]}
          autoplay={{
            delay: 3000
          }}
          className="rounded-xl overflow-hidden">
          {blocks.map((block, i) => (
            <SwiperSlide key={i}>
              <div className="max-h-[550px]">
                <Zoom>
                  <Image
                    key={i}
                    src={`${baseConfig.server.host}/${block?.url?.slice(1) ?? ''}`}
                    width={500}
                    height={500}
                    alt="test"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: 400
                    }}
                  />
                </Zoom>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, i) => (
            <div className="rounded-xl overflow-hidden" key={i}>
              <Zoom>
                <Image
                  src={`${baseConfig.server.host}/${block?.url?.slice(1) ?? ''}`}
                  width={500}
                  height={500}
                  alt="test"
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: 550
                  }}
                />
              </Zoom>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BlockItem({ block }: { block: BlocksType }) {
  if ('blocks.image' === block.__component && block.images) {
    return BlockImageView({ blocks: block.images })
  } else if ('blocks.rich-text' === block.__component) {
    return <BlocksRenderer content={block.richText as unknown as BlocksContent} />
  } else if ('blocks.seo' === block.__component) {
    return <span></span>
  } else if ('blocks.ckeditor' === block.__component) {
    return <div dangerouslySetInnerHTML={{ __html: block.ckmd }} />
  }

  return ''
}

export default function BlocksView({ blocks, className }: Props) {
  return (
    <div className={cn('markdown', className)}>
      {blocks?.map((block, index) => (
        <div key={index} className="mb-4">
          <BlockItem block={block} />
        </div>
      ))}
    </div>
  )
}
