'use server'

import { useMemo } from 'react'
import { getAllEmployees } from '@/actions/admin.actions'
import EmployeeManagement from './components/EmployeeManagement'

const columns = [
  { id: 'dni', label: 'DNI' },
  { id: 'nombre', label: 'Nombre' },
  { id: 'apellido', label: 'Apellido' },
  { id: 'especialidad', label: 'Especialidad' },
  { id: 'fecha_creacion', label: 'Fecha de creación' },
  { id: 'roles', label: 'Roles' },
]

const AdminPage = () => {
  const employeesPromise = useMemo(() => getAllEmployees(), [])

  return (
    <section className='p-4 bg-backgrounddefault rounded-md flex-1 m-4 mt-0'>
      <EmployeeManagement
        columns={columns}
        getAllEmployees={employeesPromise}
      />
    </section>
  )
}

export default AdminPage
