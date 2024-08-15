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

  const { currentReportingPeriod, currentReport, currentAgeGroup } =
    useObserveProgressForChild(child.id!);

  const navigateToChildProgressObservation = () => {
    history.push(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
      childId: child.id,
    });
  };

  const isInPeriod =
    !!currentReportingPeriod &&
    isBefore(new Date(), new Date(currentReportingPeriod.startDate)) &&
    isBefore(new Date(currentReportingPeriod.endDate), new Date());

  if (!currentReportingPeriod || !!currentReport?.dateCompleted) {
    return <></>;
  }

  const getListItemProps = (): ListItemProps => {
    if (
      !!currentAgeGroup &&
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
