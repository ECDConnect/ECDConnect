import { useHistory } from 'react-router-dom';
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
import { useEffect } from 'react';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useDialog } from '@ecdlink/core';
import { NotificationDisplay } from '@ecdlink/graphql';
import ROUTES from '@/routes/routes';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { HighlightedCount } from '@/components/highlighted-count/highlighted-count';
import { coachThunkActions } from '@store/coach';
import { useAppDispatch } from '@store';

interface ContactPractitionerProps {
  practitionerId: string;
  notification: NotificationDisplay | null;
  onClose: () => void;
}

export const ContactPractitioner: React.FC<ContactPractitionerProps> = ({
  practitionerId,
  notification,
  onClose,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const appDispatch = useAppDispatch();

  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerId)
  );
  const name = practitioner?.user?.firstName || 'the practitioner';
  const phone = practitioner?.user?.phoneNumber;

  const subject = notification?.subject || '';
  const isRegisters = subject.includes('registers not saved');
  const isProgress = subject.includes('progress');
  const isAttendanceRate =
    subject.includes('attendance rate') || (!isRegisters && !isProgress);

  useEffect(() => {
    if (!isOnline) {
      dialog({
        position: DialogPosition.Middle,
        render: (submit) => (
          <OnlineOnlyModal
            overrideText="You need to go online to contact the practitioner."
            onSubmit={submit}
          />
        ),
      });
    }
  }, [isOnline, dialog]);

  const call = () => phone && window.open(`tel:${phone}`);
  const whatsapp = () =>
    phone &&
    window.open(`https://wa.me/${formatPhonenumberInternational(phone)}`);

  const handleDone = () => {
    onClose();
    appDispatch(
      coachThunkActions.saveCoachContact({
        practitionerId,
        actionItemType: isRegisters ? 1 : isProgress ? 2 : 0,
        period: new Date(),
      })
    );
    history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
      practitionerId: practitionerId,
    });
  };

  const parseNotificationMessage = (
    message: string
  ): { count: string; text: string } => {
    if (!message) return { count: '', text: '' };

    // Match the leading number (supports 1–3 digits + optional spaces)
    const match = message.match(/^(\d+)\s*(.*)$/);
    if (match) {
      return { count: match[1], text: match[2] };
    }

    return { count: '', text: message };
  };

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={
          isRegisters
            ? 'Missing attendance registers'
            : isProgress
            ? 'Missed progress reports'
            : 'Low attendance rate'
        }
        color="primary"
        size="small"
        onBack={onClose}
        displayOffline={!isOnline}
      >
        <div className="px-4 pb-6">
          {notification?.subject && (
            <div className="mt-4 flex items-center gap-3">
              <HighlightedCount
                count={parseNotificationMessage(notification.subject).count}
              />
              <Typography
                type="body"
                color="textDark"
                className="leading-snug"
                text={parseNotificationMessage(notification.subject).text}
              />
            </div>
          )}

          <div className="mt-6 rounded-2xl">
            {isRegisters && (
              <>
                <Typography
                  type="h3"
                  text={`Remind ${name} to take and submit attendance every day.`}
                  color="textDark"
                />
                <Typography
                  type="body"
                  text="Attendance is valuable for reporting and speaking to caregivers."
                  color="textMid"
                  className="mt-2"
                />
              </>
            )}

            {isAttendanceRate && (
              <>
                <Typography
                  type="h3"
                  text={`How to help ${name}`}
                  color="textDark"
                />
                <Typography
                  type="body"
                  text={`Remind ${name} to remove any children no longer attending.`}
                  color="textMid"
                  className="mt-3"
                />
                <Typography
                  type="body"
                  text={`If children are often absent, ${name} should contact their caregivers to find out why.`}
                  color="textMid"
                  className="mt-2"
                />
              </>
            )}

            {isProgress && (
              <>
                <Typography
                  type="h3"
                  text={`Remind ${name} to track progress for the next reporting period`}
                  color="textDark"
                />
                <Typography
                  type="body"
                  text={`${name} has missed the opportunity to submit reports. Please encourage them to start observing children for the next period.`}
                  color="textMid"
                  className="mt-2"
                />
                <Typography
                  type="h3"
                  text={`Remind ${name} why tracking progress is important`}
                  color="textDark"
                  className="mt-6"
                />
                <ul className={'ml-4 mt-4 list-disc'}>
                  <li>
                    <Typography
                      type="body"
                      text="By observing children often, we build an understanding of what they enjoy, what they can do easily, and where they need support. This helps us plan activities that stretch their learning."
                      color="textMid"
                      className="mt-2"
                    />
                  </li>
                  <li>
                    <Typography
                      type="body"
                      text="We track child progress so that we know where they need the most support."
                      color="textMid"
                      className="mt-2"
                    />
                  </li>
                </ul>
              </>
            )}
          </div>

          <div className="flex-column mx-auto mt-8 w-11/12 items-center">
            <Typography type="h2" text={`Contact ${name}`} className="mb-2" />
            <Typography
              type="h5"
              color="quatenary"
              text={
                phone
                  ? `${formatPhonenumberInternational(phone)}`
                  : 'Phone number not available'
              }
            />

            <div className="mt-4 flex justify-start gap-3">
              <Button
                type="outlined"
                color="secondary"
                size="small"
                onClick={whatsapp}
                disabled={!phone}
                className="w-full justify-start"
              >
                <img
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="WhatsApp"
                  className="mr-3 h-5 w-5"
                />
                <Typography
                  type="small"
                  weight="bold"
                  text={`WhatsApp ${name}`}
                  color="secondary"
                />
              </Button>

              <Button
                type="outlined"
                color="secondary"
                icon="PhoneIcon"
                iconPosition="start"
                size="small"
                onClick={call}
                disabled={!phone}
                className="w-full"
              >
                <Typography
                  type="small"
                  weight="bold"
                  text={`Call ${name}`}
                  color="secondary"
                />
              </Button>
            </div>

            <Alert
              type="info"
              title="WhatsApp and phone calls will be charged at your standard carrier rates."
              className="mt-6"
            />

            <Button
              type="filled"
              color="quatenary"
              icon="CheckCircleIcon"
              onClick={handleDone}
              className="mt-8 w-full rounded-2xl"
            >
              <Typography
                type="help"
                color="white"
                text={`I have contacted ${name}`}
              />
            </Button>
          </div>
        </div>
      </BannerWrapper>
    </div>
  );
};
