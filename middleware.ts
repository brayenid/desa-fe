import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simpan state rate limit dalam memori sederhana
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

const RATE_LIMIT = 500 // Maksimal 500 request per menit
const WINDOW_MS = 60 * 1000 // 1 menit

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Ambil IP dari header (karena req.ip tidak tersedia di middleware Next.js)
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'

  // Skip request untuk aset statis
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ico)$/)
  ) {
    return NextResponse.next()
  }

  // Ambil data rate limit user
  const now = Date.now()
  const userData = rateLimitMap.get(clientIP) || { count: 0, lastReset: now }

  // Reset hitungan jika window telah berlalu
  if (now - userData.lastReset > WINDOW_MS) {
    userData.count = 0
    userData.lastReset = now
  }

  // Cek apakah pengguna telah melewati batas
  if (userData.count >= RATE_LIMIT) {
    return new NextResponse('Too many requests, please try again later.', { status: 429 })
  }

  // Tambahkan hitungan dan simpan kembali
  userData.count += 1
  rateLimitMap.set(clientIP, userData)

  return NextResponse.next()
}

// Konfigurasi agar hanya mempengaruhi pages, bukan API atau aset statis
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
}
