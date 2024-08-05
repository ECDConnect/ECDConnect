import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { differenceInMonths } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useProgressTracking = () => {
  const currentReportingPeriod = useSelector(
    classroomsSelectors.getCurrentProgressReportPeriod()
  );

  const isReportWindowSet = useSelector(
    classroomsSelectors.getIsReportingPeriodsSet()
  );

  const currentReports = useSelector(
    progressTrackingSelectors.getProgressReportsForReportingPeriod(
      currentReportingPeriod?.id || ''
    )
  );

  const baseChildren = useSelector(childrenSelectors.getChildren);

  const children = useMemo(() => {
    //TODO - calc secondary message
    return baseChildren?.map((child) => ({
      ...child,
      ageInMonths: !!child.user?.dateOfBirth
        ? differenceInMonths(new Date(), new Date(child.user.dateOfBirth))
        : undefined,
    }));
  }, [baseChildren]);

  return {
    isReportWindowSet,
    currentReportingPeriod,
    currentReports,
    children,
  };
};
