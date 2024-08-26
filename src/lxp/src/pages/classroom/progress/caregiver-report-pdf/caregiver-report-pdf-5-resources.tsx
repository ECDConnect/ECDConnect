import { Card, Divider, Typography } from '@ecdlink/ui';
import { ProgressReportPeriod } from '@/models/progress/progress-report-period';
import { format } from 'date-fns';
import lightbulbEmoji from '@/assets/ECD_Connect_lightbulb.png';
import { ProgressReportsCategorySummary } from '@/models/progress/child-progress-report';
import { ProgressTrackingAgeGroupDto } from '@ecdlink/core';

export type ProgressCaregiverReportResourcesPageProps = {
  childFirstName: string;
  pageNumber: number;
  totalPages: number;
  reportingPeriodEndDate: Date;
};

export const ProgressCaregiverResourcesPage: React.FC<
  ProgressCaregiverReportResourcesPageProps
> = ({ childFirstName, pageNumber, totalPages, reportingPeriodEndDate }) => {
  return (
    <div
      className={'flex flex-col px-4 pb-4 pt-4'}
      style={{ height: '1400px' }}
    >
      <div className="mb-4 flex flex-row">
        <img src={lightbulbEmoji} className="mr-4 h-20 w-20" />
        <Typography
          type="h1"
          color="textDark"
          text={`Resources to help ${childFirstName} learn & grow`}
          className="mb-2"
        />
        <div
          className={`bg-quatenary mt-3 ml-auto mt-6 flex flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1`}
          style={{ height: 'fit-content', width: 'fit-content' }}
        >
          <Typography
            type="small"
            weight="bold"
            color="white"
            text={`${format(reportingPeriodEndDate, 'MMM yyy')}`}
            lineHeight={4}
            className="pb-3 text-center"
          />
        </div>
      </div>
      <Divider dividerType="dashed" className="mb-4" />
      <p
        className="font-body text-textDark mt-auto ml-auto"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        {`Page ${pageNumber} of ${totalPages}`}
      </p>
    </div>
  );
};
