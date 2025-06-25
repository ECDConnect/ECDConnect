import { useMemo, useState, useEffect, useCallback, Fragment } from 'react';
import {
  ComponentBaseProps,
  BannerWrapper,
  Typography,
  Dropdown,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Alert,
  DropDownOption,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import { useHistory, useLocation } from 'react-router';
import { ReassignClassPageState, yesNoOptions } from './reassign-class.types';
import ROUTES from '@routes/routes';
import { addDays, format } from 'date-fns';
import { useStoreSetup } from '@hooks/useStoreSetup';
import {
  ReassignClassModel,
  reassignClassSchema,
} from '@/schemas/practitioner/reassign-class';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import * as styles from './reassign-class.styles';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { ClassroomGroupService } from '@/services/ClassroomGroupService';
import { authSelectors } from '@/store/auth';
import { userSelectors } from '@store/user';
import { classroomsSelectors } from '@/store/classroom';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { TabsItems } from '../../class-dashboard.types';

const absentInfo = [
  {
    id: 1,
    name: 'Sick day',
  },
  {
    id: 2,
    name: 'Clinic appointment',
  },
  {
    id: 3,
    name: 'Funeral at home',
  },
  {
    id: 4,
    name: 'Attending training',
  },
  {
    id: 5,
    name: 'Family commitments',
  },
  {
    id: 6,
    name: 'No reason given',
  },
  {
    id: 7,
    name: 'Other',
  },
];

const multiDaysAbsentInfo = [
  {
    id: 1,
    name: 'Sick',
  },
  {
    id: 2,
    name: 'Family responsibility',
  },
  {
    id: 3,
    name: 'Maternity',
  },
  {
    id: 4,
    name: 'No reason given',
  },
  {
    id: 5,
    name: 'Other',
  },
];

interface reassignedClassroomGroupProps {
  practitioner: string;
  classroomId: string;
  absenteeId?: string;
}

export const ReassignClass: React.FC<ComponentBaseProps> = () => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const { refreshClassroom } = useStoreSetup();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const userData = useSelector(userSelectors.getUser);
  const history = useHistory();

  const { state: routeState } = useLocation<ReassignClassPageState>();
  const practitionersUsers = useSelector(
    practitionerSelectors.getPractitioners
  );
  const practitionerUser = useSelector(practitionerSelectors?.getPractitioner);
  const [practitioners, setPractitioners] = useState(practitionersUsers);
  const principalPractitioner = routeState?.principalPractitioner;
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const reportingDate = routeState?.reportingDate
    ? new Date(routeState?.reportingDate)
    : new Date();
  const practitionerId = routeState?.practitionerId;
  const allAbsenteeClasses = routeState?.allAbsenteeClasses;
  const hasAbsenteeClasses =
    allAbsenteeClasses && allAbsenteeClasses?.length > 0;

  // const isLoggedInUser = practitionerUser?.userId === practitionerId;

  const [selectedLeaveDate, setSelectedLeave] = useState<Date>();
  const currentDate = selectedLeaveDate ? selectedLeaveDate : new Date();

  const formattedDate = reportingDate
    ? format(reportingDate, 'EEEE, d LLLL')
    : '';
  const [isOneDayLeave, setIsOneDayLeave] = useState<boolean | boolean[]>();
  const [principalOrFundaAppAdmin, setPrincipalOrFundaAppAdmin] =
    useState<string>();
  const [otherReason, setOtherReason] = useState('');

  const {
    control,
    // register: reassignClassRegister,
    setValue: setReassignClassValue,
  } = useForm<ReassignClassModel>({
    resolver: yupResolver(reassignClassSchema),
    mode: 'onChange',
    defaultValues: {
      date: new Date().toString(),
      practitioner: practitionerId ? practitionerId : '',
    },
  });
  const [practitionersList, setPractitionersList] = useState<
    DropDownOption<string>[]
  >([]);
  const [practitionersTeachList, setPractitionersTeachList] = useState<
    DropDownOption<string>[]
  >([]);
  const [classroomGroupsList, setClassroomGroupsList] = useState<
    { label: string; value: any }[]
  >([]);
  const [absentInfoList, setAbsentInfoList] = useState<
    { label: string; value: any }[]
  >([]);
  const [multiDaysAbsentInfoList, setMultiDaysAbsentInfoList] = useState<
    { label: string; value: any }[]
  >([]);
  const [reassignedClassroomGroups, setReassignedClassroomGroups] = useState<
    reassignedClassroomGroupProps[]
  >([]);

  const [pracOnLeaveId, setPracOnLeaveId] = useState<string | null>(null);
  const isLoggedInUser = pracOnLeaveId === userData?.id;

  const [endDate, setEndDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const handleReassignClassroomGroupPractitioner = useCallback(
    (classroomGroup: reassignedClassroomGroupProps) => {
      const duplicatedClass = reassignedClassroomGroups?.find(
        (item) =>
          !!item?.classroomId &&
          item?.classroomId === classroomGroup?.classroomId
      );

      const duplicatedAbsentee = reassignedClassroomGroups?.find(
        (item) =>
          !!item?.absenteeId && item?.absenteeId === classroomGroup?.absenteeId
      );

      if (duplicatedClass) {
        const newArray = reassignedClassroomGroups;
        const key = 'classroomId';
        const duplicatedIndex = reassignedClassroomGroups.findIndex(
          (elem) => elem[key] === duplicatedClass?.classroomId
        );
        newArray[duplicatedIndex] = classroomGroup;
        setReassignedClassroomGroups(newArray);
        return;
      }

      if (duplicatedAbsentee) {
        const newArray = reassignedClassroomGroups?.filter(
          (item) => item?.absenteeId !== duplicatedAbsentee?.absenteeId
        );
        return setReassignedClassroomGroups([...newArray, classroomGroup]);
      }

      setReassignedClassroomGroups([
        ...reassignedClassroomGroups,
        classroomGroup,
      ]);
    },
    [reassignedClassroomGroups]
  );

  const {
    date: selectedDate,
    practitioner,
    reason,
    practitioner2,
  } = useWatch({
    control: control,
  });

  const practitionerClassroomGroups = useMemo(
    () =>
      classroomGroups?.filter(
        (item) => item?.userId === practitioner && item?.name !== 'Unsure'
      ),
    [classroomGroups, practitioner]
  );

  const disableButton =
    isLoading ||
    (!isOneDayLeave && !endDate) ||
    !practitioner ||
    !selectedDate ||
    !reason ||
    (practitionerClassroomGroups?.length > 0 &&
      reassignedClassroomGroups?.length !==
        practitionerClassroomGroups?.length);

  const reasonPayload = reason === 'Other' ? otherReason : reason;

  const onBack = () => {
    if (routeState?.principalPractitioner) {
      return history.push(ROUTES.PRACTITIONER.PROFILE.ROOT);
    }

    if (routeState?.isFromEditPractitionersPage) {
      return history.push(ROUTES.PRINCIPAL.PRACTITIONER_LIST, {
        ...routeState,
      });
    }

    if (routeState?.isFromPrincipalPractitionerProfile) {
      return history.push(ROUTES.PRINCIPAL.PRACTITIONER_PROFILE, {
        practitionerId,
      });
    }

    return history.push(ROUTES.BUSINESS);
  };

  useEffect(() => {
    if (principalPractitioner) {
      if (practitioners) {
        setPractitioners([...practitioners, principalPractitioner]);
      }
    }
  }, [routeState?.practitionerId]);

  useEffect(() => {
    if (hasAbsenteeClasses) {
      if (
        allAbsenteeClasses?.[0]?.absentDate ===
        allAbsenteeClasses?.[0]?.absentDateEnd
      ) {
        setIsOneDayLeave(true);
      } else {
        setIsOneDayLeave(false);
      }

      setReassignClassValue(
        'date',
        allAbsenteeClasses?.[0]?.absentDate
          ? allAbsenteeClasses?.[0]?.absentDate.toString()
          : ''
      );
      setEndDate(new Date(allAbsenteeClasses?.[0]?.absentDateEnd as string));

      setReassignClassValue('reason', allAbsenteeClasses?.[0]?.reason);

      setReassignedClassroomGroups(
        allAbsenteeClasses?.map((item) => ({
          classroomId:
            practitionerClassroomGroups?.find(
              (group) => group?.name === item?.className
            )?.classroomId || '',
          practitioner: item.reassignedToUserId!,
          absenteeId: item.absenteeId,
        })) ?? []
      );

      if (
        principalPractitioner &&
        allAbsenteeClasses?.[0]?.reassignedToUserId
      ) {
        setPrincipalOrFundaAppAdmin(
          allAbsenteeClasses?.[0]?.reassignedToUserId!
        );
      }
    }
  }, [routeState?.practitionerId]);

  const practitionerAbsent = useMemo(() => {
    if (practitionerUser?.userId === practitioner) {
      return practitionerUser;
    }

    return practitioners?.find((item) => {
      if (item?.userId === practitioner) {
        return item;
      } else return null;
    });
  }, [practitioner, practitionerUser, practitioners]);

  const practitionerPresent = useMemo(() => {
    if (practitionerUser?.userId === practitioner) {
      return practitionerUser;
    }

    return practitioners?.find((item) => {
      if (item?.userId === practitioner2) {
        return item?.user?.fullName;
      } else return null;
    });
  }, [practitioner2, practitioners]);

  useEffect(() => {
    const _list =
      [...(practitioners ?? []), practitionerUser]
        ?.filter((p) => !!p?.user?.firstName)
        ?.map(
          (p): DropDownOption<string> =>
            ({
              label: `${p?.user?.firstName} ${p?.user?.surname ?? ''}`,
              value: p?.userId!,
            } as DropDownOption<string>)
        ) ?? [];

    setPractitionersList(_list);
    setPractitionersTeachList(
      _list?.filter((item) => item?.value !== String(practitionerId))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitioners]);

  useEffect(() => {
    const _list = absentInfo?.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
    setAbsentInfoList(_list);
  }, []);

  useEffect(() => {
    const _list = multiDaysAbsentInfo?.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
    setMultiDaysAbsentInfoList(_list);
  }, []);

  useEffect(() => {
    const _list = practitionerClassroomGroups
      ?.map((p) => {
        if (p?.name) {
          return {
            label: `${p?.name}`,
            value: p.id,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    setClassroomGroupsList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper function to format practitioner label
  const formatPractitionerLabel = (
    firstName: string | undefined,
    surname: string | undefined
  ): string => `${firstName ?? ''} ${surname ?? ''}`.trim();

  // Filter practitioners who don't have absentee dates matching the current date
  const filteredPractitioners: DropDownOption<string>[] = [
    ...(practitioners ?? []),
    practitionerUser,
  ]
    .filter((practitioner) => {
      const absentees = practitioner?.absentees ?? [];
      // Check if any absentee date matches the current date
      return !absentees.some((absentee) => {
        const absenteeDate = absentee.absentDateEnd
          ? new Date(absentee.absentDateEnd)
          : new Date();
        return absenteeDate.toDateString() === currentDate.toDateString();
      });
    })
    .map((practitioner) => ({
      label: formatPractitionerLabel(
        practitioner?.user?.firstName,
        practitioner?.user?.surname
      ),
      value: practitioner?.userId ?? '',
    }));

  const submitReassignClass = async () => {
    if (!userAuth?.auth_token || !selectedDate || !userData?.id) {
      return;
    }

    setIsLoading(true);

    const processReassignment = async (item: any) => {
      const service = new ClassroomGroupService(userAuth.auth_token);
      const startDate = new Date(selectedDate);
      const endDateToUse = isOneDayLeave ? startDate : endDate || startDate;

      if (item?.absenteeId) {
        await service.editAbsentee(
          item.absenteeId,
          false,
          item.practitioner,
          reasonPayload,
          startDate,
          endDateToUse,
          !!principalOrFundaAppAdmin,
          principalOrFundaAppAdmin
        );
      } else {
        await service.updateReassignClassroomGroup(
          practitioner,
          item?.practitioner,
          reasonPayload,
          startDate,
          userData.id!,
          item?.classroomId,
          endDateToUse,
          '',
          '',
          principalOrFundaAppAdmin
        );
      }
    };

    const handleReassignments = async () => {
      if (reassignedClassroomGroups?.length > 0) {
        for (const item of reassignedClassroomGroups) {
          await processReassignment(item);
        }
      } else if (allAbsenteeClasses?.[0]?.absenteeId) {
        await processReassignment(allAbsenteeClasses[0]);
      } else {
        const service = new ClassroomGroupService(userAuth.auth_token);
        const startDate = new Date(selectedDate);
        const endDateToUse = isOneDayLeave ? startDate : endDate || startDate;

        await service.updateReassignClassroomGroup(
          practitioner,
          practitioner2,
          reasonPayload,
          startDate,
          userData.id!,
          '',
          endDateToUse,
          '',
          '',
          principalOrFundaAppAdmin
        );
      }
    };

    await handleReassignments();
    await refreshClassroom();
    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();

    if (isLoggedInUser) {
      await appDispatch(
        practitionerThunkActions.getPractitionerByUserId({
          userId: pracOnLeaveId!,
        })
      ).unwrap();
    }

    setIsLoading(false);

    const redirectTo = isLoggedInUser
      ? ROUTES.PRACTITIONER.PROFILE.ROOT
      : ROUTES.PRINCIPAL.PRACTITIONER_PROFILE;
    const redirectState = { practitionerId: pracOnLeaveId };
    history.push(redirectTo, redirectState);
  };

  useEffect(() => {
    if (routeState?.practitionerId !== undefined) {
      setPracOnLeaveId(routeState?.practitionerId);
    }
  }, []);

  return (
    <BannerWrapper
      title={`Record absence/leave`}
      subTitle={`${
        formattedDate ? formattedDate : format(new Date(), 'EEEE, d LLLL')
      }`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={onBack}
      onClose={onBack}
      displayOffline={!isOnline}
    >
      <div className="mb-3 flex h-full w-full flex-col p-4 pt-6">
        <Typography type="h2" color="textMid" text={'Record absence/leave'} />
        <Dropdown<string>
          placeholder={'Select practitioner'}
          list={practitionersList || []}
          fillType="clear"
          label={'Which practitioner is taking leave'}
          fullWidth
          className={'mt-3 w-full'}
          selectedValue={practitioner}
          onChange={(item: any) => {
            setPracOnLeaveId(item);
            setReassignClassValue('practitioner', item);
            setPractitionersTeachList(
              practitionersList.filter((prac) => prac.value !== item)
            );
          }}
          disabled={
            hasAbsenteeClasses ||
            principalPractitioner !== undefined ||
            !!routeState?.practitionerId
          }
        />
        <label className={styles.label}>
          Will the practitioner be absent for one day or longer?
        </label>
        <ButtonGroup<boolean>
          options={yesNoOptions}
          onOptionSelected={(value) => {
            setEndDate(undefined);
            setIsOneDayLeave(value);
          }}
          selectedOptions={isOneDayLeave}
          color="secondary"
          type={ButtonGroupTypes.Button}
          className={`w-full ${
            allAbsenteeClasses &&
            allAbsenteeClasses?.length > 0 &&
            'pointer-events-none opacity-50'
          }`}
        />
        {isOneDayLeave !== undefined && (
          <>
            {isOneDayLeave ? (
              <label className="text-md text-textDark mt-2 mb-1 block w-full font-medium">
                What day will the practitioner be absent?
              </label>
            ) : (
              <label className="text-md text-textDark mt-2 mb-1 block w-full font-medium">
                First day of leave
              </label>
            )}
            <DatePicker
              placeholderText={`Please select a date`}
              wrapperClassName="text-center w-full"
              className="border-uiLight text-textMid mx-auto w-full rounded-md"
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onChange={(date: Date) => {
                setSelectedLeave(date);
                setReassignClassValue('date', date ? date.toString() : '');
              }}
              dateFormat="EEE, dd MMM yyyy"
              minDate={new Date()}
            />
            {!isOneDayLeave && (
              <>
                <label className="text-md text-textDark mt-2 mb-1 block w-full font-medium">
                  Last day of leave
                </label>
                <DatePicker
                  placeholderText={`Please select a date`}
                  wrapperClassName="text-center w-full"
                  className="border-uiLight text-textMid mx-auto w-full rounded-md"
                  selected={endDate ? new Date(endDate) : undefined}
                  onChange={(date: Date) => {
                    setEndDate(
                      new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        12
                      )
                    );
                  }}
                  dateFormat="EEE, dd MMM yyyy"
                  minDate={addDays(new Date(selectedDate as string), 1)}
                />
              </>
            )}
            <Dropdown
              placeholder={'Select reason'}
              list={isOneDayLeave ? absentInfoList : multiDaysAbsentInfoList}
              fillType="clear"
              label={'Reason for absence'}
              fullWidth
              className={'mt-3 w-full'}
              selectedValue={reason}
              onChange={(item: any) => {
                setReassignClassValue('reason', item);
              }}
            />
            {reason === 'Other' && (
              <FormInput
                className="my-4 w-full"
                label="Add short description of reason"
                onChange={(e) => setOtherReason(e.target.value)}
                textInputType="input"
                value={otherReason}
                placeholder={'e.g. personal appointment'}
              />
            )}
            {allAbsenteeClasses && allAbsenteeClasses?.length > 0
              ? allAbsenteeClasses?.map((item, index) => {
                  if (!item?.className) return null;

                  const classroomId =
                    practitionerClassroomGroups?.find(
                      (group) => group?.name === item?.className
                    )?.classroomId || '';
                  const absenteeId = item?.absenteeId;

                  const selectedPractitionerId =
                    reassignedClassroomGroups?.find(
                      (group) => group?.absenteeId === absenteeId
                    )?.practitioner;

                  const selectedPractitioner = [
                    ...(practitioners ?? []),
                    practitionerUser,
                  ]?.find((item) => {
                    if (item?.userId === selectedPractitionerId) {
                      return item;
                    } else return null;
                  });

                  return (
                    <>
                      <Dropdown
                        key={index}
                        placeholder={'Select practitioner'}
                        list={practitionersTeachList || []}
                        fillType="clear"
                        label={`Who will teach the ${item?.className} class instead?`}
                        fullWidth
                        className={'mt-3 w-full pb-4'}
                        selectedValue={selectedPractitionerId}
                        onChange={(practitioner: any) => {
                          const reassignedData = {
                            practitioner,
                            classroomId,
                            absenteeId,
                          };

                          setReassignClassValue('practitioner2', practitioner);
                          handleReassignClassroomGroupPractitioner(
                            reassignedData
                          );
                        }}
                      />
                      {selectedPractitioner && (
                        <Alert
                          className={'mb-3'}
                          title={`You are reassigning ${
                            practitionerAbsent?.user?.fullName || ''
                          }'s ${item?.className} class to ${
                            selectedPractitioner?.user?.firstName || ''
                          } from ${format(
                            new Date(selectedDate!),
                            'EEEE, d LLLL'
                          )}${
                            !!endDate
                              ? ` to ${format(
                                  new Date(endDate),
                                  'EEEE, d LLLL'
                                )}`
                              : ''
                          }.`}
                          type={'info'}
                        />
                      )}
                    </>
                  );
                })
              : practitionerClassroomGroups.length > 0 &&
                practitionersTeachList?.length > 0 &&
                practitionerClassroomGroups?.map((item, index) => {
                  const classroomId = item?.id!;

                  const practitionerId = [...reassignedClassroomGroups]?.[index]
                    ?.practitioner;
                  const selectedPractitioner = practitionersTeachList?.find(
                    (currentPractitioner) =>
                      currentPractitioner.value === practitionerId
                  );

                  return (
                    <Fragment key={index}>
                      <Dropdown
                        key={index}
                        placeholder={'Select practitioner'}
                        list={
                          filteredPractitioners.filter(
                            (practitioner: any) =>
                              practitioner.value !== pracOnLeaveId
                          ) ?? []
                        }
                        fillType="clear"
                        label={`Who will teach the ${item?.name} class instead?`}
                        fullWidth
                        className={'mt-3 w-full'}
                        onChange={(practitioner: any) => {
                          const reassignedData = {
                            practitioner,
                            classroomId,
                          };
                          setReassignClassValue('practitioner2', practitioner);
                          handleReassignClassroomGroupPractitioner(
                            reassignedData
                          );
                          setPractitionersTeachList(
                            practitionersList.filter(
                              (prac) => practitioner.value !== item
                            )
                          );
                        }}
                        selectedValue={practitionerId}
                      />
                      {selectedPractitioner && (
                        <Alert
                          className={'mt-5 mb-3'}
                          title={`You are reassigning ${
                            practitionerAbsent?.user?.firstName || ''
                          }'s ${item?.name} class to ${
                            selectedPractitioner?.label || ''
                          } from ${format(
                            new Date(selectedDate!),
                            'EEEE, d LLLL'
                          )}${
                            !!endDate
                              ? ` to ${format(
                                  new Date(endDate),
                                  'EEEE, d LLLL'
                                )}`
                              : ''
                          }.`}
                          type={'info'}
                        />
                      )}
                    </Fragment>
                  );
                })}
            {!reassignedClassroomGroups?.length &&
              practitionerClassroomGroups?.length === 0 &&
              practitionerAbsent &&
              !isLoading && (
                <Alert
                  className={'mt-5 mb-3'}
                  title="No class reassignment needed."
                  list={[
                    `${practitionerAbsent?.user?.firstName} is not currently assigned to a class.`,
                  ]}
                  type={'success'}
                />
              )}
          </>
        )}

        <Button
          type="filled"
          color="quatenary"
          className={'mx-auto mt-auto w-full rounded-xl'}
          onClick={submitReassignClass}
          disabled={disableButton}
          isLoading={isLoading}
          icon="SaveIcon"
          text="Save"
          textColor="white"
        />
      </div>
    </BannerWrapper>
  );
};

export default ReassignClass;
