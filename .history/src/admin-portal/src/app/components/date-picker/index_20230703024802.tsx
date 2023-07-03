import React, { useState } from 'react';
import { format } from 'date-fns';
import DateRangePickerCalendar from './DateRangePickerCalendar'; // Custom calendar component
import { ChevronDownIcon } from '@heroicons/react/solid';


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
                className="flex flex-row border-2 border-secondary hover:bg-secondary hover:text-white text-secondary font-bold py-2 px-4 rounded"
                onClick={toggleCalendar}
            >
                {props.selectedRange?.length > 0 ? (
                    <>
                        {formatDate(props.selectedRange[0])} - {formatDate(props.selectedRange[1])}
                    </>
                ) : (
                    'Filter by Date'
                )}
                {(props.selectedRange?.length === 0) && <ChevronDownIcon className='text-secondary w-10 h-10 mt-2'></ChevronDownIcon>}
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
