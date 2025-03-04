import { cn } from '@/lib/utils'
import { OctagonX } from 'lucide-react'

interface NotFound {
  text: string
  className?: string
}

export default function NotFoundBox({ text, className }: NotFound) {
  return (
    <>
      <div
        className={cn(
          'w-full p-6 text-center bg-red-50 border border-red-200 text-sm tracking-wide text-red-400 rounded-xl',
          className
        )}>
        <div className="flex items-center justify-center gap-4">
          <OctagonX className="w-4 h-4" />
          <p>{text}</p>
        </div>
      </div>
    </>
  )
}
