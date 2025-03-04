import { baseConfig } from '@/utils/config'
import Image from 'next/image'

export interface FetchedSOTK {
  name: string
  role: string
  level: string
  img: {
    url: string
  }
  publishedAt: string
}

export default function StaffCard({ name, img, role }: { name: string; img: string; role: string }) {
  return (
    <div>
      <div className="overflow-hidden relative rounded-xl max-h-96">
        <Image
          src={`${baseConfig.server.host}/${img.slice(1)}`}
          width={500}
          height={500}
          alt={name}
          style={{
            objectFit: 'cover',
            width: 500,
            height: 400
          }}></Image>
      </div>
      <div className="p-2">
        <h3 className="uppercase font-bold mb-1">{name}</h3>
        <p className="text-sm text-gray-500 font-thin">{role}</p>
      </div>
    </div>
  )
}
