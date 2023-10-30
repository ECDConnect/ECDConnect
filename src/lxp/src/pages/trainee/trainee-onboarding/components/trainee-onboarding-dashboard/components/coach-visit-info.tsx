import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { coachSelectors } from '@/store/coach';
import {
  Alert,
  BannerWrapper,
  Button,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';
import { PhoneIcon } from '@heroicons/react/solid';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { traineeSelectors } from '@/store/trainee';

interface CoachVisitInfoProps {
  setShowCoachVisit: any;
  setNotificationStep?: any;
}

export const CoachVisitInfo: React.FC<CoachVisitInfoProps> = ({
  setShowCoachVisit,
  setNotificationStep,
}) => {
  const { isOnline } = useOnlineStatus();
  const coach = useSelector(coachSelectors.getCoach);
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);

  const call = () => {
    window.open(`tel:${coach?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(
        coach?.user?.phoneNumber ?? ''
      )}`
    );
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Business'}
      color={'primary'}
      onBack={() => {
        setNotificationStep && setNotificationStep('');
        setShowCoachVisit(false);
      }}
      displayOffline={!isOnline}
      className="h-screen pb-16"
    >
      <div className="h-screen p-4">
        <Typography
          className={'my-3'}
          color={'textDark'}
          type={'h2'}
          text={`Request a visit from ${coach?.user?.firstName}`}
        />
        {!timeline?.smartSpaceLicenseNotAwardedDate && (
          <Alert
            className="mt-4"
            variant="outlined"
            type="success"
            title={`Well done! You have completed all the required SmartSpace steps. `}
            message="Your coach has been asked to schedule the SmartSpace check!"
            customIcon={<Emoji3 className="h-auto w-16" />}
          />
        )}
        <Typography
          text={`Contact ${coach?.user?.firstName}`}
          type="h3"
          color="textDark"
          className={'mt-4'}
        />
        <Typography
          text={`${coach?.user?.phoneNumber}`}
          type="h2"
          weight="skinny"
          color="primary"
        />
        <div className="mt-4 flex justify-center">
          <Button
            color={'primary'}
            type={'outlined'}
            className={'mr-4 rounded-xl'}
            size={'normal'}
            onClick={whatsapp}
          >
            <div className="flex items-center justify-center">
              <img
                src={getLogo(LogoSvgs.whatsapp)}
                alt="whatsapp"
                className="text-primary mr-1 h-5 w-5"
              />
              <Typography
                text={`Whatsapp ${coach?.user?.firstName}`}
                type="button"
                weight="skinny"
                color="primary"
              />
            </div>
          </Button>
          <Button
            color={'primary'}
            type={'outlined'}
            className={'mr-4 rounded-xl'}
            size={'small'}
            onClick={call}
          >
            <div className="flex items-center justify-center">
              <PhoneIcon
                className="text-primary mr-2 h-6 w-5"
                aria-hidden="true"
              />
              <Typography
                text={`Call ${coach?.user?.firstName}`}
                type="button"
                weight="skinny"
                color="primary"
              />
            </div>
          </Button>
        </div>
        <Alert
          type="info"
          className="mt-4"
          message="WhatsApps and phone calls will be charged at your standard carrier rates."
        />

        <Button
          type="filled"
          color="primary"
          className="mt-4 mb-2 w-full"
          onClick={() => {
            setNotificationStep && setNotificationStep('');
            setShowCoachVisit(false);
          }}
        >
          {renderIcon('XIcon', 'mr-2 text-white w-5')}
          <Typography type={'body'} text={'Close'} color={'white'} />
        </Button>
      </div>
    </BannerWrapper>
  );
};
