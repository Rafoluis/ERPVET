import Pagination from '@/components/pagination'
import Table from '@/components/table/Table'
import TableAction from '@/components/table/TableAction'
import { Employee } from '@/schemas/employee.schema'
import { EditIcon, TrashIcon } from 'lucide-react'
import { use } from 'react'

interface Props {
  getAllEmployees: Promise<Employee[]>
  columns: { id: string; label: string }[]
  onDeleteEmployee: (employee: Employee) => void
  onEditEmployee: (employee: Employee) => void
}

const EmployeesTable = ({
  getAllEmployees,
  columns,
  onDeleteEmployee,
  onEditEmployee,
}: Props) => {
  const data = use(getAllEmployees)

  return (
    <>
      <Table
        columns={columns}
        rows={data}
        customRenderers={{
          fecha_creacion: (row) =>
            row.fecha_creacion
              ? new Date(row.fecha_creacion).toLocaleDateString()
              : '',
          dni: (row) => <span className='text-gray-500'>{row.dni}</span>,
          roles: (row) => (
            <span className='lowercase'>{row.roles.join(', ')}</span>
          ),
        }}
        customActions={(row) => (
          <>
            <TableAction
              className='bg-blue-50 p-2.5 rounded-full shadow-sm hover:shadow-md'
              icon={<EditIcon className='w-5 h-5 text-blue-600' />}
              onClick={() => onEditEmployee(row)}
              hoverIconColor='text-blue-800'
            />

            <TableAction
              className='bg-red-50 p-2.5 rounded-full shadow-sm hover:shadow-md'
              icon={<TrashIcon className='w-5 h-5 text-red-600' />}
              onClick={() => onDeleteEmployee(row)}
              hoverIconColor='text-red-800'
            />
          </>
        )}
      />
      <Pagination page={5} count={data.length} />
    </>
  )
}

export default EmployeesTable
