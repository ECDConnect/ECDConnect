import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function UserTable({ rows = [], urlRow, component }) {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelect = (row) => {
    const isSelected = selectedRows.includes(row);
    let updatedSelectedRows = [];

    if (isSelected) {
      updatedSelectedRows = selectedRows.filter(
        (selectedRow) => selectedRow !== row
      );
    } else {
      updatedSelectedRows = [...selectedRows, row];
    }

    setSelectedRows(updatedSelectedRows);
  };

  const formatDate = (value) => {
    try {
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      return `${day}/${month}/${year}`;
    } catch (e) {
      return 'N/A';
    }
  };

  const viewSelectedRow = (selectedRow) => {
    localStorage.setItem(
      'selectedUser',
      selectedRow?.userId ?? selectedRow?.id
    );

    history.push({
      pathname: urlRow,
      state: {
        component: component,
        userId: selectedRow?.userId,
      },
    });
  };

  return (
    <div className="container mx-auto p-2 dark:text-gray-100 sm:p-4">
      <h2 className="leadi mb-4 text-2xl font-semibold">Emails</h2>
      <div className="flex flex-col overflow-x-auto text-xs">
        <div className="flex text-left dark:bg-gray-700">
          <div className="flex w-8 items-center justify-center px-2 py-3 sm:p-3">
            <input
              type="checkbox"
              name="All"
              className="accent-violet-400 h-3 w-3 rounded-sm"
            />
          </div>
          <div className="w-32 px-2 py-3 sm:p-3">Sender</div>
          <div className="flex-1 px-2 py-3 sm:p-3">Message</div>
          <div className="hidden w-24 px-2 py-3 text-right sm:block sm:p-3">
            Received
          </div>
        </div>
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex w-8 items-center justify-center px-2 py-3 sm:p-3">
              <input
                type="checkbox"
                className="accent-violet-400 h-3 w-3 rounded-sm"
                name={`Box${index}`}
                checked={selectedRows.includes(row)}
                onChange={() => handleRowSelect(row)}
              />
            </div>
            <div className="w-32 px-2 py-3 sm:p-3">
              <p>{row.sender}</p>
            </div>
            <div className="block flex-1 truncate px-2 py-3 sm:w-auto sm:p-3">
              {row.message}
            </div>
            <div className="hidden w-24 px-2 py-3 text-right dark:text-gray-400 sm:block sm:p-3">
              <p>{formatDate(row.received)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
