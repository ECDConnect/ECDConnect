import Loader from '../../../components/loader/loader';
import { LoginRequestModel, useDialog } from '@ecdlink/core';
import { ActionModal, DialogPosition } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { verifyPhoneNumberSchema } from '@schemas/auth/verify-phone-number/verify-phone-number';
import AuthService from '@services/AuthService/AuthService';
import { useAppDispatch } from '@store';
import { authThunkActions } from '@store/auth';
import { settingActions } from '@store/settings';
import { VerifyPhoneNumberRouteState } from './verify-phone-number.types';
const { version } = require('../../../../package.json');

export const VerifyPhoneNumber = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { state } = useLocation<VerifyPhoneNumberRouteState>();
  const appDispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [disableNewCodeSend, setDisableNewCodeSend] = useState<boolean>(false);

  // eslint-disable-next-line no-empty-pattern
  const {} = useForm({
    resolver: yupResolver(verifyPhoneNumberSchema),
    mode: 'all',
  });

  useEffect(() => {
    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayTollFreeDialog = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            icon="ExclamationCircleIcon"
            iconBorderColor="alertBg"
            iconColor="alertMain"
            importantText={`Is your phone number correct: <b>${
              state?.phoneNumber || '000'
            }</b>`}
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

  const confirm = async () => {
    setIsLoading(true);
    const accepted = await new AuthService().AcceptInvitationRequest({
      username: state.username,
      password: state.password,
      token: state.token,
    });

    setIsLoading(false);
    if (accepted) {
      const body: LoginRequestModel = {
        username: state.username,
        password: state.password,
      };

      appDispatch(authThunkActions.login(body))
        .then(async (isAuthenticated: any) => {
          if (
            isAuthenticated &&
            isAuthenticated?.error === undefined &&
            isAuthenticated?.payload?.response?.status !== 401
          ) {
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
      <Loader loadingMessage={'Loading . . .'} />
    </>
  );
};
