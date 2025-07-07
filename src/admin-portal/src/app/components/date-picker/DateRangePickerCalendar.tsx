import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';

const DateRangePickerCalendar = ({ selectedRange, onDateChange }) => {
  const renderStaticRangeLabel = (range) => null; // Return null to remove the sidebar labels

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
        color="#1DBADF"
        rangeColors={['#1DBADF']}
        ranges={[calendarRange]}
        onChange={handleSelect}
        months={2}
        direction="horizontal"
        renderStaticRangeLabel={renderStaticRangeLabel} // Set the custom renderStaticRangeLabel prop
      />
    </div>
  );
};

export default DateRangePickerCalendar;
