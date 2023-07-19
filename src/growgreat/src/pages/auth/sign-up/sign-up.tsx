import {
  ContentConsentTypeEnum,
  useQueryParams,
  useTheme,
} from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  BannerWrapper,
  Button,
  Checkbox,
  classNames,
  Dialog,
  DialogPosition,
  Divider,
  FormInput,
  HeaderSlide,
  HeaderSlider,
  PasswordInput,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { Article } from '@/components/article/article';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useStoreSetup } from '@/hooks/useStoreSetup';
import {
  initialRegisterValues,
  SignUpModel,
  signUpSchema,
} from '@/schemas/auth/sign-up/sign-up';
import AuthService from '@/services/AuthService/AuthService';
import { useAppDispatch } from '@/store';
import { staticDataThunkActions } from '@/store/static-data';

import bannerOne from '@/assets/sign-up-carousel/bannerOnex2.png';
import bannerTwo from '@/assets/sign-up-carousel/bannerTwox2.png';
import bannerThree from '@/assets/sign-up-carousel/bannerThreex2.png';
import bannerFour from '@/assets/sign-up-carousel/bannerFourx2.png';
import * as styles from '@/pages/auth/sign-up/sign-up.styles';

const headerSlide: HeaderSlide[] = [
  {
    title: 'Welcome to CHW Connect!',
    text: 'Track your clients, get support, access training opportunities, connect with other CHWs & get rewarded.',
    image: bannerOne,
  },
  {
    title: 'Home visits made easy!',
    text: 'No more carrying your client folders.',
    image: bannerTwo,
  },
  {
    title: 'Now available in Sepedi!',
    text: 'Support that speaks your language.',
    image: bannerThree,
  },
  {
    title: 'Grow great with us!',
    text: 'Stay up to date with the latest information and access training opportunities. ',
    image: bannerFour,
  },
];

export const SignUp: React.FC = () => {
  const appDispatch = useAppDispatch();
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

  const errorStrings = Object.keys(errors).map(
    (x) => errors[x as keyof SignUpModel]?.message || ''
  );

  watch();

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
      setRequestError('You entered incorrect details');
      return;
    }

    if (informationVerified.verified) {
      proceedToPhoneValidation(formValue, authToken || '');
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
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        size={'signup'}
        renderBorder={false}
        renderOverflow={false}
        displayOffline={!isOnline}
      >
        <HeaderSlider
          className="h-100 mx-4 mt-16"
          slides={headerSlide}
          autoPlay
          infiniteLoop
          transitionTime={500}
        />
        <form className={styles.formStyle}>
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
            sufficIconColor="primary"
            value={signUpFormGetValues().password}
            register={signUpRegister}
            strengthMeterVisible={true}
            className="mb-9"
          />

          {errorStrings?.length > 0 && (
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
              className={`${styles.marginTop}${styles.marginBottom}`}
            />
          )}
          <Typography
            type={'body'}
            color={'uiMidDark'}
            weight={'bold'}
            text={'Terms and conditions'}
            className="my-4"
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
            />
            <Typography
              text={'I accept the'}
              type="help"
              color={
                errors.termsAndConditionsAccepted?.message
                  ? 'errorDark'
                  : 'textMid'
              }
            />
            &nbsp;
            <div
              onClick={() => {
                displayArticle(
                  ContentConsentTypeEnum.TermsAndConditions,
                  'Consent & Commitment Agreement'
                );
              }}
            >
              <Typography
                className={'cursor-pointer'}
                text={'terms and conditions'}
                type="help"
                underline={true}
                color={
                  errors.termsAndConditionsAccepted?.message
                    ? 'errorDark'
                    : 'secondary'
                }
              />
            </div>
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
            />
            <Typography
              text={'I accept the'}
              type="help"
              color={
                errors.dataPermissionAgreementAccepted?.message
                  ? 'errorDark'
                  : 'textMid'
              }
            />
            &nbsp;
            <Typography
              onClick={() => {
                displayArticle(
                  ContentConsentTypeEnum.DataPermissionsAgreement,
                  'Data Permissions Agreement'
                );
              }}
              className={'cursor-pointer'}
              text={'data permissions agreement'}
              underline={true}
              type="help"
              color={
                errors.dataPermissionAgreementAccepted?.message
                  ? 'errorDark'
                  : 'secondary'
              }
            />
          </div>
          <Button
            id="gtm-register"
            className={styles.formButton}
            type="filled"
            color="primary"
            isLoading={isLoading}
            disabled={!isOnline}
            onClick={handleSubmit(submitForm)}
          >
            <Typography type="help" color="white" text={'Sign up'} />
          </Button>

          <Divider
            title={'Already have a CHW Connect account?'}
            dividerType={'solid'}
            className={'mt-2 mb-2 bg-white'}
          />

          <Button
            className={styles.formButton}
            type="outlined"
            color="primary"
            disabled={!isOnline}
            onClick={() => history.push('./login')}
          >
            <Typography type="help" color="primary" text={'Log in'} />
          </Button>
        </form>

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
            importantText={`Grow Great has a different cellphone number for you: ${
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
        {!isOnline && (
          <Alert
            className={'mt-5 mb-3'}
            title="Your internet connection is unstable."
            type={'warning'}
          />
        )}
      </BannerWrapper>
    </div>
  );
};
