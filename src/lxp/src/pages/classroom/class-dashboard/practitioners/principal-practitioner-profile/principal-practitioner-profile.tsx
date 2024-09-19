import { useHistory, useLocation } from 'react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  MenuListDataItem,
  StackedList,
} from '@ecdlink/ui';
import {
  ClassroomMetricReport,
  NoteTypeEnum,
  PractitionerRemovalHistory,
} from '@ecdlink/graphql';
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
import { format, isPast, isToday, sub } from 'date-fns';
import { PractitionerService } from '@/services/PractitionerService';
import EditRemovePractitionerFromProgrammePrompt from './components/remove-practitioner-from-programme/edit-remove-practitioner-from-programme-prompt';
import { formatDateLong } from '@/utils/common/date.utils';
import { AbsenteeDto } from '@ecdlink/core/lib/models/dto/Users/absentee.dto';
import { AbsenceCard } from './components/absence-card/absence-card';
import { AbsencesView } from './components/absences-view/absences-view';
import { BusinessTabItems } from '@/pages/business/business.types';
import { staticDataSelectors } from '@/store/static-data';
import { ReassignClassPageState } from '../reassign-class/reassign-class.types';
import { EditPractitionerPermissions } from '@/pages/practitioner/practitioner-programme-information/practitioner-list/components/edit-practitioner-permissions';
import { PractitionerNotAccepted } from './practitioner-not-accepted/practitioner-not-accepted';
import { useTenantModules } from '@/hooks/useTenantModules';
import { useTenant } from '@/hooks/useTenant';
import { PermissionsNames } from '@/pages/principal/components/add-practitioner/add-practitioner.types';
import TransparentLayer from '../../../../../assets/TransparentLayer.png';

