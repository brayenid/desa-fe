import { BreadcrumbCustom, BreadcrumbData } from '@/components/generals/breadcrumb'
import ScrollData from '@/components/generals/data/data-scroll'
import { PopulationPyramid, ResidentChart } from '@/components/generals/data/resident-chart'
import { PageHeader } from '@/components/generals/main-header'
import HeaderStyled from '@/components/ui/header-styled'
import LinkButton from '@/components/ui/link-button'
import { cn } from '@/lib/utils'
import { baseConfig } from '@/utils/config'
import { fetcher } from '@/utils/fetched-data'
import { WebsiteInfo } from '@/utils/types'
import { Download } from 'lucide-react'
import { Metadata } from 'next'
import qs from 'qs'
import { ReactNode } from 'react'

interface FetchedResident {
  name: string
  publishedAt: string
  address: string
  religion: string
  sex: string
  maritality: string
  stats: string
  education: string
  job: string
  birth: string
}

export interface DividedByData {
  label: string
  value: number
}

interface GeneralDividedData {
  arr: DividedByData[]
  description: string
}

interface ResidentStats {
  totalResidents: number
  totalHouseholdHeads: number
}

export interface PyramidData {
  age: string
  male: number
  female: number
}

export async function generateMetadata(): Promise<Metadata> {
  // FIX LATER
  const websiteInfo: WebsiteInfo = (await fetcher(`${baseConfig.server.host}/api/organization`)).data ?? []

  return {
    title: `Kependudukan - ${websiteInfo.webName}`
  }
}

function Header({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('font-bold uppercase mb-4', className)}>
      <h2>{children}</h2>
    </div>
  )
}

function PopulationCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-8 bg-primary-100 flex-[1] rounded-xl">
      <h4 className="uppercase font-bold tracking-widest mb-4 text-primary-500">{label}</h4>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  )
}

function divideBySex(data: FetchedResident[]): GeneralDividedData {
  const counter = {
    male: 0,
    female: 0
  }

  let description: string

  const arr: DividedByData[] = []

  data.forEach((data) => {
    if (data.sex === 'Laki-laki') {
      counter.male += 1
    } else {
      counter.female += 1
    }
  })

  arr.push({ label: 'Laki-laki', value: counter.male })
  arr.push({ label: 'Perempuan', value: counter.female })

  if (counter.male > counter.female) {
    description = `Populasi laki-laki lebih tinggi ${counter.male - counter.female} orang dari populasi perempuan.`
  } else if (counter.male < counter.female) {
    description = `Populasi perempuan lebih tinggi ${counter.female - counter.male} orang dari populasi laki-laki.`
  } else {
    description = `Populasi perempuan dan populasi laki-laki setara.`
  }

  return {
    arr,
    description
  }
}

function divideByJob(data: FetchedResident[]): GeneralDividedData {
  const jobMap = new Map<string, number>()

  // Menghitung jumlah setiap pekerjaan
  data.forEach((person) => {
    const job = person.job
    jobMap.set(job, (jobMap.get(job) || 0) + 1)
  })

  // Mengonversi ke array
  const resultArray = Array.from(jobMap, ([label, value]) => ({ label, value }))

  // Mencari nilai tertinggi
  const maxValue = Math.max(...resultArray.map((job) => job.value))

  // Mencari semua pekerjaan dengan nilai tertinggi
  const maxJobs = resultArray.filter((job) => job.value === maxValue).map((job) => job.label)

  // Menyusun deskripsi dengan format yang lebih baik
  let jobText = ''
  if (maxJobs.length === 1) {
    jobText = maxJobs[0]
  } else if (maxJobs.length === 2) {
    jobText = maxJobs.join(' dan ')
  } else {
    jobText = maxJobs.slice(0, -1).join(', ') + ', dan ' + maxJobs[maxJobs.length - 1]
  }

  const description = `Pekerjaan dengan populasi tertinggi adalah ${jobText} dengan jumlah ${maxValue} orang.`

  return {
    arr: resultArray.sort((a, b) => b.value - a.value),
    description
  }
}

