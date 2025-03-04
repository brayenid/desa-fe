import { Shop } from '@/utils/types'

import { Skeleton } from '@/components/ui/skeleton'
import ShopCard from './shop-card'

function ShopSkel() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="w-full min-h-64" />
      ))}
    </>
  )
}

export default function ShopList({ shopsArr, isLoading }: { shopsArr: Shop[]; isLoading: boolean }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {isLoading ? (
        <ShopSkel />
      ) : (
        <>
          {shopsArr.map((shop, i) => (
            <div className="rounded-xl border overflow-hidden group" key={i}>
              <ShopCard shop={shop} />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
