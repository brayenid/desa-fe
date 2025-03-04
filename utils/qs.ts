type StrapiFilter<T> = {
  [K in keyof T]?: {
    eq?: T[K]
    ne?: T[K]
    contains?: string
    startsWith?: string
    endsWith?: string
    in?: T[K][]
    notIn?: T[K][]
  }
}

export interface StrapiQuery<T> {
  filters?: StrapiFilter<T>
  pagination?: {
    page?: number
    pageSize?: number
  }
  sort?: string | string[]
  populate?: string | string[]
  fields?: string[]
}
