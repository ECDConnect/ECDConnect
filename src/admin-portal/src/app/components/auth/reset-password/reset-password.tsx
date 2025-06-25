import {
  Config,
  initialResetPasswordValues,
  PasswordResetModel,
  resetPasswordSchema,
  useTheme,
} from '@ecdlink/core';
import { Button, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import logo from '../../../../assets/Logo-ECDConnect.svg';
import thumbs_up from '../../../../assets/icon_thumbsup.svg';
import { PasswordInput } from '../../password-input/password-input';
import { useAuth } from '../../../hooks/useAuth';

export default function ResetPassword() {
  const { theme } = useTheme();
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('username');
  const username = urlParams.get('username');
  const resetToken = urlParams.get('token');

  const history = useHistory();

  const { register, getValues, formState, control } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: initialResetPasswordValues,
    mode: 'onChange',
  });

  const { password } = useWatch({ control });

  //check password strength
  const formValues = getValues();

  const requestResetPasword = async () => {
    let _email = localStorage.getItem('email') ?? email;

    if (isValid) {
      setIsLoading(true);
      const body: PasswordResetModel = {
        username: _email || username,
        password: formValues.password,
        resetToken: resetToken,
      };

      const isLinkSent = await resetPassword(body, Config.authApi);

      if (isLinkSent) {
        setIsLoading(false);
        history.push('/login');
      } else {
        setIsLoading(false);
      }

      setTimeout(() => {}, 5000);
    }
  };

  const { isValid } = formState;

  const submitResetPassword = async () => {
    if (isValid) {
      requestResetPasword();
      setResetLinkSent(!resetLinkSent);
      setIsLoading(!isLoading);
    }
  };

  const getLogoUrl = () => {
    if (theme && theme.images) {
      return <img className="h-100 w-3/12" src={logo} alt="Login Logo" />;
    } else {
      return <div className="h-32 w-32">&nbsp;</div>;
    }
  };
  if (resetLinkSent) {
    return (
      <div className="darkBackground flex min-h-screen items-center justify-center">
        <div className="m-8 rounded-xl bg-white p-8 shadow lg:w-1/3">
          <div className="flex flex-shrink-0 items-center justify-center">
            {getLogoUrl()}
          </div>
          <div className="flex flex-shrink-0 items-center justify-center">
            <h2 className="font-h1 textLight mt-6 text-2xl">
              Password reset successful!
            </h2>
          </div>

          <div className="flex flex-shrink-0 items-center justify-center pt-8">
            <img className="h-100 w-4/8" src={thumbs_up} alt="Login Logo" />
          </div>
          <p className="mb-3 pt-2 text-center text-lg text-gray-700">
            Please log in again to use ECD Connect.
          </p>

          <div className="mt-8">
            <div className="mt-6">
              <div>
                <Button
                  className={'mt-3 w-full rounded-xl'}
                  type="outlined"
                  color="secondary"
                  onClick={() => history.push('/')}
                  icon="ArrowLeftIcon"
                  textColor="secondary"
                >
                  <Typography
                    type="help"
                    color="secondary"
                    text={'Back to Login'}
                  ></Typography>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="darkBackground flex min-h-screen items-center justify-center">
        <div className="rounded bg-white p-8 shadow sm:w-1/3">
          <div className="flex flex-shrink-0 items-center justify-center">
            {getLogoUrl()}
          </div>
          <div className="flex flex-shrink-0 items-center justify-center">
            <h2 className="font-h1 textLight mt-6 text-2xl">
              Enter new password
            </h2>
          </div>
          <p className="text-md mb-3 pt-2 text-center text-gray-700">
            Fill in your new password.
          </p>

          <div className="mt-8">
            <div className="mt-6">
              <form className="space-y-6">
                <div className="space-y-1">
                  <PasswordInput
                    label={'Password'}
                    nameProp={'password'}
                    sufficIconColor="black"
                    value={password}
                    register={register}
                    strengthMeterVisible={true}
                    className="mb-9 "
                  />
                </div>

                <div>
                  <Button
                    className={'mt-3 w-full rounded'}
                    type="filled"
                    isLoading={isLoading}
                    color="secondary"
                    disabled={!isValid}
                    onClick={submitResetPassword}
                  >
                    <Typography
                      type="help"
                      color="white"
                      text={'Reset password'}
                    ></Typography>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
