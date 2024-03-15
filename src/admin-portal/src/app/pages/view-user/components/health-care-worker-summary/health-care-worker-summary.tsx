import { HealthCareWorkerSummaryForPeriodDto } from '@ecdlink/core';
import { Divider, Typography } from '@ecdlink/ui';

interface HealthCareWorkerSummaryProps {
  summaryData: HealthCareWorkerSummaryForPeriodDto;
}

export const HealthCareWorkerSummary: React.FC<
  HealthCareWorkerSummaryProps
> = ({ summaryData }) => {
  return (
    <div className="border-l-secondary border-secondary m-10 my-6 mt-4  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
      <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Start main area*/}
        <Typography
          type={'h2'}
          hasMarkup
          fontSize="24"
          text={'Clients summary'}
          color={'textMid'}
        />
        <Divider dividerType="dashed" className="my-2" />
        <div className="flex flex-row justify-evenly pt-4 text-current">
          <div className="flex items-center gap-4">
            <Typography
              type={'h1'}
              hasMarkup
              fontSize="48"
              text={String(summaryData?.totalPregnantMoms)}
              color={'textMid'}
            />
            <Typography
              type={'help'}
              text={'pregnant moms'}
              color={'textMid'}
            />
          </div>
          <div className="flex items-center gap-4">
            <Typography
              type={'h1'}
              hasMarkup
              fontSize="48"
              text={String(summaryData?.totalChildren)}
              color={'textMid'}
            />
            <Typography type={'help'} text={'children'} color={'textMid'} />
          </div>
          <div className="flex items-center gap-4">
            <Typography
              type={'h1'}
              hasMarkup
              fontSize="48"
              text={String(summaryData?.totalClientsVisited)}
              color={'textMid'}
            />
            <Typography
              type={'help'}
              text={'clients visited'}
              color={'textMid'}
            />
          </div>
          <div className="flex items-center gap-4">
            <Typography
              type={'h1'}
              hasMarkup
              fontSize="48"
              text={String(summaryData?.totalFoldersOpened)}
              color={'textMid'}
            />
            <Typography
              type={'help'}
              text={'folders opened'}
              color={'textMid'}
            />
          </div>
        </div>
        {/* End main area */}
      </div>
    </div>
  );
};
