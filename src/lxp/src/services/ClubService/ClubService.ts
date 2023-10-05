import { Config } from '@ecdlink/core';
import {
  Club,
  ClubLeader,
  Coach,
  CoachingClub,
  MutationChangeClubNameArgs,
  MutationUpdateCoachAboutInfoArgs,
  NewClubInput,
  NewClubMemberInput,
  CoachingClubBase,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';
import { NewClubLeaderInput } from './types';

class ClubService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getAllClubsForCoach(userId: string): Promise<CoachingClubBase[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { allClubsForCoach: CoachingClubBase[] };
      errors?: {};
    }>(``, {
      query: `
        query allClubsForCoach($userId: String) {
          allClubsForCoach(userId: $userId) {
            id
            name
            userId
            secondaryText
            secondaryTextColor
            secondaryTextPriority
            meetingAttendance
            meetingAttendanceColor
            meetingAttendanceText 
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

  async getAllClubsDetailsForCoach(
    userId: string,
    clubId?: string
  ): Promise<CoachingClub[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { allClubsDetailsForCoach: CoachingClub[] };
      errors?: {};
    }>(``, {
      query: `
        query allClubsDetailsForCoach($userId: String, $clubId: String!) {
          allClubsDetailsForCoach(userId: $userId, clubId: $clubId) {
              id
              name
              userId
              secondaryText
              secondaryTextColor
              maxClubPoints
              totalClubPoints
              leaguePosition
              secondaryTextPriority
              clubMeetings {
                id
                name
                meetingDate
                contentValueId
                meetingNotes
                coachAttended
              }
              currentClubLeader {
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
              newClubLeader {
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
        clubId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get all clubs failed - Server connection error');
    }

    return response.data.data.allClubsDetailsForCoach;
  }

  async getAllClubsMembersForCoach(userId: string): Promise<CoachingClub[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: {
        allClubsDetailsForCoach: (CoachingClub['id'] &
          CoachingClub['clubMembers'])[];
      };
      errors?: {};
    }>(``, {
      query: `
        query allClubsDetailsForCoach($userId: String) {
          allClubsDetailsForCoach(userId: $userId) {
              id
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
          }
      }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get all members failed - Server connection error');
    }

    return response.data.data.allClubsDetailsForCoach;
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

  async changeClubName(input: MutationChangeClubNameArgs): Promise<Club> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { changeClubName: Club };
      errors?: {};
    }>(``, {
      query: `
        mutation ChangeClubName($clubId: String, $clubName: String ) {
          changeClubName(clubId: $clubId, clubName: $clubName) {
              id
              name
          }
        }
      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Change club name failed - Server connection error');
    }

    return response.data.data.changeClubName;
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

  async updateCoachAboutInfo(
    input: MutationUpdateCoachAboutInfoArgs
  ): Promise<Coach> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateCoachAboutInfo: Coach };
      errors?: {};
    }>(``, {
      query: `
        mutation UpdateCoachAboutInfo($userId: String, $aboutInfo: String) {
          updateCoachAboutInfo(userId: $userId, aboutInfo: $aboutInfo) {
              id
              aboutInfo
              userId
          }
        }
      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'update coach about info failed - Server connection error'
      );
    }

    return response.data.data.updateCoachAboutInfo;
  }
}

export default ClubService;
