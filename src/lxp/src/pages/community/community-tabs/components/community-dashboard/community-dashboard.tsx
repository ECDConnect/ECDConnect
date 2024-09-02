import { useTenant } from '@/hooks/useTenant';
import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@/store';
import { coachSelectors, coachThunkActions } from '@/store/coach';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { practitionerSelectors } from '@/store/practitioner';
import { getAvatarColor, LocalStorageKeys } from '@ecdlink/core';
import {
  Alert,
  Button,
  Dialog,
  DialogPosition,
  EmptyPage,
  ProfileAvatar,
  StackedList,
  StackedListType,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import AlienImage from '@/assets/ECD_Connect_alien2.svg';
import { CommunityCoachProfile } from './components/community-coach-profile/community-coach-profile';
import { BellIcon } from '@heroicons/react/solid';

export const CommunityDashboard = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const profilePhoto = communityProfile?.communityUser?.profilePhoto;
  const profileName = communityProfile?.communityUser?.fullName;
  const communityAboutShort = communityProfile?.aboutShort;
  const communityAboutLong = communityProfile?.aboutLong;
  const receivedConnections = communityProfile?.pendingConnections;
  const profileCoachId = communityProfile?.coachUserId;
  const firstTimeOnCommunityDashboard = window.localStorage.getItem(
    LocalStorageKeys.firstTimeOnCommunityDashboard
  );

  const renderConnectionsRequestsString = useMemo(
    () =>
      receivedConnections && receivedConnections?.length > 1
        ? 'requests'
        : 'request',
    [receivedConnections]
  );
  const tenant = useTenant();
  const coach = useSelector(coachSelectors?.getCoach);
  const [openCoachProfile, setOpenCoachProfile] = useState(false);

  useEffect(() => {
    if (practitioner) {
      updateCommunityProfile();
    }
  }, [practitioner]);

  const updateCommunityProfile = useCallback(async () => {
    dispatch(
      communityThunkActions.getCommunityProfile({
        userId: practitioner?.userId!,
      })
    ).unwrap();
  }, []);

  const coachItem: UserAlertListDataItem = {
    title: `${coach?.user?.firstName} ${coach?.user?.surname}`,
    titleStyle: 'text-textDark',
    profileDataUrl: coach?.user?.profileImageUrl || '',
    profileText:
      (coach?.user?.firstName?.charAt(0) || '') +
      (coach?.user?.surname?.charAt(0) || ''),
    avatarColor: '#FF2180',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    menuIconClassName: 'bg-secondaryAccent2',
    backgroundColor: 'secondaryAccent2',
    onActionClick: () => setOpenCoachProfile(true),
  };

  const communityAcceptedConnections: UserAlertListDataItem[] = useMemo(() => {
    return (
      communityProfile?.acceptedConnections?.map((item) => {
        return {
          title: item?.communityUser?.fullName!,
          titleStyle: 'text-textDark',
          profileDataUrl: item?.shareProfilePhoto
            ? item?.communityUser?.profilePhoto
            : '',
          profileText: item?.communityUser?.fullName
            ?.match(/^(\w)\w*\s+(\w{1,2})/)
            ?.slice(1)
            .join('')
            ?.toLocaleUpperCase(),
          avatarColor: getAvatarColor(),
          alertSeverity: 'none',
          hideAlertSeverity: true,
          menuIconClassName: 'bg-secondaryAccent2',
          backgroundColor: 'adminBackground',
          subTitle: item?.aboutShort,
          subTitleStyle: 'text-infoDark',
          onActionClick: () => {
            localStorage.removeItem(
              LocalStorageKeys.firstTimeOnCommunityDashboard
            );
            history.push(ROUTES.COMMUNITY.CONNECTION_PROFILE, {
              connectionProfile: item,
              isFromDashboard: true,
            });
          },
        };
      }) || []
    );
  }, [communityProfile?.acceptedConnections, history]);

  useEffect(() => {
    if (profileCoachId) {
      (async () =>
        await dispatch(
          coachThunkActions.getCoachByCoachId({
            coachId: practitioner?.coachHierarchy!,
          })
        ).unwrap())();
    }
  }, [profileCoachId]);

  const renderYourCommunityList = useMemo(() => {
    if (communityAcceptedConnections?.length > 0) {
      const lastFourConnections = communityAcceptedConnections?.slice(0, 4);
      return (
        <StackedList
          isFullHeight={false}
          type={'UserAlertList' as StackedListType}
          listItems={lastFourConnections}
          className="my-2 flex flex-col gap-1"
        />
      );
    } else {
      return (
        <EmptyPage
          title={`Hi ${communityProfile?.communityUser?.fullName}, you don’t have any connections yet!`}
          subTitle="Tap “See ECD Heroes” to get started!"
          image={AlienImage}
        />
      );
    }
  }, [communityAcceptedConnections, communityProfile?.communityUser?.fullName]);

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <ProfileAvatar
          hasConsent={true}
          canChangeImage={false}
          dataUrl={profilePhoto || ''}
          size={'lg'}
        />
        <div>
          <Typography type={'h2'} text={profileName} color={'textDark'} />
          <Typography
            type={'help'}
            text={communityAboutShort}
            color={'textDark'}
          />
        </div>
      </div>
      {!communityAboutLong && (
        <Alert
          type="success"
          className="mt-4"
          title={`You've created your profile! Share more information with your fellow educators.`}
          button={
            <Button
              text={`Add more details`}
              type={'filled'}
              color={'quatenary'}
              textColor={'white'}
              onClick={() => {
                localStorage.removeItem(
                  LocalStorageKeys.firstTimeOnCommunityDashboard
                );
                history.push(ROUTES.COMMUNITY.PROFILE, {
                  isFromAddMoreDetails: true,
                });
              }}
              size="small"
              icon="PencilIcon"
              className="rounded-xl"
            />
          }
        />
      )}
      {receivedConnections &&
        receivedConnections?.length > 0 &&
        firstTimeOnCommunityDashboard && (
          <Alert
            className="mt-4"
            type={'info'}
            title={`You have ${receivedConnections?.length} new connection ${renderConnectionsRequestsString}!`}
            titleType="h3"
            titleColor="textDark"
            customIcon={
              <div
                className={`bg-infoMain flex h-12 w-14 items-center justify-center rounded-full`}
              >
                <BellIcon className="h-8 w-8 text-white" />
              </div>
            }
            button={
              <Button
                text={`See requests`}
                type={'filled'}
                color={'quatenary'}
                textColor={'white'}
                onClick={() => {
                  localStorage.removeItem(
                    LocalStorageKeys.firstTimeOnCommunityDashboard
                  );
                  history.push(ROUTES.COMMUNITY.RECEIVED_REQUESTS, {
                    isRequest: true,
                  });
                }}
                size="small"
                icon="EyeIcon"
                className="rounded-xl"
              />
            }
          />
        )}
      {coach?.user?.id && (
        <div className="py-4">
          <Typography
            className="my-2"
            type="h3"
            text={tenant?.tenant?.modules?.coachRoleName}
          />
          <div>
            <StackedList
              isFullHeight={false}
              type={'UserAlertList' as StackedListType}
              listItems={[coachItem]}
            />
          </div>
        </div>
      )}
      <div>
        <Typography
          type={'h2'}
          text={'Your community'}
          color={'textDark'}
          className="
        my-2"
        />
        <div>{renderYourCommunityList}</div>
      </div>
      <div className="mb-36 mt-6 flex w-full flex-col justify-center gap-3">
        <Button
          className="w-full rounded-2xl px-2"
          type="filled"
          color="quatenary"
          textColor="white"
          text="See ECD Heroes"
          icon="UserGroupIcon"
          iconPosition="start"
          onClick={() => {
            localStorage.removeItem(
              LocalStorageKeys.firstTimeOnCommunityDashboard
            );
            history.push(ROUTES.COMMUNITY.ECD_HEROES_LIST);
          }}
        />
        <Button
          className="w-full rounded-2xl px-2"
          type="outlined"
          color="quatenary"
          textColor="quatenary"
          text="Edit my profile"
          icon="PencilIcon"
          iconPosition="start"
          onClick={() => {
            localStorage.removeItem(
              LocalStorageKeys.firstTimeOnCommunityDashboard
            );
            history.push(ROUTES.COMMUNITY.PROFILE);
          }}
        />
      </div>
      <Dialog
        visible={openCoachProfile}
        position={DialogPosition.Full}
        stretch={true}
      >
        <CommunityCoachProfile onClose={setOpenCoachProfile} />
      </Dialog>
    </div>
  );
};
