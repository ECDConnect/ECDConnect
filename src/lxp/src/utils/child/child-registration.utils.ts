import {
  CaregiverDto,
  ChildDto,
  Document,
  LearnerDto,
  SiteAddressDto,
  UserDto,
  getBase64FromBaseString,
} from '@ecdlink/core';
import {
  AddChildCaregiverTokenModelInput,
  AddChildSiteAddressTokenModelInput,
  AddChildTokenModelInput,
  AddChildRegistrationTokenModelInput,
  AddChildUserConsentTokenModelInput,
} from '@ecdlink/graphql';
import { CareGiverChildInformationFormModel } from '@schemas/child/child-registration/care-giver-child-information-form';
import { CareGiverContributionFormModel } from '@schemas/child/child-registration/care-giver-contribution-form';
import { CareGiverExtraInformationFormModel } from '@schemas/child/child-registration/care-giver-extra-information';
import { CareGiverInformationFormModel } from '@schemas/child/child-registration/care-giver-information-form';
import { CareGiverReferencePanelFormModel } from '@schemas/child/child-registration/care-giver-reference-panel-form';
import { ChildEmergencyContactFormModel } from '@schemas/child/child-registration/child-emergency-contact-form';
import { ChildExtraInformationFormModel } from '@schemas/child/child-registration/child-extra-information-form';
import { ChildHealthInformationFormModel } from '@schemas/child/child-registration/child-health-information-form';
import { ChildRegistrationFormModel } from '@schemas/child/child-registration/child-registration-form';
import { ChildInformationFormModel } from '@schemas/child/child-registration/child-information-form';
import { newGuid } from '../common/uuid.utils';
import { ChildBirthCertificateFormModel } from '@/schemas/child/child-registration/child-birth-certificate-form';

