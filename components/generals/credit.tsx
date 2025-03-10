import { WebsiteInfo } from '@/utils/types'

export default async function Credit({ websiteInfo }: { websiteInfo: WebsiteInfo }) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="bg-gray-900 text-gray-300">
      <div className="!p-4 main-container text-center text-sm">
        © {currentYear} - {websiteInfo?.webName} - Powered by{' '}
        <a href="https://brayenluhat.netlify.app" target="_blank" rel="noopener noreferrer">
          KNK
        </a>
      </div>
    </div>
  )
}
