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
      const expenditureObj = data?.budget.expenditure ?? 0
      const incomeObj = data?.budget.income ?? 0

      const expenditureTotal =
        expenditureObj.communityDev +
        expenditureObj.communityEmpowerment +
        expenditureObj.govExpenditure +
        expenditureObj.villageDevelopment +
        expenditureObj.emergencyExpenditure

      const incomeTotal = incomeObj.originalIncome + incomeObj.transferIncome + incomeObj.miscIncome

      const financingTotal = baseConfig.helpers.calculateBalance(data?.budget.financing)
      const financingGroupped = {
        reception: groupByRole(data?.budget.financing).reception.reduce((acc, item) => acc + item.total, 0),
        spending: groupByRole(data?.budget.financing).spending.reduce((acc, item) => acc + item.total, 0)
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
