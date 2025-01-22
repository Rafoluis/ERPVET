import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface Props {
  title?: string
  isOpen: boolean
  children?: React.ReactNode
  onClose: () => void
  primaryButtonTitle?: string
  onSubmit?: () => void
}

const Modal = ({
  title,
  children,
  isOpen,
  primaryButtonTitle = 'Agregar',
  onClose,
  onSubmit,
}: Props) => {
  if (!isOpen) return null

  return createPortal(
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
      className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'
    >
      <section className='bg-white p-6 rounded shadow-lg w-[550px] max-h-[480px] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 id='modal-title' className='text-xl font-semibold'>
            {title}
          </h2>

          <X className='cursor-pointer' onClick={onClose} />
        </div>

        <main>{children}</main>

        <footer className='flex justify-end gap-4 mt-4'>
          <button
            className='bg-slate-200 py-2 px-4 rounded hover:bg-slate-300 text-gray-400'
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700'
            onClick={onSubmit}
          >
            {primaryButtonTitle}
          </button>
        </footer>
      </section>
    </div>,
    document.body
  )
}

export default Modal
