import { practitionerSelectors } from '@/store/practitioner';
import { differenceInDays } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTenant } from './useTenant';
import { classroomsSelectors } from '@/store/classroom';
export const useIsTrialPeriod = () => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const clasroom = useSelector(classroomsSelectors.getClassroom);
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;

  const trialPeriod = useMemo(() => {
    if (practitioner?.startDate) {
      const differenceInDaysResult = differenceInDays(
        new Date(practitioner?.startDate),
        new Date()
      );

      if (differenceInDaysResult <= 30 && isOpenAccess && !clasroom?.name) {
        return true;
      } else {
        return false;
      }
    }
  }, [clasroom?.name, isOpenAccess, practitioner?.startDate]);

  return trialPeriod;
};
