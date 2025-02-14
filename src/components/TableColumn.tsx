'use client'

import { MoveDown } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

interface Props {
  accessor: string
  className: string
  header: string
}

const TableColumn = ({ accessor, className, header }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const sort = searchParams.get("sort") || "asc"
  const column = searchParams.get("column")

  const handleOrder = () => {
    const newSort = sort === "asc" ? "desc" : "asc"

    const params = new URLSearchParams(searchParams)
    params.set("sort", newSort)
    params.set("column", accessor)

    router.push(`?${params.toString()}`)
  }

  return (
    <th key={accessor} className={`${className}`}>
      <div className="flex items-center gap-2">
        <span>
          {header}
        </span>
        {
          sort === 'asc' && column === accessor ? (
            <MoveDown 
              size={12} 
              className="cursor-pointer" 
              onClick={handleOrder} 
            />
          ) : (
            <MoveDown 
              size={12} 
              className="cursor-pointer transform rotate-180" 
              onClick={handleOrder}
            />
          )
        }
      </div>
    </th>
  )
}

export default TableColumn
