import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { userSelectors } from '@/store/user';
import { BannerWrapper, Button, FormInput, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { CommunityProfileInputModelInput } from '@ecdlink/graphql';
import { useSnackbar } from '@ecdlink/core';
import { FieldError } from 'react-hook-form';

interface AboutDescriptionProps {
  onClose?: (item: boolean) => void;
}

export const AboutDescription: React.FC<AboutDescriptionProps> = ({
  onClose,
}) => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const { showMessage } = useSnackbar();
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const user = useSelector(userSelectors.getUser);
  const communityUser = communityProfile?.communityUser;
  const [aboutLong, setAboutLong] = useState(communityProfile?.aboutLong);
  const skillIds = communityProfile?.profileSkills?.map((item) => item?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [isUrl, setIsUrl] = useState('');

  useEffect(() => {
    if (
      new RegExp(
        '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?'
      ).test(aboutLong)
    ) {
      setIsUrl(
        'Oops! No links allowed. Please remove all links to save your content.'
      );
    } else {
      setIsUrl('');
    }
  }, [aboutLong]);

  const onSave = async () => {
    setIsLoading(true);
    const copy = cloneDeep(communityProfile);

    const saveCommunityProfileInput: CommunityProfileInputModelInput = {
      userId: copy?.userId!,
      aboutShort: copy?.aboutShort,
      aboutLong: aboutLong,
      shareContactInfo: copy?.shareContactInfo,
      shareProfilePhoto: copy?.shareProfilePhoto,
      shareProvince: copy?.shareProvince,
      provinceId: copy?.provinceId,
      sharePhoneNumber: copy?.sharePhoneNumber,
      shareEmail: copy?.shareEmail,
      communitySkillIds: skillIds,
      shareRole: copy?.shareRole,
    };

    if (copy) {
      copy.aboutLong = aboutLong;
      await dispatch(
        communityThunkActions.saveCommunityProfile({
          input: saveCommunityProfileInput,
        })
      ).then(() => {
        onClose && onClose(false);
        showMessage({
          message: 'Profile updated',
          type: 'success',
          duration: 3000,
        });
      });
    }

    setIsLoading(false);
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={`About`}
      color={'primary'}
      onBack={() => onClose && onClose(false)}
      displayOffline={!isOnline}
      onClose={() => onClose && onClose(false)}
    >
      <div className="p-4">
        <Typography
          type={'h2'}
          text={`About ${user?.firstName}`}
          color={'textDark'}
        />
        <FormInput
          type="text"
          textInputType="textarea"
          label={`Write a short description about yourself so that others can get to know you`}
          value={aboutLong}
          onChange={(e) => setAboutLong(e?.target?.value)}
          placeholder={'Add a short description....'}
          className="mt-6"
          maxCharacters={250}
          maxLength={250}
          error={isUrl as unknown as FieldError}
        />
        {isUrl && <Typography type={'help'} text={isUrl} color={'errorMain'} />}
        <div className="mt-4 flex w-full flex-col justify-center gap-3">
          <Button
            className="w-full rounded-2xl px-2"
            type="filled"
            color="quatenary"
            textColor="white"
            text={`Save`}
            icon="SaveIcon"
            iconPosition="start"
            isLoading={isLoading}
            disabled={isLoading || !!isUrl}
            onClick={onSave}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
