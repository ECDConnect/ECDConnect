import { useHistory } from 'react-router';
import {
  Alert,
  BannerWrapper,
  Button,
  Typography,
  DialogPosition,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './contact-practitioner.styles';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { useCallback, useEffect, useState } from 'react';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useDialog } from '@ecdlink/core';
import { NotificationDisplay } from '@ecdlink/graphql';
import ROUTES from '@/routes/routes';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';

interface ContactPractitionerProps {
  setShowAttendanceRegisters: any;
  setShowAttendanceRate: any;
  practitionerId: string;
  notification: NotificationDisplay | undefined;
}

export const ContactPractitioner: React.FC<ContactPractitionerProps> = ({
  setShowAttendanceRegisters,
  practitionerId,
  setShowAttendanceRate,
  notification,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerId)
  );

  const isRegisters = notification?.subject?.includes('registers not saved');

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

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={
          isRegisters ? 'Missing attendance registers' : 'Low attendance rate'
        }
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() => {
          setShowAttendanceRegisters(false);
          setShowAttendanceRate(false);
        }}
        displayOffline={!isOnline}
      >
        <div>
          <div>
            <Typography
              text={notification?.subject || ''}
              type="h3"
              color="textDark"
              className={'m-4'}
            />
            <Typography
              text={notification?.message || ''}
              type={'body'}
              color="textMid"
              className={'m-4'}
            />
          </div>
          <div className="mt-4 flex justify-center">
            {isRegisters ? (
              <div className="w-11/12">
                <div>
                  <Typography
                    className="mt-4"
                    color="textDark"
                    text={`Remind ${practitioner?.user?.firstName} to take and submit attendance every day.`}
                    type={'h2'}
                  />
                </div>
                <div>
                  <Typography
                    className="mt-2"
                    color="textMid"
                    text={`Attendance is valuable for reporting and speaking to caregivers`}
                    type={'body'}
                  />
                </div>
              </div>
            ) : (
              <div className="w-11/12">
                <div>
                  <Typography
                    className="mt-4"
                    color="textDark"
                    text={`How to help ${practitioner?.user?.firstName}`}
                    type={'h2'}
                  />
                </div>
                <div>
                  <Typography
                    className="mt-2"
                    color="textMid"
                    text={`Remind ${practitioner?.user?.firstName} to remove any children no longer attending.`}
                    type={'body'}
                  />
                </div>
                <div>
                  <Typography
                    className="mt-2"
                    color="textMid"
                    text={`If children are often absent, ${practitioner?.user?.firstName} should contact their caregivers to find out why they are missing days.`}
                    type={'body'}
                  />
                </div>
              </div>
            )}
          </div>
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
            <Button
              shape="normal"
              color="quatenary"
              type="filled"
              icon="CheckCircleIcon"
              onClick={() =>
                history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
                  practitionerId: practitionerId,
                })
              }
              className="mt-6 w-full rounded-2xl"
            >
              <Typography
                type="help"
                color="white"
                text={`I have contacted ${practitioner?.user?.firstName}`}
              />
            </Button>
          </div>
        </div>
      </BannerWrapper>
    </div>
  );
};
