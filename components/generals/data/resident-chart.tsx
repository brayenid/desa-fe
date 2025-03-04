'use client'

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PyramidData } from '@/app/data/penduduk/page'

const chartConfig = {
  resident: {
    label: 'Nilai',
    color: '#0084d1'
  }
} satisfies ChartConfig

type IncomeArray = {
  label: string
  value: number
}[]

export function ResidentChart({ residentsData }: { residentsData: IncomeArray }) {
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={residentsData}>
            <CartesianGrid />
            <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" fill="var(--color-resident)" radius={8}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function PopulationPyramid({ data }: { data: PyramidData[] }) {
  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={700}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="1" />
          {(() => {
            const maxValue = Math.max(...data.flatMap((d) => [Math.abs(d.male), d.female]))
            return (
              <XAxis
                type="number"
                tickFormatter={(tick) => String(Math.abs(tick))}
                domain={[-maxValue, maxValue]} // Menjaga sumbu tetap di tengah
              />
            )
          })()}
          <YAxis type="category" dataKey="age" />
          <Tooltip formatter={(value) => Math.abs(Number(value))} />
          <Bar
            dataKey="male"
            fill="#4A90E2"
            barSize={20}
            name="Laki-laki"
            className="translate-y-[4px]"
            radius={[0, 8, 8, 0]}
          />
          <Bar
            dataKey="female"
            fill="#E94E77"
            barSize={20}
            name="Perempuan"
            className="-translate-y-[4.3px]"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
