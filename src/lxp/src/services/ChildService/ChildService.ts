import { ChildDto, Config } from '@ecdlink/core';
import {
  AddChildCaregiverTokenModelInput,
  AddChildRegistrationTokenModelInput,
  AddChildSiteAddressTokenModelInput,
  AddChildTokenModelInput,
  AddChildUserConsentTokenModelInput,
  ChildCreatedByDetail,
  ChildInput,
  UpdateChildAndCaregiverInput,
} from '@ecdlink/graphql';
import { ChildRegistrationDetails } from '../../pages/child/caregiver-child-registration/caregiver-child-registration.types';
import { api } from '../axios.helper';
import { ChildRegistrationDto } from '@/models/child/child-registration.dto';
class ChildService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getChildrenForClassroomGroup(
    classroomGroupId: string
  ): Promise<ChildDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { childrenForClassroomGroup: ChildDto[] };
      errors?: {};
    }>(``, {
      query: `query($classRoomGroupId: UUID!) {
           childrenForClassroomGroup(classRoomGroupId: $classRoomGroupId) {
            id
            workflowStatusId
            insertedDate
            languageId
            allergies
            disabilities
            otherHealthConditions
            isActive
            insertedBy
            userId
            user {
              id
              firstName
              surname
              fullName
              email
              genderId
              dateOfBirth
              profileImageUrl
              isActive
              isSouthAfricanCitizen
              verifiedByHomeAffairs
            }
            caregiverId 
            caregiver {
              id
              phoneNumber
              idNumber
              firstName
              surname
              fullName  
              siteAddressId          
              siteAddress {
                id
                provinceId
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
                isActive
              }
              relationId
              educationId
              emergencyContactFirstName
              emergencyContactSurname
              emergencyContactPhoneNumber
              additionalFirstName
              additionalSurname
              additionalPhoneNumber
              joinReferencePanel
              contribution
              grants {
                id
                description
              }
              isActive
              isAllowedCustody
            }
          }
        }
      `,
      variables: {
        classRoomGroupId: classroomGroupId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Children Failed - Server connection error');
    }

    return response.data.data.childrenForClassroomGroup;
  }

  async getChildren(): Promise<ChildDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllChild: ChildDto[] };
      errors?: {};
    }>(``, {
      query: `query($isActive: Boolean = true) {
          GetAllChild(where: { isActive: { eq: $isActive } }) {
            id
            workflowStatusId
            insertedDate
            languageId
            allergies
            disabilities
            otherHealthConditions
            isActive
            insertedBy
            userId
            user {
              id
              firstName
              surname
              fullName
              email
              genderId
              dateOfBirth
              profileImageUrl
              isActive
              isSouthAfricanCitizen
              verifiedByHomeAffairs
            }
            caregiverId 
            caregiver {
              id
              phoneNumber
              idNumber
              firstName
              surname
              fullName  
              siteAddressId          
              siteAddress {
                id
                provinceId
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
                isActive
              }
              relationId
              educationId
              emergencyContactFirstName
              emergencyContactSurname
              emergencyContactPhoneNumber
              additionalFirstName
              additionalSurname
              additionalPhoneNumber
              joinReferencePanel
              contribution
              grants {
                id
                description
              }
              isActive
              isAllowedCustody
            }
          }
        }
      `,
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Children Failed - Server connection error');
    }

    return response.data.data.GetAllChild;
  }

  // Will this still be needed?
  async getChildrenForCoach(userId: string): Promise<ChildDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
        query allChildrenForCoach($userId: String) {
          allChildrenForCoach(userId: $userId) {
            id
            userId
          }
        }    
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Children For Coach Failed - Server connection error'
      );
    }

    return response.data.data.allChildrenForCoach;
  }

  async updateChild(input: UpdateChildAndCaregiverInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateChildAndCaregiver: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation UpdateChildAndCaregiver($input: UpdateChildAndCaregiverInput) {
          updateChildAndCaregiver(input: $input){
          }
        }
      `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Updating child failed - Server connection error');
    }

    return true;
  }

  async calculateChildrenRegistrationRemoval(userId: string): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation CalculateChildrenRegistrationRemoval($userId: String) {
          calculateChildrenRegistrationRemoval(userId: $userId){
          }
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Calculate Children Registration Removal failed - Server connection error'
      );
    }

    return true;
  }

  async createChild(input: ChildInput): Promise<ChildDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation createChild($input: ChildInput) {
          createChild(input: $input){
            id
          }
        }
      `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating child failed - Server connection error');
    }

    return response.data.data.createChild;
  }

  async generateCaregiverChildToken(
    firstname: string,
    surname: string,
    classgroupId: string
  ): Promise<ChildRegistrationDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation generateCaregiverChildToken($firstname: String, $surname: String, $classgroupId: UUID!) {
          generateCaregiverChildToken(firstname: $firstname,surname: $surname, classgroupId: $classgroupId) {
            childId
            childUserId
            addedByUserId
            classroomGroupId
            caregiverRegistrationUrl
          }
        }
      `,
      variables: {
        firstname: firstname,
        surname: surname,
        classgroupId: classgroupId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'adding caregiver child registration token - Server connection error'
      );
    }

    return response.data.data.generateCaregiverChildToken;
  }

  async refreshCaregiverChildToken(
    childId: string,
    classgroupId: string
  ): Promise<ChildRegistrationDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation refreshCaregiverChildToken($childId: UUID!,$classgroupId: UUID!) {
          refreshCaregiverChildToken(childId: $childId, classgroupId: $classgroupId) {
            childId
            childUserId
            addedByUserId
            classroomGroupId
            caregiverRegistrationUrl
          }
        }
      `,
      variables: {
        childId: childId,
        classgroupId: classgroupId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'refreshing caregiver child registration token - Server connection error'
      );
    }

    return response.data.data.refreshCaregiverChildToken;
  }

  // How is this used?
  async openAccessAddChildDetail(
    token: string
  ): Promise<ChildRegistrationDetails> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query openAccessAddChildDetail($token:String) {
          openAccessAddChildDetail(token:$token) {
            child {
              firstname
              surname
              groupName
              userId
            }
            practitoner {
              firstname
              surname
              phoneNumber
            }
            accessToken
          }
        }
      `,
      variables: {
        token: token,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'refreshing caregiver child registration token - Server connection error'
      );
    }

    return response.data.data.openAccessAddChildDetail;
  }

  async openAccessAddChild(
    token: string,
    caregiver: AddChildCaregiverTokenModelInput,
    siteAddress: Omit<AddChildSiteAddressTokenModelInput, 'provinceId'>,
    child: AddChildTokenModelInput,
    registration?: AddChildRegistrationTokenModelInput,
    consent?: Omit<
      AddChildUserConsentTokenModelInput,
      | 'commitmentAgreementAccepted'
      | 'consentAgreementAccepted'
      | 'indemnityAgreementAccepted'
    >
  ): Promise<string> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation openAccessAddChild($token: String, 
          $caregiver: AddChildCaregiverTokenModelInput, 
          $siteAddress: AddChildSiteAddressTokenModelInput, 
          $child: AddChildTokenModelInput,
          $registration: AddChildRegistrationTokenModelInput,
          $consent: AddChildUserConsentTokenModelInput) {
            openAccessAddChild(token: $token,caregiver: $caregiver, siteAddress: $siteAddress, child: $child, registration: $registration, consent: $consent)
        }
      `,
      variables: {
        token: token,
        caregiver: caregiver,
        siteAddress: siteAddress,
        child: child,
        registration: registration,
        consent: consent,
      },
    });

    if (
      response.status !== 200 ||
      response.data?.data?.openAccessAddChild === false
    ) {
      throw new Error('adding token child failed - Server connection error');
    }
    return response.data.data.openAccessAddChild;
  }

  async findCreatedChild(
    practitionerId: string,
    firstName: string,
    surname: string
  ): Promise<ChildCreatedByDetail> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
      query childCreatedByDetail($firstName: String, $surname: String, $practitionerId: String) {
        childCreatedByDetail(firstName: $firstName, surname: $surname, practitionerId: $practitionerId) {
            fullName childUserId createdByName createdById createdByDate practitionerName dateOfBirth profileImageUrl programmeName practitionerUserId
        }
      }
      `,
      variables: {
        practitionerId,
        firstName,
        surname,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Get Children For Practitioner Failed - Server connection error'
      );
    }

    return response.data.data.childCreatedByDetail;
  }
}

export default ChildService;
