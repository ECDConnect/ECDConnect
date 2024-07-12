import { communitySelectors } from '@/store/community';
import { ProfileAvatar, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';

export const CommunityProfile = () => {
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const profilePhoto = communityProfile?.communityUser?.profilePhoto;
  const profileName = communityProfile?.communityUser?.fullName;
  const communityAboutShort = communityProfile?.aboutShort;

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
