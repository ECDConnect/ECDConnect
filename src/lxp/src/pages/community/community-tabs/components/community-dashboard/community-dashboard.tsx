import { useTenant } from '@/hooks/useTenant';
import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@/store';
import { coachSelectors, coachThunkActions } from '@/store/coach';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { practitionerSelectors } from '@/store/practitioner';
import { getAvatarColor } from '@ecdlink/core';
import {
  Button,
  ProfileAvatar,
  StackedList,
  StackedListType,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export const CommunityDashboard = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const profilePhoto = communityProfile?.communityUser?.profilePhoto;
  const profileName = communityProfile?.communityUser?.fullName;
  const communityAboutShort = communityProfile?.aboutShort;
  const profileCoachId = communityProfile?.coachUserId;
  const tenant = useTenant();
  const coach = useSelector(coachSelectors?.getCoach);

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
    profileDataUrl: '',
    profileText:
      (coach?.user?.firstName?.charAt(0) || '') +
      (coach?.user?.surname?.charAt(0) || ''),
    avatarColor: '#FF2180',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    menuIconClassName: 'bg-secondaryAccent2',
    backgroundColor: 'secondaryAccent2',
    onActionClick: () => {},
  };

  const communityConnections: UserAlertListDataItem[] = [
    {
      title: `${'Hope Mokoena'}`,
      titleStyle: 'text-textDark',
      profileDataUrl: '',
      profileText:
        (coach?.user?.firstName?.charAt(0) || '') +
        (coach?.user?.surname?.charAt(0) || ''),
      avatarColor: getAvatarColor(),
      alertSeverity: 'none',
      hideAlertSeverity: true,
      menuIconClassName: 'bg-secondaryAccent2',
      backgroundColor: 'adminBackground',
      onActionClick: () => {},
    },
    {
      title: `${'Hope Mokoena'}`,
      titleStyle: 'text-textDark',
      profileDataUrl: '',
      profileText:
        (coach?.user?.firstName?.charAt(0) || '') +
        (coach?.user?.surname?.charAt(0) || ''),
      avatarColor: getAvatarColor(),
      alertSeverity: 'none',
      hideAlertSeverity: true,
      menuIconClassName: 'bg-secondaryAccent2',
      backgroundColor: 'adminBackground',
      onActionClick: () => {},
    },

    {
      title: `${'Hope Mokoena'}`,
      titleStyle: 'text-textDark',
      profileDataUrl: '',
      profileText:
        (coach?.user?.firstName?.charAt(0) || '') +
        (coach?.user?.surname?.charAt(0) || ''),
      avatarColor: getAvatarColor(),
      alertSeverity: 'none',
      hideAlertSeverity: true,
      menuIconClassName: 'bg-secondaryAccent2',
      backgroundColor: 'adminBackground',
      onActionClick: () => {},
    },

    {
      title: `${'Hope Mokoena'}`,
      titleStyle: 'text-textDark',
      profileDataUrl: '',
      profileText:
        (coach?.user?.firstName?.charAt(0) || '') +
        (coach?.user?.surname?.charAt(0) || ''),
      avatarColor: getAvatarColor(),
      alertSeverity: 'none',
      hideAlertSeverity: true,
      menuIconClassName: 'bg-secondaryAccent2',
      backgroundColor: 'adminBackground',
      onActionClick: () => {},
    },

    {
      title: `${'Hope Mokoena'}`,
      titleStyle: 'text-textDark',
      profileDataUrl: '',
      profileText:
        (coach?.user?.firstName?.charAt(0) || '') +
        (coach?.user?.surname?.charAt(0) || ''),
      avatarColor: getAvatarColor(),
      alertSeverity: 'none',
      hideAlertSeverity: true,
      menuIconClassName: 'bg-secondaryAccent2',
      backgroundColor: 'adminBackground',
      onActionClick: () => {},
    },
  ];

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
      {true && (
        <div className="py-8">
          <Typography className="my-2" type="h3" text="Coach" />
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
        <Typography type={'h2'} text={'Your community'} color={'textDark'} />
        <div>
          <StackedList
            isFullHeight={false}
            type={'UserAlertList' as StackedListType}
            listItems={communityConnections}
          />
        </div>
      </div>
      <div className="mb-16 mt-4 flex w-full flex-col justify-center gap-3">
        <Button
          className="w-full rounded-2xl px-2"
          type="filled"
          color="quatenary"
          textColor="white"
          text="See ECD Heroes"
          icon="UserGroupIcon"
          iconPosition="start"
          onClick={() => {}}
        />
        <Button
          className="w-full rounded-2xl px-2"
          type="outlined"
          color="quatenary"
          textColor="quatenary"
          text="Edit my profile"
          icon="PencilIcon"
          iconPosition="start"
          onClick={() => history.push(ROUTES.COMMUNITY.PROFILE)}
        />
      </div>
    </div>
  );
};
