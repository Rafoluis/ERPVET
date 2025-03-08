import { cn } from '@/lib/classNames'
import { LucideProps } from 'lucide-react'
import React from 'react'

interface Props {
  icon: React.ReactElement<LucideProps>
  className?: string
  onClick?: () => void
  iconColor?: string
  hoverBgColor?: string
  hoverIconColor?: string
}

const baseContainerClasses = `
  group
  flex
  items-center
  justify-center
  cursor-pointer
  p-2
  bg-slate-100
  rounded-full
  transition-transform
  duration-200
  transform
  hover:scale-105
`

const baseIconClasses = `
  transition-colors
  duration-200
`

const TableAction = ({
  icon,
  className,
  onClick,
  iconColor = 'text-slate-500',
  hoverBgColor = 'hover:bg-slate-200',
  hoverIconColor,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        baseContainerClasses,
        hoverBgColor,
        className
      )}
    >
      {React.cloneElement(icon, {
        size: 14,
        className: cn(
          iconColor,
          hoverIconColor && `group-hover:${hoverIconColor}`,
          baseIconClasses,
          icon.props.className
        ),
      })}
    </div>
  )
}

export default TableAction
