import { HealthCareWorkerSummaryForPeriodDto } from '@ecdlink/core';
import { Typography } from '@ecdlink/ui';

interface TeamLeadSummaryReportProps {
  summaryData: HealthCareWorkerSummaryForPeriodDto;
}

export const TeamLeadSummary: React.FC<TeamLeadSummaryReportProps> = ({
  summaryData,
}) => {
  return (
    <div>
      <div className="border-l-successMain  border-successMain m-10 mb-10  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          {/* Start main area*/}
          <div className="flex flex-row border-b-4 border-dashed pb-0">
            <Typography
              type={'h2'}
              text={'Summary'}
              color={'textMid'}
              className="my-4"
            />
          </div>
          <div className="flex w-full items-center justify-start gap-16">
            <div className="flex items-center gap-4">
              <Typography
                type={'h1'}
                fontSize="48"
                text={'2'}
                color={'textMid'}
                className="my-4"
              />
              <Typography
                type={'body'}
                text={'Clinics'}
                color={'textMid'}
                className="my-4"
              />
            </div>
            <div className="flex items-center gap-4">
              <Typography
                type={'h1'}
                fontSize="48"
                text={'6'}
                color={'textMid'}
                className="my-4"
              />
              <Typography
                type={'body'}
                text={'pregnant mom clients'}
                color={'textMid'}
                className="my-4 flex w-full flex-nowrap"
              />
            </div>
            <div className="flex items-center gap-4">
              <Typography
                type={'h1'}
                fontSize="48"
                text={'6'}
                color={'textMid'}
                className="my-4"
              />
              <Typography
                type={'body'}
                text={'child clients'}
                color={'textMid'}
                className="my-4 flex w-full flex-nowrap"
              />
            </div>
            <div className="flex items-center gap-4">
              <Typography
                type={'h1'}
                fontSize="48"
                text={'6'}
                color={'textMid'}
                className="my-4"
              />
              <Typography
                type={'body'}
                text={'in-field support visits completed in 2023'}
                color={'textMid'}
                className="my-4 flex w-full flex-nowrap"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
