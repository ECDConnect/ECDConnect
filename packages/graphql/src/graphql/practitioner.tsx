import { gql } from '@apollo/client';

export const GetAllPractitioner = gql`
  {
    GetAllPractitioner {
      id
      userId
      user {
        firstName
        surname
        email
        isActive
        idNumber
      }
      siteAddressId
      siteAddress {
        id
        province {
          id
          description
        }
        name
        addressLine1
        addressLine2
        addressLine3
        postalCode
        ward
      }
      attendanceRegisterLink
      maxChildren
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      isPrincipal
      isTrainee
      isFundaAppAdmin
      coachHierarchy
      principalHierarchy
      NotInvitedYet
    }
  }
`;

export const GetPractitionerById = gql`
  query GetPractitionerById($id: UUID) {
    GetPractitionerById(id: $id) {
      id
      user {
        firstName
        surname
        email
      }
      siteAddress {
        id
        province {
          id
          description
        }
        name
        addressLine1
        addressLine2
        addressLine3
        postalCode
        ward
      }
      attendanceRegisterLink
      maxChildren
      consentForPhoto
      parentFees
      languageUsedInGroups
      startDate
      isPrincipal
      isTrainee
      isFundaAppAdmin
      coachHierarchy
      principalHierarchy
      NotInvitedYet
    }
  }
`;

export const GetPractitionerByIdNumber = gql`
  query GetPractitionerByIdNumber($idNumber: String) {
    GetPractitionerByIdNumber(idNumber: $idNumber) {
      id
      userName
      email
      isSouthAfricanCitizen
      verifiedByHomeAffairs
      dateOfBirth
      idNumber
      firstName
      surname
      fullName
      contactPreference
      genderId
      phoneNumber
      profileImageUrl
      roles {
        id
        name
      }
      nickFirstName
      nickSurname
      nickFullName
      franchisorObjectData {
        id
        userId
        siteAddressId
        areaOfOperation
        secondaryAreaOfOperation
        startDate
        siteAddress {
          name
          addressLine1
          addressLine2
          addressLine3
          postalCode
          ward
          province {
            description
          }
        }
      }
      coachObjectData {
        id
        userId
        areaOfOperation
        secondaryAreaOfOperation
        startDate
        siteAddress {
          name
          addressLine1
          addressLine2
          addressLine3
          postalCode
          ward
          province {
            description
          }
        }
      }
      principalObjectData {
        id
        userId
        attendanceRegisterLink
        maxChildren
        parentFees
        consentForPhoto
        languageUsedInGroups
        startDate
        siteAddress {
          name
          addressLine1
          addressLine2
          addressLine3
          postalCode
          ward
          province {
            description
          }
        }
        documents {
          id
          reference
          documentType {
            name
            description
            enumId
          }
        }
        coachHierarchy
        principalHierarchy
        isPrincipal
        isTrainee
        isFundaAppAdmin
        notInvitedYet
        signature
      }
      practitionerObjectData {
        id
        userId
        attendanceRegisterLink
        maxChildren
        parentFees
        consentForPhoto
        languageUsedInGroups
        startDate
        siteAddress {
          name
          addressLine1
          addressLine2
          addressLine3
          postalCode
          ward
          province {
            description
          }
        }
        documents {
          id
          reference
          documentType {
            name
            description
            enumId
          }
        }
        coachHierarchy
        principalHierarchy
        isPrincipal
        isTrainee
        isFundaAppAdmin
        notInvitedYet
        signature
      }
      childObjectData {
        id
        userId
        caregiver {
          firstName
          surname
        }
        allergies
        disabilities
        otherHealthConditions
        documents {
          id
          reference
          documentType {
            name
            description
            enumId
          }
        }
      }
    }
  }
`;

export const CreatePractitioner = gql`
  mutation createPractitioner($input: PractitionerInput) {
    createPractitioner(input: $input) {
      id
    }
  }
`;

export const UpdatePractitioner = gql`
  mutation updatePractitioner($input: PractitionerInput, $id: UUID) {
    updatePractitioner(input: $input, id: $id) {
      id
    }
  }
`;

export const DeletePractitioner = gql`
  mutation deletePractitioner($id: UUID!) {
    deletePractitioner(id: $id)
  }
`;

export const practitionerImport = gql`
  mutation practitionerImport($file: String) {
    practitionerImport(file: $file)
  }
`;

export const practitionerExcelTemplateGenerator = gql`
  query {
    practitionerExcelTemplateGenerator {
      base64File
      fileType
      fileName
      extension
    }
  }
`;
