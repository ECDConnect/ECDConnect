import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDialog, useSnackbar, useTheme } from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  BannerWrapper,
  Button,
  DialogPosition,
  LoadingSpinner,
  ProfileAvatar,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import ROUTES from '@/routes/routes';
import { DetailsCard } from '../community-profile/components/details-card/details-card';
import { ProfileSkills } from '../community-profile/components/profile-skills/profile-skills';
import { ConnectionProfileRouteState } from './connection-profile.types';
import { ExclamationCircleIcon, HandIcon } from '@heroicons/react/solid';
import { useAppDispatch } from '@/store';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { useEffect, useState } from 'react';
import { ConnectionContactDetails } from './connection-contact-details/connection-contact-details';
import { AcceptRejectCommunityRequestsInputModelInput } from '@ecdlink/graphql';
import TransparentLayer from '../../../assets/TransparentLayer.png';

export const ConnectionProfile = () => {
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const dispatch = useAppDispatch();
  const loggedUserCommunityProfile = useSelector(
    communitySelectors.getCommunityProfile
  );
  const { state } = useLocation<ConnectionProfileRouteState>();
  const communityProfile = state?.connectionProfile;
  const isFromReceivedConnections = state?.isFromReceivedConnections;
  const isConnectedScreen = state?.isConnectedScreen;
  const isFromDashboard = state?.isFromDashboard;
  const { theme } = useTheme();
  const history = useHistory();
  const { showMessage } = useSnackbar();
  const [connectionAccepted, setConnectionAccepted] = useState<
    boolean | null | undefined
  >(communityProfile?.connectionAccepted);
  const hasSentConnectionRequest =
    loggedUserCommunityProfile?.pendingConnections?.find(
      (item) => item?.id === communityProfile?.id
    );

  const handleGoBack = () => {
    if (isFromReceivedConnections) {
      history.push(ROUTES.COMMUNITY.RECEIVED_REQUESTS, {
        isRequest: isConnectedScreen ? false : true,
        isFromReceivedConnections: true,
        isConnectedScreen: isConnectedScreen ? true : false,
      });
      return;
    }

    if (isFromDashboard) {
      history.push(ROUTES.COMMUNITY.WELCOME);
      return;
    }
    history?.push(ROUTES.COMMUNITY.ECD_HEROES_LIST, {
      isFromConnectionProfile: true,
    });
  };
  const [acceptOrRejectIsLoading, setAcceptOrRejectIsLoading] = useState(false);

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

  const handleAcceptOrRejectConnectionRequest = async (accept: boolean) => {
    setAcceptOrRejectIsLoading(true);
    if (accept) {
      const acceptedInput: AcceptRejectCommunityRequestsInputModelInput = {
        userId: loggedUserCommunityProfile?.userId,
        userIdsToAccept: [communityProfile?.userId],
      };

      await dispatch(
        communityThunkActions.acceptOrRejectCommunityRequests({
          input: acceptedInput,
        })
      );
      await dispatch(
        communityThunkActions.getCommunityProfile({
          userId: loggedUserCommunityProfile?.userId!,
        })
      ).then(() => {
        setAcceptOrRejectIsLoading(false);
        setConnectionAccepted(true);
        showMessage({
          message: 'Connection accepted',
          type: 'success',
          duration: 3000,
        });
      });
    } else {
      const rejectedInput: AcceptRejectCommunityRequestsInputModelInput = {
        userId: loggedUserCommunityProfile?.userId,
        userIdsToReject: [communityProfile?.userId],
      };

      const rejectResponse = await dispatch(
        communityThunkActions.acceptOrRejectCommunityRequests({
          input: rejectedInput,
        })
      );

      if (rejectResponse) {
        await dispatch(
          communityThunkActions.getCommunityProfile({
            userId: loggedUserCommunityProfile?.userId!,
          })
        ).then(() => {
          setAcceptOrRejectIsLoading(false);
          showMessage({
            message: 'Connection ignored!',
            type: 'success',
            duration: 3000,
          });
        });
      }
    }
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
            titleType="h4"
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
            title={`Connected with ${communityProfile?.communityUser?.fullName}`}
            titleType="h4"
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
        backgroundUrl={TransparentLayer}
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
        <div className="mb-12 flex w-full flex-col gap-2 overflow-auto p-4">
          <div
            className={
              'mt-2.5 flex w-full flex-row items-center justify-center'
            }
          >
            {communityProfile?.shareRole && (
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
                text={
                  communityProfile?.communityUser?.roleName || 'Practitioner'
                }
                textColour={'white'}
                className={'mr-2'}
              />
            )}
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
          <div>
            {!hasSentConnectionRequest &&
              renderConnectionCard(connectionAccepted)}
            {hasSentConnectionRequest &&
              (acceptOrRejectIsLoading ? (
                <div className="my-4">
                  <LoadingSpinner
                    size="small"
                    spinnerColor="quatenary"
                    backgroundColor="uiLight"
                    className="my-4"
                  />
                </div>
              ) : (
                <Alert
                  className="my-4"
                  type={'info'}
                  title={`${hasSentConnectionRequest?.communityUser?.fullName?.replace(
                    / .*/,
                    ''
                  )} wants to connect`}
                  message="Want to connect?"
                  messageColor="textMid"
                  titleType="h4"
                  titleColor="textDark"
                  customIcon={
                    <div
                      className={`bg-infoMain flex h-12 w-14 items-center justify-center rounded-full`}
                    >
                      <HandIcon className="h-8 w-8 text-white" />
                    </div>
                  }
                  button={
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        text={`Connect`}
                        type={'filled'}
                        color={'quatenary'}
                        textColor={'white'}
                        onClick={() =>
                          handleAcceptOrRejectConnectionRequest(true)
                        }
                        size="small"
                        icon="PlusIcon"
                        className="rounded-xl"
                      />
                      <Button
                        text={`Ignore`}
                        type={'outlined'}
                        color={'secondary'}
                        textColor={'secondary'}
                        onClick={() =>
                          handleAcceptOrRejectConnectionRequest(false)
                        }
                        size="small"
                        icon="XIcon"
                        className="rounded-xl"
                        background="transparent"
                      />
                    </div>
                  }
                />
              ))}
          </div>
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
