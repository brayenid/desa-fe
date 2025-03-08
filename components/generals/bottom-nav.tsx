'use client'

import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { Facebook, Globe2Icon, House, Instagram, MailOpen, Phone, Twitter, Youtube } from 'lucide-react'
import Image from 'next/image'
import useSWR from 'swr'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { ReactNode } from 'react'
import { MdiWhatsapp } from '../ui/icons/whatsapp'

interface SocialsType {
  provider: string
  url: string
  icon: string | ReactNode
}

interface FetchedBottomNav {
  socials: SocialsType[]
  contacts: {
    name: string
    phone: string
  }[]
}

function Socials({ data }: { data: SocialsType }) {
  const challengeIcon = (icon: string): ReactNode => {
    if (icon === 'instagram') {
      return <Instagram className="w-4 h-4" />
    } else if (icon === 'facebook') {
      return <Facebook className="w-4 h-4" />
    } else if (icon === 'twitter') {
      return <Twitter className="w-4 h-4" />
    } else if (icon === 'whatsapp') {
      return <MdiWhatsapp className="w-4 h-4" />
    } else if (icon === 'youtube') {
      return <Youtube className="w-4 h-4" />
    }
    return <Globe2Icon className="w-4 h-4" />
  }

  const iconTemp = challengeIcon(data?.icon as string)

  return (
    <li className="">
      <a href={data.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:underline">
        {iconTemp} {data.provider}
      </a>
    </li>
  )
}

export default function BottomNav({ websiteInfo }: { websiteInfo: WebsiteInfo }) {
  const { data } = useSWR(
    `${baseConfig.server.host}/api/main-page?populate[0]=footer.contacts&populate[1]=footer.socials`,
    fetcher
  )

  const navLogo = websiteInfo?.logo?.url
    ? `${baseConfig.server.host}/${websiteInfo.logo.url.slice(1)}`
    : '/assets/knk.png'

  const footer: FetchedBottomNav = data?.data?.footer

  return (
    <div className="bg-gray-800 text-white border-t-8 border-primary-800">
      <div className="hidden lg:flex justify-between main-container flex-col md:flex-row gap-8 text-center md:text-left items-center md:items-start">
        <div className="flex items-center gap-4 self-center">
          <Image src={navLogo} width={60} height={60} alt="Logo" />
          <div className="">
            <h3>{websiteInfo.webName}</h3>
            <p>{websiteInfo.subdistrict}</p>
            <p>{websiteInfo.regency}</p>
          </div>
        </div>
        <div className="text-sm">
          <h3 className="font-bold mb-4">Sosial Media</h3>
          <ul className="space-y-2 w-full">
            {footer?.socials?.map((s, i) => (
              <Socials data={s} key={i} />
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <h3 className="font-bold mb-4">Kontak Desa</h3>
          <ul className="space-y-2 w-full">
            <li className="flex items-center gap-4">
              <Phone className="w-4 h-4" />
              {websiteInfo.phone}
            </li>
            <li className="flex items-center gap-4">
              <MailOpen className="w-4 h-4" />
              {websiteInfo.email}
            </li>
            <li className="flex items-center gap-4">
              <House className="w-4 h-4" />
              {websiteInfo.address}
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <h3 className="font-bold mb-4">Nomor Penting</h3>
          <ul className="space-y-2">
            {(footer?.contacts ?? []).map((contact, i) => (
              <li key={i}>
                - {contact.name} ({contact.phone})
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="main-container p-8 block lg:hidden">
        <div className="flex items-center justify-center gap-4 self-center mb-6">
          <Image src={navLogo} width={60} height={60} alt="Logo" />
          <div className="">
            <h3>{websiteInfo.webName}</h3>
            <p>{websiteInfo.subdistrict}</p>
            <p>{websiteInfo.regency}</p>
          </div>
        </div>
        {/* Mobile Mode */}
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Kontak Desa</AccordionTrigger>
            <AccordionContent>
              <div className="text-sm">
                <ul className="space-y-2 w-full">
                  <li className="flex items-center gap-4">
                    <Phone className="w-4 h-4" />
                    {websiteInfo.phone}
                  </li>
                  <li className="flex items-center gap-4">
                    <MailOpen className="w-4 h-4" />
                    {websiteInfo.email}
                  </li>
                  <li className="flex items-center gap-4">
                    <House className="w-4 h-4" />
                    {websiteInfo.address}
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Sosial Media</AccordionTrigger>
            <AccordionContent>
              <div className="text-sm">
                <ul className="space-y-2 w-full">
                  {footer?.socials?.map((s, i) => (
                    <Socials data={s} key={i} />
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Nomor Penting</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {(footer?.contacts ?? []).map((contact, i) => (
                  <li key={i}>
                    - {contact.name} ({contact.phone})
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
