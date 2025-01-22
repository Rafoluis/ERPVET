'use client'

import { Suspense, useState } from 'react'
import EmployeesTable from './EmployeesTable'
import EmployeeFormModal from './EmployeeFormModal'
import { Employee } from '@/schemas/employee.schema'
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface Props {
  getAllEmployees: Promise<Employee[]>
  columns: { id: string; label: string }[]
}

const EmployeeManagement = ({ columns, getAllEmployees }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='font-bold text-lg uppercase'>Usuarios</h2>
        <button
          className='bg-gray-300 text-white py-2 px-4 rounded hover:bg-gray-400'
          onClick={handleOpenModal}
        >
          Agregar nuevo usuario
        </button>
      </div>

      <ErrorBoundary fallback={<div>Ha ocurrido un error</div>}>
        <Suspense fallback={<div>Cargando...</div>}>
          <EmployeesTable columns={columns} getAllEmployees={getAllEmployees} />
        </Suspense>
      </ErrorBoundary>

      {isModalOpen && (
        <EmployeeFormModal isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </>
  )
}

export default EmployeeManagement
