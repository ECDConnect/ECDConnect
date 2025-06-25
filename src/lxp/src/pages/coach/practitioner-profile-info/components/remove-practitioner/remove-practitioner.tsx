import {
  ClassroomGroupDto,
  ReasonForLeavingDto,
  ReasonsForPractitionerLeaving,
} from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  BannerWrapper,
  Button,
  Dialog,
  Divider,
  FormInput,
  Typography,
  renderIcon,
  classNames,
  Dropdown,
  Alert,
  DialogPosition,
} from '@ecdlink/ui';
import { useAppDispatch } from '@store/config';
import { authSelectors } from '@store/auth';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useTenant } from '@/hooks/useTenant';
import {
  RemovePractionerModel,
  removePractionerModelSchema,
  initialRemovePractionerValues,
} from '@/schemas/practitioner/remove-practioner';
import * as styles from './remove-practitioner.styles';
import { RemovePractionerProps } from './remove-practitioner.types';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { staticDataSelectors } from '@store/static-data';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory, useLocation } from 'react-router-dom';
import { PractitionerProfileRouteState } from '../../practitioner-profile-info.types';
import { PractitionerService } from '@/services/PractitionerService';
import ROUTES from '@routes/routes';
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';
import { RemovePractitionerPrompt } from './remove-practitioner-prompt';
import { notificationsSelectors } from '@/store/notifications';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';

