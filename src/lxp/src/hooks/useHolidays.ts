import { isSameDay, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';

export const useHolidays = () => {
  const holidays = useSelector(staticDataSelectors.getHolidays);

  const isHoliday = (date: number | Date) => {
    return holidays.some((holiday) =>
      isSameDay(parseISO(holiday.day.replace('Z', '')), date)
    );
  };

  return {
    holidays,
    isHoliday,
  };
};
