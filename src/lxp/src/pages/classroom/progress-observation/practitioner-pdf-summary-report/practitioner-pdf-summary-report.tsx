import { useAppDispatch } from '@/store';
import {
  progressTrackingSelectors,
  progressTrackingThunkActions,
} from '@/store/progress-tracking';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const PractitionerPdfSummaryReport = () => {
  const appDispatch = useAppDispatch();
  const progressSummary = useSelector(
    progressTrackingSelectors?.getPractitionerProgressReportSummary
  );

  console.log({ progressSummary });

  const fetchData = useCallback(async () => {
    await appDispatch(
      progressTrackingThunkActions.getPractitionerProgressReportSummary({
        reportingPeriod: 'Nov 2023',
      })
    );
  }, [appDispatch]);

  useEffect(() => {
    fetchData();
  }, []);

  return <div></div>;
};
