import { useHistory } from 'react-router';
import {
  Alert,
  BannerWrapper,
  Button,
  Divider,
  ProfileAvatar,
  renderIcon,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { PhoneIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { coachSelectors } from '@/store/coach';
import * as styles from './coach-contact-details.styles';
import { useTheme } from '@ecdlink/core';

export const CoachContactDetails: React.FC = () => {
  const history = useHistory();
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
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
    <div className={styles.contentWrapper}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
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
      </BannerWrapper>
    </div>
  );
};
