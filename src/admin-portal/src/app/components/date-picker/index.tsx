import React, { useState } from 'react';
import DateRangePickerCalendar from './DateRangePickerCalendar'; // Custom calendar component
import { format } from 'date-fns';
import * as styles from '../../pages/pages.styles';

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
      <button className={styles.mainButton} onClick={toggleCalendar}>
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
