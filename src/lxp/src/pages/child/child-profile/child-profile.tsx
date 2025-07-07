import {
  AttendanceDto,
  ChildAttendanceReportModel,
  useDialog,
  Document,
  ContentConsentTypeEnum,
  RoleSystemNameEnum,
} from '@ecdlink/core';
import {
  FileTypeEnum,
  NoteTypeEnum,
  WorkflowStatusEnum,
} from '@ecdlink/graphql';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  IMAGE_WIDTH,
  ListItem,
  ListItemProps,
  ProfileAvatar,
  StatusChip,
} from '@ecdlink/ui';
import { getWeek, startOfISOWeekYear } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import OnlineOnlyModal from '../../../modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStaticData } from '@hooks/useStaticData';
import { Age } from '@models/common/Age';
import { AttendanceService } from '@services/AttendanceService';
import { attendanceSelectors } from '@store/attendance';
import { authSelectors } from '@store/auth';
import { CaregiverContactReason } from '@store/caregiver/caregiver.types';
import {
  childrenActions,
  childrenSelectors,
  childrenThunkActions,
} from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import { documentActions, documentSelectors } from '@store/document';
import { notesSelectors } from '@store/notes';
import {
  getAge,
  getChildAttendancePercentageAtPlaygroup,
  getLastNoteDate,
} from '@utils/child/child-profile-utils';
import {
  getColor,
  getShape,
} from '@utils/classroom/attendance/track-attendance-utils';
import { CreateNote } from '../components/create-note/create-note';
import { ChildPending } from './child-pending/child-pending';
import * as styles from './child-profile.styles';
import { ChildProfileRouteState } from './child-profile.types';
import { useAppDispatch } from '@store';
import { newGuid } from '@utils/common/uuid.utils';
import { userSelectors } from '@store/user';
import { PhotoPrompt } from '../../../components/photo-prompt/photo-prompt';
import { ChildProgressReportAlert } from './components/progress-report-alert/progress-report-alert';
import ROUTES from '@routes/routes';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { practitionerSelectors } from '@/store/practitioner';
import ChildWrapper from './components/child-wrapper/ChildWrapper';
import { useAppContext } from '@/walkthrougContext';
import { useTenant } from '@/hooks/useTenant';
import {
  TabsItemForPrincipal,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { ChildAttendanceReportState } from '../child-attendance-report/child-attendance-report.types';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ChildrenActions } from '@/store/children/children.actions';
import { ReactComponent as RobotIcon } from '@/assets/iconRobot.svg';
import { ChildListRouteState } from '@/pages/classroom/child-list/child-list.types';
import { useTenantModules } from '@/hooks/useTenantModules';
import { ProgressWalkthroughStart } from '@/pages/classroom/progress/walkthrough/progress-walkthrough-start';
import TransparentLayer from '../../../assets/TransparentLayer.png';

const baseNotificationListItem: ListItemProps = {
  key: 'message-caregiver',
  showIcon: true,
  showSubTitleShape: true,
  showChevronIcon: true,
  backgroundColor: 'uiBg',
  withPaddingX: true,
  withPaddingY: true,
  title: 'Message caregiver',
  subTitleColor: 'errorMain',
  subTitleShape: 'square',
  iconName: 'ChatAlt2Icon',
  iconColor: 'white',
  iconBackgroundColor: 'primary',
};

