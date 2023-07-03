import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePickerCalendar from './DateRangePickerCalendar'; // Custom calendar component


function CustomDateRangePicker(props: any
) {
    const [showCalendar, setShowCalendar] = useState(false);

    const toggleCalendar = () => {
        setShowCalendar((prevShowCalendar) => !prevShowCalendar);
    };

    const formatDate = (date: Date) => {
        return format(date, 'MM/dd/yyyy');
    };

    return (
        <div>
            <button
                className="border-2 border-secondary hover:bg-blue-700 text-secondary font-bold py-2 px-4 rounded"
                onClick={toggleCalendar}
            >
                {props.selectedRange?.length > 0 ? (
                    <>
                        {formatDate(props.selectedRange[0])} - {formatDate(props.selectedRange[1])}
                    </>
                ) : (
                    'Filter by Date'
                )}
            </button>

            {showCalendar && (
                <DateRangePickerCalendar
                    selectedRange={props.selectedRange}
                    onDateChange={props.handleDateChange}
                />
            )}
        </div>
    );
}

export default CustomDateRangePicker;
