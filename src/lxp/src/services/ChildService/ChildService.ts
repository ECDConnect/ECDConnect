import { ChildDto, Config } from '@ecdlink/core';
import {
  AddChildCaregiverTokenModelInput,
  AddChildLearnerTokenModelInput,
  AddChildSiteAddressTokenModelInput,
  AddChildTokenModelInput,
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
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
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
    });

    if (response.status !== 200) {
      throw new Error('Get Children Failed - Server connection error');
    }

    return response.data.data.GetAllChild;
  }

  async updateChild(id: string, input: ChildInput): Promise<boolean> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
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
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
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
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
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
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
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
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query openAccessAddChildDetail($token:String) {
          openAccessAddChildDetail(token:$token) {
            child {
              firstname
              surname
              groupName
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
    child: AddChildTokenModelInput
  ): Promise<string> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation openAccessAddChild($token: String, $caregiver: AddChildCaregiverTokenModelInput, $learner: AddChildLearnerTokenModelInput, $siteAddress: AddChildSiteAddressTokenModelInput, $child: AddChildTokenModelInput) {
          openAccessAddChild(token: $token,caregiver: $caregiver, learner: $learner, siteAddress: $siteAddress, child: $child)
        }
      `,
      variables: {
        token: token,
        caregiver: caregiver,
        learner: learner,
        siteAddress: siteAddress,
        child: child,
      },
    });

    if (response.status !== 200) {
      throw new Error('adding token child failed - Server connection error');
    }
    return response.data.data.openAccessAddChild;
  }
}

export default ChildService;
