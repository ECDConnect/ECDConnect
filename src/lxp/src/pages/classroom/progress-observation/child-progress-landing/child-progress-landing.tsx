import { classroomsSelectors } from '@/store/classroom';
import { practitionerSelectors } from '@/store/practitioner';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { ReactComponent as RobotIcon } from '@/assets/iconRobot.svg';
import { ReactComponent as Emoji4Icon } from '@/assets/ECD_Connect_emoji4.svg';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';

export const ChildProgressLanding: React.FC = () => {
  const history = useHistory();

  const isReportWindowSet = useSelector(
    classroomsSelectors.getIsReportingPeriodsSet()
  );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const classroom = useSelector(classroomsSelectors.getClassroom);

  return (
    <>
      {!isReportWindowSet && !!practitioner?.isPrincipal && (
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
              history.push(ROUTES.CHILD_PROGRESS_REPORTING_PERIODS)
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
      )}
      {!isReportWindowSet && !practitioner?.isPrincipal && (
        <div className="mt-2 flex flex-col justify-center p-8">
          <div className="flex w-full justify-center">
            <Emoji4Icon />
          </div>
          <Typography
            className="mt-4 text-center"
            color="textDark"
            text="Your principal has not created progress reporting periods yet."
            type={'h3'}
          />
          <Typography
            className="mt-2 text-center"
            color="textMid"
            text={`Reach out to ${classroom?.principal.firstName} and ask them to set up progress reporting periods.`}
            type={'body'}
          />
        </div>
      )}
    </>
  );
};
