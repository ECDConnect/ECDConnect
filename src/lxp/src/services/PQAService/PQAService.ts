import { Config } from '@ecdlink/core';
import {
  CmsVisitDataInputModelInput,
  FollowUpVisitModelInput,
  PractitionerTimeline,
  SupportVisitModelInput,
  UpdateVisitPlannedVisitDateModelInput,
  Visit,
  VisitData,
  VisitModelInput,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';

class PQAService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async addVisitData(input: CmsVisitDataInputModelInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addVisitData: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation addVisitData($input: CMSVisitDataInputModelInput) {
          addVisitData(input: $input) {
          }
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add visit failed - Server connection error');
    }

    return true;
  }

  async addSupportVisitData(
    input: CmsVisitDataInputModelInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addSupportVisitData: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation addSupportVisitData($input: CMSVisitDataInputModelInput) {
          addSupportVisitData(input: $input) {
          }
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add support visit failed - Server connection error');
    }

    return true;
  }

  async addSupportVisitForPractitioner(
    input: SupportVisitModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addSupportVisitForPractitioner: Visit };
      errors?: {};
    }>(``, {
      query: `
        mutation AddSupportVisitForPractitioner($input: SupportVisitModelInput) {
          addSupportVisitForPractitioner(input: $input) {
              id
          }
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add support visit failed - Server connection error');
    }

    return response.data.data.addSupportVisitForPractitioner;
  }

  async addFollowUpVisitForPractitioner(
    input: FollowUpVisitModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addFollowUpVisitForPractitioner: Visit };
      errors?: {};
    }>(``, {
      query: `
        mutation AddFollowUpVisitForPractitioner($input: FollowUpVisitModelInput) {
          addFollowUpVisitForPractitioner(input: $input) {
              id          
          }        
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add follow up visit failed - Server connection error');
    }

    return response.data.data.addFollowUpVisitForPractitioner;
  }

  async addReAccreditationFollowUpVisitForPractitioner(
    input: FollowUpVisitModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addReAccreditationFollowUpVisitForPractitioner: Visit };
      errors?: {};
    }>(``, {
      query: `
        mutation AddReAccreditationFollowUpVisitForPractitioner($input: FollowUpVisitModelInput) {
          addReAccreditationFollowUpVisitForPractitioner(input: $input) {
              id 
          }        
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Add reAccreditation follow up visit failed - Server connection error'
      );
    }

    return response.data.data.addReAccreditationFollowUpVisitForPractitioner;
  }

  async addSelfAssessmentForPractitioner(
    input: SupportVisitModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addSelfAssessmentForPractitioner: Visit };
      errors?: {};
    }>(``, {
      query: `
        mutation AddSelfAssessmentForPractitioner($input: SupportVisitModelInput) {
          addSelfAssessmentForPractitioner(input: $input) {
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
      throw new Error('Add self assessment failed - Server connection error');
    }

    return response.data.data.addSelfAssessmentForPractitioner;
  }

  async getVisitDataForVisitId(visitId: string): Promise<VisitData[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { visitDataForVisitId: VisitData[] };
      errors?: {};
    }>(``, {
      query: `
        query GetVisitDataForVisitId($visitId: String) {
          visitDataForVisitId(visitId: $visitId) {
            insertedDate
            visitId
            visitName
            visitSection
            question
            questionAnswer
          }
        }
          `,
      variables: {
        visitId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Visit Data For Visit Id Failed - Server connection error'
      );
    }

    return response.data.data.visitDataForVisitId;
  }

  async getPractitionerTimeline(userId: string): Promise<PractitionerTimeline> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { practitionerTimeline: PractitionerTimeline };
      errors?: {};
    }>(``, {
      query: `
        query GetPractitionerTimeline ($userId: String) {
          practitionerTimeline(userId: $userId) {
            consolidationMeetingColor
            consolidationMeetingDate
            consolidationMeetingStatus
            firstAidCourseColor
            firstAidCourseStatus
            firstAidDate
            prePQAVisitDate1
            prePQAVisitDate1Color
            prePQAVisitDate1Status
            prePQAVisitDate2
            prePQAVisitDate2Color
            prePQAVisitDate2Status
            prePQASiteVisits {
              id
              plannedVisitDate
              attended
              comment
              dueDate
              actualVisitDate
              insertedDate
              visitType {
                type
                order
                name
                normalizedName
                description
              }
              eventId
            }
            pQARatings {
              visitId
              linkedVisitId
              sections {
                sectionRating
                sectionRatingColor
                sectionScore
                visitSection
              }
              overallRating
              overallRatingColor
              overallRatingStars
              overallScore
              visitName
              visitTypeName
            }
            pQASiteVisits {
              id
              hasAnswerData
              delicenseQuestionAnswered
              plannedVisitDate
              attended
              comment
              actualVisitDate
              insertedDate
              overallRatingColor
              visitType {
                type
                order
                name
                normalizedName
                description
              }
              eventId
            }
            reAccreditationVisits {
              id
              hasAnswerData
              delicenseQuestionAnswered
              plannedVisitDate
              attended
              comment
              actualVisitDate
              insertedDate
              overallRatingColor
              visitType {
                type
                order
                name
                normalizedName
                description
              }
              eventId
            }
            reAccreditationRatings {
              visitId
              linkedVisitId
              sections {
                sectionRating
                sectionRatingColor
                sectionScore
                visitSection
              }
              overallRating
              overallRatingColor
              overallRatingStars
              overallScore
              visitName
              visitTypeName
            }
            requestedCoachVisits {
              id
              plannedVisitDate
              insertedDate
              attended
              eventId
              visitType {
                description
                id
                isActive
                name
                normalizedName
                order
                type
              }
            }
            selfAssessmentColor
            selfAssessmentDate
            selfAssessmentStatus
            selfAssessmentVisits {
              id
              plannedVisitDate
              attended
              comment
              insertedDate
              visitType {
                type
                order
                name
                normalizedName
                description
              }
              eventId
            }
            smartSpaceLicenseColor
            smartSpaceLicenseDate
            smartSpaceLicenseStatus
            starterLicenseColor
            starterLicenseDate
            starterLicenseStatus
            supportVisits {
              id
              plannedVisitDate
              insertedDate
              attended
              visitType {
                description
                id
                isActive
                name
                normalizedName
                order
                type
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

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get Practitioner Timeline Failed - Server connection error'
      );
    }
    return response.data.data.practitionerTimeline;
  }

  async updateVisitPlannedVisitDate(
    input: UpdateVisitPlannedVisitDateModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateVisitPlannedVisitDate: Visit };
      errors?: {};
    }>(``, {
      query: `
        mutation updateVisitPlannedVisitDate($input: UpdateVisitPlannedVisitDateModelInput) {
          updateVisitPlannedVisitDate(input: $input) {
            id 
          }        
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Update Visit PlannedVisitDate failed - Server connection error'
      );
    }

    return response.data.data.updateVisitPlannedVisitDate;
  }

  async addCoachVisitInviteForPractitioner(
    input: VisitModelInput
  ): Promise<Visit> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addCoachVisitInviteForPractitioner: Visit };
      errors?: {};
    }>(``, {
      query: `
        mutation AddCoachVisitInviteForPractitioner($input: VisitModelInput) {        
          addCoachVisitInviteForPractitioner(input: $input) {           
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
        'Add coach visit invite for practitioner failed - Server connection error'
      );
    }

    return response.data.data.addCoachVisitInviteForPractitioner;
  }
}

export default PQAService;