function divideByReligion(data: FetchedResident[]): GeneralDividedData {
  const religionMap = new Map()

  data.forEach((person) => {
    const religion = person.religion
    if (religionMap.has(religion)) {
      religionMap.set(religion, religionMap.get(religion) + 1)
    } else {
      religionMap.set(religion, 1)
    }
  })

  const resultArray = Array.from(religionMap, ([label, value]) => ({ label, value }))
  const maxReligion = resultArray.reduce((max, religion) => (religion.value > max.value ? religion : max), {
    label: '',
    value: 0
  })
  const description = `Agama dengan populasi tertinggi adalah ${maxReligion.label} dengan jumlah populasi ${maxReligion.value} orang.`

  return { arr: resultArray, description }
}

function getPopulationStats(data: FetchedResident[]): ResidentStats {
  return {
    totalResidents: data.length,
    totalHouseholdHeads: data.filter((person) => person.stats === 'Kepala Keluarga').length
  }
}

function getPyramidData(data: FetchedResident[]): PyramidData[] {
  const ageRanges = [
    { range: '0-4', min: 0, max: 4 },
    { range: '5-9', min: 5, max: 9 },
    { range: '10-14', min: 10, max: 14 },
    { range: '15-19', min: 15, max: 19 },
    { range: '20-24', min: 20, max: 24 },
    { range: '25-29', min: 25, max: 29 },
    { range: '30-34', min: 30, max: 34 },
    { range: '35-39', min: 35, max: 39 },
    { range: '40-44', min: 40, max: 44 },
    { range: '45-49', min: 45, max: 49 },
    { range: '50-54', min: 50, max: 54 },
    { range: '55-59', min: 55, max: 59 },
    { range: '60-64', min: 60, max: 64 },
    { range: '65-69', min: 65, max: 69 },
    { range: '70-74', min: 70, max: 74 },
    { range: '75-79', min: 75, max: 79 },
    { range: '80-84', min: 80, max: 84 },
    { range: '85+', min: 85, max: Infinity }
  ]

  const currentYear = new Date().getFullYear()
  const ageGroups: Record<string, { male: number; female: number }> = {}

  ageRanges.forEach(({ range }) => {
    ageGroups[range] = { male: 0, female: 0 }
  })

  data.forEach((person) => {
    const birthYear = new Date(person.birth).getFullYear()
    const age = currentYear - birthYear
    const genderKey = person.sex === 'Laki-laki' ? 'male' : 'female'

    const ageRange = ageRanges.find(({ min, max }) => age >= min && age <= max)
    if (ageRange) {
      ageGroups[ageRange.range][genderKey]++
    }
  })

  return Object.entries(ageGroups).map(([age, { male, female }]) => ({
    age,
    male: -male,
    female
  }))
}

function divideByEducation(data: FetchedResident[]): GeneralDividedData {
  const eduMap = new Map<string, number>()

  // Menghitung jumlah setiap pekerjaan
  data.forEach((person) => {
    const education = person.education
    eduMap.set(education, (eduMap.get(education) || 0) + 1)
  })

  // Mengonversi ke array
  const resultArray = Array.from(eduMap, ([label, value]) => ({ label, value }))

  // Mencari nilai tertinggi
  const maxValue = Math.max(...resultArray.map((edu) => edu.value))

  // Mencari semua pekerjaan dengan nilai tertinggi
  const maxEdus = resultArray.filter((edu) => edu.value === maxValue).map((edu) => edu.label)

  // Menyusun deskripsi dengan format yang lebih baik
  let eduText = ''
  if (maxEdus.length === 1) {
    eduText = maxEdus[0]
  } else if (maxEdus.length === 2) {
    eduText = maxEdus.join(' dan ')
  } else {
    eduText = maxEdus.slice(0, -1).join(', ') + ', dan ' + maxEdus[maxEdus.length - 1]
  }

  const description = `Pendidikan dengan populasi tertinggi adalah ${eduText} dengan jumlah ${maxValue} orang.`

  return {
    arr: resultArray.sort((a, b) => b.value - a.value),
    description
  }
}

function divideByMaritality(data: FetchedResident[]): GeneralDividedData {
  const maritalityMap = new Map()

  data.forEach((person) => {
    const maritality = person.maritality
    if (maritalityMap.has(maritality)) {
      maritalityMap.set(maritality, maritalityMap.get(maritality) + 1)
    } else {
      maritalityMap.set(maritality, 1)
    }
  })

  const resultArray = Array.from(maritalityMap, ([label, value]) => ({ label, value }))

  const description = ''
  return { arr: resultArray, description }
}

