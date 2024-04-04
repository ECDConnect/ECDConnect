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

  const reportingPeriod = !currentReportingPeriodReportSummary
    ? getReportingPeriod(currentDate, requiresInitialReport)
    : getFollowingReportingPeriod(
        new Date(
          latestCompletedSummary?.reportDate
            ? latestCompletedSummary?.reportDate
            : currentReportingPeriodReportSummary.reportDate
        )
      );

  const isCurrentlyInReportingOverduePeriod = isInFinalMonthOfReportingPeriod(
    reportingPeriod.monthName,
    currentDate
  );

  const reportDate = requiresInitialReport
    ? new Date(Date.UTC(2000, 0, 1))
    : new Date(
        Date.UTC(
          reportingPeriod.year,
          reportingPeriod.monthName === 'June' ? 5 : 10,
          1
        )
      );

  const navigateToChildProgressObservation = () => {
    history.push(ROUTES.CHILD_PROGRESS_OBSERVATION, {
      childId: child.id,
      firstObservation: requiresInitialReport,
      reportingDate: reportDate,
    });
  };
  if (!childInsertedDate)
    return <div>Child does not have a valid inserted date...</div>;
  const getListItemProps = (): ListItemProps => {
    if (requiresInitialReport) {
      return {
        ...baseProgressReportListItem,
        title: '<b>Start tracking progress</b>',
        subTitle: `First observations by <b>${addDays(
          childInsertedDate,
          childRegistrationConstants.firstProgressReportPeriod
        ).toLocaleString('en-za', DateFormats.dayWithShortMonthName)}</b>`,
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
        title: `<b>${reportingPeriod.monthName} progress report</b>`,
        subTitle: '<b>Overdue</b>',
        subTitleColor: 'alertMain',
        iconName: 'ExclamationIcon',
        iconBackgroundColor: 'alertMain',
        onButtonClick: navigateToChildProgressObservation,
      };
    }

    return {
      ...baseProgressReportListItem,
      title: `<b>${reportingPeriod.monthName} progress report</b>`,
      subTitle: `Complete by <b>30 ${reportingPeriod.monthName}</b>`,
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
