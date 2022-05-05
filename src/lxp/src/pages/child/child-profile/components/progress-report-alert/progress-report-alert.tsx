import { ChildDto } from '@ecdlink/core';
import { ComponentBaseProps, ListItem, ListItemProps } from '@ecdlink/ui';
import { addDays } from 'date-fns';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { childRegistrationConstants } from '@/constants/Child';
import { DateFormats } from '@/constants/Dates';
import { contentReportSelectors } from '@store/content/report';
import {
  getFollowingReportingPeriod,
  getReportingPeriod,
  isInFinalMonthOfReportingPeriod,
  isMatchingReportingPeriods,
} from '@utils/child/child-profile-utils';
import { isChildInitialRegistrationPeriod } from '@utils/child/child-progress-report.utils';
import ROUTES from '@routes/routes';

export interface ChildProgressReportAlertProps extends ComponentBaseProps {
  child: ChildDto;
}

const baseProgressReportListItem: ListItemProps = {
  key: 'progress-report',
  backgroundColor: 'white',
  withPaddingX: true,
  withPaddingY: true,
  title: '',
  subTitle: '',
  subTitleColor: 'textMid',
  iconName: 'PresentationChartLineIcon',
  iconColor: 'white',
  showChevronIcon: true,
  showIcon: true,
  showDivider: true,
  dividerColor: 'uiBg',
  dividerType: 'solid',
  iconBackgroundColor: 'primary',
};

export const ChildProgressReportAlert: React.FC<
  ChildProgressReportAlertProps
> = ({ child }) => {
  const history = useHistory();

  const childInsertedDate = child.insertedDate
    ? new Date(child.insertedDate)
    : undefined;
  const reportSummaries = useSelector(
    contentReportSelectors.getChildLatestCompletedReports(child.id)
  );
  const [latestCompletedSummary] = reportSummaries;

  const currentDate = new Date();

  const requiresInitialReport =
    !latestCompletedSummary && isChildInitialRegistrationPeriod(child);

  const currentReportingPeriodReportSummary = reportSummaries.find(
    (summary) =>
      summary.childId === child.id &&
      isMatchingReportingPeriods(new Date(summary.reportDate), currentDate)
  );

  const isCurrentlyInReportingOverduePeriod =
    isInFinalMonthOfReportingPeriod(currentDate);

  const reportingPeriod = !currentReportingPeriodReportSummary
    ? getReportingPeriod(currentDate)
    : getFollowingReportingPeriod(
        new Date(
          latestCompletedSummary?.reportDate
            ? latestCompletedSummary?.reportDate
            : currentReportingPeriodReportSummary.reportDate
        )
      );

  const reportDate = new Date(
    `${reportingPeriod.monthName}-01-${reportingPeriod.year}`
  );

  const navigateToChildProgressObservation = () => {
    history.push(ROUTES.CHILD_PROGRESS_OBSERVATION, {
      childId: child.id,
      reportingDate: reportDate,
    });
  };
  if (!childInsertedDate)
    return <div>Child does not have a valid inserted date...</div>;
  const getListItemProps = (): ListItemProps => {
    if (requiresInitialReport) {
      return {
        ...baseProgressReportListItem,
        title: 'First Observations',
        subTitle: `Track progress by ${addDays(
          childInsertedDate,
          childRegistrationConstants.firstProgressReportPeriod
        ).toLocaleString('en-za', DateFormats.standardDate)}`,
        subTitleColor: 'black',
        onButtonClick: navigateToChildProgressObservation,
      };
    }

    if (
      // the current date's month is either July or December and there is no summary
      isCurrentlyInReportingOverduePeriod &&
      !currentReportingPeriodReportSummary
    ) {
      return {
        ...baseProgressReportListItem,
        title: 'Create Report',
        subTitle: 'Progress observation report overdue',
        subTitleColor: 'errorMain',
        subTitleShape: 'square',
        onButtonClick: navigateToChildProgressObservation,
      };
    }

    return {
      ...baseProgressReportListItem,
      title: 'Progress observations',
      subTitle: `Next report due 30 ${reportingPeriod.monthName} ${reportingPeriod.year}`,
      subTitleColor: 'black',
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
