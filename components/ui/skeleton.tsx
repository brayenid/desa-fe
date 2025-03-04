import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-primary/10 bg-gray-200 text-transparent', className)} {...props}>
      {children}
    </div>
  )
}

export { Skeleton }
