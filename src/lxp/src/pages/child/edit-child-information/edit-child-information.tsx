import {
  CaregiverDto,
  ChildDto,
  Document,
  useDialog,
  RoleSystemNameEnum,
} from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Dialog,
  Dropdown,
  StackedList,
  Typography,
  DropDownOption,
  ActionListDataItem,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import format from 'date-fns/format';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { PhotoPrompt } from '../../../components/photo-prompt/photo-prompt';
import { useAppDispatch } from '@store';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import {
  childrenActions,
  childrenSelectors,
  childrenThunkActions,
} from '@store/children';
import {
  classroomsActions,
  classroomsThunkActions,
  classroomsSelectors,
} from '@store/classroom';
import { staticDataSelectors } from '@store/static-data';
import { newGuid } from '@utils/common/uuid.utils';
import { CareGiverChildInformationForm } from '../child-registration/care-giver-child-information-form/care-giver-child-information-form';
import { CareGiverChildInformationFormModel } from '@schemas/child/child-registration/care-giver-child-information-form';
import { ChildEmergencyContactForm } from '../child-registration/child-emergency-contact-form/child-emergency-contact-form';
import { ChildEmergencyContactFormModel } from '@schemas/child/child-registration/child-emergency-contact-form';
import { ChildHealthInformationForm } from '../child-registration/child-health-information-form/child-health-information-form';
import { ChildHealthInformationFormModel } from '@schemas/child/child-registration/child-health-information-form';
import { ChildCaregiverInformation } from './child-caregiver-information/child-caregiver-information';
import { ChildCaregiverInformationModel } from '@schemas/child/edit-child-information/care-giver-information-form';
import * as styles from './edit-child-information.styles';
import {
  ChildInformationViewType,
  EditChildInformationLocationParams,
} from './edit-child-information.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStaticData } from '@hooks/useStaticData';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import { documentActions, documentSelectors } from '@store/document';
import { userSelectors } from '@store/user';
import ROUTES from '../../../../src/routes/routes';
import { UNSURE_CLASS } from '@/constants/classroom';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';
import { notificationsSelectors } from '@/store/notifications';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { getClassroomGroupByChildUserId } from '@/store/classroom/classroom.selectors';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { practitionerSelectors } from '@/store/practitioner';
import { useUserPermissions } from '@/hooks/useUserPermissions';

