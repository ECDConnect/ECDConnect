import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import {
  BannerWrapper,
  Button,
  renderIcon,
  Typography,
  Card,
  StackedList,
  MenuListDataItem,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { PractitionerProfileRouteState } from './coach-practitioner-classroom.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './coach-practitioner-classroom.styles';
import ROUTES from '@routes/routes';
import { childrenSelectors } from '@store/children';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import {
  childrenForPractitionerActions,
  childrenForPractitionerSelectors,
  childrenForPractitionerThunkActions,
} from '@/store/childrenForPractitioner';
import { ChildrenPerAgeGroup } from './components/childrenPerAgeGroup/childrenPerAgeGroup';
import { classroomsSelectors } from '@/store/classroom';
import { ClassroomAttendance } from './components/classroom-attendance/classroom-attendance';
import { authSelectors } from '@/store/auth';
import { PractitionerService } from '@/services/PractitionerService';
import { ClassroomGroupService } from '@/services/ClassroomGroupService';
import { traineeSelectors } from '@/store/trainee';
import { getStepDate } from '../coach-practitioner-journey/timeline/timeline-steps';
import { RegisterChildrenInfo } from './components/register-children-info/register-children-info';

export const CoachPractitionerClassroom: React.FC = () => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const children = useSelector(childrenSelectors.getChildren);
  const childrenForPractitioner = useSelector(
    childrenForPractitionerSelectors.getChildrenForPractitioner
  );
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerUserId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerUserId
  );

  const isTrainee = practitioner?.isTrainee;

  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitionerClassroomGroups = classroomGroups.filter(
    (item) => item.userId === practitionerUserId
  );
  const childrenForPractitionerList = children?.filter((item) =>
    childrenForPractitioner?.find((item2) => item.id === item2.id)
  );
  const [classMetrics, setClassMetrics] = useState<any>();
  const [practitionerClassroomsData, setPractitionerClassroomsData] =
    useState<any[]>();
  const traineeTimeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline
  );
  const [showRegisterChildrenInfo, setShowRegisterChildrenInfo] =
    useState(false);

  const registerChildrenDeadlineDate =
    traineeTimeline?.threeChildrenRegisteredDeadlineDate;
  const registerChildrenDeadlineDateFormatted = getStepDate(
    registerChildrenDeadlineDate
  );

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
    resetChildrenForPractitioner();
    (async () =>
      await appDispatch(
        childrenForPractitionerThunkActions.getChildrenForPractitioner({
          id: practitionerUserId,
        })
      ).unwrap())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appDispatch, practitionerUserId]);

  const resetChildrenForPractitioner = () => {
    appDispatch(
      childrenForPractitionerActions.resetChildrenForPractitionerState()
    );
  };

  const notificationItem: MenuListDataItem[] = [
    {
      showIcon: true,
      menuIcon: 'ExclamationIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: `${childrenForPractitionerList?.length}/3 children registered`,
      titleStyle: 'text-textDark semibold',
      subTitle: `Deadline: ${registerChildrenDeadlineDateFormatted}`,
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'alertMain',
      backgroundColor: 'uiBg',
      onActionClick: () => setShowRegisterChildrenInfo(true),
    },
  ];

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
        {isTrainee && childrenForPractitioner?.length! < 3 && (
          <div className="flex w-full justify-center">
            <div className="my-4 w-11/12">
              <StackedList
                isFullHeight={false}
                className={'flex flex-col gap-2'}
                listItems={notificationItem}
                type={'MenuList'}
              />
            </div>
          </div>
        )}
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
                  text={'Registered children'}
                  type="body"
                  className="mb-4"
                />
              </div>
              <div className="mr-4 mt-8 h-full">
                <Button
                  color="primary"
                  type="filled"
                  size="small"
                  onClick={() => {
                    history.push(ROUTES.COACH.PRACTITIONER_CHILD_LIST, {
                      practitionerId: practitionerUserId,
                    });
                  }}
                >
                  {renderIcon('EyeIcon', 'w-5 h-5 text-white mr-1')}
                  <Typography color="white" text={'View all'} type="small" />
                </Button>
              </div>
            </Card>
            {!isTrainee && (
              <ClassroomAttendance
                practitionerClassroomGroups={practitionerClassroomGroups}
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
      </div>
      <Dialog
        visible={showRegisterChildrenInfo}
        stretch={true}
        position={DialogPosition.Full}
      >
        <RegisterChildrenInfo
          setShowRegisterChildrenInfo={setShowRegisterChildrenInfo}
          registerChildrenDeadlineDateFormatted={
            registerChildrenDeadlineDateFormatted
          }
          practitioner={practitioner}
        />
      </Dialog>
    </>
  );
};
