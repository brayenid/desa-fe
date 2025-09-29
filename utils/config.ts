import { Poppins } from 'next/font/google'
import Jabber from 'jabber'
import { Financing } from './types'
import { FetchedBudgets } from '@/app/data/anggaran/page'
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})

type Transaction = {
  label: string
  total: number
  role: string
}

type GroupedTransactions = {
  reception: Transaction[]
  spending: Transaction[]
}

function groupByRole(transactions: Transaction[]): GroupedTransactions {
  return (transactions ?? []).reduce<GroupedTransactions>(
    (acc, transaction) => {
      if (transaction.role === 'Penerimaan') {
        acc.reception.push(transaction)
      } else {
        acc.spending.push(transaction)
      }
      return acc
    },
    { spending: [], reception: [] }
  )
}

export const baseConfig = {
  style: {
    font: {
      poppins
    }
  },
  helpers: {
    textGenerate: () => {
      return new Jabber()
    },
    currencyFormat: (value: number, locale: Intl.LocalesArgument = 'id-ID', currency: string = 'IDR'): string => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
      }).format(value)
    },
    formatDate: (timestamp: string) => {
      const monthId = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
      ]

      const date = new Date(timestamp)
      const day = date.getDate()
      const month = date.getMonth()
      const year = date.getFullYear()

      return `${day} ${monthId[month]} ${year}`
    },
    calculateBalance: (data: Financing[]) => {
      return (data ?? []).reduce((acc, item) => {
        return item.role === 'Pengeluaran' ? acc - item.total : acc + item.total
      }, 0)
    },
    calculateBudget: (data: FetchedBudgets) => {
      // helper agar aman dari string/null/NaN
      const toNum = (v: unknown): number => {
        if (typeof v === 'number' && Number.isFinite(v)) return v
        const n = Number(v)
        return Number.isFinite(n) ? n : 0
      }

      // ---- EXPENDITURE & INCOME: pakai destructuring dgn default, tidak ada overwrite ----
      const expSrc = (data?.budget?.expenditure ?? {}) as Partial<{
        communityDev: number
        communityEmpowerment: number
        govExpenditure: number
        villageDevelopment: number
        emergencyExpenditure: number
      }>

      const {
        communityDev = 0,
        communityEmpowerment = 0,
        govExpenditure = 0,
        villageDevelopment = 0,
        emergencyExpenditure = 0
      } = expSrc

      const incSrc = (data?.budget?.income ?? {}) as Partial<{
        originalIncome: number
        transferIncome: number
        miscIncome: number
      }>

      const { originalIncome = 0, transferIncome = 0, miscIncome = 0 } = incSrc

      const expenditureTotal =
        toNum(communityDev) +
        toNum(communityEmpowerment) +
        toNum(govExpenditure) +
        toNum(villageDevelopment) +
        toNum(emergencyExpenditure)

      const incomeTotal = toNum(originalIncome) + toNum(transferIncome) + toNum(miscIncome)

      // ---- FINANCING ----
      const financing = (data?.budget?.financing ?? []) as Transaction[]

      const financingTotal = baseConfig.helpers.calculateBalance(financing as Financing[])

      const grouped = groupByRole(financing)
      const financingGroupped = {
        reception: grouped.reception.reduce((acc, item) => acc + toNum(item.total), 0),
        spending: grouped.spending.reduce((acc, item) => acc + toNum(item.total), 0)
      }

      return {
        expenditureTotal,
        incomeTotal,
        financingTotal,
        financingGroupped
      }
    },
    clasifyVillageStatus: (index: number): string => {
      if (index < 0.491) {
        return 'Sangat Tertinggal'
      } else if (index >= 0.491 && index < 0.599) {
        return 'Tertinggal'
      } else if (index >= 0.599 && index < 0.707) {
        return 'Berkembang'
      } else if (index >= 0.707 && index < 0.815) {
        return 'Maju'
      } else {
        return 'Mandiri'
      }
    }
  },
  server: {
    host: process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1338',
    key: process.env.STRAPI_TOKEN ?? process.env.NEXT_PUBLIC_STRAPI_TOKEN,
    public: process.env.NEXT_PUBLIC_PUBLIC_URL ?? 'http://localhost:3000'
  },

  meta: {
    gaId: process.env.NEXT_PUBLIC_GA ?? ''
  }
}
