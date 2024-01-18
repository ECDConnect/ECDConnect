import {
  BannerWrapper,
  Button,
  Alert,
  Typography,
  Dialog,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import { differenceInMinutes, format } from 'date-fns';
import { useDialog } from '@ecdlink/core';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router';
import { PractitionerNotRegisterProps } from './coach-practitioner-not-registered.types';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { useSelector } from 'react-redux';
import ROUTES from '@/routes/routes';
import { useEffect, useState, useMemo } from 'react';
import * as styles from './coach-practitioner-not-registered.styles';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import OnlineOnlyModal from '../../../../../modals/offline-sync/online-only-modal';

export const CoachPractitionerNotRegistered: React.FC<
  PractitionerNotRegisterProps
> = ({ practitioner, classroom }) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const practitionerId = practitioner?.userId;
  const [inviteCount, setInviteCount] = useState(0);
  const [inviteDates, setInviteDates] = useState<[]>();
  const [lastInviteDate, setLastInviteDate] = useState<Date>();
  const [lastInviteDiffInMinutes, setLastInviteDiffInMinutes] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    getClassroomDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClassroomDetails = async () => {
    const inviteCountData = await new PractitionerService(
      userAuth?.auth_token || ''
    ).GetPractitionerInviteCount(practitioner?.userId || '');
    const lastInviteDate = await new PractitionerService(
      userAuth?.auth_token || ''
    ).GetLastPractitionerInviteDate(practitioner?.userId || '');
    const lastInviteDates = await new PractitionerService(
      userAuth?.auth_token || ''
    ).GetAllPractitionerInvites(practitioner?.userId || '');
    setLastInviteDate(lastInviteDate as any);
    setLastInviteDiffInMinutes(
      lastInviteDate
        ? Math.abs(differenceInMinutes(new Date(lastInviteDate), new Date()))
        : 0
    );
    setInviteCount(Number(inviteCountData));
    setInviteDates(lastInviteDates as any);
  };

  const sendPractitionerInvite = async () => {
    if (isOnline) {
      if (lastInviteDiffInMinutes > 60 || inviteCount === 0) {
        await new PractitionerService(
          userAuth?.auth_token || ''
        ).SendPractitionerInviteToApplication(practitioner?.userId || '');
        getClassroomDetails();
      } else {
        setShowAlert(true);
      }
    } else {
      showOnlineOnly();
    }
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

  const disableButton = useMemo(() => {
    return inviteCount >= 3;
  }, [inviteCount]);

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  return (
    <>
      <BannerWrapper
        title={`${practitioner?.user?.fullName}`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={true}
        onBack={() => history.push(ROUTES.COACH.PRACTITIONERS)}
        displayOffline={!isOnline}
        className="w-full justify-center p-2"
      >
        <Alert
          className="mt-10 rounded-xl"
          type={'error'}
          title={
            practitioner?.isLeaving
              ? `${
                  practitioner?.user?.firstName
                } has said that they are not a practitioner at ${
                  classroom?.name
                }. If ${
                  practitioner?.user?.firstName
                } does not accept by ${format(
                  new Date(practitioner?.dateToBeRemoved!),
                  'LLL d'
                )}, this profile will be deleted.`
              : `${practitioner?.user?.firstName} has not registered on Funda App.`
          }
          list={[
            `Help ${practitioner?.user?.firstName} to register for the app`,
            `If ${practitioner?.user?.firstName} did not receive the SMS, you can resend it now.`,
          ]}
        />

        <div className="mt-4">
          <div className="ml-2">
            <Typography
              color={'textMid'}
              text={`• ${inviteCount} out of 3 invitations sent:`}
              type="small"
            />
          </div>
        </div>

        {inviteDates && (
          <div className="mt-4">
            <div className="mt-2 ml-4 flex w-full flex-wrap justify-center">
              {inviteDates.length > 0 &&
                inviteDates?.map((item, index) => {
                  return (
                    <div key={index} className="mr-4">
                      <Typography
                        color={'textMid'}
                        text={`• You sent ${
                          practitioner?.user?.firstName
                        } an invitation on ${format(
                          new Date(item as Date),
                          'LLLL d'
                        )}`}
                        type="small"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        <Dialog
          borderRadius="normal"
          stretch={true}
          visible={showAlert}
          position={DialogPosition.Middle}
        >
          <div className={'flex justify-center p-4'}>
            <div className="w-11/12">
              <div className={'flex w-full justify-center p-4'}>
                <ExclamationCircleIcon className="text-errorMain h-20 w-20" />
              </div>
              <div className="flex flex-wrap justify-center">
                <Typography
                  type="h3"
                  color="textDark"
                  text={'You cannot re-send this invitation!'}
                  weight="bold"
                  className="w-11/12"
                ></Typography>
                <Typography
                  type="body"
                  color="textDark"
                  text={
                    'You sent an invitation less than 1 hour ago. Please try again later.'
                  }
                  className="w-11/12"
                ></Typography>
              </div>
              <Button
                type="filled"
                color="primary"
                className={'mt-4 w-full'}
                onClick={() => {
                  setShowAlert(false);
                }}
              >
                {renderIcon('XIcon', styles.buttonIcon)}
                <Typography
                  type="help"
                  className="mr-2"
                  color="white"
                  text={'Close'}
                ></Typography>
              </Button>
            </div>
          </div>
        </Dialog>
        {inviteCount === 2 && (
          <div className="my-4 flex justify-center">
            <Alert
              type="info"
              title="You can send 1 more invitation."
              className="w-11/12"
            />
          </div>
        )}
        {inviteCount === 3 && (
          <div className="my-4 flex justify-center">
            <Alert
              type="info"
              title="You cannot re-send the invitation again."
              message="Reach out to SmartStart’s call centre if Thandi is having trouble registering for Funda App. "
              className="w-11/12"
              button={
                <Button
                  text="Contact call centre"
                  icon="PhoneIcon"
                  type={'filled'}
                  color={'primary'}
                  textColor={'white'}
                  onClick={() => callForHelp()}
                />
              }
            />
          </div>
        )}
        <div className="my-4 w-full">
          <div className="flex w-full justify-center">
            <Button
              text="Re-send Funda App invitation"
              icon="ExclamationIcon"
              type={'filled'}
              color={'primary'}
              textColor={'white'}
              className="mt-4 w-11/12"
              onClick={sendPractitionerInvite}
              disabled={disableButton}
            />
          </div>
          <div className="flex w-full justify-center">
            <Button
              text="Contact practitioner"
              icon="ChatIcon"
              type={'outlined'}
              color={'primary'}
              textColor={'primary'}
              className="mt-4 w-11/12"
              onClick={() =>
                history.push(ROUTES.COACH.CONTACT_PRACTITIONER, {
                  practitionerId,
                })
              }
            />
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
