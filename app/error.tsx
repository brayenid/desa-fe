'use client'

export const dynamic = 'force-dynamic'

export default function Custom500() {
  return (
    <div className="w-full h-screen flex items-center justify-center p-8 text-center">
      <h1 className="text-xl uppercase tracking-widest font-bold">
        <span className="text-red-500">500</span>: Something went wrong on the server.
      </h1>
    </div>
  )
}
