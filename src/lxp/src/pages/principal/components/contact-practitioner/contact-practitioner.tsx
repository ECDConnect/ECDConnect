import { useHistory, useLocation } from 'react-router';
import {
  renderIcon,
  BannerWrapper,
  Button,
  Typography,
  Alert,
  DialogPosition,
} from '@ecdlink/ui';
import { PractitionerDto } from '@ecdlink/core';
import { PhoneIcon } from '@heroicons/react/solid';
import { PractitionerProfileRouteState } from './contact-practitioner.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './contact-practitioner.styles';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { useCallback, useEffect, useState } from 'react';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useDialog } from '@ecdlink/core';
import { IconInformationIndicator } from '../../../classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';

export const ContactPractitioner: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const location = useLocation<PractitionerProfileRouteState>();
  const currentPractitioner = useSelector(
    practitionerSelectors.getPractitioner
  );
  const practitionerId = location.state.practitionerId;
  const dialog = useDialog();
  const [practitioner, setPractitioner] = useState<PractitionerDto>();

  const getPractitionerDetails = async () => {
    if (userAuth && practitionerId) {
      setPractitioner(
        await new PractitionerService(
          userAuth?.auth_token ?? ''
        ).getPractitionerByUserId(practitionerId)
      );
    }
  };

  useEffect(() => {
    if (currentPractitioner?.isPrincipal !== true) {
      getPractitionerDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showOnlineOnly = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <OnlineOnlyModal
            overrideText={'You need to go online to use this feature.'}
            onSubmit={onSubmit}
          ></OnlineOnlyModal>
        );
      },
    });
  }, [dialog]);

  useEffect(() => {
    if (!isOnline) {
      showOnlineOnly();
    }
  }, [isOnline, showOnlineOnly]);

  const call = () => {
    window.open(`tel:${practitioner?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(
        practitioner?.user?.phoneNumber ?? ''
      )}`
    );
  };

  if (!practitioner) {
    return (
      <div className={'h-full flex-1 bg-white px-4 pt-4'}>
        <IconInformationIndicator
          title="Practitioner not found"
          subTitle="Please contact the SmartStart call centre to find out more: 0800 014 817."
        />
      </div>
    );
  }

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={`Contact Practitioner`}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() => history.push(ROUTES.DASHBOARD)}
        displayOffline={!isOnline}
      ></BannerWrapper>
      <div>
        <div>
          <div>
            <Typography
              text={`Contact ${practitioner?.user?.firstName}`}
              type="h3"
              color="textDark"
              className={'m-4'}
            />
          </div>
          <div>
            <Typography
              text={`${practitioner?.user?.phoneNumber || ''}`}
              type="h2"
              weight="skinny"
              color="primary"
              className={'ml-4 mt-2'}
            />
          </div>
        </div>
        <div>
          <div className={styles.contactButtons}>
            <div className="ml-4 grid grid-cols-2 justify-items-center">
              <Button
                color={'primary'}
                type={'outlined'}
                className={'mr-4 rounded-xl'}
                size={'normal'}
                onClick={whatsapp}
              >
                <div className="flex items-center justify-center">
                  <img
                    src={getLogo(LogoSvgs.whatsapp)}
                    alt="whatsapp"
                    className={styles.buttonIconStyle}
                  />
                  <Typography
                    text={`Whatsapp ${practitioner?.user?.firstName}`}
                    type="button"
                    weight="skinny"
                    color="primary"
                  />
                </div>
              </Button>
              <Button
                color={'primary'}
                type={'outlined'}
                className={'mr-4 rounded-xl'}
                size={'small'}
                onClick={call}
              >
                <div className="flex items-center justify-center">
                  <PhoneIcon
                    className="text-primary mr-2 h-6 w-5"
                    aria-hidden="true"
                  />
                  <Typography
                    text={`Call ${practitioner?.user?.firstName}`}
                    type="button"
                    weight="skinny"
                    color="primary"
                  />
                </div>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-11/12 rounded-2xl">
              <Alert
                type="info"
                className="mt-4"
                message="WhatsApps and phone calls will be charged at your standard carrier rates."
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 w-full">
          <div className="flex w-full justify-center">
            <div className="w-11/12">
              <Button
                className={styles.button.replace('mt-4', 'mt-3')}
                color={'primary'}
                type="filled"
                onClick={() => history.goBack()}
              >
                {renderIcon('XIcon', styles.buttonIcon)}
                <Typography
                  type="button"
                  text="Close"
                  color="white"
                  className="w/11-12 ml-2"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
