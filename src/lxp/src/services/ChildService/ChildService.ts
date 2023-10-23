import { ChildDto, Config } from '@ecdlink/core';
import {
  AddChildCaregiverTokenModelInput,
  AddChildLearnerTokenModelInput,
  AddChildRegistrationTokenModelInput,
  AddChildSiteAddressTokenModelInput,
  AddChildTokenModelInput,
  AddChildUserConsentTokenModelInput,
  ChildInput,
} from '@ecdlink/graphql';
import { ChildRegistrationDetails } from '../../pages/child/caregiver-child-registration/caregiver-child-registration.types';
import { api } from '../axios.helper';
class ChildService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getChildren(): Promise<ChildDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query {
          GetAllChild {
            id
            caregiverId
            workflowStatusId
            insertedDate
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
            languageId
            allergies
            disabilities
            otherHealthConditions
            isActive
            insertedBy
          }
        }
      `,
    });

    if (response.status !== 200) {
      throw new Error('Get Children Failed - Server connection error');
    }

    return response.data.data.GetAllChild;
  }

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

  async getChildrenForPractitioner(userId: string): Promise<ChildDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
        query allChildrenForPractitioner($userId: String) {
          allChildrenForPractitioner(userId: $userId) {
            id
            caregiverId
            workflowStatusId
            insertedDate
            userId
            user {
              id
              firstName
              surname
              email
              genderId
              dateOfBirth
              profileImageUrl
              isActive
              isSouthAfricanCitizen
              verifiedByHomeAffairs
            }
            languageId
            allergies
            disabilities
            otherHealthConditions
            isActive
          }
        }    
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Children For Practitioner Failed - Server connection error'
      );
    }

    return response.data.data.allChildrenForPractitioner;
  }

  async updateChild(id: string, input: ChildInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateChild($input: ChildInput, $id: UUID) {
          updateChild(input: $input, id: $id){
            id
          }
        }
      `,
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating child failed - Server connection error');
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
  ): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation generateCaregiverChildToken($firstname: String, $surname: String, $classgroupId: UUID!) {
          generateCaregiverChildToken(firstname: $firstname,surname: $surname, classgroupId: $classgroupId)
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
  ): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation refreshCaregiverChildToken($childId: UUID!,$classgroupId: UUID!) {
          refreshCaregiverChildToken(childId: $childId, classgroupId: $classgroupId)
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
              groupFeeAmount
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
    learner: AddChildLearnerTokenModelInput,
    siteAddress: AddChildSiteAddressTokenModelInput,
    child: AddChildTokenModelInput,
    registration?: AddChildRegistrationTokenModelInput,
    consent?: AddChildUserConsentTokenModelInput
  ): Promise<string> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation openAccessAddChild($token: String, 
          $caregiver: AddChildCaregiverTokenModelInput, 
          $learner: AddChildLearnerTokenModelInput, 
          $siteAddress: AddChildSiteAddressTokenModelInput, 
          $child: AddChildTokenModelInput,
          $registration: AddChildRegistrationTokenModelInput,
          $consent: AddChildUserConsentTokenModelInput) {
            openAccessAddChild(token: $token,caregiver: $caregiver, learner: $learner, siteAddress: $siteAddress, child: $child, registration: $registration, consent: $consent)
        }
      `,
      variables: {
        token: token,
        caregiver: caregiver,
        learner: learner,
        siteAddress: siteAddress,
        child: child,
        registration: registration,
        consent: consent,
      },
    });

    if (response.status !== 200) {
      throw new Error('adding token child failed - Server connection error');
    }
    return response.data.data.openAccessAddChild;
  }

  async childCreatedByDetail(
    practitionerId: string,
    firstName: string,
    surname: string
  ): Promise<ChildDto[]> {
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

    if (response.status !== 200) {
      throw new Error(
        'Get Children For Practitioner Failed - Server connection error'
      );
    }

    return response.data.data.childCreatedByDetail;
  }
}

export default ChildService;
