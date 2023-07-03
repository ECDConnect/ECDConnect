import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';

const DateRangePickerCalendar = ({ selectedRange, onDateChange }) => {
  const [calendarRange, setCalendarRange] = useState([
    {
      startDate: selectedRange[0],
      endDate: selectedRange[1],
      key: 'selection',
    },
  ]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setCalendarRange([ranges.selection]);
    onDateChange([startDate, endDate]);
  };

  return (
    <div>
      <DateRangePicker
        ranges={calendarRange}
        onChange={handleSelect}
        months={2}
        direction="horizontal"
      />
    </div>
  );
};

export default DateRangePickerCalendar;
