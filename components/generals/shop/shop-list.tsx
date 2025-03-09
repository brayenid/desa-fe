import { Shop } from '@/utils/types'
import { Skeleton } from '@/components/ui/skeleton'
import ShopCard from './shop-card'
import NotFoundBox from '../not-found-box'
import { cn } from '@/lib/utils'

function ShopSkel({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      className={cn({
        'flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 scrollbar-hidden': isMobile,
        '': !isMobile
      })}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn({
            'min-w-[80%] sm:w-full min-h-64 rounded-xl': isMobile,
            'w-full min-h-64': !isMobile
          })}
        />
      ))}
    </div>
  )
}

export default function ShopList({
  shopsArr,
  isLoading,
  isMobile
}: {
  shopsArr: Shop[]
  isLoading: boolean
  isMobile: boolean
}) {
  if (isLoading) return <ShopSkel isMobile={isMobile} />
  if (!shopsArr.length) return <NotFoundBox text="Tidak ada ditampilkan" />

  return (
    <div
      className={cn({
        'flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 scrollbar-hidden': isMobile,
        'grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4': !isMobile
      })}>
      {shopsArr.map((shop, i) => (
        <div
          className={cn({
            'min-w-[90%] sm:w-full rounded-xl border overflow-hidden group': isMobile,
            'rounded-xl border overflow-hidden group': !isMobile
          })}
          key={i}>
          <ShopCard shop={shop} />
        </div>
      ))}
    </div>
  )
}
