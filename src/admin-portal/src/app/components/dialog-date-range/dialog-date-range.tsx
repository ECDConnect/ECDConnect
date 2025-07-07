import { Button, renderIcon, Typography } from '@ecdlink/ui';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

export type DateRangeModalProps = {
  title: string;
  onSubmit: (body) => void;
  onCancel: () => void;
};

const DateRangeModal: React.FC<DateRangeModalProps> = ({
  title,
  onSubmit,
  onCancel,
}) => {
  const [startMonth, setStartMonth] = useState<Date>();
  const [endMonth, setEndMonth] = useState<Date>();

  return (
    <div className="px-4 py-4 bg-white overflow-hidden">
      {title?.length > 0 && (
        <div data-testid="title-wrapper">
          <Typography
            type={'h2'}
            weight="bold"
            text={title}
            color={'textDark'}
          />
        </div>
      )}

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">
              From
            </label>
            <DatePicker
              placeholderText={'Please select a date'}
              className="z-50 mt-1 w-full border-gray-300 rounded-md text-sm focus:border-primary focus:ring-primary shadow-sm"
              selected={startMonth ? startMonth : undefined}
              onChange={(date: Date) => setStartMonth(date)}
              dateFormat="EEE, dd MMM yyyy"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={80}
            />
          </div>
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">
              To
            </label>
            <DatePicker
              placeholderText={'Please select a date'}
              className="z-50 mt-1 w-full border-gray-300 rounded-md text-sm focus:border-primary focus:ring-primary shadow-sm"
              selected={endMonth ? endMonth : undefined}
              onChange={(date: Date) => setEndMonth(date)}
              dateFormat="EEE, dd MMM yyyy"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={80}
            />
          </div>
        </div>

        <div className="flex mt-56">
          <Button
            className={`w-full `}
            type={'filled'}
            color={'primary'}
            onClick={() => onSubmit({ startMonth, endMonth })}
          >
            <div className="flex flex-row items-center">
              {renderIcon('CheckCircleIcon', `text-white h-4 w-4 mr-2`)}
              <Typography
                type="body"
                color={'white'}
                text={'Filter'}
              ></Typography>
            </div>
          </Button>

          <Button
            className={`w-full ml-2`}
            type={'filled'}
            color={'primary'}
            onClick={onCancel}
          >
            <div className="flex flex-row items-center">
              {renderIcon('XCircleIcon', `text-white h-4 w-4 mr-2`)}
              <Typography
                type="body"
                color={'white'}
                text={'Cancel'}
              ></Typography>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeModal;
