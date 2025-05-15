import { useSnackbar } from '@ecdlink/core';
import {
  Alert,
  AttendanceListDataItem,
  AttendanceStatus,
  Button,
  FilterInfo,
  SearchDropDown,
  SearchDropDownOption,
  StatusChip,
} from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
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
  mergeClassProgrammesWithSameClassroomGroupId,
} from '@utils/classroom/attendance/track-attendance-utils';
import ClassProgrammeAttendanceList from '../class-programme-attendance-list/class-programme-attendance-list';
import * as styles from './attendance-list.styles';
import { AttendanceListProps, AttendanceState } from './attendance-list.types';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { childrenSelectors } from '@store/children';

export const filterInfo: FilterInfo = {
  filterName: 'Class',
  filterHint: 'You can select multiple classes',
};

export const AttendanceList: React.FC<AttendanceListProps> = ({
  attendanceDate = new Date(),
  onSubmitSuccess,
  editAttendanceRegisterVisible,
  classroomGroupId,
}) => {
  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();
  const children = useSelector(childrenSelectors.getChildren);
  const [presentChildrenCount, setPresentChildrenCount] = useState<number>(0);
  const [absentChildrenCount, setAbsentChildrenCount] = useState<number>(0);
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [attendanceGroups, setAttendanceGroups] = useState<AttendanceState[]>();
  const [selectedClassroomGroups, setSelectedClassroomGroups] = useState<
    ClassroomGroupDto[]
  >([]);

  const allLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
  );
  const user = useSelector(userSelectors.getUser);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);

  const classProgrammes = classroomGroups
    ?.flatMap((x) => x?.classProgrammes)
    ?.filter((x) => x?.isActive);

  const selectedClassroomGroup = classroomGroups.filter(
    (classroomGroup) => classroomGroup.id === classroomGroupId
  );

  const classProgrammesWithSameClassroomGroup =
    mergeClassProgrammesWithSameClassroomGroupId(classProgrammes);

  const classroomGroupsWithoutDailyMeetings = classroomGroups?.filter(
    (classroomGroup) =>
      classroomGroup?.id !== classroomGroupId &&
      classProgrammesWithSameClassroomGroup.some(
        (data) =>
          data.classroomGroupId === classroomGroup.id && data.items?.length < 5
      )
  );

  const searchDropDownOptions = useMemo(() => {
    if (!classroomGroupsWithoutDailyMeetings?.length) return [];

    const options = [
      ...classroomGroupsWithoutDailyMeetings,
      ...selectedClassroomGroup,
    ];

    return options.map((option) => {
      return {
        id: option.id,
        value: option,
        label: option.name,
        disabled: false,
      };
    });
  }, [classroomGroupsWithoutDailyMeetings, selectedClassroomGroup]);

  // TODO: check if this is needed
  // const primaryClassProgramme = classProgrammes.filter(
  //   (prog) => prog.meetingDay === getDay(attendanceDate)
  // );

  useEffect(() => {
    const endOfDay = new Date(attendanceDate.setHours(23, 59, 59));
    if (classroomGroups?.length) {
      setSelectedClassroomGroups(selectedClassroomGroup);

      const _allLearners = allLearners.filter((x) => {
        const child = children?.find((c) => c.userId === x.childUserId);

        return (
          child &&
          !!child.caregiverId &&
          !Boolean(x.stoppedAttendance) &&
          endOfDay.getTime() >= new Date(x.startedAttendance).getTime()
        );
      });

      const uniqueLearners = _allLearners.filter((object, index, array) => {
        return (
          index ===
          array.findIndex(
            (newObject) => newObject.childUserId === object.childUserId
          )
        );
      });

      setHasChildren(uniqueLearners && uniqueLearners.length > 0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editAttendanceRegisterVisible ? attendanceDate : null]);

  const updateAttendanceState = (attendanceGroups: AttendanceState[]) => {
    const attendanceStatusCheck = getAttendanceStatusCheck(
      attendanceGroups,
      hasChildren
    );
    setPresentChildrenCount(attendanceStatusCheck.presentCount);
    setAbsentChildrenCount(attendanceStatusCheck.absentCount);
  };

  useEffect(() => {
    updateAttendanceState(attendanceGroups ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassroomGroups, attendanceGroups]);

  const onFilterItemsChanges = (value: SearchDropDownOption<any>[]) => {
    setSelectedClassroomGroups(value.map((x) => x.value));

    const updatedAttendanceGroups =
      attendanceGroups?.filter((attendanceGroup) =>
        value.some(
          (classroomGroup) =>
            classroomGroup.value.id === attendanceGroup.cacheId
        )
      ) ?? [];

    setAttendanceGroups(updatedAttendanceGroups);
    updateAttendanceState(updatedAttendanceGroups);
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

      setAttendanceGroups(newAttendanceGroups);
      updateAttendanceState(newAttendanceGroups);
    }
  };

  const handleFormSubmit = async () => {
    const currentClassProgramme = classroomGroupHasAttendanceOnDate(
      classProgrammes,
      attendanceDate,
      classroomGroupId
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
      classProgrammes,
      attendanceDate,
      classroomGroupId
    );

    if (!currentProgramme) return;

    const allAttendanceGroupLists = attendanceGroups?.reduce((prev, curr) => {
      return [...prev, ...curr.list];
    }, [] as AttendanceListDataItem[]);

    const uniqueAttendanceGroups = allAttendanceGroupLists?.filter(
      (object, index, array) => {
        return (
          index ===
          array.findIndex(
            (newObject) => newObject.attenendeeId === object.attenendeeId
          )
        );
      }
    );

    const allAttendedChildren: ChildAttendance[] =
      uniqueAttendanceGroups?.map((x) => ({
        userId: x.attenendeeId,
        attended: x.status === AttendanceStatus.Present,
      })) || [];

    const trackAttendanceInput = mapTrackAttendance(
      user?.id || '',
      allAttendedChildren,
      new Date(
        attendanceDate.getFullYear(),
        attendanceDate.getMonth(),
        attendanceDate.getDate(),
        12,
        0,
        0
      ).toISOString(),
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
    showMessage({ message: 'Great job, register saved!', type: 'success' });
  };

  return (
    <div className={styles.wrapper}>
      <>
        {!!searchDropDownOptions?.length && (
          <div className={'bg-uiBg flex w-full flex-col items-start pb-2 pt-1'}>
            <SearchDropDown<any>
              displayMenuOverlay
              menuItemClassName={styles.dropdownStyles}
              className={'mr-1 ml-2'}
              options={searchDropDownOptions}
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
          </div>
        )}
      </>
      {hasChildren ? (
        <>
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
              const isPrimaryClass = selectedGroup.id === classroomGroupId;
              return (
                <div
                  key={`attencance_list_${idx}`}
                  id={`attendanceList${selectedGroup.id}`}
                >
                  <ClassProgrammeAttendanceList
                    key={`class_attencance_list_${idx}`}
                    isPrimaryClass={isPrimaryClass}
                    classroomGroup={selectedGroup}
                    attendanceDate={attendanceDate}
                    isMultipleClasses={selectedClassroomGroups.length > 1}
                    onAttendanceUpdated={(state) => {
                      validateAttendanceList(
                        selectedGroup.id ?? '',
                        state.listItems,
                        // TODO: check this hardcoded value
                        false
                      );
                    }}
                    id={`attendance-list${selectedGroup.id}`}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className={'mb-2 flex h-full flex-1 flex-col gap-4 px-4 pt-4'}>
          <Alert
            title={'There are no children in your class(es).'}
            message={'Add children to your class(es) to capture attendance.'}
            type={'info'}
          />
        </div>
      )}
      {hasChildren && (
        <Button
          id="gtm-add-attendance"
          onClick={handleFormSubmit}
          className="mx-4 mt-auto mb-4 w-11/12"
          size="small"
          color="quatenary"
          type="filled"
          // disabled={isButtonActive}
          icon="SaveIcon"
          text="Save"
          textColor="white"
        />
      )}
    </div>
  );
};

export default AttendanceList;
