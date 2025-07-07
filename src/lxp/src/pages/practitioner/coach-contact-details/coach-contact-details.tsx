import { useHistory } from 'react-router';
import {
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  ProfileAvatar,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { coachSelectors } from '@/store/coach';
import * as styles from './coach-contact-details.styles';
import { useTheme } from '@ecdlink/core';
import { CoachFeedback } from '@/pages/community/community-tabs/components/community-dashboard/components/community-coach-profile/components/coach-feedback/coach-feedback';
import { useState } from 'react';
import TransparentLayer from '../../../assets/TransparentLayer.png';

export const CoachContactDetails: React.FC = () => {
  const history = useHistory();
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
  const coach = useSelector(coachSelectors.getCoach);
  const [openCoachFeedback, setOpenCoachFeedback] = useState(false);

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
    <div className={styles.contentWrapper}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        title={`${coach?.user?.firstName} ${coach?.user?.surname}`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      >
        <div className={styles.avatarWrapper}>
          <ProfileAvatar
            hasConsent={true}
            canChangeImage={false}
            dataUrl={coach?.user?.profileImageUrl || ''}
            size={'header'}
          />
        </div>
        <div className={styles.chipsWrapper}>
          <StatusChip
            backgroundColour="primary"
            borderColour="primary"
            text={'Coach'}
            textColour={'white'}
            className={'px-3 py-1.5'}
          />
          {/* TODO - add extra descriptive text, what is it? */}
        </div>
        <div className={styles.infoWrapper}>
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
          <div className={styles.contactButtons}>
            <Button
              color={'secondary'}
              type={'outlined'}
              size={'small'}
              onClick={whatsapp}
            >
              <img
                src={getLogo(LogoSvgs.whatsapp)}
                alt="whatsapp"
                className="text-secondary mr-1 h-5 w-5"
              />
              <Typography
                color={'secondary'}
                type={'small'}
                text={`WhatsApp coach`}
                className={'font-semibold'}
              />
            </Button>
            <Button
              text={'Call coach'}
              icon={'PhoneIcon'}
              color={'secondary'}
              textColor={'secondary'}
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
          <div className="fixed bottom-0 left-0 right-0 max-h-20 w-full p-4">
            <Button
              className="w-full rounded-2xl px-2"
              type="filled"
              color="quatenary"
              textColor="white"
              text="Give feedback about your coach"
              icon="SpeakerphoneIcon"
              iconPosition="start"
              onClick={() => setOpenCoachFeedback(true)}
            />
          </div>
        </div>
        <Dialog
          visible={openCoachFeedback}
          position={DialogPosition.Full}
          className="w-full"
          stretch
        >
          <CoachFeedback closeAction={setOpenCoachFeedback} />
        </Dialog>
      </BannerWrapper>
    </div>
  );
};
