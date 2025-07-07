import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { userSelectors } from '@/store/user';
import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  ProfileAvatar,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { CompleteProfilePerc } from './components/complete-procile-perc/complete-profile-perc';
import { ConnectionsCard } from './components/connections-card/connections-card';
import { DetailsCard } from './components/details-card/details-card';
import { communitySelectors } from '@/store/community';
import { ProfileSkills } from './components/profile-skills/profile-skills';
import { useTenant } from '@/hooks/useTenant';
import { useEffect, useState } from 'react';
import { ContactDetails } from './components/contact-details/contact-details';
import { AboutDescription } from './components/about-description/about-description';
import { EditCommunitySkills } from './components/edit-community-skills/edit-community-skills';
import { CommunityBasicInfo } from './components/community-basic-info/community-basic-info';
import { BasicInfoItems } from '../community.types';
import ROUTES from '@/routes/routes';
import TransparentLayer from '../../../assets/TransparentLayer.png';

export interface CommunityProfileRouteState {
  isFromAddMoreDetails: boolean;
}

export const CommunityProfile = () => {
  const { isOnline } = useOnlineStatus();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const user = useSelector(userSelectors.getUser);
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const { theme } = useTheme();
  const history = useHistory();
  const [openContactDetails, setOpenContactDetails] = useState(false);
  const [openAboutDescription, setOpenAboutDescription] = useState(false);
  const [openEditCommunitySkills, setOpenEditCommunitySkills] = useState(false);
  const [openEditBasicInfo, setOpenEditBasicInfo] = useState(false);

  const [detailsShared, setDetailsShared] = useState<string[]>([]);

  var detailsSharedUnique = detailsShared?.filter(
    (value, index, arr) => index === arr.indexOf(value)
  );

  useEffect(() => {
    if (communityProfile) {
      const sharedBasicInfoItems: string[] = [];
      if (communityProfile?.shareRole) {
        sharedBasicInfoItems.push(BasicInfoItems?.Role);
      }
      if (communityProfile?.shareProfilePhoto) {
        sharedBasicInfoItems.push(BasicInfoItems?.ProfilhePhoto);
      }
      if (communityProfile?.shareProvince) {
        sharedBasicInfoItems.push(BasicInfoItems?.Province);
      }
      setDetailsShared(sharedBasicInfoItems);
    }
  }, [communityProfile]);

  // useEffect(() => {
  //   if (isFromAddMoreDetails) {
  //     setOpenAboutDescription(true);
  //   }
  // }, []);

  return (
    <div className="flex h-screen flex-1 flex-col overflow-y-auto bg-white">
      <BannerWrapper
        showBackground={true}
        size="medium"
        renderBorder={true}
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        title={user?.fullName}
        color={'primary'}
        renderOverflow={false}
        onBack={() => history.goBack()}
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
          />
        </div>
        <div className="flex w-full flex-col gap-2 overflow-auto p-4">
          <Typography
            type={'h3'}
            text={'Your community profile'}
            color={'textDark'}
          />
          <CompleteProfilePerc />
          <ConnectionsCard
            title="New requests"
            subtitle="WAITING TO CONNECT WITH:"
            connectionsNumber={
              communityProfile?.pendingConnections?.length || 0
            }
            icon="HandIcon"
            route={ROUTES.COMMUNITY.RECEIVED_REQUESTS}
            usersData={communityProfile?.pendingConnections}
            isConnectedScreen={false}
          />
          <ConnectionsCard
            title="Your connections"
            subtitle="CONNECT WITH:"
            connectionsNumber={
              communityProfile?.acceptedConnections?.length || 0
            }
            icon="ShareIcon"
            route={ROUTES.COMMUNITY.RECEIVED_REQUESTS}
            usersData={communityProfile?.acceptedConnections}
            isConnectedScreen={true}
          />
          <DetailsCard
            title="Contact details"
            detailOne="CONTACT INFO"
            textOne={`Phone number: ${
              communityProfile?.communityUser?.phoneNumber
            }
            Email: ${communityProfile?.communityUser?.email || 'None'}`}
            isFilled={
              !!communityProfile?.communityUser?.phoneNumber ||
              !!communityProfile?.communityUser?.email
            }
            action={setOpenContactDetails}
          />
          <DetailsCard
            title="Basic info"
            detailOne="SHORT DESCRIPTION"
            textOne={communityProfile?.aboutShort}
            detailTwo="DETAILS SHARED"
            textTwo={detailsSharedUnique?.join(', ')?.toString()}
            isFilled={!!communityProfile?.aboutShort}
            action={setOpenEditBasicInfo}
          />
          <DetailsCard
            title={`About ${user?.fullName || ''}`}
            textOne={communityProfile?.aboutLong}
            isFilled={!!communityProfile?.aboutLong}
            isAbout={true}
            action={setOpenAboutDescription}
          />
          <ProfileSkills
            userName={user?.firstName!}
            skills={communityProfile?.profileSkills!}
            action={setOpenEditCommunitySkills}
          />
          <div className="mb-12 mt-4 flex w-full flex-col justify-center gap-3">
            <Button
              className="w-full rounded-2xl px-2"
              type="filled"
              color="quatenary"
              textColor="white"
              text={`Edit my ${appName} profile`}
              icon="UserIcon"
              iconPosition="start"
              onClick={() => history.push(ROUTES.PRACTITIONER.ABOUT.ROOT)}
            />
          </div>
        </div>
      </BannerWrapper>
      <Dialog
        fullScreen
        visible={openContactDetails}
        position={DialogPosition.Full}
      >
        <ContactDetails onClose={setOpenContactDetails} />
      </Dialog>
      <Dialog
        fullScreen
        visible={openAboutDescription}
        position={DialogPosition.Full}
      >
        <AboutDescription onClose={setOpenAboutDescription} />
      </Dialog>
      <Dialog
        fullScreen
        visible={openEditCommunitySkills}
        position={DialogPosition.Full}
      >
        <EditCommunitySkills onClose={setOpenEditCommunitySkills} />
      </Dialog>
      <Dialog
        fullScreen
        visible={openEditBasicInfo}
        position={DialogPosition.Full}
      >
        <CommunityBasicInfo onClose={setOpenEditBasicInfo} />
      </Dialog>
    </div>
  );
};
