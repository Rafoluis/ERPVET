import { ReactNode } from 'react';

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
}: TableItemProps<T>) => {
  return (
    <tr className='border-b border-gray-200 even:bg-backgroundgray text-sm hover:bg-backhoverbutton'>
      {columns.map((column) => {
        const customRenderer = customRenderers[column.id];
        const value = (row as Record<string, unknown>)[column.id];

        return (
          <td key={`cell-${String(column.id)}`} className={'p-2 items-center gap-4'}>
            {customRenderer ? customRenderer(row) : String(value ?? '')}
          </td>
        );
      })}
      {customActions && <td className='flex gap-3'>{customActions(row)}</td>}
    </tr>
  );
};

export default TableItem;
