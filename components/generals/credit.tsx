import { WebsiteInfo } from '@/utils/types'

export default async function Credit({ websiteInfo }: { websiteInfo: WebsiteInfo }) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="bg-gray-900 text-white">
      <div className="!p-2 main-container text-center">
        © {currentYear} - {websiteInfo?.webName}
      </div>
    </div>
  )
}
