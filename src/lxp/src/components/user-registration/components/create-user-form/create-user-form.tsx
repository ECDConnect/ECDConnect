import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import ROUTES from '@/routes/routes';
import {
  initialPasswordValue,
  NOTIFICATION,
  passwordSchema,
  useDialog,
  useNotifications,
  useTheme,
} from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  FormInput,
  PasswordInput,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import {
  createUser,
  CreateUserResult,
  validateUsername,
} from '@/utils/user/user-registration.utils';
import { isEmail } from '@/utils/common/string.utils';

const specialCharactersMessageErrorText = `Usernames can only include letters, numbers, . , and @. Please remove any other special characters.`;
interface CreateUserFormProps {
  closeAction?: (item: boolean) => void;
  userId?: string;
  token?: string;
  shareInfoPartners?: boolean;
  googleEmail?: string;
  googleCredential?: string;
  phoneNumber?: string;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  closeAction,
  userId,
  token,
  shareInfoPartners,
  googleEmail,
  googleCredential,
  phoneNumber,
}) => {
  const { isOnline } = useOnlineStatus();
  const { setNotification } = useNotifications();
  const { theme } = useTheme();
  const history = useHistory();
  const tenant = useTenant();
  const dialog = useDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [messageError, setMessageError] = useState('');

  const isGoogleAccount = !!googleEmail && !!googleCredential;
  const registerType = isGoogleAccount ? 'google' : 'username';

  const {
    register: passwordRegister,
    watch,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'all',
  });
  const { password } = watch();

  useEffect(() => {
    if (isGoogleAccount) {
      setUsername(googleEmail);
    }
  }, [isGoogleAccount, googleEmail]);

  const handleUsernameExists = async () => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      color: 'bg-white',
      render: (onSubmit) => {
        return (
          <ActionModal
            className={'mx-4'}
            title={`This email is already linked to an account`}
            detailText={`You already have an account using ${username}. On the login screen, enter this email as your username, then enter your password.`}
            icon={'ExclamationCircleIcon'}
            iconSize={48}
            iconColor={'alertMain'}
            // iconBorderColor={'white'}
            actionButtons={[
              {
                text: 'Log in',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => {
                  onSubmit();
                  history.push(ROUTES.LOGIN, {
                    username,
                    loginType: registerType,
                  });
                },
                textColour: 'white',
                leadingIcon: 'ArrowCircleRightIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const handleCreateUser = async () => {
    setIsLoading?.(true);
    const result = await createUser({
      userId: userId as any as string,
      username,
      password,
      phoneNumber: phoneNumber || '',
      registerType,
      shareInfoPartners,
      token,
      googleToken: undefined,
      facebookToken: undefined,
      tenant,
    });
    switch (result) {
      case CreateUserResult.PhoneNumberExists:
        break;
      case CreateUserResult.Success:
      case CreateUserResult.SuccessRegistered:
        setNotification({
          title: ` Successfully registered!`,
          variant: NOTIFICATION.SUCCESS,
        });
        break;
      case CreateUserResult.UsernameInvalid:
        setMessageError(specialCharactersMessageErrorText);
        break;
      case CreateUserResult.UsernameExists:
        if (registerType === 'username' && isEmail(username)) {
          await handleUsernameExists();
        } else {
          setMessageError(
            `Username already exists! Try using your email address, phone number, or add a number/letter`
          );
          setNotification({
            title: ` Failed to check the username!`,
            variant: NOTIFICATION.ERROR,
          });
        }
        break;
      case CreateUserResult.FailedCreateUsername:
        setNotification({
          title: `Failed to create the username!`,
          variant: NOTIFICATION.ERROR,
        });
        break;
      case CreateUserResult.RegistrationFailed:
        setNotification({
          title: `Registration failed. Please try again.`,
          variant: NOTIFICATION.ERROR,
        });
        break;
      case CreateUserResult.UsernameExistsLogin:
        history.push(ROUTES.LOGIN, {
          username,
          password,
          loginType: registerType,
        });
        break;
      case CreateUserResult.SuccessLogin:
        history.push(ROUTES.LOGIN, {
          username,
          password,
          loginType: registerType,
        });
        setNotification({
          title: ` Successfully registered!`,
          variant: NOTIFICATION.SUCCESS,
        });
        break;
    }

    setIsLoading?.(false);
  };

  return (
    <BannerWrapper
      size="small"
      onBack={() => closeAction?.(false)}
      color="primary"
      className={'h-screen'}
      menuLogoUrl={theme?.images?.logoUrl}
      displayOffline={!isOnline}
    >
      <div className="p-4">
        <Typography
          type={'h2'}
          text={'Create a username'}
          className={'text-sm font-normal'}
          color={'textDark'}
        />
        <FormInput
          textInputType="input"
          label="Username or email"
          subLabel={
            isGoogleAccount
              ? undefined
              : 'Must be unique. Tip: use something that you will remember.'
          }
          placeholder="e.g. Nothando_123"
          onChange={(e) => {
            const inputValue = e?.target?.value?.replaceAll(/\s+/g, '');
            setUsername(inputValue);
            const error = !validateUsername(inputValue);
            setMessageError(error ? specialCharactersMessageErrorText : '');
          }}
          value={username}
          error={messageError as unknown as FieldError}
          className="my-2"
        />
        {messageError && (
          <Typography
            type={'help'}
            text={messageError}
            className={'mt-1 text-sm font-normal'}
            color={'errorMain'}
          />
        )}
        {!isGoogleAccount && (
          <div className="mt-4">
            <PasswordInput
              label={'Password'}
              nameProp={'password'}
              sufficIconColor={'uiMidDark'}
              value={password}
              strengthMeterVisible={true}
              className="mb-5"
              register={passwordRegister}
            />
          </div>
        )}
        <div>
          <Button
            className={'mt-3 w-full rounded-2xl'}
            type="filled"
            isLoading={isLoading}
            color="quatenary"
            disabled={!password || !username || isLoading || !isValid}
            onClick={handleCreateUser}
          >
            <Typography type="help" color="white" text={'Sign up'}></Typography>
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};
