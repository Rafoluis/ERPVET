import { ReactNode } from "react";
import TableItem from "./TableItem";
import { cn } from "@/lib/classNames";

interface Props<T> {
  columns: ColumnHeader[];
  rows: T[];
  customRenderers?: {
    [key: string]: (row: T) => ReactNode;
  };
  customActions?: (row: T) => ReactNode; 
}

const Table = <T,>({
  columns,
  rows,
  customRenderers = {},
  customActions,
}: Props<T>): ReactNode => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((column) => (
            <th key={String(column.id)} className={cn(column.className, "p-2")}>
              {column.label}
            </th>
          ))}
          {customActions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <TableItem
            key={`row-${rowIndex}`}
            row={row}
            columns={columns}
            customRenderers={customRenderers}
            customActions={customActions}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
