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
import { classroomsSelectors } from '@/store/classroom';

// const practitionersList: PractitionerDto[] = [
//   {
//     id: '4efb5692-11fe-4c39-967c-a02670551406',
//     userId: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
//     isPrincipal: true,
//     isFundaAppAdmin: false,
//     isTrainee: false,
//     principalHierarchy: '',
//     isActive: true,
//     coachHierarchy: '23afbf4f-d5f5-473a-943c-67f674ea7f1e',
//     isRegistered: true,
//     shareInfo: true,
//     languageUsedInGroups: '',
//     attendanceRegisterLink: '',
//     user: {
//       idNumber: '8707255800080',
//       fullName: 'Practitioner00001 Test0001',
//       firstName: 'Practitioner00001',
//       surname: 'Test0001',
//       id: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
//       email: 'practitioner00001@gmail.com',
//       phoneNumber: '+27875502599',
//       profileImageUrl:
//         'data:image/png;base64,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',
//       isSouthAfricanCitizen: true,
//       verifiedByHomeAffairs: true,
//       contactPreference: '',
//     },
//   },
//   {
//     id: '974e06ab-c3d0-4520-8d8d-bb9aed891176',
//     userId: '81d0da8a-9089-4f28-b734-71e9b7803180',
//     isPrincipal: false,
//     isFundaAppAdmin: false,
//     isTrainee: false,
//     principalHierarchy: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
//     isActive: true,
//     coachHierarchy: '23afbf4f-d5f5-473a-943c-67f674ea7f1e',
//     isRegistered: true,
//     shareInfo: true,
//     languageUsedInGroups: '',
//     attendanceRegisterLink: '',
//     user: {
//       idNumber: '9011255800086',
//       fullName: 'Practitioner00002 Test00002',
//       firstName: 'Practitioner00002',
//       surname: 'Test00002',
//       id: '81d0da8a-9089-4f28-b734-71e9b7803180',
//       email: 'practitioner00002@gmail.com',
//       phoneNumber: '+27875502599',
//       profileImageUrl: '',
//       isSouthAfricanCitizen: true,
//       verifiedByHomeAffairs: true,
//       contactPreference: '',
//     },
//   },
//   {
//     id: 'f7bbea13-af5d-4180-8c35-cdb797ccc419',
//     userId: '3c1036b5-8ffa-4a42-a13c-79ccd7a56aa6',
//     isPrincipal: false,
//     isFundaAppAdmin: false,
//     isTrainee: false,
//     principalHierarchy: '59c4b252-b42e-4c9a-892c-214830a2c1b9',
//     isActive: true,
//     coachHierarchy: '23afbf4f-d5f5-473a-943c-67f674ea7f1e',
//     isRegistered: true,
//     shareInfo: true,
//     languageUsedInGroups: '',
//     attendanceRegisterLink: '',
//     user: {
//       idNumber: '9204155800088',
//       fullName: 'Practitioner00003 Test00003',
//       firstName: 'Practitioner00003',
//       surname: 'Test00003',
//       id: '3c1036b5-8ffa-4a42-a13c-79ccd7a56aa6',
//       email: 'practitioner00003@gmail.com',
//       phoneNumber: '+27875502599',
//       profileImageUrl: '',
//       isSouthAfricanCitizen: true,
//       verifiedByHomeAffairs: true,
//       contactPreference: '',
//     },
//   },
// ];

