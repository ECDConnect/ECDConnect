import { useHistory, useLocation } from 'react-router';
import {
  renderIcon,
  BannerWrapper,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogPosition,
  ProfileAvatar,
  StatusChip,
} from '@ecdlink/ui';
import { useDialog, useSnackbar, useTheme } from '@ecdlink/core';
import { useState } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './community-coach-profile.styles';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';
import { useTenant } from '@/hooks/useTenant';
import { coachSelectors } from '@/store/coach';
import { CoachFeedback } from './components/coach-feedback/coach-feedback';
import TransparentLayer from '../../../../../../../assets/TransparentLayer.png';
interface CommunityCoachProfileProps {
  onClose?: (item: boolean) => void;
}

export const CommunityCoachProfile: React.FC<CommunityCoachProfileProps> = ({
  onClose,
}) => {
  const { theme } = useTheme();
  const dialog = useDialog();
  const { showMessage } = useSnackbar();
  const { isOnline } = useOnlineStatus();
  const tenant = useTenant();
  const orgName = tenant?.tenant?.organisationName;
  const coach = useSelector(coachSelectors?.getCoach);
  const [openCoachFeedback, setOpenCoachFeedback] = useState(false);

  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const coachClassrooms = useSelector(
    classroomsForCoachSelectors.getClassroomForCoach
  );

  // THIS PROBABLY NEEDS AN UPDATE

  const [removePractionerReasonsVisible, setRemovePractionerReasonsVisible] =
    useState<boolean>(false);

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
        size="medium"
        renderBorder={true}
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        title={coach?.user?.fullName}
        color={'primary'}
        renderOverflow={false}
        onBack={() => onClose && onClose(false)}
        displayOffline={!isOnline}
      >
        <div className={'inline-flex w-full justify-center pt-8'}>
          <ProfileAvatar
            hasConsent={true}
            canChangeImage={false}
            dataUrl={coach?.user?.profileImageUrl || ''}
            size={'header'}
            onPressed={() => {}}
            className="z-50"
            userAvatarText={coach?.user?.fullName
              ?.match(/^(\w)\w*\s+(\w{1,2})/)
              ?.slice(1)
              .join('')
              ?.toLocaleUpperCase()}
          />
        </div>
        <div>
          <div>
            <div className="flex-column mx-auto mt-2 w-11/12 items-center">
              <div className="flex w-full justify-center">
                <StatusChip
                  backgroundColour={'primary'}
                  borderColour={'primary'}
                  text={'Coach'}
                  textColour={'white'}
                  className={'w-16'}
                />
              </div>
              <div className="mt-10">
                <Typography
                  type="h2"
                  weight="bold"
                  lineHeight="snug"
                  text={coach?.user?.fullName}
                />
                <Typography
                  type="h5"
                  weight="bold"
                  lineHeight="snug"
                  color="quatenary"
                  text={coach?.user?.phoneNumber}
                />
                <Button
                  color={'secondary'}
                  type={'outlined'}
                  className={'mr-4 mt-2'}
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
                    weight="bold"
                    text={`WhatsApp coach`}
                  />
                </Button>
                <Button
                  text={`Call coach`}
                  icon="PhoneIcon"
                  type="outlined"
                  size="small"
                  color="secondary"
                  textColor="secondary"
                  iconPosition="start"
                  onClick={call}
                  className="mt-2"
                />
              </div>
              <div>
                <Alert
                  type={'info'}
                  className="items-left justify-left mt-4 flex"
                  title={`WhatsApp and phone calls will be charged at your standard carrier rates.`}
                />
              </div>
            </div>
          </div>
        </div>
      </BannerWrapper>
      <div className="absolute bottom-0 left-0 right-0 max-h-20 w-full p-4">
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
      <Dialog
        visible={openCoachFeedback}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <CoachFeedback closeAction={setOpenCoachFeedback} />
      </Dialog>
    </div>
  );
};
