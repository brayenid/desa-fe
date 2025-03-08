import { PageHeader } from '@/components/generals/main-header'
import { SafetynetForm } from '@/components/generals/safetynet-form'

export default function SafetyNet() {
  return (
    <div className="main-container">
      <PageHeader title="Data Bantuan Sosial" description="Cek data anda apakah sebagai penerima bantuan sosial" />
      <main>
        <SafetynetForm />
      </main>
    </div>
  )
}