export const PrincipalPractitionerProfileInfo: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const isFromProgrammeView = location.state.isFromProgrammeView;
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );
  const classroomGroup = classroomGroups?.find((item: any) => {
    return item?.userId === practitionerId;
  });

  const { theme } = useTheme();

  const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
    useState<boolean>(false);
  const notes = useSelector(notesSelectors.getNotesByUserId(practitionerId));

  const onCreatePractitionerNoteBack = () => {
    setCreatePractitionerdNoteVisible(false);
  };

  const handleReassignClass = (practitionerId: string) => {
    history.push('practitioner-reassign-class', {
      practitionerId,
    });
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
            dataUrl={practitioner?.user?.profileImageUrl || ''}
            size={'header'}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onPressed={() => {}}
          />
        </div>

        <div className={styles.chipsWrapper}>
          <StatusChip
            backgroundColour="primary"
            borderColour="primary"
            text={`${classroomGroup?.name}` || 'No class'}
            textColour={'white'}
            className={'px-3 py-1.5'}
          />
          <StatusChip
            backgroundColour="secondary"
            borderColour="secondary"
            text={`0 children`}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          />
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
                onClick={() => handleReassignClass(practitionerId)}
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
        <Card className={styles.absentCard}>
          <Typography
            type={'h1'}
            text={classroomGroup?.name}
            color={'textMid'}
            className={styles.absentCardTitle}
          />
          <div>
            <div className="flex flex-col mt-2 mr-2">
              <div className="flex items-center justify-between w-11/12 ml-4">
                <div className="flex items-center w-full">
                  <Typography
                    type={'h2'}
                    text={'N/A'}
                    color={'textDark'}
                    className="mt-2"
                  />
                  <Typography
                    type={'body'}
                    text={'children in class'}
                    color={'textDark'}
                    className="mt-2 ml-4 mr-4"
                  />
                </div>
                <Button
                  size="small"
                  shape="normal"
                  color="primary"
                  type="filled"
                  onClick={() =>
                    history.push(ROUTES.PRINCIPAL.PRACTITIONER_CHILD_LIST, {
                      practitionerId,
                    })
                  }
                  className="rounded-xl mt-2"
                >
                  <Typography type="help" color="white" text="View" />
                  {renderIcon('EyeIcon', styles.buttonIcon)}
                </Button>
              </div>
              <div className="flex justify-start items-center mt-2 mx-4 mb-4 w-9/12">
                <StatusChip
                  backgroundColour="alertMain"
                  borderColour="alertMain"
                  text={'N/A'}
                  textColour={'white'}
                  className={'mr-2'}
                />
                <Typography
                  type={'body'}
                  weight={'bold'}
                  text={'attendance in September 2022'}
                  color={'textMid'}
                />
              </div>
            </div>
          </div>
        </Card>
        <Card className={styles.absentCard}>
          <Typography
            type={'h1'}
            text={'Progress summary'}
            color={'textMid'}
            className={styles.absentCardTitle}
          />
          <div className="flex items-center mt-2 mr-4">
            <div className="flex items-center mt-2 mx-4 mb-4 w-full">
              <StatusChip
                backgroundColour="errorMain"
                borderColour="errorMain"
                text={'N/A'}
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
              onClick={() => {}}
              className="rounded-xl"
              disabled={true}
            >
              <Typography type="help" color="white" text="View" />
              {renderIcon('EyeIcon', styles.buttonIcon)}
            </Button>
          </div>
        </Card>
        <Card className={styles.absentCard}>
          <Typography
            type={'h1'}
            text={'Programme planning'}
            color={'textMid'}
            className={styles.absentCardTitle}
          />
          <div>
            <div className="flex flex-col mt-2 mr-4">
              <div className="flex items-center w-11/12 ml-4">
                <Typography
                  type={'h2'}
                  text={'N/A'}
                  color={'textDark'}
                  className="mt-2"
                />
                <Typography
                  type={'body'}
                  text={'programmes planned in September 2022'}
                  color={'textDark'}
                  className="mt-2 ml-4 mr-8"
                />
                <Button
                  size="small"
                  shape="normal"
                  color="primary"
                  type="filled"
                  onClick={() => {}}
                  className="rounded-xl mt-2"
                  disabled={true}
                >
                  <Typography type="help" color="white" text="View" />
                  {renderIcon('EyeIcon', styles.buttonIcon)}
                </Button>
              </div>
              <div className="flex justify-start items-center mt-2 mx-4 mb-4 w-9/12">
                <StatusChip
                  backgroundColour="errorMain"
                  borderColour="errorMain"
                  text={'N/A'}
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
              text={'N/A'}
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
                () => history.push(ROUTES.PRINCIPAL.NOTES, { practitionerId })
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
