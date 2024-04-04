import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { renderIcon } from '../../utils';
import Typography from '../typography/typography';

interface DatePickerProps extends ReactDatePickerProps {
  label?: string;
  hint?: string;
  hideCalendarIcon?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  hint,
  hideCalendarIcon,
  ...props
}) => {
  return (
    <>
      {label && <label className="text-textDark font-semibold">{label}</label>}
      {hint && <Typography type="help" color="textMid" text={hint} />}
      <div className="bg-uiBg relative z-20 mt-2 w-full rounded-md p-1">
        <ReactDatePicker
          className="text-textDark relative z-10 w-full rounded-md border-0 bg-transparent"
          wrapperClassName="w-full"
          {...props}
        />
        {!hideCalendarIcon &&
          renderIcon(
            'CalendarIcon',
            'absolute z-0 text-primary top-3 right-4 w-6 h-6'
          )}
      </div>
    </>
  );
};
