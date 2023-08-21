import { api } from '../axios.helper';
import { Config, TraineeDto } from '@ecdlink/core';
import {
  CmsVisitDataInputModelInput,
  SsChecklistVisitModelInput,
  SupportVisitModelInput,
  TraineeAddressModelInput,
  TraineeOnBoardTimeline,
  UserConsentInput,
  Visit,
  VisitData,
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

  async getTraineeTimeline(userId: string): Promise<TraineeOnBoardTimeline> {
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
                eventId
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

  async getVisitDataForVisitId(visitId: string): Promise<VisitData[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetVisitDataForVisitId($visitId: String) {
        visitDataForVisitId(visitId: $visitId) {
            visitName
            visitSection
            question
            questionAnswer
        }
    }
      `,
      variables: {
        visitId: visitId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Trainee visit data for visit id Failed - Server connection error'
      );
    }

    return response.data.data.visitDataForVisitId;
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
      mutation UpdateCommunitySupport($userId: String, $haveCommunitySupport: Boolean ) {
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

  async signFranchisorAgreement(
    id: string,
    input: UserConsentInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addVisitData: boolean };
      errors?: {};
    }>(``, {
      query: `
      mutation updateUserConsent($id: UUID!,$input: UserConsentInput) {          
        updateUserConsent(id: $id, input: $input) {            
            id          
        }        
    }
      `,
      variables: {
        id,
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Add update Franchisor agreement support failed - Server connection error'
      );
    }

    return true;
  }

  async addSSChecklistForTrainee(
    input: SsChecklistVisitModelInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addVisitData: boolean };
      errors?: {};
    }>(``, {
      query: `
      mutation AddSSChecklistForTrainee($input: SSChecklistVisitModelInput) {
        addSSChecklistForTrainee(input: $input) {
           id
           plannedVisitDate
           actualVisitDate
           attended
           visitType {
               name
               description
           } 
        }
    }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Add SS checklist for trainee failed - Server connection error'
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

  async editVisitData(input: CmsVisitDataInputModelInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addVisitData: boolean };
      errors?: {};
    }>(``, {
      query: `
      mutation EditVisitData($input: CMSVisitDataInputModelInput) {
        editVisitData(input: $input) {
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

  async addStartupSupportAgreementForTrainee(
    input: SupportVisitModelInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addVisitData: boolean };
      errors?: {};
    }>(``, {
      query: `
      mutation AddStartupSupportAgreementForTrainee($input: SupportVisitModelInput) {
        addStartupSupportAgreementForTrainee(input: $input) {
            id
           plannedVisitDate
           actualVisitDate
           attended
           visitType {
               name
               description
           } 
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

  async addCoachVisitInviteForTrainee(
    input: SsChecklistVisitModelInput
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addAdditionalVisitForInfant: Visit };
      errors?: {};
    }>(``, {
      query: `
      mutation AddCoachVisitInviteForTrainee($input: SSChecklistVisitModelInput) {
        addCoachVisitInviteForTrainee(input: $input) {
            id
        }
    }
        `,
      variables: {
        input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'add Additional Visit For Child failed - Server connection error'
      );
    }

    return response.data.data.addAdditionalVisitForInfant;
  }

  async AddCoachFranchiseeAgreementForTrainee(
    input: SsChecklistVisitModelInput
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addCoachFranchiseeAgreementForTrainee: Visit };
      errors?: {};
    }>(``, {
      query: `
      mutation AddCoachFranchiseeAgreementForTrainee($input: SSChecklistVisitModelInput) {
        addCoachFranchiseeAgreementForTrainee(input: $input) {
            id
        }
    }
        `,
      variables: {
        input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'add Additional Visit For Child failed - Server connection error'
      );
    }

    return response.data.data.addCoachFranchiseeAgreementForTrainee;
  }

  async UpdateTraineeAddress(
    userId: string,
    input: TraineeAddressModelInput
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateTraineeAddress: any };
      errors?: {};
    }>(``, {
      query: `
      mutation UpdateTraineeAddress($userId: String, $input: TraineeAddressModelInput) {
        updateTraineeAddress(userId: $userId, input: $input) {
            id
        }
    }
        `,
      variables: {
        userId,
        input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'change trainee smart space address failed - Server connection error'
      );
    }

    return response.data.data.updateTraineeAddress;
  }
}

export default TraineeService;