export const mapChildUserDto = (
  childInformationForm: ChildInformationFormModel,
  childExtraInformationForm?: ChildExtraInformationFormModel,
  user?: UserDto
): UserDto => {
  const dateOfBirth = new Date(
    childInformationForm.dobYear ?? 0,
    childInformationForm.dobMonth - 1 ?? 0,
    childInformationForm.dobDay ?? 0,
    new Date().getHours()
  );
  if (user) {
    const { email, fullName, phoneNumber, insertedDate, ...restUser } = user;
    return {
      ...restUser,
      idNumber: childInformationForm.childIdField || '',
      firstName: childInformationForm.firstname,
      surname: childInformationForm.surname,
      dateOfBirth: dateOfBirth.toISOString() || '',
      genderId: childExtraInformationForm?.genderId,
      raceId: undefined,
    };
  }

  return {
    id: newGuid(),
    isSouthAfricanCitizen: true,
    idNumber: childInformationForm.childIdField ?? '',
    verifiedByHomeAffairs: false,
    dateOfBirth: dateOfBirth.toISOString(),
    genderId: childExtraInformationForm?.genderId,
    raceId: '',
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
    const {
      insertedDate,
      insertedBy,
      userId,
      caregiverId,
      // @ts-ignore
      synced,
      ...restChild
    } = child;
    return {
      ...restChild,
      // TODO: update language field to be an array
      languageId:
        childExtraInformationForm?.homeLanguages &&
        childExtraInformationForm.homeLanguages[0]
          ? childExtraInformationForm.homeLanguages[0]
          : undefined,
      allergies: healthInformationForm?.allergies ?? '',
      disabilities: healthInformationForm?.disabilities ?? '',
      otherHealthConditions: healthInformationForm?.healthConditions ?? '',
      workflowStatusId: childStatusId,
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
    };
  }

  return {
    id: newGuid(),
    classroomGroupId: childInformationForm?.playgroupId ?? '',
    userId: userId,
    attendanceReasonId: '',
    otherAttendanceReason: '',
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
      addressLine1: childCareGiverChildInformationForm?.streetAddress ?? '',
      postalCode: childCareGiverChildInformationForm?.postalCode ?? '',
    };
  }

  return {
    id: newGuid(),
    isActive: true,
    insertedDate: new Date().toISOString(),
    name: '',
    addressLine1: childCareGiverChildInformationForm?.streetAddress ?? '',
    postalCode: childCareGiverChildInformationForm?.postalCode ?? '',
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
    const { fullName, siteAddressId, isActive, grants, ...restCaregiver } =
      caregiver;
    return {
      ...restCaregiver,
      // idNumber:
      //   caregiverInformationForm?.careGiverIdField ??
      //   caregiverInformationForm?.careGiverPassportField ??
      //   '',
      firstName: caregiverInformationForm?.firstname ?? '',
      surname: caregiverInformationForm?.surname ?? '',
      relationId: caregiverInformationForm?.relationId,
      // siteAddressId: siteAddressInputModel?.id,
      siteAddress: siteAddressInputModel,
      educationId: childCareGiverExtraInformationForm?.highestEducationId,
      // @ts-ignore
      grantIds: childCareGiverExtraInformationForm?.familyGrants,
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
    // idNumber:
    //   caregiverInformationForm?.careGiverIdField ??
    //   caregiverInformationForm?.careGiverPassportField ??
    //   '',
    phoneNumber: caregiverInformationForm?.phoneNumber || '',
    firstName: caregiverInformationForm?.firstname ?? '',
    surname: caregiverInformationForm?.surname ?? '',
    relationId: caregiverInformationForm?.relationId,
    // @ts-ignore
    grantIds: childCareGiverExtraInformationForm?.familyGrants,
    siteAddress: siteAddressInputModel,
    educationId: childCareGiverExtraInformationForm?.highestEducationId,
    emergencyContactFirstName: childEmergencyContactForm?.firstname ?? '',
    emergencyContactSurname: childEmergencyContactForm?.surname ?? '',
    emergencyContactPhoneNumber: childEmergencyContactForm?.phoneNumber ?? '',
    isAllowedCustody: childEmergencyContactForm?.isAllowedCustody ?? false,
    additionalFirstName: childEmergencyContactForm?.isAllowedCustody
      ? childEmergencyContactForm.firstname
      : childEmergencyContactForm?.custodianFirstname ?? '',
    additionalSurname: childEmergencyContactForm?.isAllowedCustody
      ? childEmergencyContactForm.surname
      : childEmergencyContactForm?.custodianSurname ?? '',
    additionalPhoneNumber: childEmergencyContactForm?.isAllowedCustody
      ? childEmergencyContactForm.phoneNumber
      : childEmergencyContactForm?.custodianPhoneNumber ?? '',
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
    // idNumber:
    //   caregiverInformationForm?.careGiverIdField ??
    //   caregiverInformationForm?.careGiverPassportField ??
    //   '',
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
): Omit<AddChildSiteAddressTokenModelInput, 'provinceId'> => {
  return {
    name: '',
    addressLine1: childCareGiverChildInformationForm?.streetAddress ?? '',
    postalCode: childCareGiverChildInformationForm?.postalCode ?? '',
  };
};

export const mapAddChildRegistrationTokenModelInput = (
  userId: string,
  fileType: string,
  childBirthCertificateForm: ChildBirthCertificateFormModel
): AddChildRegistrationTokenModelInput => {
  const splitString = getBase64FromBaseString(
    childBirthCertificateForm?.birthCertificateImage
  );

  return {
    file: splitString,
    fileName: 'F4-registrationform.png',
    fileType: fileType,
    userId: userId,
  };
};

export const mapAddChildUserConsentTokenModelInput = (
  userId: string,
  childRegistrationFormModel?: ChildRegistrationFormModel
  // TODO: update this interface because now only childPhotoConsentAccepted and personalInformationAgreementAccepted are used / remove from backend
): Omit<
  AddChildUserConsentTokenModelInput,
  | 'commitmentAgreementAccepted'
  | 'consentAgreementAccepted'
  | 'indemnityAgreementAccepted'
> => {
  return {
    userId: userId,
    childPhotoConsentAccepted:
      childRegistrationFormModel?.childPhotoConsentAccepted || false,
    personalInformationAgreementAccepted:
      childRegistrationFormModel?.personalInformationAgreementAccepted || false,
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
    raceId: null,
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
