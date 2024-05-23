import {
  AttendanceDto,
  ChildAttendanceReportModel,
  useDialog,
  useTheme,
  Document,
  ContentConsentTypeEnum,
  LocalStorageKeys,
  RoleSystemNameEnum,
} from '@ecdlink/core';
import {
  FileTypeEnum,
  NoteTypeEnum,
  WorkflowStatusEnum,
} from '@ecdlink/graphql';
import {
  ActionModal,
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  ListItem,
  ListItemProps,
  ProfileAvatar,
  renderIcon,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { getWeek, startOfISOWeekYear } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { RemoveChildPrompt } from '../../../components/remove-child-prompt/remove-child-prompt';
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
import { analyticsActions } from '@store/analytics';
import ROUTES from '@routes/routes';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { practitionerSelectors } from '@/store/practitioner';
import ChildWrapper from './components/child-wrapper/ChildWrapper';
import { useAppContext } from '@/walkthrougContext';
import walkthroughImage from '../../../assets/walktroughImage.png';
import {
  getStorageItem,
  setStorageItem,
} from '@/utils/common/local-storage.utils';
import {
  TabsItemForPrincipal,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';

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
  const currentDate = new Date();
  const { isOnline } = useOnlineStatus();
  const { theme } = useTheme();
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const location = useLocation<ChildProfileRouteState>();
  const childId = location.state.childId;
  const practitionerIsOnLeave = location.state?.practitionerIsOnLeave;
  const { getDocumentTypeIdByEnum, getWorkflowStatusIdByEnum } =
    useStaticData();
  const workflowDocumentVerified = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.DocumentVerified
  );
  const workflowDocumentPendingVerified = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.DocumentPendingVerification
  );
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const progressTrainingDone = practitioner?.attendedChildProgress || false;
  const isPrincipal = practitioner?.isPrincipal;

  const child = useSelector(childrenSelectors.getChildById(childId));

  const practitioners = useSelector(
    practitionerSelectors.getPractitioners
  )?.filter((x) => {
    return x.user?.id !== practitioner?.user?.id;
  });

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(child?.userId!)
  );
  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );

  const classProgrammes = useSelector(classroomsSelectors.getClassProgrammes);

  const notes = useSelector(notesSelectors.getNotesByUserId(child?.userId));
  const attendanceData = useSelector(attendanceSelectors.getAttendance);
  const authUser = useSelector(authSelectors.getAuthUser);
  const childDocuments = useSelector(
    documentSelectors.getDocumentsByUserId(child?.userId)
  );

  const birthCertTypeId = getDocumentTypeIdByEnum(
    FileTypeEnum.ChildBirthCertificate
  );
  const clinicCardTypeId = getDocumentTypeIdByEnum(
    FileTypeEnum.ChildClinicCard
  );

  const childBirthCertificate = childDocuments?.find(
    (x) =>
      x.documentTypeId === birthCertTypeId ||
      x.documentTypeId === clinicCardTypeId
  );

  // TODO: this selector isn't working (show photo of child & allow user to add photo of child IF caregiver has consented)
  const childPhotoConsent = useSelector(
    userSelectors.getUserConsentByType(
      child?.userId,
      ContentConsentTypeEnum.PhotoPermissions
    )
  );

  const typeId = getDocumentTypeIdByEnum(FileTypeEnum.ProfileImage);
  const profilePicture = useSelector(
    documentSelectors.getDocumentByTypeId(child?.user?.id, typeId)
  );

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
  const [removeChildConfirmationVisible, setRemoveChildConfirmationVisible] =
    useState<boolean>(false);
  const childPendingWorkflowStatusId = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.ChildPending
  );
  const childExternalWorkflowStatusId = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.ChildExternalLink
  );
  const [notifications, setNotifications] = useState<ListItemProps[]>([]);
  const [attendanceReport, setAttendanceReport] =
    useState<ChildAttendanceReportModel>();

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Child Profile',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const {
    setState,
    state: { run },
  } = useAppContext();

  const childTutorialTaken = getStorageItem(
    LocalStorageKeys.childProfileTutorialComplete
  );

  const handleClickStart = () => {
    setState({ run: true, tourActive: true, stepIndex: 0 });
  };

  useEffect(() => {
    if (childTutorialTaken === undefined && !childTutorialTaken && !run) {
      goToChildProfileWalkthrough();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const goToChildProfileWalkthrough = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <ActionModal
          customIcon={
            <div className="flex">
              <img src={walkthroughImage} alt="profile" className="mb-2" />
            </div>
          }
          importantText={`Welcome to the child profile on Funda App!`}
          detailText={'Can I show you how to use this section?'}
          actionButtons={[
            {
              text: 'Yes, help me!',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                onSubmit();
                handleClickStart();
              },
              leadingIcon: 'CheckCircleIcon',
            },
            {
              text: 'No, skip',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                setStorageItem(
                  true,
                  LocalStorageKeys.childProfileTutorialComplete
                );
                onCancel();
              },
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  };

  const progressTrackerNotAvailablePrompt = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          icon={'QuestionMarkCircleIcon'}
          iconClassName="w-32 h-32"
          className="bg-white"
          iconColor="infoMain"
          importantText={`Child progress tracker not available`}
          detailText={`The child progress tracker is not available to you because you have not attended child progress training yet.

          Please speak to your coach to find out when you can attend this training.`}
          actionButtons={[
            {
              text: 'Close',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                onSubmit();
              },
              leadingIcon: 'XIcon',
            },
          ]}
        />
      ),
    });
  }, [dialog]);

  useEffect(() => {
    if (!attendanceData || !child) return;

    const childBirthDate = child?.user?.dateOfBirth
      ? new Date(child?.user?.dateOfBirth)
      : currentDate;

    const ageOfChild = getAge(childBirthDate);

    setChildAge(ageOfChild);

    if (classroomGroup) {
      if (isOnline) {
        new AttendanceService(authUser?.auth_token ?? '')
          .getChildAttendanceRecords(
            child.userId ?? '',
            classroomGroup?.id ?? '',
            startOfISOWeekYear(new Date()),
            currentDate
          )
          .then((data) => {
            setAttendanceReport(data);
          });
      }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceData, child, classroomGroup]);

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
      classProgrammes
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

  const viewChildProgressObservationReports = useCallback(() => {
    history.push(ROUTES.COMPLETED_CHILD_PROGRESS_OBSERVATION_REPORTS, {
      childId: child?.id,
    });
  }, [child?.id, history]);

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
    if (!profilePicture) return;

    appDispatch(documentActions.deleteDocument(profilePicture));
    setEditProfilePictureVisible(false);
  };

  const picturePromptOnAction = async (imageBaseString: string) => {
    const copy = Object.assign({}, child);
    if (copy) {
      copy.user!.profileImageUrl = imageBaseString;
      appDispatch(childrenActions.updateChild(copy));
      await appDispatch(
        childrenThunkActions.updateChild({
          id: copy.id as string,
          child: copy,
        })
      );
    }

    if (profilePicture) {
      appDispatch(
        documentActions.updateDocument({
          ...profilePicture,
          file: imageBaseString,
        })
      );
    } else {
      const fileName = `ProfilePicture_${child?.user?.id}.png`;

      const statusId = await getWorkflowStatusIdByEnum(
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

  const showCertificateError = (): boolean => {
    if (!childBirthCertificate) {
      return true;
    }

    if (
      (childBirthCertificate &&
        childBirthCertificate?.workflowStatusId ===
          workflowDocumentPendingVerified) ||
      childBirthCertificate?.workflowStatusId === workflowDocumentVerified
    ) {
      return false;
    }

    if (
      childBirthCertificate &&
      childBirthCertificate?.workflowStatusId !== workflowDocumentVerified
    ) {
      return true;
    }

    return false;
  };

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
        dividerType: 'dashed',
        onButtonClick: () => {
          if (isOnline) {
            history.push(ROUTES.CHILD_ATTENDANCE_REPORT, {
              childId: child?.id,
              classroomGroupId: classroomGroup?.id,
            });
          } else {
            showOnlineOnly();
          }
        },
      },
      {
        key: 'progress',
        title: 'Progress reports',
        subTitle: progressTrainingDone
          ? 'See observations & reports'
          : 'Not available before training',
        buttonType: 'filled',
        buttonIcon: 'EyeIcon',
        buttonText: progressTrainingDone ? 'View' : 'Info',
        buttonTextColor: 'secondary',
        buttonColor: 'secondaryAccent2',
        showButton: true,
        showDivider: true,
        dividerType: 'dashed',
        withPaddingY: true,
        onButtonClick: () => {
          if (progressTrainingDone) {
            viewChildProgressObservationReports();
          } else {
            progressTrackerNotAvailablePrompt();
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
    child?.id,
    childId,
    classroomGroup?.id,
    classroomGroup?.name,
    getNoteProfileOption,
    history,
    isOnline,
    isPrincipal,
    practitionerIsOnLeave,
    progressTrackerNotAvailablePrompt,
    progressTrainingDone,
    showOnlineOnly,
    viewChildProgressObservationReports,
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
        backgroundUrl={theme?.images.graphicOverlayUrl}
        title={`${child?.user?.firstName} ${child?.user?.surname}’s Profile`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => {
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
        onHelp={() => goToChildProfileWalkthrough()}
        displayHelp={true}
      >
        <div className={styles.avatarWrapper}>
          <ProfileAvatar
            hasConsent={!!childPhotoConsent}
            canChangeImage={!!childPhotoConsent}
            dataUrl={profilePicture?.file || child?.user?.profileImageUrl || ''}
            size={'header'}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
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
        {showCertificateError() && (
          <Alert
            className="m-4"
            title={'No birth certificate or clinic card'}
            list={[
              `Please upload a birth certificate or clinic card for ${child?.user?.firstName}`,
            ]}
            type="error"
            button={
              <Button
                color="textMid"
                type="filled"
                size="small"
                onClick={() => {
                  history.push(ROUTES.CHILD_REGISTRATION_BIRTH_CERTIFICATE, {
                    childId: child?.id,
                  });
                }}
              >
                {renderIcon('UploadIcon', 'w-5 h-5 text-white mr-1')}
                <Typography color="white" text={'Upload'} type="small" />
              </Button>
            }
          />
        )}

        {!!notifications?.length && child && (
          <div className={styles.notificationsStackList}>
            {notifications.map((notification) => (
              <ListItem
                {...notification}
                key={`child-profile-notification-${notification.key}`}
              />
            ))}
            {progressTrainingDone && (
              <div id={`child_progress_observations`} aria-disabled={run}>
                <ChildProgressReportAlert child={child} />
              </div>
            )}
          </div>
        )}
        <div className={styles.profileOptionsWrapper}>
          {options.map((options, index) => (
            <div key={`option-${index}`} id={`child_walkthrough_step_${index}`}>
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
          {!practitionerIsOnLeave && (
            <Button
              id="child_remove"
              icon="TrashIcon"
              className={styles.button}
              color="quatenary"
              textColor="quatenary"
              type="outlined"
              onClick={() => setRemoveChildConfirmationVisible(true)}
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
        className={'mb-16 px-4'}
        stretch={true}
        visible={removeChildConfirmationVisible}
        position={DialogPosition.Bottom}
      >
        <RemoveChildPrompt
          child={child}
          childUser={child?.user}
          onProceed={goToRemoveChild}
          onClose={() => setRemoveChildConfirmationVisible(false)}
        />
      </Dialog>
      <Dialog
        visible={editProfilePictureVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'p-4'}>
          <PhotoPrompt
            title="Profile Photo"
            onClose={() => setEditProfilePictureVisible(false)}
            onAction={picturePromptOnAction}
            onDelete={profilePicture?.file ? deleteProfileImage : undefined}
          ></PhotoPrompt>
        </div>
      </Dialog>
      <div id="lastStep"></div>
    </div>
  );
};
