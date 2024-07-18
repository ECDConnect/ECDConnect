import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { userSelectors } from '@/store/user';
import { useDialog, useSnackbar, useTheme } from '@ecdlink/core';
import {
  ActionModal,
  Alert,
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
import ROUTES from '@/routes/routes';
import { DetailsCard } from '../community-profile/components/details-card';
import { ProfileSkills } from '../community-profile/components/profile-skills';
import { ConnectionProfileRouteState } from './connection-profile.types';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { useAppDispatch } from '@/store';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { useState } from 'react';
import { ConnectionContactDetails } from './connection-contact-details/connection-contact-details';

export const ConnectionProfile = () => {
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const dispatch = useAppDispatch();
  const loggedUserCommunityProfile = useSelector(
    communitySelectors.getCommunityProfile
  );
  const { state } = useLocation<ConnectionProfileRouteState>();
  const communityProfile = state?.connectionProfile;
  const { theme } = useTheme();
  const history = useHistory();
  const { showMessage } = useSnackbar();
  const [connectionAccepted, setConnectionAccepted] = useState<
    boolean | null | undefined
  >(communityProfile?.connectionAccepted);

  const handleGoBack = () => {
    history?.push(ROUTES.COMMUNITY.WELCOME, { isFromConnectProfile: true });
  };

  const handleCancelConnectionRequest = (isRemoval: boolean) => {
    const cancelledConnection = {
      fromCommunityProfileId: loggedUserCommunityProfile?.id,
      toCommunityProfileId: communityProfile?.id,
    };

    dispatch(
      communityThunkActions.cancelCommunityRequest({
        input: cancelledConnection,
      })
    ).then(() => {
      setConnectionAccepted(null);
      showMessage({
        message: isRemoval ? 'Connection Removed' : 'Request cancelled',
        type: 'success',
        duration: 3000,
      });
    });
  };

  const saveNewConnection = async () => {
    const addConnectionInput = {
      fromCommunityProfileId: loggedUserCommunityProfile?.id,
      toCommunityProfileId: communityProfile?.id,
    };
    dispatch(
      communityThunkActions.saveCommunityProfileConnections({
        input: [addConnectionInput],
      })
    ).then(() => {
      setConnectionAccepted(false);
      showMessage({
        message: 'Request sent',
        type: 'success',
        duration: 3000,
      });
    });
  };

  const handleOpenCancelRequestModal = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            customIcon={
              <ExclamationCircleIcon className="text-alertMain h-10 w-10 rounded-full" />
            }
            title="Are you sure you want to cancel the request?"
            actionButtons={[
              {
                colour: 'quatenary',
                type: 'filled',
                text: 'Yes, cancel request',
                textColour: 'white',
                onClick: () => {
                  handleCancelConnectionRequest(false);
                  onClose();
                },
                leadingIcon: 'TrashIcon',
              },
              {
                colour: 'quatenary',
                type: 'outlined',
                text: 'No, exit',
                textColour: 'quatenary',
                onClick: () => {
                  onClose();
                },
                leadingIcon: 'ArrowLeftIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const handleOpenRemoveConnectionModal = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            customIcon={
              <ExclamationCircleIcon className="text-alertMain h-10 w-10 rounded-full" />
            }
            title={`Are you sure you want to remove ${communityProfile?.communityUser?.fullName}?`}
            actionButtons={[
              {
                colour: 'quatenary',
                type: 'filled',
                text: 'Yes, remove connection',
                textColour: 'white',
                onClick: () => {
                  handleCancelConnectionRequest(true);
                  onClose();
                },
                leadingIcon: 'ArrowLeftIcon',
              },
              {
                colour: 'quatenary',
                type: 'outlined',
                text: 'No, cancel',
                textColour: 'quatenary',
                onClick: () => {
                  onClose();
                },
                leadingIcon: 'TrashIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const renderConnectionCard = (
    connectionAccepted: boolean | null | undefined
  ) => {
    switch (connectionAccepted) {
      case false:
        return (
          <Alert
            className="mb-4 mt-2 rounded-2xl"
            title={`Request sent! Waiting for ${communityProfile?.communityUser?.fullName} to accept.`}
            type="info"
            button={
              <Button
                className={'my-2 w-full rounded-2xl'}
                type="outlined"
                color="secondary"
                onClick={() => handleOpenCancelRequestModal()}
                text="Cancel request"
                textColor="secondary"
                background="transparent"
                icon="TrashIcon"
                size="small"
              />
            }
          />
        );
      case true:
        return (
          <Alert
            className="mb-4 mt-2 rounded-2xl"
            title={`Connect with ${communityProfile?.communityUser?.fullName}`}
            type="success"
            button={
              <Button
                className={'my-2 w-full rounded-2xl'}
                type="outlined"
                color="secondary"
                onClick={() => handleOpenRemoveConnectionModal()}
                text="Remove connection"
                textColor="secondary"
                background="transparent"
                icon="TrashIcon"
                size="small"
              />
            }
          />
        );
      default:
        return (
          <div className="mb-4 mt-2 flex w-full flex-col justify-center gap-3">
            <Button
              className="w-full rounded-2xl px-2"
              type="filled"
              color="quatenary"
              textColor="white"
              text={`Connect with ${communityProfile?.communityUser?.fullName}`}
              icon="ShareIcon"
              iconPosition="start"
              onClick={() => saveNewConnection()}
            />
          </div>
        );
    }
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
              backgroundColour={
                communityProfile?.communityUser?.roleName === 'Principal'
                  ? 'infoDark'
                  : 'quatenary'
              }
              borderColour={
                communityProfile?.communityUser?.roleName === 'Principal'
                  ? 'infoDark'
                  : 'quatenary'
              }
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
          <div>{renderConnectionCard(connectionAccepted)}</div>
          {connectionAccepted && (
            <div className="mb-4">
              <ConnectionContactDetails
                connectionCommunityProfile={communityProfile}
              />
            </div>
          )}
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
