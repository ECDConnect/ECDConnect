import { useDialog } from '@ecdlink/core';
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
import { classroomsActions, classroomsThunkActions } from '@store/classroom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { copyToClip } from '@utils/common/clipboard.utils';
import { CaregiverChildRegistrationModal } from '../../components/caregiver-child-registration-modal/caregiver-child-registration-modal';
import { CaregiverMultipleChildrenModal } from '../../components/caregiver-multiple-children-modal';
import ROUTES from '@/routes/routes';
import { useSelector } from 'react-redux';
import { getUser } from '@/store/user/user.selectors';
import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { practitionerSelectors } from '@/store/practitioner';
import {
  TabsItemForPrincipal,
  TabsItems,
  TabsItemsWithAttendance,
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
  const [childId, setChildId] = useState();
  const [loadingLink, setLoadingLink] = useState(false);

  const [loadingManualUpload, setLoadingManualUpload] = useState(false);
  const { getWorkflowStatusIdByEnum } = useStaticData();
  const { isOnline } = useOnlineStatus();

  const user = useSelector(getUser);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);

  const isPrincipal = user?.principalObjectData?.isPrincipal;
  const isCoachView = user?.roles?.some(
    (role) => role.name === UserTypeEnum.Coach
  );
  const isPractitionerView =
    user?.roles?.some((role) => role.name === UserTypeEnum.Practitioner) ||
    isPrincipal;
  const hasAttendanceRoute = isPrincipal && practitioners?.length! > 0;

  const practitionerId = location?.state?.practitionerId;

  const getChildToken = async () => {
    let token = '';

    if (childId) {
      token = await dispatch(
        childrenThunkActions.refreshCaregiverChildToken({
          childId: childId,
          classgroupId: childDetails.playgroupId,
        })
      ).unwrap();
    } else {
      token = await dispatch(
        childrenThunkActions.generateCaregiverChildToken({
          firstName: childDetails.firstName,
          surname: childDetails.surname,
          classgroupId: childDetails.playgroupId,
        })
      ).unwrap();
    }

    return token;
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
      position: DialogPosition.Bottom,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const onExit = () => {
    if (isPractitionerView || isPrincipal) {
      if (isPrincipal) {
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItemForPrincipal.CHILDREN,
        } as ClassDashboardRouteState);
      } else {
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: hasAttendanceRoute
            ? TabsItemsWithAttendance.CHILDREN
            : TabsItems.CHILDREN,
        } as ClassDashboardRouteState);
      }
    } else {
      history.push(ROUTES.COACH.PRACTITIONERS);
    }
  };

  const createLink = async () => {
    setLoadingLink(true);
    const token = await getChildToken();
    const modelString = decodeToken(token);
    const result = JSON.parse(modelString);

    if (!childId) createLocalUser(result);

    const caregiverChildregUrl = history.createHref({
      pathname: window.location.href,
      search: `?token=${token}`,
    });

    setChildId(result.ChildId);
    const linkCopied = await copyToClip(caregiverChildregUrl);

    const whatsapp = () => {
      window.open(`whatsapp://send?text=${caregiverChildregUrl}`);
    };

    await copyToClip(caregiverChildregUrl);
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
            caregiverUrl={caregiverChildregUrl}
            couldCopyToClipboard={linkCopied}
          />
        );
      },
      position: DialogPosition.Middle,
    });
  };

  const decodeToken = (token: string) => {
    return atob(token);
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
    const token = await getChildToken();
    const modelString = decodeToken(token);
    const result = JSON.parse(modelString);
    if (!childId) {
      createLocalUser(result);
      setChildId(result.ChildId);
    }
    setLoadingManualUpload(false);
    history.replace('/child-registration', {
      childDetails,
      childId: result.ChildId,
      step: ChildRegistrationSteps.registrationForm,
      practitionerId: isCoachView ? practitionerId : null,
    });
  };

  const createLocalUser = (model: any) => {
    const childInformation = {
      dobDay: 0,
      dobMonth: 0,
      dobYear: 0,
      firstname: childDetails.firstName,
      surname: childDetails.surname,
      playgroupId: childDetails.playgroupId,
      otherReason: '',
    };
    const childExtraInformation = { childFirstname: childDetails.firstName };

    let userInputModel = childRegisterUtils.mapChildUserDto(
      childInformation,
      childExtraInformation
    );

    userInputModel = {
      ...userInputModel,
      id: model.ChildUserId,
    };

    const childStatusId = getWorkflowStatusIdByEnum(
      WorkflowStatusEnum.ChildExternalLink
    );

    let childInputModel = childRegisterUtils.mapChildDto(
      model.ChildUserId,
      childStatusId ?? '',
      {},
      childExtraInformation
    );

    childInputModel = {
      ...childInputModel,
      id: model.ChildId,
    };

    const learnerInputModel = childRegisterUtils.mapLearnerDto(
      model.ChildUserId,
      childInformation
    );

    dispatch(childrenActions.createChildUser(userInputModel));
    dispatch(childrenActions.createChild(childInputModel));
    dispatch(classroomsActions.createClassroomGroupLearner(learnerInputModel));
    dispatch(
      classroomsThunkActions.createLearner({ learner: learnerInputModel })
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
