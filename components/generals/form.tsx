'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { baseConfig } from '@/utils/config'
import { mutate } from 'swr'
import toast, { Toaster } from 'react-hot-toast'

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)

const formSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  subject: z.string().nonempty(),
  phone: z.string().nonempty().regex(phoneRegex, 'Invalid Number!'),
  message: z.string().nonempty()
})

export function SuggestionForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      phone: '',
      message: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`${baseConfig.server.host}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${baseConfig.server.key}`
        },
        body: JSON.stringify({ data: values }) // Harus dalam format { data: {...} }
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error?.message || 'Something went wrong')

      // Mutate untuk memperbarui data setelah POST
      mutate(`${baseConfig.server.host}/api/messages`)
      toast.success('Sukses! Pesan terkirim')
      form.reset()
    } catch (err) {
      console.log(`Gagal, pesan gagal terkirim : ${err}`)
      toast.error(`Gagal, pesan gagal terkirim`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukan nama"
                  {...field}
                  className="text-sm rounded-xl border focus:border-primary-600 !text-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukan email"
                  {...field}
                  className="text-sm rounded-xl border focus:border-primary-600 !text-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telepon</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukan no telepon"
                  {...field}
                  className="text-sm rounded-xl border focus:border-primary-600 !text-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subjek</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukan subjek"
                  {...field}
                  className="text-sm rounded-xl border focus:border-primary-600 !text-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pesan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukan pesan"
                  {...field}
                  className="resize-none w-full min-h-40 border bg-gray-50 border-gray-100 p-2 rounded-xl outline-none shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700 transition-all">
            Kirim
          </Button>
        </div>
      </form>

      <Toaster />
    </Form>
  )
}
