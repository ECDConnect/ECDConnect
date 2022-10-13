import { useHistory, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
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
import { classroomsSelectors } from '@/store/classroom';
import { useAppDispatch } from '@store';
import {
  childrenForPractitionerSelectors,
  childrenForPractitionerThunkActions,
} from '@/store/childrenForPractitioner';
import { authSelectors } from '@/store/auth';
import { PractitionerNotRegistered } from './practitioner-not-registered/practitioner-not-registered';
import { PractitionerService } from '@/services/PractitionerService';
import { practitionerThunkActions } from '@/store/practitioner';
import { ClassroomGroupService } from '@/services/ClassroomGroupService';

export const PrincipalPractitionerProfileInfo: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  // const isFromProgrammeView = location.state.isFromProgrammeView;
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );
  const childrenForPractitioner = useSelector(
    childrenForPractitionerSelectors.getChildrenForPractitioner
  );
  const practitionerClassroomGroups = classroomGroups?.filter((item: any) => {
    return item?.userId === practitionerId;
  });
  const learners = useSelector(classroomsSelectors.getClassroomGroupLearners);
  // const learners = useSelector(classroomsSelectors.)
  const { theme } = useTheme();

  const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
    useState<boolean>(false);
  const notes = useSelector(notesSelectors.getNotesByUserId(practitionerId));

  const onCreatePractitionerNoteBack = () => {
    setCreatePractitionerdNoteVisible(false);
  };

  const [classMetrics, setClassMetrics] = useState<any>();
  const practitionerClassrooms = [];

  const handleReassignClass = (practitionerId: string) => {
    history.push('practitioner-reassign-class', {
      practitionerId,
    });
  };

  useEffect(() => {
    if (practitionerClassroomGroups && classMetrics) {
      const test2 = practitionerClassroomGroups.map((x) => x.id);
      const test1 = practitionerClassroomGroups.filter((item) =>
        test2?.includes(item?.id!)
      );

      console.log({ test1 });
    }
  }, [classMetrics, practitionerClassroomGroups]);

  useEffect(() => {
    (async () =>
      await appDispatch(
        childrenForPractitionerThunkActions.getChildrenForPractitioner({
          id: practitionerId,
        })
      ).unwrap())();
  }, [appDispatch, practitionerId]);

  const callForHelp = () => {
    window.open(`tel:${practitioner?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/${practitioner?.user?.phoneNumber}`);
  };

  const removePractitioner = async () => {
    await new PractitionerService(
      userAuth?.auth_token || ''
    ).UpdatePrincipalInvitation(
      practitioner?.userId!,
      practitioner?.principalHierarchy!,
      false
    );
    await new PractitionerService(
      userAuth?.auth_token || ''
    ).UpdatePrincipalInvitation(
      practitioner?.userId!,
      practitioner?.principalHierarchy!,
      false
    );
    await new PractitionerService(
      userAuth?.auth_token!
    ).UpdatePractitionerRegistered(practitioner?.userId!, false);
    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();
    history.push(ROUTES.CLASSROOM);
  };

  const test = async () => {
    const a = await new ClassroomGroupService(
      userAuth?.auth_token!
    ).getClassAttendanceMetrics();
    setClassMetrics(a);
    return a;
  };
  console.log(classMetrics);
  console.log({ practitionerClassroomGroups });
  useEffect(() => {
    test();
  }, []);

  return (
    <>
      {practitioner?.isRegistered === null ||
      practitioner?.isRegistered === false ? (
        <PractitionerNotRegistered practitioner={practitioner} />
      ) : (
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
              {practitionerClassroomGroups.length > 0 ? (
                practitionerClassroomGroups?.map((item, index) => {
                  return (
                    <StatusChip
                      key={index}
                      backgroundColour="primary"
                      borderColour="primary"
                      text={`${item?.name}` || 'No class'}
                      textColour={'white'}
                      className={'px-3 py-1.5'}
                    />
                  );
                })
              ) : (
                <StatusChip
                  backgroundColour="primary"
                  borderColour="primary"
                  text={'No class'}
                  textColour={'white'}
                  className={'px-3 py-1.5'}
                />
              )}
              <StatusChip
                backgroundColour="secondary"
                borderColour="secondary"
                text={`${childrenForPractitioner?.length} children`}
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
                onClick={callForHelp}
              >
                <PhoneIcon
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              </Button>
              <Button
                color={'primary'}
                type={'outlined'}
                className={'rounded-2xl'}
                size={'small'}
                onClick={whatsapp}
              >
                <img
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="whatsapp"
                  className={styles.buttonIconStyle}
                />
              </Button>
            </div>
          </BannerWrapper>
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
            {practitionerClassroomGroups.length > 0
              ? practitionerClassroomGroups?.map((item, index) => {
                  const learnersByClass = learners?.filter(
                    (learner) => learner.classroomGroupId === item?.id
                  );

                  return (
                    <Card className={styles.absentCard} key={index}>
                      <Typography
                        type={'h1'}
                        text={item.name}
                        color={'textMid'}
                        className={styles.absentCardTitle}
                      />
                      <div>
                        <div className="flex flex-col mt-2 mr-2">
                          <div className="flex items-center justify-between w-11/12 ml-4">
                            <div className="flex items-center w-full">
                              <Typography
                                type={'h2'}
                                text={`${learnersByClass?.length}`}
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
                                history.push(
                                  ROUTES.PRINCIPAL.PRACTITIONER_CHILD_LIST,
                                  {
                                    practitionerId,
                                  }
                                )
                              }
                              className="rounded-xl mt-2"
                            >
                              <Typography
                                type="help"
                                color="white"
                                text="View"
                              />
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
                  );
                })
              : null}
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
                    navigator.clipboard.writeText(
                      practitioner?.user?.phoneNumber!
                    );
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
                    () =>
                      history.push(ROUTES.PRINCIPAL.NOTES, { practitionerId })
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
            <div className="flex justify-center w-full">
              <Button
                type="outlined"
                color="primary"
                className={'w-11/12 mt-6 mb-6'}
                onClick={removePractitioner}
              >
                {renderIcon(
                  'UsersIcon',
                  'w-5 h-5 color-primary text-primary mr-2'
                )}
                <Typography
                  type="body"
                  className="mr-4"
                  color="primary"
                  text={'Remove practitioner'}
                ></Typography>
              </Button>
            </div>
          </>
        </div>
      )}
    </>
  );
};
