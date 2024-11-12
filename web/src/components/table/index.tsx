import React from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode; // Optional render function
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

const Table = <T,>({ columns, data }: TableProps<T>) => {
  return (
    <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)} className="py-3 px-6 text-left">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-gray-700 text-sm font-light">
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-b border-gray-200 hover:bg-gray-100"
          >
            {columns.map((column) => (
              <td key={String(column.key)} className="py-3 px-6 text-left">
                {column.render ? column.render(row) : String(row[column.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
