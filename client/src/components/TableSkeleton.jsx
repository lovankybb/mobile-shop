import React from 'react';

const TableSkeleton = ({ columns = 5, rows = 5 }) => {
  return (
    <>
      {[...Array(rows)].map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-gray-100 animate-pulse-slow">
          {[...Array(columns)].map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
