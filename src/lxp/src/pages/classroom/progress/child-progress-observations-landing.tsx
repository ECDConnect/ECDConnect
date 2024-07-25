import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { ChildProgressObservationPageState } from '../progress-observation/child-progress-observation/child-progress-observation.types';
import { format } from 'date-fns';
import ROUTES from '@/routes/routes';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';

export const ChildProgressObservationsLanding: React.FC = () => {
  const history = useHistory();

  const { state: routeState } =
    useLocation<ChildProgressObservationPageState>();

  const { child, currentReportingPeriod, currentAgeGroup } =
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
        <div
          className={`mt-4 mb-4 flex flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1 bg-${
            currentAgeGroup?.color || 'secondary'
          }`}
          style={{ height: 'fit-content', width: 'fit-content' }}
        >
          <Typography
            type="buttonSmall"
            weight="bold"
            color="white"
            text={`${currentAgeGroup?.description} progress tracker`}
            lineHeight={4}
            className="text-center"
          />
        </div>

        <Button
          onClick={() =>
            history.push(ROUTES.PROGRESS_OBSERVATIONS, {
              childId: routeState?.childId,
            })
          }
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          icon="PencilIcon"
          text="Start"
          textColor="white"
        />
      </div>
    </BannerWrapper>
  );
};
