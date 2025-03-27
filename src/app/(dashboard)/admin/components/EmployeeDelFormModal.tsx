import { deleteEmployee } from '@/actions/admin.actions'
import Modal from '@/components/forms/modal/Modal'
import { showToast } from '@/lib/toast'
import { Employee } from '@/schemas/employee.schema'

interface Props {
  employee: Employee
  isOpen: boolean
  onClose: () => void
}

const EmployeeDelFormModal = ({ employee, isOpen, onClose }: Props) => {
  const handleDeleteEmployee = async () => {
    const response = await deleteEmployee(employee.dni)

    if (!response.success) {
      showToast('error', response.error)
      return
    }
    showToast('success', response.message)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Eliminar usuario'
      onSubmit={handleDeleteEmployee}
      primaryButtonTitle='Eliminar'
    >
      <div className='text-center'>
        <p className='text-gray-600'>
          ¿Estás seguro que deseas eliminar el usuario{' '}
          <span className='font-bold'>
            {employee.nombre} {employee.apellido}
          </span>
          ?
        </p>
      </div>
    </Modal>
  )
}

export default EmployeeDelFormModal
