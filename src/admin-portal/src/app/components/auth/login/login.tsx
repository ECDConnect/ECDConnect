import {
  Config,
  initialLoginValues,
  LoginRequestModel,
  loginSchema,
} from '@ecdlink/core';
import { Alert, Button, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import FormField from '../../form-field/form-field';
import logo from '../../../../assets/Logo-ECDConnect.svg';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { PasswordInput } from '../../password-input/password-input';

export default function Login() {
  const { login } = useAuth();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, getValues, formState, watch, setValue } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: initialLoginValues,
    mode: 'onChange',
  });

  const formValues = getValues();
  let password = watch('password');
  const { errors, isValid } = formState;

  useEffect(() => {
    setValue('password', password);
  }, [password]);

  const signIn = async () => {
    if (isValid) {
      setIsLoading(true);
      const body: LoginRequestModel = {
        username: formValues.email,
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
    return <img className="h-100 w-4/12" src={logo} alt="Login Logo" />;
  };
  return (
    <div className="darkBackground flex min-h-screen items-center justify-center">
      <div className="m-8 rounded-xl bg-white p-8 shadow md:w-1/3">
        <div className="flex flex-shrink-0 items-center justify-center">
          {getLogoUrl()}
        </div>
        <div className="flex flex-shrink-0 items-center justify-center">
          <h2 className="font-h1 textLight text-bold mt-6 text-2xl">Log In</h2>
        </div>
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

              <div className="space-y-1">
                <PasswordInput
                  label={'Password'}
                  nameProp={'password'}
                  value={formValues.password}
                  register={register}
                  // strengthMeterVisible={true}
                  className="mb-9 "
                />
              </div>

              <Button
                className={
                  ' focus:outline-none my-6 inline-flex w-5/12 items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white '
                }
                type="ghost"
                color="secondary"
                onClick={() => history.push('/forgot-password')}
              >
                <Typography
                  type="help"
                  color="secondary"
                  text={' Forgot password?'}
                  className="text-start"
                ></Typography>
                <ArrowRightIcon className="text-secondary ml-2 h-5 w-5" />
              </Button>

              {displayError && (
                <Alert
                  className={'mt-5 mb-3'}
                  message={'Password or Username incorrect. Please try again'}
                  type={'error'}
                />
              )}
              <div>
                <Button
                  className={'mt-3 w-full rounded'}
                  type="filled"
                  isLoading={isLoading}
                  color="secondary"
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
  );
}
