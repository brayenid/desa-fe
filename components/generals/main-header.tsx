import { cn } from '@/lib/utils'

export default function MainHeader({
  title,
  description,
  className
}: {
  title: string
  description: string
  className?: string
}) {
  return (
    <div className={cn('mb-4', className)}>
      <h2
        className="w-full uppercase tracking-widest text-xl md:text-2xl font-bold
    ">
        {title}
      </h2>
      <p className="font-thin tracking-wide text-lg">{description}</p>
    </div>
  )
}

export function PageHeader({
  title,
  className,
  description
}: {
  title: string
  className?: string
  description?: string
}) {
  return (
    <div className="">
      <h1 className={cn('text-xl md:text-2xl font-bold tracking-widest uppercase text-center w-full', className)}>
        {title}
      </h1>
      {description ? <p className="text-center">{description}</p> : ''}
    </div>
  )
}
