export interface News {
  title: string
  thumbnail: string
  description: string
  publishedAt: string
  category: string
  categories?: []
  slug: string
  blocks?: []
}

export interface Potential {
  title: string
  thumbnail: string
  description?: string
  slug: string
}

export interface Gallery {
  title: string
  thumbnail: string
  publishedAt: string
  slug: string
  category: string
  categories?: []
}

export interface Staff {
  name: string
  role: string
  img: string
}

export interface Shop {
  title: string
  price: number
  thumbnail: string
  description?: string
  seller: string
  phone?: string
  slug: string
}

export interface WebsiteInfo {
  phone: string
  email: string
  address: string
  chief: string
  schedule: string
  coordinate: string | null
  regency: string
  subdistrict: string
  webName: string
  webDesc: string
  logo: {
    url: string
  }
  chiefImg: {
    url: string
  }
  favicon: {
    url: string
  }
  vision: string
  mission: {
    mission: string
  }[]
  blocks: []
  profileBg?: {
    url: string
  }
}

export interface Financing {
  label: string
  total: number
  role: 'Penerimaan' | 'Pengeluaran'
}

export type PageParams = Promise<{ slug: string[] }>
