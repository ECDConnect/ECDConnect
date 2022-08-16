import { useHistory, useLocation } from 'react-router';
import { useState } from 'react';
import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  ProfileAvatar,
  renderIcon,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { PractitionerProfileRouteState } from './practitioner-profile-info.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './practitioner-profile-info.styles';
import ROUTES from '@routes/routes';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  PhoneIcon,
} from '@heroicons/react/solid';
// import { CreateNote } from '../../components/create-note/create-note';
import { NoteTypeEnum } from '@ecdlink/graphql';
import { getLastNoteDate } from '@utils/child/child-profile-utils';
import { notesSelectors } from '@store/notes';
import { useSelector } from 'react-redux';

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

export const CoachPractitionerProfileInfo: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const practitioner = mockedData?.find(
    (practitioner) => practitioner?.id === practitionerId
  );
  const { theme } = useTheme();
  const hasClasses = true;

  const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
    useState<boolean>(false);
  const notes = useSelector(
    notesSelectors.getNotesByUserId(practitioner?.id.toString())
  );

  const testFunc = () => {
    navigator.clipboard.readText().then((clipText) => document.querySelector);
  };

  const onCreatePractitionerNoteBack = () => {
    setCreatePractitionerdNoteVisible(false);
  };

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        title={`${practitioner?.title}'s Profile`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.push(ROUTES.COACH.PRACTITIONERS)}
        displayOffline={!isOnline}
      >
        <div className={styles.avatarWrapper}>
          <ProfileAvatar
            hasConsent={true}
            canChangeImage={false}
            dataUrl={''}
            size={'header'}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onPressed={() => {}}
          />
        </div>

        <div className={styles.chipsWrapper}>
          <StatusChip
            backgroundColour="primary"
            borderColour="primary"
            text={'SmartStarter'}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          />
          {/* <StatusChip
            backgroundColour="tertiary"
            borderColour="tertiary"
            text={`Owner`}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          /> */}
        </div>
        <div className={styles.contactButtons}>
          <Button
            color={'primary'}
            type={'outlined'}
            className={'mr-4 rounded-xl'}
            size={'small'}
            onClick={() => {}}
          >
            <PhoneIcon
              className="h-6 w-5 text-primary mx-2"
              aria-hidden="true"
            />
          </Button>
          <Button
            color={'primary'}
            type={'outlined'}
            className={'mr-4 rounded-xl'}
            size={'small'}
            onClick={() => {}}
          >
            <img
              src={getLogo(LogoSvgs.whatsapp)}
              alt="whatsapp"
              className={styles.buttonIconStyle}
            />
          </Button>
        </div>
      </BannerWrapper>
      {hasClasses && (
        <div className={styles.listItemFirst}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={styles.circleIconDiv}>
                <AcademicCapIcon className={styles.circleIcon} />
              </div>
              <div className="w-9/12">
                <Typography
                  type={'h4'}
                  weight={'bold'}
                  text={'Classroom'}
                  color={'textMid'}
                  className="w-8/12"
                />
                <Typography
                  type={'body'}
                  weight={'bold'}
                  text={'Children, progress & attendance'}
                  color={'textMid'}
                />
              </div>
              <div className="rounded-full bg-alertMain mr-4 w-8 h-6 grid place-items-center">
                <Typography
                  type={'body'}
                  weight={'bold'}
                  text={'1'}
                  color={'white'}
                />
              </div>
              <ChevronRightIcon
                className={styles.rightArrowIcon}
                onClick={() =>
                  history.push(ROUTES.COACH.PRACTITIONER_CLASSROOM, {
                    practitionerId,
                  })
                }
              />
            </div>
            {/* <ChevronRightIcon
              className={styles.rightArrowIcon}
              onClick={() =>
                history.push(ROUTES.PRACTITIONER_COACH_CLASSROOM_DASHBOARD, {
                  practitionerId,
                })
              }
            /> */}
            {/* <Button
              size="small"
              shape="normal"
              color="primary"
              type="filled"
              onClick={handleChildProfile}
              className="rounded-xl"
            >
              <Typography type="help" color="white" text="View" />
              {renderIcon('EyeIcon', styles.buttonIcon)}
            </Button> */}
          </div>
        </div>
      )}
      <div className={styles.listItem}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={styles.circleIconDiv}>
              <InformationCircleIcon className={styles.circleIcon} />
            </div>
            <div className="w-9/12">
              <Typography
                type={'h4'}
                weight={'bold'}
                text={'Programme information'}
                color={'textMid'}
                className="w-8/12"
              />
              <Typography
                type={'body'}
                weight={'bold'}
                text={'Location, playgroups & staff'}
                color={'textMid'}
              />
            </div>
            <div className="rounded-full bg-alertMain mr-4 w-8 h-6 grid place-items-center">
              <Typography
                type={'body'}
                weight={'bold'}
                text={'1'}
                color={'white'}
              />
            </div>
          </div>
          <ChevronRightIcon className={styles.rightArrowIcon} />
        </div>
      </div>
      <>
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
              onClick={() => {
                navigator.clipboard.writeText(practitioner?.phoneNumber!);
              }}
            >
              <Typography type="help" color="primary" text="Copy" />
              {renderIcon('DocumentDuplicateIcon', styles.buttonIcon)}
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
              onClick={() => {
                navigator.clipboard.writeText(practitioner?.email!);
              }}
            >
              <Typography type="help" color="primary" text="Copy" />
              {renderIcon('DocumentDuplicateIcon', styles.buttonIcon)}
            </Button>
          </div>
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div className={styles.infoWrapper}>
          <div>
            <Typography
              text={'Smartstart club'}
              type="h5"
              color="textMid"
              className={'mt-1'}
            />
            <Typography
              text={'Lady bugs'}
              type="h4"
              color="textDark"
              className={'mt-1'}
            />
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
            <Button
              size="small"
              shape="normal"
              color="primary"
              type="filled"
              onClick={() => {}}
            >
              {renderIcon('EyeIcon', styles.buttonIcon)}
              <Typography
                type="help"
                color="white"
                text="View"
                className="ml-1"
              />
            </Button>
          </div>
          <Dialog
            fullScreen
            visible={createPractitionerNoteVisible}
            position={DialogPosition.Middle}
          >
            <div className={styles.dialogContent}>
              {/* <CreateNote
                userId={practitioner?.id.toString() || ''}
                noteType={NoteTypeEnum.Unknown}
                titleText={`Add a note to ${practitioner?.title} profile`}
                onBack={() => onCreatePractitionerNoteBack()}
                onCreated={() => onCreatePractitionerNoteBack()}
              /> */}
            </div>
          </Dialog>
        </div>
        <Divider dividerType="dashed" className="my-4" />
      </>
    </div>
  );
};
