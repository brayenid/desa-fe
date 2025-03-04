import { BreadcrumbCustom, BreadcrumbData } from '@/components/generals/breadcrumb'
import { TagsIcon } from 'lucide-react'
import Link from 'next/link'

export default function Data() {
  const links: { label: string; url: string }[] = [
    {
      label: 'APBDes',
      url: '/data/anggaran'
    },
    {
      label: 'Penduduk',
      url: '/data/penduduk'
    },
    {
      label: 'IDM',
      url: '/data/idm'
    },
    {
      label: 'SGDs',
      url: '/data/sgds'
    }
  ]

  const breadcrumbs: BreadcrumbData[] = [
    {
      title: 'Beranda',
      isLast: false,
      url: '/'
    },
    {
      title: 'Data',
      isLast: true,
      url: '/data'
    }
  ]

  return (
    <div className="main-container">
      <BreadcrumbCustom data={breadcrumbs} className="mb-8" />

      <h1 className="text-2xl font-black tracking-widest uppercase w-full mb-8 text-center">Sajian Data</h1>
      <div className="grid gap-8 xl:grid-cols-2">
        {links.map((l, i) => (
          <Link href={l.url} key={i}>
            <div className="bg-primary-50 p-9 rounded-xl flex flex-col items-start gap-4 border  w-full hover:text-primary-700 relative overflow-hidden group">
              <TagsIcon />
              <h3 className="font-bold uppercase text-lg">{l.label}</h3>
              <div className="absolute w-20 rotate-12 h-[150%] bg-primary-700 -right-28 -top-4 group-hover:-translate-x-14 transition-all opacity-70"></div>
              <div className="absolute w-20 -rotate-12 h-[150%] bg-primary-700 -right-28 -top-4 group-hover:-translate-x-16 transition-all opacity-40"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
