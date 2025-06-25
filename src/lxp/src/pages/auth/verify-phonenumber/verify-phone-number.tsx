import Loader from '../../../components/loader/loader';
import { LoginRequestModel } from '@ecdlink/core';
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
  const { state } = useLocation<VerifyPhoneNumberRouteState>();
  const appDispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line no-empty-pattern
  const {} = useForm({
    resolver: yupResolver(verifyPhoneNumberSchema),
    mode: 'all',
  });

  useEffect(() => {
    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            appDispatch(settingActions.setLoginDate());
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

  return (
    <>
      <Loader loadingMessage={'Loading . . .'} />
    </>
  );
};
