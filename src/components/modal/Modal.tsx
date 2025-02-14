import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect } from 'react'

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <section
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg transform transition-all animate-slide-up"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            aria-label="Cerrar modal"
            className="text-gray-500 hover:text-gray-700 transition"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="flex justify-end gap-3 mt-6">
          <button
            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
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
