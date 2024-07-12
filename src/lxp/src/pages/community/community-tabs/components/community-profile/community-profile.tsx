import { useAppDispatch } from '@/store';
import { coachThunkActions } from '@/store/coach';
import { communitySelectors } from '@/store/community';
import { practitionerSelectors } from '@/store/practitioner';
import { ProfileAvatar, Typography } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const CommunityProfile = () => {
  const dispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const profilePhoto = communityProfile?.communityUser?.profilePhoto;
  const profileName = communityProfile?.communityUser?.fullName;
  const communityAboutShort = communityProfile?.aboutShort;
  const profileCoachId = communityProfile?.coachUserId;

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
    <div>
      <div className="flex gap-2 p-4">
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
    </div>
  );
};
