import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { communitySelectors } from '@/store/community';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { useSnackbar, useTheme } from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  ProfileAvatar,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { MemberProfileParams } from './types';
import { useAppDispatch } from '@/store';
import { healthCareWorkerThunkActions } from '@/store/healthCareWorker';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { HealthCareWorkerActions } from '@/store/healthCareWorker/healthCareWorker.actions';
import { ShareContactDialog } from './components/share-contact-dialog';
import { useEffect, useState } from 'react';
import { AboutYourselfDialog } from './components/about-yourself-dialog';

export const TeamMemberProfile = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareContactInfoDialogOpen, setShareContactInfoDialogOpen] =
    useState(false);

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const { theme } = useTheme();

  const { height } = useWindowSize();

  const { showMessage } = useSnackbar();

  const clinicDetails = useSelector(communitySelectors.getClinicSelector);

  const { leaderId, memberId } = useParams<MemberProfileParams>();

  const appDispatch = useAppDispatch();

  const {
    isLoading: isLoadingWelcomeMessage,
    wasLoading: wasLoadingWelcomeMessage,
    isRejected: isRejectedWelcomeMessage,
    error: errorWelcomeMessage,
  } = useThunkFetchCall(
    'healthCareWorker',
    HealthCareWorkerActions.UPDATE_HEALTH_CARE_WORKER_WELCOME_MESSAGE
  );

  const isLeaderProfile = !!leaderId;
  // TODO: compare the hcw with the current hwc id
  const isOwnProfile = true;

  const leader = clinicDetails?.teamLeads?.find(
    (leader) => leader.id === leaderId
  );
  // TODO: find the member by hcw id
  const member = clinicDetails?.clinicMembers?.find(
    (member) => member.firstName + member.surname === memberId
  );

  const headerHeight = 254;

  const phoneNumber = isLeaderProfile
    ? leader?.phoneNumber
    : member?.phoneNumber;
  // TODO: leader whatsAppNumber is not available
  const whatsAppNumber = isLeaderProfile
    ? leader?.phoneNumber
    : member?.whatsAppNumber;
  const name = isLeaderProfile
    ? `${leader?.firstName} ${leader?.surname}`
    : `${member?.firstName} ${member?.surname}`;
  const shareContactInfo = isLeaderProfile ? true : member?.shareContactInfo;
  // TODO: get the welcome message from the backend (currently not available)
  const welcomeMessage = isLeaderProfile
    ? `{welcomeMessage}`
    : member?.welcomeMessage;

  const onUpdateShareContactInfo = async (message?: string) => {
    await appDispatch(
      healthCareWorkerThunkActions.updateHealthCareWorkerWelcomeMessage({
        // TODO: get the healthCareWorkerId
        healthCareWorkerId: '',
        welcomeMessage: message || welcomeMessage || '',
        shareContactInfo: !shareContactInfo,
      })
    );
  };

  const handleUpdateAboutInfo = () => {
    if (shareContactInfo) {
      return onUpdateShareContactInfo();
    }

    return setShareContactInfoDialogOpen(true);
  };

  const onWhatsapp = () => {
    if (whatsAppNumber) {
      return window.open(`whatsapp://send?text=${whatsAppNumber}`);
    }

    return showMessage({
      message: 'WhatsApp number is not available',
      type: 'error',
    });
  };

  const onCall = () => {
    if (phoneNumber) {
      return window.open(`tel:${phoneNumber}`);
    }

    return showMessage({
      message: 'Phone number is not available',
      type: 'error',
    });
  };

  useEffect(() => {
    if (wasLoadingWelcomeMessage && !isLoadingWelcomeMessage) {
      if (isRejectedWelcomeMessage) {
        showMessage({ message: errorWelcomeMessage, type: 'error' });
      } else {
        setShareContactInfoDialogOpen(false);
        setIsDialogOpen(false);
      }
    }
  }, [
    errorWelcomeMessage,
    isLoadingWelcomeMessage,
    isRejectedWelcomeMessage,
    showMessage,
    wasLoadingWelcomeMessage,
  ]);

  return (
    <BannerWrapper
      displayOffline={!isOnline}
      renderBorder
      showBackground
      backgroundUrl={theme?.images.graphicOverlayUrl}
      className="z-10"
      size="small"
      title={name}
      onBack={() => history.push(ROUTES.COMMUNITY.TEAM.MEMBERS.ROOT)}
    >
      <div className="inline-flex w-full flex-col items-center justify-center pt-8">
        <ProfileAvatar
          hasConsent={true}
          canChangeImage={false}
          dataUrl={''}
          size={'header'}
        />
        {isLeaderProfile && (
          <StatusChip
            backgroundColour="secondary"
            borderColour="secondary"
            text="Team leader"
            textColour="white"
            className="mt-4 px-3 py-1.5"
          />
        )}
        <Typography className="mt-4" type="h4" text={welcomeMessage} />
      </div>
      <div
        className="flex flex-col p-4 pt-6"
        style={{ height: height - headerHeight }}
      >
        <Typography type="h3" text={name} />
        {(shareContactInfo || isOwnProfile) && (
          <Typography
            type="body"
            text={(phoneNumber && whatsAppNumber) ?? 'Phone number unavailable'}
            color="secondary"
          />
        )}
        {isOwnProfile && (
          <Alert
            className="mt-5"
            type={shareContactInfo ? 'info' : 'warning'}
            title={
              shareContactInfo
                ? 'You are sharing your contact details with club members.'
                : 'You are not sharing your contact details with club members.'
            }
            button={
              <Button
                isLoading={isLoadingWelcomeMessage}
                disabled={isLoadingWelcomeMessage}
                type="filled"
                color="primary"
                textColor="white"
                icon={shareContactInfo ? 'XIcon' : 'ShareIcon'}
                text={shareContactInfo ? 'Stop sharing' : 'Start sharing'}
                onClick={handleUpdateAboutInfo}
              />
            }
          />
        )}
        {shareContactInfo && !isOwnProfile && (
          <>
            <div className="my-4 flex flex-wrap justify-between gap-4">
              <Button
                className="flex-grow"
                type="outlined"
                color="primary"
                textColor="primary"
                onClick={onWhatsapp}
              >
                <img
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="whatsapp"
                  className="mr-2"
                />
                <Typography
                  type="button"
                  text={`WhatsApp ${isLeaderProfile ? 'team leader' : 'CHW'}`}
                  color="primary"
                />
              </Button>
              <Button
                className="flex-grow"
                icon="PhoneIcon"
                type="outlined"
                color="primary"
                text={`Call ${isLeaderProfile ? 'team leader' : 'CHW'}`}
                textColor="primary"
                onClick={onCall}
              />
            </div>
            <Alert
              type="info"
              title="WhatsApps and phone calls will be charged at your standard carrier rates."
            />
          </>
        )}
        {!shareContactInfo && !isOwnProfile && (
          <Alert
            className="mt-5"
            type="info"
            title="No phone or WhatsApp number shared."
          />
        )}
        {isOwnProfile && (
          <div className="mt-auto flex flex-col gap-4 pt-4">
            <Button
              icon="PencilIcon"
              type="filled"
              color="primary"
              text="Edit short description"
              textColor="white"
              onClick={() => setIsDialogOpen(true)}
            />
            <Button
              icon="UserIcon"
              type="outlined"
              color="primary"
              text="Edit my profile"
              textColor="primary"
              onClick={() => history.push(ROUTES.PRACTITIONER.ABOUT)}
            />
          </div>
        )}
      </div>
      <AboutYourselfDialog
        visible={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={onUpdateShareContactInfo}
      />
      <ShareContactDialog
        isLoading={isLoadingWelcomeMessage}
        visible={isShareContactInfoDialogOpen}
        onClose={() => setShareContactInfoDialogOpen(false)}
        onShare={onUpdateShareContactInfo}
      />
    </BannerWrapper>
  );
};
