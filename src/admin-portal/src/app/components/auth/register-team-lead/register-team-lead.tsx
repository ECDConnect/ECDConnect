import {
  Config,
  NOTIFICATION,
  RegisterRequestModel,
  useNotifications,
  useTheme,
} from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  Button,
  containsNumericRegex,
  containsUpperCaseRegex,
  Dialog,
  DialogPosition,
  Divider,
  FormInput,
  SA_CELL_REGEX,
  SA_ID_REGEX,
  SA_PASSPORT_REGEX,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { RouteComponentProps, useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import FormField from '../../form-field/form-field';
import logo from '../../../../assets/Logo-ECDConnect.svg';
import { PasswordInput } from '../../password-input/password-input';
import * as Yup from 'yup';

interface RouteParams {
  resetToken: string;
}

export const initialRegisterValuesForTL: RegisterRequestModel = {
  username: '',
  password: '',
  token: '',
  acceptedTerms: false,
  preferId: true,
  passportField: undefined,
  phoneNumber: undefined,
  idField: undefined,
};

const tlRegisterSchema = Yup.object().shape({
  idField: Yup.string().when('preferId', {
    is: true,
    then: Yup.string()
      .matches(SA_ID_REGEX, 'Please enter a valid ID number')
      .required(),
    otherwise: Yup.string()
      .matches(SA_PASSPORT_REGEX, 'Please enter a valid passport number')
      .required(),
  }),
  phoneNumber: Yup.string()
    .required('Cellphone number is required')
    .matches(SA_CELL_REGEX, 'Please enter a valid cellphone number'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'At least 8 characters')
    .matches(containsNumericRegex, 'At least 1 number')
    .matches(containsUpperCaseRegex, 'At least 1 capital letter'),
});

export default function RegisterTeamLead(
  props: RouteComponentProps<RouteParams>
) {
  const { logout, registerTeamLeadUser, verifyPhoneNumber } = useAuth();
  const { theme } = useTheme();
  const { setNotification } = useNotifications();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { resetToken } = useParams<RouteParams>();

  const {
    register,
    getValues,
    formState,
    setValue: setTlRegistrationValue,
    control,
  } = useForm({
    resolver: yupResolver(tlRegisterSchema),
    defaultValues: initialRegisterValuesForTL,
    mode: 'onChange',
  });

  //check password strength
  const { errors } = formState;
  const formValues = getValues();
  const [idFieldVisible, setIdFieldVisible] = useState(true);
  const [presentCellNumberMismatch, setPresentCellNumberMismatch] =
    useState<boolean>(false);
  const [presentIdNumberMismatch, setPresentIdNumberMismatch] =
    useState<boolean>(false);
  const errorsList = Object?.values(errors);
  const errorListFormatted = errorsList?.map((item) => item?.message);

  const toggleIdAndpassport = (visible: boolean) => {
    const flag = !visible;
    setTlRegistrationValue(flag ? 'passportField' : 'idField', '');
    setTlRegistrationValue('preferId', flag);
    setIdFieldVisible(flag);
  };

  const { acceptedTerms, idField, passportField, phoneNumber } = useWatch({
    control,
  });

  const disableButton =
    !acceptedTerms ||
    (!idField && !passportField) ||
    !phoneNumber ||
    !!errors?.password?.message;

  const registerNewUser = async () => {
    setIsLoading(true);
    const informationVerified = await verifyPhoneNumber(Config.authApi, {
      phoneNumber: formValues.phoneNumber,
      token: resetToken || '',
      username: formValues.idField || '',
    });

    if (informationVerified.verified === false) {
      if (informationVerified.errorCode === 1) {
        setPresentIdNumberMismatch(true);
        setIsLoading(false);
      }
      if (informationVerified.errorCode === 2) {
        setPresentCellNumberMismatch(false);
        setIsLoading(false);
      }
      return;
    }

    if (resetToken) {
      setIsLoading(true);
      const body: RegisterRequestModel = {
        username: formValues.idField || formValues.passportField,
        password: formValues.password,
        token: resetToken,
        acceptedTerms: formValues.acceptedTerms,
      };

      const isAuthenticated = await registerTeamLeadUser(
        body,
        Config.authApi
      ).catch(() => {
        setNotification({
          title: ` Failed to Sign Up!`,
          variant: NOTIFICATION.ERROR,
        });
        setIsLoading(false);
      });

      if (isAuthenticated) {
        setIsLoading(false);
        logout();
        history.push('/team-lead');
        setNotification({
          title: ` Successfully registered!`,
          variant: NOTIFICATION.SUCCESS,
        });
      } else {
        setNotification({
          title: ` Successfully registered!`,
          variant: NOTIFICATION.SUCCESS,
        });
        setIsLoading(false);
      }
    }
  };

  const getLogoUrl = () => {
    if (theme && theme.images) {
      return <img className="h-100 w-150" src={logo} alt="Login Logo" />;
    } else {
      return <div className="h-32 w-32">&nbsp;</div>;
    }
  };

  const call = () => {
    window.open(`tel:0800 014 817`);
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
              {idFieldVisible && (
                <FormField
                  label={'ID number *'}
                  nameProp={'idField'}
                  register={register}
                  placeholder={'E.g. 7601010338089'}
                  error={formState.errors['idField']?.message}
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

              <div className="space-y-1">
                <FormInput<RegisterRequestModel>
                  label={'Cellphone number *'}
                  nameProp={'phoneNumber'}
                  register={register}
                  placeholder="e.g 0123456789"
                  value={formValues.phoneNumber}
                  error={formState.errors['phoneNumber']}
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
              {errorListFormatted?.length > 0 && (
                <div className="w-72">
                  <Alert
                    className={'mt-5 mb-3'}
                    title={`Oh no! There are ${errorListFormatted?.length} problems above. Please fix them:`}
                    list={errorListFormatted}
                    type={'error'}
                  />
                </div>
              )}
              <div>
                <Button
                  className={'mt-3 w-full rounded-2xl'}
                  type="filled"
                  isLoading={isLoading}
                  color="secondary"
                  disabled={disableButton}
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
                onClick={() => history.push('/team-lead')}
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
      <Dialog
        visible={presentCellNumberMismatch}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor={'alertMain'}
          importantText={`CHW Connect has a different cellphone number for you`}
          detailText={
            'Please check you have entered the correct cellphone number or call our toll free number to have it changed.'
          }
          paragraphs={[`You entered : ${formValues.phoneNumber}`]}
          actionButtons={[
            {
              colour: 'secondary',
              text: 'Edit cellphone number',
              textColour: 'white',
              leadingIcon: 'PencilIcon',
              onClick: () => {
                setPresentCellNumberMismatch(false);
              },
              type: 'filled',
            },
            {
              colour: 'secondary',
              text: 'Call 0800 014 817',
              textColour: 'secondary',
              leadingIcon: 'PhoneIcon',
              onClick: () => {
                setPresentCellNumberMismatch(false);
                call();
              },
              type: 'outlined',
            },
          ]}
        />
      </Dialog>
      <Dialog
        visible={presentIdNumberMismatch}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor={'alertMain'}
          importantText={`CHW Connect has a different ID number for you`}
          detailText={
            'Please check you have entered the correct ID number or call our toll free number to have it changed.'
          }
          paragraphs={[
            `You entered : ${formValues.idField || formValues?.passportField}`,
          ]}
          actionButtons={[
            {
              colour: 'secondary',
              text: 'Edit ID number',
              textColour: 'white',
              leadingIcon: 'PencilIcon',
              onClick: () => {
                setPresentIdNumberMismatch(false);
              },
              type: 'filled',
            },
            {
              colour: 'secondary',
              text: 'Call 0800 014 817',
              textColour: 'secondary',
              leadingIcon: 'PhoneIcon',
              onClick: () => {
                setPresentIdNumberMismatch(false);
                call();
              },
              type: 'outlined',
            },
          ]}
        />
      </Dialog>
    </div>
  );
}
