import { ReactNode } from "react";

interface TableItemProps<T> {
  row: T;
  columns: ColumnHeader<T>[];
  customRenderers?: {
    [K in keyof T]?: (row: T) => ReactNode;
  };
  customActions?: (row: T) => ReactNode; 
}

const TableItem = <T,>({
  row,
  columns,
  customRenderers = {},
  customActions,
}: TableItemProps<T>) => {
  return (
    <tr className="border-b border-gray-300 even:bg-gray-200 text-sm hover:bg-sky-100">
      {columns.map((column) => {
        const customRenderer = customRenderers[column.id];
        const value = row[column.id];
        return (
          <td key={`cell-${String(column.id)}`} className={column.className}>
            {customRenderer ? customRenderer(row) : String(value)}
          </td>
        );
      })}
      {customActions && <td>{customActions(row)}</td>}
    </tr>
  );
};

export default TableItem;
