import { BannerWrapper, Button, Alert } from '@ecdlink/ui';
import { format, addDays } from 'date-fns';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { useSelector } from 'react-redux';
import { practitionerThunkActions } from '@/store/practitioner';
import { useAppDispatch } from '@/store';
import ROUTES from '@/routes/routes';
import { PractitionerDto, useSnackbar } from '@ecdlink/core';
import { useTenant } from '@/hooks/useTenant';
import { classroomsSelectors } from '@/store/classroom';
import { BusinessTabItems } from '@/pages/business/business.types';

export interface PractitionerNotAcceptedProps {
  practitioner: PractitionerDto;
}

export const PractitionerNotAccepted: React.FC<
  PractitionerNotAcceptedProps
> = ({ practitioner }) => {
  const history = useHistory();
  const tenant = useTenant();
  const { showMessage } = useSnackbar();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const appDispatch = useAppDispatch();
  const userName =
    practitioner?.user?.firstName || practitioner?.user?.userName;

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
    history.push(ROUTES.BUSINESS, {
      activeTabIndex: BusinessTabItems.STAFF,
    });
    showMessage({
      message: `${userName} removed`,
    });
  };

  return (
    <BannerWrapper
      title={`${userName} ${
        !!practitioner.user?.surname ? practitioner.user?.surname : ''
      }`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      renderOverflow={false}
      onBack={() => history.goBack()}
      displayOffline={!isOnline}
      className="w-full justify-center p-2"
    >
      <div className="flex w-full justify-center">
        <Alert
          className="mt-10 w-11/12 rounded-xl"
          type={'error'}
          title={`${userName} has not agreed to join ${classroom?.name} on ${
            tenant.tenant?.applicationName
          }. If ${userName} does not register by ${format(
            addDays(new Date(practitioner.dateLinked!), 7),
            'LLL d'
          )}, this profile will be deleted.`}
          list={[
            `If you added ${userName} by mistake, please remove them from your preschool.`,
          ]}
        />
      </div>

      <div className="flex w-full justify-center">
        <Button
          text="Remove Practitioner"
          icon="TrashIcon"
          type={'filled'}
          color={'quatenary'}
          textColor={'white'}
          className="mt-4 w-11/12"
          onClick={removePractitioner}
        />
      </div>
    </BannerWrapper>
  );
};
