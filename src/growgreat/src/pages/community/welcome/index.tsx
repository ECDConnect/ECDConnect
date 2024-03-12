import { useDialog, useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Card,
  DialogPosition,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import ROUTES from '@/routes/routes';
import { AddPhotoDialog } from './add-photo-dialog';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { useState } from 'react';
import { CommunityRouteState } from '../community.types';
import { useAppDispatch } from '@/store';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { PractitionerAboutRouteState } from '@/pages/practitioner/practitioner-about/practitioner-about.types';
import {
  healthCareWorkerSelectors,
  healthCareWorkerThunkActions,
} from '@/store/healthCareWorker';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { HealthCareWorkerActions } from '@/store/healthCareWorker/healthCareWorker.actions';
import { communitySelectors } from '@/store/community';

export const CommunityWelcome: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [shareContactInfo, setShareContactInfo] = useState<
    boolean | boolean[]
  >();

  const user = useSelector(userSelectors.getUser);
  const hcw = useSelector(healthCareWorkerSelectors.getHealthCareWorker);
  const clinicDetails = useSelector(communitySelectors.getClinicSelector);

  const isToShowAddPhotoScreen = !user?.profileImageUrl;
  const isOnCharacterLimit = message?.length <= 125;
  const { theme } = useTheme();

  const history = useHistory();
  const location = useLocation<CommunityRouteState>();
  const appDispatch = useAppDispatch();

  const { isLoading: isLoadingWelcomeMessage } = useThunkFetchCall(
    'healthCareWorker',
    HealthCareWorkerActions.UPDATE_HEALTH_CARE_WORKER_WELCOME_MESSAGE
  );
  const { isLoading: isLoadingUpdateHealthCareWorkerById } = useThunkFetchCall(
    'healthCareWorker',
    HealthCareWorkerActions.UPDATE_HEALTH_CARE_WORKER_BY_ID
  );

  const isLoading =
    isLoadingWelcomeMessage || isLoadingUpdateHealthCareWorkerById;

  const dialog = useDialog();

  const onSave = async () => {
    if (isOnCharacterLimit) {
      await appDispatch(
        healthCareWorkerThunkActions.updateHealthCareWorkerWelcomeMessage({
          healthCareWorkerId: hcw?.id ?? '',
          welcomeMessage: message,
          shareContactInfo: shareContactInfo as boolean,
        })
      );
    }

    if (isToShowAddPhotoScreen) {
      return dialog({
        position: DialogPosition.Middle,
        color: 'bg-white',
        render: (onClose) => (
          <AddPhotoDialog
            onClose={() => {
              history.push(ROUTES.COMMUNITY.ROOT);
              onClose();
            }}
            onSubmit={() => {
              history.push(ROUTES.PRACTITIONER.ABOUT, {
                isFromCommunityWelcome: true,
              } as PractitionerAboutRouteState);
              onClose();
            }}
          />
        ),
      });
    } else {
      history.push(ROUTES.COMMUNITY.ROOT, {
        ...location.state,
      } as CommunityRouteState);
    }
  };

  return (
    <BannerWrapper
      showBackground
      className="z-10"
      size="small"
      title="Welcome to the team!"
      onBack={() => history.push(ROUTES.DASHBOARD)}
      onClose={() => history.push(ROUTES.DASHBOARD)}
    >
      <div className="h-48 overflow-hidden">
        <img
          className="w-full"
          alt="background"
          src={theme?.images.graphicOverlayUrl}
        />
      </div>
      <div
        className="absolute  z-20 flex h-full flex-col overflow-auto p-4"
        style={{ marginTop: -200 }}
      >
        <Typography
          type="h1"
          color="white"
          text={`Connect with the ${clinicDetails?.name ?? ''} team!`}
          className="py-30 w-full break-words"
        />
        <Card className="bg-uiBg flex flex-col items-center rounded-3xl p-4 text-center">
          <PollyNeutral className="mb-2 h-24 w-24" />
          <Typography
            type="h3"
            color="textDark"
            text="Tell your team members something interesting about you!"
          />
        </Card>
        <FormInput
          label="In 4 or 5 words, share something about yourself with your team members!"
          hint="Optional - you can change this at any time."
          placeholder="E.g. I am a champion for children"
          className="mt-10"
          value={message}
          maxCharacters={!!message?.length ? 125 : undefined}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Typography
          className="mt-4"
          text="Would you like to share your phone & WhatsApp number with your team?"
          type="h4"
          color="textDark"
        />
        <ButtonGroup
          options={[
            { text: 'Yes', value: true },
            { text: 'No', value: false },
          ]}
          onOptionSelected={setShareContactInfo}
          selectedOptions={shareContactInfo}
          color="secondary"
          type={ButtonGroupTypes.Button}
          className="mb-4 w-full"
          multiple={false}
        />
        <Button
          type="filled"
          color="primary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          className="mt-auto mb-14"
          isLoading={isLoading}
          disabled={
            isLoading || !isOnCharacterLimit || shareContactInfo === undefined
          }
          onClick={onSave}
        />
      </div>
    </BannerWrapper>
  );
};
