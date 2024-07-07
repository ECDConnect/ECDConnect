import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import ROUTES from '@/routes/routes';
import { AuthService } from '@/services/AuthService';
import {
  CheckUsernamePhoneNumberModel,
  Config,
  NOTIFICATION,
  RegisterRequestModel,
  UpdateUsernameModel,
  initialPasswordValue,
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
import { useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { VerifyPhoneNumberAuthCode } from '../verify-phone-number';
import { error } from 'console';

interface CreateUserFormProps {
  closeAction?: (item: boolean) => void;
  userId?: string;
  token?: string;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  closeAction,
  userId,
  token,
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
  const usernameMessageErrorText = `Username already exists! Try using your email address, phone number, or add a number/letter`;
  const specialCharactersMessageErrorText = `Usernames can only include letters, numbers, . , and @. Please remove any other special characters.`;
  const [isFromAuthCodeScreen, setIsFromAuthCodeScreen] = useState(false);

  const {
    register: passwordRegister,
    getValues: passwordGetValues,
    watch,
    formState,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onChange',
  });
  const { password } = watch();
  const { errors } = formState;

  const handleCreateUser = async () => {
    const registerOpenAccessUserInput: RegisterRequestModel = {
      username,
      password,
      phoneNumber,
      registerType: 'username',
    };
    if (isFromAuthCodeScreen && isOpenAccess) {
      setIsLoading(true);
      const userUpdated = await new AuthService()
        ?.UpdateOaPractitioner(Config?.authApi, registerOpenAccessUserInput)
        .catch((error) => {
          setPhoneMessageError('Phone number already in use!');
          setIsLoading(false);
          return;
        });
      if (userUpdated) {
        setIsLoading(false);
        setOpenVerifyPhoneNumber(true);
        setNotification({
          title: ` Successfully registered!`,
          variant: NOTIFICATION.SUCCESS,
        });
      } else {
        setNotification({
          title: ` Successfully registered!`,
          variant: NOTIFICATION.SUCCESS,
        });
        setIsLoading(false);
      }

      setIsLoading(false);
      return;
    }

    const body: CheckUsernamePhoneNumberModel = {
      username,
    };
    setIsLoading(true);
    const checkUsername = await new AuthService()
      .CheckUsernamePhoneNumber(Config.authApi, body)
      .catch((error) => {
        setMessageError(usernameMessageErrorText);
        setNotification({
          title: ` Failed to check the username!`,
          variant: NOTIFICATION.ERROR,
        });
        setIsLoading(false);
        return;
      });

    if (isOpenAccess) {
      const registerOpenAccessUserInput: RegisterRequestModel = {
        username,
        password,
        phoneNumber,
        registerType: 'username',
      };

      if (checkUsername) {
        const userCreated = await new AuthService()
          ?.RegisterOpenAccessUser(Config?.authApi, registerOpenAccessUserInput)
          .catch((error) => {
            setMessageError(specialCharactersMessageErrorText);
            setNotification({
              title: ` Failed to create the username!`,
              variant: NOTIFICATION.ERROR,
            });
            setIsLoading(false);
            return;
          });

        if (userCreated) {
          setIsLoading(false);
          setOpenVerifyPhoneNumber(true);
          setNotification({
            title: ` Successfully registered!`,
            variant: NOTIFICATION.SUCCESS,
          });
        } else {
          setNotification({
            title: ` Successfully registered!`,
            variant: NOTIFICATION.SUCCESS,
          });
          setIsLoading(false);
        }
      }
      setIsLoading(false);
      return;
    }

    const updateUserInputModel: UpdateUsernameModel = {
      userId: userId!,
      username,
      password,
      token,
      shareInfo: true,
    };

    if (checkUsername) {
      const updateUsername = await new AuthService()?.UpdateUsername(
        Config?.authApi,
        updateUserInputModel
      );

      if (updateUsername) {
        setIsLoading(false);
        history.push(ROUTES.LOGIN);
        setNotification({
          title: ` Successfully registered!`,
          variant: NOTIFICATION.SUCCESS,
        });
      } else {
        setNotification({
          title: ` Successfully registered!`,
          variant: NOTIFICATION.SUCCESS,
        });
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  const handleCellphoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value;
    setPhoneNumber(inputValue);

    // Regular expression for South African cellphone number validation
    const cellphonePattern = SA_CELL_REGEX;
    const isValid = cellphonePattern.test(inputValue);
    setIsValidPhoneNumber(isValid);
  };

  return (
    <BannerWrapper
      size="small"
      onBack={() => closeAction && closeAction(false)}
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
          subLabel="Must be unique. Tip: use something that you will remember."
          placeholder="e.g. Nothando_123"
          onChange={(e) => {
            setUsername(e?.target?.value);
            setMessageError('');
          }}
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
        <div>
          <Button
            className={'mt-3 w-full rounded-2xl'}
            type="filled"
            isLoading={isLoading}
            color="quatenary"
            disabled={!password || !username || isLoading}
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