export default async function Resident() {
  const query = qs.stringify(
    {
      fields: ['name', 'publishedAt', 'address', 'religion', 'sex', 'maritality', 'stats', 'education', 'job', 'birth']
    },
    {
      encodeValuesOnly: true
    }
  )

  const data: FetchedResident[] = (await fetcher(`${baseConfig.server.host}/api/residents?${query}`)).data ?? []

  const file = (await fetcher(`${baseConfig.server.host}/api/resident-file`)).data?.url

  const dividedBySex = divideBySex(data)
  const dividedByJob = divideByJob(data)
  const dividedByReligion = divideByReligion(data)
  const basicResidentData = getPopulationStats(data)
  const pyramidData = getPyramidData(data)
  const dividedByEducation = divideByEducation(data)
  const dividedByMaritality = divideByMaritality(data)

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
      title: 'Data Kependudukan',
      isLast: true,
      url: '#'
    }
  ]

  const websiteInfo: WebsiteInfo = (await fetcher(`${baseConfig.server.host}/api/organization`)).data ?? []

  return (
    <div className="main-container">
      <BreadcrumbCustom data={breadcrumbs} className="mb-8" />
      <div className="text-center mb-8">
        <PageHeader
          title="Data Kependudukan"
          description={`Selayang Pandang Data Kependudukan Desa ${websiteInfo.webName}`}
        />
      </div>
      <main className="space-y-8">
        <div className="border rounded-xl p-8">
          <Header>Populasi</Header>
          <div className="flex flex-col md:flex-row gap-8 text-center">
            <PopulationCard label="Jumlah Total Populasi" value={basicResidentData.totalResidents} />
            <PopulationCard label="Jumlah Kepala Keluarga" value={basicResidentData.totalHouseholdHeads} />
          </div>
        </div>
        <div className="grid gap-8 xl:grid-cols-2">
          <div className="border rounded-xl p-8">
            <Header>Populasi Menurut Jenis Kelamin</Header>
            <div className="space-y-8">
              <ResidentChart residentsData={dividedBySex.arr} />
              <div className="relative text-sm space-y-2">
                <HeaderStyled>Deskripsi</HeaderStyled>
                <p>{dividedBySex.description}</p>
              </div>
            </div>
          </div>
          <div className="border rounded-xl p-8">
            <Header>Populasi Menurut Agama</Header>
            <div className="space-y-8">
              <ResidentChart residentsData={dividedByReligion.arr} />
              <div className="relative text-sm space-y-2">
                <HeaderStyled>Deskripsi</HeaderStyled>
                <p>{dividedByReligion.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded-xl p-8">
          <Header>Populasi Menurut Pekerjaan</Header>
          <div className="border rounded-xl overflow-hidden">
            <div className="space-y-8">
              <ScrollData data={dividedByJob.arr} />
            </div>
          </div>
          <div className="relative text-sm space-y-2 mt-5">
            <HeaderStyled>Deskripsi</HeaderStyled>
            <p>{dividedByJob.description}</p>
          </div>
        </div>
        <div className="border rounded-xl p-8">
          <Header>Populasi Menurut Umur</Header>
          <PopulationPyramid data={pyramidData} />
        </div>
        <div className="grid gap-8 xl:grid-cols-2">
          <div className="border rounded-xl p-8">
            <Header>Populasi Menurut Pendidikan</Header>
            <ResidentChart residentsData={dividedByEducation.arr} />
            <div className="relative text-sm space-y-2 mt-5">
              <HeaderStyled>Deskripsi</HeaderStyled>
              <p>{dividedByEducation.description}</p>
            </div>
          </div>
          <div className="border rounded-xl p-8">
            <Header>Populasi Menurut Status Perkawinan</Header>
            <div className="grid gap-8 xl:grid-cols-2 text-center">
              {dividedByMaritality.arr.map((m, i) => (
                <PopulationCard label={m.label} value={m.value} key={i} />
              ))}
            </div>
          </div>
        </div>
        {file ? (
          <div className="">
            <LinkButton url={file ?? '/'} className="flex items-center w-full lg:w-max gap-4 justify-center">
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
