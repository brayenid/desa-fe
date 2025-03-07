'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { ReactNode, useRef } from 'react'
import { baseConfig } from '@/utils/config'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetched-data'
import { Skeleton } from '../ui/skeleton'
import { WebsiteInfo } from '@/utils/types'

function NavigationSkel({ children }: { children: ReactNode }) {
  return (
    <ul className="flex gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="p-2 rounded m-0">
          {children}
        </Skeleton>
      ))}
    </ul>
  )
}

export function Navigation({ websiteInfo }: { websiteInfo: WebsiteInfo }) {
  interface MenuItems {
    name: string
    path: string
    children?: MenuItems[]
  }

  const containerNav = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const { data, isLoading } = useSWR(
    `${baseConfig.server.host}/api/main-page?populate[0]=navigation.navigation.children`,
    fetcher
  )

  const navArr = (data?.data?.navigation?.navigation as MenuItems[]) ?? []

  const navLogo = websiteInfo?.logo?.url
    ? `${baseConfig.server.host}/${websiteInfo.logo.url.slice(1)}`
    : '/assets/knk.png'

  const toggleVisibility = (): void => {
    const containerEl = containerNav.current
    containerEl?.classList.toggle('show')
  }

  return (
    <div
      className={`sticky top-0 bg-white z-50 flex items-center md:block justify-between w-full border-b py-1 ${baseConfig.style.font.poppins.className}`}>
      <nav className="flex max-w-screen-xl mx-auto p-3 pl-0">
        <Link href="/" className="flex items-center gap-2 ml-6 p-1">
          <Image src={navLogo} width={38} height={38} alt="logo" className="w-12 lg:w-7" />
          <h1 className="text-lg uppercase font-bold hidden md:block">{websiteInfo.webName}</h1>
        </Link>
        <div className="container-nav relative flex-[2]" ref={containerNav}>
          <div className="absolute w-full top-4 left-0 block md:hidden z-50">
            <button
              className="p-3 hover:bg-primary-300 rounded-full active:scale-110 active:bg-primary-400"
              onClick={toggleVisibility}>
              <X className="text-center w-9 h-9" />
            </button>
          </div>
          <ul className="main-nav">
            {isLoading ? (
              <NavigationSkel>Loading</NavigationSkel>
            ) : (
              navArr.map((menu, index) => {
                const isActive = pathname === menu.path || pathname.startsWith(menu.path + '/')

                return menu.children?.length ?? 0 > 0 ? (
                  <li className="parent-nav" key={index}>
                    <Link href={menu.path} className={isActive ? 'link-active' : ''}>
                      <span>{menu.name}</span> <LucideChevronDown className="inline w-4 h-4" />
                    </Link>
                    <ul className="subnav">
                      {menu.children?.map((submenu, subindex) => {
                        const isSubActive = pathname === submenu.path || pathname.startsWith(submenu.path + '/')

                        return (
                          <li key={subindex}>
                            <Link
                              onClick={toggleVisibility}
                              href={submenu.path}
                              className={isSubActive ? 'link-active' : ''}>
                              {submenu.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                ) : (
                  <li key={index}>
                    <Link onClick={toggleVisibility} href={menu.path} className={isActive ? 'link-active' : ''}>
                      {menu.name}
                    </Link>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </nav>
      <div className="flex w-full justify-end md:hidden px-8">
        <button
          className="p-3 hover:bg-gray-50 rounded-full active:scale-110 active:bg-gray-100"
          onClick={toggleVisibility}>
          <Menu className="text-center w-8 h-8" />
        </button>
      </div>
    </div>
  )
}
