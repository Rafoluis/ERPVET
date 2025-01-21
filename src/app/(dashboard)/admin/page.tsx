'use client'

import { getAllEmployees } from '@/actions/admin/admin.actions'
import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import EmployeesTable from './components/EmployeesTable'

const columns = [
  { id: 'dni', label: 'DNI' },
  { id: 'nombre', label: 'Nombre' },
  { id: 'apellido', label: 'Apellido' },
  { id: 'especialidad', label: 'Especialidad' },
  { id: 'fecha_creacion', label: 'Fecha de creación' },
  { id: 'roles', label: 'Roles' },
]

const AdminPage = () => {
  return (
    <section className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold uppercase'>Usuarios</h2>
        <button className='bg-gray-300 text-white py-2 px-4 rounded hover:bg-gray-400'>
          Agregar nuevo usuario
        </button>
      </div>

      <ErrorBoundary fallback={<div>Ha ocurrido un error</div>}>
        <Suspense fallback={<div>Cargando...</div>}>
          <EmployeesTable
            columns={columns}
            getAllEmployees={getAllEmployees()}
          />
        </Suspense>
      </ErrorBoundary>
    </section>
  )
}

export default AdminPage
