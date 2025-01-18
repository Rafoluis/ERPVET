import { ReactNode } from 'react';

interface Props<T extends { [K in keyof T]: string }> {
  columns: ColumnHeader<T>[];
  rows: T[];
  customRenderers?: {
    [K in keyof T]?: (row: T) => ReactNode;
  };
}

const Table = <T extends { [K in keyof T]: string }>({
  columns,
  rows,
  customRenderers = {},
}: Props<T>): ReactNode => {
  return (
    <table className='w-full mt-4'>
      <thead>
        <tr className='text-left text-gray-500 text-sm'>
          {columns.map((col) => (
            <th key={String(col.id)} className={col.className}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {columns.map((column) => {
              const customRenderer = customRenderers[column.id];
              const value = row[column.id];

              return (
                <td key={`cell-${String(column.id)}`}>
                  {customRenderer ? customRenderer(row) : String(value)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
