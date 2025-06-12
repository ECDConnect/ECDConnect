import { practitionerSelectors } from '@/store/practitioner';
import { differenceInDays } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTenant } from './useTenant';
import { classroomsSelectors } from '@/store/classroom';
export const useIsTrialPeriod = () => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;

  const trialPeriod = useMemo(() => {
    if (practitioner?.startDate) {
      const differenceInDaysResult = differenceInDays(
        new Date(),
        new Date(practitioner?.startDate)
      );

      if (
        differenceInDaysResult <= 30 &&
        isOpenAccess &&
        !classroom?.preschoolCode
      ) {
        return true;
      } else {
        return false;
      }
    }
  }, [classroom?.preschoolCode, isOpenAccess, practitioner?.startDate]);

  return trialPeriod;
};
