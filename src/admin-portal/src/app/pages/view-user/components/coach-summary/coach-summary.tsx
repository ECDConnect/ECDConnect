import { CoachStatsDto } from '@ecdlink/core';
import { Divider, Typography } from '@ecdlink/ui';

interface CoachSummaryProps {
  summaryData: CoachStatsDto;
}

export const CoachSummary: React.FC<CoachSummaryProps> = ({ summaryData }) => {
  return (
    <div className="border-l-secondary border-secondary my-6 rounded-2xl border-2  border-l-8 bg-white lg:min-w-0 lg:flex-1">
      <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Start main area*/}
        <Typography type="h2" text={'Summary'} color={'textMid'} />
        <Divider dividerType="dashed" className="my-4" />
        <div className="ml-8 flex flex-row flex-wrap justify-start gap-32 text-current">
          <div className="flex items-center gap-4">
            <Typography
              type={'h1'}
              hasMarkup
              fontSize="48"
              text={
                (summaryData?.totalPractitioners !== undefined &&
                  String(summaryData?.totalPractitioners)) ||
                '0'
              }
              color={'textMid'}
            />
            <Typography
              type={'body'}
              text={'practitioners'}
              color={'textMid'}
            />
          </div>
          <div className="flex items-center gap-4">
            <Typography
              type={'h1'}
              hasMarkup
              fontSize="48"
              text={
                (summaryData?.totalNewPractitioners !== undefined &&
                  String(summaryData?.totalNewPractitioners)) ||
                '0'
              }
              color={'textMid'}
            />
            <Typography
              type={'body'}
              text={'new practitioners'}
              color={'textMid'}
            />
          </div>
          <div className="flex items-center gap-4">
            <Typography
              type={'h1'}
              hasMarkup
              fontSize="48"
              text={
                (summaryData?.totalSiteVisits !== undefined &&
                  String(summaryData?.totalSiteVisits)) ||
                '0'
              }
              color={'textMid'}
            />
            <Typography type={'body'} text={'site visits'} color={'textMid'} />
          </div>
        </div>
        {/* End main area */}
      </div>
    </div>
  );
};
