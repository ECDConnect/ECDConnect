import {
  CaregiverDto,
  ChildDto,
  Document,
  LearnerDto,
  SiteAddressDto,
  UserDto,
} from '@ecdlink/core';
import {
  AddChildCaregiverTokenModelInput,
  AddChildLearnerTokenModelInput,
  AddChildSiteAddressTokenModelInput,
  AddChildTokenModelInput,
} from '@ecdlink/graphql';
import { CareGiverChildInformationFormModel } from '@schemas/child/child-registration/care-giver-child-information-form';
import { CareGiverContributionFormModel } from '@schemas/child/child-registration/care-giver-contribution-form';
import { CareGiverExtraInformationFormModel } from '@schemas/child/child-registration/care-giver-extra-information';
import { CareGiverInformationFormModel } from '@schemas/child/child-registration/care-giver-information-form';
import { CareGiverReferencePanelFormModel } from '@schemas/child/child-registration/care-giver-reference-panel-form';
import { ChildEmergencyContactFormModel } from '@schemas/child/child-registration/child-emergency-contact-form';
import { ChildExtraInformationFormModel } from '@schemas/child/child-registration/child-extra-information-form';
import { ChildHealthInformationFormModel } from '@schemas/child/child-registration/child-health-information-form';
import { ChildInformationFormModel } from '@schemas/child/child-registration/child-information-form';
import { newGuid } from '../common/uuid.utils';

export const mapChildUserDto = (
  childInformationForm: ChildInformationFormModel,
  childExtraInformationForm?: ChildExtraInformationFormModel,
  user?: UserDto
): UserDto => {
  const dateOfBirth = new Date(
    childInformationForm.dobYear ?? 0,
    childInformationForm.dobMonth ?? 0,
    childInformationForm.dobDay ?? 0
  );
  if (user) {
    return {
      ...user,
      idNumber: childInformationForm.childIdField || '',
      firstName: childInformationForm.firstname,
      surname: childInformationForm.surname,
      dateOfBirth: dateOfBirth.toISOString() || '',
      genderId: childExtraInformationForm?.genderId,
      raceId: childExtraInformationForm?.race,
    };
  }

  return {
    id: newGuid(),
    isSouthAfricanCitizen: true,
    idNumber: childInformationForm.childIdField ?? '',
    verifiedByHomeAffairs: false,
    dateOfBirth: dateOfBirth.toISOString(),
    genderId: childExtraInformationForm?.genderId,
    raceId: childExtraInformationForm?.race,
    firstName: childInformationForm.firstname ?? '',
    surname: childInformationForm.surname ?? '',
    contactPreference: 'none',
    phoneNumber: '',
    email: '',
    isActive: true,
    insertedDate: new Date().toISOString(),
  };
};

export const mapChildDto = (
  userId: string,
  childStatusId: string,
  healthInformationForm?: ChildHealthInformationFormModel,
  childExtraInformationForm?: ChildExtraInformationFormModel,
  child?: ChildDto
): ChildDto => {
  if (child) {
    return {
      ...child,
      languageId:
        childExtraInformationForm?.homeLanguages &&
        childExtraInformationForm.homeLanguages[0]
          ? childExtraInformationForm.homeLanguages[0]
          : undefined,
      allergies: healthInformationForm?.allergies ?? '',
      disabilities: healthInformationForm?.disabilities ?? '',
      otherHealthConditions: healthInformationForm?.healthConditions ?? '',
    };
  }

  return {
    id: newGuid(),
    isActive: true,
    userId: userId,
    caregiverId: '',
    languageId:
      childExtraInformationForm?.homeLanguages &&
      childExtraInformationForm.homeLanguages[0]
        ? childExtraInformationForm.homeLanguages[0]
        : undefined,
    allergies: healthInformationForm?.allergies ?? '',
    disabilities: healthInformationForm?.disabilities ?? '',
    otherHealthConditions: healthInformationForm?.healthConditions ?? '',
    workflowStatusId: childStatusId,
    insertedDate: new Date().toISOString(),
    insertedBy: '',
  };
};

export const mapLearnerDto = (
  userId: string,
  childInformationForm?: ChildInformationFormModel,
  learner?: LearnerDto
): LearnerDto => {
  if (learner) {
    return {
      ...learner,
      id: learner.id && learner.id.length > 0 ? learner.id : newGuid(),
      classroomGroupId: childInformationForm?.playgroupId ?? '',
      userId: userId,
      attendanceReasonId: childInformationForm?.reason?.id,
      otherAttendanceReason: childInformationForm?.otherReason ?? '',
    };
  }

  return {
    id: newGuid(),
    classroomGroupId: childInformationForm?.playgroupId ?? '',
    userId: userId,
    attendanceReasonId: childInformationForm?.reason?.id,
    otherAttendanceReason: childInformationForm?.otherReason ?? '',
    startedAttendance: new Date().toISOString(),
    stoppedAttendance: null,
  };
};

