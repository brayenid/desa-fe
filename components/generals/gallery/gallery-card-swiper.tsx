import Image from 'next/image'
import { baseConfig } from '@/utils/config'
import { Gallery } from '@/utils/types'
import Link from 'next/link'

export default function GalleryCardSwiper({ gallery }: { gallery: Gallery }) {
  return (
    <>
      <Link href={`/galeri/${gallery.slug}`}>
        <div className="overflow-hidden relative rounded-xl">
          <Image
            src={`${gallery.thumbnail}`}
            width={500}
            height={500}
            style={{
              objectFit: 'cover',
              width: 500,
              height: 250
            }}
            alt={gallery.title}></Image>
        </div>
        <div className="p-2">
          <h3 className="uppercase font-bold mb-1">{gallery.title}</h3>
          <p className="text-xs text-gray-500 font-thin">{baseConfig.helpers.formatDate(gallery.publishedAt)}</p>
        </div>
      </Link>
    </>
  )
}
