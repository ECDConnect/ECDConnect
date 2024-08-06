import { BannerWrapper, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { ChildProgressObservationPageState } from '../../progress-observation/child-progress-observation/child-progress-observation.types';
import { format } from 'date-fns';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import { ProgressLandingNoObservations } from './progress-landing-incomplete';
import { ProgressLandingComplete } from './progress-landing-complete';

export const ChildProgressObservationsLanding: React.FC = () => {
  const history = useHistory();

  const { state: routeState } =
    useLocation<ChildProgressObservationPageState>();

  const { child, currentReportingPeriod, currentAgeGroup, currentReport } =
    useObserveProgressForChild(routeState.childId);

  return (
    <BannerWrapper
      size={'small'}
      onBack={() => history.goBack()}
      title={`Report ${currentReportingPeriod?.reportNumber}`}
      subTitle={`${child?.user?.firstName} ${child?.user?.surname}`}
      renderOverflow
    >
      <div className="flex h-full flex-col px-4 pt-4">
        <Typography
          type="h2"
          color="primary"
          text={`Report ${currentReportingPeriod?.reportNumber}`}
        />
        <Typography
          type="h4"
          color="textMid"
          text={`${format(
            new Date(currentReportingPeriod?.startDate || ''),
            'd MMM'
          )} and ${format(
            new Date(currentReportingPeriod?.endDate || ''),
            'd MMM yyyy'
          )}`}
        />
        {/* Current observations still in progress */}
        {!currentReport?.isAllObservationsComplete && (
          <ProgressLandingNoObservations
            childId={routeState.childId}
            currentAgeGroup={currentAgeGroup!}
          />
        )}
        {/* All observations completed for current report period, but we are still outside the window */}
        {!!currentReport?.isAllObservationsComplete && currentReport && (
          <ProgressLandingComplete
            childId={routeState.childId}
            child={child!}
            currentReportingPeriod={currentReportingPeriod!}
            currentReport={currentReport}
            currentAgeGroup={currentAgeGroup}
          />
        )}
      </div>
    </BannerWrapper>
  );
};
