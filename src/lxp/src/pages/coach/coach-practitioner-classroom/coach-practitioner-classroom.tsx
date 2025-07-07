import { useHistory, useLocation } from 'react-router';
import { useEffect, useState, useMemo } from 'react';
import {
  BannerWrapper,
  Typography,
  Card,
  StackedList,
  MenuListDataItem,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { NotificationDisplay } from '@ecdlink/graphql';
import { PractitionerProfileRouteState } from './coach-practitioner-classroom.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './coach-practitioner-classroom.styles';
import ROUTES from '@routes/routes';
import { childrenSelectors, childrenThunkActions } from '@store/children';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import { ChildrenPerAgeGroup } from './components/childrenPerAgeGroup/childrenPerAgeGroup';
import { ClassroomAttendance } from './components/classroom-attendance/classroom-attendance';
import { authSelectors } from '@/store/auth';
import { PractitionerService } from '@/services/PractitionerService';
import { ClassroomGroupService } from '@/services/ClassroomGroupService';
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { ContactPractitioner } from './components/contact-practitioner/contact-practitioner';
import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { useStaticData } from '@hooks/useStaticData';
import { useTenant } from '@/hooks/useTenant';
import { useTenantModules } from '@/hooks/useTenantModules';

export const CoachPractitionerClassroom: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const isOpenAccess = tenant?.isOpenAccess;
  const { attendanceEnabled } = useTenantModules();

  const location = useLocation<PractitionerProfileRouteState>();

  const { getWorkflowStatusIdByEnum } = useStaticData();
  const activeStatusId = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.ChildActive
  );

  const children = useSelector(
    childrenSelectors.getChildrenByStatus(activeStatusId)
  );

  const practitionerUserId = location.state.practitionerId;
  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerUserId)
  );

  const isPrincipal = practitioner?.isPrincipal === true;

  const coachClassrooms = useSelector(
    classroomsForCoachSelectors.getClassroomForCoach
  );

  const practitionerClassroomGroups = useSelector(
    classroomsForCoachSelectors.getClassroomGroupsForPractitioner(
      practitionerUserId
    )
  );

  const practitionerClassroom = isPrincipal
    ? coachClassrooms?.find((item) => item?.userId === practitionerUserId)
    : coachClassrooms?.find(
        (item) => item?.id === practitionerClassroomGroups?.[0].classroomId
      );

  const classroomGroups = useSelector(
    classroomsForCoachSelectors.getClassroomGroupsForClassroom(
      practitionerClassroom?.id || ''
    )
  );

  const learnersForPractitioner = isPrincipal
    ? classroomGroups.flatMap((x) => x.learners)
    : practitionerClassroomGroups.flatMap((x) => x.learners);

  const childrenForPractitionerList = children?.filter((el) => {
    return learnersForPractitioner?.some((f) => {
      return f.childUserId === el.userId;
    });
  });

  const [practitionerClassroomsData, setPractitionerClassroomsData] =
    useState<ClassroomGroupDto[]>();

  const [classMetrics, setClassMetrics] = useState<any>();
  const [actionItems, setActionItems] = useState<any>();
  const [showAttendanceRegisters, setShowAttendanceRegisters] = useState(false);
  const [showAttendanceRate, setShowAttendanceRate] = useState(false);
  const [notification, setNotification] = useState<NotificationDisplay>();

  const classroomsMetrics = async () => {
    const today = new Date();
    const firstDayPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastDayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    const metricsData = await new ClassroomGroupService(
      userAuth?.auth_token!
    ).getClassAttendanceMetricsByUser(
      practitionerUserId,
      firstDayPrevMonth,
      lastDayPrevMonth
    );
    setClassMetrics(metricsData);
    return metricsData;
  };

  useEffect(() => {
    classroomsMetrics();
  }, [userAuth, practitionerUserId]);

  useEffect(() => {
    if (classMetrics) {
      const practitionerClassroomData = classMetrics?.filter((item: any) => {
        if (isPrincipal) {
          return classroomGroups.some((x) => {
            return item?.classroomId === x.classroomId;
          });
        }
        return practitionerClassroomGroups.some((x) => {
          return item?.practitionerId === x?.userId;
        });
      });
      setPractitionerClassroomsData(practitionerClassroomData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classMetrics]);

  const getClassroomsActionItems = async () => {
    const newActionItems = await new PractitionerService(
      userAuth?.auth_token!
    ).classroomActionItems(practitionerUserId);

    setActionItems(newActionItems);

    return newActionItems;
  };

  useEffect(() => {
    getClassroomsActionItems();
  }, [practitionerUserId]);

  useEffect(() => {
    (async () =>
      // TODO - This might need updates
      await appDispatch(childrenThunkActions.getChildren({})).unwrap())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appDispatch, practitionerUserId]);

  const listItems: MenuListDataItem[] = useMemo(() => {
    return actionItems?.map((action: NotificationDisplay) => {
      return {
        title: action.subject,
        titleStyle: 'text-textDark font-semibold text-base leading-snug',
        subTitle: action.message,
        subTitleStyle:
          'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
        menuIcon:
          action.color === 'Error'
            ? 'ExclamationIcon'
            : 'InformationCircleIcon',
        menuIconClassName:
          action.color === 'Error'
            ? 'alertMain text-white'
            : 'bg-infoMain text-white',
        showIcon: true,
        iconBackgroundColor:
          action.color === 'Error' ? 'alertMain' : 'bg-infoMain',
        chipConfig: {
          colorPalette: {
            backgroundColour: 'white',
            borderColour: 'errorMain',
            textColour: 'errorMain',
          },
        },
        text: '1',
        onActionClick: () => {
          onView(action);
        },
        classNames: 'bg-uiBg',
      };
    });
  }, [actionItems]);

  const onView = async (action: NotificationDisplay) => {
    setNotification(action);
    if (action.subject?.includes('attendance registers not saved')) {
      setShowAttendanceRegisters(true);
    }
    if (action.subject?.includes('attendance rate')) {
      setShowAttendanceRate(true);
    }
  };

  return (
    <>
      <div className={styles.contentWrapper}>
        <BannerWrapper
          title={`Classroom`}
          subTitle={`${practitioner?.user?.firstName}`}
          color={'primary'}
          size="small"
          renderOverflow={false}
          onBack={() =>
            history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
              practitionerId: practitionerUserId,
            })
          }
          displayOffline={!isOnline}
        >
          <div className="flex w-full flex-wrap justify-center">
            <div className="mx-auto mt-2 flex w-11/12 items-center justify-between">
              <StackedList
                className="flex w-full flex-col rounded-2xl"
                type="MenuList"
                listItems={actionItems?.length > 0 ? listItems : []}
              />
            </div>
            <>
              <Card
                className={styles.registeredChildrenCard}
                borderRaduis={'xl'}
                shadowSize={'md'}
              >
                <div className="ml-4">
                  <div className="mt-4 mb-3 text-4xl font-semibold text-black">
                    {childrenForPractitionerList?.length}
                  </div>
                  <Typography
                    text={`Children enrolled at ${practitionerClassroom?.name}`}
                    type="body"
                    className="mb-4"
                  />
                </div>
              </Card>
              {((attendanceEnabled && isWhiteLabel) || isOpenAccess) && (
                <ClassroomAttendance
                  practitionerClassroomGroups={
                    isPrincipal ? classroomGroups : practitionerClassroomGroups
                  }
                  practitionerClassroomsData={practitionerClassroomsData}
                />
              )}
              <div className="w-full">
                <ChildrenPerAgeGroup
                  childrenForPractitionerList={childrenForPractitionerList}
                  practitionerId={practitionerUserId}
                />
              </div>
            </>
          </div>
          <Dialog
            fullScreen={true}
            visible={showAttendanceRegisters}
            position={DialogPosition.Full}
            stretch={true}
          >
            <ContactPractitioner
              setShowAttendanceRegisters={setShowAttendanceRegisters}
              setShowAttendanceRate={setShowAttendanceRate}
              practitionerId={practitionerUserId}
              notification={notification}
            />
          </Dialog>
          <Dialog
            fullScreen={true}
            visible={showAttendanceRate}
            position={DialogPosition.Full}
            stretch={true}
          >
            <ContactPractitioner
              setShowAttendanceRegisters={setShowAttendanceRegisters}
              setShowAttendanceRate={setShowAttendanceRate}
              practitionerId={practitionerUserId}
              notification={notification}
            />
          </Dialog>
        </BannerWrapper>
      </div>
    </>
  );
};
