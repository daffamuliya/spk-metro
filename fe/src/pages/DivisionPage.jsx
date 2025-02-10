import MainLayout from "@/components/layouts/MainLayout"
import DivisionTable from '@/components/sections/dashboard/DivisionTable';
import { divisionData} from '@/data/data';

export default function DivisionPage() {
  return (
    <MainLayout>
        <DivisionTable data={divisionData} />
    </MainLayout>
  )
}
