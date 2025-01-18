import { ReactNode } from "react";
import TableItem from "./TableItem";

interface Props<T,> {
  columns: ColumnHeader<T>[];
  rows: T[];
  customRenderers?: {
    [K in keyof T]?: (row: T) => ReactNode;
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
          {columns.map((col) => (
            <th key={String(col.id)} className={col.className}>
              {col.label}
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
