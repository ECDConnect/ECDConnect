import { api } from '../axios.helper';
import {
  Config,
  HealthCareWorkerDto,
  UserPointsAcitivtyDto,
} from '@ecdlink/core';
import {
  TeamStandingModel,
  UpdateHealthCareWorkerInputModelInput,
  UpdateHealthCareWorkerTabsInputModelInput,
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
          welcomeMessage
          shareContactInfo
          isNewAtClinic
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

  async getHealthCareWorkerPoints(
    userId: string,
    startDate: Date,
    endDate?: Date
  ): Promise<UserPointsAcitivtyDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { pointsForHealthCareWorker: UserPointsAcitivtyDto[] };
      errors?: {};
    }>(``, {
      query: `
      query getPointsForHealthCareWorker($userId: UUID!, $startDate: DateTime!, $endDate: DateTime) {
        pointsForHealthCareWorker(userId: $userId, startDate: $startDate, endDate: $endDate) {
          pointsActivityId
          month
          year
          pointsTotal
          timesScored
          activityName
          todoDescription
          maxMonthlyPoints
        }
      }
      `,
      variables: {
        userId: userId,
        startDate: startDate,
        endDate: endDate,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'pointsForHealthCareWorker Failed - Server connection error'
      );
    }

    return response.data.data.pointsForHealthCareWorker;
  }

  async getHealthCareWorkerTeamStanding(
    userId: string
  ): Promise<TeamStandingModel> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { healthCareWorkerTeamStanding: TeamStandingModel };
      errors?: {};
    }>(``, {
      query: `query GetHealthCareWorkerTeamStanding($userId: UUID!) {
          healthCareWorkerTeamStanding(userId: $userId) {
            percentageMembersWithFewerPointsForCurrentMonth
            percentageMembersWithFewerPointsForCurrentYear
            percentageMembersWithMorePointsForCurrentMonth
            percentageMembersWithMorePointsForCurrentYear
          }
        }`,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get standing for user Failed - Server connection error');
    }

    return response.data.data.healthCareWorkerTeamStanding;
  }

  async updateHealthCareWorker(
    userId: string,
    input: UpdateHealthCareWorkerInputModelInput
  ): Promise<HealthCareWorkerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `mutation updateHealthCareWorker(
        $userId: String,
        $input: UpdateHealthCareWorkerInputModelInput
      ) {
        updateHealthCareWorker(
          userId: $userId,
          input: $input
        ) {
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
          welcomeMessage
          shareContactInfo
          isNewAtClinic
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
    input: UpdateHealthCareWorkerTabsInputModelInput,
    userId: string
  ): Promise<HealthCareWorkerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateHealthCareWorkerTabs: HealthCareWorkerDto };
    }>(``, {
      query: `mutation UpdateHealthCareWorkerTabs($input: UpdateHealthCareWorkerTabsInputModelInput, $userId: String) {
          updateHealthCareWorkerTabs(input: $input, userId: $userId) {
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
            welcomeMessage
            shareContactInfo
            isNewAtClinic
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

  async updateHealthCareWorkerWelcomeMessage(
    healthcareWorkerId: string,
    welcomeMessage: string,
    shareContactInfo: boolean
  ): Promise<HealthCareWorkerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateHealthCareWorkerWelcomeMessage: HealthCareWorkerDto };
    }>(``, {
      query: `mutation UpdateHealthCareWorkerWelcomeMessage($healthcareWorkerId: UUID!, $welcomeMessage: String, $shareContactInfo: Boolean!) {
          updateHealthCareWorkerWelcomeMessage(healthcareWorkerId: $healthcareWorkerId, welcomeMessage: $welcomeMessage, shareContactInfo: $shareContactInfo) {
              welcomeMessage
              shareContactInfo
              isNewAtClinic
          }
        }`,
      variables: {
        healthcareWorkerId: healthcareWorkerId,
        welcomeMessage: welcomeMessage,
        shareContactInfo: shareContactInfo,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'updateHealthCareWorkerWelcomeMessage failed - Server connection error'
      );
    }

    return response.data.data.updateHealthCareWorkerWelcomeMessage;
  }
}

export default HealthCareWorkerService;
