import { Skeleton } from '@/components/ui/skeleton'
import { Potential } from '@/utils/types'
import Image from 'next/image'
import Link from 'next/link'
import NotFoundBox from '../not-found-box'

function GallerySkel() {
  return (
    <div className="flex gap-4 overflow-x-auto lg:grid lg:grid-cols-2 xl:grid-cols-3 scrollbar-hide">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton className="min-w-[80%] lg:w-full min-h-64 rounded-xl" key={i} />
      ))}
    </div>
  )
}

export default function PotentialList({ potential, isLoading }: { potential: Potential[]; isLoading: boolean }) {
  if (isLoading) return <GallerySkel />
  if (!potential.length) return <NotFoundBox text="Tidak ada data ditampilkan" />

  return (
    <div className="flex gap-4 overflow-x-auto lg:grid lg:grid-cols-2 xl:grid-cols-3 scrollbar-hidden">
      {potential.map((potential, i) => (
        <div className="min-w-[100%] lg:w-full rounded-xl overflow-hidden bg-white group text-white" key={i}>
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
