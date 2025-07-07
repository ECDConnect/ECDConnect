import { Typography } from '@ecdlink/ui';
import logo from '../../../../assets/Logo-ECDConnect.svg';
import thumbs_up from '../../../../assets/icon_thumbsup.svg';
import { useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  AuthCodeModel,
  Config,
  NOTIFICATION,
  useNotifications,
} from '@ecdlink/core';
import { VerifyCellPhoneNumber } from '../../../services/auth.service';

interface RouteParams {
  username: string;
  token: string;
}

export default function VerifyPhoneNumber(
  props: RouteComponentProps<RouteParams>
) {
  const { setNotification } = useNotifications();
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');
  const token = urlParams.get('token');

  const verfyPhone = useCallback(async () => {
    const body: AuthCodeModel = {
      username,
      token,
    };
    const isLinkSent = await VerifyCellPhoneNumber(Config.authApi, body);

    if (isLinkSent) {
      setNotification({
        title: 'Successfully Updated  Phone Number!',
        variant: NOTIFICATION.SUCCESS,
      });
    }
  }, []);

  useEffect(() => {
    if (token && username) {
      verfyPhone();
    }
  }, [token, username, verfyPhone]);

  return (
    <div className="darkBackground flex min-h-screen items-center justify-center">
      <div className="m-8 flex w-4/12 flex-col items-center justify-center rounded-xl bg-white p-8 shadow">
        <div className="justify-left flex w-full">
          <img className="h-100 mb-2" src={logo} alt="Login Logo" />
        </div>
        <div className="mt-2 flex flex-col justify-center gap-4">
          <Typography
            type="h3"
            color="textDark"
            text={'Cellphone number updated'}
            align="center"
          />
          <img className="h-32" src={thumbs_up} alt="thumbs up" />
          <Typography
            type="body"
            color="textDark"
            text={'Your new cellphone number has been verified!'}
            align="center"
          />
        </div>
        {/* <div className="mt-4 w-full">
          <Button
            className={'mt-3 w-full rounded-xl'}
            type="outlined"
            color="secondary"
            onClick={() => history.push(ROUTES.ROOT_TEAM_LEAD)}
            icon="ArrowCircleRightIcon"
            textColor="secondary"
          >
            <Typography
              type="help"
              color="secondary"
              text={'Go to login'}
            ></Typography>
          </Button>
        </div> */}
      </div>
    </div>
  );
}
