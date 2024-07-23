import { LoginRequestModel, PasswordResetModel } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  BannerWrapper,
  Button,
  Divider,
  PasswordInput,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import * as styles from './new-password.styles';
import {
  initialNewPasswordValues,
  NewPasswordModel,
  newPasswordSchema,
} from '@schemas/auth/password/new-password';
import { authThunkActions } from '@store/auth';
import { useAppDispatch } from '@store';
import AuthService from '@services/AuthService/AuthService';
import { useStoreSetup } from '@hooks/useStoreSetup';
import ROUTES from '@/routes/routes';

export const NewPassword: React.FC = () => {
  const appDispatch = useAppDispatch();
  const { resetAppStore, resetAuth } = useStoreSetup();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] =
    useState<boolean>(true);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const history = useHistory();
  const queryParams = useLocation().search;
  const {
    register: newPasswordRegister,
    formState: newPasswordFormState,
    getValues: newPasswordFormGetValues,
    watch,
  } = useForm({
    resolver: yupResolver(newPasswordSchema),
    defaultValues: initialNewPasswordValues,
    mode: 'onChange',
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password } = watch();
  const { isValid } = newPasswordFormState;
  useEffect(() => {
    if (!hasSubmitted) {
      setSubmitButtonDisabled(!isValid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  useEffect(() => {
    if (resetAppStore) {
      resetAppStore(false);
      resetAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitForm = async () => {
    setHasSubmitted(true);
    if (isValid) {
      setIsLoading(true);
      const params = new URLSearchParams(queryParams);
      const newPasswordToken = params.get('token') ?? '';
      const username = params.get('username') ?? '';
      const body: PasswordResetModel = {
        username: username,
        password: newPasswordFormGetValues().password,
        resetToken: newPasswordToken,
      };

      const response = await new AuthService().SendNewPasswordRequest(body);

      if (response.valid) {
        setSubmitButtonDisabled(true);

        // const body: LoginRequestModel = {
        //   username: username,
        //   password: password,
        // };

        // const isAuthenticated: any = await appDispatch(
        //   authThunkActions.login(body)
        // ).unwrap();

        history.push(ROUTES.LOGIN);
      } else {
        setDisplayError(true);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <BannerWrapper
        showBackground={false}
        size="normal"
        renderBorder={true}
        color="primary"
      >
        <div className={styles.wrapper}>
          <PasswordInput<NewPasswordModel>
            label={'Enter new password'}
            nameProp={'password'}
            sufficIconColor={'primary'}
            value={password}
            register={newPasswordRegister}
            strengthMeterVisible={true}
          />
          <div className={'mt-6'}>
            <Divider dividerType="solid"></Divider>
          </div>

          {displayError && (
            <Alert
              className={'mt-8'}
              title={
                'Password reset was unsuccessful. Please contact an administrator.'
              }
              type={'error'}
            />
          )}
          {displaySuccess && (
            <Alert
              className={'mt-8'}
              title={'Password reset successfully'}
              type={'success'}
            />
          )}
          <Button
            className={styles.formButton}
            type="filled"
            color="quatenary"
            disabled={submitButtonDisabled}
            isLoading={isLoading}
            onClick={submitForm}
          >
            <Typography
              type="help"
              color="white"
              text={'Reset password'}
            ></Typography>
          </Button>
        </div>
      </BannerWrapper>
    </div>
  );
};
