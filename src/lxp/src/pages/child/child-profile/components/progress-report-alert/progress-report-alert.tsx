import { ChildDto } from '@ecdlink/core';
import { ComponentBaseProps, ListItem, ListItemProps } from '@ecdlink/ui';
import { isBefore } from 'date-fns';
import { useHistory } from 'react-router';
import ROUTES from '@routes/routes';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';

export interface ChildProgressReportAlertProps extends ComponentBaseProps {
  child: ChildDto;
}

const baseProgressReportListItem: ListItemProps = {
  key: 'progress-report',
  backgroundColor: 'uiBg',
  withPaddingX: true,
  withPaddingY: true,
  title: '',
  titleTypographyType: 'h4',
  titleColor: 'textDark',
  subTitle: '',
  subTitleColor: 'textMid',
  iconName: 'PresentationChartLineIcon',
  iconColor: 'white',
  showChevronIcon: true,
  showIcon: true,
  showDivider: true,
  dividerColor: 'uiBg',
  dividerType: 'solid',
  iconBackgroundColor: 'tertiary',
};

export const ChildProgressReportAlert: React.FC<
  ChildProgressReportAlertProps
> = ({ child }) => {
  const history = useHistory();

  const { currentObservationPeriod, currentReport, observationsAgeGroup } =
    useObserveProgressForChild(child.id!);

  const navigateToChildProgressObservation = () => {
    history.push(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
      childId: child.id,
    });
  };

  const isInPeriod =
    !!currentObservationPeriod &&
    isBefore(new Date(), new Date(currentObservationPeriod.startDate)) &&
    isBefore(new Date(currentObservationPeriod.endDate), new Date());

  if (!currentObservationPeriod || !!currentReport?.dateCompleted) {
    return <></>;
  }

  const getListItemProps = (): ListItemProps => {
    if (
      !!observationsAgeGroup &&
      isInPeriod &&
      !currentReport?.observationsCompleteDate
    ) {
      return {
        ...baseProgressReportListItem,
        title: `<b>Create progress report</b>`,
        subTitle: `Report ${currentReport?.reportingPeriodNumber || 1}`,
        // iconName: 'InformationIcon',
        // iconBackgroundColor: 'infoMain',
        onButtonClick: navigateToChildProgressObservation,
      };
    }

    return {
      ...baseProgressReportListItem,
      title: `<b>Create progress report</b>`,
      subTitle: `All observations are done, time to create the report!`,
      onButtonClick: navigateToChildProgressObservation,
    };
  };

  return (
    <ListItem
      {...getListItemProps()}
      key={`child-profile-notification-${child.id}`}
    />
  );
};
