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
import * as childRegisterUtils from '@utils/child/child-registration.utils';
import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { useStaticData } from '@hooks/useStaticData';
import {
  ChildRegistrationRouteState,
  ChildRegistrationSteps,
} from '../../child-registration/child-registration.types';
import { classroomsActions } from '@store/classroom';
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
  const { getWorkflowStatusIdByEnum } = useStaticData();
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
      createLocalUser(
        childRegistrationDetails.childId,
        childRegistrationDetails.childUserId
      );
    }

    setChildId(childRegistrationDetails.childId);
    const linkCopied = await copyToClip(
      childRegistrationDetails.caregiverRegistrationUrl
    );

    const whatsapp = () => {
      window.open(
        `whatsapp://send?text=${childRegistrationDetails.caregiverRegistrationUrl}`
      );
    };

    await copyToClip(childRegistrationDetails.caregiverRegistrationUrl);
    setLoadingLink(false);
    dialog({
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
      createLocalUser(
        childRegistrationDetails.childId,
        childRegistrationDetails.childUserId
      );
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

  // This doesn't set any state, or return anything
  const createLocalUser = (childId: string, childUserId: string) => {
    const childInformation = {
      dobDay: 0,
      dobMonth: 0,
      dobYear: 0,
      firstname: childDetails.firstName,
      surname: childDetails.surname,
      playgroupId: childDetails.playgroupId, // TODO : Rename to classroomGroupId
      otherReason: '',
    };
    const childExtraInformation = { childFirstname: childDetails.firstName };

    let userInputModel = childRegisterUtils.mapChildUserDto(
      childInformation,
      childExtraInformation
    );

    userInputModel = {
      ...userInputModel,
      id: childUserId,
    };

    const childStatusId = getWorkflowStatusIdByEnum(
      WorkflowStatusEnum.ChildExternalLink
    );

    let childInputModel = childRegisterUtils.mapChildDto(
      childUserId,
      childStatusId ?? '',
      {},
      childExtraInformation
    );

    childInputModel = {
      ...childInputModel,
      id: childId,
    };

    // Add values to redux. This could potentially be a refresh for child/classroomGroup data
    dispatch(childrenActions.createChild(childInputModel));
    dispatch(
      classroomsActions.createLearner({
        childUserId,
        newClassroomGroupId: childDetails.playgroupId,
      })
    );
  };

  return (
    <div className="flex h-full w-full flex-col bg-white p-4">
      <Typography
        type="unspecified"
        weight="normal"
        fontSize="16"
        text="Send registration form to caregiver or upload paper registration form"
      />
      <Typography
        type="unspecified"
        className="mt-4"
        weight="normal"
        color="textMid"
        fontSize="16"
        text="If the caregiver has a smartphone, you can send the registration form to the caregiver to complete."
      />
      <Typography
        type="unspecified"
        className="mt-4"
        weight="normal"
        color="textMid"
        fontSize="16"
        text={`You can always access the link again on ${childDetails.firstName}'s profile.`}
      />

      <Button
        id="gtm-share-caregiver"
        type="filled"
        color="primary"
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
        type="unspecified"
        weight="normal"
        fontSize="16"
        text="If the caregiver has already filled in a paper version of the child registration form, upload a photo of the form and fill in the details."
      />

      <Button
        type="outlined"
        className="mt-4"
        color="primary"
        text="Upload paper registration form"
        textColor="primary"
        icon="UploadIcon"
        iconPosition="start"
        isLoading={loadingManualUpload}
        disabled={loadingManualUpload}
        onClick={onUploadSelf}
      />
    </div>
  );
};
