import {
  Config,
  ContentConsentTypeEnum,
  NOTIFICATION,
  RegisterRequestModel,
  useDialog,
  useNotifications,
  useQueryParams,
  useTheme,
} from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  BannerWrapper,
  Button,
  Checkbox,
  Dialog,
  DialogPosition,
  Divider,
  FormInput,
  SliderPagination,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { Article } from '../../../components/article/article';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import {
  initialRegisterValues,
  SignUpModel,
  signUpSchema,
} from '@schemas/auth/sign-up/sign-up';
import AuthService from '@services/AuthService/AuthService';
import { useAppDispatch } from '@store';
import { staticDataThunkActions } from '@store/static-data';
import * as styles from './sign-up.styles';
import { UserService } from '@/services/UserService';
import { HelpForm } from '@/components/help-form/help-form';
import ROUTES from '@/routes/routes';
import { useTenant } from '@/hooks/useTenant';
import TransparentLayer from '../../../assets/TransparentLayer.png';

const token = new URLSearchParams(window.location.search).get('token');

export const SignUp: React.FC = () => {
  const tenant = useTenant();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const { setNotification } = useNotifications();
  const {
    watch,
    register: signUpRegister,
    setValue: signUpSetValue,
    getValues: signUpFormGetValues,
    handleSubmit,
    control,
    clearErrors,
    trigger,
  } = useForm<SignUpModel>({
    resolver: yupResolver(signUpSchema),
    defaultValues: initialRegisterValues,
    mode: 'onChange',
  });
  const { errors } = useFormState({ control });
  const { resetAppStore, resetAuth } = useStoreSetup();
  const [preferId, setPreferId] = useState<boolean>(true);
  const [contentConsentTypeEnum, setContentConsentTypeEnum] =
    useState<ContentConsentTypeEnum>();
  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [presentCellNumberMismatch, setPresentCellNumberMismatch] =
    useState<boolean>(false);
  const [articleTitle, setArticleTitle] = useState<string>();
  const history = useHistory();
  const location = useLocation();
  const { theme } = useTheme();
  const queryParams = useQueryParams(location.search);
  const authToken = queryParams.getValue('token');
  const { isOnline } = useOnlineStatus();
  const [userDetails, setUserDetails] = useState<any>();
  const [openHelp, setOpenHelp] = useState(false);
  const appName = tenant?.tenant?.applicationName;
  const isWhitelabel = tenant?.isWhiteLabel;
  const [permissionsErrorMessage, setPermissionsErrorMessage] = useState('');

  useEffect(() => {
    async function init() {
      if (resetAppStore) {
        await resetAppStore(false);
        await resetAuth();
      }

      await appDispatch(staticDataThunkActions.getOpenLanguages({})).unwrap();
    }
    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserDetailsByToken = async () => {
    let user_details_from_request;
    if (token) {
      user_details_from_request = await new UserService('').getUserByToken(
        token
      );
      setUserDetails(user_details_from_request);
    } else {
      console.log('user not found');
    }
  };
  useEffect(() => {
    if (token) {
      getUserDetailsByToken();
    }
  }, []);

  watch();

  useEffect(() => {
    if (
      errors.termsAndConditionsAccepted?.message ||
      errors.dataPermissionAgreementAccepted?.message
    ) {
      setPermissionsErrorMessage(
        'You must accept both agreements to continue.'
      );
    }
  }, [
    errors.dataPermissionAgreementAccepted?.message,
    errors.termsAndConditionsAccepted?.message,
  ]);

  const submitForm = async (formValue: SignUpModel) => {
    const valid = await signUpSchema.isValid(formValue);

    if (!valid) return;

    setIsLoading(true);

    const informationVerified = await new AuthService().VerifyInvitationRequest(
      {
        phoneNumber: formValue.cellphone,
        token: authToken || '',
        username: formValue.username || '',
      }
    );

    setIsLoading(false);

    if (informationVerified.errorCode) {
      if (informationVerified.verified === false) {
        if (informationVerified.errorCode === 1) {
          setRequestError(`If you are having trouble, tap "Get help"`);
          setIsLoading(false);
          return;
        }
        if (informationVerified.errorCode === 2) {
          setPresentCellNumberMismatch(true);
          setIsLoading(false);
        }
        return;
      }
    }
    if (authToken) {
      setIsLoading(true);
      const body: RegisterRequestModel = {
        username: formValue.username,
      };

      const isAuthenticated = await new AuthService()
        .RegisterPractitioner(Config.authApi, body)
        .catch(() => {
          setNotification({
            title: ` Failed to Sign Up!`,
            variant: NOTIFICATION.ERROR,
          });
          setIsLoading(false);
        });

      if (isAuthenticated) {
        setIsLoading(false);
        history.push(ROUTES.CREATE_USERNAME, {
          userId: isAuthenticated?.data,
          token: authToken,
        });
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

  const toggleIdAndPassport = () => {
    setPreferId(!preferId);
    signUpSetValue('preferId', !preferId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    signUpSetValue('username', '', {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const displayArticle = async (key: ContentConsentTypeEnum, title: string) => {
    setContentConsentTypeEnum(key);
    setPresentArticle(true);
    setArticleTitle(title);
  };

  const handleIncorrectBrowser = () => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onSubmit) => {
        return (
          <ActionModal
            className={'mx-4'}
            title={`Oops! ${appName} works best on Chrome or Firefox`}
            paragraphs={[
              `To download Chrome or Firefox, go to your phone's app store.`,
            ]}
            icon={'ExclamationIcon'}
            iconSize={48}
            iconColor={'alertMain'}
            iconBorderColor={'white'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'quatenary',
                type: 'outlined',
                onClick: () => onSubmit(),
                textColour: 'quatenary',
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const userAgent = navigator.userAgent;

  useEffect(() => {
    if (
      userAgent.includes('Firefox') ||
      (userAgent.includes('Chrome') && !userAgent.includes('Edg'))
    ) {
      return;
    } else {
      handleIncorrectBrowser();
    }
  }, [userAgent]);

  return (
    <div className={styles.wrapper}>
      <BannerWrapper
        color={'primary'}
        showBackground={isWhitelabel ? false : true}
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        className={styles.contentWrapper}
        size={'signup'}
        renderBorder={false}
        renderOverflow={false}
      >
        {!isWhitelabel && (
          <SliderPagination totalItems={1} activeIndex={0} className={'p-4'} />
        )}
        <form style={{ maxWidth: '442px' }} className={styles.formStyle}>
          {preferId && (
            <FormInput<SignUpModel>
              label={'ID Number'}
              visible={true}
              nameProp={'username'}
              register={signUpRegister}
              placeholder={'E.g. 7601010338089'}
              error={errors?.username}
            />
          )}
          {!preferId && (
            <FormInput<SignUpModel>
              label={'Passport Number'}
              visible={true}
              nameProp={'username'}
              register={signUpRegister}
              error={errors?.username}
            />
          )}

          <Button
            className={'mt-4 mb-4'}
            type={'outlined'}
            color={'secondary'}
            background={'transparent'}
            shape={'normal'}
            size={'small'}
            onClick={toggleIdAndPassport}
          >
            <Typography
              color={'secondary'}
              weight={'bold'}
              text={`Enter ${preferId ? 'Passport' : 'ID'} number instead`}
              type="small"
            />
          </Button>
          <FormInput<SignUpModel>
            className={styles.marginBottom}
            label={'Cellphone number'}
            nameProp={'cellphone'}
            placeholder="E.g. 012 345 6789"
            visible={true}
            type={'number'}
            register={signUpRegister}
            error={errors?.cellphone}
          />

          <Typography
            type={'h4'}
            color={'textDark'}
            weight={'bold'}
            text={'Accept the agreements to continue'}
            className={styles.marginBottom}
          />
          <div
            className={`${
              errors.termsAndConditionsAccepted?.message &&
              'border-errorDark border'
            } ${
              signUpFormGetValues()?.termsAndConditionsAccepted
                ? 'border-quatenary bg-quatenaryBg border'
                : 'bg-uiBg'
            } mb-4 flex w-full flex-row items-center justify-between gap-2 rounded-xl p-4`}
            onClick={() => {
              signUpSetValue(
                'termsAndConditionsAccepted',
                !signUpFormGetValues()?.termsAndConditionsAccepted
              );
              clearErrors('termsAndConditionsAccepted');
              setPermissionsErrorMessage('');
              trigger();
            }}
          >
            <Checkbox<SignUpModel>
              register={signUpRegister}
              nameProp={'termsAndConditionsAccepted'}
              checkboxColor={
                errors.termsAndConditionsAccepted?.message
                  ? 'errorDark'
                  : 'primaryAccent2'
              }
            ></Checkbox>
            <Typography
              text={'I accept the terms and conditions'}
              type="help"
              color={
                errors.termsAndConditionsAccepted?.message
                  ? 'errorDark'
                  : 'textMid'
              }
            />
            &nbsp;
            <Button
              color={'secondaryAccent2'}
              type={'filled'}
              text="Read"
              textColor="secondary"
              className={'rounded-xl'}
              size={'small'}
              onClick={() => {
                displayArticle(
                  ContentConsentTypeEnum.TermsAndConditions,
                  'Terms and Conditions'
                );
              }}
            />
          </div>
          <div
            className={`${
              errors.dataPermissionAgreementAccepted?.message &&
              'border-errorDark border'
            } ${
              signUpFormGetValues()?.dataPermissionAgreementAccepted
                ? 'border-quatenary bg-quatenaryBg border'
                : 'bg-uiBg'
            } flex w-full flex-row items-center justify-between gap-2 rounded-xl p-4`}
            onClick={() => {
              signUpSetValue(
                'dataPermissionAgreementAccepted',
                !signUpFormGetValues()?.dataPermissionAgreementAccepted
              );
              clearErrors('dataPermissionAgreementAccepted');
              setPermissionsErrorMessage('');
              trigger();
            }}
          >
            <Checkbox<SignUpModel>
              register={signUpRegister}
              nameProp={'dataPermissionAgreementAccepted'}
              checkboxColor={
                errors.dataPermissionAgreementAccepted?.message
                  ? 'errorDark'
                  : 'primaryAccent2'
              }
            ></Checkbox>
            <Typography
              text={'I accept the data permissions agreement'}
              type="help"
              color={
                errors.dataPermissionAgreementAccepted?.message
                  ? 'errorDark'
                  : 'textMid'
              }
            />
            &nbsp;
            <Button
              color={'secondaryAccent2'}
              type={'filled'}
              text="Read"
              textColor="secondary"
              className={'rounded-xl'}
              size={'small'}
              onClick={() => {
                displayArticle(
                  ContentConsentTypeEnum.DataPermissionsAgreement,
                  'Data Permissions Agreement'
                );
              }}
            />
          </div>
          {permissionsErrorMessage && (
            <Alert
              className={'mt-5 mb-3'}
              title={permissionsErrorMessage}
              type={'error'}
            />
          )}
          {/* {errorStrings.length > 0 && (
            <Alert
              title={`There were ${errorStrings.length} errors with your submission`}
              type={'error'}
              list={errorStrings}
              className={styles.marginTop}
            />
          )} */}
          {(requestError?.length ?? 0) > 0 && (
            <Alert
              title={`Please check your ID and cellphone number.`}
              type={'error'}
              list={requestError ? [requestError] : []}
              className={styles.marginTop}
              button={
                <Button
                  text="Get help"
                  icon="ClipboardListIcon"
                  type={'filled'}
                  color={'quatenary'}
                  textColor={'white'}
                  onClick={() => setOpenHelp(true)}
                />
              }
            />
          )}

          <Button
            id="gtm-register"
            className={styles.formButton}
            type="filled"
            color="quatenary"
            isLoading={isLoading}
            disabled={!isOnline || isLoading}
            onClick={handleSubmit(submitForm)}
          >
            <Typography type="help" color="white" text={'Next'}></Typography>
          </Button>

          <Divider
            title={`Already have a ${appName} App account?`}
            dividerType={'solid'}
            className={'mb-2'}
          />

          <Button
            className={styles.formButton}
            type="outlined"
            color="quatenary"
            disabled={!isOnline}
            onClick={() => history.push('./login')}
          >
            <Typography
              type="help"
              color="quatenary"
              text={'Log in'}
            ></Typography>
          </Button>
        </form>
      </BannerWrapper>
      {contentConsentTypeEnum && (
        <Article
          consentEnumType={contentConsentTypeEnum}
          visible={presentArticle}
          title={articleTitle}
          onClose={() => setPresentArticle(false)}
          isOpen={true}
          isConsentScreen={true}
        />
      )}
      <Dialog
        visible={presentCellNumberMismatch}
        position={DialogPosition.Middle}
        className="p-4"
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor={'alertMain'}
          importantText={`${appName} has a different cellphone number for you`}
          detailText={`Please check that this is the correct cellphone number: ${
            signUpFormGetValues().cellphone
          }. If you have entered the correct number and are still getting this error, fill in the help form.`}
          actionButtons={[
            {
              colour: 'quatenary',
              text: 'Edit cellphone number',
              textColour: 'white',
              leadingIcon: 'PencilIcon',
              onClick: () => {
                setPresentCellNumberMismatch(false);
              },
              type: 'filled',
            },
            {
              colour: 'quatenary',
              text: 'Get help',
              textColour: 'quatenary',
              leadingIcon: 'PhoneIcon',
              onClick: () => {
                setPresentCellNumberMismatch(false);
                setOpenHelp(true);
              },
              type: 'outlined',
            },
          ]}
        />
      </Dialog>
      <Dialog
        visible={openHelp}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <HelpForm closeAction={setOpenHelp} />
      </Dialog>
      {!isOnline && (
        <Alert
          className={'mt-5 mb-3'}
          title="Your internet connection is unstable."
          type={'warning'}
        />
      )}
    </div>
  );
};
