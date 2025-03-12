import EmployeeManagement from './components/EmployeeManagement'
import { getAllEmployees } from '@/actions/admin.actions'

const columns = [
  { id: 'dni', label: 'DNI' },
  { id: 'nombre', label: 'Nombre' },
  { id: 'apellido', label: 'Apellido' },
  { id: 'especialidad', label: 'Especialidad' },
  { id: 'fecha_creacion', label: 'Fecha de creación' },
  { id: 'roles', label: 'Roles' },
]

interface AdminPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AdminPage = async ({ searchParams }: AdminPageProps) => {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : ''
  const start = typeof resolvedParams.start === 'string' ? resolvedParams.start : undefined
  const end = typeof resolvedParams.end === 'string' ? resolvedParams.end : undefined
  const sort = typeof resolvedParams.sort === 'string' ? (resolvedParams.sort as 'asc' | 'desc') : undefined
  const column = typeof resolvedParams.column === 'string' ? resolvedParams.column : undefined

  const employeesPromise = getAllEmployees(search, start, end, sort, column)

  return (
    <section className="p-4 bg-backgrounddefault rounded-md flex-1 m-4 mt-0">
      <EmployeeManagement
        columns={columns}
        getAllEmployees={employeesPromise}
      />
    </section>
  )
}

export default AdminPage
