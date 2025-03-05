import { WebsiteInfo } from '@/utils/types'
import LinkButton from '../ui/link-button'
import { Send } from 'lucide-react'
import { MdiWhatsapp } from '../ui/icons/whatsapp'

export default function CTA({ websiteInfo }: { websiteInfo: WebsiteInfo }) {
  return (
    <div className="bg-[url(/assets/bg-skyblue-send.svg)] bg-cover bg-no-repeat py-7">
      <div className="main-container text-center">
        <header className="py-7">
          <h2 className="uppercase text-3xl font-bold tracking-widest w-full">
            Lebih Dekat Dengan <span className="text-primary-600">{websiteInfo.webName}</span>
          </h2>
          <p className="my-4 max-w-[500px] mx-auto">
            Kirimkan pesan, saran, permintaan data, dan sebagainya untuk dapat menghubungkan anda dan desa secara
            langsung.
          </p>
        </header>
        <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-center">
          <LinkButton url="/saran" className="flex items-center gap-2">
            <Send /> Kirim Pesan
          </LinkButton>
          {websiteInfo.phone ? (
            <a href={`https://wa.me/62${websiteInfo.phone}`} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-center gap-2 p-2 px-2 rounded overflow-hidden bg-[#25d366] text-white hover:bg-[#1fb155] transition-all uppercase">
                <MdiWhatsapp className="w-6 h-6" /> Hubungi Via WA
              </div>
            </a>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}
