import { BannerWrapper, Button, Alert } from '@ecdlink/ui';
import { format, addDays } from 'date-fns';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router';
import { PractitionerNotRegisterProps } from './practitioner-not-registered.types';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { useSelector } from 'react-redux';
import { practitionerThunkActions } from '@/store/practitioner';
import { useAppDispatch } from '@/store';
import ROUTES from '@/routes/routes';
import { useSnackbar } from '@ecdlink/core';

export const PractitionerNotRegistered: React.FC<
  PractitionerNotRegisterProps
> = ({ practitioner, classroom }) => {
  const history = useHistory();
  const { showMessage } = useSnackbar();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();

  const removePractitioner = async () => {
    await new PractitionerService(
      userAuth?.auth_token || ''
    ).UpdatePrincipalInvitation(
      practitioner?.userId!,
      practitioner?.principalHierarchy!,
      false
    );

    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();
    history.push(ROUTES.CLASSROOM.ROOT);
    showMessage({
      message: `${practitioner?.user?.firstName} removed`,
    });
  };

  const callForHelp = () => {
    window.open('tel:+27800014817');
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
              : `${
                  practitioner?.user?.firstName
                } has not registered on Funda App. If ${
                  practitioner?.user?.firstName
                } does not register by ${format(
                  addDays(new Date(practitioner?.dateLinked!), 7),
                  'LLL d'
                )}, this profile will be deleted.`
          }
          list={[
            !practitioner?.isLeaving
              ? `If ${practitioner?.user?.firstName} needs help registering for Funda App, please contact the SmartStart call centre.`
              : `If ${practitioner?.user?.firstName} needs help with Funda App, please contact the SmartStart call centre.`,
            `If you added ${practitioner?.user?.firstName} by mistake, please remove them from your programme.`,
          ]}
          button={
            <Button
              text="Contact call centre"
              icon="PhoneIcon"
              type={'filled'}
              color={'primary'}
              textColor={'white'}
              onClick={callForHelp}
            />
          }
        />
      </div>
      <div className="flex w-full justify-center">
        <Button
          text="Remove Practitioner"
          icon="TrashIcon"
          type={'filled'}
          color={'primary'}
          textColor={'white'}
          className="mt-4 w-11/12"
          onClick={removePractitioner}
        />
      </div>
    </>
  );
};
