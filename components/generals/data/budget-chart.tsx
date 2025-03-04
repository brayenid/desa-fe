'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  budget: {
    label: 'Nilai',
    color: '#0084d1'
  }
} satisfies ChartConfig

type IncomeArray = {
  label: string
  amount: number
}[]

export function IncomeBudgetChart({ budgetData }: { budgetData: IncomeArray }) {
  const budgetDataMapped: IncomeArray = budgetData.map((data) => {
    return {
      label: data.label,
      amount: Number(data.amount) / 1_000_000
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik (Dalam Juta)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={budgetDataMapped}>
            <CartesianGrid />
            <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="amount" fill="var(--color-budget)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
