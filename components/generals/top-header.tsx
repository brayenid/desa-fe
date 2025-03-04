import { WebsiteInfo } from '@/utils/types'
import { Mail } from 'lucide-react'

export default async function TopHeader({ websiteInfo }: { websiteInfo: WebsiteInfo }) {
  return (
    <div className="bg-sky-900 p-2 text-white font-thin hidden md:block">
      <div className="main-container !py-0 w-full text-sm flex md:items-center justify-between m-auto gap-5">
        <div>
          <p>Selamat datang di website {websiteInfo.webName}</p>
        </div>
        <div>
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 " /> {websiteInfo.email}
          </p>
        </div>
      </div>
    </div>
  )
}
