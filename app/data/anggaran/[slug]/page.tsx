import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import qs from 'qs'
import { FetchedBudgets } from '../page'
import { ReactNode } from 'react'
import { Banknote, Download, HandCoins, ShoppingBag } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IncomeBudgetChart } from '@/components/generals/data/budget-chart'
import LinkButton from '@/components/ui/link-button'
import { BreadcrumbCustom, BreadcrumbData } from '@/components/generals/breadcrumb'
import { PageParams } from '@/utils/types'
import NotFoundBox from '@/components/generals/not-found-box'

function BudgetCard({ label, total, children }: { label: string; total: number; children: ReactNode }) {
  return (
    <div className="text-center flex bg-primary-100 border overflow-hidden rounded-xl">
      <div className="flex-[1] bg-primary-700 flex justify-center items-center bg-opacity-10 text-primary-500">
        {children}
      </div>
      <div className="flex-[2] p-4 md:p-8">
        <h2 className="uppercase tracking-widest text-base md:text-lg text-primary-600">{label}</h2>
        <p className="text-base md:text-xl font-bold text-primary-600">{baseConfig.helpers.currencyFormat(total)}</p>
      </div>
    </div>
  )
}

function DetailBudgetCard({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="p-4 bg-gray-50 border rounded-xl">
      <div className="">{label}</div>
      <div className="font-bold">{baseConfig.helpers.currencyFormat(amount)}</div>
    </div>
  )
}

export default async function Budget({ params }: { params: PageParams }) {
  const param = (await params).slug

  const query = qs.stringify({
    populate: ['budget.expenditure', 'budget.income', 'budget.financing'],
    filters: {
      year: {
        $eq: param
      }
    },
    pagination: {
      pageSize: 1
    }
  })

  const data: FetchedBudgets = (await fetcher(`${baseConfig.server.host}/api/budgets?${query}`)).data[0] ?? {}

  if (!data) {
    return <NotFoundBox text="Tidak ada ditampilkan!" />
  }

  const budgetDetail = baseConfig.helpers.calculateBudget(data)

  const expenditureObj = data.budget.expenditure
  const incomeObj = data.budget.income
  const expenditureTotal = budgetDetail.expenditureTotal
  const incomeTotal = budgetDetail.incomeTotal
  const financingTotal = budgetDetail.financingTotal
  const financingGroupped = budgetDetail.financingGroupped

  const budgetGraph = {
    income: [
      { label: 'P. Asli Desa', amount: incomeObj.originalIncome },
      { label: 'P. Transfer', amount: incomeObj.transferIncome },
      { label: 'P. Lain-lain', amount: incomeObj.miscIncome }
    ],
    expenditure: [
      { label: 'P. Desa', amount: expenditureObj.govExpenditure },
      { label: 'Pemb. Desa', amount: expenditureObj.villageDevelopment },
      { label: 'Pembin. Masy.', amount: expenditureObj.communityDev },
      { label: 'Pember. Masya', amount: expenditureObj.communityEmpowerment },
      { label: 'Bencana - Darurat', amount: expenditureObj.emergencyExpenditure }
    ],
    financing: [
      { label: 'Penerimaan', amount: financingGroupped.reception },
      { label: 'Pengeluaran', amount: financingGroupped.spending }
    ]
  }

  const breadcrumbs: BreadcrumbData[] = [
    {
      title: 'Beranda',
      isLast: false,
      url: '/'
    },
    {
      title: 'Data',
      isLast: false,
      url: '/data'
    },
    {
      title: 'APBDes',
      isLast: false,
      url: '/data/anggaran'
    },
    {
      title: await param[0],
      isLast: true,
      url: '#'
    }
  ]

  return (
    <div className="main-container">
      <BreadcrumbCustom data={breadcrumbs} className="mb-8" />
      <div className="text-center mb-8">
        <h1 className="w-full uppercase font-extrabold text-2xl">
          APBDes Tahun Anggaran <span className="text-primary-600">{param}</span>
        </h1>
        <p>Klik untuk melihat detail</p>
      </div>
      <main>
        <Tabs defaultValue="income">
          <TabsList className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mb-4">
            <TabsTrigger value="income">
              <BudgetCard label="Pendapatan" total={incomeTotal}>
                <HandCoins className="md:w-10 md:h-10 w-5 h-5" />
              </BudgetCard>
            </TabsTrigger>
            <TabsTrigger value="expenditure">
              <BudgetCard label="Belanja" total={expenditureTotal}>
                <ShoppingBag className="md:w-10 md:h-10 w-5 h-5" />
              </BudgetCard>
            </TabsTrigger>
            <TabsTrigger value="financing">
              <BudgetCard label="Pembiayaan" total={financingTotal}>
                <Banknote className="md:w-10 md:h-10 w-5 h-5" />
              </BudgetCard>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="income" className="flex gap-4 flex-col lg:flex-row">
            <div className="flex-[1]">
              <IncomeBudgetChart budgetData={budgetGraph.income} />
            </div>
            <div className="flex-[1] space-y-4">
              <DetailBudgetCard label="Pendapatan Asli Desa" amount={data.budget.income.originalIncome} />
              <DetailBudgetCard label="Pendapatan Transfer" amount={data.budget.income.transferIncome} />
              <DetailBudgetCard label="Pendapatan Lain-lain" amount={data.budget.income.miscIncome} />
            </div>
          </TabsContent>
          <TabsContent value="expenditure" className="flex gap-4 flex-col lg:flex-row">
            <div className="flex-[1]">
              <IncomeBudgetChart budgetData={budgetGraph.expenditure} />
            </div>
            <div className="flex-[1] space-y-4">
              <DetailBudgetCard
                label="Penyelenggaraan Pemerintahan Desa"
                amount={data.budget.expenditure.govExpenditure}
              />
              <DetailBudgetCard
                label="Pelaksanaan Pembangunan Desa"
                amount={data.budget.expenditure.villageDevelopment}
              />
              <DetailBudgetCard label="Pembinaan Kemasyarakatan" amount={data.budget.expenditure.communityDev} />
              <DetailBudgetCard label="Pemberdayaan Masyarakat" amount={data.budget.expenditure.communityEmpowerment} />
              <DetailBudgetCard
                label="Penanggulanan Bencana - Darurat"
                amount={data.budget.expenditure.emergencyExpenditure}
              />
            </div>
          </TabsContent>
          <TabsContent value="financing" className="flex gap-4 flex-col lg:flex-row">
            <div className="flex-[1]">
              <IncomeBudgetChart budgetData={budgetGraph.financing} />
            </div>
            <div className="flex-[1] space-y-4">
              <DetailBudgetCard label="Penerimaan" amount={financingGroupped.reception} />
              <DetailBudgetCard label="Pengeluaran" amount={financingGroupped.spending} />
            </div>
          </TabsContent>
        </Tabs>
        {data.budget.url ? (
          <div className="my-8">
            <LinkButton url={data.budget.url ?? '/'} className="flex items-center w-full lg:w-max gap-4 justify-center">
              <Download className="w-4 h-4" />
              <p>Unduh Berkas Lengkap</p>
            </LinkButton>
          </div>
        ) : (
          ''
        )}
      </main>
    </div>
  )
}
