import { cn } from '@/lib/classNames'
import { LucideProps } from 'lucide-react'
import React from 'react'

interface Props {
  icon: React.ReactElement<LucideProps>
  className?: string
  onClick?: () => void
}

const TableAction = ({ icon, className, onClick }: Props) => {
  return (
    <div
      className={cn(
        'cursor-pointer p-2 bg-slate-100 rounded-full hover:bg-slate-200',
        className
      )}
      onClick={onClick}
    >
      {React.cloneElement(icon, {
        size: 14,
        className: cn('text-slate-500', icon.props.className),
      })}
    </div>
  )
}

export default TableAction
