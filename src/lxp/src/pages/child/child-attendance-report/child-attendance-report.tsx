import {
  ChildAttendanceReportModel,
  ChildGroupingAttendanceReportModel,
} from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Divider,
  Dialog,
  DialogPosition,
  StatusChip,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { getYear } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  badScoreThreshold,
  goodScoreThreshold,
} from '@models/classroom/attendance/ClassAttendance';
import { AttendanceService } from '@services/AttendanceService';
import { useAppDispatch } from '@store';
import { attendanceSelectors, attendanceThunkActions } from '@store/attendance';
import { authSelectors } from '@store/auth';
import { childrenSelectors } from '@store/children';
import { analyticsActions } from '@store/analytics';
import {
  getColor,
  getShape,
  getShapeClass,
} from '@utils/classroom/attendance/track-attendance-utils';
import { ChildAttendanceReportState } from './child-attendance-report.types';
import { classroomsSelectors } from '@/store/classroom';
import ROUTES from '@/routes/routes';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import { userSelectors } from '@store/user';

export const ChildAttendanceReportPage: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { state } = useLocation<ChildAttendanceReportState>();
  const { childId, classroomGroupId, childUserId } = state;
  const appDispatch = useAppDispatch();

  const child = useSelector(childrenSelectors.getChildById(childId));
  const childUser = useSelector(
    childrenSelectors.getChildUserById(child?.userId || childUserId)
  );
  const attendanceData = useSelector(attendanceSelectors.getTrackedAttendance);
  const learner = useSelector(
    classroomsSelectors.getChildLearnerByClassroom(
      classroomGroupId,
      child?.userId || childUserId
    )
  );

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Child Attendance Report',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const currentYear = getYear(new Date());
  const [childAttendanceReportData, setChildAttendanceReportData] =
    useState<ChildAttendanceReportModel>({
      totalActualAttendance: 0,
      totalExpectedAttendance: 0,
      classGroupAttendance: [],
      attendancePercentage: 0,
    });
  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [classroomGroup, setClassroomGroup] =
    useState<ChildGroupingAttendanceReportModel>();

  const authUser = useSelector(authSelectors.getAuthUser);
  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some((role) => role.name === 'Coach');

  const getAttendanceText = (score: number): string => {
    if (score >= goodScoreThreshold) {
      return `${childUser?.firstName}'s attendance is good!`;
    }

    if (score <= badScoreThreshold) {
      return `${childUser?.firstName}'s attendance has not been good!`;
    }

    return '';
  };

  useEffect(() => {
    async function init() {
      if (attendanceData && attendanceData.length > 0) {
        await appDispatch(
          attendanceThunkActions.trackAttendanceSync({})
        ).unwrap();
      }
      const startDate = new Date(learner?.startedAttendance || new Date());
      const endDate = new Date();

      new AttendanceService(authUser?.auth_token ?? '')
        .getChildAttendanceRecords(
          child?.userId ?? childUserId ?? '',
          classroomGroupId,
          startDate,
          endDate
        )
        .then((data) => {
          setChildAttendanceReportData(data);
        });
    }
    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!childAttendanceReportData) return;
    setAttendancePercentage(childAttendanceReportData.attendancePercentage);
    const group = childAttendanceReportData.classGroupAttendance.find(
      (x) => x.classroomGroupId === classroomGroupId
    );
    setClassroomGroup(group);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childAttendanceReportData]);

  const contactCaregiver = () => {
    history.push('/child-caregivers', { childId });
  };

  return (
    <BannerWrapper
      className="h-full overflow-y-auto"
      onBack={() => {
        if (isCoach) {
          history.goBack();
        } else {
          childId
            ? history.push(ROUTES.CHILD_PROFILE, { childId })
            : childUserId
            ? history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: 0 })
            : history.goBack();
        }
      }}
      size={'small'}
      title={`${childUser?.firstName}'s attendance`}
      displayOffline={!isOnline}
    >
      {isOnline ? (
        <div className={'flex w-full flex-col pt-2 pb-20'}>
          <Typography
            className={'px-4'}
            type="h1"
            color={'primary'}
            text={`Attendance ${currentYear}`}
          />

          {childAttendanceReportData?.totalExpectedAttendance !== 0 && (
            <>
              <div className={'flex w-full flex-row px-4 pt-4'}>
                <StatusChip
                  backgroundColour={getColor(attendancePercentage)}
                  text={`${
                    childAttendanceReportData?.totalActualAttendance ?? 0
                  }/${childAttendanceReportData?.totalExpectedAttendance ?? 0}`}
                  textColour={'white'}
                  borderColour={getColor(attendancePercentage)}
                />
                <Typography
                  className={'ml-2'}
                  type="body"
                  color={getColor(attendancePercentage)}
                  text={`days attended so far this year.`}
                />
              </div>

              <Typography
                className={'mt-2 px-4'}
                type="body"
                color={'textMid'}
                text={getAttendanceText(attendancePercentage)}
              />
            </>
          )}
          <div
            className={
              'border-uiLight flex w-full flex-row items-center justify-between border-b border-solid py-3'
            }
          >
            <Typography
              className={'mt-2 w-1/2 pl-6'}
              type="small"
              color={'textMid'}
              text={'MONTH'}
            />
            <Typography
              className={'mt-2 w-1/2 pl-6'}
              type="small"
              color={'textMid'}
              text={'DAYS PRESENT'}
            />
          </div>
          {classroomGroup &&
            classroomGroup.monthlyAttendance.map((report, idx) => {
              const reportItemColor = getColor(report.attendancePercentage);
              const reportItemShape = getShape(report.attendancePercentage);
              return (
                <div
                  key={`child-attendance-report-month-${idx}`}
                  className={`flex w-full flex-row items-center justify-between py-4 bg-${
                    (idx + 1) % 2 === 0 ? 'uiBg' : 'white'
                  }`}
                >
                  {report?.expectedAttendance > 0 && (
                    <>
                      <Typography
                        className={'w-1/2 pl-6'}
                        type="body"
                        weight="bold"
                        color={'black'}
                        text={report.month}
                      />
                      <div className={'flex w-1/2 flex-row items-center pl-6'}>
                        <div
                          className={getShapeClass(
                            reportItemShape,
                            reportItemColor
                          )}
                        ></div>
                        <Typography
                          align={'center'}
                          className={'ml-2'}
                          type="body"
                          color={reportItemColor}
                          text={`${report.actualAttendance} out of ${report.expectedAttendance}`}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          <div className="px-4">
            <Divider className={'my-4'} />
            <Button
              color={'primary'}
              type="filled"
              onClick={contactCaregiver}
              className="w-full"
            >
              {renderIcon('ChatAlt2Icon', 'w-5 h-5 text-white mr-2')}
              <Typography
                type="small"
                color={'white'}
                text={'Contact caregiver'}
              />
            </Button>
          </div>
        </div>
      ) : (
        <Dialog visible={!isOnline} position={DialogPosition.Middle}>
          <OnlineOnlyModal
            overrideText={'You need to go online to use this feature.'}
            onSubmit={() => {
              childId
                ? history.push(ROUTES.CHILD_PROFILE, { childId })
                : childUserId
                ? history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: 0 })
                : history.goBack();
            }}
          ></OnlineOnlyModal>
        </Dialog>
      )}
    </BannerWrapper>
  );
};
