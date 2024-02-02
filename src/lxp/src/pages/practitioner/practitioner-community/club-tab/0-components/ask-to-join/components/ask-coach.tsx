import {
  Alert,
  Button,
  ProfileAvatar,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { useSelector } from 'react-redux';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { coachSelectors } from '@/store/coach';

export const AskCoach: React.FC = () => {
  const coach = useSelector(coachSelectors.getCoach);

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
    <div className={'h-full overflow-y-auto bg-white'}>
      <Typography
        text={'Contact your coach and ask them to add you to a club'}
        type="h1"
        color="textMid"
        className={'flex-column mx-auto mt-4 w-11/12 items-center'}
      />
      <div className={'inline-flex w-full justify-center pt-8'}>
        <ProfileAvatar
          hasConsent={true}
          canChangeImage={false}
          dataUrl={coach?.user?.profileImageUrl || ''}
          size={'header'}
        />
      </div>
      <div
        className={
          'mt-10 flex w-full flex-row items-center justify-center gap-2'
        }
      >
        <StatusChip
          backgroundColour="primary"
          borderColour="primary"
          text={'Coach'}
          textColour={'white'}
          className={'px-3 py-1.5'}
        />
        {/* TODO - add extra descriptive text, what is it? */}
      </div>
      <div className={'flex-column mx-auto mt-2 w-11/12 items-center'}>
        <Typography
          text={`${coach?.user?.firstName} ${coach?.user?.surname}`}
          type="h2"
          color="textMid"
          className={'mt-4'}
        />
        <Typography
          text={`${coach?.user?.phoneNumber || ''}`}
          type="h2"
          color="textMid"
          className={'mt-4'}
        />
        <div className={'mt-4 flex justify-start gap-3'}>
          <Button
            color={'primary'}
            type={'outlined'}
            size={'small'}
            onClick={whatsapp}
          >
            <img
              src={getLogo(LogoSvgs.whatsapp)}
              alt="whatsapp"
              className="text-primary mr-1 h-5 w-5"
            />
            <Typography
              color={'primary'}
              type={'small'}
              text={`WhatsApp coach`}
              className={'font-semibold'}
            />
          </Button>
          <Button
            text={'Call coach'}
            icon={'PhoneIcon'}
            color={'primary'}
            textColor={'primary'}
            type={'outlined'}
            size={'small'}
            onClick={call}
          />
        </div>
        <Alert
          type={'info'}
          className="items-left justify-left mt-4 flex"
          title={`WhatsApp and phone calls will be charged at your standard carrier rates.`}
        />
      </div>
    </div>
  );
};
