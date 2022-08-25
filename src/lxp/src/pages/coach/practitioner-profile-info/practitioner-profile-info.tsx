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
  StackedList,
} from '@ecdlink/ui';
import { NoteTypeEnum } from '@ecdlink/graphql';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { PractitionerProfileRouteState } from './practitioner-profile-info.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './practitioner-profile-info.styles';
import ROUTES from '@routes/routes';
import { PhoneIcon } from '@heroicons/react/solid';
import { CreateNote } from './components/create-note/create-note';
import { getLastNoteDate } from '@utils/child/child-profile-utils';
import { notesSelectors } from '@store/notes';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';

// const mockedData = [
//   {
//     id: 1,
//     title: 'John Buffalo',
//     subTitle: 'Progress report overdue',
//     avatarColor: '#6974af',
//     profileText: 'Jb',
//     alertSeverity: 'error',
//     phoneNumber: '2138471324',
//     email: 'johnbf@gmail.com',
//   },
//   {
//     id: 2,
//     title: 'Pedro Machado',
//     subTitle: 'Progress report overdue',
//     avatarColor: '#6974af',
//     profileText: 'Pm',
//     alertSeverity: 'error',
//     phoneNumber: '23984123490',
//     email: 'pedroM@gmail.com',
//   },
//   {
//     id: 3,
//     title: 'Carlos Vieira',
//     subTitle: 'Progress report overdue',
//     avatarColor: '#6974af',
//     profileText: 'Cv',
//     alertSeverity: 'error',
//     phoneNumber: '314874393',
//     email: 'carlosvieira1234@gmail.com',
//   },
// ];

export const CoachPractitionerProfileInfo: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const isFromProgrammeView = location.state.isFromProgrammeView;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );

  const { theme } = useTheme();

  const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
    useState<boolean>(false);
  const notes = useSelector(notesSelectors.getNotesByUserId(practitionerId));

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
      onActionClick: () =>
        history.push(ROUTES.COACH.PRACTITIONER_CLASSROOM, {
          practitionerId,
        }),
      classNames: 'bg-uiBg',
    },
    {
      title: 'Programme Information',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: 'Location, playgroups & staff',
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
          practitionerId,
        }),
      classNames: 'bg-uiBg',
    },
  ];

  const onCreatePractitionerNoteBack = () => {
    setCreatePractitionerdNoteVisible(false);
  };

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        title={`${practitioner?.user?.firstName}'s Profile`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() =>
          isFromProgrammeView
            ? history.goBack()
            : history.push(ROUTES.COACH.PRACTITIONERS)
        }
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
            className={'px-3 py-1.5'}
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
            className={'rounded-2xl'}
            size={'small'}
            onClick={() => {}}
          >
            <PhoneIcon className="h-5 w-5 text-primary" aria-hidden="true" />
          </Button>
          <Button
            color={'primary'}
            type={'outlined'}
            className={'rounded-2xl'}
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
      <div className="flex justify-center mt-4">
        <div className="w-11/12">
          <StackedList
            className="w-full rounded-2xl -mt-0.5 flex flex-col gap-1"
            type="MenuList"
            listItems={listItems}
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
              text={practitioner?.user?.phoneNumber}
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
                navigator.clipboard.writeText(practitioner?.user?.phoneNumber!);
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
              text={practitioner?.user?.email}
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
                navigator.clipboard.writeText(practitioner?.user?.email!);
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
                text={''}
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
              onClick={
                () => history.push(ROUTES.COACH.NOTES, { practitionerId })
                // setCreatePractitionerdNoteVisible(true)
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
          </div>
          <Dialog
            fullScreen
            visible={createPractitionerNoteVisible}
            position={DialogPosition.Middle}
          >
            <div className={styles.dialogContent}>
              <CreateNote
                userId={practitionerId || ''}
                noteType={NoteTypeEnum.Unknown}
                titleText={`Add a note to ${practitioner?.user?.firstName} profile`}
                onBack={() => onCreatePractitionerNoteBack()}
                onCreated={() => onCreatePractitionerNoteBack()}
              />
            </div>
          </Dialog>
        </div>
        <Divider dividerType="dashed" className="my-4" />
      </>
    </div>
  );
};
