import { DividedByData } from '@/app/data/penduduk/page'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function ScrollData({ data }: { data: DividedByData[] }) {
  return (
    <div className="border rounded-md text-sm md:text-base">
      <Table className="min-w-full">
        <TableHeader className="sticky top-0 bg-primary-500 z-10">
          <TableRow>
            <TableHead className="text-white border-r">Jenis Pekerjaan</TableHead>
            <TableHead className="text-center text-white w-20 md:w-28">Jumlah</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <ScrollArea className="h-[200px]">
        <Table className="min-w-full">
          <TableBody>
            {data.map((d, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium border-r">{d.label}</TableCell>
                <TableCell className="text-center w-20 md:w-28">{d.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
