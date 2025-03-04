import Link from 'next/link'
import { ReactNode } from 'react'

interface LinkButtonType {
  children: ReactNode
  url: string
  className?: string
}

export default function LinkButton({ children, url, className }: LinkButtonType) {
  return (
    <Link
      href={url}
      className={`p-2 bg-primary-600 text-white uppercase tracking-widest text-sm rounded hover:bg-primary-700 transition-all ${className}`}>
      {children}
    </Link>
  )
}
