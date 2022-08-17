import { useHistory, useLocation } from 'react-router';
import { useState } from 'react';
import { useTheme } from '@ecdlink/core';
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
// import { CreateNote } from '../components/create-note/create-note';
// import { NoteTypeEnum } from '@ecdlink/graphql';
// import { getLastNoteDate } from '@utils/child/child-profile-utils';
// import { notesSelectors } from '@store/notes';
// import { useSelector } from 'react-redux';

export const CoachPractitionerClassroom: React.FC = () => {
  const mockedData = [
    {
      id: 1,
      title: 'John Buffalo',
      subTitle: 'Progress report overdue',
      avatarColor: '#6974af',
      profileText: 'Jb',
      alertSeverity: 'error',
      phoneNumber: '2138471324',
      email: 'johnbf@gmail.com',
    },
    {
      id: 2,
      title: 'Pedro Machado',
      subTitle: 'Progress report overdue',
      avatarColor: '#6974af',
      profileText: 'Pm',
      alertSeverity: 'error',
      phoneNumber: '23984123490',
      email: 'pedroM@gmail.com',
    },
    {
      id: 3,
      title: 'Carlos Vieira',
      subTitle: 'Progress report overdue',
      avatarColor: '#6974af',
      profileText: 'Cv',
      alertSeverity: 'error',
      phoneNumber: '314874393',
      email: 'carlosvieira1234@gmail.com',
    },
  ];

  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const practitioner = mockedData?.find(
    (practitioner) => practitioner?.id === practitionerId
  );
  const { theme } = useTheme();

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
        subTitle={`${practitioner?.title}`}
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
                30
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
          <Card
            className={styles.perAgeCard}
            borderRaduis={'xl'}
            shadowSize={'md'}
          >
            <div className="ml-4 mt-4">
              <Typography
                text={'Children per age group'}
                type="body"
                className="mb-4"
              />
            </div>
            <div className="mx-6">
              <div className="flex justify-between">
                <div>
                  <div className="mt-4 mb-3 text-4xl font-semibold text-black">
                    1
                  </div>
                  <Typography text={'< 18 mths'} type="body" className="mb-4" />
                </div>
                <div>
                  <div className="mt-4 mb-3 text-4xl font-semibold text-black">
                    9
                  </div>
                  <Typography
                    text={'18 mths - 3 years'}
                    type="body"
                    className="mb-4"
                  />
                </div>
              </div>
              <div>
                <div>
                  <div className="mt-4 mb-3 text-4xl font-semibold text-black">
                    3
                  </div>
                  <Typography
                    text={'3 - 5 years'}
                    type="body"
                    className="mb-4"
                  />
                </div>
              </div>
            </div>
          </Card>
        </>
      </div>
    </div>
  );
};
