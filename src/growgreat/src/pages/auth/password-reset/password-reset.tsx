import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionModal,
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  Divider,
  FormInput,
  Typography,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as styles from './password-reset.styles';
import {
  initialResetPasswordValues,
  ResetPasswordModel,
  resetPasswordSchema,
} from '@schemas/auth/password/password-reset';
import AuthService from '@services/AuthService/AuthService';
import ROUTES from '@routes/routes';

export const PasswordReset: React.FC = () => {
  const [userPhoneNumberEnding, setUserPhoneNumberEnding] =
    useState<string>('XXXX');
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);
  const [idFieldVisible, setIdFieldVisible] = useState<boolean>(true);
  const [sendLinkButtonDisabled, setSendLinkButtonDisabled] =
    useState<boolean>(true);
  const [resendLinkButtonDisabled, setResendLinkButtonDisabled] =
    useState<boolean>(false);
  const [displayCallHelp, setDisplayCallHelp] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const {
    register: resetPasswordRegister,
    setValue: resetPasswordSetValue,
    formState: resetPasswordFormState,
    getValues: resetPasswordFormGetValues,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: initialResetPasswordValues,
    mode: 'onChange',
  });

  const { isValid } = resetPasswordFormState;

  const submitForm = async (formValues: ResetPasswordModel) => {
    setHasSubmitted(true);
    if (isValid) {
      setIsLoading(true);
      setSendLinkButtonDisabled(true);

      const requestSentResponse =
        await new AuthService().SendForgotPasswordRequest({
          username: formValues.username,
        });
      if (requestSentResponse.valid) {
        setUserPhoneNumberEnding(
          requestSentResponse.phoneNumber
            ? requestSentResponse.phoneNumber.substring(
                requestSentResponse.phoneNumber.length - 4,
                requestSentResponse.phoneNumber.length
              )
            : 'XXXX'
        );
        setDisplaySuccess(true);
        setIsLoading(false);
        setResendLinkButtonDisabled(true);
        timeoutResendLinkButton();
      } else {
        setDisplayError(true);
        setIsLoading(false);
        setSendLinkButtonDisabled(false);
      }
    }
  };

  const timeoutResendLinkButton = () => {
    setTimeout(() => {
      setResendLinkButtonDisabled(false);
    }, 3000);
  };

  const resendLink = async (formValues: ResetPasswordModel) => {
    setIsLoading(true);
    setResendLinkButtonDisabled(true);

    const requestSentResponse =
      await new AuthService().SendForgotPasswordRequest({
        username: formValues.username,
      });
    if (requestSentResponse.valid) {
      setUserPhoneNumberEnding(
        requestSentResponse.phoneNumber
          ? requestSentResponse.phoneNumber.substring(
              requestSentResponse.phoneNumber.length - 4,
              requestSentResponse.phoneNumber.length
            )
          : 'XXXX'
      );
      setDisplaySuccess(true);
      setIsLoading(false);
      timeoutResendLinkButton();
    } else {
      setIsLoading(false);
      setResendLinkButtonDisabled(false);
    }
  };

  useEffect(() => {
    if (!hasSubmitted) {
      setSendLinkButtonDisabled(!isValid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  const goBack = () => {
    history.push(ROUTES.LOGIN);
  };

  const toggleIdAndpassport = (visible: boolean) => {
    const flag = !visible;
    resetPasswordSetValue('username', '');
    resetPasswordSetValue('preferId', flag);
    setIdFieldVisible(flag);
  };

  return (
    <div className={styles.container}>
      <BannerWrapper
        color="primary"
        size="normal"
        renderBorder={true}
        onBack={goBack}
      >
        <div className={'p-4'}>
          {!displaySuccess && (
            <div>
              <Typography
                type="body"
                color="textMid"
                text={
                  'Fill in your ID number and we will send you a link to reset your password'
                }
              ></Typography>
              <div className={'mt-4'}>
                <form>
                  <div>
                    {idFieldVisible && (
                      <FormInput<ResetPasswordModel>
                        label={'ID number'}
                        visible={true}
                        nameProp={'username'}
                        register={resetPasswordRegister}
                        placeholder={'E.g. 7601010338089'}
                      />
                    )}
                    {!idFieldVisible && (
                      <FormInput<ResetPasswordModel>
                        label={'Passport number'}
                        visible={true}
                        nameProp={'username'}
                        register={resetPasswordRegister}
                      />
                    )}
                    {!idFieldVisible && (
                      <Button
                        className={styles.buttonSpace}
                        type="outlined"
                        color="primary"
                        background="transparent"
                        size="small"
                        onClick={() => toggleIdAndpassport(idFieldVisible)}
                      >
                        <Typography
                          type="small"
                          color="primary"
                          text={'Enter ID number instead'}
                        ></Typography>
                      </Button>
                    )}
                    {idFieldVisible && (
                      <Button
                        className={styles.buttonSpace}
                        type="outlined"
                        color="primary"
                        background="transparent"
                        size="small"
                        onClick={() => toggleIdAndpassport(idFieldVisible)}
                      >
                        <Typography
                          type="small"
                          color="primary"
                          text={'Enter passport number instead'}
                        ></Typography>
                      </Button>
                    )}
                    <Divider className={'mt-3 mb-3'}></Divider>
                  </div>
                  {displayError && (
                    <Alert
                      className={styles.errorDisplay}
                      title={'ID or Passport number not recognised'}
                      type={'error'}
                    />
                  )}
                  <Button
                    className={styles.submitButton}
                    type="filled"
                    isLoading={isLoading}
                    color="primary"
                    disabled={sendLinkButtonDisabled}
                    onClick={() => submitForm(resetPasswordFormGetValues())}
                  >
                    <Typography
                      type="help"
                      color="white"
                      text={'Send link'}
                    ></Typography>
                  </Button>
                </form>
              </div>
            </div>
          )}
          {displaySuccess && (
            <div>
              <Alert
                className={styles.bigSpace}
                title={`SMS sent to cellphone number ending in ${userPhoneNumberEnding}`}
                message={
                  'Please check your messages and click the reset passwork link.'
                }
                type={'success'}
              />
              <Divider className={'mt-4 mb-5'}></Divider>
              <div>
                <Button
                  className={styles.submitButton}
                  type="filled"
                  isLoading={isLoading}
                  color="primary"
                  disabled={resendLinkButtonDisabled}
                  onClick={() => resendLink(resetPasswordFormGetValues())}
                >
                  <Typography
                    type="help"
                    color="white"
                    text={'Resend link'}
                  ></Typography>
                </Button>
                <Button
                  className={styles.goBackButton}
                  type="outlined"
                  color="primary"
                  onClick={goBack}
                >
                  {renderIcon('ArrowCircleLeftIcon', styles.buttonIcon)}
                  <Typography
                    type="help"
                    color="primary"
                    text={'Back to log in'}
                  ></Typography>
                </Button>
              </div>
            </div>
          )}
          <div className={styles.getHelpContainer}>
            {renderIcon('QuestionMarkCircleIcon', styles.buttonIcon)}
            <Typography
              type="unspecified"
              fontSize="14"
              className="mr-2"
              color="textLight"
              text={'Not able to click the link?'}
            ></Typography>
            <Button
              type="filled"
              color="secondaryAccent2"
              background="transparent"
              size="small"
              onClick={() => setDisplayCallHelp(true)}
            >
              <Typography
                type="help"
                color="secondary"
                text={'Get help'}
              ></Typography>
            </Button>
          </div>
        </div>
      </BannerWrapper>

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
          importantText="Please call our helpline"
          linkText="087 148 5229"
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
  );
};

export default PasswordReset;
