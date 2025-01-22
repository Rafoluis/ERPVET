import { createPortal } from 'react-dom'

interface Props {
  title?: string
  isOpen: boolean
  children?: React.ReactNode
  onClose: () => void
}

const Modal = ({ title, children, isOpen, onClose }: Props) => {
  if (!isOpen) return null

  return createPortal(
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
      className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'
    >
      <div className='bg-white p-6 rounded shadow-lg w-[550px] h-[480px] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 id='modal-title' className='text-xl font-semibold'>{title}</h2>
          <button onClick={onClose}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
