'use client'

import { createOrUpdateEmployee } from '@/actions/admin.actions'
import Modal from '@/components/forms/modal/Modal'
import { showToast } from '@/lib/toast'
import { Employee, EmployeeSchema } from '@/schemas/employee.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller, UseFormRegister, FieldError, Control } from 'react-hook-form'
import React from 'react'
import InputField from '@/components/inputField'
import SelectField from '@/components/selectField'

interface Props {
  isOpen: boolean
  employee?: Employee | null
  onClose: () => void
}

const EmployeeFormModal = ({ isOpen, employee, onClose }: Props) => {
  const isEditMode = !!employee
  const title = isEditMode ? 'Editar usuario' : 'Agregar nuevo usuario'

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Employee>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      nombre: employee?.nombre ?? '',
      apellido: employee?.apellido ?? '',
      dni: employee?.dni ?? '',
      password: employee?.password ?? '',
      sexo: employee?.sexo ?? 'MASCULINO',
      email: employee?.email ?? '',
      telefono: employee?.telefono ?? '',
      direccion: employee?.direccion ?? '',
      especialidad: employee?.especialidad ?? '',
      roles: employee?.roles ?? [],
    },
  })

  const onSubmit = async (data: Employee) => {
    const response = await createOrUpdateEmployee(data)

    if (!response.success) {
      showToast('error', response.error)
      return
    }

    showToast('success', response.message)
    onClose()
  }

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonTitle={isEditMode ? 'Actualizar' : 'Agregar'}
    >
      <form className="space-y-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Nombre" name="nombre" register={register} error={errors.nombre} />
          <InputField label="Apellido" name="apellido" register={register} error={errors.apellido} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField label="DNI" name="dni" register={register} error={errors.dni} />
          <InputField label="Contraseña" name="password" register={register} error={errors.password} type="password" />
        </div>

        <InputField label="Email" name="email" register={register} error={errors.email} type="email" />

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Teléfono" name="telefono" register={register} error={errors.telefono} />
          <InputField label="Dirección" name="direccion" register={register} error={errors.direccion} />
        </div>

        <InputField label="Especialidad" name="especialidad" register={register} error={errors.especialidad} />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Sexo"
            id="sexo"
            error={errors.sexo}
            options={[
              { value: 'MASCULINO', label: 'Masculino' },
              { value: 'FEMENINO', label: 'Femenino' },
            ]}
            control={control}
          />

          <SelectField
            label="Rol"
            id="roles"
            error={Array.isArray(errors.roles) ? errors.roles[0] : errors.roles}
            options={[
              { value: 'ODONTOLOGO', label: 'Odontólogo' },
              { value: 'RECEPCIONISTA', label: 'Recepcionista' },
            ]}
            control={control}
          />
        </div>
      </form>
    </Modal>
  )
}

export default EmployeeFormModal