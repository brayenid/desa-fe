'use client'

import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { House, MailOpen, Phone } from 'lucide-react'
import Image from 'next/image'
import useSWR from 'swr'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

interface FetchedBottomNav {
  socials: {
    provider: string
    url: string
    icon: string
  }[]
  contacts: {
    name: string
    phone: string
  }[]
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
                {contact.name} - {contact.phone}
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
        <Accordion type="single" collapsible>
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
            <AccordionTrigger>Nomor Penting</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {(footer?.contacts ?? []).map((contact, i) => (
                  <li key={i}>
                    {contact.name} - {contact.phone}
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
