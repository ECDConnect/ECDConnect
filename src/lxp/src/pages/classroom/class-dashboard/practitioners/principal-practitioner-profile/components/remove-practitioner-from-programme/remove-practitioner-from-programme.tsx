import {
  ReasonForLeavingDto,
  ReasonsForPractitionerLeavingProgramme,
  useSnackbar,
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
  DatePicker,
  DialogPosition,
} from '@ecdlink/ui';
import { useAppDispatch } from '@store/config';
import { authSelectors } from '@store/auth';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as styles from './remove-practitioner-from-programme.styles';
import { RemovePractionerFromProgrammeProps } from './remove-practitioner-from-programme.types';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { staticDataSelectors } from '@store/static-data';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory, useLocation } from 'react-router-dom';
import { PractitionerProfileRouteState } from '../../../../../../coach/practitioner-profile-info/practitioner-profile-info.types';
import { PractitionerService } from '@/services/PractitionerService';
import ROUTES from '@routes/routes';
import { RemovePractitionerFromProgrammePrompt } from './remove-practitioner-from-programme-prompt';
import { classroomsSelectors } from '@/store/classroom';
import {
  RemovePractionerFromProgrammeModel,
  initialRemovePractionerFromProgrammeValues,
  removePractitionerFromProgrammeModelSchema,
} from '@/schemas/practitioner/remove-practioner-from-programme';
import { notificationsSelectors } from '@/store/notifications';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';
import { PractitionerNotRegistered } from '../../practitioner-not-registered/practitioner-not-registered';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { BusinessTabItems } from '@/pages/business/business.types';

export const RemovePractitionerFromProgramme: React.FC<
  RemovePractionerFromProgrammeProps
