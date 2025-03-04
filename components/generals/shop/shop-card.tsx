import Image from 'next/image'
import { baseConfig } from '@/utils/config'
import { Shop } from '@/utils/types'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/belanja/${shop.slug}`}>
      <div className="max-h-60 overflow-hidden relative">
        <p className="absolute top-3 right-3 bg-primary-600 p-2 rounded-xl text-white uppercase tracking-widest text-sm">
          {baseConfig.helpers.currencyFormat(shop.price)}
        </p>
        <Image
          src={`${baseConfig.server.host}/${shop.thumbnail}`}
          alt={shop.title}
          width={500}
          height={500}
          style={{
            objectFit: 'cover',
            width: 500,
            height: 300
          }}></Image>
        <div className="absolute h-full w-full bg-primary-500 top-0 right-0 flex items-center justify-center bg-opacity-45 opacity-0 group-hover:opacity-100 transition-all">
          <ShoppingBag className="w-12 h-12 text-primary-800" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-extrabold mb-2 uppercase">
          {shop.title} - <span className="text-primary-600">{shop.seller}</span>
        </h3>
      </div>
    </Link>
  )
}
