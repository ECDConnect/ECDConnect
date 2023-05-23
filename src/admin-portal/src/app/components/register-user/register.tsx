import {
  Config,
  initialLoginValues,
  LocalStorageKeys,
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
import logo from "../../../assets/Logo-ECDConnect.png"

export default function Register() {
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

  const registerUser = async () => {
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
      localStorage.setItem(
        LocalStorageKeys.existingUser,
        "true"
      );
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
          className="h-100 w-150"
          src={logo}
          alt="Login Logo"
        />
      );
    } else {
      return <div className="h-32 w-32">&nbsp;</div>;
    }
  };

  return (
    <div className="darkBackground flex min-h-screen items-center justify-center">
      <div className="rounded bg-white p-8 shadow sm:w-1/3">
        <div className="flex flex-shrink-0 items-center justify-center">
          {getLogoUrl()}
        </div>
        <div className="flex flex-shrink-0 items-center justify-center">
          <h2 className="font-h1 textLight mt-6 text-3xl font-extrabold">
            Register
          </h2>
        </div>
        <div className="mt-8">
          <div className="mt-6">
            <form className="space-y-6">
              <div>
                <FormField
                  label={'Email address *'}
                  nameProp={'username'}
                  register={register}
                  error={errors.username?.message}
                />
              </div>

              <div className="space-y-1">
                <FormField
                  label={'Password *'}
                  nameProp={'password'}
                  register={register}
                  type="password"
                  error={errors.password?.message}
                />
              </div>
              <div className="mb-2 flex justify-between">
                <a
                  rel="noopener noreferrer"
                  href="/"
                  className="text-l hover:underline text-blue-400"
                >
                  Forgot password?
                </a>
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
                  className={'mt-3 w-full'}
                  type="filled"
                  isLoading={isLoading}
                  color="primary"
                  disabled={!isValid}
                  onClick={registerUser}
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
  );
}
