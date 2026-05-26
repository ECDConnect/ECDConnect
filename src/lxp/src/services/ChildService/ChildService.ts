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
      id: 'childrenForClassroomGroup',
      variables: {
        classRoomGroupId: classroomGroupId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Children Failed - Server connection error');
    }

    return response.data.data.childrenForClassroomGroup;
  }

  async getChildrenForClassroom(userId: string): Promise<ChildDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { childrenForClassroom: ChildDto[] };
      errors?: {};
    }>(``, {
      id: 'childrenForClassroom',
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Children Failed - Server connection error');
    }

    return response.data.data.childrenForClassroom;
  }

  async getChildById(childId: string): Promise<ChildDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetChildById: ChildDto };
      errors?: {};
    }>(``, {
      id: 'GetChildById',
      variables: {
        id: childId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('getChildById Failed - Server connection error');
    }

    return response.data.data.GetChildById;
  }

  async getChildren(): Promise<ChildDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllChild: ChildDto[] };
      errors?: {};
    }>(``, {
      id: 'GetAllChild',
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Children Failed - Server connection error');
    }

    return response.data.data.GetAllChild;
  }

  // Will this still be needed?
  async getChildrenForCoach(): Promise<ChildDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      id: 'allChildrenForCoach',
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
      id: 'UpdateChildAndCaregiver',
      variables: {
        input: input,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Updating child failed - Server connection error');
    }

    return true;
  }

  async removeChild(input: UpdateChildAndCaregiverInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { removeChild: boolean };
      errors?: {};
    }>(``, {
      id: 'RemoveChild',
      variables: {
        input: input,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Removing child failed - Server connection error');
    }

    return true;
  }

  async calculateChildrenRegistrationRemoval(userId: string): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'CalculateChildrenRegistrationRemoval',
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
      id: 'createChild',
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
      id: 'generateCaregiverChildToken',
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
      id: 'refreshCaregiverChildToken',
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
      id: 'openAccessAddChildDetail',
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
      id: 'openAccessAddChild',
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
      id: 'childCreatedByDetail',
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
