import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { userSelectors } from '@/store/user';
import {
  BannerWrapper,
  Button,
  CheckboxGroup,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';
import { CommunityProfileInputModelInput } from '@ecdlink/graphql';
import { useSnackbar } from '@ecdlink/core';
import { staticDataSelectors } from '@/store/static-data';

interface AboutDescriptionProps {
  onClose?: (item: boolean) => void;
}

export const EditCommunitySkills: React.FC<AboutDescriptionProps> = ({
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
  const communitySkills = useSelector(staticDataSelectors.getCommunitySkills);
  const [communitySkillsAdded, setCommunitySkillsAdded] = useState<string[]>(
    []
  );

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
      communitySkillIds: communitySkillsAdded,
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

  useEffect(() => {
    const userCommunitySkills = communityProfile?.profileSkills?.map(
      (skill) => skill?.id!
    );
    if (userCommunitySkills) {
      setCommunitySkillsAdded(userCommunitySkills);
    }
  }, []);

  function updateArray(checkbox: any, id: string) {
    if (checkbox.checked) {
      setCommunitySkillsAdded([...communitySkillsAdded, id]);
    } else {
      const filteredPermissions = communitySkillsAdded?.filter(
        (item) => item !== id
      );
      setCommunitySkillsAdded(filteredPermissions);
    }
  }

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={`ECD skills`}
      color={'primary'}
      onBack={() => onClose && onClose(false)}
      displayOffline={!isOnline}
      onClose={() => onClose && onClose(false)}
    >
      <div className="p-4">
        <Typography
          type={'h2'}
          text={`Select your ECD skills`}
          color={'textDark'}
        />
        <Typography
          type={'body'}
          text={`Help others find and connect with you for support and collaboration.`}
          color={'textMid'}
        />
        {communitySkills.map((item, index) => (
          <CheckboxGroup
            id={item.id}
            key={item.id}
            title={item?.name}
            checked={communitySkillsAdded?.some((option) => option === item.id)}
            value={item.id}
            onChange={(event) => {
              updateArray(event, item?.id!);
            }}
            className="mb-1"
            icon={
              <div className="bg-quatenary ml-2 flex h-8 w-8 items-center justify-center rounded-full p-1">
                {renderIcon(item?.imageName, 'h-4 w-6 text-white')}
              </div>
            }
            isIconFullWidth
            checkboxColor="primary"
            description={item?.description}
          />
        ))}
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
            disabled={isLoading}
            onClick={onSave}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
