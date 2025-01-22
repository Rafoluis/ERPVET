'use client'

import { createEmployee } from '@/actions/admin.actions'
import Modal from '@/components/modal/Modal'
import { showToast } from '@/lib/toast'
import { Employee, EmployeeSchema } from '@/schemas/employee.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface Props {
  isOpen: boolean
  employee?: Employee
  onClose: () => void
}

const EmployeeFormModal = ({ isOpen, employee, onClose }: Props) => {
  const isEditMode = !!employee
  const title = isEditMode ? 'Editar usuario' : 'Agregar nuevo usuario'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Employee>({
    resolver: zodResolver(EmployeeSchema),
  })

  const onSubmit = async (data: Employee) => {
    const response = await createEmployee(data)

    if (!response.success) {
      showToast('error', response.error)
      return
    }

    if (!isEditMode) showToast('success', response.message)
    else showToast('success', response.message)
    onClose()
  }

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label
            htmlFor='nombre'
            className='block text-sm font-medium text-gray-700'
          >
            Nombre
          </label>
          <input
            {...register('nombre')}
            type='text'
            id='nombre'
            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
          {errors.nombre && (
            <span className='text-red-500 text-xs'>
              {errors.nombre.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor='apellido'
            className='block text-sm font-medium text-gray-700'
          >
            Apellido
          </label>
          <input
            {...register('apellido')}
            type='text'
            id='apellido'
            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
          {errors.apellido && (
            <span className='text-red-500 text-xs'>
              {errors.apellido.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor='dni'
            className='block text-sm font-medium text-gray-700'
          >
            DNI
          </label>
          <input
            {...register('dni')}
            type='text'
            id='dni'
            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
          {errors.dni && (
            <span className='text-red-500 text-xs'>{errors.dni.message}</span>
          )}
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Contraseña
          </label>
          <input
            {...register('password')}
            type='text'
            id='password'
            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
          {errors.password && (
            <span className='text-red-500 text-xs'>
              {errors.password.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor='sexo'
            className='block text-sm font-medium text-gray-700'
          >
            Sexo
          </label>
          <select
            {...register('sexo')}
            id='sexo'
            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value='MASCULINO'>Masculino</option>
            <option value='FEMENINO'>Femenino</option>
          </select>
          {errors.sexo && (
            <span className='text-red-500 text-xs'>{errors.sexo.message}</span>
          )}
        </div>

        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email
          </label>
          <input
            {...register('email')}
            type='email'
            id='email'
            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
          {errors.email && (
            <span className='text-red-500 text-xs'>{errors.email.message}</span>
          )}
        </div>

        <div>
          <label
            htmlFor='telefono'
            className='block text-sm font-medium text-gray-700'
          >
            Teléfono
          </label>
          <input
            {...register('telefono')}
            type='text'
            id='telefono'
            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
          {errors.telefono && (
            <span className='text-red-500 text-xs'>
              {errors.telefono.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor='direccion'
            className='block text-sm font-medium text-gray-700'
          >
            Dirección
          </label>
          <input
            {...register('direccion')}
            type='text'
            id='direccion'
            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
          {errors.direccion && (
            <span className='text-red-500 text-xs'>
              {errors.direccion.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor='especialidad'
            className='block text-sm font-medium text-gray-700'
          >
            Especialidad
          </label>
          <input
            {...register('especialidad')}
            type='text'
            id='especialidad'
            className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
          {errors.especialidad && (
            <span className='text-red-500 text-xs'>
              {errors.especialidad.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor='roles'
            className='block text-sm font-medium text-gray-700'
          >
            Roles
          </label>
          <select
            {...register('roles', {
              setValueAs: (value) => (value ? [value] : []),
            })}
            id='roles'
            className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
          >
            <option value=''>Selecciona un rol</option>
            <option value='ODONTOLOGO'>ODONTOLOGO</option>
            <option value='RECEPCIONISTA'>RECEPCIONISTA</option>
          </select>
        </div>

        <div className='flex justify-end gap-4'>
          <button
            className='bg-slate-200 py-2 px-4 rounded hover:bg-slate-300 text-gray-400'
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type='submit'
            className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700'
          >
            {isEditMode ? 'Actualizar' : 'Agregar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EmployeeFormModal
