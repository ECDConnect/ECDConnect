import {
  Config,
  initialForgotPasswordValues,
  resetSchema,
  useTheme,
} from '@ecdlink/core';
import { Alert, Button, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import FormField from '../../form-field/form-field';
import logo from '../../../../assets/Logo-ECDConnect.svg';
import thumbs_up from '../../../../assets/icon_thumbsup.svg';

export default function ForgotPassword() {
  const { theme } = useTheme();
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const [displayError, setDisplayError] = useState(false);
  const history = useHistory();

  const { register, formState, watch } = useForm({
    resolver: yupResolver(resetSchema),
    defaultValues: initialForgotPasswordValues,
    mode: 'onChange',
  });

  const email = watch('email');

  const { errors, isValid } = formState;

  const requestResetPassword = async () => {
    if (isValid) {
      setIsLoading(true);
      const body = {
        email: email,
      };
      const isLinkSent = await forgotPassword(body, Config.authApi);

      if (isLinkSent) {
        setIsLoading(false);
        localStorage.setItem('email', email);
      } else {
        setIsLoading(false);
        setDisplayError(true);
      }

      setTimeout(() => {
        setDisplayError(false);
      }, 5000);
    }
  };

  const resetPassword = async () => {
    if (isValid) {
      setResetLinkSent(!resetLinkSent);
      setIsLoading(!isLoading);
      requestResetPassword();
    } else if (isValid && resetLinkSent) {
      setIsLoading(!isLoading);
      requestResetPassword();
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
            <h2 className="font-h1 textLight mt-6 text-2xl">Forgot password</h2>
          </div>

          <div className="flex flex-shrink-0 items-center justify-center pt-8">
            <img className="h-100 w-4/8" src={thumbs_up} alt="Login Logo" />
          </div>
          <h4 className="font-h1 mt-4 text-center text-lg">Email sent! </h4>

          <p className="mb-3 pt-2 text-center text-lg text-gray-700">
            If there's an account registered with your email, you'll receive a
            password reset link. Please check your inbox and follow the
            instructions in the email.
          </p>

          <div className="mt-8">
            <div className="mt-6">
              <div>
                <Button
                  className={'mt-3 w-full rounded-xl'}
                  type="filled"
                  color="secondary"
                  onClick={resetPassword}
                >
                  <Typography
                    type="help"
                    color="white"
                    text={'Resend link'}
                  ></Typography>
                </Button>
              </div>
              <div>
                <Button
                  className={'mt-3 w-full rounded-xl'}
                  type="outlined"
                  color="secondary"
                  onClick={() => history.goBack()}
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
              {displayError && (
                <Alert
                  className={'mt-5 mb-3'}
                  message={'Reset password link notsent!. Please try again'}
                  type={'error'}
                />
              )}
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
            <h2 className="font-h1 textLight mt-6 text-2xl">Forgot password</h2>
          </div>
          <p className="text-md mb-3 pt-2 text-center text-gray-700">
            Fill in your email address and we will send you a link to reset your
            password.
          </p>

          <div className="mt-8">
            <div className="mt-6">
              <form className="space-y-6">
                <div>
                  <FormField
                    label={'Email address *'}
                    nameProp={'email'}
                    register={register}
                    error={errors.email?.message}
                  />
                </div>

                <div>
                  <Button
                    className={'mt-3 w-full rounded'}
                    type="filled"
                    isLoading={isLoading}
                    color="secondary"
                    disabled={!isValid}
                    onClick={resetPassword}
                  >
                    <Typography
                      type="help"
                      color="white"
                      text={'Send link'}
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
