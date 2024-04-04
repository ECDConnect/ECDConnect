import { HealthCareWorkerSummaryForPeriodDto } from '@ecdlink/core';
import { Typography } from '@ecdlink/ui';
import { StarIcon } from '@heroicons/react/solid';

interface HalthCareWorkerHighlightsProps {
  summaryData: HealthCareWorkerSummaryForPeriodDto;
}

export const HalthCareWorkerHighlights: React.FC<
  HalthCareWorkerHighlightsProps
> = ({ summaryData }) => {
  return (
    <div className="border-l-successMain  border-successMain m-10 mb-10  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
      <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Start main area*/}
        <div className="flex flex-row border-b-4 border-dashed pb-0">
          <StarIcon
            className="successMain h-12 w-12 pb-2"
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
              type={'help'}
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
              type={'help'}
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
