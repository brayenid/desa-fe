import { Skeleton } from '@/components/ui/skeleton'
import GalleryCardSwiper from './gallery-card-swiper'
import { Gallery } from '@/utils/types'
import NotFoundBox from '../not-found-box'

function GalleryListSkel() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="w-full min-h-64" />
      ))}
    </>
  )
}

export default function GalleryList({ galleryArr, isLoading }: { galleryArr: Gallery[]; isLoading: boolean }) {
  if (isLoading) return <GalleryListSkel />
  if (!galleryArr.length) return <NotFoundBox text="Tidak ada data ditampilkan" />

  return (
    <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {galleryArr.map((gallery, i) => (
        <div className="group" key={i}>
          <GalleryCardSwiper gallery={gallery} />
        </div>
      ))}
    </div>
  )
}
