import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePickerCalendar  from './DateRangePickerCalendar'; // Custom calendar component

function CustomDateRangePicker(props) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState<Date[]>([]);
  
  const handleDateChange = (range: Date[]) => {
    setSelectedRange(range);
  };

  const toggleCalendar = () => {
    setShowCalendar((prevShowCalendar) => !prevShowCalendar);
  };

  const formatDate = (date: Date) => {
    return format(date, 'MM/dd/yyyy');
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={toggleCalendar}
      >
        {selectedRange.length > 0 ? (
          <>
            {formatDate(selectedRange[0])} - {formatDate(selectedRange[1])}
          </>
        ) : (
          'Filter by Date'
        )}
      </button>

      {showCalendar && (
        <DateRangePickerCalendar
          selectedRange={selectedRange}
          onDateChange={handleDateChange}
        />
      )}
    </div>
  );
}

export default CustomDateRangePicker;
