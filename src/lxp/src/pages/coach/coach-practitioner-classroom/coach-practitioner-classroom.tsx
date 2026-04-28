import { useHistory, useLocation } from 'react-router-dom';
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
import { ClassroomMetricReport, NotificationDisplay } from '@ecdlink/graphql';
import { PractitionerProfileRouteState } from './coach-practitioner-classroom.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './coach-practitioner-classroom.styles';
import ROUTES from '@routes/routes';
import { childrenSelectors, childrenThunkActions } from '@store/children';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import { ChildrenPerAgeGroup } from './components/childrenPerAgeGroup/childrenPerAgeGroup';
import { ClassroomAttendance } from './components/classroom-attendance/classroom-attendance';
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';
import { ContactPractitioner } from './components/contact-practitioner/contact-practitioner';
import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { useStaticData } from '@hooks/useStaticData';
import { useTenant } from '@/hooks/useTenant';
import { useTenantModules } from '@/hooks/useTenantModules';
import { classroomsThunkActions } from '@/store/classroom';

export const CoachPractitionerClassroom: React.FC = () => {
  const history = useHistory();
  const location = useLocation<PractitionerProfileRouteState>();
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();

  const tenant = useTenant();
  const { attendanceEnabled } = useTenantModules();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const isOpenAccess = tenant?.isOpenAccess;

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
        (item) => item?.id === practitionerClassroomGroups?.[0]?.classroomId
      );

  const classroomGroups = useSelector(
    classroomsForCoachSelectors.getClassroomGroupsForClassroom(
      practitionerClassroom?.id || ''
    )
  );

  const learnersForPractitioner = isPrincipal
    ? classroomGroups.flatMap((x) => x.learners)
    : practitionerClassroomGroups.flatMap((x) => x.learners);

  const childrenForPractitionerList = useMemo(() => {
    return (
      children?.filter((child) =>
        learnersForPractitioner?.some(
          (learner) => learner.childUserId === child.userId
        )
      ) ?? []
    );
  }, [children, learnersForPractitioner]);

  const [classMetrics, setClassMetrics] = useState<ClassroomMetricReport[]>([]);
  const [actionItems, setActionItems] = useState<NotificationDisplay[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationDisplay | null>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  // Fetch attendance metrics
  useEffect(() => {
    if (!practitionerUserId) return;

    const today = new Date();
    const firstDayPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastDayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    dispatch(
      classroomsThunkActions.getClassAttendanceMetricsByUser({
        userId: practitionerUserId,
        startMonth: firstDayPrevMonth,
        endMonth: lastDayPrevMonth,
      })
    )
      .unwrap()
      .then(setClassMetrics);
  }, [practitionerUserId]);

  // Fetch action items
  useEffect(() => {
    if (!practitionerUserId) return;

    const fetchActionItems = async () => {
      try {
        const result = await dispatch(
          practitionerThunkActions.getClassroomActionItems({
            userId: practitionerUserId,
          })
        ).unwrap();

        setActionItems(result);
      } catch (error) {
        console.error('Failed to fetch action items:', error);
      }
    };

    fetchActionItems();
  }, [dispatch, practitionerUserId, setActionItems]);

  // Load children
  useEffect(() => {
    dispatch(childrenThunkActions.getChildren({})).unwrap();
  }, [dispatch]);

  // Filter metrics for this practitioner
  const practitionerClassroomsData = useMemo(() => {
    if (!classMetrics.length) return [];

    return classMetrics.filter((item) => {
      if (isPrincipal) {
        return classroomGroups.some((g) => g.classroomId === item.classroomId);
      }
      return practitionerClassroomGroups.some(
        (g) => g.userId === item.practitionerId
      );
    });
  }, [classMetrics, classroomGroups, practitionerClassroomGroups, isPrincipal]);

  // Action item list
  const listItems: MenuListDataItem[] = useMemo(() => {
    return actionItems.map((action) => {
      const isError = action.color === 'Error';
      return {
        title: action.subject || '',
        subTitle: action.message || '',
        titleStyle: 'text-textDark font-semibold text-base leading-snug',
        subTitleStyle: 'text-sm text-textMid overflow-hidden text-ellipsis',
        menuIcon: isError ? 'ExclamationIcon' : 'InformationCircleIcon',
        menuIconClassName: isError
          ? 'alertMain text-white'
          : 'text-infoMain h-12 w-12 rounded-full bg-infoBg',
        iconBackgroundColor: isError ? 'alertMain' : undefined,
        showIcon: true,
        chipConfig: isError
          ? {
              colorPalette: {
                backgroundColour: 'white',
                borderColour: 'errorMain',
                textColour: 'errorMain',
              },
              text: '1',
            }
          : undefined,
        onActionClick: () => {
          setSelectedNotification(action);
          if (action.subject?.includes('progress summary')) {
            history.push(
              ROUTES.COACH
                .COACH_PROGRESS_VIEW_REPORTS_SUMMARY_SELECT_CLASSROOM_GROUP_AND_AGE_GROUP,
              {
                practitionerId: practitionerUserId,
              }
            );
          } else {
            setIsContactDialogOpen(true);
          }
        },
        classNames: 'bg-uiBg',
      };
    });
  }, [actionItems]);

  const handleBack = () => {
    history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
      practitionerId: practitionerUserId,
    });
  };

  return (
    <>
      <BannerWrapper
        title="Classroom"
        subTitle={practitioner?.user?.firstName || ''}
        color="primary"
        size="small"
        onBack={handleBack}
        displayOffline={!isOnline}
        renderOverflow={true}
      >
        <div className="flex w-full flex-col items-center px-4 pb-6">
          {actionItems.length > 0 && (
            <StackedList
              className="mt-4 w-11/12 space-y-1"
              type="MenuList"
              listItems={listItems}
            />
          )}

          <Card
            className={styles.registeredChildrenCard}
            borderRaduis="xl"
            shadowSize="md"
          >
            <div className="ml-4 mb-2 mt-1">
              <Typography
                type="h1"
                text={childrenForPractitionerList.length.toString()}
                color="textDark"
                className="mb-2"
              />
              <Typography
                text={`Children enrolled at ${
                  practitionerClassroom?.name || 'this classroom'
                }`}
                type="body"
                color="textMid"
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
        </div>
      </BannerWrapper>

      <Dialog
        visible={isContactDialogOpen}
        position={DialogPosition.Full}
        fullScreen
        stretch
      >
        <ContactPractitioner
          practitionerId={practitionerUserId}
          notification={selectedNotification}
          onClose={() => setIsContactDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};
