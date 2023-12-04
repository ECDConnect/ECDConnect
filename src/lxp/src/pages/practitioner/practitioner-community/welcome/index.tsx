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
import { ReactComponent as Robot } from '@/assets/iconRobot.svg';
import { useHistory, useLocation } from 'react-router';
import ROUTES from '@/routes/routes';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import { clubThunkActions } from '@/store/club';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';
import { getClubForPractitionerSelector } from '@/store/club/club.selectors';
import { useForm } from 'react-hook-form';
import {
  WelcomeMessageModel,
  welcomeMessageSchema,
} from '@/schemas/community/welcome/welcome-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { practitionerSelectors } from '@/store/practitioner';
import { userSelectors } from '@/store/user';
import { AddPhotoDialog } from '@/pages/community/welcome/add-photo-dialog';
import { PractitionerAboutRouteState } from '../../practitioner-about/practitioner-about.types';
import { PractitionerCommunityRouteState } from '../index.types';

export const PractitionerCommunityWelcome: React.FC = () => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { theme } = useTheme();

  const history = useHistory();
  const location = useLocation<PractitionerCommunityRouteState>();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(getClubForPractitionerSelector);

  const isLeader = club?.clubLeader?.userId === user?.id;
  const isSupportRole = club?.clubSupport?.userId === user?.id;

  const isRequired = !isLeader && !isSupportRole;

  const isToShowAddPhotoScreen = !user?.profileImageUrl;

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.SAVE_WELCOME_MESSAGE
  );

  const { getValues, setValue, register, trigger, formState, watch } =
    useForm<WelcomeMessageModel>({
      resolver: yupResolver(welcomeMessageSchema),
      mode: 'onChange',
    });

  const { message } = watch();
  const { errors, isValid } = formState;

  const onSave = async () => {
    if ((!isRequired || (isRequired && isValid)) && !!club && !!practitioner) {
      const values = getValues();
      await appDispatch(
        clubThunkActions.saveWelcomeMessage({
          clubId: club.id,
          practitionerId: practitioner.id,
          welcomeMessage: values.message,
          shareContactInfo:
            values.shareContactInfo || isLeader || isSupportRole,
        })
      );

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
                history.push(ROUTES.PRACTITIONER.ABOUT.ROOT, {
                  isFromCommunityWelcome: true,
                } as PractitionerAboutRouteState);
                onClose();
              }}
            />
          ),
        });
      } else {
        history.push(ROUTES.PRACTITIONER.COMMUNITY.ROOT, {
          ...location.state,
        } as PractitionerCommunityRouteState);
      }
    }
  };

  return (
    <BannerWrapper
      showBackground
      className="z-10"
      size="small"
      title={`Welcome to the ${club?.name} club!`}
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
          text={`Welcome to the ${club?.name} club!`}
          className="py-30 w-full break-words"
        />
        <Card className="bg-uiBg flex flex-col items-center rounded-3xl p-4 text-center">
          <Robot className="mb-2" />
          <Typography
            type="h3"
            color="textDark"
            text="Tell your club members something interesting about you!"
          />
        </Card>
        <FormInput<WelcomeMessageModel>
          visible={true}
          nameProp={'message'}
          register={register}
          type={'text'}
          label="In 4 or 5 words, share something about yourself with your club members!"
          hint="Optional - you can change this at any time."
          placeholder="E.g. Love working with kids"
          className="mt-10"
          value={message}
          maxCharacters={!!message?.length ? 125 : undefined}
          error={errors.message}
        />
        {isRequired && (
          <>
            <label className="font-body text-textMid mt-5 block text-base font-medium">
              {`Would you like to share your phone and WhatsApp number with your club?`}
            </label>
            <div className={'mt-2'}>
              <ButtonGroup
                options={[
                  { text: 'Yes', value: true },
                  { text: 'No', value: false },
                ]}
                onOptionSelected={(value: boolean | boolean[]) => {
                  setValue('shareContactInfo', value as boolean);
                  trigger();
                }}
                selectedOptions={getValues().shareContactInfo}
                color="secondary"
                type={ButtonGroupTypes.Button}
                className={'w-full'}
                multiple={false}
              />
            </div>
          </>
        )}
        <Button
          type="filled"
          color="primary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          className="mt-auto mb-14"
          isLoading={isLoading}
          disabled={isLoading || (isRequired && !isValid)}
          onClick={onSave}
        />
      </div>
    </BannerWrapper>
  );
};