export const PrincipalPractitionerProfileInfo: React.FC = () => {
  const history = useHistory();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerUserId = location.state.practitionerId;
  const classroom = useSelector(classroomsSelectors?.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerUserId)
  );

  const daysAbsentLastMonth = practitioner?.daysAbsentLastMonth;
  const practitionerUser = useSelector(practitionerSelectors.getPractitioner);

  const practitionerAbsentees = practitioner?.absentees;

  const validAbsentee = practitionerAbsentees?.filter(
    (item) =>
      (!isPast(new Date(item?.absentDateEnd as string)) ||
        isToday(new Date(item?.absentDate as string))) &&
      item?.reason !== 'Practitioner removed from programme'
  );

  const currentDates = validAbsentee?.map((item) => {
    return item?.absentDate as string;
  });

  const orderedDates = currentDates?.sort(function (a, b) {
    return Date.parse(a) - Date.parse(b);
  });

  const currentAbsentee = validAbsentee?.find(
    (item) => item?.absentDate === orderedDates?.[0]
  ) as AbsenteeDto;

  const classesWithAbsence =
    validAbsentee &&
    Object.values(
      validAbsentee?.reduce(
        (acc, obj) => ({ ...acc, [obj.absentDate as string]: obj }),
        {}
      )
    );

  classesWithAbsence?.sort(function (a, b) {
    return a?.absentDate?.localeCompare(b?.absentDate);
  });

  const lastMonth = sub(new Date(), {
    months: 1,
  });
  const [showAbsences, setShowAbsences] = useState(false);

  const practitionerClassroomGroups = classroomGroups?.filter((item) => {
    return item?.userId === practitionerUserId;
  });
  const { theme } = useTheme();

  const [createPractitionerNoteVisible, setCreatePractitionerdNoteVisible] =
    useState<boolean>(false);
  const notes = useSelector(
    notesSelectors.getNotesByUserId(practitionerUserId)
  );

  const onCreatePractitionerNoteBack = () => {
    setCreatePractitionerdNoteVisible(false);
  };
  const [childrenCount, setChildrenCount] = useState(0);
  const [classMetrics, setClassMetrics] = useState<ClassroomMetricReport[]>([]);

  const handleReassignClass = useCallback(
    (practitionerId: string, allAbsenteeClasses?: AbsenteeDto[]) => {
      const isPrincipal = practitioner?.isPrincipal;

      if (isPrincipal) {
        if (allAbsenteeClasses) {
          history.push('practitioner-reassign-class', {
            practitionerId,
            allAbsenteeClasses,
            principalPractitioner: practitionerUser,
            isFromPrincipalPractitionerProfile: true,
          } as ReassignClassPageState);
          return;
        }
        if (allAbsenteeClasses)
          history.push('practitioner-reassign-class', {
            practitionerId,
            allAbsenteeClasses,
            isFromPrincipalPractitionerProfile: true,
          } as ReassignClassPageState);

        return;
      }

      if (allAbsenteeClasses) {
        history.push('practitioner-reassign-class', {
          practitionerId,
          allAbsenteeClasses,
          isFromPrincipalPractitionerProfile: true,
        });
        return;
      }

      history.push('practitioner-reassign-class', {
        practitionerId,
        isFromPrincipalPractitionerProfile: true,
      });
    },
    [history, practitionerUser]
  );

  useEffect(() => {
    if (!!classMetrics && !!classMetrics?.length) {
      const totalChildCount = classMetrics.reduce((total, currentItem) => {
        return total + currentItem.childCount;
      }, 0);

      setChildrenCount(totalChildCount);
    }
  }, [classMetrics, setChildrenCount]);

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
  const [existingRemoval, setExistingRemoval] = useState<
    PractitionerRemovalHistory | undefined
  >();

  const getRemovalForPractitioner = async () => {
    const removalDetails = await new PractitionerService(
      userAuth?.auth_token!
    ).getRemovalForPractitioner(practitioner?.userId!);
    setExistingRemoval(removalDetails);

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
    ).getClassAttendanceMetricsByUser(
      practitionerUserId,
      firstDayPrevMonth,
      lastDayPrevMonth
    );
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
    setExistingRemoval(undefined);
  };

  const notificationItem: MenuListDataItem[] = [
    {
      showIcon: true,
      menuIcon: 'ExclamationIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: `${daysAbsentLastMonth} ${
        daysAbsentLastMonth && Number(daysAbsentLastMonth) > 1 ? 'days' : 'day'
      } absent last month`,
      titleStyle: 'text-textDark semibold whitespace-normal',
      subTitle: format(lastMonth, 'MMMM yyyy'),
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'alertMain',
      backgroundColor: 'alertBg',
      onActionClick: () => setShowAbsences(true),
    },
  ];

  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;

  const { attendanceEnabled, classroomActivitiesEnabled, progressEnabled } =
    useTenantModules();

  const permissions = useSelector(staticDataSelectors.getPermissions);
  const premissionsFilteredByTenantModules = useMemo(
    () =>
      permissions
        ?.filter((item) =>
          !attendanceEnabled && isWhiteLabel
            ? item?.name !== PermissionsNames?.take_attendance
            : item
        )
        ?.filter((item2) =>
          !progressEnabled && isWhiteLabel
            ? item2?.name !== PermissionsNames?.create_progress_reports
            : item2
        )
        ?.filter((item3) =>
          !classroomActivitiesEnabled && isWhiteLabel
            ? item3?.name !== PermissionsNames?.plan_classroom_actitivies
            : item3
        ),
    [
      attendanceEnabled,
      classroomActivitiesEnabled,
      isWhiteLabel,
      permissions,
      progressEnabled,
    ]
  );

  const [allowedPermissions, setAllowedPermissions] = useState<
    string[] | undefined
  >();
  const [notAllowedPermissions, setNotAllowedPermissions] = useState<
    string[] | undefined
  >();

  useEffect(() => {
    const allowed: string[] = [];
    const notAllowed: string[] = [];

    premissionsFilteredByTenantModules
      .filter((x) => x.grouping === 'Practitioner')
      .forEach((permission) => {
        if (
          practitioner?.permissions?.some(
            (userPermission) =>
              userPermission?.permissionId === permission.id &&
              userPermission.isActive
          )
        ) {
          allowed.push(permission.normalizedName.toLowerCase());
        } else {
          notAllowed.push(permission.normalizedName.toLowerCase());
        }
      });
    setAllowedPermissions(allowed);
    setNotAllowedPermissions(notAllowed);
  }, [practitioner?.permissions, premissionsFilteredByTenantModules]);

  const [editPermissionsVisible, setEditPermissionsVisible] =
    useState<boolean>(false);

  // Not registered yet
  if (
    practitioner?.isRegistered === null ||
    practitioner?.isRegistered === false
  ) {
    return <PractitionerNotRegistered practitioner={practitioner} />;
  }

  // If not accepted yet
  if (!!practitioner?.dateLinked && !practitioner.dateAccepted) {
    return <PractitionerNotAccepted practitioner={practitioner} />;
  }

  return (
    <>
      <div className={styles.contentWrapper}>
        <BannerWrapper
          showBackground={true}
          backgroundUrl={TransparentLayer}
          title={`${practitioner?.user?.firstName}'s Profile`}
          color={'primary'}
          size="medium"
          renderBorder={true}
          renderOverflow={false}
          onBack={() =>
            history.push(ROUTES.BUSINESS, {
              activeTabIndex: BusinessTabItems.STAFF,
            })
          }
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
              color={'quatenary'}
              type={'outlined'}
              className={'rounded-2xl'}
              size={'small'}
              onClick={callForHelp}
            >
              <PhoneIcon
                className="text-quatenary h-5 w-5"
                aria-hidden="true"
              />
            </Button>
            <Button
              color={'quatenary'}
              type={'outlined'}
              className={'rounded-2xl'}
              size={'small'}
              onClick={whatsapp}
            >
              <span className="text-quatenary h-5 w-5">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.7179 3.28528C11.3299 1.89661 9.4366 1.19595 7.4486 1.35595C4.77593 1.57061 2.43326 3.42928 1.64926 5.99328C1.08926 7.82528 1.3246 9.73795 2.2366 11.3179L1.3726 14.1866C1.28993 14.4619 1.54126 14.7213 1.81926 14.6473L4.82193 13.8426C5.7946 14.3733 6.88926 14.6526 8.00393 14.6533H8.0066C10.8033 14.6533 13.3873 12.9426 14.2813 10.2926C15.1519 7.70861 14.5079 5.07728 12.7179 3.28528ZM11.2653 10.3693C11.1266 10.7579 10.4473 11.1326 10.1419 11.1599C9.8366 11.1879 9.5506 11.2979 8.14526 10.7439C6.45393 10.0773 5.38593 8.34328 5.30326 8.23261C5.21993 8.12128 4.62393 7.33061 4.62393 6.51194C4.62393 5.69328 5.05393 5.29061 5.2066 5.12461C5.35926 4.95794 5.53926 4.91661 5.6506 4.91661C5.76126 4.91661 5.8726 4.91661 5.96926 4.92061C6.08793 4.92528 6.21926 4.93128 6.34393 5.20794C6.49193 5.53728 6.81526 6.35995 6.8566 6.44328C6.89793 6.52661 6.92593 6.62395 6.8706 6.73461C6.81526 6.84528 6.78726 6.91461 6.7046 7.01195C6.62126 7.10928 6.52993 7.22861 6.45526 7.30328C6.37193 7.38595 6.28526 7.47661 6.38193 7.64261C6.47926 7.80928 6.8126 8.35395 7.30726 8.79461C7.94326 9.36128 8.4786 9.53661 8.64526 9.62061C8.81193 9.70395 8.9086 9.68995 9.00593 9.57861C9.10326 9.46795 9.42193 9.09328 9.5326 8.92661C9.64326 8.75995 9.7546 8.78795 9.90726 8.84328C10.0599 8.89861 10.8779 9.30128 11.0439 9.38461C11.2106 9.46795 11.3213 9.50928 11.3626 9.57861C11.4039 9.64728 11.4039 9.98061 11.2653 10.3693Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </Button>
          </div>
        </BannerWrapper>
        <div className="flex flex-wrap justify-center">
          {existingRemoval && (
            <Card className={styles.removalCard}>
              <div className="mt-2 mr-4 mb-2 flex items-center">
                <div className="mx-4 mt-2 mb-4 flex w-full items-center">
                  <XCircleIcon
                    className="text-errorMain mt-2 h-12 w-12"
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
                    className={'text-errorMain ml-4 mt-2'}
                  />
                </div>
                <Button
                  size="small"
                  shape="normal"
                  color="quatenary"
                  type="filled"
                  onClick={() => setEditRemovalDialogVisable(true)}
                >
                  {renderIcon('PencilIcon', 'w-5 h-5 mr-2')}
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
          {!currentAbsentee &&
            !!daysAbsentLastMonth &&
            Number(daysAbsentLastMonth) > 0 && (
              <div className="my-4 flex w-11/12 justify-center">
                <StackedList
                  isFullHeight={false}
                  className={'flex w-11/12 flex-col gap-2'}
                  listItems={notificationItem}
                  type={'MenuList'}
                />
              </div>
            )}
          {!existingRemoval && (
            <AbsenceCard
              className="mx-4 mt-6 w-full"
              practitioner={practitioner!}
              handleReassignClass={handleReassignClass}
              practitionerUserId={practitionerUserId}
              reassignClassRouteState={{
                isFromPrincipalPractitionerProfile: true,
              }}
            />
          )}
        </div>
        <div className="flex flex-wrap justify-center">
          <Card className={styles.absentCard}>
            <div className={styles.absentCardTitle}>
              <Typography
                type={'h1'}
                color="textDark"
                text={'App Rules'}
                className={styles.absentCardTitle}
              />
              <div className="mt-2 mr-4 flex items-center">
                <div className="mx-4 mt-2 mb-4 w-full flex-col items-center">
                  <p>
                    <Typography
                      type={'span'}
                      color="textDark"
                      className="font-bold"
                      text={'Allowed: '}
                    />
                    <Typography
                      type={'span'}
                      color="textMid"
                      text={
                        !!allowedPermissions?.length
                          ? allowedPermissions.join(', ')
                          : 'none'
                      }
                    />
                  </p>
                  <p>
                    <Typography
                      type={'span'}
                      color="textDark"
                      className="font-bold"
                      text={'Not Allowed: '}
                    />
                    <Typography
                      type={'span'}
                      color="textMid"
                      text={
                        !!notAllowedPermissions?.length
                          ? notAllowedPermissions.join(', ')
                          : 'none'
                      }
                    />
                  </p>
                </div>
                <Button
                  size="small"
                  type="filled"
                  color="quatenary"
                  onClick={() => setEditPermissionsVisible(true)}
                >
                  <Typography
                    type="body"
                    className="mr-1"
                    color="white"
                    text={'Edit'}
                  />
                  {renderIcon('PencilIcon', 'w-5 h-5 color-white text-white')}
                </Button>
              </div>
            </div>
          </Card>
          <Dialog
            stretch={true}
            visible={editPermissionsVisible}
            position={DialogPosition.Full}
          >
            <EditPractitionerPermissions
              setEditPractitionerModal={() => {}}
              setEditPractitionerPermissions={setEditPermissionsVisible}
              practitioner={practitioner}
            />
          </Dialog>
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
            {!!practitioner?.user?.phoneNumber && (
              <Button
                size="small"
                shape="normal"
                color="secondaryAccent2"
                type="filled"
                onClick={() =>
                  window.open(`tel:${practitioner?.user?.phoneNumber}`)
                }
              >
                <Typography
                  className={'mr-1'}
                  type="buttonSmall"
                  color="secondary"
                  text="Call"
                />
                {renderIcon('PhoneIcon', 'h-4 w-4 text-secondary')}
              </Button>
            )}
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
            {!!practitioner?.user?.email && (
              <Button
                size="small"
                shape="normal"
                color="secondaryAccent2"
                type="filled"
                onClick={() =>
                  window.open(`mailto:${practitioner?.user?.email}`)
                }
              >
                <Typography
                  className={'mr-1'}
                  type="buttonSmall"
                  color="secondary"
                  text="Email"
                />
                {renderIcon('MailIcon', 'h-4 w-4 text-secondary')}
              </Button>
            )}
          </div>
          <Divider dividerType="dashed" className="my-4" />
          <div className={styles.infoWrapper}>
            <div>
              <Typography
                text={'Your notes'}
                type="h4"
                color="textDark"
                className={'mt-1'}
              />
              {notes?.length > 0 ? (
                <Typography
                  text={getLastNoteDate(notes)}
                  type="h5"
                  color="textMid"
                  className={'mt-1'}
                />
              ) : (
                <Typography
                  text={'Add a note'}
                  type="h5"
                  color="textMid"
                  className={'mt-1'}
                />
              )}
            </div>
            <div>
              <Button
                size="small"
                shape="normal"
                color="quatenary"
                type="filled"
                onClick={() =>
                  history.push(ROUTES.PRINCIPAL.NOTES, {
                    practitionerId: practitionerUserId,
                  })
                }
              >
                <Typography
                  type="help"
                  color="white"
                  text="View"
                  className="ml-1"
                />
                {renderIcon('PlusIcon', styles.buttonIcon)}
              </Button>
            </div>
            <Dialog
              fullScreen
              visible={createPractitionerNoteVisible}
              position={DialogPosition.Middle}
            >
              <div className={styles.dialogContent}>
                <CreateNote
                  userId={practitionerUserId || ''}
                  noteType={NoteTypeEnum.Unknown}
                  titleText={`Add a note to ${practitioner?.user?.firstName} profile`}
                  onBack={() => onCreatePractitionerNoteBack()}
                  onCreated={() => onCreatePractitionerNoteBack()}
                />
              </div>
            </Dialog>
          </div>
          {!existingRemoval && (
            <div className="flex w-full justify-center">
              <Button
                type="filled"
                color="quatenary"
                className={'mt-6 mb-6 w-11/12'}
                onClick={() =>
                  history.push(
                    ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME,
                    {
                      practitionerId: practitionerUserId,
                    }
                  )
                }
              >
                {renderIcon('TrashIcon', 'w-5 h-5 color-white text-white mr-2')}
                <Typography
                  type="body"
                  className="mr-4"
                  color="white"
                  text={'Remove practitioner'}
                />
              </Button>
            </div>
          )}
        </>
      </div>
      <Dialog
        stretch={true}
        visible={showAbsences}
        position={DialogPosition.Full}
      >
        <AbsencesView
          practitioner={practitioner!}
          setShowAbsences={setShowAbsences}
          lastMonth={lastMonth}
          absences={practitionerAbsentees}
        />
      </Dialog>
      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={editRemovalDialogVisable}
        position={DialogPosition.Middle}
      >
        <EditRemovePractitionerFromProgrammePrompt
          practitioner={practitioner}
          classroomName={classroom?.name || ''}
          removalDetails={existingRemoval as PractitionerRemovalHistory}
          onEdit={() => {
            history.push(ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME, {
              practitionerId: practitionerUserId,
            });
          }}
          onCancel={() => {
            cancelPractitionerRemoval();
            setEditRemovalDialogVisable(false);
            history.push(ROUTES.BUSINESS, {
              activeTabIndex: BusinessTabItems.STAFF,
            });
          }}
          onClose={() => {
            setEditRemovalDialogVisable(false);
          }}
        />
      </Dialog>
    </>
  );
};
