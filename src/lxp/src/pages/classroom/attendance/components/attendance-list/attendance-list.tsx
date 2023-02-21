import { ClassroomGroupDto } from '@ecdlink/core';
import {
  AttendanceListDataItem,
  AttendanceStatus,
  Button,
  FilterInfo,
  renderIcon,
  SearchDropDown,
  SearchDropDownOption,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { getDay } from 'date-fns';
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

const filterInfo: FilterInfo = {
  filterName: 'Class',
  filterHint: 'You can select multiple classes',
};

export const AttendanceList: React.FC<AttendanceListProps> = ({
  submitText = '',
  attendanceDate = new Date(),
  onSubmitSuccess,
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
  const primaryClassProgramme = classProgrammesUpdated.find(
    (prog) => prog.meetingDay === getDay(attendanceDate)
  );

  useEffect(() => {
    if (classroomGroups) {
      const selectedGroups = isPrincipal
        ? classroomGroupsForPrincipal.filter(
            (x) => x.id === primaryClassProgramme?.classroomGroupId
          )
        : classroomGroups.filter(
            (x) => x.id === primaryClassProgramme?.classroomGroupId
          );

      setSelectedClassroomGroups(selectedGroups);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    } else {
      newAttendanceGroups.splice(groupIndex, 1, {
        cacheId: attendanceListId,
        isRequired: isPrimaryList,
        list: updateList,
      });
    }

    updateAttendanceState(newAttendanceGroups);
  };

  const updateAttendanceState = (attendanceGroups: AttendanceState[]) => {
    const attendanceStatusCheck = getAttendanceStatusCheck(
      attendanceGroups,
      isButtonActive
    );

    setPresentChildrenCount(attendanceStatusCheck.presentCount);
    setAbsentChildrenCount(attendanceStatusCheck.absentCount);
    setAttendanceGroups(attendanceGroups);
    setIsButtonActive(attendanceStatusCheck.isValid);
  };

  const handleFormSubmit = async () => {
    const currentClassProgramme = classroomGroupHasAttendanceOnDate(
      classProgrammesUpdated,
      attendanceDate
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
      attendanceDate
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

    const trackAttendanceInput = mapTrackAttendance(
      user?.id || '',
      allAttendedChildren,
      attendanceDate.toISOString(),
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
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.contentWrapper}>
        {shouldFilter && classroomGroupsForPrincipal.length > 1 && (
          <SearchDropDown<any>
            displayMenuOverlay
            menuItemClassName={styles.dropdownStyles}
            className={'mr-1'}
            options={
              (classroomGroups && isPrincipal
                ? classroomGroupsForPrincipal.map((x) => {
                    return {
                      id: x.id ?? '',
                      value: x,
                      label: x.name,
                      disabled:
                        x.id === primaryClassProgramme?.classroomGroupId,
                    };
                  })
                : classroomGroups.map((x) => {
                    return {
                      id: x.id ?? '',
                      value: x,
                      label: x.name,
                      disabled:
                        x.id === primaryClassProgramme?.classroomGroupId,
                    };
                  })) || []
            }
            onChange={(value) => onFilterItemsChanges(value)}
            placeholder={'Class'}
            pluralSelectionText={'Classes'}
            multiple
            color={'secondary'}
            selectedOptions={selectedClassroomGroups.map((x) => {
              return {
                id: x.id ?? '',
                value: x,
                label: x.name,
                disabled: x.id === primaryClassProgramme?.classroomGroupId,
              };
            })}
            info={{
              name: `Filter by:${filterInfo?.filterName}`,
              hint: filterInfo?.filterHint || '',
            }}
          />
        )}
      </div>

      <div>
        <div className={styles.statusChipsWrapper(true)}>
          <StatusChip
            className={'mr-2 '}
            padding={'px-3 py-1.5'}
            textColour="successMain"
            borderColour="white"
            textType="h2"
            backgroundColour="white"
            text={`${presentChildrenCount} present`}
          />
          <div>
            <StatusChip
              textColour="errorMain"
              padding={'px-3 py-1.5'}
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
            selectedGroup.id === primaryClassProgramme?.classroomGroupId;
          return (
            <div id="attendanceList">
              <ClassProgrammeAttendanceList
                key={`class_attencance_list_${idx}`}
                isPrimaryClass={isPrimaryList}
                classroomGroup={selectedGroup}
                attendanceDate={attendanceDate}
                onAttendanceUpdated={(state) => {
                  validateAttendanceList(
                    selectedGroup.id ?? '',
                    state.listItems,
                    isPrimaryList
                  );
                }}
                id="attendance-list"
              />
            </div>
          );
        })}

        <div className={'px-4'}>
          <Button
            id="gtm-add-attendance"
            onClick={handleFormSubmit}
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
