import ROUTES from '@/routes/routes';
import { Button, Typography } from '@ecdlink/ui';
import { ReactComponent as RobotIcon } from '@/assets/iconRobot.svg';
import { useHistory } from 'react-router';

interface ProgressTabNoReportPeriodAndPrincipalProps {
  messageReference?: string;
}

export const ProgressTabNoReportPeriodAndPrincipal: React.FC<
  ProgressTabNoReportPeriodAndPrincipalProps
> = ({ messageReference }) => {
  const history = useHistory();

  return (
    <div className="mt-2 flex flex-col justify-center p-8">
      <div className="flex w-full justify-center">
        <RobotIcon />
      </div>
      <Typography
        className="mt-4 text-center"
        color="textDark"
        text={`Choose child progress reporting dates for ${new Date().getFullYear()}`}
        type={'h3'}
      />
      <Typography
        className="mt-2 text-center"
        color="textMid"
        text="To start creating child progress reports, choose the start and end dates for each reporting period."
        type={'body'}
      />
      <Button
        onClick={() =>
          history.push(ROUTES.PROGRESS_SETUP_REPORTING_PERIODS, {
            messageReference,
          })
        }
        className="mt-4 w-full"
        size="small"
        color="quatenary"
        textColor="white"
        type="filled"
        icon="PresentationChartBarIcon"
        text="Choose reporting dates"
      />
    </div>
  );
};
