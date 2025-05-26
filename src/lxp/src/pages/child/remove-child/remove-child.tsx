import {
  ReasonForLeavingDto,
  RoleSystemNameEnum,
  useSnackbar,
} from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  classNames,
  Dropdown,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  initialRemoveChildValues,
  RemoveChildModel,
  removeChildModelSchema,
} from '@schemas/child/remove-child/remove-child';
import { useAppDispatch } from '@store';
import {
  childrenActions,
  childrenSelectors,
  childrenThunkActions,
} from '@store/children';
import { staticDataSelectors } from '@store/static-data';
import { analyticsActions } from '@store/analytics';
import * as styles from './remove-child.styles';
import { RemoveChildRouteState } from './remove-child.types';
import { userSelectors } from '@store/user';
import ROUTES from '@routes/routes';
import { classroomsActions, classroomsSelectors } from '@/store/classroom';
import {
  TabsItemForPrincipal,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { ClassDashboardRouteState } from '@/pages/business/business.types';

export const RemoveChild: React.FC = () => {
  const location = useLocation<RemoveChildRouteState>();
  const practitionerId = location.state.practitionerId;
  const userData = useSelector(userSelectors.getUser);
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const childId = location.state.childId;
  const child = useSelector(childrenSelectors.getChildById(childId));
  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(child?.userId!)
  );

  // TODO: update the reasonsForLeaving
  const reasonsForLeaving = useSelector(
    staticDataSelectors.getReasonsForLeaving
  );
  const history = useHistory();

  const { showMessage } = useSnackbar();

  const isCoach = userData?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );
  const isPrincipal = userData?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Principal
  );

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Remove Child',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const {
    getValues: removeChildFormGetValues,
    setValue: removeChildFormSetValues,
    trigger: triggerRemoveChildForm,
    register: removeChildFormRegister,
    control: removeChildFormControl,
  } = useForm<RemoveChildModel>({
    resolver: yupResolver(removeChildModelSchema),
    mode: 'onChange',
    defaultValues: initialRemoveChildValues,
  });

  const { isValid } = useFormState({
    control: removeChildFormControl,
  });

  const handleFormSubmit = async () => {
    if (!child) return;

    const updatedChild = { ...child };
    updatedChild.isActive = false;
    updatedChild.reasonForLeavingId =
      removeChildFormGetValues('removeReasonId');
    updatedChild.inactivityComments = removeChildFormGetValues('reasonDetail');
    updatedChild.inactiveDate = new Date();
    appDispatch(
      classroomsActions.deactivateLearner({
        childUserId: child.userId!,
        classroomGroupId: classroomGroup?.id!,
      })
    );
    appDispatch(childrenActions.updateChild(updatedChild));

    if (isOnline) {
      appDispatch(
        childrenThunkActions.updateChild({
          child: updatedChild,
          id: String(updatedChild.id),
        })
      );
    }

    showMessage({
      message: `Child removed`,
      type: 'success',
    });

    if (isCoach) {
      history.push(ROUTES.COACH.PRACTITIONER_CHILD_LIST, { practitionerId });
      return;
    }
    history.push(ROUTES.CLASSROOM.ROOT, {
      activeTabIndex: isPrincipal
        ? TabsItemForPrincipal.CLASSES
        : TabsItems.CLASSES,
    } as ClassDashboardRouteState);
  };

  return (
    <BannerWrapper
      size={'small'}
      className={'overflow-y-auto'}
      renderBorder={true}
      title={`Remove ${child?.user?.firstName} from programme`}
      color={'primary'}
      onBack={() => history.goBack()}
      displayOffline={!isOnline}
    >
      <div className={'flex h-full flex-col p-4'}>
        <Alert
          type="error"
          title={`${child?.user?.firstName} will be removed from the preschool immediately`}
          list={[
            `If you remove ${child?.user?.firstName} now, you will no longer be able to edit or view this profile.`,
          ]}
          className={'mb-4'}
        />
        <Typography
          type={'h1'}
          text={`Why is ${child?.user?.firstName} leaving ${classroomGroup?.name}?`}
          color={'primary'}
          className={'pt-1'}
        />

        <label className={classNames(styles.label, 'mt-4')}>
          {'Reason for leaving'}
        </label>
        <Dropdown<string>
          placeholder={'Choose reason'}
          fullWidth
          fillType="clear"
          list={
            (reasonsForLeaving &&
              reasonsForLeaving.map((x: ReasonForLeavingDto) => {
                return { label: x.description, value: x.id || '' };
              })) ||
            []
          }
          selectedValue={removeChildFormGetValues().removeReasonId}
          onChange={(item) => {
            removeChildFormSetValues('removeReasonId', item);
            triggerRemoveChildForm();
          }}
        />
        <FormInput<RemoveChildModel>
          label={'Please add details'}
          className={'mt-3'}
          textInputType="textarea"
          register={removeChildFormRegister}
          nameProp={'reasonDetail'}
          placeholder={'E.g. Did not like the activities'}
          onChange={(item) => {
            removeChildFormSetValues('reasonDetail', item.target.value);
            triggerRemoveChildForm();
          }}
        />
        <div className="mt-auto">
          <Button
            onClick={() => handleFormSubmit()}
            className="w-full"
            size="small"
            color="quatenary"
            textColor="white"
            type="filled"
            disabled={!isValid}
            icon="TrashIcon"
            text={`Remove ${child?.user?.firstName}`}
          />
          <Button
            onClick={() => history.goBack()}
            className="mt-4 w-full"
            size="small"
            color="quatenary"
            textColor="quatenary"
            type="outlined"
            icon="XIcon"
            text="Cancel"
          />
        </div>
      </div>
    </BannerWrapper>
  );
};

export default RemoveChild;
