'use client'

import { ChartAreaIcon, HomeIcon, Newspaper, ShoppingBagIcon } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface FloatingMenuType {
  label: string
  icon: ReactNode
  url: string
}

function FloatingMenuCard({ label, icon, url }: FloatingMenuType) {
  const pathname = usePathname()
  const isActive = pathname === url || pathname.startsWith(url + '/')

  return (
    <li>
      <Link href={url} className={`p-2 block ${isActive ? 'text-primary-600' : 'text-gray-700'}`}>
        <div className="flex flex-col items-center">
          <div>{icon}</div>
          <p className="text-xs">{label}</p>
        </div>
      </Link>
    </li>
  )
}

export default function FloatingMenu() {
  const menus: FloatingMenuType[] = [
    { label: 'Beranda', url: '/', icon: <HomeIcon className="w-4 h-4" /> },
    { label: 'Artikel', url: '/artikel', icon: <Newspaper className="w-4 h-4" /> },
    { label: 'Belanja', url: '/belanja', icon: <ShoppingBagIcon className="w-4 h-4" /> },
    { label: 'Data', url: '/data', icon: <ChartAreaIcon className="w-4 h-4" /> }
  ]

  return (
    <div className="sm:hidden fixed bottom-0 w-full z-40">
      <div className="bg-gray-50 p-2 border">
        <ul className="flex items-center justify-between gap-2">
          {menus.map((menu, i) => (
            <FloatingMenuCard label={menu.label} url={menu.url} icon={menu.icon} key={i} />
          ))}
        </ul>
      </div>
    </div>
  )
}
