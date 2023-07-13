import { Config } from '@ecdlink/core';
import {
  CmsVisitDataInputModelInput,
  FollowUpVisitModelInput,
  PractitionerTimeline,
  ReAccreditationVisitModelInput,
  SupportVisitModelInput,
  UpdateVisitPlannedVisitDateModelInput,
  Visit,
  VisitData,
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

  async addReAccreditationVisitData(
    input: ReAccreditationVisitModelInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addReAccreditationVisitForPractitioner: boolean };
      errors?: {};
    }>(``, {
      query: ` 
        mutation AddReAccreditationVisitForPractitioner($input: ReAccreditationVisitModelInput) {
          addReAccreditationVisitForPractitioner(input: $input) {
              id, 
              plannedVisitData
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
            pQARating1 {
              children {
                sectionRating
                sectionRatingColor
                sectionScore
                visitSection
              }
              overallRating
              overallRatingColor
              overallRatingStars
              overallScore
              plannedDate
              visitName
            }
            pQARating2 {
              children {
                sectionRating
                sectionRatingColor
                sectionScore
                visitSection
              }
              overallRating
              overallRatingColor
              overallRatingStars
              overallScore
              plannedDate
              visitName
            }
            pQARating3 {
              children {
                sectionRating
                sectionRatingColor
                sectionScore
                visitSection
              }
              overallRating
              overallRatingColor
              overallRatingStars
              overallScore
              plannedDate
              visitName
            }
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
              visitType {
                type
                order
                name
                normalizedName
                description
              }
            }
            pQASiteVisits {
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
            }
            reAccreditationVisits {
              id
              plannedVisitDate
              attended
              comment
              visitType {
                type
                order
                name
                normalizedName
                description
              }
            }
            reAccreditationRating1 {
              children {
                sectionRating
                sectionRatingColor
                sectionScore
                visitSection
              }
              overallRating
              overallRatingColor
              overallRatingStars
              overallScore
              plannedDate
              visitName
            }
            reAccreditationRating2 {
              children {
                sectionRating
                sectionRatingColor
                sectionScore
                visitSection
              }
              overallRating
              overallRatingColor
              overallRatingStars
              overallScore
              plannedDate
              visitName
            }
            reAccreditationRating3 {
              children {
                sectionRating
                sectionRatingColor
                sectionScore
                visitSection
              }
              overallRating
              overallRatingColor
              overallRatingStars
              overallScore
              plannedDate
              visitName
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
}

export default PQAService;
