import {
  Config,
  ContentConsentTypeEnum,
  NOTIFICATION,
  RegisterRequestModel,
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
  ChipStatus,
  classNames,
  Dialog,
  DialogPosition,
  Divider,
  FormInput,
  HeaderCard,
  HeaderSlide,
  PasswordInput,
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

const token = new URLSearchParams(window.location.search).get('token');

let headerSlide: HeaderSlide;

export const SignUp: React.FC = () => {
  const appDispatch = useAppDispatch();
  const { setNotification } = useNotifications();
  const {
    watch,
    register: signUpRegister,
    setValue: signUpSetValue,
    getValues: signUpFormGetValues,
    handleSubmit,
    control,
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

  if (userDetails) {
    // coach
    if (userDetails.roleName === 'Coach') {
      headerSlide = {
        status: ChipStatus.Available,
        title: 'Manage practitioners',
        text: 'View practitioner details, see classroom information and fill in important forms.',
        image: '../../../assets/banner-coach.jpg',
      };
    }
  } else {
    // practitioner & principal
    headerSlide = {
      status: ChipStatus.Available,
      title: 'Manage your classroom',
      text: 'Take attendance, track progress, and plan your programme',
      image: '../../../assets/banner-ss.jpg',
    };
  }

  useEffect(() => {
    async function init() {
      if (resetAppStore) {
        await resetAppStore(false);
        await resetAuth();
      }

      await appDispatch(staticDataThunkActions.getLanguages({})).unwrap();
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

  const errorStrings = Object.keys(errors).map(
    (x) => errors[x as keyof SignUpModel]?.message || ''
  );

  watch();

  console.log({ authToken });

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

    console.log({ informationVerified });

    setIsLoading(false);

    if (informationVerified.errorCode) {
      setRequestError('You entered incorrect details');
      return;
    }

    if (informationVerified.verified) {
      // proceedToPhoneValidation(formValue, authToken || '');

      if (authToken) {
        setIsLoading(true);
        const body: RegisterRequestModel = {
          username: formValue.username,
          password: formValue.password,
          token: authToken,
          acceptedTerms: formValue?.termsAndConditionsAccepted,
        };

        console.log({ body });

        // const isAuthenticated = await new AuthService().RegisterNewUser(
        //   Config.authApi,
        //   body
        // ).catch(() => {
        //   setNotification({
        //     title: ` Failed to Sign Up!`,
        //     variant: NOTIFICATION.ERROR,
        //   });
        //   setIsLoading(false);
        // });

        // if (isAuthenticated) {
        //   setIsLoading(false);
        //   await resetAppStore();
        //   await resetAuth();
        //   history.push(ROUTES.LOGIN);
        //   setNotification({
        //     title: ` Successfully registered!`,
        //     variant: NOTIFICATION.SUCCESS,
        //   });
        // } else {
        //   setNotification({
        //     title: ` Successfully registered!`,
        //     variant: NOTIFICATION.SUCCESS,
        //   });
        //   setIsLoading(false);
        // }
      }
    } else if (informationVerified.errorCode === 2) {
      setPresentCellNumberMismatch(true);
    }
  };

  const proceedToPhoneValidation = async (
    { cellphone, username, password }: SignUpModel,
    token: string
  ) => {
    setIsLoading(true);

    setIsLoading(false);
    history.push('/verify-phone', {
      phoneNumber: cellphone,
      password: password,
      username,
      token,
    });
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

  return (
    <div className={styles.wrapper}>
      <BannerWrapper
        color={'primary'}
        showBackground
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        className={styles.contentWrapper}
        size={'signup'}
        renderBorder={false}
        renderOverflow={false}
      >
        {headerSlide && <HeaderCard className={'mt-4'} slide={headerSlide} />}

        <SliderPagination totalItems={1} activeIndex={0} className={'p-4'} />
        <form style={{ maxWidth: '442px' }} className={styles.formStyle}>
          {preferId && (
            <FormInput<SignUpModel>
              label={'ID Number'}
              visible={true}
              nameProp={'username'}
              register={signUpRegister}
              placeholder={'E.g. 7601010338089'}
            />
          )}
          {!preferId && (
            <FormInput<SignUpModel>
              label={'Passport Number'}
              visible={true}
              nameProp={'username'}
              register={signUpRegister}
            />
          )}

          <Button
            className={'mt-4 mb-4'}
            type={'outlined'}
            color={'primary'}
            background={'transparent'}
            shape={'normal'}
            size={'small'}
            onClick={toggleIdAndPassport}
          >
            <Typography
              color={'primary'}
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
            type={'text'}
            register={signUpRegister}
          />

          <PasswordInput<SignUpModel>
            label={'Password'}
            nameProp={'password'}
            sufficIconColor={'uiMidDark'}
            value={signUpFormGetValues().password}
            register={signUpRegister}
            strengthMeterVisible={true}
            className="mb-9"
          />

          <Typography
            type={'body'}
            color={'uiMidDark'}
            weight={'bold'}
            text={'Terms and conditions'}
            className={styles.marginBottom}
          />
          <div
            className={classNames(styles.checkboxWrapper, styles.marginBottom)}
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
                  'Consent & Commitment Agreement'
                );
              }}
            />
          </div>
          <div className={styles.checkboxWrapper}>
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
          {errorStrings.length > 0 && (
            <Alert
              title={`There were ${errorStrings.length} errors with your submission`}
              type={'error'}
              list={errorStrings}
              className={styles.marginTop}
            />
          )}
          {(requestError?.length ?? 0) > 0 && (
            <Alert
              title={`There were errors with your submission`}
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
            color="primary"
            isLoading={isLoading}
            disabled={!isOnline}
            onClick={handleSubmit(submitForm)}
          >
            <Typography type="help" color="white" text={'Sign up'}></Typography>
          </Button>

          <Divider
            title={'Already have a Funda App account?'}
            dividerType={'solid'}
            className={'mt-2 mb-2'}
          />

          <Button
            className={styles.formButton}
            type="outlined"
            color="primary"
            disabled={!isOnline}
            onClick={() => history.push('./login')}
          >
            <Typography
              type="help"
              color="primary"
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
        />
      )}
      <Dialog
        visible={presentCellNumberMismatch}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor={'alertMain'}
          importantText={`SmartStart has a different cellphone number for you: ${
            signUpFormGetValues().cellphone
          }`}
          detailText={
            'Please check you have entered the correct cellphone number or call our toll free number to have it changed.'
          }
          actionButtons={[
            {
              colour: 'primary',
              text: 'Edit cellphone number',
              textColour: 'white',
              leadingIcon: 'PencilIcon',
              onClick: () => {
                setPresentCellNumberMismatch(false);
              },
              type: 'filled',
            },
            {
              colour: 'primary',
              text: 'Call 0800 014 817',
              textColour: 'primary',
              leadingIcon: 'PhoneIcon',
              onClick: () => {
                setPresentCellNumberMismatch(false);
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
