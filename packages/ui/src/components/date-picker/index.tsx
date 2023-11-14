import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { renderIcon } from '../../utils';

interface DatePickerProps extends ReactDatePickerProps {
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, ...props }) => {
  return (
    <>
      {label && (
        <label className=" text-textDark mb-2 font-semibold">{label}</label>
      )}
      <div className="bg-uiBg relative z-20 w-full rounded-md p-1">
        <ReactDatePicker
          className="text-textDark relative z-10 w-full rounded-md border-0 bg-transparent"
          wrapperClassName="w-full"
          {...props}
        />
        {renderIcon(
          'CalendarIcon',
          'absolute z-0 text-primary top-3 right-4 w-6 h-6'
        )}
      </div>
    </>
  );
};