export const ChildProfile: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const location = useLocation<ChildProfileRouteState>();
  const childId = location.state.childId;
  const isFromInfoPage = location?.state?.isFromInfoPage;
  const practitionerIsOnLeave = location.state?.practitionerIsOnLeave;
  const { getDocumentTypeIdByEnum, getWorkflowStatusIdByEnum } =
    useStaticData();
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const child = useSelector(childrenSelectors.getChildById(childId));
  const tenant = useTenant();
  const isWhiteLabel = tenant?.isWhiteLabel;
  const { attendanceEnabled, progressEnabled } = useTenantModules();

  const practitioners = useSelector(
    practitionerSelectors.getPractitioners
  )?.filter((x) => {
    return x.user?.id !== practitioner?.user?.id;
  });

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(
      child?.userId || child?.user?.id!
    )
  );
  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );

  const isTrialPeriod = useIsTrialPeriod();

  const {
    hasPermissionToManageChildren,
    hasPermissionToCreateProgressReports,
  } = useUserPermissions();

  const hasPermissionToEdit =
    hasPermissionToManageChildren || practitioner?.isPrincipal || isTrialPeriod;

  const classProgrammes = classroomGroup?.classProgrammes?.filter(
    (x) => x?.isActive
  );

  const notes = useSelector(
    notesSelectors.getNotesByUserId(child?.userId || child?.user?.id)
  );
  const attendanceData = useSelector(attendanceSelectors.getAttendance);
  const authUser = useSelector(authSelectors.getAuthUser);

  const childPhotoConsent = useSelector(
    userSelectors.getUserConsentByType(
      child?.userId,
      ContentConsentTypeEnum.PhotoPermissions
    )
  );

  const isReportWindowSet = useSelector(
    classroomsSelectors.getIsReportingPeriodsSet()
  );

  const typeId = getDocumentTypeIdByEnum(FileTypeEnum.ProfileImage);
  const profilePicture = useSelector(
    documentSelectors.getDocumentByTypeId(child?.user?.id, typeId)
  );

  const currentDate = useMemo(() => new Date(), []);

  const caregiverHasBeenContacted = useSelector(
    childrenSelectors.findCaregiverContactHistoryLog(
      child?.caregiverId,
      child?.id,
      CaregiverContactReason.WeeklyAttendance,
      getWeek(currentDate)
    )
  );

  const [createChildNoteVisible, setCreateChildNoteVisible] =
    useState<boolean>(false);
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);

  const [childAge, setChildAge] = useState<Age>();
  const childPendingWorkflowStatusId = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.ChildPending
  );
  const childExternalWorkflowStatusId = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.ChildExternalLink
  );
  const [notifications, setNotifications] = useState<ListItemProps[]>([]);
  const [attendanceReport, setAttendanceReport] =
    useState<ChildAttendanceReportModel>();

  const [isLoadingAttendance, setIsLoadingAttendance] = useState<boolean>(true);
  const { isLoading } = useThunkFetchCall(
    'children',
    ChildrenActions.UPDATE_CHILD
  );

  const childBirthDate = useMemo(
    () =>
      child?.user?.dateOfBirth
        ? new Date(child?.user?.dateOfBirth)
        : currentDate,
    [child?.user?.dateOfBirth, currentDate]
  );

  const ageOfChild = getAge(childBirthDate);

  useEffect(() => {
    if (ageOfChild) {
      setChildAge(ageOfChild);
    }
  }, []);

  const avatar = profilePicture?.file || child?.user?.profileImageUrl || '';

  const {
    state: { run },
  } = useAppContext();

  const showOnlineOnly = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <OnlineOnlyModal
            overrideText={'You need to go online to use this feature.'}
            onSubmit={onSubmit}
          ></OnlineOnlyModal>
        );
      },
    });
  }, [dialog]);

  // TODO - This useEffect needs to be fixed, causing infinite re-renders!!!
  useEffect(() => {
    if (!attendanceData || !child) return;

    const fetchAttendance = async () => {
      setIsLoadingAttendance(true);

      try {
        const data = await new AttendanceService(
          authUser?.auth_token ?? ''
        ).getChildAttendanceRecords(
          child?.userId ?? child?.user?.id ?? '',
          classroomGroup?.id ?? '',
          startOfISOWeekYear(new Date()),
          currentDate
        );
        setAttendanceReport(data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setIsLoadingAttendance(false);
      }
    };

    fetchAttendance();
  }, [attendanceData, child, classroomGroup?.id]);

  useEffect(() => {
    if (!attendanceData || !child) return;

    if (classroomGroup) {
      const applicableNotifications: ListItemProps[] = [];

      const attendanceNotification = getAttendanceNotification(
        child.userId || '',
        attendanceData,
        classroomGroup.id || ''
      );

      if (attendanceNotification) {
        applicableNotifications.push(attendanceNotification);
      }

      setNotifications([...applicableNotifications]);
    }
  }, [attendanceData, child, classroomGroup?.id]);

  const getNoteProfileOption = useCallback(() => {
    let baseNotesOptions: ListItemProps = {
      key: 'notes',
      title: 'Your notes',
      showButton: true,
      showDivider: true,
      dividerType: 'dashed',
      withPaddingY: true,
    };

    if (notes.length === 0) {
      baseNotesOptions = {
        ...baseNotesOptions,
        subTitle: 'Add a note',
        buttonType: 'filled',
        buttonIcon: 'PlusIcon',
        buttonText: 'Add',
        buttonTextColor: 'secondary',
        buttonColor: 'secondaryAccent2',
        withBorderRadius: false,
        onButtonClick: () => setCreateChildNoteVisible(true),
      };
    } else {
      baseNotesOptions = {
        ...baseNotesOptions,
        subTitle: getLastNoteDate(notes),
        buttonType: 'filled',
        buttonIcon: 'EyeIcon',
        buttonText: 'View',
        buttonTextColor: 'secondary',
        buttonColor: 'secondaryAccent2',
        showButton: true,
        showDivider: true,
        dividerType: 'dashed',
        withPaddingY: true,
        withBorderRadius: false,
        onButtonClick: () => history.push(ROUTES.CHILD_NOTES, { childId }),
      };
    }

    return baseNotesOptions;
  }, [childId, history, notes]);

  const getAttendanceNotification = (
    childUserId: string,
    attendance: AttendanceDto[],
    classroomGroupCacheId: string
  ): ListItemProps | undefined => {
    const childAttendancePercentage = getChildAttendancePercentageAtPlaygroup(
      childUserId,
      attendance,
      classroomGroupCacheId,
      classProgrammes || []
    );

    // Check when the child was register and determine wether attendance should have been recorded

    if (
      childAttendancePercentage.percentage < 50 &&
      childAttendancePercentage?.percentage !== 0 &&
      !caregiverHasBeenContacted
    )
      return {
        ...baseNotificationListItem,
        subTitle: `Attended ${childAttendancePercentage.daysAttended} days last week`,
        onButtonClick: () =>
          contactAttendanceCaregiver(
            childAttendancePercentage.daysAttended,
            childAttendancePercentage.daysExpected
          ),
      };
  };

  const onCreateChildNoteBack = () => {
    setCreateChildNoteVisible(false);
  };

  const onNoteCreated = () => {
    setCreateChildNoteVisible(false);
  };

  const goToRemoveChild = () => {
    history.push(ROUTES.REMOVE_CHILD, { childId: child?.id });
  };

  const contactAttendanceCaregiver = (
    actualDaysAttended: number,
    expectedDaysAttended: number
  ) => {
    history.push(ROUTES.CHILD_ATTENDANCE_CAREGIVER, {
      actualDaysAttended,
      expectedDaysAttended,
      childId: child?.id,
    });
  };

  const deleteProfileImage = async () => {
    const updatedChild = {
      ...child,
      user: { ...child?.user, profileImageUrl: '' },
    };

    appDispatch(childrenActions.updateChild(updatedChild));
    await appDispatch(
      childrenThunkActions.updateChild({
        id: updatedChild.id as string,
        child: updatedChild,
      })
    );

    if (profilePicture) {
      appDispatch(documentActions.deleteDocument(profilePicture));
    }

    setEditProfilePictureVisible(false);
  };

  const picturePromptOnAction = async (imageBaseString: string) => {
    const updatedChild = {
      ...child,
      user: { ...child?.user, profileImageUrl: imageBaseString },
    };

    appDispatch(childrenActions.updateChild(updatedChild));
    await appDispatch(
      childrenThunkActions.updateChild({
        id: updatedChild.id as string,
        child: updatedChild,
      })
    );

    if (profilePicture) {
      appDispatch(
        documentActions.updateDocument({
          ...profilePicture,
          file: imageBaseString,
          fileType: FileTypeEnum.ProfileImage,
        })
      );
    } else {
      const fileName = `ProfilePicture_${child?.user?.id}.png`;

      const statusId = getWorkflowStatusIdByEnum(
        WorkflowStatusEnum.DocumentVerified
      );

      const documentInputModel: Document = {
        id: newGuid(),
        userId: child?.user?.id,
        createdUserId: user?.id ?? '',
        workflowStatusId: statusId ?? '',
        documentTypeId: typeId ?? '',
        name: fileName,
        reference: undefined,
        fileName: fileName,
        file: imageBaseString,
        fileType: FileTypeEnum.ProfileImage,
      };
      appDispatch(documentActions.createDocument(documentInputModel));
    }
    setEditProfilePictureVisible(false);
  };

  const contactCaregivers = () => {
    history.push(ROUTES.CHILD_CAREGIVERS, { childId: child?.id });
  };

  const showNoReportingPeriodsDialog = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          customIcon={<RobotIcon />}
          importantText={
            !!isPrincipal
              ? 'Choose child progress reporting periods'
              : `Your principal has not chosen reporting periods for ${new Date().getFullYear()} yet.`
          }
          detailText={
            !!isPrincipal
              ? 'To start creating child progress reports, choose the start and end dates for each reporting period.'
              : `To start creating child progress, ask your principal to choose reporting dates on ${tenant.tenant?.applicationName}. `
          }
          actionButtons={
            !!isPrincipal
              ? [
                  {
                    colour: 'quatenary',
                    text: 'Choose reporting dates',
                    onClick: () => {
                      onSubmit();
                      history.push(ROUTES.PROGRESS_SETUP_REPORTING_PERIODS);
                    },
                    textColour: 'white',
                    type: 'filled',
                    leadingIcon: 'PresentationChartBarIcon',
                  },
                  {
                    colour: 'quatenary',
                    text: 'Do this later',
                    onClick: () => {
                      onCancel();
                    },
                    textColour: 'quatenary',
                    type: 'outlined',
                    leadingIcon: 'ClockIcon',
                  },
                ]
              : [
                  {
                    colour: 'quatenary',
                    text: 'Close',
                    onClick: () => {
                      onCancel();
                    },
                    textColour: 'quatenary',
                    type: 'outlined',
                    leadingIcon: 'XIcon',
                  },
                ]
          }
        />
      ),
    });
  };

  const [showProgressWalkthroughStart, setShowProgressWalkthroughStart] =
    useState<boolean>(false);

  useEffect(() => {
    if (isFromInfoPage) {
      setShowProgressWalkthroughStart(true);
    }
  }, [isFromInfoPage]);

  const isComingSoon = false;

  const options = useMemo((): ListItemProps[] => {
    const attendancePercentage = attendanceReport?.attendancePercentage;

    return [
      {
        key: 'attendance-record',
        title: 'Attendance Record',
        subTitle: !!attendancePercentage
          ? `${attendancePercentage.toFixed()}% present this year`
          : '',
        subTitleColor: !!attendancePercentage
          ? getColor(attendancePercentage)
          : undefined,
        subTitleShape: !!attendancePercentage
          ? getShape(attendancePercentage)
          : undefined,
        buttonType: 'filled',
        buttonIcon: 'EyeIcon',
        buttonText: 'View',
        buttonTextColor: 'secondary',
        buttonColor: 'secondaryAccent2',
        showButton: true,
        showSubTitleShape: true,
        withPaddingY: true,
        showDivider: true,
        withBorderRadius: false,
        dividerType: 'dashed',
        onButtonClick: () => {
          if (isOnline) {
            history.push(ROUTES.CHILD_ATTENDANCE_REPORT, {
              childId: child?.id,
              classroomGroupId: classroomGroup?.id,
            } as ChildAttendanceReportState);
          } else {
            showOnlineOnly();
          }
        },
      },
      {
        key: 'progress',
        title: `Progress reports${isComingSoon ? ' - Coming soon' : ''}`,
        buttonType: 'filled',
        buttonIcon: 'EyeIcon',
        buttonText: 'View',
        buttonTextColor: 'secondary',
        buttonColor: 'secondaryAccent2',
        showButton: isComingSoon ? false : true,
        showDivider: true,
        withBorderRadius: false,
        dividerType: 'dashed',
        withPaddingY: true,
        onButtonClick: () => {
          if (!practitioner?.progressWalkthroughComplete) {
            // Show dialog to initialise walkthrough
            setShowProgressWalkthroughStart(true);
          } else if (!isReportWindowSet) {
            showNoReportingPeriodsDialog();
          } else {
            history.push(ROUTES.PROGRESS_REPORT_LIST, {
              childId: child?.id,
            });
          }
        },
      },
      {
        key: 'personal-information',
        title: 'Personal Information',
        subTitle: 'Child & caregiver information',
        buttonType: 'filled',
        buttonIcon: 'EyeIcon',
        buttonText: 'View',
        buttonTextColor: 'secondary',
        buttonColor: 'secondaryAccent2',
        showButton: true,
        showDivider: true,
        withBorderRadius: false,
        dividerType: 'dashed',
        withPaddingY: true,
        onButtonClick: () => {
          history.push(ROUTES.CHILD.INFORMATION.EDIT, {
            childId,
            practitionerIsOnLeave,
          });
        },
      },
      {
        key: 'class',
        title: 'Class',
        subTitle: `${classroomGroup?.name}`,
        buttonType: 'filled',
        buttonIcon: 'PencilIcon',
        buttonText: 'Edit',
        buttonTextColor: 'white',
        buttonColor: 'quatenary',
        showButton: !practitionerIsOnLeave && isPrincipal,
        showDivider: true,
        withBorderRadius: false,
        dividerType: 'dashed',
        withPaddingY: true,
        onButtonClick: () => {
          history.push(ROUTES.CHILD.INFORMATION.EDIT, {
            childId,
            isFromEditClass: true,
            playgroupEdit: true,
          });
        },
      },
      getNoteProfileOption(),
    ];
  }, [
    attendanceReport,
    child,
    childId,
    classroomGroup?.id,
    classroomGroup?.name,
    getNoteProfileOption,
    history,
    isOnline,
    isPrincipal,
    practitionerIsOnLeave,
    showOnlineOnly,
  ]);

  if (
    child &&
    (child?.workflowStatusId === childPendingWorkflowStatusId ||
      child?.workflowStatusId === childExternalWorkflowStatusId)
  ) {
    return <ChildPending child={child} childUser={child?.user} />;
  }

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={TransparentLayer}
        title={`${child?.user?.firstName} ${child?.user?.surname}’s Profile`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => {
          if (location.state?.classroomGroupIdFromRedirect) {
            return history.push(ROUTES.CLASSROOM.CHILDREN, {
              classroomGroupId: location.state?.classroomGroupIdFromRedirect,
            } as ChildListRouteState);
          }
          if (isPrincipal && practitioners?.length! > 1) {
            history.push(ROUTES.CLASSROOM.ROOT, {
              activeTabIndex: TabsItemForPrincipal.CLASSES,
            });
          } else {
            if (isCoach) {
              history.goBack();
            } else {
              history.push(ROUTES.CLASSROOM.ROOT, {
                activeTabIndex: TabsItems.CLASSES,
              });
            }
          }
        }}
        displayOffline={!isOnline}
        // onHelp={() => goToChildProfileWalkthrough()}
        displayHelp={true}
        isLoading={isOnline && !!isLoadingAttendance}
      >
        <div className={styles.avatarWrapper}>
          <ProfileAvatar
            hasConsent={!!childPhotoConsent}
            canChangeImage={!!childPhotoConsent}
            dataUrl={avatar}
            size={'header'}
            onPressed={() => setEditProfilePictureVisible(true)}
          />
        </div>
        <div className={styles.chipsWrapper}>
          <StatusChip
            backgroundColour="primary"
            borderColour="primary"
            text={classroomGroup?.name || NoPlaygroupClassroomType.title}
            textColour={'white'}
            className={'mr-2'}
          />
          <StatusChip
            backgroundColour="secondary"
            borderColour="secondary"
            text={`${childAge?.years || '0'} years ${
              childAge?.months || '0'
            } months`}
            textColour={'white'}
            className={'mr-2'}
          />
        </div>
        {!!notifications?.length && child && (
          <div className={styles.notificationsStackList}>
            {notifications.map((notification) => (
              <ListItem
                {...notification}
                key={`child-profile-notification-${notification.key}`}
              />
            ))}
          </div>
        )}
        {(practitioner?.isPrincipal || hasPermissionToCreateProgressReports) &&
          childAge &&
          childAge?.years < 5 && (
            <div
              id={`child_progress_observations`}
              aria-disabled={run}
              className='"-mt-0.5 rounded-2xl" flex w-full flex-col gap-1'
            >
              <ChildProgressReportAlert child={child!} />
            </div>
          )}
        <div className={styles.profileOptionsWrapper}>
          {options
            ?.filter((item) =>
              !attendanceEnabled && isWhiteLabel
                ? item?.key !== 'attendance-record'
                : item
            )
            ?.filter((item2) =>
              !progressEnabled && isWhiteLabel
                ? item2?.key !== 'progress'
                : item2
            )
            .map((options, index) => (
              <div
                key={`option-${index}`}
                id={`child_walkthrough_step_${index}`}
              >
                <ListItem
                  {...options}
                  key={`child-profile-option-${options.key}`}
                />
              </div>
            ))}

          <Divider dividerType="dashed" className="-mt-1.5" />
          <ChildWrapper />
          <Button
            icon="ChatAlt2Icon"
            text="Contact caregiver"
            className={styles.button.replace('mt-4', 'mt-3')}
            color="quatenary"
            textColor="white"
            type="filled"
            onClick={contactCaregivers}
          />
          {!practitionerIsOnLeave && hasPermissionToEdit && (
            <Button
              id="child_remove"
              icon="TrashIcon"
              className={styles.button}
              color="quatenary"
              textColor="quatenary"
              type="outlined"
              onClick={goToRemoveChild}
              text={`Remove ${child?.user?.firstName}`}
            />
          )}
        </div>
      </BannerWrapper>
      <Dialog
        fullScreen
        visible={createChildNoteVisible}
        position={DialogPosition.Middle}
      >
        <div className={styles.dialogContent}>
          <CreateNote
            userId={child?.userId || ''}
            noteType={NoteTypeEnum.Child}
            titleText={`Add a note to ${child?.user?.firstName} profile`}
            onBack={() => onCreateChildNoteBack()}
            onCreated={() => onNoteCreated()}
          />
        </div>
      </Dialog>
      <Dialog
        visible={editProfilePictureVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'p-4'}>
          <PhotoPrompt
            resolutionLimit={IMAGE_WIDTH}
            isLoading={isLoading}
            title="Profile Photo"
            onClose={() => setEditProfilePictureVisible(false)}
            onAction={picturePromptOnAction}
            onDelete={avatar ? deleteProfileImage : undefined}
          ></PhotoPrompt>
        </div>
      </Dialog>
      <div id="lastStep"></div>
      {showProgressWalkthroughStart && (
        <ProgressWalkthroughStart
          childId={childId}
          onClose={() => setShowProgressWalkthroughStart(false)}
        />
      )}
    </div>
  );
};
