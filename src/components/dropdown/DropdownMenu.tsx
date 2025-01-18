import { ReactNode, use } from "react"
import { DropdownContext } from "./Dropdown"

interface Props {
  children: ReactNode
}

const DropdownMenu = ({children}: Props) => {
  const {isOpen} = use(DropdownContext)

  return (
    isOpen && (
      <div className="absolute top-full right-0 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
        {children}
      </div>
    )
  )
}

export default DropdownMenu