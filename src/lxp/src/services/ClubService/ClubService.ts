import { Config } from '@ecdlink/core';
import {
  Club,
  ClubLeader,
  CoachingClub,
  NewClubInput,
  NewClubMemberInput,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';
import { NewClubLeaderInput } from './types';

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

  async addNewClubMembers(input: NewClubMemberInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addNewClubMembers: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation AddNewClubMembers($input: NewClubMemberInput) {
          addNewClubMembers(input: $input) {
              
          }
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add new club members failed - Server connection error');
    }

    return response.data.data.addNewClubMembers;
  }

  async moveClubMembers(input: NewClubMemberInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { moveClubMembers: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation MoveClubMembers($input: NewClubMemberInput) {
          moveClubMembers(input: $input) {
              
          }
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Move club members failed - Server connection error');
    }

    return response.data.data.moveClubMembers;
  }

  async addNewClub(input: NewClubInput): Promise<Club> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addNewClub: Club };
      errors?: {};
    }>(``, {
      query: `
        mutation AddNewClub($input: NewClubInput) {
          addNewClub(input: $input) {
            id
            name
          }
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add new club failed - Server connection error');
    }

    return response.data.data.addNewClub;
  }

  async addNewClubLeader({
    clubId,
    practitionerId,
  }: NewClubLeaderInput): Promise<ClubLeader> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addNewClubLeader: ClubLeader };
      errors?: {};
    }>(``, {
      query: `
        mutation AddNewClubLeader($clubId: String, $practitionerId: String) {
          addNewClubLeader(clubId: $clubId, practitionerId: $practitionerId) {
              isActive
              dateAssigned
              dateAccepted
              practitioner {
                  id
                  user {
                      id
                      firstName
                      surname
                  }
              }
          }
        }
      `,
      variables: {
        clubId,
        practitionerId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add new club leader failed - Server connection error');
    }

    return response.data.data.addNewClubLeader;
  }
}

export default ClubService;
