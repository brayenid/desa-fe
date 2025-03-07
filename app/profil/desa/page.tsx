import HeaderStyled from '@/components/ui/header-styled'
import LinkButton from '@/components/ui/link-button'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { BlocksRenderer } from '@strapi/blocks-react-renderer'
import { Metadata } from 'next'
import Image from 'next/image'
import qs from 'qs'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  // FIX LATER
  const websiteInfo: WebsiteInfo = (await fetcher(`${baseConfig.server.host}/api/organization`)).data ?? []

  return {
    title: `Profil - ${websiteInfo.webName}`
  }
}

export default async function Profile() {
  const query = qs.stringify({
    populate: ['mission', 'logo', 'profileBg', 'chiefImg']
  })
  const data: WebsiteInfo = (await fetcher(`${baseConfig.server.host}/api/organization?${query}`)).data
  const bg = `${baseConfig.server.host}/${data.profileBg?.url.slice(1)}`
  const logo = data?.logo?.url ? `${baseConfig.server.host}/${data?.logo?.url.slice(1)}` : '/assets/knk.png'

  return (
    <div>
      {data.profileBg?.url ? (
        <Image
          src={bg}
          width={500}
          height={500}
          alt="bg"
          style={{
            objectFit: 'cover',
            width: '100%',
            height: 400
          }}
        />
      ) : (
        ''
      )}
      <div className="main-container">
        <header className="text-center">
          <h1 className="w-full text-3xl uppercase font-bold">
            Profil Desa <span className="text-primary-600">{data.webName}</span>
          </h1>
          <p>Kenali desa lebih dekat</p>
        </header>
        <main className="mt-16 flex gap-12 flex-col lg:flex-row">
          <div className="flex-[2] relative order-2 lg:order-1">
            <HeaderStyled className="text-xl before:!bg-emerald-500">Selayang Pandang</HeaderStyled>
            <div className="my-4 leading-loose text-lg">
              <BlocksRenderer content={data.blocks} />
            </div>
          </div>
          <aside className="flex-[1] order-1 lg:order-2">
            <div className="sticky top-20 space-y-7">
              <div className="space-y-12 rounded-xl border overflow-hidden">
                <div className="flex justify-center bg-gray-100 p-2 py-4 bg-[url(/assets/bg-dark.svg)] bg-cover">
                  <Image src={logo} width={100} height={100} alt={data.webName} />
                </div>
                <div className="p-4 space-y-7 !mt-0">
                  <div className="relative">
                    <HeaderStyled className="text-xl mb-2">Visi</HeaderStyled>
                    <p className="ps-5 text-lg">{data?.vision ? data.vision : '-'}</p>
                  </div>
                  <div className="relative">
                    <HeaderStyled className="text-xl mb-2 before:bg-rose-400">Misi</HeaderStyled>
                    <ol className="list-decimal list-inside ps-5 space-y-2 text-gray-800 text-lg">
                      {data?.mission?.length ? (
                        <>
                          {data.mission.map((m, i) => (
                            <li key={i} className="">
                              {m.mission}
                            </li>
                          ))}
                        </>
                      ) : (
                        '-'
                      )}
                    </ol>
                  </div>
                </div>
              </div>
              <div>
                <LinkButton url="/profil/sotk" className="block text-center bg-primary-700 hover:bg-primary-800">
                  Lihat SOTK
                </LinkButton>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}
