import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { WhatsappCall } from '../contact/whatsapp-call';
import ROUTES from '@routes/routes';
import { format } from 'date-fns';

export type StatementNotSubmittedProps = {
  month: string;
  onBack: () => void;
};

export const StatementNotSubmitted: React.FC<StatementNotSubmittedProps> = ({
  onBack,
}) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { userId } = useParams<PractitionerBusinessParams>();
  const practitioner = useSelector(getPractitionerByUserId(userId));
  const practitionerFirstName = practitioner?.user?.firstName;

  return (
    <>
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title="No income/expenses"
        onBack={onBack}
        className="p-4"
      >
        <div className="mt-4 flex justify-center">
          <div className="w-11/12">
            <div>
              <Typography
                className="mt-4"
                color="textDark"
                text={`No income or expenses added`}
                type={'h2'}
              />
              <Typography
                className="mt-4"
                color="textMid"
                text={format(new Date(), 'dd MMM yyyy')}
                type={'body'}
              />
            </div>
            <div>
              <Typography
                className="mt-4"
                color="textDark"
                text={`Remind ${practitionerFirstName} to complete income statements every month.`}
                type={'h3'}
              />
            </div>
            <WhatsappCall />
            <div className="flex flex-col justify-center">
              <Button
                shape="normal"
                color="quatenary"
                type="filled"
                icon="CheckCircleIcon"
                onClick={() =>
                  history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
                    practitionerId: userId,
                  })
                }
                className="mt-6 rounded-2xl"
              >
                <Typography
                  type="help"
                  color="white"
                  text={`I have contacted ${practitionerFirstName}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
