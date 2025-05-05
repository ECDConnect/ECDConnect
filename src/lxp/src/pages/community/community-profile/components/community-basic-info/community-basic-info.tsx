import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import ROUTES from '@/routes/routes';
import {
  communityActions,
  communitySelectors,
  communityThunkActions,
} from '@/store/community';
import { cloneDeep } from 'lodash';
import { CommunityProfileInputModelInput } from '@ecdlink/graphql';
import AlienImage from '@/assets/ECD_Connect_alien2.svg';
import {
  ActionModal,
  BannerWrapper,
  Button,
  CheckboxGroup,
  DialogPosition,
  Divider,
  Dropdown,
  EmptyPage,
  FormInput,
  SearchDropDownOption,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useAppDispatch } from '@/store';
import { ProvinceDto, useDialog, useSnackbar } from '@ecdlink/core';
import { staticDataSelectors } from '@/store/static-data';
import { BasicInfoItems } from '../../../community.types';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { deleteCommunityProfile } from '@/store/community/community.actions';

interface ContactDetailsProps {
  onClose?: (item: boolean) => void;
}

export const CommunityBasicInfo: React.FC<ContactDetailsProps> = ({
  onClose,
}) => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const dialog = useDialog();
  const history = useHistory();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const { showMessage } = useSnackbar();
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const [shareProfilePhoto, setShareProfilePhoto] = useState(
    communityProfile?.shareProfilePhoto
  );
  const [shareRole, setShareRole] = useState(communityProfile?.shareRole);
  const [shareProvince, setShareProvince] = useState(
    communityProfile?.shareProvince
  );
  const provincesData = useSelector(staticDataSelectors.getProvinces);
  const [aboutShort, setAboutShort] = useState(communityProfile?.aboutShort);
  const skillIds = communityProfile?.profileSkills?.map((item) => item?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState<SearchDropDownOption<string>[]>(
    []
  );
  const [provinceId, setProvinceId] = useState(communityProfile?.provinceId);
  const hasPhoto = communityProfile?.communityUser?.profilePhoto;
  const communityUserRole = communityProfile?.communityUser?.roleName;
  const communityUserProvince = provinces?.find(
    (item) => item?.id === provinceId
  )?.label;

  const sharedInfoItems = [
    {
      id: '1',
      name: BasicInfoItems.ProfilhePhoto,
      imageName: 'CameraIcon',
      checked: shareProfilePhoto,
      description: hasPhoto
        ? 'You have added a photo to your profile'
        : "You don't have a photo yet!",
    },
    {
      id: '2',
      name: BasicInfoItems.Role,
      imageName: 'UserIcon',
      checked: shareRole,
      description: communityUserRole,
    },
    {
      id: '3',
      name: BasicInfoItems.Province,
      imageName: 'MapIcon',
      checked: shareProvince,
      description: communityUserProvince,
    },
  ];

  const onSave = async () => {
    setIsLoading(true);
    const copy = cloneDeep(communityProfile);

    const saveCommunityProfileInput: CommunityProfileInputModelInput = {
      userId: copy?.userId!,
      aboutShort: aboutShort,
      aboutLong: copy?.aboutLong,
      shareContactInfo: copy?.shareContactInfo,
      shareProfilePhoto: shareProfilePhoto,
      shareProvince: shareProvince,
      provinceId: provinceId,
      sharePhoneNumber: copy?.sharePhoneNumber,
      shareEmail: copy?.shareEmail,
      communitySkillIds: skillIds,
      shareRole: shareRole,
    };

    if (copy) {
      copy.aboutShort = aboutShort;
      copy.provinceId = provinceId;
      copy.shareProfilePhoto = shareProfilePhoto;
      copy.shareProvince = shareProvince;
      copy.shareRole = shareRole;

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
    if (provincesData?.length > 0) {
      const provincesSorted = provincesData
        ?.slice()
        ?.sort((a: ProvinceDto, b: ProvinceDto) =>
          a.description < b.description
            ? -1
            : a.description > b.description
            ? 1
            : 0
        );

      setProvinces(
        provincesSorted
          ?.filter((prov: ProvinceDto) => prov?.description !== 'N/A')
          ?.map((item: ProvinceDto) => {
            return {
              value: item?.id as string,
              label: item?.description,
              id: item?.id,
            };
          })
      );
    }
  }, [provincesData]);

  const handleOnChange = (itemName: string) => {
    if (itemName === BasicInfoItems.ProfilhePhoto) {
      setShareProfilePhoto(!shareProfilePhoto);
      return;
    }

    if (itemName === BasicInfoItems.Province) {
      setShareProvince(!shareProvince);
      return;
    }
    if (itemName === BasicInfoItems.Role) {
      setShareRole(!shareRole);
      return;
    }
  };

  const handleDeleProfile = async () => {
    await dispatch(
      communityThunkActions.deleteCommunityProfile({
        communityProfileId: communityProfile?.id!,
      })
    );

    history.push(ROUTES.COMMUNITY.ROOT);
  };

  const handleDeleteProfileModal = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            customIcon={
              <ExclamationCircleIcon className="text-alertMain h-10 w-10 rounded-full" />
            }
            title="Are you sure you want to delete your profile?"
            detailText="You can always rejoin the community but you will need to add all of your details again."
            actionButtons={[
              {
                colour: 'quatenary',
                type: 'filled',
                text: 'Yes, delete my profile',
                textColour: 'white',
                onClick: () => {
                  handleDeleProfile();
                  onClose();
                },
                leadingIcon: 'TrashIcon',
              },
              {
                colour: 'quatenary',
                type: 'outlined',
                text: 'No, cancel',
                textColour: 'quatenary',
                onClick: () => {
                  onClose();
                },
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const renderContactDetails = useMemo(() => {
    return (
      <>
        <div className="my-4">
          <FormInput
            label={`Short description`}
            hint="Optional"
            placeholder="E.g. Love working with kids"
            value={aboutShort}
            onChange={(event) => setAboutShort(event.target.value)}
            maxCharacters={125}
            maxLength={125}
            type="text"
          />
          <Dropdown
            placeholder={'Tap to choose province'}
            className={'mt-4 w-full justify-between'}
            label={'Which province are you in?'}
            selectedValue={provinceId}
            list={provinces}
            onChange={(item) => setProvinceId(item)}
            fullWidth
            labelColor="textMid"
            fillColor="adminPortalBg"
          />
        </div>
      </>
    );
  }, [provinces, aboutShort]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={`Basic info`}
      color={'primary'}
      onBack={() => onClose && onClose(false)}
      displayOffline={!isOnline}
      onClose={() => onClose && onClose(false)}
    >
      <div className="p-4">
        <Typography
          type={'h2'}
          text={'Your community profile'}
          color={'textDark'}
        />
        <Divider dividerType="dashed" className="my-2" />
        <div>{renderContactDetails}</div>
        <Divider dividerType="dashed" className="my-2" />
        <div className="mt-3">
          <Typography
            className="mb-1"
            type="h4"
            text="Which details would you like to share?"
          />
          {sharedInfoItems.map((item, index) => (
            <CheckboxGroup
              id={item.id}
              key={item.id}
              title={item?.name}
              checked={item?.checked}
              value={item.id}
              onChange={(event) => {
                handleOnChange(item?.name);
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
            <Button
              className="w-full rounded-2xl px-2"
              type="outlined"
              color="quatenary"
              textColor="quatenary"
              text="Delete my profile"
              icon="TrashIcon"
              iconPosition="start"
              onClick={handleDeleteProfileModal}
            />
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};
