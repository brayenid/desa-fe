import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export default function HeaderStyled({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <header
      className={cn(
        'flex items-center justify-between gap-3 before:w-2 before:h-2 before:bg-primary-300 before:absolute before:left-0',
        className
      )}>
      <h3 className="tracking-widest uppercase font-bold pl-5">{children}</h3>
    </header>
  )
}
