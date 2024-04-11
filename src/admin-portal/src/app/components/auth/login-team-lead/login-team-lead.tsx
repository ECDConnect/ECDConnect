import {
  Config,
  initialLoginValues,
  LoginRequestModel,
  loginSchema,
} from '@ecdlink/core';
import { Alert, Button, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import FormField from '../../form-field/form-field';
import logo from '../../../../assets/Logo-ECDConnect.svg';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { PasswordInput } from '../../password-input/password-input';
import ROUTES from '../../../routes/app.routes-constants';

export default function LoginTeamLead() {
  const { login } = useAuth();
  const history = useHistory();
  const [displayError, setDisplayError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFieldVisible, setIdFieldVisible] = useState(true);

  const { register, getValues, setValue, control } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: initialLoginValues,
    mode: 'onChange',
  });

  const formValues = getValues();
  const { passportField, idField, password } = useWatch({ control });

  const toggleIdAndpassport = (visible: boolean) => {
    const flag = !visible;
    setValue(flag ? 'passportField' : 'idField', '');
    setValue('preferId', flag);
    setIdFieldVisible(flag);
  };

  useEffect(() => {
    setValue('password', password);
  }, [password]);

  const signIn = async () => {
    if (
      (formValues?.idField || formValues?.passportField) &&
      formValues?.password
    ) {
      setIsLoading(true);
      const body: LoginRequestModel = {
        username: formValues?.idField || formValues?.passportField,
        password: formValues.password,
      };
      const isAuthenticated = await login(body, Config.authApi).catch(() => {
        setDisplayError(true);
        setIsLoading(false);
      });

      if (isAuthenticated) {
        setIsLoading(false);
        history.push('/clinics');
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
      <div className="m-8 rounded-xl bg-white py-8 px-2 shadow sm:h-screen sm:overflow-y-scroll md:h-full md:w-1/3 md:overflow-y-scroll">
        <div className="flex flex-shrink-0 items-center justify-center">
          {getLogoUrl()}
        </div>
        <div className="flex flex-shrink-0 items-center justify-center">
          <h2 className="font-h1 textLight text-bold mt-6 text-2xl">Log In</h2>
        </div>
        <div className="mt-8">
          <div className="mt-6">
            <form className="space-y-2">
              {idFieldVisible && (
                <div className="mb-2">
                  <FormField
                    label={'ID number *'}
                    nameProp={'idField'}
                    register={register}
                    placeholder={'E.g. 7601010338089'}
                  />
                </div>
              )}
              {!idFieldVisible && (
                <div className="mb-2">
                  <FormField
                    label={'Passport number *'}
                    nameProp={'passportField'}
                    register={register}
                    placeholder="e.g EN000666"
                  />
                </div>
              )}
              {!idFieldVisible && (
                <Button
                  className={'my-2 rounded-xl'}
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
                  className={'my-2 rounded-xl'}
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
                <PasswordInput
                  label={'Password'}
                  nameProp={'password'}
                  value={formValues.password}
                  register={register}
                  className="mb-4"
                />
              </div>

              <Button
                className={
                  ' focus:outline-none my-2 inline-flex w-5/12 items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white '
                }
                type="ghost"
                color="secondary"
                onClick={() => history.push(ROUTES.TEAM_LEAD_RESET_PASSWORD)}
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
                  className={'mt-2 mb-3 w-full rounded'}
                  type="filled"
                  isLoading={isLoading}
                  color="secondary"
                  disabled={
                    !formValues.password || (!passportField && !idField)
                  }
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
