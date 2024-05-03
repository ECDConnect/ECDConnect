import { TeamLeadSummaryDto } from '@ecdlink/core';
import { Button, Typography } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import ROUTES from '../../../../routes/app.routes-constants';

interface TeamLeadSummaryReportProps {
  teamLeadReportData: TeamLeadSummaryDto;
  clinicIds?: string[];
}

export const TeamLeadSummary: React.FC<TeamLeadSummaryReportProps> = ({
  teamLeadReportData,
  clinicIds,
}) => {
  const history = useHistory();
  const goToCHWs = () => {
    history.push(ROUTES.USERS.HEALTH_CARE_WORKERS, {
      clinicIds: clinicIds,
    });
  };

  return (
    <div>
      <div className="border-l-secondary  border-secondary m-10 mb-10  rounded-2xl border-2 border-l-8  bg-white lg:min-w-0 lg:flex-1">
        <div className="h-full py-2 px-4 sm:px-6 lg:px-8">
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
                text={`${teamLeadReportData?.totalClinics}`}
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
                text={`${teamLeadReportData?.totalHealthCareWorkers}`}
                color={'textMid'}
                className="my-4"
              />
              <Typography
                type={'body'}
                text={'CHWs'}
                color={'textMid'}
                className="my-4"
              />
            </div>
            <div className="flex items-center gap-4">
              <Typography
                type={'h1'}
                fontSize="48"
                text={`${teamLeadReportData?.totalPregnantMoms}`}
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
                text={`${teamLeadReportData?.totalChildren}`}
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
          </div>
        </div>
        <div className="flex w-full justify-end p-4">
          <Button
            icon="UsersIcon"
            type="filled"
            color="secondary"
            text="See CHW's"
            textColor="white"
            onClick={() => {
              goToCHWs();
            }}
            className="rounded-xl p-2"
          />
        </div>
      </div>
    </div>
  );
};
