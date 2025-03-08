import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

export interface BreadcrumbData {
  title: string | Promise<string> | string[]
  url: string
  isLast: boolean
}

export function BreadcrumbCustom({ data, className }: { data: BreadcrumbData[]; className?: string }) {
  return (
    <Breadcrumb className={cn('no-list', className)}>
      <BreadcrumbList>
        {data.map((br, i) => (
          <div key={i}>
            {br.isLast ? (
              <BreadcrumbItem>
                <BreadcrumbPage>{br.title}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <div className="flex gap-4 items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={br.url}>{br.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </div>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
