import { ReactNode } from 'react';
import clsx from 'clsx';

interface TableItemProps<T> {
  row: T;
  columns: ColumnHeader[];
  customRenderers?: {
    [key: string]: (row: T) => ReactNode;
  };
  customActions?: (row: T) => ReactNode;
  className?: string;
}

const TableItem = <T,>({
  row,
  columns,
  customRenderers = {},
  customActions,
  className,
}: TableItemProps<T>) => {
  const rowClasses = clsx(
    "border-b border-gray-200 text-sm hover:bg-backhoverbutton even:bg-backgroundgray",
    className
  );

  return (
    <tr className={rowClasses}>
      {columns.map((column) => {
        const customRenderer = customRenderers[column.id];
        const value = (row as Record<string, unknown>)[column.id];

        return (
          <td key={`cell-${String(column.id)}`} className="p-2 align-middle">
            {customRenderer ? customRenderer(row) : String(value ?? '')}
          </td>
        );
      })}
      {customActions && (
        <td className="p-2">
          <div className="flex gap-3">{customActions(row)}</div>
        </td>
      )}
    </tr>
  );
};

export default TableItem;
