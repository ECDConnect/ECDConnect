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
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { PractitionerProfileRouteState } from './other-colleagues.types';
import * as styles from './other-colleagues.styles';
import { useTheme } from '@ecdlink/core';
import TransparentLayer from '../../../../../assets/TransparentLayer.png';

export const OtherPractitionerProfile: React.FC<
  PractitionerProfileRouteState
> = ({ setPractitionerInfo, colleagueProfile }) => {
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();

  const call = () => {
    window.open(`tel:${colleagueProfile?.contactNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(
        colleagueProfile?.contactNumber ?? ''
      )}`
    );
  };
  const classroomGroups =
    colleagueProfile?.classroomNames &&
    colleagueProfile?.classroomNames.split(',');

  return (
    <BannerWrapper
      title={`${colleagueProfile?.name}`}
      color={'primary'}
      size="small"
      renderOverflow={false}
      onBack={() => setPractitionerInfo(false)}
      displayOffline={!isOnline}
      backgroundImageColour={'primary'}
      showBackground={true}
      backgroundUrl={TransparentLayer}
      className="px-4"
    >
      <div className={'inline-flex w-full justify-center pt-8'}>
        <ProfileAvatar
          canChangeImage={false}
          dataUrl={colleagueProfile?.profilePhoto!}
          size={'header'}
          onPressed={() => {}}
          hasConsent={true}
        />
      </div>
      <div className={styles.chipsWrapper}>
        <StatusChip
          backgroundColour={
            colleagueProfile?.title === 'Practitioner'
              ? 'successMain'
              : 'primary'
          }
          borderColour={
            colleagueProfile?.title === 'Practitioner'
              ? 'successMain'
              : 'primary'
          }
          text={colleagueProfile?.title}
          textColour={'white'}
          className={'mr-2'}
        />
        {classroomGroups &&
          classroomGroups?.map((item: any) => (
            <StatusChip
              key={item}
              backgroundColour="tertiary"
              borderColour="tertiary"
              text={`${item}`}
              textColour={'white'}
              className={'mr-2'}
            />
          ))}
      </div>
      <div>
        <Typography
          text={`Contact ${colleagueProfile?.name}`}
          type="h3"
          color="textDark"
          className={'mt-6 mb-1'}
        />
        <Typography
          text={`${colleagueProfile?.contactNumber}`}
          type="body"
          weight="skinny"
          color="quatenary"
        />
        <div className="mt-4 flex flex-wrap gap-4">
          <Button
            color={'secondary'}
            type={'outlined'}
            onClick={whatsapp}
            size="small"
          >
            <div className="flex items-center justify-center">
              <img
                src={getLogo(LogoSvgs.whatsapp)}
                alt="whatsapp"
                className={styles.buttonIconStyle}
              />
              <Typography
                text={`WhatsApp ${colleagueProfile?.name}`}
                type="button"
                weight="skinny"
                color="secondary"
              />
            </div>
          </Button>
          <Button
            color={'secondary'}
            type={'outlined'}
            onClick={call}
            size="small"
          >
            <div className="flex items-center justify-center">
              <PhoneIcon
                className="text-secondary mr-2 h-5 w-4"
                aria-hidden="true"
              />
              <Typography
                text={`Call ${colleagueProfile?.name}`}
                type="button"
                weight="skinny"
                color="secondary"
              />
            </div>
          </Button>
        </div>

        <Alert
          type="info"
          className="mt-4"
          message="WhatsApps and phone calls will be charged at your standard carrier rates."
        />
      </div>
    </BannerWrapper>
  );
};
