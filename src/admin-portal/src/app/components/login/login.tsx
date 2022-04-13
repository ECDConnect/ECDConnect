import {
  Config,
  initialLoginValues,
  LoginRequestModel,
  loginSchema,
  useTheme,
} from '@ecdlink/core';
import { Alert, Button, Divider, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import FormField from '../form-field/form-field';

export default function Login() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, getValues, formState } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: initialLoginValues,
    mode: 'onChange',
  });
  const { errors, isValid } = formState;

  const signIn = async () => {
    const formValues = getValues();

    if (isValid) {
      setIsLoading(true);
      const body: LoginRequestModel = {
        username: formValues.username,
        password: formValues.password,
      };
      const isAuthenticated = await login(body, Config.authApi).catch(() => {
        setDisplayError(true);
        setIsLoading(false);
      });

      if (isAuthenticated) {
        setIsLoading(false);
        history.push('/dashboard');
      } else {
        setIsLoading(false);
        setDisplayError(true);
      }

      setTimeout(() => {
        setDisplayError(false);
      }, 5000);
    }
  };

  const getLogoUrl = () => {
    if (theme && theme.images) {
      return (
        <img
          className="h-32 w-auto"
          src={theme.images.portalLoginLogoUrl}
          alt="Login Logo"
        />
      );
    } else {
      return <div className="h-32 w-32">&nbsp;</div>;
    }
  };

  const getBackgroundUrl = () => {
    if (theme && theme.images) {
      return (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={theme.images.portalLoginBackgroundUrl}
          alt="Login Background"
        />
      );
    } else {
      return (
        <div className="absolute inset-0 h-full w-full object-cover">
          &nbsp;
        </div>
      );
    }
  };

  return (
    <div className="min-h-full bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center justify-center flex-shrink-0">
            {getLogoUrl()}
          </div>
          <div className="flex items-center justify-center flex-shrink-0">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 font-h1">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-8">
            <div className="mt-6">
              <form className="space-y-6">
                <div>
                  <FormField
                    label={'Username'}
                    nameProp={'username'}
                    register={register}
                    error={errors.username?.message}
                  />
                </div>

                <div className="space-y-1">
                  <FormField
                    label={'Password'}
                    nameProp={'password'}
                    register={register}
                    type="password"
                    error={errors.password?.message}
                  />
                </div>
                <Divider></Divider>
                {displayError && (
                  <Alert
                    className={'mt-5 mb-3'}
                    message={'Password or Username incorrect. Please try again'}
                    type={'error'}
                  />
                )}
                <div>
                  <Button
                    className={'w-full mt-3'}
                    type="filled"
                    isLoading={isLoading}
                    color="primary"
                    disabled={!isValid}
                    onClick={signIn}
                  >
                    <Typography
                      type="help"
                      color="white"
                      text={'Log in'}
                    ></Typography>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        {getBackgroundUrl()}
      </div>
    </div>
  );
}
