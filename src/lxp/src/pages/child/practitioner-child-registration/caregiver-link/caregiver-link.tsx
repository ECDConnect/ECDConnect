import { RoleSystemNameEnum, useDialog } from '@ecdlink/core';
import {
  Button,
  ComponentBaseProps,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { ChildBasicInfoModel } from '@schemas/child/child-registration/child-basic-info';
import { useAppDispatch } from '@store';
import { childrenThunkActions, childrenActions } from '@store/children';
import { useStaticData } from '@hooks/useStaticData';
import {
  ChildRegistrationRouteState,
  ChildRegistrationSteps,
} from '../../child-registration/child-registration.types';
import { classroomsSelectors, classroomsThunkActions } from '@store/classroom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { copyToClip } from '@utils/common/clipboard.utils';
import { CaregiverChildRegistrationModal } from '../../components/caregiver-child-registration-modal/caregiver-child-registration-modal';
import { CaregiverMultipleChildrenModal } from '../../components/caregiver-multiple-children-modal';
import ROUTES from '@/routes/routes';
import { useSelector } from 'react-redux';
import { getUser } from '@/store/user/user.selectors';
import { practitionerSelectors } from '@/store/practitioner';
import {
  TabsItemForPrincipal,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { ClassDashboardRouteState } from '@/pages/business/business.types';
import childRegistrationForm from '@/assets/ECD_connect_registration_form.pdf';

export interface CaregiverLinkProps extends ComponentBaseProps {
  childDetails: ChildBasicInfoModel;
  onNewChild: () => void;
}

export const CaregiverLink: React.FC<CaregiverLinkProps> = ({
  childDetails,
  onNewChild,
}) => {
  const dialog = useDialog();
  const history = useHistory();
  const location = useLocation<ChildRegistrationRouteState>();
  const dispatch = useAppDispatch();
  const [childId, setChildId] = useState<string>();
  const [loadingLink, setLoadingLink] = useState(false);

  const [loadingManualUpload, setLoadingManualUpload] = useState(false);
  const { isOnline } = useOnlineStatus();

  const user = useSelector(getUser);
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);

  const isPrincipal = practitioner?.isPrincipal;
  const isCoachView = user?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );
  const isPractitionerView =
    user?.roles?.some(
      (role) => role.systemName === RoleSystemNameEnum.Practitioner
    ) || isPrincipal;
  const practitionerId = location?.state?.practitionerId;
  const classroom = useSelector(classroomsSelectors.getClassroom);

  const getChildToken = async () => {
    if (childId) {
      return await dispatch(
        childrenThunkActions.refreshCaregiverChildToken({
          childId: childId,
          classgroupId: childDetails.playgroupId,
        })
      ).unwrap();
    } else {
      return await dispatch(
        childrenThunkActions.generateCaregiverChildToken({
          firstName: childDetails.firstName,
          surname: childDetails.surname,
          classgroupId: childDetails.playgroupId,
        })
      ).unwrap();
    }
  };

  const onSendcaregiverLink = async () => {
    if (isOnline) {
      createLink();
    } else {
      showOnlineOnly();
    }
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const onExit = () => {
    if (isPractitionerView) {
      if (isPrincipal) {
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItemForPrincipal.CLASSES,
        } as ClassDashboardRouteState);
      } else {
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItems.CLASSES,
        } as ClassDashboardRouteState);
      }
    } else {
      history.push(ROUTES.COACH.PRACTITIONERS);
    }
  };

  const createLink = async () => {
    setLoadingLink(true);
    const childRegistrationDetails = await getChildToken();

    if (!childId) {
      refetchData();
    }

    setChildId(childRegistrationDetails.childId);
    const linkCopied = await copyToClip(
      childRegistrationDetails.caregiverRegistrationUrl
    );

    const whatsapp = () => {
      const textMessage = `${practitioner?.user?.firstName} practitioner has invited you to register you child at their care centre. Tap this link to register ${childDetails.firstName} for ${classroom?.name}: ${childRegistrationDetails.caregiverRegistrationUrl}`;
      const whatsAppLink = `whatsapp://send?text=${textMessage}`;
      window.open(whatsAppLink);
    };

    setLoadingLink(false);
    dialog({
      color: 'bg-white',
      render: (onSubmit, onCancel) => {
        if (!!practitionerId) {
          return (
            <CaregiverMultipleChildrenModal
              title="Caregiver link copied!"
              onSubmit={() => {
                onNewChild();
                onSubmit();
              }}
              onCancel={() => {
                onExit();
                onCancel();
              }}
            />
          );
        }

        return (
          <CaregiverChildRegistrationModal
            onSubmit={whatsapp}
            onCancel={onCancel}
            childDetails={childDetails}
            caregiverUrl={childRegistrationDetails.caregiverRegistrationUrl}
            couldCopyToClipboard={linkCopied}
          />
        );
      },
      position: DialogPosition.Middle,
    });
  };

  const onUploadSelf = async () => {
    if (isOnline) {
      await goToChildRegistration();
    } else {
      showOnlineOnly();
    }
  };

  const goToChildRegistration = async () => {
    setLoadingManualUpload(true);
    const childRegistrationDetails = await getChildToken();
    if (!childId) {
      await refetchData();
      setChildId(childRegistrationDetails.childId);
    }
    setLoadingManualUpload(false);
    history.replace('/child-registration', {
      childDetails,
      childId: childRegistrationDetails.childId,
      step: ChildRegistrationSteps.registrationForm,
      practitionerId: isCoachView ? practitionerId : null,
    });
  };

  // This should just sync children and classgroups (to get the newly created child)
  const refetchData = async () => {
    await dispatch(childrenThunkActions.getChildren({ overrideCache: true }));
    await dispatch(
      classroomsThunkActions.getClassroomGroups({ overrideCache: true })
    );
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
    <div className="flex h-full w-full flex-col bg-white p-4">
      <Typography
        type="h4"
        color="textDark"
        text="Send registration form to caregiver or upload paper registration form"
      />
      <Typography
        type="body"
        className="mt-4"
        color="textMid"
        text="If the caregiver has a smartphone, you can send the registration form to the caregiver to complete."
      />
      <Typography
        type="body"
        className="mt-4"
        color="textMid"
        text={`You can always access the link again on ${childDetails.firstName}'s profile.`}
      />

      <Button
        id="gtm-share-caregiver"
        type="filled"
        color="quatenary"
        className="mt-4"
        text="Copy link to send to caregiver"
        textColor="white"
        icon="LinkIcon"
        iconPosition="start"
        isLoading={loadingLink}
        disabled={loadingLink}
        onClick={onSendcaregiverLink}
      />

      <Divider title="OR" dividerType="solid" className="my-4" />

      <Typography
        type="h4"
        color="textDark"
        text="You can complete the registration if the caregiver cannot fill it in on their phone."
      />

      <Button
        type="outlined"
        className="mt-4"
        color="quatenary"
        text="Fill in child’s registration form"
        textColor="quatenary"
        icon="DocumentDuplicateIcon"
        iconPosition="start"
        isLoading={loadingManualUpload}
        disabled={loadingManualUpload}
        onClick={onUploadSelf}
      />
      <Divider title="OR" dividerType="solid" className="mt-8 mb-6" />
      <Typography
        type="h4"
        color="textDark"
        text="Download and print the form for the caregiver."
      />
      <Typography
        type="body"
        className="mt-2"
        color="textMid"
        text={`When they give you the signed form, you can add the child's details in the app.`}
      />
      <Button
        type="outlined"
        className="mt-4"
        color="quatenary"
        text="Download form"
        textColor="quatenary"
        icon="DownloadIcon"
        iconPosition="start"
        onClick={onDownloadChildForm}
      />
    </div>
  );
};
