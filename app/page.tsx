import BigCategory from '@/components/generals/big-categories'
import Jumbotron from '@/components/generals/jumbotron'
import News from '@/components/generals/news'
import Potential from '@/components/generals/potential'
import Gallery from '@/components/generals/gallery'
import Staff from '@/components/generals/staff'
import BudgetOverview from '@/components/generals/budget-overview'
import Shop from '@/components/generals/shop'
import { WebsiteInfo } from '@/utils/types'
import { fetcher } from '@/utils/fetched-data'
import { baseConfig } from '@/utils/config'
import CTA from '@/components/generals/cta'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const data: WebsiteInfo = (await fetcher(`${baseConfig.server.host}/api/organization`)).data

  return (
    <>
      <Jumbotron websiteInfo={data} />
      <BigCategory websiteInfo={data} />
      <News />
      <Gallery />
      <Potential />
      <Staff />
      <BudgetOverview />
      <Shop />
      <CTA websiteInfo={data} />
    </>
  )
}
