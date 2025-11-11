import { classroomsSelectors } from '@/store/classroom';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { Card, Divider, ProgressBar, Typography } from '@ecdlink/ui';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

export const ProgressTabReportPeriodsCompleted: React.FC = () => {
  const reportPeriods = useSelector(
    classroomsSelectors.getAllProgressReportPeriods()
  );
  const allProgressReports = useSelector(
    progressTrackingSelectors.getProgressReports()
  );

  const reportProgress = reportPeriods.map((report) => {
    const reports = allProgressReports.filter(
      (r) => r.childProgressReportPeriodId === report.id
    );
    const completed = reports.filter((r) => !!r.dateCompleted).length;
    const percentage = reports.length ? (completed / reports.length) * 100 : 0;
    return {
      ...report,
      percentage,
    };
  });

  return (
    <div className="mt-2 flex flex-col justify-center p-4">
      <Typography
        color="textDark"
        text={'Your last reporting period for the year is complete!'}
        type={'h3'}
      />
      <Typography
        type="small"
        color="textMid"
        text={`Review your previous reports below`}
      />
      <Divider dividerType="dashed" className="my-2" />

      {reportProgress &&
        reportProgress.map((report, index) =>
          report.id ? (
            <div key={report.id}>
              <Typography
                color="textDark"
                text={`Report ${index + 1}`}
                type={'h3'}
              />
              <Typography
                type="small"
                color="textMid"
                text={`${format(
                  new Date(report?.startDate || ''),
                  'd MMM'
                )} - ${format(new Date(report?.endDate || ''), 'd MMM yyyy')}`}
              />
              <Card className="bg-uiBg mb-4 mt-4 flex rounded-2xl p-4">
                <div className="flex w-full flex-col justify-center">
                  <div className="mt-6 flex justify-center">
                    <ProgressBar
                      label={`${report.percentage}%`}
                      hint={'Reports completed'}
                      subLabel=""
                      isHiddenSubLabel={true}
                      value={report.percentage}
                      primaryColour={
                        report.percentage === 100 ? 'successMain' : 'alertMain'
                      }
                      secondaryColour="textLight"
                      textColour="textDark"
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
              <Divider dividerType="dashed" className="my-2" />
            </div>
          ) : null
        )}
    </div>
  );
};