export const mapDocumentDto = (
  userId: string,
  fileName: string,
  statusId: string,
  typeId: string,
  fileType: string,
  file?: string,
  user?: UserDto
): Document => {
  return {
    id: newGuid(),
    userId: userId,
    createdUserId: user?.id ?? '',
    workflowStatusId: statusId,
    documentTypeId: typeId,
    name: fileName,
    fileName: fileName,
    file: file,
    fileType: fileType,
  };
};

export const mapSiteAddressDto = (
  childCareGiverChildInformationForm?: CareGiverChildInformationFormModel,
  siteAddress?: SiteAddressDto
): SiteAddressDto => {
  if (siteAddress) {
    return {
      ...siteAddress,
      provinceId: childCareGiverChildInformationForm?.provinceId,
      addressLine1: childCareGiverChildInformationForm?.streetAddress ?? '',
      addressLine2: childCareGiverChildInformationForm?.suburb ?? '',
      addressLine3: childCareGiverChildInformationForm?.city ?? '',
      postalCode: childCareGiverChildInformationForm?.postalCode ?? '',
      ward: childCareGiverChildInformationForm?.apartmentNumber ?? '',
    };
  }

  return {
    id: newGuid(),
    isActive: true,
    insertedDate: new Date().toISOString(),
    name: '',
    provinceId: childCareGiverChildInformationForm?.provinceId,
    addressLine1: childCareGiverChildInformationForm?.streetAddress ?? '',
    addressLine2: childCareGiverChildInformationForm?.suburb ?? '',
    addressLine3: childCareGiverChildInformationForm?.city ?? '',
    postalCode: childCareGiverChildInformationForm?.postalCode ?? '',
    ward: childCareGiverChildInformationForm?.apartmentNumber ?? '',
  };
};

export const mapCaregiverDto = (
  caregiverInformationForm?: CareGiverInformationFormModel,
  siteAddressInputModel?: SiteAddressDto,
  childCareGiverExtraInformationForm?: CareGiverExtraInformationFormModel,
  childEmergencyContactForm?: ChildEmergencyContactFormModel,
  referencePanelForm?: CareGiverReferencePanelFormModel,
  childCareGiverContributionForm?: CareGiverContributionFormModel,
  caregiver?: CaregiverDto
): CaregiverDto => {
  if (caregiver) {
    return {
      ...caregiver,
      idNumber:
        caregiverInformationForm?.careGiverIdField ??
        caregiverInformationForm?.careGiverPassportField ??
        '',
      firstName: caregiverInformationForm?.firstname ?? '',
      surname: caregiverInformationForm?.surname ?? '',
      relationId: caregiverInformationForm?.relationId,
      siteAddressId: siteAddressInputModel?.id,
      siteAddress: siteAddressInputModel,
      educationId: childCareGiverExtraInformationForm?.highestEducationId,
      grants: childCareGiverExtraInformationForm?.familyGrants,
      emergencyContactFirstName: childEmergencyContactForm?.firstname ?? '',
      emergencyContactSurname: childEmergencyContactForm?.surname ?? '',
      emergencyContactPhoneNumber: childEmergencyContactForm?.phoneNumber ?? '',
      additionalFirstName: childEmergencyContactForm?.custodianFirstname ?? '',
      additionalSurname: childEmergencyContactForm?.custodianSurname ?? '',
      additionalPhoneNumber:
        childEmergencyContactForm?.custodianPhoneNumber ?? '',
      joinReferencePanel: referencePanelForm?.interestedInJoiningPanel ?? false,
      contribution:
        childCareGiverContributionForm?.commitedToContributing ?? false,
    };
  }

  return {
    id: newGuid(),
    isActive: true,
    idNumber:
      caregiverInformationForm?.careGiverIdField ??
      caregiverInformationForm?.careGiverPassportField ??
      '',
    phoneNumber: caregiverInformationForm?.phoneNumber || '',
    firstName: caregiverInformationForm?.firstname ?? '',
    surname: caregiverInformationForm?.surname ?? '',
    insertedDate: new Date().toISOString(),
    relationId: caregiverInformationForm?.relationId,
    grants: childCareGiverExtraInformationForm?.familyGrants,
    siteAddress: siteAddressInputModel,
    educationId: childCareGiverExtraInformationForm?.highestEducationId,
    emergencyContactFirstName: childEmergencyContactForm?.firstname ?? '',
    emergencyContactSurname: childEmergencyContactForm?.surname ?? '',
    emergencyContactPhoneNumber: childEmergencyContactForm?.phoneNumber ?? '',
    additionalFirstName: childEmergencyContactForm?.custodianFirstname ?? '',
    additionalSurname: childEmergencyContactForm?.custodianSurname ?? '',
    additionalPhoneNumber:
      childEmergencyContactForm?.custodianPhoneNumber ?? '',
    joinReferencePanel: referencePanelForm?.interestedInJoiningPanel ?? false,
    contribution:
      childCareGiverContributionForm?.commitedToContributing ?? false,
  };
};

