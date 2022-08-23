import { useHistory, useLocation } from 'react-router';
import { useEffect } from 'react';
import {
  BannerWrapper,
  Button,
  renderIcon,
  Typography,
  StackedList,
  Card,
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

// import { CreateNote } from '../components/create-note/create-note';
// import { NoteTypeEnum } from '@ecdlink/graphql';
// import { getLastNoteDate } from '@utils/child/child-profile-utils';
// import { notesSelectors } from '@store/notes';
// import { useSelector } from 'react-redux';

export const CoachPractitionerClassroom: React.FC = () => {
  const mockedData = [
    {
      id: 1,
      title: '75% attendance rate',
      subTitle: 'Coming soon',
      avatarColor: '#FF5C00',
      profileText: 'CS',
      alertSeverity: 'none',
      phoneNumber: '2138471324',
      email: 'johnbf@gmail.com',
    },
    {
      id: 2,
      title: '5 overdue progress reports',
      subTitle: 'Coming soon',
      avatarColor: '#FF5C00',
      profileText: 'CS',
      alertSeverity: 'none',
      phoneNumber: '23984123490',
      email: 'pedroM@gmail.com',
    },
    {
      id: 3,
      title: "5 children haven't progressed",
      subTitle: 'Coming soon',
      avatarColor: '#FF5C00',
      profileText: 'CS',
      alertSeverity: 'none',
      phoneNumber: '314874393',
      email: 'carlosvieira1234@gmail.com',
    },
  ];

  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const children = useSelector(childrenSelectors.getChildren);
  const childrenForPractitioner = useSelector(
    childrenForPractitionerSelectors.getChildrenForPractitioner
  );
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );

  const childrenForPractitionerList = children?.filter((item) =>
    childrenForPractitioner?.find((item2) => item.id === item2.id)
  );

  useEffect(() => {
    resetChildrenForPractitioner();
    (async () =>
      await appDispatch(
        childrenForPractitionerThunkActions.getChildrenForPractitioner({
          id: practitionerId,
        })
      ).unwrap())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appDispatch, practitionerId]);

  const resetChildrenForPractitioner = () => {
    appDispatch(
      childrenForPractitionerActions.resetChildrenForPractitionerState()
    );
  };

  // const handleClick = (practitionerId: number) => {
  //   history.push('practitioner-profile-info', {
  //     practitionerId,
  //   });
  // };

  // const handleChildProfile = () => {
  //   history.push('practitioner-child-list');
  // };
  // const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
  //   useState<boolean>(false);
  // const notes = useSelector(
  //   notesSelectors.getNotesByUserId(practitioner?.id.toString())
  // );

  // const handleProgressSummary = (practitionerId: number) => {
  //   history.push('practitioner-progress-summary', {
  //     practitionerId,
  //   });
  // };

  // const handleReassignClass = (practitionerId: number) => {
  //   history.push('practitioner-reassign-class', {
  //     practitionerId,
  //   });
  // };

  // const onCreatePractitionerNoteBack = () => {
  //   setCreatePractitionerdNoteVisible(false);
  // };

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={`Classroom`}
        subTitle={`${practitioner?.user?.firstName}`}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() =>
          history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
            practitionerId,
          })
        }
        displayOffline={!isOnline}
      ></BannerWrapper>
      <div className="w-full flex flex-wrap justify-center">
        {mockedData ? (
          <div className="flex justify-center w-full">
            <StackedList
              className={styles.stackedList}
              listItems={mockedData}
              type={'UserAlertList'}
            ></StackedList>
          </div>
        ) : null}
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
                color="textMid"
                type="filled"
                size="small"
                onClick={() =>
                  history.push(ROUTES.COACH.PRACTITIONER_CHILD_LIST, {
                    practitionerId,
                  })
                }
              >
                {renderIcon('EyeIcon', 'w-5 h-5 text-white mr-1')}
                <Typography color="white" text={'View all'} type="small" />
              </Button>
            </div>
          </Card>
          <Card
            className={styles.attendanceCard}
            borderRaduis={'xl'}
            shadowSize={'md'}
          >
            <div className="ml-4 mt-4">
              <Typography
                text={'Attendance: June 2021'}
                type="body"
                className="mb-4"
              />
            </div>
            <div className="flex justify-between">
              <div className="ml-4">
                <div className="mt-4 mb-3 text-4xl font-semibold text-successMain">
                  45%
                </div>
                <Typography
                  text={'Little Stars'}
                  type="body"
                  className="mb-4"
                />
              </div>
              <div className="mr-12">
                <div className="mt-4 mb-3 text-4xl font-semibold text-errorMain">
                  85%
                </div>
                <Typography text={'Dolphins'} type="body" className="mb-4" />
              </div>
            </div>
          </Card>
          <div className="w-full">
            <ChildrenPerAgeGroup
              childrenForPractitionerList={childrenForPractitionerList}
              practitionerId={practitionerId}
            />
          </div>
        </>
      </div>
    </div>
  );
};
