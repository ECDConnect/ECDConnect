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
  Alert,
} from '@ecdlink/ui';
import { NoteTypeEnum, PractitionerRemovalHistory } from '@ecdlink/graphql';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { PractitionerProfileRouteState } from './principal-practitioner-profile.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './principal-practitioner-profile.styles';
import ROUTES from '@routes/routes';
import { PhoneIcon, XCircleIcon } from '@heroicons/react/solid';
import { CreateNote } from './components/create-note/create-note';
import { getLastNoteDate } from '@utils/child/child-profile-utils';
import { notesSelectors } from '@store/notes';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { classroomsSelectors } from '@/store/classroom';
import { authSelectors } from '@/store/auth';
import { PractitionerNotRegistered } from './practitioner-not-registered/practitioner-not-registered';
import { ClassroomGroupService } from '@/services/ClassroomGroupService';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import { getMonth } from 'date-fns';
import { PractitionerService } from '@/services/PractitionerService';
import EditRemovePractitionerFromProgrammePrompt from './components/remove-practitioner-from-programme/edit-remove-practitioner-from-programme-prompt';
import { formatDateLong } from '@/utils/common/date.utils';

export const PrincipalPractitionerProfileInfo: React.FC = () => {
  const history = useHistory();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );

  const practitionerClassroomGroups = classroomGroups?.filter((item: any) => {
    return item?.userId === practitionerId;
  });
  const { theme } = useTheme();

  const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
    useState<boolean>(false);
  const notes = useSelector(notesSelectors.getNotesByUserId(practitionerId));

  const onCreatePractitionerNoteBack = () => {
    setCreatePractitionerdNoteVisible(false);
  };
  const [childrenCount, setChildrenCount] = useState(0);
  const [classMetrics, setClassMetrics] = useState<any>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const practitionerClassrooms: any[] = [];
  const [practitionerClassrooms, setPractitionerClassrooms] = useState<any[]>();

  const handleReassignClass = (practitionerId: string) => {
    history.push('practitioner-reassign-class', {
      practitionerId,
    });
  };

  // if (classMetrics) {
  //   classMetrics.forEach((e: any) => {
  //     let classroomValue: any = practitionerClassroomGroups.find(
  //       (item: any) => item?.userId === e?.practitionerId
  //     );

  //     if (classroomValue) {
  //       practitionerClassrooms.push({
  //         ...e,
  //         childCount: classroomValue?.childCount,
  //         attendancePercentage: classroomValue?.attendancePercentage,
  //         month: classroomValue?.month,
  //         year: classroomValue?.year,
  //       });
  //     } else {
  //       practitionerClassrooms.push({ ...e });
  //     }
  //   });
  // }

  useEffect(() => {
    if (classMetrics) {
      const practitionerClassroomData = classMetrics?.filter((item: any) => {
        return practitionerClassroomGroups.some((x) => {
          return item?.practitionerId === x?.userId;
        });
      });
      setPractitionerClassrooms(practitionerClassroomData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classMetrics]);

  useEffect(() => {
    let count = 0;
    if (practitionerClassrooms?.length && practitionerClassrooms?.length > 0) {
      // eslint-disable-next-line array-callback-return
      practitionerClassrooms?.map((item: any) => {
        count += item?.childCount;
      });
      return setChildrenCount(count);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitionerClassrooms]);

  const callForHelp = () => {
    window.open(`tel:${practitioner?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(
        practitioner?.user?.phoneNumber ?? ''
      )}`
    );
  };

  const [editRemovalDialogVisable, setEditRemovalDialogVisable] =
    useState<boolean>(false);
  const [existingRemoval, setExisitingRemoval] = useState<
    PractitionerRemovalHistory | undefined
  >();

  const getRemovalForPractitioner = async () => {
    const removalDetails = await new PractitionerService(
      userAuth?.auth_token!
    ).getRemovalForPractitioner(practitioner?.userId!);
    setExisitingRemoval(removalDetails);

    return removalDetails;
  };

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
    ).getClassAttendanceMetrics(firstDayPrevMonth, lastDayPrevMonth);
    setClassMetrics(metricsData);
    return metricsData;
  };

  useEffect(() => {
    classroomsMetrics();
    getRemovalForPractitioner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelPractitionerRemoval = async () => {
    await new PractitionerService(
      userAuth?.auth_token || ''
    ).cancelRemovePractitionerFromProgramme(existingRemoval?.id);
    setExisitingRemoval(undefined);
  };

  return (
    <>
      {practitioner?.isRegistered === null ||
      practitioner?.isRegistered === false ? (
        <PractitionerNotRegistered
          practitioner={practitioner}
          classroom={classroom}
        />
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
              {practitionerClassroomGroups?.length > 0 ? (
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
              {!!childrenCount && (
                <StatusChip
                  backgroundColour="secondary"
                  borderColour="secondary"
                  text={`${childrenCount} children`}
                  textColour={'white'}
                  className={'mr-2 px-3 py-1.5'}
                />
              )}
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
                  className="text-primary h-5 w-5"
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
            {existingRemoval && (
              <Card className={styles.removalCard}>
                <div className="mt-2 mr-4 flex items-center">
                  <div className="mx-4 mt-2 mb-4 flex w-full items-center">
                    <XCircleIcon
                      className="text-errorMain h-5 w-5"
                      aria-hidden="true"
                    />
                    <Typography
                      type={'body'}
                      color="errorMain"
                      text={`${
                        practitioner?.user?.firstName
                      } will be removed on ${
                        existingRemoval?.dateOfRemoval
                          ? formatDateLong(
                              new Date(existingRemoval?.dateOfRemoval)
                            )
                          : ''
                      }`}
                      className={styles.absentCardSubTitle}
                    />
                  </div>
                  <Button
                    size="small"
                    shape="normal"
                    color="primary"
                    type="filled"
                    onClick={() => setEditRemovalDialogVisable(true)}
                  >
                    {renderIcon(
                      'PencilIcon',
                      'w-5 h-5 color-primary text-primary mr-2'
                    )}
                    <Typography
                      type="body"
                      className="mr-4"
                      color="white"
                      text={'Edit'}
                    ></Typography>
                  </Button>
                </div>
              </Card>
            )}
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
                    className={'mt-6 mb-6 w-11/12'}
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
            {practitionerClassrooms && practitionerClassrooms?.length > 0
              ? practitionerClassrooms?.map((item: any, index: number) => {
                  const classroomItem: any = practitionerClassroomGroups?.find(
                    (x) => {
                      return x?.id === item?.classroomGroupId;
                    }
                  );
                  return (
                    <Card className={styles.absentCard} key={index}>
                      <Typography
                        type={'h1'}
                        text={classroomItem?.name}
                        color={'textMid'}
                        className={styles.absentCardTitle}
                      />
                      <div>
                        <div className="mt-2 mr-2 flex flex-col">
                          <div className="ml-4 flex w-11/12 items-center justify-between">
                            <div className="flex w-full items-center">
                              <Typography
                                type={'h2'}
                                text={`${item?.childCount}`}
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
                                    classroomItem,
                                  }
                                )
                              }
                              className="mt-2 rounded-xl"
                            >
                              <Typography
                                type="help"
                                color="white"
                                text="View"
                              />
                              {renderIcon('EyeIcon', styles.buttonIcon)}
                            </Button>
                          </div>
                          <div className="mx-4 mt-2 mb-4 flex w-9/12 items-center justify-start">
                            <StatusChip
                              backgroundColour="alertMain"
                              borderColour="alertMain"
                              text={`${item?.attendancePercentage}%`}
                              textColour={'white'}
                              className={'mr-2'}
                            />
                            <Typography
                              type={'body'}
                              weight={'bold'}
                              text={`attendance in ${getMonthName(
                                getMonth(new Date()) - 1
                                // eslint-disable-next-line no-useless-concat
                              )}\u00A0${item?.year}`}
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
              <div className="mt-2 mr-4 flex items-center">
                <div className="mx-4 mt-2 mb-4 flex w-full items-center">
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
                <div className="mt-2 mr-4 flex flex-col">
                  <div className="ml-4 flex w-11/12 items-center">
                    <Typography
                      type={'h2'}
                      text={'N/A'}
                      color={'textDark'}
                      className="mt-2"
                    />
                    <Typography
                      type={'body'}
                      text={`programmes planned in  ${getMonthName(
                        getMonth(new Date()) - 1
                        // eslint-disable-next-line no-useless-concat
                      )} 2022`}
                      color={'textDark'}
                      className="mt-2 ml-4 mr-8"
                    />
                    <Button
                      size="small"
                      shape="normal"
                      color="primary"
                      type="filled"
                      onClick={() => {}}
                      className="mt-2 rounded-xl"
                      disabled={true}
                    >
                      <Typography type="help" color="white" text="View" />
                      {renderIcon('EyeIcon', styles.buttonIcon)}
                    </Button>
                  </div>
                  <div className="mx-4 mt-2 mb-4 flex w-9/12 items-center justify-start">
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
                    //TODO: what if copy fails?
                    navigator?.clipboard?.writeText &&
                      navigator?.clipboard?.writeText(
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
                    //TODO: what if copy fails?
                    navigator?.clipboard?.writeText &&
                      navigator?.clipboard?.writeText(
                        practitioner?.user?.email!
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
                {notes?.length > 0 ? (
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
            {!existingRemoval && (
              <div className="flex w-full justify-center">
                <Button
                  type="outlined"
                  color="primary"
                  className={'mt-6 mb-6 w-11/12'}
                  onClick={() =>
                    history.push(
                      ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME,
                      {
                        practitionerId,
                      }
                    )
                  }
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
            )}
          </>
        </div>
      )}
      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={editRemovalDialogVisable}
        position={DialogPosition.Bottom}
      >
        <EditRemovePractitionerFromProgrammePrompt
          practitioner={practitioner}
          classroomName={classroom?.name || ''}
          removalDetails={existingRemoval as PractitionerRemovalHistory}
          onEdit={() => {
            history.push(ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME, {
              practitionerId,
            });
          }}
          onCancel={() => {
            cancelPractitionerRemoval();
            setEditRemovalDialogVisable(false);
          }}
          onClose={() => {
            setEditRemovalDialogVisable(false);
          }}
        />
      </Dialog>
    </>
  );
};
