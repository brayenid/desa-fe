'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { baseConfig } from '@/utils/config'
import toast, { Toaster } from 'react-hot-toast'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import qs from 'qs'
import { fetcher } from '@/utils/fetched-data'
import { useState } from 'react'
import NotFoundBox from './not-found-box'

// Interface untuk tipe data `types`
interface Cat {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  label: string
  source: string
  year: number
}

// Interface untuk response data
interface SafetyNet {
  data: {
    id: number
    documentId: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    identity: string
    fullName: string
    address: string
    birth: string
    types: Cat[]
  }[]
}

// Schema validasi input dengan Zod
const formSchema = z.object({
  identity: z.string().nonempty()
})

export function SafetynetForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identity: ''
    }
  })

  const [data, setData] = useState<SafetyNet['data'][0] | null>(null)
  const [notFound, setNotFound] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const query = qs.stringify({
        filters: {
          identity: {
            $eq: values.identity
          }
        },
        populate: ['types']
      })

      const res: SafetyNet = await fetcher(`${baseConfig.server.host}/api/safetynets-recipients?${query}`)

      if (res?.data?.length) {
        setData(res.data[0]) // Menyimpan data pertama yang ditemukan
        toast.success(`Data ditemukan: ${res.data[0].fullName}`)
        setNotFound(false)
      } else {
        setData(null)
        toast.error(`Data tidak ditemukan`)
        setNotFound(true)
      }
    } catch (err) {
      console.log(`Pengecekan gagal: ${err}`)
      toast.error(`Pengecekan gagal`)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full gap-2">
          <FormField
            control={form.control}
            name="identity"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Masukan NIK" {...field} className="rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700 rounded-xl transition-all">
            Cek
          </Button>
        </form>
        <Toaster />
      </Form>

      {data ? (
        <div className="mt-4 p-4 border rounded-xl bg-green-50">
          <h3 className="text-lg font-semibold">{data.fullName}</h3>
          <p className="text-sm text-gray-600">{data.address}</p>
          <p className="text-sm text-gray-600">Tanggal Lahir: {data.birth}</p>

          <ul className="list-disc list-inside mt-4">
            {data.types.map((type) => (
              <li key={type.id}>
                <strong>{type.label}</strong> - Anggaran {type.source} T.A {type.year}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {notFound && <NotFoundBox text="Data tidak ditemukan" className="my-4" />}
    </div>
  )
}
