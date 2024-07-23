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
import { useTenant } from '@/hooks/useTenant';

export const CoachContactPractitioner: React.FC = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { showMessage } = useSnackbar();
  const { isOnline } = useOnlineStatus();
  const tenant = useTenant();
  const orgName = tenant?.tenant?.organisationName;

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
  // THIS PROBABLY NEEDS AN UPDATE
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
                    practitionerClassroom?.name || `their preschool`
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
                    practitionerClassroom?.name || `their preschool`
                  }.`}
                  type="h2"
                  color="textDark"
                  className={'m-4'}
                />
              </div>
              <div>
                <Typography
                  text={`Contact ${practitioner?.user?.firstName} to find out more. If ${practitioner?.user?.firstName} is leaving ${orgName}, please remove them.`}
                  type="h4"
                  weight="skinny"
                  color={'textMid'}
                  className={'ml-4 mt-2'}
                />
              </div>
            </>
          )}
          <div className="flex-column mx-auto mt-2 w-11/12 items-center">
            <div className="mt-10">
              <Typography
                type="h2"
                weight="bold"
                lineHeight="snug"
                text={`Contact ${practitioner?.user?.firstName}`}
              />
              <Typography
                type="h5"
                weight="bold"
                lineHeight="snug"
                color="quatenary"
                text={`${
                  practitioner?.user?.phoneNumber == null
                    ? 'Number not available'
                    : practitioner?.user?.phoneNumber
                }`}
              />
              <Button
                color={'secondary'}
                type={'outlined'}
                className={'mr-4 mt-2'}
                size={'small'}
                onClick={whatsapp}
              >
                <img
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="whatsapp"
                  className="text-secondary mr-1 h-5 w-5"
                />
                <Typography
                  color={'secondary'}
                  type={'small'}
                  weight="bold"
                  text={`WhatsApp ${practitioner?.user?.firstName}`}
                />
              </Button>
              <Button
                text={`Call ${practitioner?.user?.firstName}`}
                icon="PhoneIcon"
                type="outlined"
                size="small"
                color="secondary"
                textColor="secondary"
                iconPosition="start"
                onClick={call}
                className="mt-2"
              />
            </div>
            <div>
              <Alert
                type={'info'}
                className="items-left justify-left mt-4 flex"
                title={`WhatsApp and phone calls will be charged at your standard carrier rates.`}
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 w-full">
          <div className="flex w-full justify-center">
            <div className="w-11/12">
              <Button
                className={styles.button.replace('mt-4', 'mt-3')}
                color={'quatenary'}
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
                  text={removePractitioner ? 'Remove Practitioner' : 'Close'}
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
