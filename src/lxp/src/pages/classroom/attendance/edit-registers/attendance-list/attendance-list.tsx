import {
  AttendanceStatus,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  StatusChip,
} from '@ecdlink/ui';
import ClassProgrammeAttendanceList from '../../components/class-programme-attendance-list/class-programme-attendance-list';
import { useSelector } from 'react-redux';
import { classroomsSelectors } from '@/store/classroom';
import { EditRegistersAttendanceListProps } from './attendance-list.types';
import { useState } from 'react';
import {
  getAttendanceStatusCheck,
  getPlaygroup,
  mapTrackAttendance,
} from '@/utils/classroom/attendance/track-attendance-utils';
import { AttendanceState } from '../../components/attendance-list/attendance-list.types';
import { ChildAttendance } from '@/store/attendance/attendance.types';
import { useAppDispatch } from '@/store';
import { userSelectors } from '@/store/user';
import { analyticsActions } from '@/store/analytics';
import { attendanceActions, attendanceThunkActions } from '@/store/attendance';
import { format } from 'date-fns';
import { useSnackbar } from '@ecdlink/core';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { ClassDashboardRouteState } from '@/pages/business/business.types';

export const EditRegistersAttendanceList = ({
  selectedRegister,
  onBack,
}: EditRegistersAttendanceListProps) => {
  const [presentChildrenCount, setPresentChildrenCount] = useState<number>(0);
  const [absentChildrenCount, setAbsentChildrenCount] = useState<number>(0);

  const [attendanceGroups, setAttendanceGroups] = useState<AttendanceState[]>();

  const classroomGroupId = selectedRegister.register[0].classgroupId;

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(classroomGroupId)
  );
  const user = useSelector(userSelectors.getUser);

  const classProgrammes = classroomGroup!.classProgrammes?.filter(
    (x) => x?.isActive
  );

  const attendanceDate = selectedRegister.date;
  const attendanceDay = attendanceDate.getDate();

  const initialAttendanceList = selectedRegister.register.map((child) => ({
    childUserId: child.childUserId,
    status: child.attendance?.some(
      (day) => day.key === attendanceDay && day.value === 1
    )
      ? AttendanceStatus.Present
      : AttendanceStatus.Absent,
  }));

  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();

  const history = useHistory();

  const updateAttendanceState = (attendanceGroups: AttendanceState[]) => {
    const attendanceStatusCheck = getAttendanceStatusCheck(
      attendanceGroups,
      true
    );
    setPresentChildrenCount(attendanceStatusCheck.presentCount);
    setAbsentChildrenCount(attendanceStatusCheck.absentCount);
    setAttendanceGroups(attendanceGroups);
  };

  const handleFormSubmit = async () => {
    const attendanceGroup = attendanceGroups?.[0];

    if (!attendanceGroup) return;

    const currentProgramme = getPlaygroup(
      classProgrammes,
      attendanceDate,
      classroomGroupId
    );

    if (!currentProgramme) return;

    const attendanceGroupList = attendanceGroup.list;

    const allAttendedChildren: ChildAttendance[] =
      attendanceGroupList?.map((x) => ({
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

    setAttendanceGroups([]);
    showMessage({ message: 'Register saved!', type: 'success' });
    history.push(ROUTES.CLASSROOM.ROOT, {
      activeTabIndex: TabsItems.ATTENDANCE,
      fromChildAttendanceReport: true,
    } as ClassDashboardRouteState);
  };

  return (
    <Dialog position={DialogPosition.Full} stretch visible>
      <BannerWrapper
        size="small"
        onBack={onBack}
        title="Edit register"
        subTitle={format(attendanceDate, 'EEEE, dd MMMM')}
        className="flex h-full flex-col pb-4"
      >
        <div className="mt-4 flex gap-10">
          <StatusChip
            className={'mr-2 '}
            padding={'px-3 py-3'}
            textColour="successMain"
            borderColour="white"
            textType="h2"
            backgroundColour="white"
            text={`${presentChildrenCount} present`}
          />
          <StatusChip
            textColour="errorMain"
            padding={'px-3 py-3'}
            borderColour="white"
            textType="h2"
            backgroundColour="white"
            text={`${absentChildrenCount} absent`}
          />
        </div>
        <ClassProgrammeAttendanceList
          className="mb-4"
          isPrimaryClass
          classroomGroup={classroomGroup!}
          attendanceDate={selectedRegister.date}
          isMultipleClasses={false}
          initialAttendanceList={initialAttendanceList}
          onAttendanceUpdated={(state) =>
            updateAttendanceState([
              {
                cacheId: classroomGroupId,
                isRequired: true,
                list: state.listItems,
              },
            ])
          }
        />
        <div className="mx-4 mt-auto w-full">
          <Button
            className="mt-4  w-11/12"
            type="filled"
            color="quatenary"
            textColor="white"
            text="Save"
            icon="SaveIcon"
            onClick={handleFormSubmit}
          />
        </div>
      </BannerWrapper>
    </Dialog>
  );
};
