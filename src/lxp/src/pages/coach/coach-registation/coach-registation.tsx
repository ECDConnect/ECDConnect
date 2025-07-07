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

import { Article } from '../../../components/article/article';

import { useHistory, useLocation } from 'react-router-dom';
import { useForm, useFormState } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { yupResolver } from '@hookform/resolvers/yup';
import { useStoreSetup } from '@hooks/useStoreSetup';

import AuthService from '@services/AuthService/AuthService';

import { staticDataThunkActions } from '@store/static-data';
import { useAppDispatch } from '@store';
import TransparentLayer from '../../../assets/TransparentLayer.png';

import {
  initialRegisterValues,
  SignUpModel,
  signUpSchema,
} from '@schemas/auth/sign-up/sign-up';

import * as styles from './coach-registration.styles';

export const CoachRegistration: React.FC = () => {
  const appDispatch = useAppDispatch();
  const { resetAppStore, resetAuth } = useStoreSetup();

  const headerSlide: HeaderSlide = {
    status: ChipStatus.ComingSoon,
    title: 'Manage practitioners',
    text: 'View practitioner details, see classroom information and fill in important forms.',
    image: '../../../assets/banner-ss.jpg',
  };

  const [isLoading, setIsLoading] = useState(false);
  const [preferId, setPreferId] = useState<boolean>(true);
  const [requestError, setRequestError] = useState<string>();
  const [articleTitle, setArticleTitle] = useState<string>();
  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const { isOnline } = useOnlineStatus();
  const [presentCellNumberMismatch, setPresentCellNumberMismatch] =
    useState<boolean>(false);
  const [contentConsentTypeEnum, setContentConsentTypeEnum] =
    useState<ContentConsentTypeEnum>();
  const location = useLocation();
  const history = useHistory();
  const { theme } = useTheme();

  const queryParams = useQueryParams(location.search);
  const authToken = queryParams.getValue('token');

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

  const {
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
  const errorStrings = Object.keys(errors).map(
    (x) => errors[x as keyof SignUpModel]?.message || ''
  );

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
    await new AuthService().SendAuthCode(username, token);

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
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        className={styles.contentWrapper}
        size={'signup'}
        renderBorder={false}
        renderOverflow={false}
      >
        <HeaderCard className={'mt-4'} slide={headerSlide} />
        <SliderPagination totalItems={1} activeIndex={0} className={'p-4'} />
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
            sufficIconColor={'uiMidDark'}
            value={signUpFormGetValues().password}
            register={signUpRegister}
            strengthMeterVisible={true}
          />
          <ul className={styles.listStyles}>
            <li>
              <Typography
                text={'At least 8 characters'}
                type={'help'}
                color={'uiMidDark'}
              />
            </li>
            <li>
              <Typography
                text={'At least 1 number'}
                type={'help'}
                color={'uiMidDark'}
              />
            </li>
            <li>
              <Typography
                text={'At least 1 capital letter'}
                type={'help'}
                color={'uiMidDark'}
              />
            </li>
          </ul>

          <Divider />

          <Alert
            className={classNames(styles.marginBottom, styles.marginTop)}
            type={'info'}
            message={'You need to accept both agreements below to continue'}
          ></Alert>

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
              checkboxColor={'secondary'}
            ></Checkbox>
            <Typography text={'I accept the'} type="help" color={'black'} />
            &nbsp;
            <div
              onClick={() => {
                displayArticle(
                  ContentConsentTypeEnum.TermsAndConditions,
                  'Terms & Conditions'
                );
              }}
            >
              <Typography
                className={'cursor-pointer'}
                text={'terms and conditions'}
                type="help"
                underline={true}
                color={'primary'}
              />
            </div>
          </div>
          <div className={styles.checkboxWrapper}>
            <Checkbox<SignUpModel>
              register={signUpRegister}
              nameProp={'dataPermissionAgreementAccepted'}
              checkboxColor={'secondary'}
            ></Checkbox>
            <Typography text={'I accept the'} type="help" color={'black'} />
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
              color={'primary'}
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
          importantText={'SmartStart has a different cellphone number for you'}
          detailText={`Please check that this is the correct cellphone number: ${
            signUpFormGetValues().cellphone
          }. If you have entered the correct number and are still getting this error, please call our toll free number.`}
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
    </div>
  );
};
