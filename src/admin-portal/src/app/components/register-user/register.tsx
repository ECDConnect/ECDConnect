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
import logo from '../../../assets/Logo-ECDConnect.png';
import zxcvbn from 'zxcvbn-typescript';

export default function Register() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, getValues, formState, watch } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: initialLoginValues,
    mode: 'onChange',
  });

  //check password strength
  const password = watch('password');
  const passwordStrength = zxcvbn(password);
  const passwordScore = passwordStrength.score; // Assuming you have a variable to store the password strength score

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
      localStorage.setItem(LocalStorageKeys.existingUser, 'true');
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
      return <img className="h-100 w-150" src={logo} alt="Login Logo" />;
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
              <div className="-mx-1 flex">
                {[...Array(4)].map((_, i) => (
                  <div className="w-1/4 px-1" key={i}>
                    <div
                      className={`h-2 rounded-xl transition-colors ${
                        i < passwordScore
                          ? passwordScore <= 2
                            ? 'bg-red-400'
                            : passwordScore <= 3
                            ? 'bg-yellow-400'
                            : passwordScore <= 4
                            ? 'bg-green-500'
                            : 'bg-yellow-400'
                          : 'bg-gray-200'
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="mb-2 flex justify-between">
                <a
                  rel="noopener noreferrer"
                  href="/"
                  className="text-l text-blue-400 hover:underline"
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
                  color="secondary"
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
