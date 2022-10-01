import { BannerWrapper, Button, Alert } from '@ecdlink/ui';
import { format } from 'date-fns';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useTheme } from '@ecdlink/core';
import { useHistory, useLocation } from 'react-router';
import { PractitionerNotRegisterProps } from './practitioner-not-registered.types';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { useSelector } from 'react-redux';
import { practitionerThunkActions } from '@/store/practitioner';
import { useAppDispatch } from '@/store';
import ROUTES from '@/routes/routes';

export const PractitionerNotRegistered: React.FC<
  PractitionerNotRegisterProps
> = ({ practitioner }) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();

  const removePractitioner = async () => {
    if (!practitioner?.isLeaving) {
      await new PractitionerService(
        userAuth?.auth_token || ''
      ).UpdatePrincipalInvitation(
        practitioner?.userId!,
        practitioner?.principalHierarchy!,
        false
      );
    }
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
    history.push(ROUTES.CLASSROOM);
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
      <div className="w-full flex justify-center">
        <Alert
          className="mt-10 w-11/12 rounded-xl"
          type={'error'}
          title={
            practitioner?.isLeaving
              ? `Thandi has said that they are not a practitioner at Angels Daycare. If Thandi does not accept by ${format(
                  new Date(practitioner?.dateToBeRemoved!),
                  'LLL d'
                )}, this profile will be deleted.`
              : `Thandi has not registered on Funda App. If Thandi does not register by ${format(
                  new Date(practitioner?.dateLinked!),
                  'LLL d'
                )}, this profile will be deleted.`
          }
          list={[
            !practitioner?.isLeaving
              ? 'If Thandi needs help registering for Funda App, please contact the SmartStart call centre.'
              : 'If Thandi needs help with Funda App, please contact the SmartStart call centre.',
            'If you added Thandi by mistake, please remove them from your programme.',
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
      <div className="w-full flex justify-center">
        <Button
          text="Remove Practitioner"
          icon="TrashIcon"
          type={'filled'}
          color={'primary'}
          textColor={'white'}
          className="w-11/12 mt-4"
          onClick={removePractitioner}
        />
      </div>
    </>
  );
};
