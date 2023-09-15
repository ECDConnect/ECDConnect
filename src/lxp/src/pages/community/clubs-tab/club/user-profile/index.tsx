import {
  Alert,
  BannerWrapper,
  Button,
  ProfileAvatar,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { mockedClub } from '../individual-club-view';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { useTheme } from '@ecdlink/core';
import { ClubsRouteState } from '../../index.types';
import { useWindowSize } from '@reach/window-size';
import ROUTES from '@/routes/routes';

export const UserProfile: React.FC = () => {
  const history = useHistory();

  const { height } = useWindowSize();

  const params = useParams<ClubsRouteState>();

  const { theme } = useTheme();

  const isLeader = !!params.leaderId;
  const isMember = !!params.practitionerId;

  const headerHeight = isMember ? 254 : 300;
  const userRole = '{userRole}'; // club leader or club supporter role;

  return (
    <BannerWrapper
      showBackground
      backgroundUrl={theme?.images.graphicOverlayUrl}
      className="z-10"
      size="small"
      title="{selectedUser}"
      onBack={() => history.goBack()}
    >
      <div className="inline-flex w-full flex-col items-center justify-center pt-8">
        <ProfileAvatar
          hasConsent={true}
          canChangeImage={false}
          dataUrl={mockedClub.iconUrl}
          size={'header'}
        />
        {!isMember && (
          <StatusChip
            backgroundColour="primary"
            borderColour="primary"
            text={userRole}
            textColour="white"
            className="mt-4 px-3 py-1.5"
          />
        )}
        <Typography className="mt-4" type="h4" text="{user description}" />
      </div>
      <div
        className="flex flex-col p-4 pt-6"
        style={{ height: height - headerHeight }}
      >
        <Typography type="h3" text="{user name}" />
        <Typography type="body" text="{user phone number}" color="secondary" />
        <div className="my-4 flex flex-wrap justify-between gap-4">
          <Button
            className="flex-grow"
            type="outlined"
            color="primary"
            textColor="primary"
          >
            <img
              src={getLogo(LogoSvgs.whatsapp)}
              alt="whatsapp"
              className="mr-2"
            />
            <Typography
              type="button"
              text={`WhatsApp ${isLeader ? 'club leader' : 'practitioner'}`}
              color="primary"
            />
          </Button>
          <Button
            className="flex-grow"
            icon="PhoneIcon"
            type="outlined"
            color="primary"
            text={`Call ${isLeader ? 'club leader' : 'practitioner'}`}
            textColor="primary"
          />
        </div>
        <Alert
          type="info"
          title="WhatsApps and phone calls will be charged at your standard carrier rates."
        />
        {isLeader && (
          <Button
            className="mt-auto"
            icon="RefreshIcon"
            type="filled"
            color="primary"
            text="Change club leader"
            textColor="white"
            onClick={() =>
              history.push(
                ROUTES.COMMUNITY.CLUB.LEADER.EDIT.replace(
                  ':clubId',
                  params.clubId
                )
              )
            }
          />
        )}
      </div>
    </BannerWrapper>
  );
};