> = () => {
  const appDispatch = useAppDispatch();
  const { showMessage } = useSnackbar();
  const history = useHistory();
  const authUser = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const reasonsForLeavingProgramme = useSelector(
    staticDataSelectors.getReasonsForPractitionerLeavingProgramme
  );
  const practitionerUserId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerUserId
  );
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const principalPractitioner = useSelector(
    practitionerSelectors.getPractitioner
  );

  const tempReasonsForLeaving = [...reasonsForLeavingProgramme!];

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

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  //Get list of practitioners for classroom
  const practitionersForClass = useMemo(
    () =>
      practitioner?.isPrincipal
        ? practitioners?.filter(
            (x) => x.principalHierarchy === practitionerUserId
          ) // If they are the principal, get any practitioners where their principal is this practitioner
        : practitioners?.filter(
            (x) =>
              (x.userId === practitioner?.principalHierarchy ||
                x.principalHierarchy === practitioner?.principalHierarchy) &&
              x.userId !== practitionerUserId
          ), // Get other practitioners with the same principal, their principal and not themselves
    [practitionerUserId, practitioner, practitioners]
  );

  const [reasonDetailsVisible, setReasonDetailsVisible] =
    useState<boolean>(false);

  const removalNotifications = useSelector(
    notificationsSelectors.getAllNotifications
  ).filter(
    (item) =>
      item?.message?.cta?.includes('[[RemovePractitioner]]') &&
      practitioner?.id &&
      item?.message?.action?.includes(practitioner.id)
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

  const {
    getValues: getRemovePractionerFormValues,
    setValue: setRemovePractionerFormValues,
    reset: resetFormValues,
    trigger: triggerRemovePractionerForm,
    register: removePractionerFormRegister,
    control: removePractionerFormControl,
  } = useForm<RemovePractionerFromProgrammeModel>({
    resolver: yupResolver(removePractitionerFromProgrammeModelSchema),
    mode: 'onChange',
    defaultValues: initialRemovePractionerFromProgrammeValues,
  });

  const { isValid, errors } = useFormState({
    control: removePractionerFormControl,
  });

  const { removalDate } = useWatch({
    control: removePractionerFormControl,
  });

  const [removePractionerPromptVisible, setRemovePractionerPromptVisible] =
    useState<boolean>(false);

  const [practitionersList, setPractitionersList] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const _list = practitionersForClass
      ?.map((p) => {
        if (p?.user?.firstName && p?.user?.surname) {
          return {
            label: `${p?.user?.firstName} ${p?.user?.surname}`,
            value: p.userId,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: string }[];

    if (principalPractitioner?.isPrincipal && principalPractitioner?.userId) {
      _list?.push({
        label: `${principalPractitioner?.user?.firstName} ${
          principalPractitioner?.user?.surname ||
          principalPractitioner?.user?.userName
        }`,
        value: principalPractitioner.userId,
      });
    }

    setPractitionersList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitionersForClass]);

  const [practitionerClassroomGroups, setPractitionerClassroomGroups] =
    useState<ClassroomGroupDto[]>();

  const classroomsGroupsForPractitioner = async () => {
    const classroomDetails = classroomGroups?.filter(
      (item: ClassroomGroupDto) => {
        return item?.userId === practitioner?.userId;
      }
    );

    setPractitionerClassroomGroups(classroomDetails);
    var mappedClasses = classroomDetails.reduce((obj, val) => {
      return { ...obj, [val.id!]: undefined };
    }, {});
    setRemovePractionerFormValues('reassignedClassrooms', mappedClasses);
    triggerRemovePractionerForm();
    return classroomDetails;
  };

  const [existingRemovalId, setExistingRemovalId] = useState<
    string | undefined
  >();
  const [existingRemovalReassignments, setExistingRemovalReassignments] =
    useState<any[]>();

  const getRemovalForPractitioner = async () => {
    const removalDetails = await new PractitionerService(
      authUser?.auth_token!
    ).getRemovalForPractitioner(practitioner?.userId!);
    if (removalDetails) {
      const reassignments = (removalDetails.classReassignments || []).reduce(
        (obj, item) => {
          if (!item) {
            return { ...obj };
          }
          const id = item.id;
          const practionerUserId = item.reassignedToPractitioner;
          const classroomGroupId = item.reassignedClass;
          return {
            ...obj,
            [item?.reassignedClass!]: {
              id,
              practionerUserId,
              classroomGroupId,
            },
          };
        },
        {}
      );

      const formValues = {
        reasonDetail: removalDetails.reasonDetails || '',
        removeReasonId: removalDetails.reasonForPractitionerLeavingProgrammeId,
        removalDate: removalDetails.dateOfRemoval,
        reassignedClassrooms: reassignments,
      };
      resetFormValues(formValues);
      setExistingRemovalId(removalDetails.id);
      setExistingRemovalReassignments(removalDetails.classReassignments || []);
    }

    return removalDetails;
  };

  useEffect(() => {
    classroomsGroupsForPractitioner();
    getRemovalForPractitioner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = async (
    formValues: RemovePractionerFromProgrammeModel
  ) => {
    if (isValid) {
      const formReassignments = formValues.reassignedClassrooms || {};
      const reassignments = Object.keys(formReassignments).map((x) => {
        return {
          id: formReassignments[x]?.id,
          classroomGroupId: x,
          practitionerId: formReassignments[x]?.practitionerUserId,
        };
      });

      if (existingRemovalId) {
        await new PractitionerService(
          authUser?.auth_token || ''
        ).updateRemovePractitionerFromProgramme(
          existingRemovalId,
          formValues.removeReasonId,
          formValues.reasonDetail,
          new Date(formValues.removalDate),
          reassignments
        );
      } else {
        await new PractitionerService(
          authUser?.auth_token || ''
        ).RemovePractitionerFromProgramme(
          practitioner?.userId!,
          formValues.removeReasonId,
          formValues.reasonDetail,
          classroom?.id || '',
          new Date(formValues.removalDate),
          reassignments
        );
      }
      await appDispatch(
        practitionerThunkActions.getAllPractitioners({})
      ).unwrap();
    }
  };

  return (
    <>
      {practitioner?.isRegistered === null ||
      practitioner?.isRegistered === false ? (
        <PractitionerNotRegistered practitioner={practitioner} />
      ) : (
        <>
          <BannerWrapper
            size={'small'}
            renderBorder={true}
            title={`Remove ${practitioner?.user?.firstName}`}
            color={'primary'}
            displayOffline={!isOnline}
            onBack={() => history.goBack()}
          >
            <div className="py-4' mt-4 px-4">
              <Typography
                type={'h1'}
                text={`Why is ${
                  practitioner?.user?.firstName || practitioner?.user?.userName
                } leaving ${classroom?.name}?`}
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
                    tempReasonsForLeaving.map((x: ReasonForLeavingDto) => {
                      return { label: x.description, value: x.id || '' };
                    })) ||
                  []
                }
                selectedValue={getRemovePractionerFormValues().removeReasonId}
                onChange={(item) => {
                  setRemovePractionerFormValues('removeReasonId', item);
                  triggerRemovePractionerForm();
                  setReasonDetailsVisible(
                    item === ReasonsForPractitionerLeavingProgramme.OTHER
                  );
                }}
              />
              {reasonDetailsVisible && (
                <FormInput<RemovePractionerFromProgrammeModel>
                  label={'Please specify the reason for leaving'}
                  className={'mt-3'}
                  textInputType="input"
                  register={removePractionerFormRegister}
                  nameProp={'reasonDetail'}
                  placeholder={'Retiring from work'}
                  error={errors.reasonDetail}
                />
              )}
              <label className="text-md text-textDark mt-2 mb-1 block w-11/12 font-medium">
                {`When would you like ${
                  practitioner?.user?.firstName || practitioner?.user?.userName
                } to be removed?`}
              </label>
              <div className="mb-3 flex w-full flex-wrap justify-center">
                <DatePicker
                  placeholderText={'Choose a date'}
                  wrapperClassName="text-center"
                  hideCalendarIcon={false}
                  className="border-uiLight text-textMid mx-auto w-full rounded-md"
                  selected={removalDate ? new Date(removalDate) : undefined}
                  onChange={(date) => {
                    setRemovePractionerFormValues(
                      'removalDate',
                      date
                        ? new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate(),
                            12
                          ).toString()
                        : ''
                    );
                    triggerRemovePractionerForm();
                  }}
                  minDate={tomorrow}
                  dateFormat="EEE, dd MMM yyyy"
                />
              </div>
              {!!practitionerClassroomGroups &&
                !!practitionerClassroomGroups.length &&
                practitionersList &&
                practitionersList.length && (
                  <div>
                    <Divider dividerType="dashed" className="my-4" />
                    <Typography
                      type={'h2'}
                      text={`Reassign ${practitioner?.user?.firstName} classes`}
                      color={'primary'}
                      className={'pt-1'}
                    />
                    <label className={classNames(styles.label, 'mt-4')}>
                      {`${
                        practitioner?.user?.firstName ||
                        practitioner?.user?.userName
                      } is still assigned to ${
                        practitionerClassroomGroups.length
                      } ${
                        practitionerClassroomGroups.length > 1
                          ? 'classes'
                          : 'class'
                      }`}
                    </label>
                    <ul>
                      {practitionerClassroomGroups.map(function (
                        classroomGroup: ClassroomGroupDto
                      ) {
                        return (
                          <li key={classroomGroup.id}>
                            <Dropdown
                              selectedValue={
                                existingRemovalReassignments?.find(
                                  (x) =>
                                    x?.reassignedClass === classroomGroup.id
                                )?.reassignedToPractitioner
                              }
                              placeholder={'Choose a practitioner'}
                              list={practitionersList || []}
                              fillType="clear"
                              label={`Which practitioner will teach ${classroomGroup.name}?`}
                              fullWidth
                              className={'mt-3 w-full'}
                              onChange={(item: any) => {
                                const existingReassignments =
                                  getRemovePractionerFormValues()
                                    .reassignedClassrooms || {};
                                const newData = {
                                  ...existingReassignments,
                                  [classroomGroup.id as string]: {
                                    ...existingReassignments[
                                      classroomGroup.id as string
                                    ],
                                    practitionerUserId: item,
                                  },
                                };
                                setRemovePractionerFormValues(
                                  'reassignedClassrooms',
                                  newData
                                );

                                const index = (
                                  existingRemovalReassignments || []
                                ).findIndex(
                                  (x) =>
                                    x?.reassignedClass === classroomGroup.id
                                );
                                const updatedReassignments =
                                  index === -1
                                    ? (
                                        existingRemovalReassignments || []
                                      ).concat({
                                        id: undefined,
                                        reassignedToPractitioner: item,
                                        reassignedClass: classroomGroup.id,
                                      })
                                    : [
                                        ...existingRemovalReassignments!.slice(
                                          0,
                                          index
                                        ),
                                        {
                                          ...existingRemovalReassignments?.[
                                            index
                                          ],
                                          reassignedToPractitioner: item,
                                        },
                                        ...existingRemovalReassignments!.slice(
                                          index + 1
                                        ),
                                      ];

                                setExistingRemovalReassignments(
                                  updatedReassignments
                                );
                                triggerRemovePractionerForm();
                              }}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              <div className="flex w-full justify-center">
                <Alert
                  className="mt-5 rounded-xl"
                  type={'error'}
                  title={`${
                    practitioner?.user?.firstName ||
                    practitioner?.user?.userName
                  } will be removed from the programme on this date`}
                  list={[
                    `${
                      practitioner?.user?.firstName ||
                      practitioner?.user?.userName
                    } will no longer be able to see child information.`,
                  ]}
                />
              </div>
              <div className={'py-4'}></div>
              <Button
                onClick={() => setRemovePractionerPromptVisible(true)}
                className="mb-2 w-full"
                size="small"
                color="quatenary"
                type="filled"
                disabled={!isValid}
              >
                {renderIcon('TrashIcon', classNames('h-5 w-5 text-white'))}
                <Typography
                  type="h6"
                  className="ml-2"
                  text={'Remove Practitioner'}
                  color="white"
                />
              </Button>
              <Button
                onClick={() => history.goBack()}
                className="mb-4 w-full"
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
            position={DialogPosition.Middle}
          >
            <RemovePractitionerFromProgrammePrompt
              practitioner={practitioner}
              leavingDate={removalDate as Date}
              onProceed={() => {
                removeNotifications();
                handleFormSubmit(getRemovePractionerFormValues());
                setRemovePractionerPromptVisible(false);
                history.push(ROUTES.BUSINESS, {
                  activeTabIndex: BusinessTabItems.STAFF,
                });
                showMessage({
                  message: `${practitioner?.user?.firstName} removed`,
                });
              }}
              onClose={() => setRemovePractionerPromptVisible(false)}
            />
          </Dialog>
        </>
      )}
    </>
  );
};

export default RemovePractitionerFromProgramme;
