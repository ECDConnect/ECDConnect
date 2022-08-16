import { useHistory, useLocation } from 'react-router';
import { useState } from 'react';
import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  classNames,
  Dialog,
  DialogPosition,
  Divider,
  ProfileAvatar,
  renderIcon,
  StatusChip,
  Typography,
  StackedList,
  Card,
} from '@ecdlink/ui';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { PractitionerProfileRouteState } from './coach-practitioner-classroom.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './coach-practitioner-classroom.styles';
import ROUTES from '@routes/routes';
import {
  ChevronRightIcon,
  ExclamationCircleIcon,
  PhoneIcon,
} from '@heroicons/react/solid';
// import { CreateNote } from '../components/create-note/create-note';
import { NoteTypeEnum } from '@ecdlink/graphql';
import { getLastNoteDate } from '@utils/child/child-profile-utils';
import { notesSelectors } from '@store/notes';
import { useSelector } from 'react-redux';

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

  const handleClick = (practitionerId: number) => {
    history.push('practitioner-profile-info', {
      practitionerId,
    });
  };

  const handleChildProfile = () => {
    history.push('practitioner-child-list');
  };
  const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
    useState<boolean>(false);
  const notes = useSelector(
    notesSelectors.getNotesByUserId(practitioner?.id.toString())
  );

  const handleProgressSummary = (practitionerId: number) => {
    history.push('practitioner-progress-summary', {
      practitionerId,
    });
  };

  const handleReassignClass = (practitionerId: number) => {
    history.push('practitioner-reassign-class', {
      practitionerId,
    });
  };

  const onCreatePractitionerNoteBack = () => {
    setCreatePractitionerdNoteVisible(false);
  };

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={`Classroom`}
        subTitle={`${practitioner?.title}`}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() => history.push(ROUTES.CLASSROOM)}
        displayOffline={!isOnline}
      ></BannerWrapper>
      <>
        {mockedData ? (
          <div className="flex justify-center">
            <StackedList
              className={styles.stackedList}
              listItems={mockedData}
              type={'UserAlertList'}
            ></StackedList>
          </div>
        ) : null}
        <Card
          className={styles.fullWrapper}
          borderRaduis={'md'}
          shadowSize={'md'}
        >
          <div
            className={styles.iconWrapper}
            style={{ backgroundColor: '#808080' }}
          ></div>
          <Typography
            className="mt-2"
            text={'helloo1'}
            type="body"
            weight="bold"
            lineHeight="snug"
          />

          <Typography
            className="mt-2"
            text={'hello'}
            type="body"
            lineHeight="snug"
          />
        </Card>
        <div className={styles.infoWrapper}>
          <div>
            <Typography
              text={'Cellphone number'}
              type="h5"
              color="textMid"
              className={'mt-4'}
            />
            <Typography
              text={practitioner?.phoneNumber}
              type="h4"
              color="textDark"
              className={'mt-1'}
            />
          </div>
          <div>
            <Button
              size="small"
              shape="normal"
              color="primary"
              type="outlined"
              onClick={() => {}}
            >
              <Typography type="help" color="primary" text="Edit" />
              {renderIcon('PencilIcon', styles.buttonIcon)}
            </Button>
          </div>
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div className={styles.infoWrapper}>
          <div>
            <Typography
              text={'Email address'}
              type="h5"
              color="textMid"
              className={'mt-1'}
            />
            <Typography
              text={practitioner?.email}
              type="h4"
              color="textDark"
              className={'mt-1'}
            />
          </div>
          <div>
            <Button
              size="small"
              shape="normal"
              color="primary"
              type="outlined"
              onClick={() => {}}
            >
              <Typography type="help" color="primary" text="Edit" />
              {renderIcon('PencilIcon', styles.buttonIcon)}
            </Button>
          </div>
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div className={styles.infoWrapper}>
          <div>
            <Typography
              text={'Your notes'}
              type="h5"
              color="textMid"
              className={'mt-1'}
            />
            {notes.length > 0 ? (
              <Typography
                text={getLastNoteDate(notes)}
                type="h4"
                color="textDark"
                className={'mt-1'}
              />
            ) : (
              <Typography
                text={'Add a note'}
                type="h4"
                color="textDark"
                className={'mt-1'}
              />
            )}
          </div>
          <div>
            {notes?.length > 0 ? (
              <Button
                size="small"
                shape="normal"
                color="primary"
                type="filled"
                onClick={
                  () => {}
                  //   history.push(ROUTES.PRACTITIONER_NOTES, { practitionerId })
                }
              >
                {renderIcon('EyeIcon', styles.buttonIcon)}
                <Typography
                  type="help"
                  color="white"
                  text="View"
                  className="ml-1"
                />
              </Button>
            ) : (
              <Button
                size="small"
                shape="normal"
                color="primary"
                type="filled"
                onClick={() => setCreatePractitionerdNoteVisible(true)}
              >
                {renderIcon('PlusIcon', styles.buttonIcon)}
                <Typography
                  type="help"
                  color="white"
                  text="Add"
                  className="ml-1"
                />
              </Button>
            )}
          </div>
          <Dialog
            fullScreen
            visible={createPractitionerNoteVisible}
            position={DialogPosition.Middle}
          >
            {/* <div className={styles.dialogContent}>
              <CreateNote
                userId={practitioner?.id.toString() || ''}
                noteType={NoteTypeEnum.Unknown}
                titleText={`Add a note to ${practitioner?.title} profile`}
                onBack={() => onCreatePractitionerNoteBack()}
                onCreated={() => onCreatePractitionerNoteBack()}
              />
            </div> */}
          </Dialog>
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div className="flex justify-center mx-auto mb-4">
          <Button
            onClick={() => {}}
            className="w-11/12 rounded-2xl"
            size="small"
            color="primary"
            type="filled"
          >
            {renderIcon('TrashIcon', classNames('h-5 w-5 text-white'))}
            <Typography
              type="h5"
              className="ml-2"
              text={`Remove practitioner`}
              color="white"
            />
          </Button>
        </div>
      </>
    </div>
  );
};
