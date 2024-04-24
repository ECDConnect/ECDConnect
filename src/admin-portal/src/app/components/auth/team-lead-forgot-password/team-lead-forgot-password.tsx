import {
  Config,
  initialForgotPasswordValues,
  resetSchema,
  useTheme,
} from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  Button,
  Dialog,
  DialogPosition,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import FormField from '../../form-field/form-field';
import logo from '../../../../assets/Logo-ECDConnect.svg';
import thumbs_up from '../../../../assets/icon_thumbsup.svg';
import ROUTES from '../../../routes/app.routes-constants';

export default function TeamLeadForgotPassword() {
  const { theme } = useTheme();
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const [displayError, setDisplayError] = useState(false);
  const [idFieldVisible, setIdFieldVisible] = useState(true);
  const [displayCallHelp, setDisplayCallHelp] = useState<boolean>(false);

  const history = useHistory();

  const {
    register,
    getValues,
    setValue: setTlRegistrationValue,
    control,
  } = useForm({
    resolver: yupResolver(resetSchema),
    defaultValues: initialForgotPasswordValues,
    mode: 'onChange',
  });

  const toggleIdAndpassport = (visible: boolean) => {
    const flag = !visible;
    setTlRegistrationValue(flag ? 'passportField' : 'idField', '');
    setTlRegistrationValue('preferId', flag);
    setIdFieldVisible(flag);
  };

  const { idField, passportField } = useWatch({ control });
  const formValues = getValues();

  const requestResetPasword = async () => {
    if (idField || passportField) {
      setIsLoading(true);
      const body = {
        username: idField || passportField,
      };
      const isLinkSent = await forgotPassword(body, Config.authApi);

      if (isLinkSent) {
        setIsLoading(false);
        localStorage.setItem(
          'email',
          formValues.idField || formValues?.passportField
        );
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
    if (idField || passportField) {
      setResetLinkSent(!resetLinkSent);
      setIsLoading(!isLoading);
      requestResetPasword();
    } else if ((idField || passportField) && resetLinkSent) {
      setIsLoading(!isLoading);
      requestResetPasword();
    }
  };

  const getLogoUrl = () => {
    if (theme && theme.images) {
      return <img className="h-100 w-3/12" src={logo} alt="Login Logo" />;
    } else {
      return <div className="h-32 w-32">&nbsp;</div>;
    }
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
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
          <h4 className="font-h1 mt-4 text-center text-lg">SMS sent! </h4>

          <p className="mb-3 pt-2 text-center text-lg text-gray-700">
            If there's an account registered with your ID number, you'll receive
            a password reset link. Please check your messages and follow the
            instructions in the SMS.
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
            Fill in your ID number and we will send you a link to reset your
            password.
          </p>

          <div className="mt-8">
            <div className="mt-6">
              <form className="space-y-6">
                {idFieldVisible && (
                  <FormField
                    label={'ID number *'}
                    nameProp={'idField'}
                    register={register}
                    placeholder={'E.g. 7601010338089'}
                  />
                )}
                {!idFieldVisible && (
                  <FormField
                    label={'Passport number *'}
                    nameProp={'passportField'}
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

                <div>
                  <Button
                    className={'mt-3 w-full rounded'}
                    type="filled"
                    isLoading={isLoading}
                    color="secondary"
                    disabled={!idField && !passportField}
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
              <div
                className={
                  'mt-6 flex flex-1 flex-row items-center justify-start'
                }
              >
                {renderIcon(
                  'QuestionMarkCircleIcon',
                  'h-5 w-5 text-primary mr-2'
                )}
                <Typography
                  type="unspecified"
                  fontSize="14"
                  className="mr-2"
                  color="textLight"
                  text={'No SMS'}
                ></Typography>
                <Button
                  type="filled"
                  color="tertiaryAccent3"
                  background="transparent"
                  size="small"
                  onClick={() => setDisplayCallHelp(true)}
                  className="rounded-2xl"
                >
                  <Typography
                    type="help"
                    color="tertiary"
                    text={'Get help'}
                  ></Typography>
                </Button>
              </div>
              <Dialog
                className={'mb-16 px-4'}
                stretch={true}
                visible={displayCallHelp}
                position={DialogPosition.Bottom}
              >
                <ActionModal
                  icon={'InformationCircleIcon'}
                  iconColor="infoMain"
                  iconBorderColor="infoBb"
                  importantText={'Please call our helpline'}
                  linkText={'087 158 5229'}
                  linkClick={callForHelp}
                  linkTextWeight={'bold'}
                  actionButtons={[
                    {
                      text: 'Close',
                      textColour: 'primary',
                      colour: 'primary',
                      type: 'outlined',
                      onClick: () => setDisplayCallHelp(false),
                      leadingIcon: 'XIcon',
                    },
                  ]}
                />
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
