import Pagination from '@/components/pagination'
import Table from '@/components/table/Table'
import TableAction from '@/components/table/TableAction'
import { Employee } from '@/schemas/employee.schema'
import { Pencil, Trash2 } from 'lucide-react'
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
          nombre: (row) => (
            <div className='flex flex-col'>
              <span className='font-semibold'>{ row.nombre.concat(' ', row.apellido) }</span>
              <span className='text-gray-500 text-sm'>{row.dni}</span>
            </div>
          ),
          roles: (row) => (<span className='lowercase'>{row.roles.join(', ')}</span>),
        }}
        customActions={(row) => (
          <>
            <TableAction
              className='p-2 w-7 rounded-full shadow-sm hover:shadow-md bg-cyan-100 hover:bg-cyan-200'
              icon={<Pencil className='text-blue-600' />}
              onClick={() => onEditEmployee(row)}
              hoverIconColor='text-blue-800'
            />

            <TableAction
              className='bg-red-100 w-7 rounded-full hover:shadow-md hover:bg-red-200'
              icon={<Trash2 className='text-red-600' />}
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
