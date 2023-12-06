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
import { clubSelectors } from '@/store/club';
import { userSelectors } from '@/store/user';
import { useMemo, useState } from 'react';
import { AboutYourselfDialog } from './about-yourself-dialog';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { UserTypeEnum } from '@/models/auth/user/UserContext';

export const UserProfile: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const history = useHistory();

  const dialog = useDialog();

  const { height } = useWindowSize();
  const { showMessage } = useSnackbar();
  const { clubId, leaderId, practitionerId, coachId, supportRoleId } =
    useParams<ClubsRouteState>();

  const { isOnline } = useOnlineStatus();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const user = useSelector(userSelectors.getUser);
  const { theme } = useTheme();

  const isCoach = user?.roles?.some(
    (item) => item?.name === UserTypeEnum.Coach
  );

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
        {(!isMemberProfile || clubMember?.shareContactInfo) && (
          <>
            <Typography
              type="body"
              text={
                (phoneNumber || whatsAppNumber) ?? 'Phone number unavailable'
              }
              color="secondary"
            />
            {((isCoachProfile && !isCoach) || !isCoachProfile) && (
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
        {isMemberProfile && !clubMember?.shareContactInfo && (
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
        {isCoachProfile && isCoach && (
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
              onClick={() => history.push(ROUTES.COACH.ABOUT.ROOT)}
            />
          </div>
        )}
      </div>
      <AboutYourselfDialog
        visible={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </BannerWrapper>
  );
};
