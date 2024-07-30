import { ListItem } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { ChildProgressDetailedReport } from '@/models/progress/child-progress-report';
import { format } from 'date-fns';

export type ProgressReportsListProps = {
  childId: string;
  currentReport: ChildProgressDetailedReport | undefined;
  pastReports: ChildProgressDetailedReport[];
};

export const ProgressReportsList: React.FC<ProgressReportsListProps> = ({
  childId,
  currentReport: currentProgress,
  pastReports,
}) => {
  const history = useHistory();

  return (
    <>
      {!!currentProgress && (
        <ListItem
          key={`report-period-${currentProgress.reportingPeriodId}`}
          title={`Report ${
            currentProgress.reportingPeriodNumber
          } - ${currentProgress.reportingPeriodStartDate.getFullYear()}`}
          subTitle={`${format(
            currentProgress.reportingPeriodStartDate,
            'd MMM'
          )} and ${format(
            currentProgress.reportingPeriodEndDate,
            'd MMM yyyy'
          )}`}
          buttonType={'filled'}
          buttonIcon={'PencilIcon'}
          buttonText={'Edit'}
          buttonTextColor={'white'}
          buttonColor={'quatenary'}
          showButton={true}
          showDivider={true}
          withBorderRadius={false}
          dividerType={'dashed'}
          withPaddingY={true}
          onButtonClick={() =>
            history.push(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
              childId: childId,
            })
          }
        />
      )}
      {pastReports.map((report) => (
        <ListItem
          key={`report-period-${report.reportingPeriodId}`}
          title={`Report ${
            report.reportingPeriodNumber
          } - ${report.reportingPeriodStartDate.getFullYear()}`}
          subTitle={`${format(
            report.reportingPeriodStartDate,
            'd MMM'
          )} and ${format(report.reportingPeriodEndDate, 'd MMM yyyy')}`}
          buttonType={'filled'}
          buttonIcon={'EyeIcon'}
          buttonText={'View'}
          buttonTextColor={'secondary'}
          buttonColor={'secondaryAccent2'}
          showButton={true}
          showDivider={true}
          withBorderRadius={false}
          dividerType={'dashed'}
          withPaddingY={true}
          onButtonClick={() => {}} // TODO - Go to report view
        />
      ))}
    </>
  );
};
