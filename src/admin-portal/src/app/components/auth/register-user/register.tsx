import {
  Config,
  initialRegisterValues,
  RegisterRequestModel,
  registerSchema,
  useTheme,
} from '@ecdlink/core';
import { Alert, Button, Divider, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps, useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import FormField from '../../form-field/form-field';
import logo from '../../../../assets/Logo-ECDConnect.svg';
import { PasswordInput } from '../../password-input/password-input';

interface RouteParams {
  resetToken: string;
}

export default function Register(props: RouteComponentProps<RouteParams>) {
  const { registerUser, logout } = useAuth();
  const { theme } = useTheme();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetToken } = useParams<RouteParams>();

  const { register, getValues, formState, watch } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: initialRegisterValues,
    mode: 'onChange',
  });

  //check password strength
  const username = watch('username');

  const { errors, isValid } = formState;
  const formValues = getValues();

  const termsState = watch('acceptedTerms');
  const acceptedTerms = termsState && isValid;

  const registerNewUser = async () => {
    if (isValid) {
      setIsLoading(true);
      const body: RegisterRequestModel = {
        username: formValues.username,
        password: formValues.password,
        token: resetToken,
        // acceptedTerms: formValues.acceptedTerms,
      };
      const isAuthenticated = await registerUser(body, Config.authApi).catch(
        () => {
          setDisplayError(true);
          setIsLoading(false);
        }
      );

      if (isAuthenticated) {
        setIsLoading(false);
        logout();
        history.push('/');
      } else {
        setIsLoading(false);
        setDisplayError(true);
      }
    }
  };

  useEffect(() => {
    if (username) {
      setDisplayError(false);
    }
  }, [username]);

  const getLogoUrl = () => {
    if (theme && theme.images) {
      return <img className="h-100 w-150" src={logo} alt="Login Logo" />;
    } else {
      return <div className="h-32 w-32">&nbsp;</div>;
    }
  };

  return (
    <div className="darkBackground flex min-h-screen items-center justify-center">
      <div className="m-8 rounded-xl bg-white p-8 shadow lg:w-1/3">
        <div className="flex flex-shrink-0 items-center justify-center">
          {getLogoUrl()}
        </div>
        <div className="flex flex-shrink-0 items-center justify-center">
          <h2 className="font-h1 textLight mt-6 text-2xl">Register</h2>
        </div>
        <div className="mt-8">
          <div className="mt-6">
            <form className="space-y-6">
              <div>
                <FormField
                  label={'Email address *'}
                  nameProp={'username'}
                  type="email"
                  register={register}
                  error={errors.username?.message}
                  instructions={[
                    'Make sure to use the same address where you received the invitation email.',
                  ]}
                  placeholder="e.g. work@email.com"
                />
              </div>

              <div className="space-y-1">
                <PasswordInput
                  label={'Password'}
                  nameProp={'password'}
                  sufficIconColor="black"
                  value={formValues.password}
                  register={register}
                  strengthMeterVisible={true}
                  className="mb-9 "
                />
              </div>
              <Divider></Divider>
              <div className="flex">
                <div>
                  <FormField
                    label={'Terms and conditions ***'}
                    nameProp={'acceptedTerms'}
                    type="checkbox"
                    register={register}
                    instructions={['']}
                    error={errors.acceptedTerms?.message}
                  />
                </div>
              </div>
              {displayError && (
                <Alert
                  className={'mt-5 mb-3'}
                  title={'Oh no! There is 1 problem above. Please fix them:'}
                  titleColor="errorMain"
                  message="Your email address was not recognised. Please use the email address from your invitation. If you need assistance, contact your administrator."
                  messageColor="textDark"
                  type={'error'}
                />
              )}
              <div>
                <Button
                  className={'mt-3 w-full'}
                  type="filled"
                  isLoading={isLoading}
                  color="secondary"
                  disabled={!acceptedTerms}
                  onClick={registerNewUser}
                >
                  <Typography
                    type="help"
                    color="white"
                    text={'Register'}
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
