import { ListItem } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { ChildProgressDetailedReport } from '@/models/progress/child-progress-report';
import { format } from 'date-fns';

export type ProgressReportsListProps = {
  childId: string;
  reports: ChildProgressDetailedReport[];
};

export const ProgressReportsList: React.FC<ProgressReportsListProps> = ({
  childId,
  reports,
}) => {
  const history = useHistory();

  return (
    <>
      {reports
        .filter((report) => !report.dateCompleted)
        .map((report) => (
          <ListItem
            key={`report-period-${report.childProgressReportPeriodId}`}
            title={`Report ${
              report.reportingPeriodNumber
            } - ${report.reportingPeriodStartDate.getFullYear()}`}
            subTitle={`${format(
              report.reportingPeriodStartDate,
              'd MMM'
            )} - ${format(report.reportingPeriodEndDate, 'd MMM yyyy')}`}
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
        ))}
      {reports
        .filter((report) => !!report.dateCompleted)
        .map((report) => (
          <ListItem
            key={`report-period-${report.childProgressReportPeriodId}`}
            title={`Report ${
              report.reportingPeriodNumber
            } - ${report.reportingPeriodStartDate.getFullYear()}`}
            subTitle={`${format(
              report.reportingPeriodStartDate,
              'd MMM'
            )} - ${format(report.reportingPeriodEndDate, 'd MMM yyyy')}`}
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
            onButtonClick={() =>
              history.push(ROUTES.PROGRESS_VIEW_REPORT, {
                childId: childId,
                reportId: report.id,
              })
            }
          />
        ))}
    </>
  );
};