export const mapAddChildCaregiverTokenModelInput = (
  caregiverInformationForm?: CareGiverInformationFormModel,
  childCareGiverExtraInformationForm?: CareGiverExtraInformationFormModel,
  childEmergencyContactForm?: ChildEmergencyContactFormModel,
  referencePanelForm?: CareGiverReferencePanelFormModel,
  childCareGiverContributionForm?: CareGiverContributionFormModel
): AddChildCaregiverTokenModelInput => {
  return {
    idNumber:
      caregiverInformationForm?.careGiverIdField ??
      caregiverInformationForm?.careGiverPassportField ??
      '',
    phoneNumber: caregiverInformationForm?.phoneNumber,
    firstName: caregiverInformationForm?.firstname ?? '',
    surname: caregiverInformationForm?.surname ?? '',
    relationId: caregiverInformationForm?.relationId,
    educationId: childCareGiverExtraInformationForm?.highestEducationId,
    emergencyContactFirstName: childEmergencyContactForm?.firstname ?? '',
    emergencyContactSurname: childEmergencyContactForm?.surname ?? '',
    emergencyContactPhoneNumber: childEmergencyContactForm?.phoneNumber ?? '',
    additionalFirstName: childEmergencyContactForm?.custodianFirstname ?? '',
    additionalSurname: childEmergencyContactForm?.custodianSurname ?? '',
    additionalPhoneNumber:
      childEmergencyContactForm?.custodianPhoneNumber ?? '',
    joinReferencePanel: referencePanelForm?.interestedInJoiningPanel ?? false,
    contribution:
      childCareGiverContributionForm?.commitedToContributing ?? false,
  };
};

export const mapAddChildSiteAddressTokenModelInput = (
  childCareGiverChildInformationForm?: CareGiverChildInformationFormModel
): AddChildSiteAddressTokenModelInput => {
  return {
    name: '',
    provinceId: childCareGiverChildInformationForm?.provinceId,
    addressLine1: childCareGiverChildInformationForm?.streetAddress ?? '',
    addressLine2: childCareGiverChildInformationForm?.suburb ?? '',
    addressLine3: childCareGiverChildInformationForm?.city ?? '',
    postalCode: childCareGiverChildInformationForm?.postalCode ?? '',
    ward: childCareGiverChildInformationForm?.apartmentNumber ?? '',
  };
};

export const mapAddChildLearnerTokenModelInput = (
  childInformationForm?: ChildInformationFormModel
): AddChildLearnerTokenModelInput => {
  return {
    attendanceReasonId: childInformationForm?.reason?.id,
    otherAttendanceReason: childInformationForm?.otherReason ?? '',
  };
};

export const mapAddChildTokenModelInput = (
  userId: string,
  childInformation: ChildInformationFormModel,
  healthInformationForm?: ChildHealthInformationFormModel,
  childExtraInformationForm?: ChildExtraInformationFormModel,
  childWorkflowStatusId?: string
): AddChildTokenModelInput => {
  return {
    dateOfBirth: childInformation.dob,
    firstName: childInformation.firstname,
    surname: childInformation.surname,
    genderId: childExtraInformationForm?.genderId,
    idNumber: childInformation.childIdField,
    isSouthAfricanCitizen: true,
    verifiedByHomeAffairs: false,
    userId: userId,
    raceId: childExtraInformationForm?.race,
    languageId:
      childExtraInformationForm?.homeLanguages &&
      childExtraInformationForm.homeLanguages[0]
        ? childExtraInformationForm.homeLanguages[0]
        : undefined,
    allergies: healthInformationForm?.allergies ?? '',
    disabilities: healthInformationForm?.disabilities ?? '',
    otherHealthConditions: healthInformationForm?.healthConditions ?? '',
    workflowStatusId: childWorkflowStatusId,
  };
};
