import {
  ChildAttendanceReportModel,
  useTheme,
  Document,
  ContentConsentTypeEnum,
  getAgeInYearsMonthsAndDays,
} from '@ecdlink/core';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import {
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
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { RemoveChildPrompt } from '../../../components/remove-child-prompt/remove-child-prompt';

import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStaticData } from '@hooks/useStaticData';
import { Age } from '@models/common/Age';
import { childrenActions, childrenSelectors } from '@store/children';
import { classroomsSelectors } from '@store/classroom';
import { documentActions, documentSelectors } from '@store/document';
import {
  getColor,
  getShape,
} from '@utils/classroom/attendance/track-attendance-utils';
import { ChildPending } from '../../child/child-profile/child-pending/child-pending';
import * as styles from './coach-child-profile.styles';
import { ChildProfileRouteState } from './coach-child-profile.types';
import { useAppDispatch } from '@store';
import { newGuid } from '@utils/common/uuid.utils';
import { userSelectors } from '@store/user';
import { PhotoPrompt } from '../../../components/photo-prompt/photo-prompt';
import { contentReportSelectors } from '@store/content/report';
import { analyticsActions } from '@store/analytics';
import ROUTES from '@routes/routes';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';

export const CoachChildProfile: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const { theme } = useTheme();
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const location = useLocation<ChildProfileRouteState>();
  const childId = location.state.childId;
  const practitionerId = location.state.practitionerId;

  const { getDocumentTypeIdByEnum, getWorkflowStatusIdByEnum } =
    useStaticData();
  const workflowDocumentVerified = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.DocumentVerified
  );
  const workflowDocumentPendingVerified = getWorkflowStatusIdByEnum(
    WorkflowStatusEnum.DocumentPendingVerification
  );
  const child = useSelector(childrenSelectors.getChildById(childId));

  const classGroupId = useSelector(
    classroomsSelectors.getLearnerClassGroupId(child?.userId)
  );
  const user = useSelector(userSelectors.getUser);
  const playGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(classGroupId)
  );

  const childUser = useSelector(
    childrenSelectors.getChildUserById(child?.userId)
  );
  const childDocuments = useSelector(
    documentSelectors.getDocumentsByUserId(child?.userId)
  );
  const childBirthCertificate = childDocuments?.find(
    (x) =>
      x.name?.includes('birthCertificate') || x.name?.includes('clinicCard')
  );

  const childPhotoConsent = useSelector(
    userSelectors.getUserConsentByType(
      child?.userId,
      ContentConsentTypeEnum.PhotoPermissions
    )
  );

  const typeId = getDocumentTypeIdByEnum(FileTypeEnum.ProfileImage);
  const profilePicture = useSelector(
    documentSelectors.getDocumentByTypeId(childUser?.id, typeId)
  );

  const allCompletedReports = useSelector(
    contentReportSelectors.getChildLatestCompletedReports(child?.id)
  );

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

  const [attendancePercentage, setAttendancePercentage] = useState<number>(0);
  const [notifications, setNotifications] = useState<ListItemProps[]>([]);
  const [profileOptions, setProfileOptions] = useState<ListItemProps[]>([
    {
      key: 'personal-information',
      title: 'Personal Information',
      subTitle: 'Child & caregiver information',
      buttonType: 'outlined',
      buttonIcon: 'EyeIcon',
      buttonText: 'View',
      buttonTextColor: 'secondary',
      buttonColor: 'secondaryAccent2',
      showButton: true,
      showDivider: true,
      dividerType: 'dashed',
      withPaddingY: true,
      onButtonClick: () => {
        history.push(ROUTES.CHILD.INFORMATION.EDIT, { childId });
      },
    },
  ]);
  const [attendanceReport, setAttendanceReport] =
    useState<ChildAttendanceReportModel>();
  const [belongsToNoPlaygroup, setBelongsToNoPlaygroup] =
    useState<boolean>(false);

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

  useEffect(() => {
    if (playGroup?.name === NoPlaygroupClassroomType.name) {
      setBelongsToNoPlaygroup(true);
    }

    const profileOptionsCopy = [...profileOptions];

    profileOptionsCopy.unshift({
      key: 'attendance-record',
      title: 'Attendance Record',
      buttonType: 'outlined',
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
        history.push(ROUTES.CHILD_ATTENDANCE_REPORT, {
          childId: child?.id,
          classroomGroupId: playGroup?.id,
        });
      },
    });

    if (allCompletedReports.length > 0) {
      profileOptionsCopy.push({
        key: 'progress',
        title: 'Progress',
        subTitle: 'See observations & reports',
        buttonType: 'outlined',
        buttonIcon: 'EyeIcon',
        buttonText: 'View',
        buttonTextColor: 'secondary',
        buttonColor: 'secondaryAccent2',
        showButton: true,
        showDivider: true,
        dividerType: 'dashed',
        withPaddingY: true,
        onButtonClick: () => {
          viewChildProgressObservationReports();
        },
      });
    }

    setProfileOptions(profileOptionsCopy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!attendanceReport) return;
    setAttendancePercentage(attendanceReport.attendancePercentage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceReport]);

  useEffect(() => {
    const dateOfBirth = child?.user?.dateOfBirth as string;
    setChildAge(getAgeInYearsMonthsAndDays(dateOfBirth));
  });

  useEffect(() => {
    if (!attendancePercentage) return;

    const optionIndex = profileOptions.findIndex(
      (x) => x.key === 'attendance-record'
    );

    if (optionIndex < 0) return;

    const option = profileOptions[optionIndex];

    option.subTitleColor = getColor(attendancePercentage);
    option.subTitleShape = getShape(attendancePercentage);
    option.subTitle = `${attendancePercentage.toFixed()}% present this year`;

    profileOptions[optionIndex] = option;
    setProfileOptions([...profileOptions]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendancePercentage]);

  const viewChildProgressObservationReports = () => {
    history.push(ROUTES.COMPLETED_CHILD_PROGRESS_OBSERVATION_REPORTS, {
      childId: child?.id,
    });
  };

  const goToRemoveChild = () => {
    history.push(ROUTES.REMOVE_CHILD, {
      childId: child?.id,
      practitionerId: practitionerId,
    });
  };

  const deleteProfileImage = async () => {
    if (!profilePicture) return;

    appDispatch(documentActions.deleteDocument(profilePicture));
    setEditProfilePictureVisible(false);
  };

  const picturePromptOnAction = async (imageBaseString: string) => {
    const copy = Object.assign({}, childUser);
    if (copy) {
      copy.profileImageUrl = imageBaseString;
      appDispatch(childrenActions.updateChildUser(copy));
    }

    if (profilePicture) {
      appDispatch(
        documentActions.updateDocument({
          ...profilePicture,
          file: imageBaseString,
        })
      );
    } else {
      const fileName = `ProfilePicture_${childUser?.id}.png`;

      const statusId = await getWorkflowStatusIdByEnum(
        WorkflowStatusEnum.DocumentVerified
      );

      const documentInputModel: Document = {
        id: newGuid(),
        userId: childUser?.id,
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

  if (
    child &&
    (child?.workflowStatusId === childPendingWorkflowStatusId ||
      child?.workflowStatusId === childExternalWorkflowStatusId)
  ) {
    return <ChildPending child={child} childUser={childUser} />;
  }
  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        title={`${childUser?.firstName} ${childUser?.surname}’s Profile`}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() =>
          history.push(ROUTES.COACH.PRACTITIONER_CHILD_LIST, { practitionerId })
        }
        displayOffline={!isOnline}
      >
        <div className={styles.avatarWrapper}>
          <ProfileAvatar
            hasConsent={childPhotoConsent ? true : false}
            canChangeImage={childPhotoConsent ? true : false}
            dataUrl={profilePicture?.file || childUser?.profileImageUrl || ''}
            size={'header'}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onPressed={() => setEditProfilePictureVisible(true)}
          />
        </div>

        <div className={styles.chipsWrapper}>
          <StatusChip
            backgroundColour="infoDark"
            borderColour="infoDark"
            text={playGroup?.name || NoPlaygroupClassroomType.title}
            textColour={'white'}
            className={'mr-2'}
          />
          <StatusChip
            backgroundColour="primary"
            borderColour="primary"
            text={`${childAge?.years || '0'} years ${
              childAge?.months || '0'
            } months`}
            textColour={'white'}
            className={'mr-2'}
          />
        </div>

        {belongsToNoPlaygroup && (
          <Alert
            className="m-4"
            title={`${
              childUser?.firstName || 'This child'
            } does not have a class`}
            list={[
              `Add ${childUser?.firstName || 'this child'} to a class now`,
            ]}
            type="error"
            button={
              <Button
                color="textMid"
                type="filled"
                size="small"
                onClick={() => {
                  history.push(ROUTES.CHILD.INFORMATION.EDIT, {
                    childId: child?.id,
                    playgroupEdit: true,
                  });
                }}
              >
                {renderIcon('PlusIcon', 'w-5 h-5 text-white mr-1')}
                <Typography color="white" text="Add to a class" type="small" />
              </Button>
            }
          />
        )}

        {showCertificateError() && (
          <Alert
            className="m-4"
            title={'Problem with birth certificate or clinic card'}
            list={[
              `SmartStart found a problem with ${
                childUser?.firstName || 'this child'
              }'s document. Please upload a new birth certificate or clinic card now.`,
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

        {notifications && child && (
          <div className={styles.notificationsStacklist}>
            {notifications.map((notification) => (
              <ListItem
                {...notification}
                key={`child-profile-notification-${notification.key}`}
              />
            ))}
          </div>
        )}
        <div className={styles.profileOptionsWrapper}>
          {profileOptions.map((options) => (
            <ListItem
              {...options}
              key={`child-profile-option-${options.key}`}
            />
          ))}

          <Divider dividerType="dashed" className="-mt-1.5" />

          <Button
            className={styles.button.replace('mt-4', 'mt-3')}
            color={'primary'}
            type="filled"
            onClick={contactCaregivers}
          >
            {renderIcon('ChatAlt2Icon', styles.buttonIcon)}
            <Typography type="button" text="Contact caregiver" color="white" />
          </Button>
          <Button className={styles.button} color={'primary'} type="outlined">
            {renderIcon('TrashIcon', styles.buttonIcon)}
            <Typography
              type="button"
              text={`Remove ${childUser?.firstName}`}
              color="primary"
              onClick={() => setRemoveChildConfirmationVisible(true)}
            />
          </Button>
        </div>
      </BannerWrapper>
      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={removeChildConfirmationVisible}
        position={DialogPosition.Bottom}
      >
        <RemoveChildPrompt
          child={child}
          childUser={childUser}
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
    </div>
  );
};
