import { HealthCareWorkerSummaryForPeriodDto } from '@ecdlink/core';
import { Typography } from '@ecdlink/ui';
import { ExclamationCircleIcon, ExclamationIcon } from '@heroicons/react/solid';

interface HealthCareWorkerIssuesProps {
  summaryData: HealthCareWorkerSummaryForPeriodDto;
}

export const HealthCareWorkerIssues: React.FC<HealthCareWorkerIssuesProps> = ({
  summaryData,
}) => {
  return (
    <div className="flex flex-row">
      <div className="border-l-errorMain  border-errorMain m-10 mb-12  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          {/* Start main area*/}
          <div className="flex flex-row border-b-4 border-dashed pb-0">
            <ExclamationCircleIcon
              className="h-12 w-12 pb-2"
              style={{
                color: '#ED1414',
              }}
            ></ExclamationCircleIcon>
            <Typography
              type={'h2'}
              hasMarkup
              fontSize="24"
              text={'Urgent issues'}
              color={'textMid'}
            />
          </div>
          <div className="flex flex-col justify-evenly pt-4 text-current">
            <div className="flex items-center gap-2 px-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={String(summaryData?.totalVisitsMissed)}
                color={'errorMain'}
              />
              <Typography
                type={'help'}
                hasMarkup
                fontSize="18"
                text={'visits missed'}
                color={'textMid'}
              />
            </div>
            <div className="flex items-center gap-2 px-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={String(summaryData?.totalPregnantMomsWithUrgentIssues)}
                color={'errorMain'}
              />
              <Typography
                type={'help'}
                hasMarkup
                fontSize="18"
                text={'pregnant moms have urgent issues'}
                color={'textMid'}
              />
            </div>
            <div className="flex items-center gap-2 px-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={String(
                  summaryData?.totalCaregiversAndChildrenWithUrgentIssues
                )}
                color={'errorMain'}
              />
              <Typography
                type={'help'}
                hasMarkup
                fontSize="18"
                text={'caregivers & children have urgent issues'}
                color={'textMid'}
              />
            </div>
          </div>
          {/* End main area */}
        </div>
      </div>
      <div className="border-l-alertMain  border-alertMain m-10 mb-12  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
        <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
          {/* Start main area*/}
          <div className="flex flex-row border-b-4 border-dashed pb-0">
            <ExclamationIcon className="text-alertMain h-12 w-12" />
            <Typography
              type={'h2'}
              hasMarkup
              fontSize="24"
              text={'Other issues'}
              color={'textMid'}
            />
          </div>
          <div className="flex flex-col justify-evenly pt-4 text-current">
            <div className="flex items-center gap-2 px-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={String(summaryData?.totalVisitsOverdue)}
                color={'alertMain'}
              />
              <Typography
                type={'help'}
                hasMarkup
                fontSize="18"
                text={'visits overdue'}
                color={'textMid'}
              />
            </div>
            <div className="flex items-center gap-2 px-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={String(summaryData?.totalPregnantMomsWithIssues)}
                color={'alertMain'}
              />
              <Typography
                type={'help'}
                hasMarkup
                fontSize="18"
                text={'pregnant moms have other issues'}
                color={'textMid'}
              />
            </div>
            <div className="flex items-center gap-2 px-2">
              <Typography
                type={'h1'}
                hasMarkup
                fontSize="24"
                text={String(summaryData?.totalCaregiversAndChildrenWithIssues)}
                color={'alertMain'}
              />
              <Typography
                type={'help'}
                hasMarkup
                fontSize="18"
                text={'caregivers & children have other issues'}
                color={'textMid'}
              />
            </div>
          </div>

          {/* End main area */}
        </div>
      </div>
    </div>
  );
};
