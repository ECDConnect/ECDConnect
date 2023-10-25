import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  ComponentBaseProps,
  BannerWrapper,
  Typography,
  Dropdown,
  renderIcon,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Alert,
} from '@ecdlink/ui';
import DatePicker from 'react-datepicker';
import { useHistory, useLocation } from 'react-router';
import { ReassignClassPageState, yesNoOptions } from './reassign-class.types';
import ROUTES from '@routes/routes';
import { format, setDate } from 'date-fns';
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
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const reportingDate = routeState?.reportingDate
    ? new Date(routeState?.reportingDate)
    : new Date();
  const practitionerId = routeState?.practitionerId;
  const allAbsenteeClasses = routeState?.allAbsenteeClasses;
  const hasAbsenteeClasses =
    allAbsenteeClasses && allAbsenteeClasses?.length > 0;

  const formattedDate = reportingDate
    ? format(reportingDate, 'EEEE, d LLLL')
    : '';
  const [isOneDayLeave, setIsOneDayLeave] = useState<boolean | boolean[]>();
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
    { label: string; value: any }[]
  >([]);
  const [practitionersTeachList, setPractitionersTeachList] = useState<
    { label: string; value: any }[]
  >([]);
  const [classroomGroupsList, setClassroomGroupsList] = useState<
    { label: string; value: any }[]
  >([]);
  const [absentInfoList, setAbsentInfoList] = useState<
    { label: string; value: any }[]
  >([]);
  const [reassignedClassroomGroups, setReassignedClassroomGroups] = useState<
    reassignedClassroomGroupProps[]
  >([]);
  const [endDate, setEndDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
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
    reassignedClass,
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
    !practitioner ||
    !selectedDate ||
    !reason ||
    (practitionerClassroomGroups?.length > 0 &&
      reassignedClassroomGroups?.length === 0);

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
      setEndDate(allAbsenteeClasses?.[0]?.absentDateEnd as Date);
    }
  }, [allAbsenteeClasses, endDate, hasAbsenteeClasses, setReassignClassValue]);

  const practitionerAbsentName = useMemo(() => {
    return practitioners?.find((item) => {
      if (item?.userId === practitioner) {
        return item?.user?.fullName;
      } else return null;
    });
  }, [practitioner, practitioners]);

  const practitionerPresentName = useMemo(() => {
    return practitioners?.find((item) => {
      if (item?.userId === practitioner2) {
        return item?.user?.fullName;
      } else return null;
    });
  }, [practitioner2, practitioners]);

  useEffect(() => {
    const _list = practitioners
      ?.filter((item) => item?.userId !== String(practitionerId))
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
    const _list = practitioners
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

    const _list2 = practitioners
      ?.filter((item) => item?.userId !== String(practitionerId))
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
    setPractitionersTeachList(_list2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const submitReassignClass = async () => {
    if (userAuth?.auth_token && selectedDate && userData?.id) {
      reassignedClassroomGroups?.map(async (item) => {
        setIsLoading(true);
        if (item?.absenteeId) {
          await new ClassroomGroupService(userAuth.auth_token).editAbsentee(
            item?.absenteeId,
            false,
            item?.practitioner,
            reason,
            new Date(selectedDate),
            endDate || new Date(selectedDate)
          );

          await refreshClassroom();
          await appDispatch(
            practitionerThunkActions.getAllPractitioners({})
          ).unwrap();
          setIsLoading(false);
          history.push(ROUTES.PRINCIPAL.PRACTITIONER_PROFILE, {
            practitionerId,
          });

          return;
        }
        setIsLoading(true);
        await new ClassroomGroupService(
          userAuth.auth_token
        ).updateReassignClassroomGroup(
          practitioner,
          item?.practitioner,
          reason,
          new Date(selectedDate),
          userData?.id!,
          item?.classroomId,
          endDate || new Date(selectedDate)
        );
      });

      await refreshClassroom();
      await appDispatch(
        practitionerThunkActions.getAllPractitioners({})
      ).unwrap();
    }
    setIsLoading(false);
    history.push(ROUTES.PRINCIPAL.PRACTITIONER_PROFILE, {
      practitionerId,
    });
  };

  return (
    <BannerWrapper
      title={`Record absence/leave`}
      subTitle={`${
        formattedDate ? formattedDate : format(new Date(), 'EEEE, d LLLL')
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
          text={'Record absence/leave'}
          className="mt-6"
        />
        <Dropdown
          placeholder={'Select practitioner'}
          list={practitionersList || []}
          fillType="clear"
          label={
            'Which practitioner would you like to record a leave/absence for?'
          }
          fullWidth
          className={'mt-3 w-full'}
          selectedValue={practitioner}
          onChange={(item: any) => {
            setReassignClassValue('practitioner', item);
            setPractitionersTeachList(
              practitionersList.filter((prac) => prac.value !== item)
            );
          }}
          disabled={hasAbsenteeClasses}
        />
        <label className={styles.label}>
          Will the practitioner be absent for one day or longer?
        </label>
        <ButtonGroup<boolean>
          options={yesNoOptions}
          onOptionSelected={(value) => setIsOneDayLeave(value)}
          selectedOptions={isOneDayLeave}
          color="secondary"
          type={ButtonGroupTypes.Button}
          className={`w-full ${
            allAbsenteeClasses &&
            allAbsenteeClasses?.length > 0 &&
            'pointer-events-none'
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
                setReassignClassValue('date', date ? date.toString() : '');
              }}
              dateFormat="EEE, dd MMM yyyy"
              minDate={new Date()}
              disabled={hasAbsenteeClasses}
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
                    setEndDate(date);
                  }}
                  dateFormat="EEE, dd MMM yyyy"
                  minDate={new Date(selectedDate as string)}
                  disabled={hasAbsenteeClasses}
                />
              </>
            )}
            <Dropdown
              placeholder={'Select reason'}
              list={absentInfoList}
              fillType="clear"
              label={'Reason for absence'}
              fullWidth
              className={'mt-3 w-full'}
              onChange={(item: any) => {
                setReassignClassValue('reason', item);
              }}
            />
            {reason === 'Other' && (
              <FormInput
                className="my-4 w-full"
                label={'Type the reason'}
                // value={}
                onChange={(e) => {}}
                textInputType="input"
                placeholder={'e.g. personal appointment'}
              />
            )}
            {allAbsenteeClasses && allAbsenteeClasses?.length > 0 ? (
              allAbsenteeClasses?.map((item, index) => {
                const classroomId =
                  practitionerClassroomGroups?.find(
                    (group) => group?.name === item?.className
                  )?.classroomId || '';
                const absenteeId = item?.absenteeId;
                return (
                  <>
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
                    {practitionerPresentName?.user?.fullName && (
                      <Alert
                        className={'mt-5 mb-3'}
                        title={`You are reassigning ${
                          practitionerAbsentName?.user?.fullName || ''
                        }'s class ${item?.className} to ${
                          practitionerPresentName?.user?.fullName || ''
                        } for ${format(
                          new Date(selectedDate!),
                          'EEEE, d LLLL'
                        )}.`}
                        type={'info'}
                      />
                    )}
                  </>
                );
              })
            ) : practitionerClassroomGroups.length > 0 ? (
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
                    {practitionerPresentName?.user?.fullName && (
                      <Alert
                        className={'mt-5 mb-3'}
                        title={`You are reassigning ${
                          practitionerAbsentName?.user?.fullName || ''
                        } class ${item?.name} to ${
                          practitionerPresentName?.user?.fullName || ''
                        } for ${format(
                          new Date(selectedDate!),
                          'EEEE, d LLLL'
                        )}.`}
                        type={'info'}
                      />
                    )}
                  </>
                );
              })
            ) : (
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
        )}

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

export default ReassignClass;
