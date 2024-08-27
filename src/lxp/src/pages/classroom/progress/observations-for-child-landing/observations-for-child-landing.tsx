import { BannerWrapper, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { format } from 'date-fns';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import { ObservationsForChildLandingIncomplete } from './observations-for-child-landing-incomplete';
import { ObservationsForChildLandingComplete } from './observations-for-child-landing-complete';

export type ObservationsForChildLandingState = {
  childId: string;
};

export const ObservationsForChildLanding: React.FC = () => {
  const history = useHistory();

  const { state: routeState } = useLocation<ObservationsForChildLandingState>();

  const {
    child,
    currentObservationPeriod,
    observationsAgeGroup,
    detailedObservations,
  } = useObserveProgressForChild(routeState.childId);

  return (
    <BannerWrapper
      size={'small'}
      onBack={() => history.goBack()}
      title={`Report ${currentObservationPeriod?.reportNumber}`}
      subTitle={`${child?.user?.firstName} ${child?.user?.surname}`}
      renderOverflow
    >
      <div className="flex h-full flex-col px-4 pt-4">
        <Typography
          type="h2"
          color="primary"
          text={`Report ${currentObservationPeriod?.reportNumber}`}
        />
        <Typography
          type="h4"
          color="textMid"
          text={`${format(
            new Date(currentObservationPeriod?.startDate || ''),
            'd MMM'
          )} and ${format(
            new Date(currentObservationPeriod?.endDate || ''),
            'd MMM yyyy'
          )}`}
        />
        {/* Current observations still in progress */}
        {!detailedObservations?.observationsCompleteDate && (
          <ObservationsForChildLandingIncomplete
            childId={routeState.childId}
            currentAgeGroup={observationsAgeGroup!}
          />
        )}
        {/* All observations completed for current report period, but we are still outside the window */}
        {!!detailedObservations?.observationsCompleteDate &&
          detailedObservations && (
            <ObservationsForChildLandingComplete
              childId={routeState.childId}
              child={child!}
              currentReportingPeriod={currentObservationPeriod!}
              currentReport={detailedObservations}
              currentAgeGroup={observationsAgeGroup}
            />
          )}
      </div>
    </BannerWrapper>
  );
};
