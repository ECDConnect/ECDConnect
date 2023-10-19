import { ClassroomGroupDto, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  AttendanceListDataItem,
  AttendanceStatus,
  Button,
  DialogPosition,
  FilterInfo,
  renderIcon,
  SearchDropDown,
  SearchDropDownOption,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { format, getDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import { attendanceActions, attendanceThunkActions } from '@store/attendance';
import { ChildAttendance } from '@store/attendance/attendance.types';
import { classroomsSelectors } from '@store/classroom';
import { userSelectors } from '@store/user';
import {
  classroomGroupHasAttendanceOnDate,
  getAttendanceStatusCheck,
  getPlaygroup,
  mapTrackAttendance,
} from '@utils/classroom/attendance/track-attendance-utils';
import ClassProgrammeAttendanceList from '../class-programme-attendance-list/class-programme-attendance-list';
import * as styles from './attendance-list.styles';
import { AttendanceListProps, AttendanceState } from './attendance-list.types';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { practitionerSelectors } from '@/store/practitioner';

export const filterInfo: FilterInfo = {
  filterName: 'Class',
  filterHint: 'You can select multiple classes',
};

export const AttendanceList: React.FC<AttendanceListProps> = ({
  submitText = '',
  attendanceDate = new Date(),
  onSubmitSuccess,
  editAttendanceRegisterVisible,
  classroomgroupId,
}) => {
  const appDispatch = useAppDispatch();
  const [presentChildrenCount, setPresentChildrenCount] = useState<number>(0);
  const [absentChildrenCount, setAbsentChildrenCount] = useState<number>(0);
  const userData = useSelector(userSelectors.getUser);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner: any = practitioners?.find(
    (item) => item?.userId === userData?.id
  );
  const isPrincipal = practitioner?.isPrincipal === true;
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shouldFilter] = useState<boolean>(true);

  const [attendanceGroups, setAttendanceGroups] = useState<AttendanceState[]>();

  const [selectedClassroomGroups, setSelectedClassroomGroups] = useState<
    ClassroomGroupDto[]
  >([]);

  const dialog = useDialog();

  const user = useSelector(userSelectors.getUser);
  const allClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroups
  );
  const classroomGroups = allClassroomGroups.filter(
    (x) => x.name !== NoPlaygroupClassroomType.name
  );
  const classroomGroupsForPrincipal = classroomGroups.filter(
    (item) => item?.userId === userData?.id
  );
  const classProgrammes = useSelector(classroomsSelectors.getClassProgrammes);
  const classProgrammesForPrincipal = classProgrammes.filter((el) => {
    return classroomGroupsForPrincipal.some((f) => {
      return f.id === el.classroomGroupId;
    });
  });
  const classProgrammesUpdated = isPrincipal
    ? classProgrammesForPrincipal
    : classProgrammes;

  const primaryClassProgramme = classProgrammesUpdated.filter(
    (prog) => prog.meetingDay === getDay(attendanceDate)
  );

  useEffect(() => {
    if (classroomGroups) {
      const selectedGroups = isPrincipal
        ? classroomGroupsForPrincipal.filter(
            (x) =>
              x.id ===
              (editAttendanceRegisterVisible
                ? classroomgroupId
                : primaryClassProgramme[0]?.classroomGroupId)
          )
        : classroomGroups.filter(
            (x) =>
              x.id ===
              (editAttendanceRegisterVisible
                ? classroomgroupId
                : primaryClassProgramme[0]?.classroomGroupId)
          );
      setSelectedClassroomGroups(selectedGroups);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAttendanceRegisterVisible ? attendanceDate : null]);

  const updateAttendanceState = (attendanceGroups: AttendanceState[]) => {
    const attendanceStatusCheck = getAttendanceStatusCheck(
      attendanceGroups,
      isButtonActive
    );
    setPresentChildrenCount(attendanceStatusCheck.presentCount);
    setAbsentChildrenCount(attendanceStatusCheck.absentCount);
    setIsButtonActive(attendanceStatusCheck.isValid);
  };

  useEffect(() => {
    updateAttendanceState(attendanceGroups ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassroomGroups, attendanceGroups]);

  const onFilterItemsChanges = (value: SearchDropDownOption<any>[]) => {
    setSelectedClassroomGroups(value.map((x) => x.value));
  };

  const validateAttendanceList = (
    attendanceListId: string,
    updateList: AttendanceListDataItem[],
    isPrimaryList: boolean
  ) => {
    const newAttendanceGroups = [...(attendanceGroups || [])];
    const groupIndex = newAttendanceGroups.findIndex(
      (x) => x.cacheId === attendanceListId
    );

    if (groupIndex === -1) {
      newAttendanceGroups.push({
        cacheId: attendanceListId,
        isRequired: isPrimaryList,
        list: updateList,
      });
      setAttendanceGroups(newAttendanceGroups);
      updateAttendanceState(newAttendanceGroups);
    } else {
      newAttendanceGroups.splice(groupIndex, 1, {
        cacheId: attendanceListId,
        isRequired: isPrimaryList,
        list: updateList,
      });
      setAttendanceGroups(
        newAttendanceGroups.filter((x) => x.cacheId === attendanceListId)
      );
      updateAttendanceState(
        newAttendanceGroups.filter((x) => x.cacheId === attendanceListId)
      );
    }
  };

  const handleFormSubmit = async () => {
    const currentClassProgramme = classroomGroupHasAttendanceOnDate(
      classProgrammesUpdated,
      attendanceDate,
      editAttendanceRegisterVisible ? classroomgroupId : ''
    );

    const currentGroup = classroomGroups.find(
      (x) => x.id === currentClassProgramme?.classroomGroupId
    );

    if (!currentGroup) return;

    const currentAttendanceGroup = attendanceGroups?.find(
      (x) => x.cacheId === currentGroup.id
    );

    if (!currentAttendanceGroup) return;

    const currentProgramme = getPlaygroup(
      classProgrammesUpdated,
      attendanceDate,
      editAttendanceRegisterVisible ? classroomgroupId : ''
    );

    if (!currentProgramme) return;

    const allAttendanceGroupLists = attendanceGroups?.reduce((prev, curr) => {
      return [...prev, ...curr.list];
    }, [] as AttendanceListDataItem[]);

    const allAttendedChildren: ChildAttendance[] =
      allAttendanceGroupLists?.map((x) => ({
        userId: x.attenendeeId,
        attended: x.status === AttendanceStatus.Present,
      })) || [];

    const dateString = attendanceDate.toISOString();

    // Create a new Date object from the date string
    const dateObj = new Date(dateString);

    // Get the date value (1-31) from the Date object
    const dateValue = dateObj.getDate();

    // Add 1 day to the date value
    const newDateValue = dateValue + 1;

    // Set the new date value to the Date object
    dateObj.setDate(newDateValue);

    // Get the updated date string in ISO format
    const updatedAttendanceDateString = dateObj.toISOString();

    let newAttDate = !editAttendanceRegisterVisible
      ? attendanceDate.toISOString()
      : updatedAttendanceDateString;

    const trackAttendanceInput = mapTrackAttendance(
      user?.id || '',
      allAttendedChildren,
      newAttDate,
      currentProgramme.id ?? ''
    );

    appDispatch(attendanceActions.trackAttendance(trackAttendanceInput));
    appDispatch(
      attendanceThunkActions.trackAttendanceSync(trackAttendanceInput)
    );

    appDispatch(
      analyticsActions.createEventTracking({
        action: 'Attendance tracking click',
        category: 'Attendance tracking click',
      })
    );

    onSubmitSuccess({
      attendanceDate,
      classroomGroupId: currentAttendanceGroup.cacheId,
    });
    setAttendanceGroups([]);
    setSelectedClassroomGroups([]);
    updateAttendanceState([]);
  };

  const submitPrompt = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          textAlignment="center"
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to submit your ${format(
            attendanceDate,
            'EEEE, d LLLL'
          )} attendance register?`}
          customDetailText={
            <Typography
              type="h4"
              className="mb-7 mt-4"
              text={`By submitting this register, you confirm that all the attendance information is accurate. `}
              color="black"
              align="center"
            />
          }
          detailText={'Your signature will be added to the monthly register.'}
          actionButtons={[
            {
              text: 'Yes, submit register',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                handleFormSubmit();
                onCancel();
              },
              leadingIcon: 'SaveIcon',
            },
            {
              text: 'No, continue editing',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => onCancel(),
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={'bg-uiBg flex w-full flex-col items-start'}>
        {shouldFilter &&
          classroomGroupsForPrincipal.length > 1 &&
          submitText === '' && (
            <>
              <SearchDropDown<any>
                displayMenuOverlay
                menuItemClassName={styles.dropdownStyles}
                className={'mr-1 ml-2'}
                options={
                  (classroomGroups && isPrincipal
                    ? classroomGroupsForPrincipal.map((x) => {
                        return {
                          id: x.id ?? '',
                          value: x,
                          label: x.name,
                          disabled: false,
                        };
                      })
                    : classroomGroups.map((x) => {
                        return {
                          id: x.id ?? '',
                          value: x,
                          label: x.name,
                          disabled: false,
                        };
                      })) || []
                }
                onChange={(value) => onFilterItemsChanges(value)}
                placeholder={'Class'}
                pluralSelectionText={'Classes'}
                color={'secondary'}
                multiple
                selectedOptions={selectedClassroomGroups.map((x) => {
                  return {
                    id: x.id ?? '',
                    value: x,
                    label: x.name,
                  };
                })}
                info={{
                  name: `Filter by:${filterInfo?.filterName}`,
                  hint: filterInfo?.filterHint || '',
                }}
              />
            </>
          )}
      </div>
      <div>
        <div className={styles.statusChipsWrapper(false)}>
          <StatusChip
            className={'mr-2 '}
            padding={'px-3 py-3'}
            textColour="successMain"
            borderColour="white"
            textType="h2"
            backgroundColour="white"
            text={`${presentChildrenCount} present`}
          />
          <div>
            <StatusChip
              textColour="errorMain"
              padding={'px-3 py-3'}
              borderColour="white"
              textType="h2"
              backgroundColour="white"
              text={`${absentChildrenCount} absent`}
            />
          </div>
        </div>
      </div>
      <div className={styles.attendanceListsWrapper}>
        {selectedClassroomGroups.map((selectedGroup, idx) => {
          const isPrimaryList =
            selectedGroup.id === primaryClassProgramme[0]?.classroomGroupId;

          return (
            <div id={`attendanceList${selectedGroup.id}`}>
              <ClassProgrammeAttendanceList
                key={`class_attencance_list_${idx}`}
                isPrimaryClass={isPrimaryList}
                classroomGroup={selectedGroup}
                attendanceDate={attendanceDate}
                isMultipleClasses={selectedClassroomGroups.length > 1}
                onAttendanceUpdated={(state) => {
                  validateAttendanceList(
                    editAttendanceRegisterVisible
                      ? classroomgroupId ?? ''
                      : selectedGroup.id ?? '',
                    state.listItems,
                    isPrimaryList
                  );
                }}
                id={`attendance-list${selectedGroup.id}`}
              />
            </div>
          );
        })}

        <div className={'px-4'}>
          <Button
            id="gtm-add-attendance"
            onClick={submitPrompt}
            className="mt-4 w-full"
            size="small"
            color="primary"
            type="filled"
            // disabled={isButtonActive}
          >
            {renderIcon('PaperAirplaneIcon', 'h-5 w-5 text-white')}
            <Typography
              type="h6"
              className="ml-2"
              text={
                submitText.length > 0 ? submitText : 'Submit today’s register'
              }
              color="white"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
