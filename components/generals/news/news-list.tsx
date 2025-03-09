import { News } from '@/utils/types'
import { Calendar, Eye } from 'lucide-react'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import NotFoundBox from '../not-found-box'
import { cn } from '@/lib/utils'

function NewsListSkel({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      className={cn({
        'flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 xl:grid-cols-3 scrollbar-hidden': isMobile,
        '': !isMobile
      })}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn({
            'min-w-[90%] sm:min-w-0 sm:w-full min-h-64 rounded-xl': isMobile,
            'w-full min-h-64': !isMobile
          })}
        />
      ))}
    </div>
  )
}

export default function NewsList({
  newsArr,
  isLoading,
  isMobile
}: {
  newsArr: News[]
  isLoading: boolean
  isMobile: boolean
}) {
  if (isLoading) return <NewsListSkel isMobile={isMobile} />

  if (!newsArr.length) return <NotFoundBox text="Tidak ada data ditampilkan" />

  return (
    <div
      className={cn({
        'flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 xl:grid-cols-3 scrollbar-hidden': isMobile,
        'grid gap-8 sm:grid-cols-2 xl:grid-cols-3': !isMobile
      })}>
      {newsArr.map((news, i) => (
        <div
          className={cn('', {
            'min-w-[90%] sm:min-w-0 rounded-xl border overflow-hidden group': isMobile,
            'rounded-xl border overflow-hidden group': !isMobile
          })}
          key={i}>
          <Link href={`/artikel/${news.slug}`}>
            <div className="max-h-52 overflow-hidden relative">
              {news.category && (
                <p className="absolute top-3 right-3 bg-primary-600 p-2 rounded-xl text-white uppercase tracking-widest text-sm">
                  {news.category}
                </p>
              )}
              <Image
                src={news.thumbnail}
                alt={news.title}
                width={500}
                height={500}
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
              <div className="absolute h-full w-full bg-primary-500 top-0 right-0 flex items-center justify-center bg-opacity-45 opacity-0 group-hover:opacity-100 transition-all">
                <Eye className="w-12 h-12 text-primary-800" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-extrabold mb-2 uppercase">{news.title}</h3>
              <p>{news.description}</p>
              <div className="flex items-center gap-2 mt-4 text-gray-500 text-sm font-thin">
                <Calendar className="w-4 h-4" />
                <p>{news.publishedAt}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
