export const metadata = {
  title: '404',
  description: 'ups something went wrong'
}

export const dynamic = 'force-dynamic'

export default function Custom404() {
  return (
    <div className="w-full h-screen flex items-center justify-center p-8 text-center">
      <h1 className="text-xl uppercase tracking-widest font-bold">
        <span className="text-red-500">404</span>: Not found.
      </h1>
    </div>
  )
}
