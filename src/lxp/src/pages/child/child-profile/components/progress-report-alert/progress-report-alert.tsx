import { ChildDto } from '@ecdlink/core';
import {
  Card,
  ComponentBaseProps,
  ListItem,
  ListItemProps,
  renderIcon,
  RoundIcon,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { isBefore } from 'date-fns';
import { useHistory } from 'react-router';
import ROUTES from '@routes/routes';
import { useProgressForChild } from '@/hooks/useProgressForChild';

export interface ChildProgressReportAlertProps extends ComponentBaseProps {
  child: ChildDto;
}

export const ChildProgressReportAlert: React.FC<
  ChildProgressReportAlertProps
> = ({ child }) => {
  const history = useHistory();

  const { currentReportingPeriod, currentReport } = useProgressForChild(
    child.id!
  );

  const navigateToChildProgressObservation = () => {
    history.push(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
      childId: child.id,
    });
  };

  const isInPeriod =
    !!currentReportingPeriod &&
    isBefore(currentReportingPeriod.startDate, new Date()) &&
    isBefore(new Date(), currentReportingPeriod.endDate);

  if (
    !isInPeriod ||
    !currentReportingPeriod ||
    !!currentReport?.dateCompleted
  ) {
    return <></>;
  }

  return (
    <Card
      className="bg-uiBg m-4 flex cursor-pointer flex-row items-center gap-1 rounded-2xl p-4 text-white"
      onClick={navigateToChildProgressObservation}
    >
      <RoundIcon
        backgroundColor="quatenary"
        icon="PresentationChartLineIcon"
        iconColor="white"
      />
      <div className="ml-2 flex flex-col">
        <Typography
          type="h4"
          color="textDark"
          text={'Create progress report'}
        />
        <div className="flex flex-row items-center pl-0.5">
          {!!currentReport?.observationsCompleteDate && (
            <div className={'bg-successMain h-2.5 w-2.5 rounded-full'} />
          )}
          {!currentReport?.observationsCompleteDate && (
            <RoundIcon
              iconColor="infoMain"
              backgroundColor="white"
              icon="InformationCircleIcon"
              size={{ h: '2', w: '2' }}
              iconSize={{ h: '4', w: '4' }}
            />
          )}
          <Typography
            type="body"
            color="textMid"
            className="ml-2"
            text={
              !currentReport?.observationsCompleteDate
                ? `Report ${
                    currentReport?.reportingPeriodNumber ||
                    currentReportingPeriod.reportNumber
                  }`
                : `All observations are done, time to create the report!`
            }
          />
        </div>
      </div>
      <div className="ml-auto">
        {renderIcon('ChevronRightIcon', 'h-10 w-10 text-textMid')}
      </div>
    </Card>
  );
};
