import { Skeleton } from '@/components/ui/skeleton'
import { Potential } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'
import NotFoundBox from '../not-found-box'
import { cn } from '@/lib/utils'

function GallerySkel({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      className={cn({
        'flex gap-4 overflow-x-auto lg:grid lg:grid-cols-2 xl:grid-cols-3 scrollbar-hide': isMobile,
        '': !isMobile
      })}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton
          className={cn({
            'min-w-[80%] lg:w-full min-h-64 rounded-xl': isMobile,
            'w-full min-h-64': !isMobile
          })}
          key={i}
        />
      ))}
    </div>
  )
}

export default function PotentialList({
  potential,
  isLoading,
  isMobile
}: {
  potential: Potential[]
  isLoading: boolean
  isMobile: boolean
}) {
  if (isLoading) return <GallerySkel isMobile={isMobile} />
  if (!potential.length) return <NotFoundBox text="Tidak ada data ditampilkan" />

  return (
    <div
      className={cn({
        'flex gap-4 overflow-x-auto sm:grid md:grid-cols-2 xl:grid-cols-3 scrollbar-hidden': isMobile,
        'grid gap-8 lg:grid-cols-2 xl:grid-cols-3': !isMobile
      })}>
      {potential.map((potential, i) => (
        <div
          className={cn('', {
            'min-w-[90%] sm:min-w-0 rounded-xl overflow-hidden group': isMobile,
            'rounded-xl overflow-hidden group': !isMobile
          })}
          key={i}>
          <Link href={`/potensi/${potential.slug}`}>
            <div className="max-h-60 overflow-hidden relative">
              <Image
                src={potential.thumbnail}
                alt={potential.title}
                width={500}
                height={500}
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
              <div className="absolute top-0 h-full w-full flex items-center justify-center">
                <h3 className="font-bold mb-2 text-center uppercase tracking-widest w-full bg-gray-100 bg-opacity-80 p-2 text-gray-600 text-lg transition-all group-hover:opacity-0">
                  {potential.title}
                </h3>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
