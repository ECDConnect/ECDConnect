import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { BannerWrapper, Typography, Card, StackedList } from '@ecdlink/ui';
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

export const CoachPractitionerClassroom: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const children = useSelector(childrenSelectors.getChildren);
  // TODO - this might need updates
  const childrenForPractitioner = useSelector(childrenSelectors.getChildren);
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerUserId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerUserId
  );

  const isPrincipal = practitioner?.isPrincipal === true;

  const coachClassrooms = useSelector(
    classroomsForCoachSelectors.getClassroomForCoach
  );
  const coachClassroomGroups = useSelector(
    classroomsForCoachSelectors.getClassroomGroups
  );

  const practitionerClassroomGroups =
    coachClassroomGroups?.filter(
      (item) => item.userId === practitionerUserId
    ) || [];

  const practitionerClassroom = isPrincipal
    ? coachClassrooms?.find((item) => item?.userId === practitionerUserId)
    : coachClassrooms?.find(
        (item) => item?.id === practitionerClassroomGroups?.[0].classroomId
      );

  const classroomGroups =
    coachClassroomGroups?.filter(
      (item) => item.classroomId === practitionerClassroom?.id
    ) || [];

  const childrenForPractitionerList = children?.filter((item) =>
    childrenForPractitioner?.find((item2) => item.id === item2.id)
  );

  const [practitionerClassroomsData, setPractitionerClassroomsData] =
    useState<any[]>();

  const [classMetrics, setClassMetrics] = useState<any>();

  const [actionItems, setActionItems] = useState<any>();

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

  // TODO: Complete list based on 'getClassroomsActionItems':
  const listItems = [
    {
      title: 'Classroom',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'Children, progress & attendance',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'AcademicCapIcon',
      menuIconClassName: 'bg-secondary text-white',
      showIcon: true,
      iconBackgroundColor: 'secondary',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'errorMain',
        },
      },
      text: '1',
      onActionClick: () => {
        history.push(ROUTES.COACH.PRACTITIONER_CLASSROOM, {
          practitionerId: practitionerUserId,
        });
      },
      classNames: 'bg-uiBg',
    },
    {
      title: 'Programme Information',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'Location, classes & staff',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'InformationCircleIcon',
      menuIconClassName: 'bg-secondary text-white',
      showIcon: true,
      iconBackgroundColor: 'secondary',
      chipConfig: {
        colorPalette: {
          backgroundColour: 'white',
          borderColour: 'errorMain',
          textColour: 'errorMain',
        },
      },
      text: '1',
      onActionClick: () =>
        history.push(ROUTES.COACH.PROGRAMME_INFORMATION, {
          practitionerId: practitionerUserId,
        }),
      classNames: 'bg-uiBg',
    },
  ];

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
        ></BannerWrapper>
        <div className="flex w-full flex-wrap justify-center">
          <div className="mt-4 flex justify-center">
            <div className="w-11/12">
              <StackedList
                className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
                type="MenuList"
                listItems={actionItems?.length > 0 ? listItems : []}
              />
            </div>
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
            <ClassroomAttendance
              practitionerClassroomGroups={
                isPrincipal ? classroomGroups : practitionerClassroomGroups
              }
              practitionerClassroomsData={practitionerClassroomsData}
            />
            <div className="w-full">
              <ChildrenPerAgeGroup
                childrenForPractitionerList={childrenForPractitionerList}
                practitionerId={practitionerUserId}
              />
            </div>
          </>
        </div>
      </div>
    </>
  );
};
