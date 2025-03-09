'use client'

import { baseConfig } from '@/utils/config'
import LinkButton from '../ui/link-button'
import useSWR from 'swr'
import { fetcher } from '@/utils/fetched-data'
import { Skeleton } from '../ui/skeleton'
import qs from 'qs'
import MainHeader from './main-header'

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
        <MainHeader title={`APBDes ${data?.data[0]?.year ?? ''}`} description="Anggaran Pendapatan dan Belanja Desa" />
        <h3 className="text-4xl md:text-6xl w-full my-8 font-bold">
          {isLoading ? (
            <Skeleton className="inline">Loading</Skeleton>
          ) : (
            <>{budget?.expenditureTotal ? baseConfig.helpers.currencyFormat(budget?.expenditureTotal) : `Rp. 0`}</>
          )}
        </h3>
        <LinkButton
          url="/profil/sotk"
          className="!bg-amber-100 border !border-amber-200 !text-gray-700 hover:!bg-amber-200">
          Selengkapnya
        </LinkButton>
      </div>
    </div>
  )
}
