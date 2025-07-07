import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  ComponentBaseProps,
  BannerWrapper,
  Typography,
  Dropdown,
  renderIcon,
  Button,
  FormInput,
  Alert,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import { useHistory, useLocation } from 'react-router';
import { ReassignClassPageState } from './coach-reassign-class.types';
import ROUTES from '@routes/routes';
import { format } from 'date-fns';
import { useStoreSetup } from '@hooks/useStoreSetup';
import {
  ReassignClassModel,
  reassignClassSchema,
} from '@/schemas/practitioner/reassign-class';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import * as styles from './coach-reassign-class.styles';
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
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { useAppDispatch } from '@/store';

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

export const CoachReassignClass: React.FC<ComponentBaseProps> = () => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const { refreshClassroom } = useStoreSetup();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const userData = useSelector(userSelectors.getUser);
  const history = useHistory();
  const { state: routeState } = useLocation<ReassignClassPageState>();
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const absenteePractitioner = useSelector(
    getPractitionerByUserId(String(routeState?.practitionerId) || '')
  );
  const principalPractitioners = practitioners?.filter(
    (item) => item?.principalHierarchy === absenteePractitioner?.userId
  );
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitionerId = routeState?.practitionerId;
  const allAbsenteeClasses = routeState?.allAbsenteeClasses;
  const hasAbsenteeClasses =
    allAbsenteeClasses && allAbsenteeClasses?.length > 0;
  const [isLoading, setIsLoading] = useState(false);

  const { control, setValue: setReassignClassValue } =
    useForm<ReassignClassModel>({
      resolver: yupResolver(reassignClassSchema),
      mode: 'onChange',
      defaultValues: {
        date: new Date().toString(),
        practitioner: practitionerId ? practitionerId : '',
      },
    });
  const [practitionersList, setPractitionersList] = useState<
    { label: string; value: any }[]
  >([]);
  const [practitionersTeachList, setPractitionersTeachList] = useState<
    { label: string; value: any }[]
  >([]);
  const [classroomGroupsList, setClassroomGroupsList] = useState<
    { label: string; value: any }[]
  >([]);
  const [multiDaysAbsentInfoList, setMultiDaysAbsentInfoList] = useState<
    { label: string; value: any }[]
  >([]);
  const [reassignedClassroomGroups, setReassignedClassroomGroups] = useState<
    reassignedClassroomGroupProps[]
  >([]);
  const [principalOrFundaAppAdmin, setPrincipalOrFundaAppAdmin] = useState();
  const [endDate, setEndDate] = useState<Date>();
  const [otherReason, setOtherReason] = useState('');

  const handleReassignClassroomGroupPractitioner = useCallback(
    (classroomGroup: reassignedClassroomGroupProps) => {
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

  const reasonPayload = reason === 'Other' ? otherReason : reason;

  const practitionerClassroomGroups = useMemo(
    () =>
      classroomGroups?.filter(
        (item) => item?.userId === absenteePractitioner?.userId
      ),
    []
  );

  const disableButton =
    !reason ||
    !selectedDate ||
    !endDate ||
    (!principalOrFundaAppAdmin &&
      principalPractitioners &&
      principalPractitioners?.length > 0) ||
    (practitionerClassroomGroups?.length > 0 &&
      reassignedClassroomGroups?.length !==
        practitionerClassroomGroups?.length &&
      practitionersTeachList?.length > 0);

  // TODO - fix this
  const practitionerProgramme = useMemo(
    () => practitionerClassroomGroups?.[0]?.name,
    [practitionerClassroomGroups]
  );

  const practitionerAbsentName = useMemo(() => {
    return practitioners?.find((item) => {
      if (item?.userId === practitioner) {
        return item?.user?.fullName;
      } else return null;
    });
  }, [practitioner, practitioners]);

  const principalOrFundaAppAdminPractitioner = useMemo(() => {
    return practitioners?.find((item) => {
      if (item?.userId === principalOrFundaAppAdmin) {
        return item?.user?.fullName;
      } else return null;
    });
  }, [practitioners, principalOrFundaAppAdmin]);

  const practitionerPresentName = useMemo(() => {
    return principalPractitioners?.find((item) => {
      if (item?.userId === practitioner2) {
        return item?.user?.fullName;
      } else return null;
    });
  }, [practitioner2, principalPractitioners]);

  useEffect(() => {
    const _list = principalPractitioners
      ?.map((p) => {
        if (p?.user?.firstName && p?.user?.surname) {
          return {
            label: `${p?.user?.firstName} ${p?.user?.surname}`,
            value: p.userId,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    setPractitionersList(_list);
    setPractitionersTeachList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    if (hasAbsenteeClasses) {
      setReassignClassValue(
        'date',
        allAbsenteeClasses?.[0]?.absentDate
          ? allAbsenteeClasses?.[0]?.absentDate.toString()
          : ''
      );
      setEndDate(allAbsenteeClasses?.[0]?.absentDateEnd as Date);

      setReassignClassValue('reason', allAbsenteeClasses?.[0]?.reason);

      if (allAbsenteeClasses?.[0]?.reassignedToUserId) {
        setPrincipalOrFundaAppAdmin(
          allAbsenteeClasses?.[0]?.reassignedToUserId as any
        );
      }
    }
  }, []);

  const submitReassignClass = async () => {
    if (
      userAuth?.auth_token &&
      selectedDate &&
      userData?.id &&
      reassignedClassroomGroups?.length > 0
    ) {
      reassignedClassroomGroups?.map(async (item) => {
        setIsLoading(true);
        if (item?.absenteeId) {
          await new ClassroomGroupService(userAuth.auth_token).editAbsentee(
            item?.absenteeId,
            false,
            item?.practitioner,
            reasonPayload,
            new Date(selectedDate),
            endDate || new Date(selectedDate),
            true,
            principalOrFundaAppAdmin
          );

          dispatch(practitionerThunkActions?.getAllPractitioners({})).unwrap();
          await refreshClassroom();
          setIsLoading(false);
          history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
            practitionerId: practitionerId,
            isFromReassignView: true,
          });

          return;
        }
        setIsLoading(true);
        await new ClassroomGroupService(
          userAuth.auth_token
        ).updateReassignClassroomGroup(
          practitioner,
          item?.practitioner,
          reasonPayload,
          new Date(selectedDate),
          userData?.id!,
          item?.classroomId,
          endDate || new Date(selectedDate),
          '',
          '',
          principalOrFundaAppAdmin
        );
      });

      await refreshClassroom();
      dispatch(practitionerThunkActions?.getAllPractitioners({})).unwrap();
      setIsLoading(false);
    } else {
      if (userAuth?.auth_token && selectedDate && userData?.id) {
        const absenteeId = allAbsenteeClasses?.[0].absenteeId;
        setIsLoading(true);
        if (absenteeId) {
          await new ClassroomGroupService(userAuth.auth_token).editAbsentee(
            absenteeId,
            false,
            practitioner2 || '',
            reasonPayload,
            new Date(selectedDate),
            endDate || new Date(selectedDate),
            true,
            principalOrFundaAppAdmin
          );

          await refreshClassroom();
          setIsLoading(false);
          history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
            practitionerId: practitionerId,
            isFromReassignView: true,
          });

          return;
        }

        setIsLoading(true);
        await new ClassroomGroupService(
          userAuth.auth_token
        ).updateReassignClassroomGroup(
          practitioner,
          practitioner2,
          reasonPayload,
          new Date(selectedDate),
          userData?.id!,
          '',
          endDate || new Date(selectedDate),
          '',
          principalOrFundaAppAdmin
        );
      }
    }
    setIsLoading(false);
    history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
      practitionerId: practitionerId,
      isFromReassignView: true,
    });
  };

  return (
    <BannerWrapper
      title={`Record leave`}
      subTitle={`${
        absenteePractitioner?.user?.fullName ||
        absenteePractitioner?.user?.firstName
      }`}
      color={'primary'}
      size="medium"
      renderBorder={true}
      onBack={() => history.push(ROUTES.CLASSROOM.ROOT)}
      displayOffline={!isOnline}
    >
      <div className="mb-3 flex w-full flex-wrap p-4">
        <Typography
          type="h2"
          color="textMid"
          text={`Record leave for ${absenteePractitioner?.user?.firstName}`}
          className="mt-6"
        />
        {principalPractitioners && principalPractitioners?.length > 0 && (
          <Dropdown
            placeholder={'Select practitioner'}
            list={practitionersList || []}
            fillType="clear"
            label={`Which practitioner will be the Funda App Admin during this time?`}
            subLabel={`Every programme must have one practitioner responsible for submitting income statements and managing the programme.`}
            fullWidth
            className={'mt-3 w-full'}
            selectedValue={practitioner}
            onChange={(item: any) => {
              setPrincipalOrFundaAppAdmin(item);
            }}
          />
        )}
        <>
          <label className="text-md text-textDark mt-2 mb-1 block w-full font-medium">
            First day of leave
          </label>
          <DatePicker
            placeholderText={`Please select a date`}
            wrapperClassName="text-center w-full"
            className="border-uiLight text-textMid mx-auto w-full rounded-md"
            selected={selectedDate ? new Date(selectedDate) : undefined}
            onChange={(date: Date) => {
              setReassignClassValue('date', date ? date.toString() : '');
            }}
            dateFormat="EEE, dd MMM yyyy"
            minDate={new Date()}
          />
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
                setEndDate(date);
              }}
              dateFormat="EEE, dd MMM yyyy"
              minDate={new Date(selectedDate as string)}
            />
          </>
          <Dropdown
            placeholder={'Select reason'}
            list={multiDaysAbsentInfoList}
            fillType="clear"
            label={'Reason for absence'}
            fullWidth
            selectedValue={reason}
            className={'mt-3 w-full'}
            onChange={(item: any) => {
              setReassignClassValue('reason', item);
            }}
          />
          {reason === 'Other' && (
            <FormInput
              className="my-4 w-full"
              label={'Type the reason'}
              onChange={(e) => setOtherReason(e.target.value)}
              textInputType="input"
              value={otherReason}
              placeholder={'e.g. personal appointment'}
            />
          )}

          {allAbsenteeClasses && allAbsenteeClasses?.length > 0
            ? allAbsenteeClasses?.map((item, index) => {
                const classroomId =
                  practitionerClassroomGroups?.find(
                    (group) => group?.name === item?.className
                  )?.classroomId || '';
                const absenteeId = item?.absenteeId;
                return (
                  <>
                    {item?.className && (
                      <Dropdown
                        key={index}
                        placeholder={'Select practitioner'}
                        list={practitionersTeachList || []}
                        fillType="clear"
                        label={`Who will teach the ${item?.className} class instead?`}
                        fullWidth
                        className={'mt-3 w-full'}
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
                    )}
                    {practitionerPresentName?.user?.fullName &&
                      item?.className && (
                        <Alert
                          className={'mt-5 mb-3'}
                          title={`You are reassigning ${
                            practitionerAbsentName?.user?.fullName || ''
                          }'s class ${item?.className} to ${
                            practitionerPresentName?.user?.fullName || ''
                          } for ${format(
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
                return (
                  <>
                    <Dropdown
                      key={index}
                      placeholder={'Select practitioner'}
                      list={practitionersTeachList || []}
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
                      }}
                    />
                    {practitionerPresentName?.user?.fullName &&
                      principalOrFundaAppAdmin &&
                      selectedDate &&
                      endDate && (
                        <Alert
                          className={'mt-5 mb-3'}
                          title={`You are reassigning ${
                            practitionerAbsentName?.user?.fullName || ''
                          }'s programme and class from ${format(
                            new Date(selectedDate!),
                            'EEEE, d LLLL'
                          )} to ${format(new Date(endDate!), 'EEEE, d LLLL')}${
                            !!endDate
                              ? ` to ${format(
                                  new Date(endDate),
                                  'EEEE, d LLLL'
                                )}`
                              : ''
                          }.`}
                          list={[
                            `${principalOrFundaAppAdminPractitioner?.user?.firstName} will be the Funda App Admin for ${practitionerProgramme}`,
                            `${practitionerPresentName?.user?.firstName} will teach the ${item?.name} class`,
                          ]}
                          type={'info'}
                        />
                      )}
                  </>
                );
              })}
          {practitionerClassroomGroups?.length === 0 && (
            <Alert
              className={'mt-5 mb-3'}
              title="No class reassignment needed."
              list={[
                `${practitionerAbsentName?.user?.firstName} is not currently assigned to a class.`,
              ]}
              type={'success'}
            />
          )}
        </>

        <Button
          type="filled"
          color="primary"
          className={'mx-auto mt-4 w-full rounded-xl'}
          onClick={submitReassignClass}
          disabled={disableButton}
          isLoading={isLoading}
        >
          {renderIcon('SaveIcon', styles.buttonIcon)}
          <Typography
            type="help"
            className="mr-2"
            color="white"
            text={'Save'}
          ></Typography>
        </Button>
      </div>
    </BannerWrapper>
  );
};

export default CoachReassignClass;
