import { News } from '@/utils/types'
import { Calendar, Eye } from 'lucide-react'
import Image from 'next/image'
import noImg from '@/public/assets/noimg.png'
import { baseConfig } from '@/utils/config'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

function NewsListSkel() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="w-full min-h-64" />
      ))}
    </>
  )
}

export default function NewsList({ newsArr, isLoading }: { newsArr: News[]; isLoading: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {isLoading ? (
        <NewsListSkel />
      ) : (
        <>
          {newsArr.map((news, i) => (
            <div className="rounded-xl border overflow-hidden group" key={i}>
              <Link href={`/artikel/${news.slug}`}>
                <div className="max-h-60 overflow-hidden relative">
                  {news.category ? (
                    <p className="absolute top-3 right-3 bg-primary-600 p-2 rounded-xl text-white uppercase tracking-widest text-sm">
                      {news.category}
                    </p>
                  ) : (
                    ''
                  )}
                  <Image
                    src={news.thumbnail ? `${baseConfig.server.host}/${news.thumbnail}` : noImg.src}
                    alt={news.title}
                    width={500}
                    height={500}
                    style={{
                      width: '100%',
                      height: 'auto'
                    }}></Image>
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
        </>
      )}
    </div>
  )
}
