import { baseConfig } from './config'

export async function fetcher(url: string) {
  try {
    // **Cek apakah sedang build, kalau iya return data kosong**
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn(`Skipping fetch during build: ${url}`)
      return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 1 } } }
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${baseConfig.server.key}`
      }
    })
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`)

    return await res.json()
  } catch (error) {
    console.error(`Fetch error on ${url}:`, error)
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 1 } } }
  }
}
