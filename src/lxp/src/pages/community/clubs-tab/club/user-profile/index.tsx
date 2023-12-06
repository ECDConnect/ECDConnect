import {
  Alert,
  BannerWrapper,
  Button,
  DialogPosition,
  ProfileAvatar,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { useDialog, useSnackbar, useTheme } from '@ecdlink/core';
import { ClubsRouteState } from '../../index.types';
import { useWindowSize } from '@reach/window-size';
import ROUTES from '@/routes/routes';
import { useSelector } from 'react-redux';
import { clubSelectors, clubThunkActions } from '@/store/club';
import { userSelectors } from '@/store/user';
import { useEffect, useMemo, useState } from 'react';
import { AboutYourselfDialog } from './about-yourself-dialog';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { practitionerSelectors } from '@/store/practitioner';
import { useAppDispatch } from '@/store';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';
import { ShareContactDialog } from './share-contact-dialog';

export const UserProfile: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShareContactInfoDialogOpen, setShareContactInfoDialogOpen] =
    useState(false);

  const history = useHistory();

  const dialog = useDialog();

  const appDispatch = useAppDispatch();

  const { height } = useWindowSize();
  const { showMessage } = useSnackbar();
  const { clubId, leaderId, practitionerId, coachId, supportRoleId } =
    useParams<ClubsRouteState>();

  const { isOnline } = useOnlineStatus();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const { theme } = useTheme();

  const {
    isLoading: isLoadingWelcomeMessage,
    wasLoading: wasLoadingWelcomeMessage,
    isRejected: isRejectedWelcomeMessage,
    error: errorWelcomeMessage,
  } = useThunkFetchCall('clubs', ClubActions.SAVE_WELCOME_MESSAGE);

  const isCoach = user?.roles?.some(
    (item) => item?.name === UserTypeEnum.Coach
  );
  const isLeader = club?.clubLeader?.userId === user?.id;
  const isMember =
    practitionerId === user?.id ||
    (practitionerId === practitioner?.id &&
      user?.idNumber === practitioner?.user?.idNumber);

  const isCoachProfile = !!coachId;
  const isLeaderProfile = !!leaderId;
  const isMemberProfile = !!practitionerId;
  const isSupportRole = !!supportRoleId;

  const clubMember = club?.clubMembers.find((member) => {
    if (isSupportRole) {
      return member.userId === supportRoleId;
    }

    return (
      member.practitionerId === (isMemberProfile ? practitionerId : leaderId)
    );
  });

  const name = isCoachProfile
    ? `${club?.clubCoach.firstName} ${club?.clubCoach.surname}`
    : `${clubMember?.firstName} ${clubMember?.surname}`;

  const whatsAppNumber = isCoachProfile
    ? club?.clubCoach.whatsAppNumber
    : clubMember?.whatsAppNumber;

  const phoneNumber = isCoachProfile
    ? club?.clubCoach.phoneNumber || club?.clubCoach.whatsAppNumber
    : clubMember?.phoneNumber || clubMember?.whatsAppNumber;

  const headerHeight = isMemberProfile ? 254 : 300;
  const userRole = useMemo(() => {
    if (isCoachProfile) {
      return 'Coach';
    }

    if (isLeaderProfile) {
      return 'Club leader';
    }

    if (isSupportRole) {
      return 'Club support role';
    }

    return '';
  }, [isCoachProfile, isLeaderProfile, isSupportRole]);

  const onOffline = () => {
    return dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onClose) => {
        return <OnlineOnlyModal onSubmit={onClose} />;
      },
    });
  };

  const onOnlineNavigation = (route: string) => {
    if (isOnline) {
      return history.push(route);
    }

    return onOffline();
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

  const onUpdateShareContactInfo = async (shareContactInfo: boolean) => {
    await appDispatch(
      clubThunkActions.saveWelcomeMessage({
        clubId,
        practitionerId: practitioner?.id,
        welcomeMessage: clubMember?.welcomeMessage ?? '',
        shareContactInfo,
      })
    );
  };

  const handleUpdateAboutInfo = () => {
    if (clubMember?.shareContactInfo) {
      return onUpdateShareContactInfo(false);
    }

    return setShareContactInfoDialogOpen(true);
  };

  useEffect(() => {
    if (wasLoadingWelcomeMessage && !isLoadingWelcomeMessage) {
      if (isRejectedWelcomeMessage) {
        showMessage({ message: errorWelcomeMessage, type: 'error' });
      } else {
        setShareContactInfoDialogOpen(false);
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
      onBack={() => history.goBack()}
    >
      <div className="inline-flex w-full flex-col items-center justify-center pt-8">
        <ProfileAvatar
          hasConsent={true}
          canChangeImage={false}
          dataUrl={
            isCoachProfile
              ? user?.profileImageUrl
              : clubMember?.profileImageUrl ?? ''
          }
          size={'header'}
        />
        {!isMemberProfile && (
          <StatusChip
            backgroundColour="primary"
            borderColour="primary"
            text={userRole}
            textColour="white"
            className="mt-4 px-3 py-1.5"
          />
        )}
        <Typography
          className="mt-4"
          type="h4"
          text={
            isCoachProfile
              ? club?.clubCoach.aboutInfo ?? ''
              : clubMember?.welcomeMessage ?? ''
          }
        />
      </div>
      <div
        className="flex flex-col p-4 pt-6"
        style={{ height: height - headerHeight }}
      >
        <Typography type="h3" text={name} />
        {(clubMember?.shareContactInfo || isMember) && (
          <Typography
            type="body"
            text={(phoneNumber && whatsAppNumber) ?? 'Phone number unavailable'}
            color="secondary"
          />
        )}
        {isMember && (
          <Alert
            className="mt-5"
            type={clubMember?.shareContactInfo ? 'info' : 'warning'}
            title={
              clubMember?.shareContactInfo
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
                icon={clubMember?.shareContactInfo ? 'XIcon' : 'ShareIcon'}
                text={
                  clubMember?.shareContactInfo
                    ? 'Stop sharing'
                    : 'Start sharing'
                }
                onClick={handleUpdateAboutInfo}
              />
            }
          />
        )}
        {clubMember?.shareContactInfo && !isMember && (
          <>
            {((isCoachProfile && !isCoach) ||
              (isMemberProfile && !isMember) ||
              (isLeaderProfile && !isLeader)) && (
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
                      text={`WhatsApp ${
                        isLeaderProfile
                          ? 'club leader'
                          : isCoachProfile
                          ? 'coach'
                          : 'practitioner'
                      }`}
                      color="primary"
                    />
                  </Button>
                  <Button
                    className="flex-grow"
                    icon="PhoneIcon"
                    type="outlined"
                    color="primary"
                    text={`Call ${
                      isLeaderProfile
                        ? 'club leader'
                        : isCoachProfile
                        ? 'coach'
                        : 'practitioner'
                    }`}
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
          </>
        )}
        {!clubMember?.shareContactInfo && !isMember && (
          <Alert
            className="mt-5"
            type="info"
            title="Practitioner has not shared contact details."
          />
        )}
        {isLeaderProfile && isCoach && (
          <Button
            className="mt-auto"
            icon="RefreshIcon"
            type="filled"
            color="primary"
            text="Change club leader"
            textColor="white"
            onClick={() =>
              onOnlineNavigation(
                ROUTES.COMMUNITY.CLUB.LEADER.EDIT.replace(':clubId', clubId)
              )
            }
          />
        )}
        {((isCoachProfile && isCoach) ||
          (isMemberProfile && isMember) ||
          (isLeaderProfile && isLeader)) && (
          <div className="mt-auto flex flex-col gap-4">
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
              onClick={() =>
                history.push(
                  isCoach
                    ? ROUTES.COACH.ABOUT.ROOT
                    : ROUTES.PRACTITIONER.ABOUT.ROOT
                )
              }
            />
          </div>
        )}
      </div>
      <AboutYourselfDialog
        visible={isDialogOpen}
        clubId={clubId}
        shareContactInfo={!!clubMember?.shareContactInfo}
        onClose={() => setIsDialogOpen(false)}
      />
      <ShareContactDialog
        isLoading={isLoadingWelcomeMessage}
        visible={isShareContactInfoDialogOpen}
        onClose={() => setShareContactInfoDialogOpen(false)}
        onShare={() => onUpdateShareContactInfo(true)}
      />
    </BannerWrapper>
  );
};
