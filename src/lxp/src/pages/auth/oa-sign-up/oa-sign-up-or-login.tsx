import {
  Config,
  LocalStorageKeys,
  VerifyPrincipalInvitationModel,
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
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useAppDispatch } from '@store';
import { staticDataThunkActions } from '@store/static-data';
import * as styles from './oa-sign-up-or-login.types';
import { useTenant } from '@/hooks/useTenant';
import { OAAgreements } from './components/oa-agreements/oa-agreements';
import Banner1 from '../../../assets/banner1-ss.jpg';
import Banner3 from '../../../assets/banner3-ss.jpg';
import { AuthService } from '@/services/AuthService';
import TransparentLayer from '../../../assets/TransparentLayer.png';
import ROUTES from '@/routes/routes';

const token = new URLSearchParams(window.location.search).get('token');

interface OASignUpOrLoginRouteState {
  signup?: boolean;
}

export const OASignUpOrLogin: React.FC = () => {
  const tenant = useTenant();
  const appDispatch = useAppDispatch();
  const { resetAppStore, resetAuth, resetUser } = useStoreSetup();
  const history = useHistory();
  const { state } = useLocation<OASignUpOrLoginRouteState>();
  const { isOnline } = useOnlineStatus();
  const isWhitelabel = tenant?.isWhiteLabel;
  const applicationName = tenant?.tenant?.applicationName;
  const [openOaAgreements, setOpenOaAgreements] = useState(
    state?.signup === true
  );

  const headerSlide: HeaderSlide[] = [
    {
      title: 'Manage your classroom',
      text: 'Take attendance, track progress, and plan your activities',
      image: Banner1,
      overlayText:
        "Children at Nquba Preschool take part in an activity at a Nali'ibali Story Sparker reading club in Amajingqi, Eastern Cape.  Photo take by Bart Love on 20 May 2018.",
    },
    {
      title: 'Grow your community',
      text: 'Meet other practitioners in your area',
      image: Banner3,
      overlayText:
        'Nthabi Mofokeng leads a SmartStart training session in Duncan village, Eastern Cape. Photography taken by Bart Love on 15 May 2018.',
    },
  ];

  useEffect(() => {
    async function init() {
      if (resetAppStore) {
        await resetAppStore(false);
        await resetAuth();
        await resetUser();
      }

      await appDispatch(staticDataThunkActions.getOpenLanguages({})).unwrap();
    }
    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyInvitedPrincipalToken = async () => {
    const input: VerifyPrincipalInvitationModel = {
      token: token as any as string,
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
        showBackground={!isWhitelabel}
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        className={styles.contentWrapper}
        size={'signup'}
        renderBorder={false}
        renderOverflow={false}
        // onBack={() => history?.push(ROUTES.ROOT)}
      >
        <div>
          <HeaderSlider
            className="h-360px w-full overflow-hidden"
            slides={headerSlide}
            autoPlay
            infiniteLoop
            transitionTime={500}
          />
        </div>

        <div className={'mt-2 w-11/12 px-2'}>
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
            onClick={() => history.push(ROUTES.LOGIN)}
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
