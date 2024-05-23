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
} from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  FormInput,
  PasswordInput,
  SA_CELL_REGEX,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';

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
  const history = useHistory();
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;
  const orgName = tenant?.tenant?.organisationName;
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [messageError, setMessageError] = useState('');
  const usernameMessageErrorText = `Username already exists! Try using your email address, phone number, or add a number/letter`;

  const {
    register: passwordRegister,
    getValues: passwordGetValues,
    watch,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: initialPasswordValue,
    mode: 'onChange',
  });
  const { password } = watch();

  const handleCreateUser = async () => {
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
        // token: '',
        registerType: 'username',
      };
      if (checkUsername) {
        const userCreated = await new AuthService()?.RegisterOpenAccessUser(
          Config?.authApi,
          registerOpenAccessUserInput
        );
        if (userCreated) {
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
      const userCreated = await new AuthService()?.UpdateUsername(
        Config?.authApi,
        updateUserInputModel
      );

      if (userCreated) {
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
      title={orgName}
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
          <div className="mt-2 space-y-1">
            <FormInput
              label={'Cellphone number *'}
              nameProp={'phoneNumber'}
              placeholder="e.g 0123456789"
              onChange={(e) => {
                handleCellphoneChange(e);
              }}
              type="number"
            />
            {!isValidPhoneNumber && phoneNumber && (
              <Typography
                type="help"
                text="Please enter a valid South African cellphone number."
                color="errorMain"
              />
            )}
          </div>
        )}
        <div className="mt-8">
          <PasswordInput
            label={'Password'}
            nameProp={'password'}
            sufficIconColor={'uiMidDark'}
            value={password}
            strengthMeterVisible={true}
            className="mb-9"
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
    </BannerWrapper>
  );
};
