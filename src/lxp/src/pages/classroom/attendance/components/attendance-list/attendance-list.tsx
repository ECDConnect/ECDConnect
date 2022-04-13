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
import { attendanceActions } from '@store/attendance';
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

export const AttendanceList: React.FC<AttendanceListProps> = ({
  submitText = '',
  attendanceDate = new Date(),
  onSubmitSuccess,
}) => {
  const appDispatch = useAppDispatch();
  const [presentChildrenCount, setPresentChildrenCount] = useState<number>(0);
  const [absentChildrenCount, setAbsentChildrenCount] = useState<number>(0);

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const [shouldFilter, setShouldFilter] = useState<boolean>(true);

  const [attendanceGroups, setAttendanceGroups] = useState<AttendanceState[]>();
  const [selectedClassroomGroups, setSelectedClassroomGroups] = useState<
    ClassroomGroupDto[]
  >([]);

  const filterInfo: FilterInfo = {
    filterName: 'Playgroup',
    filterHint: 'You can select multiple playgroups',
  };

  const user = useSelector(userSelectors.getUser);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const classProgrammes = useSelector(classroomsSelectors.getClassProgrammes);
  const isPlaygroup = useSelector(classroomsSelectors.isPlaygroup());
  const primaryClassProgramme = classProgrammes.find(
    (prog) => prog.meetingDay === getDay(attendanceDate)
  );

  useEffect(() => {
    if (classroomGroups) {
      if (!isPlaygroup) {
        setShouldFilter(false);
      }

      const selectedGroups = classroomGroups.filter(
        (x) => x.id === primaryClassProgramme?.classroomGroupId
      );

      setSelectedClassroomGroups(selectedGroups);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroups, isPlaygroup]);

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
      classProgrammes,
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

    const currentProgramme = getPlaygroup(classProgrammes, attendanceDate);

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
        {shouldFilter && (
          <SearchDropDown<any>
            displayMenuOverlay
            menuItemClassName={styles.dropdownStyles}
            className={'mr-1'}
            options={
              (classroomGroups &&
                classroomGroups.map((x) => {
                  return {
                    id: x.id ?? '',
                    value: x,
                    label: x.name,
                    disabled: x.id === primaryClassProgramme?.classroomGroupId,
                  };
                })) ||
              []
            }
            onChange={(value) => onFilterItemsChanges(value)}
            placeholder={'Playgroups'}
            pluralSelectionText={'Playgroups'}
            multiple
            color={'uiMidDark'}
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
        <div className={styles.statusChipsWrapper(shouldFilter)}>
          <StatusChip
            className={'mr-2'}
            padding={'px-2 py-0'}
            textColour="white"
            borderColour="successMain"
            textType="small"
            backgroundColour="successMain"
            text={`${presentChildrenCount} present`}
          />
          <StatusChip
            textColour="white"
            padding={'px-2 py-0'}
            borderColour="errorMain"
            textType="small"
            backgroundColour="errorMain"
            text={`${absentChildrenCount} absent`}
          />
        </div>
      </div>
      <div className={styles.attendanceListsWrapper}>
        {selectedClassroomGroups.map((selectedGroup, idx) => {
          const isPrimaryList =
            selectedGroup.id === primaryClassProgramme?.classroomGroupId;
          return (
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
            />
          );
        })}

        <div className={'px-4'}>
          <Button
            id="gtm-add-attendance"
            onClick={handleFormSubmit}
            className="w-full mt-4"
            size="small"
            color="primary"
            type="filled"
            disabled={!isButtonActive}
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
