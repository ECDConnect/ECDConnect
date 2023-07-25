import Loader from '@/components/loader/loader';
import { LoginRequestModel } from '@ecdlink/core';
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import AuthService from '@services/AuthService/AuthService';
import { useAppDispatch } from '@store';
import { authThunkActions } from '@store/auth';
import { settingActions } from '@store/settings';
import { VerifyPhoneNumberRouteState } from './verify-phone-number.types';
import { version } from '../../../../package.json';
import ROUTES from '@/routes/routes';

export const VerifyPhoneNumber = () => {
  const history = useHistory();

  const { state } = useLocation<VerifyPhoneNumberRouteState>();

  const appDispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [requestDone, setRequestDone] = useState<boolean>(false);

  const confirm = async () => {
    setIsLoading(true);
    setRequestDone(true);
    if (window.sessionStorage.getItem('verifyPhoneNumberToken') === state.token)
      return;
    window.sessionStorage.setItem('verifyPhoneNumberToken', state.token);

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
            isAuthenticated?.payload?.response?.status !== 401
          ) {
            await appDispatch(settingActions.setApplicationVersion(version));
            history.push(ROUTES.DASHBOARD, { isFromSignUp: true });
            setIsLoading(false);
          } else {
            setIsLoading(false);
            window.sessionStorage.setItem('verifyPhoneNumberToken', '');
          }
        })
        .catch(() => {
          setIsLoading(false);
          window.sessionStorage.setItem('verifyPhoneNumberToken', '');
        });
    }
  };

  useEffect(() => {
    if (!requestDone) confirm();
  }, []);

  return <Loader loadingMessage={isLoading ? 'Loading . . .' : ''} />;
};
