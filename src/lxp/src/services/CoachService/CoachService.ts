import {
  ChildProgressReportsStatus,
  ClubMeetingModelInput,
  CoachInput,
} from '@ecdlink/graphql';
import {
  ClubDto,
  CoachCirclesDto,
  CoachDto,
  CoachingCircleTopicDto,
} from '@ecdlink/core';
import { Config } from '@ecdlink/core';
import { api } from '../axios.helper';

class CoachService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getCoachByUserId(userId: string): Promise<CoachDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query coachByUserId($userId: String) {
          coachByUserId(userId: $userId) {
            id
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
              roles {
                id
                name
              }
            }
            siteAddressId
            siteAddress {
              id
              provinceId
              province {
                id
                description
              }
              name
              addressLine1
              addressLine2
              addressLine3
              postalCode
              ward
              isActive
            }
            franchisorId
            franchisor {
              siteAddressId
              siteAddress {
                id
                provinceId
                province {
                  id
                  description
                }
                name
                addressLine1
                addressLine2
                addressLine3
                postalCode
                ward
              }
            }
            signingSignature
            isActive
          }
        }
      `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Coach Failed - Server connection error');
    }

    return response.data.data.coachByUserId;
  }

  async getCoachByCoachId(userId: string): Promise<CoachDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query coachByCoachUserId($userId: String) {
        coachByCoachUserId(userId: $userId) {
          signingSignature
          id
          startDate
          clickedClubTab
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
            roles {
              id
              name
            }
          }
          siteAddressId
            siteAddress {
              id
              provinceId
              province {
                id
                description
              }
                name
                addressLine1
                addressLine2
                addressLine3
                postalCode
                ward
                isActive
            }
            franchisorId
            franchisor {
                siteAddressId
                siteAddress {
                  id
                  provinceId
                  province {
                    id
                    description
                  }
                  name
                  addressLine1
                  addressLine2
                  addressLine3
                  postalCode
                  ward
                  }
            }
            signingSignature
            isActive
            traineeVisits {
              id
            }
            practitionerVisits {
              id
            }
        }
      }
      `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Coach Failed - Server connection error');
    }

    return response.data.data.coachByCoachUserId;
  }

  async coachNameByUserId(userId: string): Promise<CoachDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query coachNameByUserId($userId: String) {
        coachNameByUserId(userId: $userId) {

        }
      }
      `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Coach Name Failed - Server connection error');
    }

    return response.data.data.coachNameByUserId;
  }

  async updateCoach(coachId: string, coach: CoachInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateCoach($id: UUID!, $input: CoachInput) {
          updateCoach(id: $id, input: $input) {
            id
          }
        }
      `,
      variables: {
        id: coachId,
        input: coach,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating Coach failed - Server connection error');
    }

    return true;
  }

  async updateCoachClubClicked(userId: string): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateCoachClubClicked: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation updateCoachClubClicked ($userId: String) {          
          updateCoachClubClicked( userId: $userId )    
        }  
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Change failed - Server connection error');
    }

    return response.data.data.updateCoachClubClicked;
  }

  async GetAllCoachingCircleClubsForCoachserId(
    userId: string,
    startDate: Date | string,
    endDate: Date | string
  ): Promise<CoachCirclesDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { allCoachingCircleClubsForCoach: CoachCirclesDto };
      errors?: {};
    }>(``, {
      query: `
      query GetAllCoachingCircleClubsForCoach($userId: String, $startDate: DateTime!, $endDate: DateTime!) {
        allCoachingCircleClubsForCoach(userId: $userId, startDate: $startDate, endDate: $endDate) {
            clubsWithNoLinkedMeetings {
                id
                name
                cCMeetingStatus
                cCMeetingStatusColor
            }
            clubsWithLinkedMeetings {
                id
                name
                cCMeetingStatus
                cCMeetingStatusColor
            }
        }
    }
      `,
      variables: {
        userId: userId,
        startDate: startDate,
        endDate: endDate,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Coach circles Failed - Server connection error');
    }

    return response.data.data.allCoachingCircleClubsForCoach;
  }

  async GetAllClubsForCoach(userId: string): Promise<ClubDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { allClubsForCoachSimple: ClubDto[] };
      errors?: {};
    }>(``, {
      query: `
      query GetAllClubsForCoach($userId: String) {
        allClubsForCoachSimple(userId: $userId) {
          id
          name
        }
       }
      `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Coach clubs Failed - Server connection error');
    }

    return response.data.data.allClubsForCoachSimple;
  }

  async addCoachCircleMeeting(input: ClubMeetingModelInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      errors?: {};
    }>(``, {
      query: `
      mutation AddCoachCircleMeeting($input: ClubMeetingModelInput ) {
        addCoachCircleMeeting(input: $input) {
            id
            meetingDate
            meetingNotes
        }
    }
      `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Updating Coach failed - Server connection error');
    }

    return true;
  }

  async getCoachingCircleTopics(
    locale: string
  ): Promise<CoachingCircleTopicDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllCoachingCircleTopics($locale: String) {
        GetAllCoachingCircleTopics(locale: $locale) {
          id
          resource
          title
          topicContent
        }
      }
      `,
      variables: {
        locale,
      },
    });
    if (response.status !== 200) {
      throw new Error('Get Coaching topics failed - Server connection error');
    }
    return response.data.data.GetAllCoachingCircleTopics;
  }

  async declineSmartSpaceLicenseForTrainee(
    userId: string,
    dateDeclined: Date,
    nextStepsComments: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      errors?: {};
    }>(``, {
      query: `
      mutation declineSmartSpaceLicenseForTrainee( $userId: String!, $dateDeclined: DateTime!, $nextStepsComments: String!) { 
        declineSmartSpaceLicenseForTrainee(userId: $userId, dateDeclined: $dateDeclined, nextStepsComments: $nextStepsComments) { 
            userId       
          }    
        }
      `,
      variables: {
        userId,
        dateDeclined,
        nextStepsComments,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Updating Coach failed - Server connection error');
    }

    return true;
  }

  async getChildProgressReportsStatusForUser(
    userId: string
  ): Promise<ChildProgressReportsStatus> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { childProgressReportsStatus: ChildProgressReportsStatus };
      errors?: {};
    }>(``, {
      query: `
      query getChildProgressReportsStatus($userId: String) {
        childProgressReportsStatus(userId: $userId) {
          completedReports
          numberOfChildren
        }
       }
      `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get Coach clubs Failed - Server connection error');
    }

    return response.data.data.childProgressReportsStatus;
  }
}

export default CoachService;
