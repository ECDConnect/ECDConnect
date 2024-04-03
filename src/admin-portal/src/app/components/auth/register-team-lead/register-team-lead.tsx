import {
  Config,
  initialRegisterValues,
  LocalStorageKeys,
  RegisterRequestModel,
  registerSchema,
  useTheme,
} from '@ecdlink/core';
import { Alert, Button, Divider, FormInput, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps, useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import FormField from '../../form-field/form-field';
import logo from '../../../../assets/Logo-ECDConnect.svg';
import zxcvbn from 'zxcvbn-typescript';
import { PasswordInput } from '../../password-input/password-input';

interface RouteParams {
  resetToken: string;
}

export default function RegisterTeamLead(
  props: RouteComponentProps<RouteParams>
) {
  const { registerUser, logout } = useAuth();
  const { theme } = useTheme();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetToken } = useParams<RouteParams>();

  const {
    register,
    getValues,
    formState,
    watch,
    setValue: setTlRegistrationValue,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: initialRegisterValues,
    mode: 'onChange',
  });

  //check password strength
  const password = watch('password');
  const passwordStrength = zxcvbn(password);
  const passwordScore = passwordStrength.score; // Assuming you have a variable to store the password strength score

  const { errors, isValid } = formState;
  const formValues = getValues();
  console.log({ formValues });
  const [showPassword, setShowPassword] = useState(false);
  const [idFieldVisible, setIdFieldVisible] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleIdAndpassport = (visible: boolean) => {
    const flag = !visible;
    setTlRegistrationValue(flag ? 'passportField' : 'idField', '');
    setTlRegistrationValue('preferId', flag);
    setIdFieldVisible(flag);
  };

  const termsState = watch('acceptedTerms');
  const acceptedTerms = termsState && isValid;

  console.log(resetToken);

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
      <div className="m-8 mb-12 h-screen overflow-y-scroll rounded-xl bg-white p-8 shadow lg:w-1/3">
        <div className="flex flex-shrink-0 items-center justify-center">
          {getLogoUrl()}
        </div>
        <div className="flex flex-shrink-0 items-center justify-center">
          <h2 className="font-h1 textLight mt-6 text-2xl">Register</h2>
        </div>
        <div className="mt-8">
          <div className="mt-6">
            <form className="mb-8 space-y-6">
              {/* <div>
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
              </div> */}

              {/* <div className="myt-4 sm:col-span-3">
            <FormField
              label={'Id number / passport *'}
              nameProp={'idNumber'}
              register={register}
              // error={errors.idNumber?.message}
              placeholder="e.g 6201014800088"
            />
          </div> */}
              {idFieldVisible && (
                <FormField
                  label={'ID number *'}
                  // visible={true}
                  nameProp={'idField'}
                  register={register}
                  // error={errors['idField']}
                  placeholder={'E.g. 7601010338089'}
                />
              )}
              {!idFieldVisible && (
                <FormField
                  label={'Passport number *'}
                  // visible={true}
                  nameProp={'passportField'}
                  // error={errors['passportField']}
                  register={register}
                  placeholder="e.g EN000666"
                />
              )}
              {!idFieldVisible && (
                <Button
                  className={'mb-2 rounded-xl'}
                  type="outlined"
                  color="tertiary"
                  background={'transparent'}
                  size="small"
                  onClick={() => toggleIdAndpassport(idFieldVisible)}
                >
                  <Typography
                    type="buttonSmall"
                    color="tertiary"
                    text={'Enter ID number instead'}
                  ></Typography>
                </Button>
              )}
              {idFieldVisible && (
                <Button
                  className={'mb-2 rounded-xl'}
                  type="outlined"
                  color="tertiary"
                  size="small"
                  background={'transparent'}
                  onClick={() => toggleIdAndpassport(idFieldVisible)}
                >
                  <Typography
                    type="buttonSmall"
                    color="tertiary"
                    text={'Enter passport number instead'}
                  ></Typography>
                </Button>
              )}

              <div className="space-y-1">
                <FormInput<RegisterRequestModel>
                  label={'Cellphone number *'}
                  nameProp={'phoneNumber'}
                  register={register}
                  placeholder="e.g 0123456789"
                  value={formValues.phoneNumber}
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
                    label={'Terms and conditions *'}
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
                  message={
                    'Oh no! There are 2 problems above. Please fix them:'
                  }
                  type={'error'}
                />
              )}
              <div>
                <Button
                  className={'mt-3 w-full rounded-2xl'}
                  type="filled"
                  isLoading={isLoading}
                  color="secondary"
                  // disabled={!acceptedTerms}
                  onClick={registerNewUser}
                >
                  <Typography
                    type="help"
                    color="white"
                    text={'Sign up'}
                  ></Typography>
                </Button>
              </div>
              <Divider
                title={'Already have a Funda App account?'}
                dividerType={'solid'}
                className={'mt-2 mb-2'}
              />

              <Button
                className={'mt-5 mb-5 w-full rounded-2xl'}
                type="outlined"
                color="secondary"
                // disabled={!isOnline}
                onClick={() => history.push('/')}
              >
                <Typography
                  type="help"
                  color="secondary"
                  text={'Log in'}
                ></Typography>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
