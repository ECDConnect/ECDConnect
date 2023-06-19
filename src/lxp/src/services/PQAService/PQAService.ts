import { Config } from '@ecdlink/core';
import {
  CmsVisitDataInputModelInput,
  PractitionerTimeline,
  SupportVisitModelInput,
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
            pQARating {
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
}

export default PQAService;
