import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { traineeSelectors } from '@/store/trainee';
import { differenceInMonths, format } from 'date-fns';
import { WhatsappCall } from '../contact/whatsapp-call';

export type StartupSupportEndingProps = {
  onBack: () => void;
};

export const StartupSupportEnding: React.FC<StartupSupportEndingProps> = ({
  onBack,
}) => {
  const { isOnline } = useOnlineStatus();
  const { userId } = useParams<PractitionerBusinessParams>();
  const practitioner = useSelector(getPractitionerByUserId(userId));
  const practitionerFirstName = practitioner?.user?.firstName;
  const timeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline(practitioner?.userId || '')
  );

  const currentDate = new Date();
  const startUpSupportEndDate = new Date(timeline?.startUpSupportEndDate);
  const monthDifference = differenceInMonths(
    startUpSupportEndDate,
    currentDate
  );

  return (
    <>
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title="Start-up support"
        onBack={onBack}
        className="p-4"
      >
        <div className="mt-4 flex justify-center">
          <div className="w-11/12">
            <div className="flex items-center gap-2">
              <span
                className={`text-l p-3 font-semibold text-white bg-${'alertMain'} rounded-full`}
              >
                &nbsp;{monthDifference}&nbsp;
              </span>
              <Typography
                type="h3"
                text={` Months until ${practitionerFirstName} 's start-up support ends.`}
              />
            </div>

            <div>
              <Typography
                className="mt-2 text-left"
                color="textDark"
                text={`${practitionerFirstName} 's monthly start-up support of R ${timeline?.startUpSupportAmount?.toFixed(
                  2
                )} will be coming to an end on `}
                type={'h3'}
              />
              <Typography
                className="mt-2 text-left"
                color="textDark"
                text={`${format(startUpSupportEndDate, 'dd LLLL yyyy')}.`}
                type={'body'}
              />
            </div>

            <WhatsappCall />

            <div className="flex flex-col justify-center">
              <Button
                shape="normal"
                color="primary"
                type="filled"
                icon="CheckCircleIcon"
                onClick={onBack}
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
