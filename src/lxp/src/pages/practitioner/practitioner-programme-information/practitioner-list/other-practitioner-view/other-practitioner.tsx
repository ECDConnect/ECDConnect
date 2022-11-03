import {
  BannerWrapper,
  Button,
  Typography,
  Alert,
  ProfileAvatar,
  StatusChip,
} from '@ecdlink/ui';
import { PhoneIcon } from '@heroicons/react/solid';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { PractitionerProfileRouteState } from './other-colleagues.types';
import * as styles from './other-colleagues.styles';
import { useTheme } from '@ecdlink/core';

// import { CreateNote } from '../components/create-note/create-note';
// import { NoteTypeEnum } from '@ecdlink/graphql';
// import { getLastNoteDate } from '@utils/child/child-profile-utils';
// import { notesSelectors } from '@store/notes';
// import { useSelector } from 'react-redux';

export const OtherPractitionerProfile: React.FC<
  PractitionerProfileRouteState
> = ({ practitionerId, setPractitionerInfo, colleagueProfile }) => {
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );

  const call = () => {
    window.open(`tel:${practitioner?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/${practitioner?.user?.phoneNumber}`);
  };
  const classroomGroups = colleagueProfile?.classroomNames.split(',');

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={`${colleagueProfile?.name}`}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() => setPractitionerInfo(false)}
        displayOffline={!isOnline}
        backgroundImageColour={'primary'}
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
      >
        <div className={'w-full inline-flex justify-center pt-8'}>
          <ProfileAvatar
            dataUrl={colleagueProfile?.profilePhoto!}
            size={'header'}
            onPressed={() => {}}
            hasConsent={true}
          />
        </div>
      </BannerWrapper>
      <div className={styles.chipsWrapper}>
        <StatusChip
          backgroundColour="successMain"
          borderColour="successMain"
          text={colleagueProfile?.title}
          textColour={'white'}
          className={'mr-2'}
        />
        {classroomGroups?.map((item: any) => (
          <StatusChip
            backgroundColour="tertiary"
            borderColour="tertiary"
            text={`${item}`}
            textColour={'white'}
            className={'mr-2'}
          />
        ))}
      </div>
      <div>
        <div>
          <div>
            <Typography
              text={`Contact ${colleagueProfile?.name}`}
              type="h3"
              color="textDark"
              className={'m-4'}
            />
          </div>
          <div>
            <Typography
              text={`${colleagueProfile?.contactNumber}`}
              type="h2"
              weight="skinny"
              color="primary"
              className={'ml-4 mt-2'}
            />
          </div>
        </div>
        <div>
          <div className={styles.contactButtons}>
            <Button
              color={'primary'}
              type={'outlined'}
              className={'mr-4 rounded-xl'}
              size={'normal'}
              onClick={whatsapp}
            >
              <div className="flex justify-center items-center">
                <img
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="whatsapp"
                  className={styles.buttonIconStyle}
                />
                <Typography
                  text={`Whatsapp ${colleagueProfile?.name}`}
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
              <div className="flex justify-center items-center">
                <PhoneIcon
                  className="h-6 w-5 text-primary mr-2"
                  aria-hidden="true"
                />
                <Typography
                  text={`Call ${colleagueProfile?.name}`}
                  type="button"
                  weight="skinny"
                  color="primary"
                />
              </div>
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="w-11/12 rounded-2xl">
              <Alert
                type="info"
                className="mt-4"
                message="WhatsApps and phone calls will be charged at your standard carrier rates."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
