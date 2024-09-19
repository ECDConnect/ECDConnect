import {
  Config,
  LocalStorageKeys,
  VerifyPrincipalInvitationModel,
  useTheme,
} from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  HeaderSlide,
  HeaderSlider,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useAppDispatch } from '@store';
import { staticDataThunkActions } from '@store/static-data';
import * as styles from './oa-sign-up-or-login.types';
import { UserService } from '@/services/UserService';
import { useTenant } from '@/hooks/useTenant';
import { OAAgreements } from './components/oa-agreements/oa-agreements';
import ROUTES from '@/routes/routes';
import Banner1 from '../../../assets/banner-ss2.svg';
import Banner3 from '../../../assets/banner2-ss-svg.svg';
import { AuthService } from '@/services/AuthService';
import TransparentLayer from '../../../assets/TransparentLayer.png';

const token = new URLSearchParams(window.location.search).get('token');

export const OASignUpOrLogin: React.FC = () => {
  const tenant = useTenant();
  const appDispatch = useAppDispatch();
  const [openOaAgreements, setOpenOaAgreements] = useState(false);

  const { resetAppStore, resetAuth } = useStoreSetup();
  const history = useHistory();
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
  const [userDetails, setUserDetails] = useState<any>();
  const isWhitelabel = tenant?.isWhiteLabel;
  const applicationName = tenant?.tenant?.applicationName;

  const headerSlide: HeaderSlide[] = [
    {
      title: 'Manage your classroom',
      text: 'Take attendance, track progress, and plan your activities',
      image: Banner1,
    },
    {
      title: 'Grow your community',
      text: 'Meet other practitioners in your area',
      image: Banner3,
    },
  ];

  useEffect(() => {
    async function init() {
      if (resetAppStore) {
        await resetAppStore(false);
        await resetAuth();
      }

      await appDispatch(staticDataThunkActions.getOpenLanguages({})).unwrap();
    }
    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserDetailsByToken = async () => {
    let user_details_from_request;
    if (token) {
      user_details_from_request = await new UserService('').getUserByToken(
        token
      );
      setUserDetails(user_details_from_request);
    } else {
      console.log('user not found');
    }
  };
  useEffect(() => {
    if (token) {
      getUserDetailsByToken();
    }
  }, []);

  const verifyInvitedPrincipalToken = async () => {
    const input: VerifyPrincipalInvitationModel = {
      token: token!,
    };
    if (token) {
      const principalToken = await new AuthService().VerifyPrincipalToken(
        Config.authApi,
        input
      );

      if (principalToken?.data) {
        localStorage.setItem(
          LocalStorageKeys.practitionerInvitedPrincipalIdNumber,
          JSON.stringify(principalToken.data?.idNumber)
        );
        localStorage.setItem(
          LocalStorageKeys.practitionerInvitedPrincipalUserId,
          JSON.stringify(principalToken.data?.addedByUserId)
        );
      }
    } else {
      console.log('user not found');
    }
  };

  useEffect(() => {
    if (token) {
      verifyInvitedPrincipalToken();
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <BannerWrapper
        color={'primary'}
        showBackground={isWhitelabel ? false : true}
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        className={styles.contentWrapper}
        size={'signup'}
        renderBorder={false}
        renderOverflow={false}
        onBack={() => history?.push(ROUTES.ROOT)}
      >
        <div>
          <HeaderSlider
            className="h-360 mx-4"
            slides={headerSlide}
            autoPlay
            infiniteLoop
            transitionTime={500}
          />
        </div>

        <div className={'mt-8 w-11/12 px-2 md:mt-48'}>
          <Button
            id="gtm-register"
            className={'mb-4 w-full'}
            type="filled"
            color="quatenary"
            disabled={!isOnline}
            onClick={() => setOpenOaAgreements(true)}
          >
            <Typography type="help" color="white" text={'Sign up'}></Typography>
          </Button>

          <Divider
            title={`Already have a ${applicationName} account?`}
            dividerType={'solid'}
            className="my-2"
          />

          <Button
            className={'mt-6 mb-12 w-full'}
            type="outlined"
            color="quatenary"
            disabled={!isOnline}
            onClick={() => history.push('./oa-login')}
          >
            <Typography
              type="help"
              color="quatenary"
              text={'Log in'}
            ></Typography>
          </Button>
        </div>
      </BannerWrapper>
      <Dialog
        visible={openOaAgreements}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <OAAgreements closeAction={setOpenOaAgreements} />
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
