'use client'

import { Suspense, useState } from 'react'
import EmployeesTable from './EmployeesTable'
import EmployeeFormModal from './EmployeeFormModal'
import { Employee } from '@/schemas/employee.schema'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import EmployeeDelFormModal from './EmployeeDelFormModal'
import { Plus } from 'lucide-react'
import TableSearch from '@/components/tableSearch'
import Loader from '@/components/Loader'

interface Props {
  getAllEmployees: Promise<Employee[]>
  columns: { id: string; label: string }[]
}

const EmployeeManagement = ({ columns, getAllEmployees }: Props) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit' | 'delete' | null
    selectedEmployee: Employee | null
  }>({
    isOpen: false,
    mode: null,
    selectedEmployee: null,
  })

  const handleOpenModal = (
    mode: 'create' | 'edit' | 'delete',
    employee: Employee | null = null
  ) => {
    setModalState({ isOpen: true, mode, selectedEmployee: employee })
  }

  const handleCloseModal = () => {
    setModalState({ isOpen: false, mode: null, selectedEmployee: null })
  }

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='font-bold text-lg uppercase'>Empleados</h2>

        <div className='flex gap-4'>
          <TableSearch />
          <button
            className={`px-4 py-2 flex items-center justify-center rounded-full bg-backbuttondefault`}
            onClick={() => handleOpenModal('create')}
          >
            <Plus size={20} color='white' />
            <span className='ml-2 text-sm font-medium text-textdefault'>
              Agregar
            </span>
          </button>
        </div>
      </div>

      <ErrorBoundary fallback={<div>Ha ocurrido un error</div>}>
        <Suspense fallback={<Loader />}>
          <EmployeesTable
            columns={columns}
            getAllEmployees={getAllEmployees}
            onEditEmployee={(employee) => handleOpenModal('edit', employee)}
            onDeleteEmployee={(employee) => handleOpenModal('delete', employee)}
          />
        </Suspense>
      </ErrorBoundary>

      {modalState.isOpen &&
        (modalState.mode === 'create' || modalState.mode === 'edit') && (
          <EmployeeFormModal
            isOpen={modalState.isOpen}
            onClose={handleCloseModal}
            employee={
              modalState.mode === 'edit' ? modalState.selectedEmployee : null
            }
          />
        )}

      {modalState.isOpen &&
        modalState.mode === 'delete' &&
        modalState.selectedEmployee && (
          <EmployeeDelFormModal
            employee={modalState.selectedEmployee}
            isOpen={modalState.isOpen}
            onClose={handleCloseModal}
          />
        )}
    </>
  )
}

export default EmployeeManagement
