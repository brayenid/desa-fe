'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

import { SearchIcon } from 'lucide-react'
import { Input } from './input'

export function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const pathname = usePathname()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')

    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    replace(`${pathname}?${params.toString()}`)
  }, 600)

  return (
    <div className="relative my-6 group">
      <Input
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('q')?.toString()}
        className="my-0 pl-12 group border-gray-100 text-gray-500 rounded-xl bg-gray-50 py-2 text-sm border"
      />
      <div className="absolute left-3 top-1/4 ">
        <SearchIcon className="w-5 h-5 text-gray-400 group-focus-within:text-gray-700 transition-all" />
      </div>
    </div>
  )
}
