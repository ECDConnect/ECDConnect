import {
  ContentConsentTypeEnum,
  SiteAddressDto,
  useTheme,
  CaregiverDto,
  ChildDto,
  LearnerDto,
  Document,
  useDialog,
  ClassroomGroupDto,
} from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Dialog,
  Dropdown,
  ProfileAvatar,
  StackedList,
  Typography,
  DropDownOption,
  ActionListDataItem,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import format from 'date-fns/format';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { PhotoPrompt } from '../../../components/photo-prompt/photo-prompt';
import { useAppDispatch } from '@store';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import {
  caregiverActions,
  caregiverSelectors,
  caregiverThunkActions,
} from '@store/caregiver';
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
  editChildInformationSchema,
  initialEditChildInformationValues,
} from '@schemas/child/edit-child-information/edit-child-information';
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

export const EditChildInformation: React.FC = () => {
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { theme } = useTheme();
  const location = useLocation<EditChildInformationLocationParams>();
  const childId = location.state.childId;
  const practitionerIsOnLeave = location.state.practitionerIsOnLeave;
  const playgroupEdit = location.state.playgroupEdit;
  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some((role) => role.name === 'Coach');
  const languages = useSelector(staticDataSelectors.getLanguages);
  const currentChild = useSelector(childrenSelectors.getChildById(childId));
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const classroomGroupLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
  );
  const caregiver = useSelector(
    caregiverSelectors.getCaregiverById(currentChild?.caregiverId)
  );
  const childPhotoConsent = useSelector(
    userSelectors.getUserConsentByType(
      currentChild?.userId,
      ContentConsentTypeEnum.PhotoPermissions
    )
  );
  const childUser = useSelector(
    childrenSelectors.getChildUserById(currentChild?.userId)
  );
  const { getDocumentTypeIdByEnum, getWorkflowStatusIdByEnum } =
    useStaticData();
  const typeId = getDocumentTypeIdByEnum(FileTypeEnum.ProfileImage);
  const profilePicture = useSelector(
    documentSelectors.getDocumentByTypeId(childUser?.id, typeId)
  );

  const caregiverRelation = useSelector(
    staticDataSelectors.getRelationById(caregiver?.relationId)
  );
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);
  // View States
  const [editFieldVisible, setEditFieldVisible] = useState(false);

  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [viewInfomationVisible, setViewInfomationVisible] =
    useState<boolean>(false);
  const [currentViewInformationType, setCurrentViewInformationType] =
    useState<ChildInformationViewType>();

  // Data Cache
  const [currentChildLearnerRecord, setCurrentChildLearnerRecord] =
    useState<LearnerDto>();
  const [classRoomGroupsList, setClassRoomGroupsList] = useState<
    DropDownOption<string>[]
  >([]);

  // Forms
  const [childEmergencyContactForm, setchildEmergencyContactForm] =
    useState<ChildEmergencyContactFormModel>();
  const [childHealthInformationForm, setChildHealthInformationForm] =
    useState<ChildHealthInformationFormModel>();
  const [
    childCareGiverChildInformationForm,
    setChildCareGiverChildInformationForm,
  ] = useState<CareGiverChildInformationFormModel>();
  const [childCaregiverInformation, setChildCaregiverInformation] =
    useState<ChildCaregiverInformationModel>();

  const getDefaultFormValues = () => {
    return initialEditChildInformationValues;
  };

  const {
    getValues: editChildInformationFormGetValues,
    setValue: editChildInformationFormSetValues,
  } = useForm({
    resolver: yupResolver(editChildInformationSchema),
    defaultValues: getDefaultFormValues(),
    mode: 'onChange',
  });

  useEffect(() => {
    if (playgroupEdit) {
      openChildConfirmEditClassPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playgroupEdit]);

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
    if (currentChild && classroomGroupLearners) {
      const currentChildL = classroomGroupLearners.find(
        (x) => x.userId === currentChild.userId && x.stoppedAttendance == null
      );
      setCurrentChildLearnerRecord(currentChildL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChild, classroomGroupLearners]);

  useEffect(() => {
    if (currentChild) {
      setNewStackListItems(currentChild, caregiver);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChild, caregiver, currentChildLearnerRecord]);

  const openChildConfirmEditClassPrompt = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => (
        <ActionModal
          customIcon={
            <ExclamationCircleIcon className="text-alertMain h-10 w-10" />
          }
          className="bg-white"
          iconBorderColor="alertBg"
          importantText={`Confirm ${childUser?.firstName}'s class change`}
          detailText={`Confirm that ${childUser?.firstName}'s caregiver has agreed to the class change and that you've informed them of the new practitioner if relevant. Select 'Yes' below to confirm.\n\nMake sure you submit today's attendance before changing the class.`}
          actionButtons={[
            {
              text: 'Yes, confirmed with caregiver',

              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                openEditField();
                onSubmit();
              },
              leadingIcon: 'PencilIcon',
            },
            {
              text: 'No, do this later',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                onCancel();
                history.push(ROUTES.CHILD_PROFILE, { childId });
              },
              leadingIcon: 'ArrowLeftIcon',
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
    setViewInfomationVisible(true);
  };

  const getViewInformation = (
    childInformationViewType: ChildInformationViewType | undefined
  ) => {
    if (childInformationViewType) {
      switch (childInformationViewType) {
        case 'address':
          return (
            <CareGiverChildInformationForm
              careGiverInformation={childCareGiverChildInformationForm}
              submitButtonIcon="SaveIcon"
              submitButtonText={isCoach ? 'Close' : 'Save'}
              canEdit={isCoach}
              onSubmit={(form) => {
                setChildCareGiverChildInformationForm(form);
                saveChildAddress(form);
              }}
            />
          );
        case 'healthInformation':
          return (
            <ChildHealthInformationForm
              childName={childUser?.firstName ?? ''}
              childHealthInformation={childHealthInformationForm}
              submitButtonIcon="SaveIcon"
              submitButtonText={isCoach ? 'Close' : 'Save'}
              canEdit={isCoach}
              onSubmit={(form) => {
                setChildHealthInformationForm(form);
                saveChildHealthInformation(form);
              }}
            />
          );
        case 'caregiverInformation':
          return (
            <ChildCaregiverInformation
              childCareGiverInformation={childCaregiverInformation}
              childName={childUser?.firstName ?? ''}
              submitButtonIcon="SaveIcon"
              submitButtonText={isCoach ? 'Close' : 'Save'}
              canEdit={isCoach}
              onSubmit={(form) => {
                setChildCaregiverInformation(form);
                saveChildCareGiver(form);
              }}
            />
          );
        case 'emergencyContact':
          return (
            <ChildEmergencyContactForm
              childEmergencyContactForm={childEmergencyContactForm}
              childName={childUser?.firstName ?? ''}
              submitButtonIcon="SaveIcon"
              submitButtonText={isCoach ? 'Close' : 'Save'}
              variation="practitioner"
              canEdit={isCoach}
              onSubmit={(form) => {
                setchildEmergencyContactForm(form);
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
      if (caregiver?.siteAddress?.addressLine2 !== '') {
        address += ', ' + caregiver?.siteAddress?.addressLine2;
      }
      if (caregiver?.siteAddress?.addressLine3 !== '') {
        address += ', ' + caregiver?.siteAddress?.addressLine3;
      }
      if (caregiver?.siteAddress?.ward !== '') {
        address += ', ' + caregiver?.siteAddress?.ward;
      }
      return address;
    }
    return 'Add address';
  };

  const setNewStackListItems = (child: ChildDto, caregiver?: CaregiverDto) => {
    const list: ActionListDataItem[] = [];
    if (child) {
      const learnerClassroomGroup = classroomGroups.find(
        (x) => x.id === currentChildLearnerRecord?.classroomGroupId
      );

      editChildInformationFormSetValues(
        'classroomGroupId',
        learnerClassroomGroup?.id || ''
      );

      const dobString = format(
        childUser?.dateOfBirth ? new Date(childUser?.dateOfBirth) : 0,
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

      list.push({
        title: 'Class',
        subTitle: learnerClassroomGroup?.name || 'No class',
        switchTextStyles: true,
        actionName: isCoach || practitionerIsOnLeave ? undefined : 'Edit',
        actionIcon: 'PencilIcon',
        onActionClick: () => {
          openChildConfirmEditClassPrompt();
        },
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
          apartmentNumber: caregiver?.siteAddress?.ward,
          streetAddress: caregiver?.siteAddress?.addressLine1,
          suburb: caregiver?.siteAddress?.addressLine2,
          city: caregiver?.siteAddress?.addressLine3,
          provinceId: caregiver?.siteAddress?.provinceId,
          postalCode: caregiver?.siteAddress?.postalCode,
        } as CareGiverChildInformationFormModel);

        setChildCaregiverInformation({
          firstname: caregiver?.firstName,
          surname: caregiver?.surname,
          relation: caregiverRelation?.description,
          relationId: caregiver?.relationId,
          phoneNumber: caregiver?.phoneNumber,
        } as ChildCaregiverInformationModel);

        setchildEmergencyContactForm({
          firstname: caregiver.emergencyContactFirstName,
          surname: caregiver.emergencyContactSurname,
          phoneNumber: caregiver.emergencyContactPhoneNumber,
          isAllowedCustody: caregiver.isAllowedCustody,
          custodianFirstname: caregiver.additionalFirstName,
          custodianSurname: caregiver.additionalSurname,
          custodianPhoneNumber: caregiver.additionalPhoneNumber,
        } as ChildEmergencyContactFormModel);
      }

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

  const openEditField = () => {
    setEditFieldVisible(true);
  };

  const saveEditClassroomGroup = async () => {
    const newClassroomGroupId =
      editChildInformationFormGetValues().classroomGroupId;

    if (currentChildLearnerRecord) {
      const learnerInputModel: LearnerDto = {
        id: currentChildLearnerRecord?.id,
        classroomGroupId: currentChildLearnerRecord?.classroomGroupId ?? '',
        userId: currentChildLearnerRecord?.userId ?? '',
        attendanceReasonId: currentChildLearnerRecord?.attendanceReasonId,
        otherAttendanceReason:
          currentChildLearnerRecord?.otherAttendanceReason ?? '',
        startedAttendance: currentChildLearnerRecord?.startedAttendance ?? '',
        stoppedAttendance: new Date().toISOString(),
        isActive: false,
      };

      appDispatch(
        classroomsActions.updateClassroomGroupLearner(learnerInputModel)
      );

      await appDispatch(
        classroomsThunkActions.updateLearner({
          id: learnerInputModel.id as string,
          learner: learnerInputModel,
        })
      );

      const newLearnerModel: LearnerDto = {
        id: newGuid(),
        classroomGroupId: newClassroomGroupId,
        userId: currentChildLearnerRecord?.userId ?? '',
        attendanceReasonId: currentChildLearnerRecord?.attendanceReasonId,
        otherAttendanceReason:
          currentChildLearnerRecord?.otherAttendanceReason ?? '',
        startedAttendance: new Date().toISOString(),
        stoppedAttendance: null,
        isActive: currentChildLearnerRecord?.isActive,
      };

      appDispatch(
        classroomsActions.createClassroomGroupLearner(newLearnerModel)
      );

      await appDispatch(
        classroomsThunkActions.createLearner({ learner: newLearnerModel })
      ).unwrap();

      await appDispatch(
        classroomsThunkActions.upsertClassroomGroups({})
      ).unwrap();
    } else {
      //this child does not belong to any classroomgroup
      const newLearnerModel: LearnerDto = {
        classroomGroupId: newClassroomGroupId,
        userId: currentChild?.userId ?? '',
        attendanceReasonId: undefined,
        otherAttendanceReason: '',
        startedAttendance: new Date().toISOString(),
        stoppedAttendance: null,
        isActive: true,
      };

      appDispatch(
        classroomsActions.createClassroomGroupLearner(newLearnerModel)
      );

      await appDispatch(
        classroomsThunkActions.createLearner({ learner: newLearnerModel })
      ).unwrap();

      await appDispatch(
        classroomsThunkActions.upsertClassroomGroups({})
      ).unwrap();
    }
    setEditFieldVisible(false);
    history.push(ROUTES.CHILD_PROFILE, { childId });
  };

  const saveChildCareGiver = async (
    childCaregiverForm: ChildCaregiverInformationModel
  ) => {
    if (caregiver) {
      const careGiverInputModel: CaregiverDto = {
        id: caregiver?.id ?? newGuid(),
        isActive: true,
        idNumber: caregiver?.idNumber ?? '',
        phoneNumber: childCaregiverForm.phoneNumber,
        firstName: caregiver?.firstName ?? '',
        surname: caregiver?.surname ?? '',
        insertedDate: new Date().toISOString(),
        relationId: caregiver?.relationId,
        siteAddress: caregiver?.siteAddress,
        educationId: caregiver?.educationId,
        emergencyContactFirstName: childEmergencyContactForm?.firstname ?? '',
        emergencyContactSurname: childEmergencyContactForm?.surname ?? '',
        emergencyContactPhoneNumber:
          childEmergencyContactForm?.phoneNumber ?? '',
        additionalFirstName: childEmergencyContactForm?.isAllowedCustody
          ? childEmergencyContactForm.firstname
          : childEmergencyContactForm?.custodianFirstname,
        additionalSurname: childEmergencyContactForm?.isAllowedCustody
          ? childEmergencyContactForm.surname
          : childEmergencyContactForm?.custodianSurname,
        additionalPhoneNumber: childEmergencyContactForm?.isAllowedCustody
          ? childEmergencyContactForm.phoneNumber
          : childEmergencyContactForm?.custodianPhoneNumber,
        joinReferencePanel: caregiver?.joinReferencePanel ?? false,
        contribution: caregiver?.contribution ?? false,
        isAllowedCustody: childEmergencyContactForm?.isAllowedCustody ?? false,
      };

      appDispatch(caregiverActions.updateCaregiver(careGiverInputModel));
      await appDispatch(
        caregiverThunkActions.updateCaregiver({
          id: careGiverInputModel.id as string,
          caregiver: careGiverInputModel,
        })
      );
      setViewInfomationVisible(false);
    }
  };

  const saveChildEmergencyContact = async (
    formData: ChildEmergencyContactFormModel
  ) => {
    if (caregiver) {
      const careGiverInputModel: CaregiverDto = {
        id: caregiver.id ?? newGuid(),
        isActive: true,
        idNumber: caregiver.idNumber ?? '',
        phoneNumber: caregiver.phoneNumber,
        firstName: caregiver.firstName ?? '',
        surname: caregiver.surname ?? '',
        insertedDate: new Date().toISOString(),
        relationId: caregiver.relationId,
        siteAddress: caregiver.siteAddress,
        educationId: caregiver.educationId,
        emergencyContactFirstName: formData.firstname,
        emergencyContactSurname: formData.surname,
        emergencyContactPhoneNumber: formData.phoneNumber,
        additionalFirstName: formData.isAllowedCustody
          ? formData.firstname
          : formData.custodianFirstname,
        additionalSurname: formData.isAllowedCustody
          ? formData.surname
          : formData.custodianSurname,
        additionalPhoneNumber: formData.isAllowedCustody
          ? formData.phoneNumber
          : formData.custodianPhoneNumber,
        joinReferencePanel: caregiver?.joinReferencePanel ?? false,
        contribution: caregiver?.contribution ?? false,
        isAllowedCustody: formData.isAllowedCustody,
      };

      appDispatch(caregiverActions.updateCaregiver(careGiverInputModel));
      await appDispatch(
        caregiverThunkActions.updateCaregiver({
          id: careGiverInputModel.id as string,
          caregiver: careGiverInputModel,
        })
      );
    }

    setViewInfomationVisible(false);
  };

  const saveChildHealthInformation = async (
    childHealthInformationForm: ChildHealthInformationFormModel
  ) => {
    if (currentChild) {
      const updateChild = Object.assign({}, currentChild);

      if (updateChild) {
        updateChild.allergies = childHealthInformationForm?.allergies || '';
        updateChild.disabilities =
          childHealthInformationForm?.disabilities || '';
        updateChild.otherHealthConditions =
          childHealthInformationForm?.healthConditions || '';

        appDispatch(childrenActions.updateChild(updateChild));
        await appDispatch(
          childrenThunkActions.updateChild({
            child: updateChild,
            id: String(updateChild.id),
          })
        ).unwrap();
      }

      setViewInfomationVisible(false);
    }
  };

  const saveChildAddress = async (
    childHealthInformationForm: CareGiverChildInformationFormModel
  ) => {
    if (caregiver) {
      const updateCareGiver: CaregiverDto = JSON.parse(
        JSON.stringify(caregiver)
      );
      if (updateCareGiver) {
        const siteAddress: SiteAddressDto = {
          id: updateCareGiver.siteAddress
            ? updateCareGiver.siteAddress.id
            : newGuid(),
          name: childHealthInformationForm.apartmentNumber ?? '',
          addressLine1: childHealthInformationForm.streetAddress,
          addressLine2: childHealthInformationForm.suburb,
          addressLine3: childHealthInformationForm.city,
          provinceId: childHealthInformationForm.provinceId,
          ward: childHealthInformationForm.apartmentNumber,
          postalCode: childHealthInformationForm.postalCode,
        };
        updateCareGiver.siteAddress = siteAddress;
        updateCareGiver.siteAddressId = siteAddress.id;

        appDispatch(caregiverActions.updateCaregiver(updateCareGiver));
      }

      setViewInfomationVisible(false);
    }
  };

  const displayProfilePicturePrompt = () => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  };

  const closeEditField = () => {
    setEditFieldVisible(false);
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

  const deleteProfileImage = async () => {
    if (!profilePicture) return;

    appDispatch(documentActions.deleteDocument(profilePicture));
    setEditProfilePictureVisible(false);
  };

  return (
    <div className={'h-full overflow-y-auto'}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={
          childUser
            ? `${childUser?.firstName} ${childUser?.surname} Profile`
            : 'Profile'
        }
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      >
        <div
          className={'flex w-full flex-col items-center justify-center pt-8'}
        >
          <ProfileAvatar
            dataUrl={profilePicture?.file || childUser?.profileImageUrl || ''}
            size={'header'}
            hasConsent={childPhotoConsent ? true : false}
            canChangeImage={childPhotoConsent ? true : false}
            onPressed={displayProfilePicturePrompt}
          />
          <StackedList
            className={'w-full bg-white px-4'}
            listItems={listItems}
            type={'ActionList'}
          />
        </div>
      </BannerWrapper>

      <Dialog
        visible={viewInfomationVisible}
        position={DialogPosition.Bottom}
        fullScreen={true}
        className={'bg-uiBg'}
      >
        <BannerWrapper
          size={'small'}
          showBackground={false}
          color={'primary'}
          onBack={() => setViewInfomationVisible(false)}
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
        stretch={true}
        borderRadius="normal"
        visible={editFieldVisible}
        position={DialogPosition.Middle}
      >
        <div className={'p-4'}>
          <div className={styles.labelContainer}>
            <Typography
              type="body"
              className=""
              color="textDark"
              text={'Edit Classes'}
              weight="bold"
            />
            <div onClick={closeEditField}>
              {renderIcon('XIcon', 'h-6 w-6 text-uiLight')}
            </div>
          </div>
          <Dropdown<string>
            placeholder={'Select class'}
            list={classRoomGroupsList}
            fillType="clear"
            fullWidth
            className={'mt-3 w-full'}
            selectedValue={editChildInformationFormGetValues().classroomGroupId}
            onChange={(item) => {
              editChildInformationFormSetValues('classroomGroupId', item);
            }}
          />
          <div className={'w-full pt-6'}>
            <Button
              size="small"
              type="filled"
              color="primary"
              className={'w-full'}
              onClick={saveEditClassroomGroup}
            >
              {renderIcon('SaveIcon', styles.buttonIcon)}
              <Typography
                type="help"
                className="mr-2"
                color="white"
                text={'Save'}
              />
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
