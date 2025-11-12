
import React from 'react';

// fix: Export the Column interface to be used in other components for type safety.
export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  // Add a unique key accessor for React list rendering
  keyAccessor: keyof T;
}

const DataTable = <T extends object,>(
  { data, columns, keyAccessor }: DataTableProps<T>
) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((item, index) => (
            <tr key={String(item[keyAccessor]) || index} className="hover:bg-slate-50">
              {columns.map((col) => (
                <td
                  key={`${col.header}-${String(item[keyAccessor]) || index}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-slate-700"
                >
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : (item[col.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;