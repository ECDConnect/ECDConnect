import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { userSelectors } from '@/store/user';
import { CommunityProfileDto, useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  ProfileAvatar,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { BasicInfoItems } from '../community.types';
import ROUTES from '@/routes/routes';
import { DetailsCard } from '../community-profile/components/details-card';
import { ProfileSkills } from '../community-profile/components/profile-skills';
import { ConnectionProfileRouteState } from './connection-profile.types';

export const ConnectionProfile = () => {
  const { isOnline } = useOnlineStatus();
  const user = useSelector(userSelectors.getUser);
  const { state } = useLocation<ConnectionProfileRouteState>();
  const communityProfile = state?.connectionProfile;
  const { theme } = useTheme();
  const history = useHistory();

  const handleGoBack = () => {
    history?.push(ROUTES.COMMUNITY.WELCOME, { isFromConnectProfile: true });
  };
  return (
    <div className="flex h-screen flex-1 flex-col overflow-y-auto bg-white">
      <BannerWrapper
        showBackground={true}
        size="medium"
        renderBorder={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={communityProfile?.communityUser?.fullName}
        color={'primary'}
        renderOverflow={false}
        onBack={() => handleGoBack()}
        displayOffline={!isOnline}
      >
        <div className={'inline-flex w-full justify-center pt-8'}>
          <ProfileAvatar
            hasConsent={communityProfile?.shareProfilePhoto || false}
            canChangeImage={false}
            dataUrl={communityProfile?.communityUser?.profilePhoto || ''}
            size={'header'}
            onPressed={() => {}}
            className="z-50"
            userAvatarText={communityProfile?.communityUser?.fullName
              ?.match(/^(\w)\w*\s+(\w{1,2})/)
              ?.slice(1)
              .join('')
              ?.toLocaleUpperCase()}
          />
        </div>
        <div className="flex w-full flex-col gap-2 overflow-auto p-4">
          <div
            className={
              'mt-2.5 flex w-full flex-row items-center justify-center'
            }
          >
            <StatusChip
              backgroundColour="quatenary"
              borderColour="quatenary"
              text={communityProfile?.communityUser?.roleName || 'Practitioner'}
              textColour={'white'}
              className={'mr-2'}
            />
            {communityProfile?.shareProvince &&
              communityProfile?.provinceName && (
                <StatusChip
                  backgroundColour="successMain"
                  borderColour="successMain"
                  text={communityProfile?.provinceName}
                  textColour={'white'}
                  className={'mr-2'}
                />
              )}
          </div>
          <Typography
            type={'h4'}
            text={communityProfile?.aboutShort}
            color={'textDark'}
            align="center"
            className="my-2"
          />
          <DetailsCard
            title={`About ${communityProfile?.communityUser?.fullName}`}
            textOne={communityProfile?.aboutLong}
            isFilled={!!communityProfile?.aboutLong}
            isAbout={true}
            connectionProfile={true}
          />
          <ProfileSkills
            userName={communityProfile?.communityUser?.fullName!}
            skills={communityProfile?.profileSkills!}
            connectionProfile={true}
          />
        </div>
      </BannerWrapper>
    </div>
  );
};
