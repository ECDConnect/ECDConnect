import { Config } from '@ecdlink/core';
import { CoachingClub } from '@ecdlink/graphql';
import { api } from '../axios.helper';

class ClubService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getAllClubsForCoach(userId: string): Promise<CoachingClub[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { allClubsForCoach: CoachingClub[] };
      errors?: {};
    }>(``, {
      query: `
        query GetAllClubsForCoach($userId: String) {
          allClubsForCoach(userId: $userId) {
              id
              name
              userId
              secondaryText
              secondaryTextColor
              maxClubPoints
              totalClubPoints
              leaguePosition
              clubMeetings {
                id
                name
                meetingDate
                contentValueId
                meetingNotes
                coachAttended
              }
              clubLeaders {
                  isActive
                  dateAssigned
                  dateAccepted
                  practitioner {
                      id
                      user {
                          id
                          firstName
                          surname
                          phoneNumber
                          whatsAppNumber
                          profileImageUrl
                      }
                  }
              }
              clubSupport {
                  isActive
                  dateAssigned
                  dateAccepted
                  practitioner {
                      id
                      user {
                          id
                          firstName
                          surname
                          phoneNumber
                          whatsAppNumber
                          profileImageUrl
                      }
                  }
              }
              clubMembers {
                  welcomeMessage
                  isActive
                  dateClubJoined
                  isNewInClub
                  practitioner {
                      id
                      user {
                          id
                          firstName
                          surname
                          phoneNumber
                          whatsAppNumber
                          profileImageUrl
                      }
                  }
              }
              coach {
                  aboutInfo
                  user {
                      id
                      firstName
                      surname
                      phoneNumber
                      whatsAppNumber
                      profileImageUrl
                  }
              }
              league {
                  id
                  name
                  leagueType {
                    id
                    name
                  }
              }
              clubActivities {
                  name
                  points
              }
          }
      }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get all clubs failed - Server connection error');
    }

    return response.data.data.allClubsForCoach;
  }
}

export default ClubService;
