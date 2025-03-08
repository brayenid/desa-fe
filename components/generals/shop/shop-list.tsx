import { Shop } from '@/utils/types'
import { Skeleton } from '@/components/ui/skeleton'
import ShopCard from './shop-card'
import NotFoundBox from '../not-found-box'

function ShopSkel() {
  return (
    <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 scrollbar-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="min-w-[80%] sm:w-full min-h-64 rounded-xl" />
      ))}
    </div>
  )
}

export default function ShopList({ shopsArr, isLoading }: { shopsArr: Shop[]; isLoading: boolean }) {
  if (isLoading) return <ShopSkel />
  if (!shopsArr.length) return <NotFoundBox text="Tidak ada ditampilkan" />

  return (
    <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 scrollbar-hidden">
      {shopsArr.map((shop, i) => (
        <div className="min-w-[90%] sm:w-full rounded-xl border overflow-hidden group" key={i}>
          <ShopCard shop={shop} />
        </div>
      ))}
    </div>
  )
}