export const RemovePractioner: React.FC<RemovePractionerProps> = ({
  removeReasonId,
  onSuccess,
}) => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const authUser = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const tenant = useTenant();
  const orgName = tenant?.tenant?.organisationName;
  const location = useLocation<PractitionerProfileRouteState>();
  const reasonsForLeaving = useSelector(
    staticDataSelectors.getReasonsForPractitionerLeaving
  );
  const practitionerUserId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerUserId
  );
  const coachClassrooms = useSelector(
    classroomsForCoachSelectors.getClassroomForCoach
  );
  // TODO - this probably needs an upate
  const practitionerClassroom = coachClassrooms?.find(
    (item) => item.userId === practitionerUserId
  );

  const tempReasonsForLeaving = [...reasonsForLeaving!];

  const itemToMove = tempReasonsForLeaving?.find(
    (item) => item?.description === 'Other'
  );

  if (itemToMove) {
    // Remove the item from its current position
    const index = tempReasonsForLeaving?.indexOf(itemToMove);
    tempReasonsForLeaving?.splice(index!, 1);

    // Push it to the last position
    tempReasonsForLeaving?.push(itemToMove);
  }

  const classroomGroups =
    useSelector(
      classroomsForCoachSelectors.getClassroomGroupsForPractitioner(
        practitionerUserId
      )
    ) || [];

  //Get list of practitioners for classroom
  const practitionersForClass = useMemo<
    { label: string; value: string }[]
  >(() => {
    return (
      ((practitioner?.isPrincipal
        ? practitioners?.filter(
            // If they are the principal, get any practitioners where their principal is this practitioner
            (x) => x.principalHierarchy === practitionerUserId
          )
        : practitioners?.filter(
            // Get other practitioners with the same principal, their principal and not themselves
            (x) =>
              (x.userId === practitioner?.principalHierarchy ||
                x.principalHierarchy === practitioner?.principalHierarchy) &&
              x.userId !== practitionerUserId
          )
      )
        ?.map((p) => {
          if (p?.user?.firstName && p?.user?.surname) {
            return {
              label: `${p?.user?.firstName} ${p?.user?.surname}`,
              value: p.userId,
            };
          }
          return undefined;
        })
        .filter(Boolean) as { label: string; value: string }[]) || []
    );
  }, [practitionerUserId, practitioner, practitioners]);

  const [reasonDetailsVisible, setReasonDetailsVisible] =
    useState<boolean>(false);
  const {
    getValues: getRemovePractionerFormValues,
    setValue: setRemovePractionerFormValues,
    trigger: triggerRemovePractionerForm,
    register: removePractionerFormRegister,
    control: removePractionerFormControl,
  } = useForm<RemovePractionerModel>({
    resolver: yupResolver(removePractionerModelSchema),
    mode: 'onChange',
    defaultValues: !removeReasonId
      ? initialRemovePractionerValues
      : {
          ...initialRemovePractionerValues,
          removeReasonId,
        },
  });

  const { isValid, errors } = useFormState({
    control: removePractionerFormControl,
  });

  const { reassignedClassrooms } = useWatch({
    control: removePractionerFormControl,
  });

  const [removePractionerPromptVisible, setRemovePractionerPromptVisible] =
    useState<boolean>(false);

  const classroomsGroupsForPractitioner = async () => {
    var mappedClasses = classroomGroups.reduce((obj, val) => {
      return { ...obj, [val.id!]: undefined };
    }, {});
    setRemovePractionerFormValues('reassignedClassrooms', mappedClasses);
    triggerRemovePractionerForm();
    return classroomGroups;
  };

  const removalNotifications = useSelector(
    notificationsSelectors.getAllNotifications
  ).filter(
    (item) =>
      (item?.message?.cta?.includes('[[SeeTrainee]]') ||
        item?.message?.cta?.includes('[[SeeSmartStarters]]')) &&
      item?.message?.action?.includes(practitionerUserId) &&
      item?.message?.action.includes('remove')
  );

  const removeNotifications = async () => {
    if (removalNotifications && removalNotifications?.length > 0) {
      removalNotifications.map((notification) => {
        appDispatch(
          disableBackendNotification({
            notificationId: notification.message.reference ?? '',
          })
        );
      });
    }
  };

  useEffect(() => {
    classroomsGroupsForPractitioner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitioner]);

  useEffect(() => {
    if (!practitionersForClass || !practitionersForClass.length) {
      setRemovePractionerFormValues('requireClassReassignments', false);
    } else {
      if (practitioner?.isPrincipal) {
        setRemovePractionerFormValues('requirePrincipal', true);
      }
    }
  }, [practitioner, practitionersForClass]);

  const handleFormSubmit = async (formValues: RemovePractionerModel) => {
    if (isValid) {
      const reassignments = Object.keys(formValues.reassignedClassrooms).map(
        (x) => {
          return {
            classroomGroupId: x,
            practitionerId: formValues.reassignedClassrooms[x],
          };
        }
      );

      await new PractitionerService(
        authUser?.auth_token || ''
      ).RemovePractitioner(
        practitioner?.userId!,
        formValues.removeReasonId,
        formValues.reasonDetail,
        formValues.newPrincipalId,
        reassignments
      );
      await appDispatch(
        practitionerThunkActions.getAllPractitioners({})
      ).unwrap();
    }
  };

  return (
    <>
      <BannerWrapper
        size={'small'}
        renderBorder={true}
        title={`Remove ${practitioner?.user?.firstName}`}
        color={'primary'}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      >
        <div className="flex w-full justify-center">
          <Alert
            className="mt-10 w-11/12 rounded-xl"
            type={'error'}
            title={`${practitioner?.user?.firstName} will be removed from ${orgName} immediately.`}
            list={[
              `If you remove ${practitioner?.user?.firstName} now, they will no longer be able to see child information or perform any actions in the classroom section.`,
            ]}
          />
        </div>
        <div className="py-4' px-4">
          <Typography
            type={'h1'}
            text={`Why is ${practitioner?.user?.firstName} leaving ${orgName}?`}
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
              (tempReasonsForLeaving &&
                tempReasonsForLeaving?.map((x: ReasonForLeavingDto) => {
                  return { label: x.description, value: x.id || '' };
                })) ||
              []
            }
            selectedValue={getRemovePractionerFormValues().removeReasonId}
            onChange={(item) => {
              setRemovePractionerFormValues('removeReasonId', item);
              triggerRemovePractionerForm();
              setReasonDetailsVisible(
                item === ReasonsForPractitionerLeaving.OTHER
              );
            }}
          />
          {reasonDetailsVisible && (
            <FormInput<RemovePractionerModel>
              label={'Explain reason for leaving'}
              className={'mt-3'}
              textInputType="input"
              register={removePractionerFormRegister}
              nameProp={'reasonDetail'}
              placeholder={'E.g. Wants to pursue a different opportunity'}
              error={errors.reasonDetail}
            />
          )}
          {practitioner?.isPrincipal &&
            !!practitionerClassroom &&
            !!practitionersForClass.length && (
              <div>
                <Dropdown
                  placeholder={'Select practitioner'}
                  list={practitionersForClass}
                  fillType="clear"
                  label={`Which practitioner will take over as ${'principal'} at ${
                    practitionerClassroom.name
                  }`}
                  fullWidth
                  onChange={(item: any) => {
                    setRemovePractionerFormValues('newPrincipalId', item);
                  }}
                />
                <div className="flex w-full justify-center">
                  <Alert
                    className="mt-10 rounded-xl"
                    type={'info'}
                    title={
                      'If the programme is closing down, please remove all other practitioners before removing the principal.'
                    }
                  />
                </div>
              </div>
            )}
          {classroomGroups &&
            !!practitionersForClass.length &&
            !!classroomGroups.length && (
              <div>
                <Divider dividerType="dashed" className="my-4" />
                <Typography
                  type={'h1'}
                  text={`Reassign ${practitioner?.user?.firstName} classes`}
                  color={'primary'}
                  className={'pt-1'}
                />
                <label className={classNames(styles.label, 'mt-4')}>
                  {`${practitioner?.user?.firstName} is still assigned to ${
                    classroomGroups.length
                  } ${classroomGroups.length > 1 ? 'classes' : 'class'}`}
                </label>
                <ul>
                  {classroomGroups.map((classroomGroup: ClassroomGroupDto) => {
                    return (
                      <li key={classroomGroup.id}>
                        <Dropdown
                          placeholder={'Select practitioner'}
                          list={practitionersForClass || []}
                          fillType="clear"
                          label={`Which practitioner will teach ${classroomGroup.name}?`}
                          fullWidth
                          className={'mt-3'}
                          onChange={(item: string) => {
                            setRemovePractionerFormValues(
                              'reassignedClassrooms',
                              {
                                ...reassignedClassrooms,
                                [classroomGroup.id as string]: item,
                              }
                            );
                            triggerRemovePractionerForm();
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
                {!!errors.reassignedClassrooms && (
                  <div className="flex w-full justify-center">
                    <Alert
                      className="mt-10 rounded-xl"
                      type={'error'}
                      title={'You must reassign all classes'}
                    />
                  </div>
                )}
              </div>
            )}
          <div className={'py-4'}>
            <Divider></Divider>
          </div>
          <Button
            onClick={() => setRemovePractionerPromptVisible(true)}
            className="w-full"
            size="small"
            color="quatenary"
            type="filled"
            disabled={!isValid}
          >
            {renderIcon('TrashIcon', classNames('h-5 w-5 text-white'))}
            <Typography
              type="h6"
              className="ml-2"
              text={'Remove practitioner'}
              color="white"
            />
          </Button>
          <Button
            onClick={() => history.goBack()}
            className="mt-4 w-full"
            size="small"
            color="quatenary"
            type="outlined"
          >
            {renderIcon('XIcon', classNames('h-5 w-5 text-quatenary'))}
            <Typography
              type="h6"
              className="ml-2"
              text="Cancel"
              color="quatenary"
            />
          </Button>
        </div>
      </BannerWrapper>
      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={removePractionerPromptVisible}
        position={DialogPosition.Bottom}
      >
        <RemovePractitionerPrompt
          practitioner={practitioner}
          onProceed={() => {
            handleFormSubmit(getRemovePractionerFormValues());
            setRemovePractionerPromptVisible(false);
            removeNotifications();
            history.push(ROUTES.COACH.PRACTITIONERS);
            onSuccess();
          }}
          onClose={() => setRemovePractionerPromptVisible(false)}
        />
      </Dialog>
    </>
  );
};

export default RemovePractioner;
