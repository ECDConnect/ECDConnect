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
import { useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as styles from './password-reset.styles';
import {
  initialResetPasswordValues,
  ResetPasswordModel,
  resetPasswordSchema,
} from '@schemas/auth/password/password-reset';
import AuthService from '@services/AuthService/AuthService';
import ROUTES from '@routes/routes';
import { HelpForm } from '@/components/help-form/help-form';

export const PasswordReset: React.FC = () => {
  const [userPhoneNumberEnding, setUserPhoneNumberEnding] =
    useState<string>('XXXX');
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);
  const [sendLinkButtonDisabled, setSendLinkButtonDisabled] =
    useState<boolean>(true);
  const [resendLinkButtonDisabled, setResendLinkButtonDisabled] =
    useState<boolean>(false);
  const [displayCallHelp, setDisplayCallHelp] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [openHelp, setOpenHelp] = useState(false);

  const {
    register: resetPasswordRegister,
    formState: resetPasswordFormState,
    getValues: resetPasswordFormGetValues,
    control,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: initialResetPasswordValues,
    mode: 'onChange',
  });
  const { phoneNumber } = useWatch({
    control: control,
  });
  const { isValid, errors } = resetPasswordFormState;

  const submitForm = async (formValues: ResetPasswordModel) => {
    setHasSubmitted(true);
    if (true) {
      setIsLoading(true);
      setSendLinkButtonDisabled(true);

      const requestSentResponse =
        await new AuthService().SendForgotPasswordRequest({
          phoneNumber: phoneNumber,
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
        phoneNumber: formValues.phoneNumber,
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

  return (
    <div className={styles.container}>
      <BannerWrapper
        color="primary"
        size="normal"
        renderBorder={true}
        onBack={goBack}
      >
        <div className={styles.pResetContainer}>
          {!displaySuccess && (
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`Enter your cellphone number. If we find an account linked to this cellphone, we'll send an SMS with a password reset link.`}
              ></Typography>
              <div className={'mt-4'}>
                <form>
                  <FormInput<ResetPasswordModel>
                    label={'Cellphone number'}
                    visible={true}
                    nameProp={'phoneNumber'}
                    placeholder="e.g. 0601234567"
                    register={resetPasswordRegister}
                    className="my-4"
                    error={errors?.phoneNumber}
                  />
                  {displayError && (
                    <Alert
                      className={styles.errorDisplay}
                      title={'Cellphone number not recognised'}
                      type={'error'}
                    />
                  )}
                  <Button
                    className={styles.submitButton}
                    type="filled"
                    isLoading={isLoading}
                    color="quatenary"
                    disabled={sendLinkButtonDisabled || !isValid}
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
                title={`If an account with this number exists, we will send an SMS to your cellphone number.`}
                list={[
                  'Please check your messages and click the passwork reset link.',
                  `If you haven't received a message, you can try resending the link.`,
                ]}
                type={'success'}
              />
              <Divider className={'mt-4 mb-5'}></Divider>
              <div>
                <Button
                  className={styles.submitButton}
                  type="filled"
                  isLoading={isLoading}
                  color="quatenary"
                  disabled={resendLinkButtonDisabled || !isValid}
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
                  color="quatenary"
                  onClick={goBack}
                >
                  {renderIcon('ArrowCircleLeftIcon', styles.buttonIcon)}
                  <Typography
                    type="help"
                    color="quatenary"
                    text={'Back to log in'}
                  ></Typography>
                </Button>
              </div>
              <div className={styles.getHelpContainer}>
                {renderIcon('QuestionMarkCircleIcon', styles.buttonIcon)}
                <Typography
                  type="unspecified"
                  fontSize="14"
                  className="mr-2"
                  color="textDark"
                  text={'Not able to click the link?'}
                ></Typography>
                <Button
                  type="filled"
                  color="secondaryAccent2"
                  background="transparent"
                  size="small"
                  onClick={() => setOpenHelp(true)}
                >
                  <Typography
                    type="help"
                    color="secondary"
                    text={'Get help'}
                  ></Typography>
                </Button>
              </div>
            </div>
          )}
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
          importantText={'Please call our toll free number'}
          linkText={'0800 014 817'}
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
      <Dialog
        visible={openHelp}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <HelpForm closeAction={setOpenHelp} />
      </Dialog>
    </div>
  );
};

export default PasswordReset;
