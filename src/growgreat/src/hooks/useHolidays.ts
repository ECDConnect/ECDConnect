import { isSameDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';

export const useHolidays = () => {
  const holidays = useSelector(staticDataSelectors.getHolidays);

  const isHoliday = (date: number | Date) => {
    return holidays.some((holiday) => isSameDay(new Date(holiday.day), date));
  };

  return {
    holidays,
    isHoliday,
  };
};
