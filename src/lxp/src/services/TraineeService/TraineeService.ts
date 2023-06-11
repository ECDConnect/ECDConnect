import { api } from '../axios.helper';
import { Config, TraineeDto } from '@ecdlink/core';
import {
  CmsVisitDataInputModelInput,
  PractitionerTimeline,
} from '@ecdlink/graphql';

class TraineeService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getTraineeByUserId(userId: string): Promise<TraineeDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query traineeByUserId($userId: String) {
        traineeByUserId(userId: $userId) {
          id
          startDate
          traineeConvertedDate
          consolidationMeetingDate
          childrenAddedDate
          linkedPrincipalHierarchy
          progress
          programmeType
          siteVisitsCompleted
          childProgressTraining
          user {
              firstName
              surname
              email
              isSouthAfricanCitizen
              verifiedByHomeAffairs
          },
          practitioner {
              startDate
          }
        }
      }
      `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Trainee by id Failed - Server connection error');
    }

    return response.data.data.traineeByUserId;
  }

  async getTraineeTimeline(userId: string): Promise<PractitionerTimeline> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetOnBoardTraineeTimeline($userId: String) {
        onBoardTraineeTimeline(userId: $userId) {
            starterLicenseStatus
            starterLicenseDate
            starterLicenseColor
            smartSpaceLicenseStatus
            smartSpaceLicenseDate
            smartSpaceLicenseColor
            consolidationMeetingStatus
            consolidationMeetingColor
            consolidationMeetingDate
            consolidationDeadlineDate
            consolidationMeetingDateScheduled
            smartSpaceChecklistStatus
            smartSpaceChecklistColor
            smartSpaceChecklistDate
            smartSpaceChecklistDeadlineDate
            communitySupportStatus
            communitySupportColor
            communitySupportDate
            communitySupportDeadlineDate
            threeChildrenRegisteredStatus
            threeChildrenRegisteredColor
            threeChildrenRegisteredDate
            threeChildrenRegisteredDeadlineDate
            sSCoachVisitStatus
            sSCoachVisitColor
            sSCoachVisitDate
            sSCoachVisitDeadlineDate
            signFranchiseeAgreementStatus
            signFranchiseeAgreementColor
            signFranchiseeAgreementDate
            signFranchiseeAgreementDeadlineDate
            signStartUpSupportAgreementStatus
            signStartUpSupportAgreementColor
            signStartUpSupportAgreementDate
            signStartUpSupportAgreementDeadlineDate
            traineeVisits {
                id
                plannedVisitDate
                visitType {
                    name
                    description
                }
            }
        }        
    }
          `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Trainee onboard timeline Failed - Server connection error'
      );
    }

    return response.data.data.onBoardTraineeTimeline;
  }

  async updateCommunitySupport(
    userId: string,
    haveCommunitySupport: boolean
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addVisitData: boolean };
      errors?: {};
    }>(``, {
      query: `
      mutation UpdateCommunitySupport($userId: String, $haveCommunitySupport: Bool ) {
        updateCommunitySupport(userId: $userId, haveCommunitySupport: $haveCommunitySupport) {
            id 
        }        
    }
      `,
      variables: {
        userId,
        haveCommunitySupport,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Add update community support failed - Server connection error'
      );
    }

    return true;
  }

  async addVisitData(input: CmsVisitDataInputModelInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addVisitData: boolean };
      errors?: {};
    }>(``, {
      query: `
      mutation AddVisitData($input: CMSVisitDataInputModelInput) {
        addVisitData(input: $input) {
        }
    }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Add update community support failed - Server connection error'
      );
    }

    return true;
  }

  async scheduleConsolidationMeetingDate(
    userId: string,
    scheduledDate: Date
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addVisitData: boolean };
      errors?: {};
    }>(``, {
      query: `
      mutation ScheduleConsolidationMeetingDate($userId: String, $scheduledDate: DateTime ) {
        scheduleConsolidationMeetingDate(userId: $userId, scheduledDate: $scheduledDate) {
            id 
        }        
    }
      `,
      variables: {
        userId,
        scheduledDate,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Add update community support failed - Server connection error'
      );
    }

    return true;
  }
}

export default TraineeService;
