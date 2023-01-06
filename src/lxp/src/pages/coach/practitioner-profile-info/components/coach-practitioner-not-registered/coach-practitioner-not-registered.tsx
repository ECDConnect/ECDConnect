import { BannerWrapper, Button, Alert, Typography } from '@ecdlink/ui';
import { format } from 'date-fns';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router';
import { PractitionerNotRegisterProps } from './coach-practitioner-not-registered.types';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { useSelector } from 'react-redux';
import ROUTES from '@/routes/routes';
import { useEffect, useState } from 'react';

export const CoachPractitionerNotRegistered: React.FC<
  PractitionerNotRegisterProps
> = ({ practitioner, classroom }) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const practitionerId = practitioner?.userId;
  const [inviteCount, setInviteCount] = useState(0);
  const [inviteDates, setInviteDates] = useState<Date>();

  useEffect(() => {
    getClassroomDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClassroomDetails = async () => {
    const inviteCountData = await new PractitionerService(
      userAuth?.auth_token || ''
    ).GetPractitionerInviteCount(practitioner?.userId || '');
    const lastInviteDates = await new PractitionerService(
      userAuth?.auth_token || ''
    ).GetLastPractitionerInviteDate(practitioner?.userId || '');
    setInviteCount(Number(inviteCountData));
    setInviteDates(lastInviteDates as any);
  };

  const sendPractitionerInvite = async () => {
    await new PractitionerService(
      userAuth?.auth_token || ''
    ).SendPractitionerInviteToApplication(practitioner?.userId || '');
  };

  return (
    <>
      <BannerWrapper
        title={`${practitioner?.user?.fullName}`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      />
      <div className="flex w-full justify-center">
        <Alert
          className="mt-10 w-11/12 rounded-xl"
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
      </div>
      {inviteCount && inviteDates && (
        <div className="mt-6 ml-4 flex w-full justify-center">
          <div className="w-11/12">
            <div>
              <Typography
                color={'textMid'}
                text={`${inviteCount} out of 3 invitations sent:`}
                type="small"
              />
            </div>
            <div className="mr-4">
              <Typography
                color={'textMid'}
                text={`• You sent ${
                  practitioner?.user?.firstName
                } an invitation on ${format(
                  new Date(inviteDates as Date),
                  'LLLL d'
                )}`}
                type="small"
              />
            </div>
          </div>
        </div>
      )}
      {inviteCount === 2 && (
        <div className="my-4 flex justify-center">
          <Alert
            type="info"
            title="You can send 1 more invitation."
            className="w-11/12"
          />
        </div>
      )}
      <div className="absolute bottom-4 w-full">
        <div className="flex w-full justify-center">
          <Button
            text="Re-send Funda App invitation"
            icon="ExclamationIcon"
            type={'filled'}
            color={'primary'}
            textColor={'white'}
            className="mt-4 w-11/12"
            onClick={sendPractitionerInvite}
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
    </>
  );
};
