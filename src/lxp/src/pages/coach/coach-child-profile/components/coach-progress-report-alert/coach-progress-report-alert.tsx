import { ChildDto } from '@ecdlink/core';
import { ComponentBaseProps, ListItem, ListItemProps } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import ROUTES from '@routes/routes';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';

export interface CoachChildProgressReportAlertProps extends ComponentBaseProps {
  child: ChildDto;
}

const baseProgressReportListItem: ListItemProps = {
  key: 'progress-report',
  backgroundColor: 'uiBg',
  withPaddingX: true,
  withPaddingY: true,
  title: '',
  subTitle: '',
  subTitleColor: 'textMid',
  iconName: 'PresentationChartLineIcon',
  iconColor: 'white',
  showChevronIcon: false,
  showIcon: true,
  showDivider: true,
  dividerColor: 'uiBg',
  dividerType: 'solid',
  iconBackgroundColor: 'alertMain',
};

export const CoachChildProgressReportAlert: React.FC<
  CoachChildProgressReportAlertProps
> = ({ child }) => {
  const history = useHistory();

  const childInsertedDate = child.insertedDate
    ? new Date(child.insertedDate)
    : undefined;

  const { currentReport } = useObserveProgressForChild(child.id!);

  const navigateToChildProgressObservation = () => {
    history.push(ROUTES.PROGRESS_REPORT_LIST, {
      childId: child.id,
    });
  };

  if (!childInsertedDate)
    return <div>Child does not have a valid inserted date...</div>;
  const getListItemProps = (): ListItemProps => {
    if (!!currentReport && !currentReport.dateCompleted) {
      return {
        ...baseProgressReportListItem,
        title: 'Create Report',
        subTitle: 'Progress observation report due',
        subTitleColor: 'errorMain',
        subTitleShape: 'square',
        onButtonClick: navigateToChildProgressObservation,
      };
    }

    return {
      ...baseProgressReportListItem,
    };
  };

  return (
    <ListItem
      {...getListItemProps()}
      key={`child-profile-notification-${child.id}`}
    />
  );
};