export const EditChildInformation: React.FC = () => {
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const location = useLocation<EditChildInformationLocationParams>();
  const childId = location.state.childId;
  const practitionerIsOnLeave = location.state.practitionerIsOnLeave;
  const isFromEditClass = location.state.isFromEditClass;

  const isTrialPeriod = useIsTrialPeriod();

  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );
  const languages = useSelector(staticDataSelectors.getLanguages);
  const child = useSelector(childrenSelectors.getChildById(childId));
  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(child?.userId!)
  );
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { hasPermissionToManageChildren } = useUserPermissions();

  const hasPermissionToEdit =
    hasPermissionToManageChildren || practitioner?.isPrincipal || isTrialPeriod;

  const { getDocumentTypeIdByEnum, getWorkflowStatusIdByEnum } =
    useStaticData();
  const typeId = getDocumentTypeIdByEnum(FileTypeEnum.ProfileImage);
  const profilePicture = useSelector(
    documentSelectors.getDocumentByTypeId(child?.userId, typeId)
  );

  const caregiver = child?.caregiver;

  const caregiverRelation = useSelector(
    staticDataSelectors.getRelationById(caregiver?.relationId)
  );
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);
  const [editClassVisible, setEditClassVisible] = useState(false);

  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [viewInformationVisible, setViewInformationVisible] =
    useState<boolean>(false);
  const [currentViewInformationType, setCurrentViewInformationType] =
    useState<ChildInformationViewType>();

  // Data Cache
  const currentChildClassroomGroup = useSelector(
    getClassroomGroupByChildUserId(child?.userId!)
  );

  const [classRoomGroupsList, setClassRoomGroupsList] = useState<
    DropDownOption<string>[]
  >([]);
  const [classroomGroupId, setClassroomGroupId] = useState<string>(
    classroomGroup?.id || ''
  );
  // Forms
  const [childEmergencyContactForm, setChildEmergencyContactForm] =
    useState<ChildEmergencyContactFormModel>();
  const [childHealthInformationForm, setChildHealthInformationForm] =
    useState<ChildHealthInformationFormModel>();
  const [
    childCareGiverChildInformationForm,
    setChildCareGiverChildInformationForm,
  ] = useState<CareGiverChildInformationFormModel>();
  const [childCaregiverInformation, setChildCaregiverInformation] =
    useState<ChildCaregiverInformationModel>();

  useEffect(() => {
    if (isFromEditClass) {
      setEditClassVisible(true);
    }
  }, [isFromEditClass]);

  useEffect(() => {
    if (classroomGroups) {
      const classRoomGroupDownDownList: DropDownOption<string>[] =
        classroomGroups
          .filter((item: ClassroomGroupDto) => item.name !== UNSURE_CLASS)
          .map((x) => {
            return { id: x.id, value: x.id || '', label: x.name };
          });

      setClassRoomGroupsList(classRoomGroupDownDownList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomGroups]);

  useEffect(() => {
    if (child) {
      setNewStackListItems(child, caregiver);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child, caregiver]);

  const assignToClassNotifications = useSelector(
    notificationsSelectors.getAllNotifications
  ).filter(
    (item) =>
      item?.message?.cta?.includes('[[AddChildToClass]]') &&
      childId &&
      item?.message?.action?.includes(childId)
  );

  const removeNotifications = async () => {
    if (assignToClassNotifications && assignToClassNotifications?.length > 0) {
      assignToClassNotifications.map((notification) => {
        appDispatch(
          disableBackendNotification({
            notificationId: notification.message.reference ?? '',
          })
        );
      });
    }
  };

  const openChildConfirmEditClassPrompt = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          customIcon={
            <ExclamationCircleIcon className="text-alertMain mb-4 h-10 w-10" />
          }
          className="bg-white"
          iconBorderColor="alertBg"
          importantText="Confirm class change"
          detailText={`Confirm that ${child?.user?.firstName}'s caregiver has agreed to this class change.\n\nMake sure you submit today's attendance before changing the class.`}
          actionButtons={[
            {
              text: 'Yes, confirmed with caregiver',

              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              onClick: () => {
                saveEditClassroomGroup();
                history.push(ROUTES.CHILD_PROFILE, { childId });
                onSubmit();
              },
              leadingIcon: 'PencilIcon',
            },
            {
              text: 'No, do this later',
              textColour: 'quatenary',
              colour: 'quatenary',
              type: 'outlined',
              onClick: () => {
                onCancel();
                history.push(ROUTES.CHILD_PROFILE, { childId });
              },
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  };

  const openViewInformation = (
    childInformationViewType: ChildInformationViewType
  ) => {
    setCurrentViewInformationType(childInformationViewType);
    setViewInformationVisible(true);
  };

  const getViewInformation = (
    childInformationViewType: ChildInformationViewType | undefined
  ) => {
    if (childInformationViewType) {
      switch (childInformationViewType) {
        case 'address':
          return (
            <CareGiverChildInformationForm
              enableReadOnlyMode
              careGiverInformation={childCareGiverChildInformationForm}
              canEdit={
                !isCoach && !practitionerIsOnLeave && hasPermissionToEdit
              }
              onSubmit={(form) => {
                setChildCareGiverChildInformationForm(form);
                saveChildAddress(form);
              }}
            />
          );
        case 'healthInformation':
          return (
            <ChildHealthInformationForm
              enableReadOnlyMode
              childName={child?.user?.firstName ?? ''}
              childHealthInformation={childHealthInformationForm}
              canEdit={
                !isCoach && !practitionerIsOnLeave && hasPermissionToEdit
              }
              onSubmit={(form) => {
                setChildHealthInformationForm(form);
                saveChildHealthInformation(form);
              }}
            />
          );
        case 'caregiverInformation':
          return (
            <ChildCaregiverInformation
              enableReadOnlyMode
              childCareGiverInformation={childCaregiverInformation}
              childName={child?.user?.firstName ?? ''}
              canEdit={!isCoach && hasPermissionToEdit}
              onSubmit={(form) => {
                setChildCaregiverInformation(form);
                saveChildCaregiver(form);
              }}
            />
          );
        case 'emergencyContact':
          return (
            <ChildEmergencyContactForm
              enableReadOnlyMode
              childEmergencyContactForm={childEmergencyContactForm}
              childName={child?.user?.firstName ?? ''}
              variation="practitioner"
              canEdit={
                !isCoach && !practitionerIsOnLeave && hasPermissionToEdit
              }
              onSubmit={(form) => {
                setChildEmergencyContactForm(form);
                saveChildEmergencyContact(form);
              }}
            />
          );
        default:
          return <div></div>;
      }
    }
    return <div></div>;
  };

  const getViewInformationTitle = (
    childInformationViewType: ChildInformationViewType | undefined
  ) => {
    if (childInformationViewType) {
      switch (childInformationViewType) {
        case 'address':
          return 'Address';
        case 'healthInformation':
          return 'Health information';
        case 'caregiverInformation':
          return 'Caregiver information';
        case 'emergencyContact':
          return 'Emergency contact';
        default:
          return '';
      }
    }
    return '';
  };

  const getAddress = () => {
    if (caregiver?.siteAddress) {
      let address = '';
      if (caregiver?.siteAddress?.addressLine1 !== '') {
        address += caregiver?.siteAddress?.addressLine1;
      }
      if (caregiver?.siteAddress?.postalCode !== '') {
        address = `${address ? (address += ', ') : ''}${
          caregiver?.siteAddress?.postalCode
        }`;
      }
      return address;
    }
    return 'Add address';
  };

  const setNewStackListItems = (child: ChildDto, caregiver?: CaregiverDto) => {
    const list: ActionListDataItem[] = [];
    if (child) {
      const dobString = format(
        child?.user?.dateOfBirth ? new Date(child?.user?.dateOfBirth) : 0,
        'd MMM yyyy'
      );

      list.push({
        title: 'Birth date',
        subTitle: dobString,
        switchTextStyles: true,
      });

      list.push({
        title: 'Home languages',
        subTitle:
          languages.find((x) => x.id === child.languageId)?.description || '',
        switchTextStyles: true,
      });

      if (caregiver) {
        list.push({
          title: 'Caregiver information',
          subTitle: `${caregiver?.firstName || ''} ${caregiver?.surname || ''}`,
          switchTextStyles: true,
          actionName: 'View',
          actionIcon: 'EyeIcon',
          onActionClick: () => {
            openViewInformation('caregiverInformation');
          },
        });

        list.push({
          title: 'Emergency contact',
          subTitle: `${caregiver?.emergencyContactFirstName || ''} ${
            caregiver?.emergencyContactSurname || ''
          }`,
          switchTextStyles: true,
          actionName: 'View',
          actionIcon: 'EyeIcon',
          onActionClick: () => {
            openViewInformation('emergencyContact');
          },
        });

        list.push({
          title: 'Who else can pick the child up',
          subTitle: `${
            caregiver?.additionalFirstName ||
            caregiver?.emergencyContactFirstName
          } ${
            caregiver?.additionalSurname || caregiver?.emergencyContactSurname
          }`,
          switchTextStyles: true,
          actionName: 'View',
          actionIcon: 'EyeIcon',
          onActionClick: () => {
            openViewInformation('emergencyContact');
          },
        });

        list.push({
          title: 'Health information',
          subTitle: getHealthInformation(child),
          switchTextStyles: true,
          actionName: 'View',
          actionIcon: 'EyeIcon',
          onActionClick: () => {
            openViewInformation('healthInformation');
          },
        });

        list.push({
          title: 'Address',
          subTitle: getAddress(),
          switchTextStyles: true,
          actionName: 'View',
          actionIcon: 'EyeIcon',
          onActionClick: () => {
            openViewInformation('address');
          },
        });

        setChildCareGiverChildInformationForm({
          streetAddress: caregiver?.siteAddress?.addressLine1,
          postalCode: caregiver?.siteAddress?.postalCode,
        } as CareGiverChildInformationFormModel);

        setChildCaregiverInformation({
          firstname: caregiver?.firstName,
          surname: caregiver?.surname,
          relation: caregiverRelation?.description,
          relationId: caregiver?.relationId,
          phoneNumber: caregiver?.phoneNumber,
        } as ChildCaregiverInformationModel);

        setChildEmergencyContactForm({
          firstname: caregiver.emergencyContactFirstName,
          surname: caregiver.emergencyContactSurname,
          phoneNumber: caregiver.emergencyContactPhoneNumber,
          isAllowedCustody: caregiver.isAllowedCustody,
          custodianFirstname: caregiver.additionalFirstName,
          custodianSurname: caregiver.additionalSurname,
          custodianPhoneNumber: caregiver.additionalPhoneNumber,
        } as ChildEmergencyContactFormModel);
      }

      setChildHealthInformationForm({
        allergies: child.allergies,
        disabilities: child.disabilities,
        healthConditions: child.otherHealthConditions,
      } as ChildHealthInformationFormModel);
    }

    setListItems(list);
  };

  const getHealthInformation = (child: ChildDto): string => {
    let information = '';

    if (child?.allergies) {
      information = `${child?.allergies}${
        child?.disabilities || child?.otherHealthConditions ? ',' : ''
      }`;
    }

    if (child?.disabilities) {
      information = `${information} ${child?.disabilities}${
        child?.otherHealthConditions ? ',' : ''
      }`;
    }

    if (child?.otherHealthConditions) {
      information = `${information} ${child?.otherHealthConditions}`;
    }

    return information;
  };

  const saveEditClassroomGroup = async () => {
    if (!!child) {
      // They should always be in a classroom group though
      if (!!currentChildClassroomGroup) {
        // Deactivate old learner record
        removeNotifications();

        appDispatch(
          classroomsActions.deactivateLearner({
            childUserId: child.userId!,
            classroomGroupId: currentChildClassroomGroup.id,
          })
        );
      }

      appDispatch(
        classroomsActions.createLearner({
          childUserId: child.userId!,
          newClassroomGroupId: classroomGroupId,
        })
      );

      await appDispatch(
        classroomsThunkActions.upsertClassroomGroupLearners({})
      ).unwrap();
    }

    setEditClassVisible(false);
    history.push(ROUTES.CHILD_PROFILE, { childId });
  };

  const saveChildCaregiver = async (
    childCaregiverForm: ChildCaregiverInformationModel
  ) => {
    if (!!child && !!child.caregiver) {
      const updatedChild = {
        ...child,
        caregiver: {
          ...child.caregiver,
          phoneNumber: childCaregiverForm.phoneNumber,
        },
      };

      appDispatch(childrenActions.updateChild(updatedChild));
      await appDispatch(
        childrenThunkActions.updateChild({
          id: updatedChild.id as string,
          child: updatedChild,
        })
      );
    }
    setViewInformationVisible(false);
  };

  const saveChildEmergencyContact = async (
    emergencyContactForm: ChildEmergencyContactFormModel
  ) => {
    //const updateChild = Object.assign({}, child);
    if (!!child && !!child.caregiver) {
      const updatedChild = {
        ...child,
        caregiver: {
          ...child.caregiver,
          emergencyContactFirstName: emergencyContactForm.firstname,
          emergencyContactSurname: emergencyContactForm.surname,
          emergencyContactPhoneNumber: emergencyContactForm?.phoneNumber,
          additionalFirstName: emergencyContactForm.isAllowedCustody
            ? emergencyContactForm.firstname
            : emergencyContactForm?.custodianFirstname,
          additionalSurname: emergencyContactForm.isAllowedCustody
            ? emergencyContactForm.surname
            : emergencyContactForm?.custodianSurname,
          additionalPhoneNumber: emergencyContactForm.isAllowedCustody
            ? emergencyContactForm.phoneNumber
            : emergencyContactForm?.custodianPhoneNumber,
          isAllowedCustody: emergencyContactForm.isAllowedCustody ?? false,
        },
      };

      appDispatch(childrenActions.updateChild(updatedChild));
      await appDispatch(
        childrenThunkActions.updateChild({
          id: updatedChild.id as string,
          child: updatedChild,
        })
      );
    }

    setViewInformationVisible(false);
  };

  const saveChildHealthInformation = async (
    childHealthInformationForm: ChildHealthInformationFormModel
  ) => {
    if (child) {
      const updatedChild = {
        ...child,
        allergies: childHealthInformationForm.allergies,
        disabilities: childHealthInformationForm.disabilities,
        otherHealthConditions: childHealthInformationForm.healthConditions,
      };

      appDispatch(childrenActions.updateChild(updatedChild));
      await appDispatch(
        childrenThunkActions.updateChild({
          child: updatedChild,
          id: String(updatedChild.id),
        })
      ).unwrap();
    }

    setViewInformationVisible(false);
  };

  const saveChildAddress = async (
    childAddressInformationForm: CareGiverChildInformationFormModel
  ) => {
    if (!!child && !!child.caregiver) {
      const siteAddressId = !!child.caregiver.siteAddressId
        ? child.caregiver.siteAddressId
        : newGuid();

      const updatedChild = {
        ...child,
        caregiver: {
          ...child.caregiver,
          siteAddressId: siteAddressId,
          siteAddress: {
            ...child.caregiver.siteAddress,
            id: siteAddressId,
            addressLine1: childAddressInformationForm.streetAddress,
            postalCode: childAddressInformationForm.postalCode,
          },
        },
      };

      appDispatch(childrenActions.updateChild(updatedChild));
      await appDispatch(
        childrenThunkActions.updateChild({
          child: updatedChild,
          id: String(updatedChild.id),
        })
      ).unwrap();
    }

    setViewInformationVisible(false);
  };

  const displayProfilePicturePrompt = () => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  };

  const closeEditField = () => {
    setEditClassVisible(false);
    history.push(ROUTES.CHILD_PROFILE, { childId });
  };

  const picturePromtOnAction = async (imageBaseString: string) => {
    if (profilePicture) {
      appDispatch(
        documentActions.updateDocument({
          ...profilePicture,
          file: imageBaseString,
        })
      );
    } else {
      const fileName = `ProfilePicture_${child?.userId}.png`;

      const statusId = await getWorkflowStatusIdByEnum(
        WorkflowStatusEnum.DocumentVerified
      );

      const documentInputModel: Document = {
        id: newGuid(),
        userId: child?.userId,
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

  const deleteProfileImage = async () => {
    if (!profilePicture) return;

    appDispatch(documentActions.deleteDocument(profilePicture));
    setEditProfilePictureVisible(false);
  };

  return (
    <div className={'h-full overflow-y-auto'}>
      <BannerWrapper
        title={
          !!child && !!child.user
            ? `${child.user.firstName} ${child.user.surname} Profile`
            : 'Profile'
        }
        color={'primary'}
        size="small"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
        className="flex w-full flex-col items-center justify-center p-4"
      >
        <StackedList
          className="w-full"
          listItems={listItems}
          type={'ActionList'}
        />
      </BannerWrapper>

      <Dialog
        visible={viewInformationVisible}
        position={DialogPosition.Bottom}
        fullScreen={true}
        className={'bg-uiBg'}
      >
        <BannerWrapper
          size={'small'}
          showBackground={false}
          color={'primary'}
          onBack={() => setViewInformationVisible(false)}
          title={getViewInformationTitle(currentViewInformationType)}
          className={styles.bannerContentWrapper}
          displayOffline={!isOnline}
        >
          {getViewInformation(currentViewInformationType)}
        </BannerWrapper>
      </Dialog>

      <Dialog
        visible={editProfilePictureVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'p-4'}>
          <PhotoPrompt
            title="Profile Photo"
            onClose={displayProfilePicturePrompt}
            onAction={picturePromtOnAction}
            onDelete={profilePicture?.file ? deleteProfileImage : undefined}
          ></PhotoPrompt>
        </div>
      </Dialog>

      <Dialog
        stretch
        visible={editClassVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'flex flex-col overflow-auto p-4'}>
          <div className={styles.labelContainer}>
            <Typography
              type="body"
              className=""
              color="textDark"
              text={'Edit Class'}
              weight="bold"
            />
            <button onClick={closeEditField}>
              {renderIcon('XIcon', 'h-6 w-6 text-uiLight')}
            </button>
          </div>
          <Dropdown<string>
            placeholder={'Select class'}
            list={classRoomGroupsList}
            fillType="clear"
            fullWidth
            className={'mt-3 w-full'}
            selectedValue={classroomGroupId}
            onChange={(item) => {
              setClassroomGroupId(item);
            }}
          />
          <Button
            size="small"
            type="filled"
            color="quatenary"
            className={'mt-6 w-full'}
            disabled={!classroomGroupId}
            onClick={openChildConfirmEditClassPrompt}
            icon="SaveIcon"
            text="Save"
            textColor="white"
          />
        </div>
      </Dialog>
    </div>
  );
};
