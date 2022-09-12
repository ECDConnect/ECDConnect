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
  Card,
} from '@ecdlink/ui';
import { NoteTypeEnum } from '@ecdlink/graphql';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { PractitionerProfileRouteState } from './principal-practitioner-profile.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './principal-practitioner-profile.styles';
import ROUTES from '@routes/routes';
import { PhoneIcon } from '@heroicons/react/solid';
import { CreateNote } from './components/create-note/create-note';
import { getLastNoteDate } from '@utils/child/child-profile-utils';
import { notesSelectors } from '@store/notes';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerDto } from '@/../../../packages/core/lib';

const practitionersList: PractitionerDto[] = [
  {
    id: '4efb5692-11fe-4c39-967c-a02670551406',
    userId: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
    isPrincipal: true,
    isFundaAppAdmin: false,
    isTrainee: false,
    principalHierarchy: '',
    isActive: true,
    coachHierarchy: '23afbf4f-d5f5-473a-943c-67f674ea7f1e',
    isRegistered: true,
    shareInfo: true,
    languageUsedInGroups: '',
    attendanceRegisterLink: '',
    user: {
      idNumber: '8707255800080',
      fullName: 'Practitioner00001 Test0001',
      firstName: 'Practitioner00001',
      surname: 'Test0001',
      id: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
      email: 'practitioner00001@gmail.com',
      phoneNumber: '+27875502599',
      profileImageUrl: '',
      isSouthAfricanCitizen: true,
      verifiedByHomeAffairs: true,
      contactPreference: '',
    },
  },
  {
    id: '974e06ab-c3d0-4520-8d8d-bb9aed891176',
    userId: '81d0da8a-9089-4f28-b734-71e9b7803180',
    isPrincipal: false,
    isFundaAppAdmin: false,
    isTrainee: false,
    principalHierarchy: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
    isActive: true,
    coachHierarchy: '23afbf4f-d5f5-473a-943c-67f674ea7f1e',
    isRegistered: true,
    shareInfo: true,
    languageUsedInGroups: '',
    attendanceRegisterLink: '',
    user: {
      idNumber: '9011255800086',
      fullName: 'Practitioner00002 Test00002',
      firstName: 'Practitioner00002',
      surname: 'Test00002',
      id: '81d0da8a-9089-4f28-b734-71e9b7803180',
      email: 'practitioner00002@gmail.com',
      phoneNumber: '+27875502599',
      profileImageUrl: '',
      isSouthAfricanCitizen: true,
      verifiedByHomeAffairs: true,
      contactPreference: '',
    },
  },
  {
    id: 'f7bbea13-af5d-4180-8c35-cdb797ccc419',
    userId: '3c1036b5-8ffa-4a42-a13c-79ccd7a56aa6',
    isPrincipal: false,
    isFundaAppAdmin: false,
    isTrainee: false,
    principalHierarchy: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
    isActive: true,
    coachHierarchy: '23afbf4f-d5f5-473a-943c-67f674ea7f1e',
    isRegistered: true,
    shareInfo: true,
    languageUsedInGroups: '',
    attendanceRegisterLink: '',
    user: {
      idNumber: '9204155800088',
      fullName: 'Practitioner00003 Test00003',
      firstName: 'Practitioner00003',
      surname: 'Test00003',
      id: '3c1036b5-8ffa-4a42-a13c-79ccd7a56aa6',
      email: 'practitioner00003@gmail.com',
      phoneNumber: '+27875502599',
      profileImageUrl: '',
      isSouthAfricanCitizen: true,
      verifiedByHomeAffairs: true,
      contactPreference: '',
    },
  },
];

export const PrincipalPractitionerProfileInfo: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const isFromProgrammeView = location.state.isFromProgrammeView;
  // const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitionersList?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );
  console.log({ practitioner });
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
        onBack={() => history.goBack()}
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
      {/* <div className="flex justify-center mt-4">
        <div className="w-11/12">
          <StackedList
            className="w-full rounded-2xl -mt-0.5 flex flex-col gap-1"
            type="MenuList"
            listItems={listItems}
          />
        </div>
      </div> */}
      <div className="flex flex-wrap justify-center">
        <Card className={styles.absentCard}>
          <div className={styles.absentCardTitle}>
            <Typography
              type={'h1'}
              color="textDark"
              text={'Is someone absent today?'}
              className={styles.absentCardTitle}
            />
            <Typography
              type={'body'}
              color="textMid"
              text={
                'You can reassign a class to another practitioner for the day.'
              }
              className={styles.absentCardSubTitle}
            />
            <div className="flex justify-center">
              <Button
                type="filled"
                color="primary"
                className={'w-11/12 mt-6 mb-6'}
                onClick={() => {}}
              >
                {renderIcon(
                  'PencilAltIcon',
                  'w-5 h-5 color-white text-white mr-1'
                )}
                <Typography
                  type="body"
                  className="mr-4"
                  color="white"
                  text={'Reassign a class'}
                ></Typography>
              </Button>
            </div>
          </div>
        </Card>
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
