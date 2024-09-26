import { RoleSystemNameEnum, useDialog } from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { format, addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { childrenThunkActions } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import { settingSelectors } from '@store/settings';
import { ChildRegistrationSteps } from '../../child-registration/child-registration.types';
import { ChildPendingProps } from './child-pending.types';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { copyToClip } from '@utils/common/clipboard.utils';
import { CaregiverChildRegistrationModal } from '../../components/caregiver-child-registration-modal/caregiver-child-registration-modal';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { userSelectors } from '@store/user';
import {
  TabsItemForPrincipal,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { ChildRegistrationDto } from '@/models/child/child-registration.dto';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { ChildListRouteState } from '@/pages/classroom/child-list/child-list.types';
import { ChildProfileRouteState } from '../child-profile.types';
import childRegistrationForm from '@/assets/ECD_connect_registration_form.pdf';

export const ChildPending: React.FC<ChildPendingProps> = ({
  child,
  childUser,
}) => {
  const location = useLocation<ChildProfileRouteState>();

  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const [deadlineDateText, setDeadlineDateText] = useState<string>('');
  const dialog = useDialog();
  const childExpiryTime = useSelector(settingSelectors.getChildExpiryTime);
  const childClassroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(child.userId!)
  );
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const classroomGroupId = classroomGroups?.at(0)?.id;
  const dispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );

  const practitioners = useSelector(
    practitionerSelectors.getPractitioners
  )?.filter((x) => {
    return x.user?.id !== practitioner?.user?.id;
  });

  const isTrialPeriod = useIsTrialPeriod();

  const { hasPermissionToManageChildren } = useUserPermissions();

  const hasPermissionToEdit =
    hasPermissionToManageChildren || practitioner?.isPrincipal || isTrialPeriod;

  useEffect(() => {
    if (!child || !child.insertedDate) return;

    const addedDays = addDays(new Date(child.insertedDate), childExpiryTime);

    const formatedDate = format(addedDays, 'dd MMMM yyyy');
    setDeadlineDateText(formatedDate);
  }, [child, childExpiryTime]);

  const completeRegistration = async () => {
    if (isOnline) {
      goToChildRegistration();
    } else {
      showOnlineOnly();
    }
  };

  const goToChildRegistration = () => {
    history.push(ROUTES.CHILD_REGISTRATION, {
      step: ChildRegistrationSteps.registrationForm,
      childId: child.id,
      childDetails: {
        playgroupId: classroomGroupId,
        firstName: childUser?.firstName,
        surname: childUser?.surname,
      },
    });
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const onSendCaregiverLink = async () => {
    if (isOnline) {
      createLink();
    } else {
      showOnlineOnly();
    }
  };

  const createLink = async () => {
    const response: ChildRegistrationDto = await dispatch(
      childrenThunkActions.refreshCaregiverChildToken({
        classgroupId: childClassroomGroup?.id || classroomGroupId,
        childId: child.id,
      })
    ).unwrap();
    const caregiverChildregUrl = history.createHref({
      pathname: `${response?.caregiverRegistrationUrl}`,
    });

    const linkCopied = await copyToClip(caregiverChildregUrl);

    const whatsapp = () => {
      const textMessage = `${practitioner?.user?.firstName} practitioner has invited you to register you child at their care centre. Tap this link to register ${childUser?.firstName} for ${classroom?.name}: ${caregiverChildregUrl}`;
      const whatsAppLink = `whatsapp://send?text=${textMessage}`;
      window.open(whatsAppLink);
    };

    dialog({
      color: 'bg-white',
      render: (onSubmit, onCancel) => {
        return (
          <CaregiverChildRegistrationModal
            onSubmit={whatsapp}
            onCancel={onCancel}
            childDetails={{
              firstName: childUser?.firstName || '',
              surname: childUser?.surname || '',
            }}
            caregiverUrl={caregiverChildregUrl}
            couldCopyToClipboard={linkCopied}
          />
        );
      },
      position: DialogPosition.Middle,
    });
  };

  const onDownloadChildForm = () => {
    const pdfUrl = childRegistrationForm;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'child_registration_form.pdf');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <BannerWrapper
      onBack={() => {
        if (location.state?.classroomGroupIdFromRedirect) {
          return history.push(ROUTES.CLASSROOM.CHILDREN, {
            classroomGroupId: location.state?.classroomGroupIdFromRedirect,
          } as ChildListRouteState);
        }
        if (isPrincipal && practitioners?.length! > 1) {
          history.push(ROUTES.CLASSROOM.ROOT, {
            activeTabIndex: TabsItemForPrincipal.CLASSES,
          });
        } else {
          if (isCoach) {
            history.goBack();
          } else {
            history.push(ROUTES.CLASSROOM.ROOT, {
              activeTabIndex: TabsItems.CLASSES,
            });
          }
        }
      }}
      color="primary"
      size="medium"
      renderBorder
      title={`${childUser?.firstName} ${childUser?.surname}`}
      subTitle={'Not Registered'}
      displayOffline={!isOnline}
    >
      <div className="flex h-full w-full flex-col p-4">
        <Alert
          className="mb-8 mt-4"
          title={`${childUser?.firstName}'s registration is not complete`}
          type={'error'}
        />

        <Typography
          type="body"
          color={'textMid'}
          text={`If the registration form is not completed, this profile will be removed on:`}
        />

        <Typography type="h4" color={'textDark'} text={`${deadlineDateText}`} />

        <Typography
          className="mt-4"
          text="Remember, by allowing a child to attend your preschool without getting and uploading a caregiver’s consent, you might leave your preschool open to legal consequences."
          type="body"
          color="textMid"
        />
        {!!hasPermissionToEdit && (
          <div className="mt-auto">
            <Button
              className="w-full"
              id="gtm-share-caregiver"
              type="filled"
              color="quatenary"
              text="Copy link to send to caregiver"
              textColor="white"
              icon="LinkIcon"
              iconPosition="start"
              onClick={onSendCaregiverLink}
            />
            <Divider title="OR" dividerType="solid" className="my-4" />

            <Button
              type="outlined"
              className="mt-2 w-full"
              color="quatenary"
              text="Fill child's registration form"
              textColor="quatenary"
              icon="DocumentDuplicateIcon"
              iconPosition="start"
              onClick={completeRegistration}
            />
            <Divider title="OR" dividerType="solid" className="my-4" />
            <Button
              type="outlined"
              className="mt-2 w-full"
              color="quatenary"
              text="Download form"
              textColor="quatenary"
              icon="DownloadIcon"
              iconPosition="start"
              onClick={onDownloadChildForm}
            />
          </div>
        )}
      </div>
    </BannerWrapper>
  );
};
