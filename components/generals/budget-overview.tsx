'use client'

import { baseConfig } from '@/utils/config'
import LinkButton from '../ui/link-button'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetched-data'
import { Skeleton } from '../ui/skeleton'
import qs from 'qs'

export default function BudgetOverview() {
  const query = qs.stringify({
    populate: ['budget.expenditure', 'budget.income', 'budget.financing'],
    pagination: {
      pageSize: 1
    },
    sort: {
      year: 'desc'
    }
  })
  const { data, isLoading } = useSWR(`${baseConfig.server.host}/api/budgets?${query}`, fetcher)

  const budget = baseConfig.helpers.calculateBudget(data?.data[0]) ?? []

  return (
    <div className="bg-[url(/assets/bg-light-gold.svg)] bg-cover bg-no-repeat py-7">
      <div className="main-container text-center">
        <h2 className="uppercase text-3xl font-bold tracking-widest w-full">
          APBDes {isLoading ? <Skeleton className="inline text-2xl">Loading</Skeleton> : <>{data?.data[0]?.year}</>}
        </h2>
        <p>Anggaran Pendapatan dan Belanja Desa</p>
        <h3 className="text-4xl md:text-6xl w-full my-8 font-bold">
          {isLoading ? (
            <Skeleton className="inline">Loading</Skeleton>
          ) : (
            <>{baseConfig.helpers.currencyFormat(budget?.expenditureTotal ?? 0)}</>
          )}
        </h3>
        <LinkButton url="/data/anggaran" className="bg-amber-500 hover:bg-amber-600">
          Data Lengkap
        </LinkButton>
      </div>
    </div>
  )
}
