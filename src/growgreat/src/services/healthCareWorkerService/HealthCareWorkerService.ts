import { api } from '../axios.helper';
import { Config, HealthCareWorkerDto } from '@ecdlink/core';
import {
  HealthCareWorkerInputModelInput,
  MutationUpdateHealthCareWorkerArgs,
} from '@ecdlink/graphql';

class HealthCareWorkerService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getHealthCareWorkerByUserId(
    userId: string
  ): Promise<HealthCareWorkerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query getHealthCareWorkerByUserId($userId: String) {
        healthCareWorkerByUserId(userId: $userId) {
          user {
              id
              email
              isSouthAfricanCitizen
              verifiedByHomeAffairs
              dateOfBirth
              idNumber
              firstName
              surname
              contactPreference
              genderId
              phoneNumber
              profileImageUrl
          }          
          id
          isRegistered
          languageId
          clickedDashboardClientsTab
          clickedDashboardVisitsTab
          clickedDashboardHighlightsTab
          clickedVisitTab
          clickedProgressTab
          clickedReferralsTab
          clickedContactTab    
          clinicId      
        }
      }
      `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'getHealthCareWorkerByUserId Failed - Server connection error'
      );
    }

    return response.data.data.healthCareWorkerByUserId;
  }

  async updateHealthCareWorker(
    userId: string,
    input: MutationUpdateHealthCareWorkerArgs
  ): Promise<HealthCareWorkerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `mutation updateHealthCareWorker(
        $userId: String,
        $input: HealthCareWorkerModelInput
      ) {
        updateHealthCareWorker(
          userId: $userId,
          input: $input
        ) {
          user {
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
            emailConfirmed
            phoneNumberConfirmed
            twoFactorEnabled
            isActive
            lastSeen
          }          
          id
          isRegistered
          languageId
          clickedDashboardClientsTab
          clickedDashboardVisitsTab
          clickedDashboardHighlightsTab
          clickedVisitTab
          clickedProgressTab
          clickedReferralsTab
          clickedContactTab    
          clinicId      
        }
      }`,
      variables: {
        userId,
        input,
      },
    });
    if (response.status !== 200) {
      throw new Error(
        'updateHealthCareWorker Failed - Server connection error'
      );
    }

    return response.data.data.updateHealthCareWorker;
  }

  async updateHealthCareWorkerTabs(
    input: HealthCareWorkerInputModelInput,
    userId: string
  ): Promise<HealthCareWorkerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateHealthCareWorkerTabs: HealthCareWorkerDto };
    }>(``, {
      query: `mutation UpdateHealthCareWorkerTabs($input: HealthCareWorkerModelInput, $userId: String) {
          updateHealthCareWorkerTabs(input: $input, userId: $userId) {
            user {
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
              emailConfirmed
              phoneNumberConfirmed
              twoFactorEnabled
              isActive
              lastSeen
            }          
            id
            isRegistered
            languageId
            clickedDashboardClientsTab
            clickedDashboardVisitsTab
            clickedDashboardHighlightsTab
            clickedVisitTab
            clickedProgressTab
            clickedReferralsTab
            clickedContactTab    
            clinicId      
          }
        }`,
      variables: {
        input,
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'updateHealthCareWorkerTabs failed - Server connection error'
      );
    }

    return response.data.data.updateHealthCareWorkerTabs;
  }
}

export default HealthCareWorkerService;
