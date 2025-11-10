import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import ROUTES from '@/routes/routes';
import {
  initialPasswordValue,
  NOTIFICATION,
  passwordSchema,
  useNotifications,
  useTheme,
} from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  FormInput,
  PasswordInput,
  SA_CELL_REGEX,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { VerifyPhoneNumberAuthCode } from '../verify-phone-number';
import {
  createUser,
  CreateUserResult,
  updateOpenAccessPractitioner,
  validateUsername,
} from '@/utils/user/user-registration.utils';

const specialCharactersMessageErrorText = `Usernames can only include letters, numbers, . , and @. Please remove any other special characters.`;
interface CreateUserFormProps {
  closeAction?: (item: boolean) => void;
  userId?: string;
  token?: string;
  shareInfoPartners?: boolean;
  googleEmail?: string;
  googleCredential?: string;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  closeAction,
  userId,
  token,
  shareInfoPartners,
  googleEmail,
  googleCredential,
}) => {
  const { isOnline } = useOnlineStatus();
  const { setNotification } = useNotifications();
  const { theme } = useTheme();
  const history = useHistory();
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [messageError, setMessageError] = useState('');
  const [phoneMessageError, setPhoneMessageError] = useState('');
  const [openVerifyPhoneNumber, setOpenVerifyPhoneNumber] = useState(false);
  const [isFromAuthCodeScreen, setIsFromAuthCodeScreen] = useState(false);

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

  const handleCreateUser = async () => {
    setIsLoading?.(true);
    const result =
      isFromAuthCodeScreen && isOpenAccess
        ? await updateOpenAccessPractitioner({
            username,
            password,
            phoneNumber,
            registerType,
            shareInfoPartners,
            googleToken: googleCredential,
          })
        : await createUser({
            userId: userId as any as string,
            username,
            password,
            phoneNumber,
            registerType,
            shareInfoPartners,
            token,
            googleToken: googleCredential,
            tenant,
          });
    switch (result) {
      case CreateUserResult.PhoneNumberExists:
        setPhoneMessageError('Phone number already in use!');
        break;
      case CreateUserResult.SuccessRegisteredVerifyPhoneNumber:
        setOpenVerifyPhoneNumber(true);
        setNotification({
          title: ` Successfully registered!`,
          variant: NOTIFICATION.SUCCESS,
        });
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
        setMessageError(
          `Username already exists! Try using your email address, phone number, or add a number/letter`
        );
        setNotification({
          title: ` Failed to check the username!`,
          variant: NOTIFICATION.ERROR,
        });
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
      case CreateUserResult.SuccessLogin:
        history.push(ROUTES.LOGIN);
        setNotification({
          title: ` Successfully registered!`,
          variant: NOTIFICATION.SUCCESS,
        });
        break;
    }

    setIsLoading?.(false);
  };

  const handleCellphoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value.replaceAll(/[^0-9+]/g, '');
    setPhoneNumber(inputValue);

    // Regular expression for South African cellphone number validation
    const cellphonePattern = SA_CELL_REGEX;
    const isValid = cellphonePattern.test(inputValue);
    setIsValidPhoneNumber(isValid);
  };

  // Function for cellphone number preventing characters
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    // Allow numbers, plus sign, and control keys
    if (
      !/[0-9+]/.test(event.key) &&
      !allowedKeys.includes(event.key) &&
      !(event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
    }
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
        {isOpenAccess && (
          <div className="mt-4 space-y-1">
            <FormInput
              label={'Cellphone number'}
              nameProp={'phoneNumber'}
              placeholder="e.g 0123456789"
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                handleCellphoneChange(e);
                setPhoneMessageError('');
              }}
              error={
                (phoneMessageError as unknown as FieldError) ||
                (!isValidPhoneNumber && phoneNumber)
              }
              type="number"
            />
            {phoneMessageError && (
              <Typography
                type={'help'}
                text={phoneMessageError}
                className={'mt-1 text-sm font-normal'}
                color={'errorMain'}
              />
            )}
            {!isValidPhoneNumber && phoneNumber && (
              <Typography
                type="help"
                text="Please enter a valid cellphone number"
                color="errorMain"
              />
            )}
          </div>
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
            disabled={
              !password ||
              !username ||
              isLoading ||
              !isValid ||
              (isOpenAccess && !isValidPhoneNumber) ||
              (isOpenAccess && !phoneNumber)
            }
            onClick={handleCreateUser}
          >
            <Typography type="help" color="white" text={'Sign up'}></Typography>
          </Button>
        </div>
      </div>
      <Dialog
        visible={openVerifyPhoneNumber}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <VerifyPhoneNumberAuthCode
          closeAction={setOpenVerifyPhoneNumber}
          phoneNumber={phoneNumber}
          username={username}
          setIsFromAuthCodeScreen={setIsFromAuthCodeScreen}
          password={password}
        />
      </Dialog>
    </BannerWrapper>
  );
};
