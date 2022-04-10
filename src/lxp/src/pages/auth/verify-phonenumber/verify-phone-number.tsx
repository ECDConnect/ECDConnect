import { LoginRequestModel, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  BannerWrapper,
  Button,
  classNames,
  DialogPosition,
  Divider,
  FormInput,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import {
  VerifyPhoneNumberModel,
  verifyPhoneNumberSchema,
} from '@schemas/auth/verify-phone-number/verify-phone-number';
import AuthService from '@services/AuthService/AuthService';
import { useAppDispatch } from '@store';
import { authThunkActions } from '@store/auth';
import { settingActions } from '@store/settings';
import * as styles from './verify-phone-number.styles';
import { VerifyPhoneNumberRouteState } from './verify-phone-number.types';
const { version } = require('../../../../package.json');

export const VerifyPhoneNumber = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { state } = useLocation<VerifyPhoneNumberRouteState>();
  const appDispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disableNewCodeSend, setDisableNewCodeSend] = useState<boolean>(false);

  const { register, formState, getValues } = useForm({
    resolver: yupResolver(verifyPhoneNumberSchema),
    mode: 'all',
  });

  const { isValid } = formState;

  const displayTollFreeDialog = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            icon="ExclamationCircleIcon"
            iconBorderColor="alertBg"
            iconColor="alertMain"
            importantText={`Is your phone number correct: <b>${state?.phoneNumber || '000'}</b>`}
            paragraphs={[
              'If your phone number is incorrect, please call our toll free number to change it.',
            ]}
            linkClick={callForHelp}
            actionButtons={[
              {
                text: `Call 0800 014 817`,
                textColour: 'primary',
                colour: 'primary',
                type: 'outlined',
                onClick: () => {
                  callForHelp();
                  onSubmit();
                },
                leadingIcon: 'PhoneIcon',
              },
              {
                text: `Close`,
                textColour: 'white',
                colour: 'primary',
                type: 'filled',
                onClick: onClose,
                leadingIcon: 'XCircleIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const sendNewCode = async () => {
    setIsLoading(true);
    await new AuthService().SendAuthCode(state.username, state.token);
    setIsLoading(false);
    setDisableNewCodeSend(true);
    setTimeout(() => {
      setDisableNewCodeSend(false);
    }, 60000);
  };

  const confirm = async (formValue: VerifyPhoneNumberModel) => {
    if (!formValue.code) return;
    setIsLoading(true);
    const accepted = await new AuthService().AcceptInvitationRequest({
      username: state.username,
      password: state.password,
      token: state.token,
      verificationCode: formValue.code,
    });
    setIsLoading(false);
    if (accepted) {
      const body: LoginRequestModel = {
        username: state.username,
        password: state.password,
      };

      appDispatch(authThunkActions.login(body))
        .then(async (isAuthenticated: any) => {
          if (isAuthenticated && isAuthenticated?.payload?.response?.status !== 401) {
            await appDispatch(settingActions.setApplicationVersion(version));
            history.push('/');
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  return (
    <>
      <BannerWrapper color="primary" size={'normal'} renderBorder={true}>
        <div className={styles.contentWrapper}>
          <Typography
            type="h1"
            color="primary"
            text={'Enter your 6 digit code'}
            className={'mb-4'}
          />
          <Alert
            type="info"
            message={`We've sent an SMS with a 6-digit code to ${state?.phoneNumber}`}
            className={'mb-4'}
          />
          <FormInput<VerifyPhoneNumberModel>
            type={'number'}
            register={register}
            nameProp={'code'}
            label={'6-digit code'}
            placeholder={'------'}
            className={classNames(styles.marginBottom, 'w-40')}
          />
          <Divider />
          {!isValid && (
            <Button
              type="outlined"
              color="primary"
              onClick={sendNewCode}
              isLoading={isLoading}
              className={styles.marginTop}
              disabled={disableNewCodeSend}
            >
              <Typography type={'small'} color="primary" text={'Send me a new code'} />
            </Button>
          )}
          {isValid && (
            <Button
              type="filled"
              color="primary"
              isLoading={isLoading}
              onClick={() => confirm(getValues())}
              className={styles.marginTop}
            >
              {renderIcon('CheckCircleIcon', styles.iconSize)}
              <Typography type={'small'} color="white" text={'Confirm'} />
            </Button>
          )}

          <div className={classNames(styles.helpWrapper, 'mt-6')}>
            {renderIcon('QuestionMarkCircleIcon', classNames(styles.iconSize, 'text-primary mr-2'))}
            <Typography
              className={styles.smallMarginLeft}
              type={'help'}
              color={'textLight'}
              text={`Didn't receive a code?`}
            />
            <Button
              type="outlined"
              color="primary"
              size={'small'}
              background={'transparent'}
              className={styles.smallMarginLeft}
              onClick={displayTollFreeDialog}
            >
              <Typography type={'small'} color="primary" text={'Get help'} />
            </Button>
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
