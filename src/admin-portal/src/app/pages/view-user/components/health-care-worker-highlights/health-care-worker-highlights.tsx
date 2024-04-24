import { HealthCareWorkerSummaryForPeriodDto } from '@ecdlink/core';
import { Divider, Typography } from '@ecdlink/ui';
import { StarIcon } from '@heroicons/react/solid';

interface HalthCareWorkerHighlightsProps {
  summaryData: HealthCareWorkerSummaryForPeriodDto;
}

export const HealthCareWorkerHighlights: React.FC<
  HalthCareWorkerHighlightsProps
> = ({ summaryData }) => {
  return (
    <div className="border-l-successMain  border-successMain mb-6 rounded-2xl border-2 border-l-8  bg-white">
      <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Start main area*/}
        <div className="flex flex-row items-center gap-2">
          <StarIcon
            className="successMain h-12 w-12"
            style={{
              color: '#83BB26',
            }}
          ></StarIcon>
          <Typography
            type={'h2'}
            hasMarkup
            fontSize="24"
            text={'Highlights'}
            color={'textMid'}
          />
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div className="flex flex-col justify-evenly pt-4 text-current">
          <div className="flex items-center gap-4 px-2">
            <Typography
              type={'h1'}
              hasMarkup
              fontSize="24"
              text={String(summaryData?.totalPregnantMomsWithNoIssues)}
              color={'successMain'}
            />
            <Typography
              type={'body'}
              text={'pregnant moms are doing well & have no issues'}
              color={'textMid'}
            />
          </div>
          <div className="flex items-center gap-4 px-2">
            <Typography
              type={'h1'}
              hasMarkup
              fontSize="24"
              text={String(summaryData?.totalChildrenWithNoIssues)}
              color={'successMain'}
            />
            <Typography
              type={'body'}
              text={'children are doing well & have no issues'}
              color={'textMid'}
            />
          </div>
        </div>

        {/* End main area */}
      </div>
    </div>
  );
};
