import { useHistory, useLocation } from 'react-router';
import {
  renderIcon,
  BannerWrapper,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { useDialog, useSnackbar } from '@ecdlink/core';
import { useState } from 'react';
import { PhoneIcon } from '@heroicons/react/solid';
import { PractitionerProfileRouteState } from './coach-contact-practitioner.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './coach-contact-practitioner.styles';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';
import { RemovePractioner } from '../components/remove-practitioner/remove-practitioner';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';

export const CoachContactPractitioner: React.FC = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { showMessage } = useSnackbar();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location?.state?.practitionerId;
  const removePractitioner = location?.state?.removePractitioner;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const coachClassrooms = useSelector(
    classroomsForCoachSelectors.getClassroomForCoach
  );
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );
  const principal = practitioners?.find(
    (prac) => prac?.userId === practitioner?.principalHierarchy
  );
  const practitionerClassroom = coachClassrooms?.find(
    (item) => item.userId === principal?.userId
  );
  const [removePractionerReasonsVisible, setRemovePractionerReasonsVisible] =
    useState<boolean>(false);

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

  const showOnlineOnly = () => {
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
  };

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={`Contact practitioner`}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() =>
          history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
            practitionerId: practitionerId,
          })
        }
        displayOffline={!isOnline}
      ></BannerWrapper>
      <div>
        <div>
          {removePractitioner && (
            <>
              <div>
                <Typography
                  text={`Removed from ${
                    practitionerClassroom?.name || `their programme`
                  }.`}
                  type="h1"
                  color="textDark"
                  className={'m-4'}
                />
              </div>
              <div>
                <Typography
                  text={`${
                    principal?.user?.firstName || `The principal`
                  } has removed ${practitioner?.user?.firstName} from ${
                    practitionerClassroom?.name || `their programme`
                  }.`}
                  type="h2"
                  color="textDark"
                  className={'m-4'}
                />
              </div>
              <div>
                <Typography
                  text={`Contact ${
                    principal?.user?.firstName || `the principal`
                  } & ${practitioner?.user?.firstName} to find out more. If ${
                    practitioner?.user?.firstName
                  } is leaving SmartStart, please remove them.`}
                  type="h4"
                  weight="skinny"
                  color={'textMid'}
                  className={'ml-4 mt-2'}
                />
                <Typography
                  text={`If ${practitioner?.user?.firstName} has moved to a different programme, please help them to complete their profile on Funda App and add new programme information.`}
                  type="h4"
                  weight="skinny"
                  color={'textMid'}
                  className={'ml-4 mt-2'}
                />
              </div>
            </>
          )}
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
              text={`${
                practitioner?.user?.phoneNumber || `Number not available`
              }`}
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
                onClick={() => {
                  if (removePractitioner) {
                    if (isOnline) {
                      setRemovePractionerReasonsVisible(true);
                    } else {
                      showOnlineOnly();
                    }
                  } else {
                    history.goBack();
                  }
                }}
              >
                {removePractitioner
                  ? renderIcon('TrashIcon', styles.buttonIcon)
                  : renderIcon('XIcon', styles.buttonIcon)}
                <Typography
                  type="button"
                  text={removePractitioner ? 'Remove SmartStarter' : 'Close'}
                  color="white"
                  className="w/11-12 ml-2"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        fullScreen
        visible={removePractionerReasonsVisible}
        position={DialogPosition.Middle}
      >
        <div className={styles.dialogContent}>
          <RemovePractioner
            onSuccess={() =>
              showMessage({
                message: `${practitioner?.user?.firstName} removed`,
              })
            }
          />
        </div>
      </Dialog>
    </div>
  );
};
