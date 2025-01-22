import Table from '@/components/table/Table'
import TableAction from '@/components/table/TableAction'
import { Employee } from '@/schemas/employee.schema'
import { EditIcon, TrashIcon } from 'lucide-react'
import { use } from 'react'

interface Props {
  getAllEmployees: Promise<Employee[]>
  columns: { id: string; label: string }[]
}

const EmployeesTable = ({ getAllEmployees, columns }: Props) => {
  const data = use(getAllEmployees)
  
  return (
    <Table
      columns={columns}
      rows={data}
      customRenderers={{
        fecha_creacion: (row) =>
          row.fecha_creacion
            ? new Date(row.fecha_creacion).toLocaleDateString()
            : '',
        dni: (row) => <span className='text-gray-500'>{row.dni}</span>,
        roles: (row) => <span className='lowercase'>{row.roles.join(', ')}</span>,
      }}
      customActions={(row) => (
        <>
          <TableAction
            icon={<EditIcon />}
            onClick={() => console.log('Edit', row)}
          />
          <TableAction
            icon={<TrashIcon className='text-black' />}
            onClick={() => console.log('Delete', row)}
          />
        </>
      )}
    />
  )
}

export default EmployeesTable
