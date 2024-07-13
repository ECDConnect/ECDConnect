import {
  ActionModal,
  BannerWrapper,
  Button,
  Alert,
  Typography,
  LoadingSpinner,
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
import { HelpForm } from '@/components/help-form/help-form';
import OnlineOnlyModal from '../../../../../modals/offline-sync/online-only-modal';
import { useTenant } from '@/hooks/useTenant';

export const CoachPractitionerNotRegistered: React.FC<
  PractitionerNotRegisterProps
> = ({ practitioner, classroom }) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const tenant = useTenant();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const practitionerId = practitioner?.userId;
  const [showAlert, setShowAlert] = useState(false);
  const [inviteDates, setInviteDates] = useState<Date[]>();
  const [timeSinceLastInvite, setTimeSinceLastInvite] = useState<number>(1000);
  const [isSending, setIsSending] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getTimeSinceLastInvite = (invite: Date) => {
    return Math.abs(differenceInMinutes(new Date(invite as Date), new Date()));
  };

  const getInviteDetails = async () => {
    setIsLoading(true);
    const dates = await new PractitionerService(
      userAuth?.auth_token || ''
    ).GetAllPractitionerInvites(practitioner?.userId || '');

    dates.sort();

    if (!!dates.length) {
      setTimeSinceLastInvite(getTimeSinceLastInvite(dates[dates?.length - 1]));
    }

    setInviteDates(dates);

    setIsLoading(false);
  };

  useEffect(() => {
    getInviteDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendPractitionerInvite = async () => {
    if (isOnline) {
      if (!inviteDates || !inviteDates.length || timeSinceLastInvite > 60) {
        setShowAlert(true);
        setIsSending(true);
        await new PractitionerService(
          userAuth?.auth_token || ''
        ).SendPractitionerInviteToApplication(practitioner?.userId || '');
        await getInviteDetails();
        setShowAlert(false);
      }
    } else {
      showOnlineOnly();
    }
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
  };

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
              : `${practitioner?.user?.firstName} has not registered on ${tenant.tenant?.applicationName}.`
          }
          list={[
            `If ${practitioner?.user?.firstName} needs help registering for ${tenant.tenant?.applicationName}, please tap the button.`,
          ]}
          button={
            <Button
              text="Get help"
              icon="QuestionMarkCircleIcon"
              type={'filled'}
              color={'quatenary'}
              textColor={'white'}
              onClick={() => setShowHelp(true)}
            />
          }
        />

        {isLoading && (
          <LoadingSpinner
            size="medium"
            className="mt-4"
            spinnerColor="primary"
            backgroundColor="uiLight"
          />
        )}

        {!!inviteDates && !!inviteDates.length && (
          <>
            <div className="flex w-full justify-center">
              <Typography
                type="h2"
                color={inviteDates.length >= 3 ? 'errorMain' : 'textDark'}
                text={`${inviteDates.length} out of 3 sent:`}
                className="mt-4 w-11/12"
              />
            </div>
            {inviteDates?.map((invite, index) => (
              <div className="mt-2 flex w-full justify-center">
                <Typography
                  type="body"
                  color="textMid"
                  className="w-11/12"
                  text={`• An invitation was sent to ${
                    practitioner?.user?.firstName
                  } on ${format(new Date(invite as Date), 'LLLL d yyyy')}`}
                />
              </div>
            ))}
            {inviteDates.length === 2 && (
              <div className="my-4 flex justify-center">
                <Alert
                  type="info"
                  title="You can send 1 more invitation."
                  className="w-11/12"
                />
              </div>
            )}
            {inviteDates.length >= 3 && (
              <div className="my-4 flex justify-center">
                <Alert
                  type="info"
                  title="You cannot re-send the invitation again."
                  className="w-11/12"
                />
              </div>
            )}
            {timeSinceLastInvite < 60 && (
              <div className="my-4 flex justify-center">
                <Alert
                  type="info"
                  title="You need to wait 1 hour before re-sending the invitation again."
                  className="w-11/12"
                />
              </div>
            )}
          </>
        )}
        <div className="flex w-full justify-center">
          <Button
            disabled={
              isLoading ||
              (!!inviteDates &&
                (inviteDates.length >= 3 || timeSinceLastInvite < 60))
            }
            text="Re-send invitation"
            icon="PaperAirplaneIcon"
            type={'filled'}
            color={'quatenary'}
            textColor={'white'}
            className="mt-4 w-11/12"
            onClick={sendPractitionerInvite}
          />
        </div>

        <Dialog
          borderRadius="rounded"
          visible={showAlert}
          position={DialogPosition.Middle}
        >
          <div className={'flex justify-center p-4'}>
            {isSending && (
              <LoadingSpinner
                size="medium"
                className="mt-4"
                spinnerColor="primary"
                backgroundColor="uiLight"
              />
            )}
            {!isSending && (
              <ActionModal
                icon={'InformationCircleIcon'}
                iconColor="infoMain"
                iconSize={20}
                importantText={'Invitation SMS sent'}
                detailText={`Encourage ${practitioner?.user?.firstName} to register for ${tenant.tenant?.applicationName}.`}
                actionButtons={[
                  {
                    text: 'Close',
                    textColour: 'white',
                    colour: 'quatenary',
                    type: 'filled',
                    onClick: () => setShowAlert(false),
                    leadingIcon: 'XIcon',
                  },
                ]}
              />
            )}
          </div>
        </Dialog>
        <Dialog
          visible={showHelp}
          position={DialogPosition.Full}
          className="w-full"
          stretch
        >
          <HelpForm closeAction={setShowHelp} />
        </Dialog>
      </BannerWrapper>
    </>
  );
};
