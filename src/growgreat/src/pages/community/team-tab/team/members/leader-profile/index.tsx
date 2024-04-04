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
import { useHistory, useLocation, useParams } from 'react-router';
import { LeaderProfileRouteParams, LeaderProfileRouteState } from './types';
import { TeamTabState } from '../../../types';

export const TeamLeaderProfile = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();
  const { state } = useLocation<TeamTabState & LeaderProfileRouteState>();

  const { theme } = useTheme();

  const { height } = useWindowSize();

  const { showMessage } = useSnackbar();

  const clinicDetails = useSelector(communitySelectors.getClinicSelector);

  const { leaderId } = useParams<LeaderProfileRouteParams>();

  const leader = clinicDetails?.teamLeads?.find(
    (leader) => leader.id === leaderId
  );

  const headerHeight = 254;

  const phoneNumber = leader?.phoneNumber;
  const whatsAppNumber = leader?.whatsAppNumber;
  const name = `${leader?.firstName} ${leader?.surname}`;
  const welcomeMessage = leader?.welcomeMessage;

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

  const onBack = () => {
    if (state?.isFromTeamTab) {
      return history.push(ROUTES.COMMUNITY.ROOT, {
        forceReload: false,
      } as TeamTabState);
    }

    if (state?.isFromAboutPage) {
      return history.push(ROUTES.PRACTITIONER.ABOUT);
    }

    if (state?.isFromIndividualPointsYearView) {
      return history.push(ROUTES.PRACTITIONER.INDIVIDUAL_POINTS.YEAR_VIEW);
    }

    history.push(ROUTES.COMMUNITY.TEAM.MEMBERS.ROOT);
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
      onBack={onBack}
    >
      <div className="inline-flex w-full flex-col items-center justify-center pt-8">
        <ProfileAvatar
          hasConsent={true}
          canChangeImage={false}
          dataUrl={''}
          userAvatarText={`${leader?.firstName?.charAt(0) ?? ''}${
            leader?.surname?.charAt(0) ?? ''
          }`}
          size={'header'}
        />
        <StatusChip
          backgroundColour="secondary"
          borderColour="secondary"
          text="Team leader"
          textColour="white"
          className="mt-4 px-3 py-1.5"
        />
        <Typography className="mt-4" type="h4" text={welcomeMessage} />
      </div>
      <div
        className="flex flex-col p-4 pt-6"
        style={{ height: height - headerHeight }}
      >
        <Typography type="h3" text={name} />
        <Typography
          type="body"
          text={phoneNumber || whatsAppNumber || 'Phone number unavailable'}
          color="secondary"
          className="mt-1"
        />
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
              text="WhatsApp team leader"
              color="primary"
            />
          </Button>
          <Button
            className="flex-grow"
            icon="PhoneIcon"
            type="outlined"
            color="primary"
            text="Call team leader"
            textColor="primary"
            onClick={onCall}
          />
        </div>
        <Alert
          type="info"
          title="WhatsApps and phone calls will be charged at your standard carrier rates."
        />
      </div>
    </BannerWrapper>
  );
};
