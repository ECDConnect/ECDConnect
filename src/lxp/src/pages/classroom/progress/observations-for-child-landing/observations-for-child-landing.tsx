import { BannerWrapper, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { format } from 'date-fns';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';
import { ObservationsForChildLandingIncomplete } from './observations-for-child-landing-incomplete';
import { ObservationsForChildLandingComplete } from './observations-for-child-landing-complete';
import ROUTES from '@/routes/routes';
import ProgressWalkthroughWrapper from '../walkthrough/progress-walkthrough-wrapper';
import { useAppContext } from '@/walkthrougContext';
import { useProgressWalkthrough } from '@/hooks/useProgressWalkthrough';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export type ObservationsForChildLandingState = {
  childId: string;
};

export const ObservationsForChildLanding: React.FC = () => {
  const history = useHistory();
  const {
    state: { run: isWalkthrough, stepIndex },
  } = useAppContext();

  const { state: routeState } = useLocation<ObservationsForChildLandingState>();

  const {
    child,
    currentAge,
    currentObservationPeriod,
    observationsAgeGroup,
    currentReport,
  } = useObserveProgressForChild(routeState.childId);

  const { ageGroup, walkthroughReportingPeriod, walkthroughReport } =
    useProgressWalkthrough();

  const report = isWalkthrough ? walkthroughReport : currentReport;

  const { isOnline } = useOnlineStatus();

  return (
    <>
      <ProgressWalkthroughWrapper />
      <BannerWrapper
        size={'small'}
        onBack={() =>
          history.replace(ROUTES.CHILD_PROFILE, { childId: routeState.childId })
        }
        title={`Report ${
          isWalkthrough ? 1 : currentObservationPeriod?.reportNumber
        }`}
        subTitle={
          isWalkthrough
            ? 'Temba Sibaya'
            : `${child?.user?.firstName} ${child?.user?.surname}`
        }
        renderOverflow
        renderBorder={true}
        displayOffline={!isOnline}
      >
        <div className="flex h-full flex-col px-4 pt-4">
          <Typography
            type="h2"
            color="primary"
            text={`Report ${
              isWalkthrough ? '1' : currentObservationPeriod?.reportNumber
            }`}
          />
          <div id="progressWalkthroughStep1">
            <Typography
              type="h4"
              color="textMid"
              text={`${format(
                new Date(
                  currentObservationPeriod?.startDate ||
                    walkthroughReportingPeriod.startDate ||
                    ''
                ),
                'd MMM'
              )} - ${format(
                new Date(
                  currentObservationPeriod?.endDate ||
                    walkthroughReportingPeriod.endDate ||
                    ''
                ),
                'd MMM yyyy'
              )}`}
            />
          </div>
          {/* Current observations still in progress */}
          {((isWalkthrough && stepIndex < 5) ||
            !report?.observationsCompleteDate) && (
            <ObservationsForChildLandingIncomplete
              childId={routeState.childId}
              currentAgeGroup={isWalkthrough ? ageGroup : observationsAgeGroup!}
            />
          )}
          {/* All observations completed for current report period, but we are still outside the window */}
          {(isWalkthrough && stepIndex > 5) ||
            (!!report && !!report.observationsCompleteDate && (
              <ObservationsForChildLandingComplete
                childId={routeState.childId}
                childFirstName={
                  isWalkthrough ? 'Temba' : child!.user!.firstName!
                }
                ageInMonths={isWalkthrough ? 3 : currentAge || 0}
                currentReportingPeriod={
                  isWalkthrough
                    ? walkthroughReportingPeriod
                    : currentObservationPeriod!
                }
                currentReport={isWalkthrough ? walkthroughReport : report}
                currentAgeGroup={
                  isWalkthrough ? ageGroup : observationsAgeGroup
                }
              />
            ))}
        </div>
      </BannerWrapper>
    </>
  );
};
