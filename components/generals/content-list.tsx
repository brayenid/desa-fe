import { baseConfig } from '@/utils/config'
import Image from 'next/image'
import noImg from '@/public/assets/noimg.svg'
import Link from 'next/link'

interface FetchedData {
  title: string
  thumbnail: {
    url: string
  }
  publishedAt: string
  slug: string
  price?: number
}

export default function ContentList({ datas, prefixUrl }: { datas: FetchedData[]; prefixUrl?: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 mt-6">
      {datas.map((data, i) => (
        <div key={i}>
          <Link
            href={prefixUrl ? `${prefixUrl}/${data.slug}` : `/${data.slug}`}
            className="flex items-start gap-4 group rounded-xl">
            <div className="flex-[1] w-full">
              <Image
                src={data?.thumbnail?.url ? `${baseConfig.server.host}/${data.thumbnail.url.slice(1)}` : noImg}
                alt={data.title}
                width={200}
                height={80}
                style={{
                  height: 'clamp(100px, 110px, 200px)',
                  objectFit: 'cover',
                  width: 200
                }}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2 flex-[2]">
              <h3 className="font-bold group-hover:text-primary-500 transition-all">{data.title}</h3>
              <p className="text-sm">{baseConfig.helpers.formatDate(data.publishedAt)}</p>
              {data.price ? (
                <p className="text-sm font-bold pt-4">{baseConfig.helpers.currencyFormat(data.price)}</p>
              ) : (
                ''
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
