import { Button, Typography } from '@ecdlink/ui';
import logo from '../../../../assets/Logo-ECDConnect.svg';
import thumbs_up from '../../../../assets/icon_thumbsup.svg';
import {
  VerifyCellphoneNumber,
  VerifyCellphoneNumberModelInput,
} from '@ecdlink/graphql';
import { useMutation } from '@apollo/client';
import ROUTES from '../../../routes/app.routes-constants';
import { useCallback, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

interface RouteParams {
  username: string;
  token: string;
}

export default function VerifyPhoneNumber(
  props: RouteComponentProps<RouteParams>
) {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');
  const token = urlParams.get('token');

  const [verifyCellphoneNumber] = useMutation(VerifyCellphoneNumber);

  const verfyPhone = useCallback(() => {
    const inputModel: VerifyCellphoneNumberModelInput = {
      token,
      username,
    };
    verifyCellphoneNumber({
      variables: {
        input: inputModel,
      },
    });
  }, [token, username, verifyCellphoneNumber]);

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
        <div className="mt-4 w-full">
          <Button
            className={'mt-3 w-full rounded-xl'}
            type="outlined"
            color="secondary"
            onClick={() => ROUTES.ROOT_TEAM_LEAD}
            icon="ArrowCircleRightIcon"
            textColor="secondary"
          >
            <Typography
              type="help"
              color="secondary"
              text={'Go to login'}
            ></Typography>
          </Button>
        </div>
      </div>
    </div>
  );
}
