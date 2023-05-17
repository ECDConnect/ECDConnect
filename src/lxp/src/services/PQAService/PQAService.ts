import { Config } from '@ecdlink/core';
import { PractitionerTimeLine } from '@ecdlink/graphql';
import { api } from '../axios.helper';

class PQAService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getPractitionerTimeline(userId: string): Promise<PractitionerTimeLine> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { practitionerTimeline: PractitionerTimeLine };
      errors?: {};
    }>(``, {
      query: `
        query GetPractitionerTimeline ($userId: String) {
          practitionerTimeline(userId: $userId) {
            clubMeetingDate1
            clubMeetingDate1Color
            clubMeetingDate1Status
            clubMeetingDate2
            clubMeetingDate2Color
            clubMeetingDate2Status
            clubMeetingDate3
            clubMeetingDate3Color
            clubMeetingDate3Status
            clubMeetings {
              meetingDate
              name
            }
            coachCircles {
              meetingDate
              name
            }
            coachingCircle1Color
            coachingCircle1Status
            coachingCircle2Color
            coachingCircle2Status
            coachingCircle3Color
            coachingCircle3Status
            coachingCircle4Color
            coachingCircle4Status
            coachingCircleDate1
            coachingCircleDate2
            coachingCircleDate3
            coachingCircleDate4
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
            siteVisits {
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
