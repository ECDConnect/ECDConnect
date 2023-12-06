import { ReasonForLeavingDto } from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  classNames,
  Divider,
  Dropdown,
  FormInput,
  renderIcon,
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
import { classroomsActions } from '@store/classroom';
import { staticDataSelectors } from '@store/static-data';
import { analyticsActions } from '@store/analytics';
import * as styles from './remove-child.styles';
import { RemoveChildRouteState } from './remove-child.types';
import { userSelectors } from '@store/user';
import ROUTES from '@routes/routes';

export const RemoveChild: React.FC = () => {
  const location = useLocation<RemoveChildRouteState>();
  const practitionerId = location.state.practitionerId;
  const userData = useSelector(userSelectors.getUser);
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const childId = location.state.childId;
  const child = useSelector(childrenSelectors.getChildById(childId));
  const childUser = useSelector(
    childrenSelectors.getChildUserById(child?.userId)
  );
  const reasonsForLeaving = useSelector(
    staticDataSelectors.getReasonsForLeaving
  );
  const history = useHistory();

  const isCoach = userData?.roles?.some((role) => role.name === 'Coach');

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
    appDispatch(childrenActions.deactivateChild(updatedChild));
    appDispatch(
      childrenThunkActions.updateChild({
        child: updatedChild,
        id: String(updatedChild.id),
      })
    ).then(() =>
      appDispatch(
        childrenThunkActions.calculateChildrenRegistrationRemoval(true)
      )
    );

    appDispatch(
      classroomsActions.deactivateClassroomGroupLearner(updatedChild)
    );

    if (isCoach) {
      history.push(ROUTES.COACH.PRACTITIONER_CHILD_LIST, { practitionerId });
      return;
    }
    history.replace(ROUTES.CLASSROOM.ROOT);
  };

  return (
    <BannerWrapper
      size={'small'}
      backgroundColour={'uiBg'}
      className={'overflow-y-auto pb-8'}
      renderBorder={true}
      title={`Remove ${childUser?.firstName} from programme`}
      color={'primary'}
      onBack={() => history.goBack()}
      displayOffline={!isOnline}
    >
      <div className={'px-4 py-4'}>
        <Alert
          type="error"
          title={`${childUser?.firstName} will be removed from the programme immediately`}
          list={[
            `If you remove ${childUser?.firstName} now, you will no longer be able to edit or view this profile.`,
          ]}
          className={'mb-4'}
        />
        <Typography
          type={'h1'}
          text={`Why is ${childUser?.firstName} leaving SmartStart?`}
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
          hint={'Optional'}
          placeholder={'E.g. Did not like the activities'}
        />
        <div className={'py-4'}>
          <Divider></Divider>
        </div>
        <Button
          onClick={() => handleFormSubmit()}
          className="w-full"
          size="small"
          color="errorMain"
          type="filled"
          disabled={!isValid}
        >
          {renderIcon('TrashIcon', classNames('h-5 w-5 text-white'))}
          <Typography
            type="h6"
            className="ml-2"
            text={`Remove ${childUser?.firstName}`}
            color="white"
          />
        </Button>
        <Button
          onClick={() => history.goBack()}
          className="mt-4 w-full"
          size="small"
          color="primary"
          type="outlined"
        >
          {renderIcon('XIcon', classNames('h-5 w-5 text-primary'))}
          <Typography
            type="h6"
            className="ml-2"
            text="Cancel"
            color="primary"
          />
        </Button>
      </div>
    </BannerWrapper>
  );
};

export default RemoveChild;
