import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import ROUTES from '@/routes/routes';
import { communitySelectors, communityThunkActions } from '@/store/community';
import { cloneDeep } from 'lodash';
import { CommunityProfileInputModelInput } from '@ecdlink/graphql';
import AlienImage from '@/assets/ECD_Connect_alien2.svg';
import {
  BannerWrapper,
  Button,
  CheckboxGroup,
  Divider,
  EmptyPage,
  Typography,
} from '@ecdlink/ui';
import { MailIcon } from '@heroicons/react/solid';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useAppDispatch } from '@/store';
import { useSnackbar } from '@ecdlink/core';

interface ContactDetailsProps {
  onClose?: (item: boolean) => void;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({ onClose }) => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const { showMessage } = useSnackbar();
  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const communityUserEmail = communityProfile?.communityUser?.email;
  const communityUserPhoneNumber = communityProfile?.communityUser?.phoneNumber;
  const [shareEmail, setShareEmail] = useState(communityProfile?.shareEmail);
  const [sharePhoneNumber, setSharePhoneNumber] = useState(
    communityProfile?.sharePhoneNumber
  );
  const [isLoading, setIsLoading] = useState(false);
  const skillIds = communityProfile?.profileSkills?.map((item) => item?.id);

  const onSave = async () => {
    setIsLoading(true);
    const copy = cloneDeep(communityProfile);

    const saveCommunityProfileInput: CommunityProfileInputModelInput = {
      userId: copy?.userId!,
      aboutShort: copy?.aboutShort,
      aboutLong: copy?.aboutLong,
      shareContactInfo: copy?.shareContactInfo,
      shareProfilePhoto: copy?.shareProfilePhoto,
      shareProvince: copy?.shareProvince,
      provinceId: copy?.provinceId,
      sharePhoneNumber: sharePhoneNumber,
      shareEmail: shareEmail,
      communitySkillIds: skillIds,
      shareRole: copy?.shareRole,
    };

    if (copy) {
      copy.shareEmail = shareEmail;
      copy.sharePhoneNumber = sharePhoneNumber;
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

  const renderContactDetails = useMemo(() => {
    if (!communityUserEmail && !communityUserPhoneNumber) {
      return (
        <EmptyPage
          image={AlienImage}
          title={`Oops! You don’t have any contact details on ${appName} yet. `}
          subTitle="Tap “Change contact details” below to get started."
        />
      );
    } else {
      return (
        <>
          <div className="mt-3">
            <Typography
              type={'h4'}
              text={"Choose which contact details you'd like to share"}
              color={'textDark'}
            />
            <Typography
              type={'body'}
              text={
                'Your contact details are shared only with your ECD Hero connections you have chosen to connect with.'
              }
              color={'textMid'}
            />
          </div>
          <div className="my-4">
            {/* {renderContactDetails} */}
            {communityUserEmail && (
              <CheckboxGroup
                title={'Email address'}
                key={`${communityUserEmail}+${communityProfile?.communityUser?.id}`}
                description={communityUserEmail}
                value={shareEmail}
                checked={shareEmail}
                onChange={() => setShareEmail(!shareEmail)}
                icon={
                  <div className="bg-quatenary ml-2 flex h-8 w-8 items-center justify-center rounded-full p-1">
                    <MailIcon className="h-4 w-6 text-white" />
                  </div>
                }
                isIconFullWidth={true}
              />
            )}
            {communityUserPhoneNumber && (
              <CheckboxGroup
                title={'Cellphone number'}
                key={`${communityUserPhoneNumber}+${communityProfile?.communityUser?.id}`}
                description={communityUserPhoneNumber}
                value={sharePhoneNumber}
                checked={sharePhoneNumber}
                onChange={() => setSharePhoneNumber(!sharePhoneNumber)}
                icon={
                  <div className="bg-quatenary ml-2 flex h-8 w-8 items-center justify-center rounded-full p-1">
                    <MailIcon className="h-4 w-6 text-white" />
                  </div>
                }
                isIconFullWidth={true}
              />
            )}
          </div>
        </>
      );
    }
  }, [shareEmail, sharePhoneNumber]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={`Contact details`}
      color={'primary'}
      onBack={() => onClose && onClose(false)}
      displayOffline={!isOnline}
      onClose={() => onClose && onClose(false)}
    >
      <div className="p-4">
        <Typography type={'h2'} text={'Contact details'} color={'textDark'} />
        <Divider dividerType="dashed" className="my-2" />
        <div>{renderContactDetails}</div>
        <Divider dividerType="dashed" className="my-2" />
        <div className="mt-3">
          <Typography
            type={'h4'}
            text={`Want to edit your contact details on ${appName}?`}
            color={'textDark'}
          />
          <Typography
            type={'body'}
            text={
              'Tap the button below to go to your profile & edit your email address and cellphone number.'
            }
            color={'textMid'}
          />
          <div className="my-6">
            <Button
              type="outlined"
              color="secondary"
              icon="PencilIcon"
              text="Change contact details"
              textColor="secondary"
              onClick={() => history.push(ROUTES.PRACTITIONER.ABOUT.ROOT)}
            />
          </div>
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
      </div>
    </BannerWrapper>
  );
};
