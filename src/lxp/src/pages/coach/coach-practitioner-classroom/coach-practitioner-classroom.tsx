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

export const CoachPractitionerClassroom: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const practitioner = mockedData?.find(
    (practitioner) => practitioner?.id === practitionerId
  );
  const { theme } = useTheme();
  console.log({ practitioner });
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

  // const getNoteProfileOption = () => {
  //   let baseNotesOptions: ListItemProps = {
  //     key: 'notes',
  //     title: 'Your notes',
  //     showButton: true,
  //     showDivider: true,
  //     dividerType: 'dashed',
  //     withPaddingY: true,
  //   };

  //   if (notes.length === 0) {
  //     baseNotesOptions = {
  //       ...baseNotesOptions,
  //       subTitle: 'Add a note',
  //       buttonType: 'filled',
  //       buttonIcon: 'PlusIcon',
  //       buttonText: 'Add',
  //       buttonTextColor: 'white',
  //       buttonColor: 'primary',
  //       onButtonClick: () => setCreatePractitionerdNoteVisible(true),
  //     };
  //   } else {
  //     baseNotesOptions = {
  //       ...baseNotesOptions,
  //       subTitle: getLastNoteDate(notes),
  //       buttonType: 'outlined',
  //       buttonIcon: 'EyeIcon',
  //       buttonText: 'View',
  //       buttonTextColor: 'primary',
  //       buttonColor: 'primary',
  //       showButton: true,
  //       showDivider: true,
  //       dividerType: 'dashed',
  //       withPaddingY: true,
  //       onButtonClick: () =>
  //         history.push(ROUTES.PRACTITIONER_NOTES, { practitionerId }),
  //     };
  //   }
  //   return baseNotesOptions;
  // };

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
        onBack={() => history.push(ROUTES.CLASSROOM)}
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
            text={'Lions'}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          />
          <StatusChip
            backgroundColour="secondary"
            borderColour="secondary"
            text={`8 children`}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          />
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
      <div className={styles.absentWrapper}>
        <ExclamationCircleIcon
          className="h-12 w-12 text-alertMain mx-2"
          aria-hidden="true"
        />
        <div className="flex flex-col flex-wrap justify-start">
          <Typography
            text="2 days absent last month"
            type={'h2'}
            color={'textMid'}
            align="center"
            className="mt-2"
          />
          <Typography
            text="October 2021"
            type={'body'}
            color={'textMid'}
            align="center"
            className="mt-2"
          />
        </div>
        <ChevronRightIcon
          className="h-8 w-8 text-textMid mr-2"
          aria-hidden="true"
        />
      </div>
      <div className={styles.absentWarning}>
        <Typography
          type={'h1'}
          text={`Is ${practitioner?.title}  absent today?`}
          color={'textMid'}
        />
        <Typography
          type={'body'}
          weight={'bold'}
          text={'You can reassign a class to another practitioner for the day.'}
          color={'textMid'}
        />
        <div className="flex justify-center">
          <Button
            onClick={() => handleReassignClass(practitionerId)}
            className="w-11/12 rounded-2xl mt-3"
            size="small"
            color="primary"
            type="filled"
          >
            {renderIcon('PencilAltIcon', classNames('h-5 w-5 text-white'))}
            <Typography
              type="h5"
              className="ml-2"
              text={`Reassign a class`}
              color="white"
            />
          </Button>
        </div>
      </div>
      <div className={styles.absentWarning}>
        <Typography type={'h2'} text={'Lion class'} color={'textMid'} />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Typography
              type={'h1'}
              weight={'bold'}
              text={'8'}
              color={'textMid'}
              className="mr-4"
            />
            <Typography
              type={'body'}
              weight={'bold'}
              text={'children in class'}
              color={'textMid'}
            />
          </div>
          <Button
            size="small"
            shape="normal"
            color="primary"
            type="filled"
            onClick={handleChildProfile}
            className="rounded-xl"
          >
            <Typography type="help" color="white" text="View" />
            {renderIcon('EyeIcon', styles.buttonIcon)}
          </Button>
        </div>
        <div className="flex flex-start pt-1">
          <StatusChip
            backgroundColour="alertMain"
            borderColour="alertMain"
            text={'75%'}
            textColour={'white'}
            className={'mr-2'}
          />
          <Typography
            type={'body'}
            weight={'bold'}
            text={'attendance June 2021'}
            color={'textMid'}
          />
        </div>
      </div>
      <div className={styles.absentWarning}>
        <Typography type={'h2'} text={'Progress summary'} color={'textMid'} />
        <div className="flex items-center justify-between">
          <div className="flex items-center mt-2 mr-4">
            <StatusChip
              backgroundColour="errorMain"
              borderColour="errorMain"
              text={'2'}
              textColour={'white'}
              className={'mr-2'}
            />
            <Typography
              type={'body'}
              weight={'bold'}
              text={'children working on: does simple things when asked '}
              color={'textMid'}
            />
          </div>
          <Button
            size="small"
            shape="normal"
            color="primary"
            type="filled"
            onClick={() => handleProgressSummary(practitionerId)}
            className="rounded-xl"
          >
            <Typography type="help" color="white" text="View" />
            {renderIcon('EyeIcon', styles.buttonIcon)}
          </Button>
        </div>
      </div>
      <div className={styles.absentWarning}>
        <Typography type={'h2'} text={'Programme planning'} color={'textMid'} />
        <div className="flex items-center justify-between">
          <div className="flex items-center mr-8">
            <Typography
              type={'h1'}
              weight={'bold'}
              text={'2'}
              color={'textMid'}
              className="mr-4"
            />
            <Typography
              type={'body'}
              weight={'bold'}
              text={'programmes planned in June 2021'}
              color={'textMid'}
            />
          </div>
          <Button
            size="small"
            shape="normal"
            color="primary"
            type="filled"
            onClick={() => {}}
            className="rounded-xl"
          >
            <Typography type="help" color="white" text="View" />
            {renderIcon('EyeIcon', styles.buttonIcon)}
          </Button>
        </div>
        <div className="flex flex-start pt-1">
          <StatusChip
            backgroundColour="errorMain"
            borderColour="errorMain"
            text={'1'}
            textColour={'white'}
            className={'mr-2'}
          />
          <Typography
            type={'body'}
            weight={'bold'}
            text={'skill missing: walking & moving'}
            color={'textMid'}
          />
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
