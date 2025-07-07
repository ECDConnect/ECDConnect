import React, { useState } from 'react';
import DateRangePickerCalendar from './DateRangePickerCalendar'; // Custom calendar component
import { format } from 'date-fns';

function CustomDateRangePicker(props: any) {
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = () => {
    setShowCalendar((prevShowCalendar) => !prevShowCalendar);
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <div>
      <button
        className="border-secondary hover:bg-secondary text-secondary flex flex-row rounded border-2 py-2 px-4 font-bold hover:text-white"
        onClick={toggleCalendar}
      >
        {props?.selectedRange?.length > 0 ? (
          <>
            {formatDate(props?.selectedRange?.[0])} -{' '}
            {formatDate(props?.selectedRange?.[1])}
          </>
        ) : null}
      </button>

      {showCalendar && (
        <DateRangePickerCalendar
          selectedRange={props?.selectedRange}
          onDateChange={props?.handleDateChange}
        />
      )}
    </div>
  );
}

export default CustomDateRangePicker;
