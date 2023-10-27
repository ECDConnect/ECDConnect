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
  ClubMember,
  QueryActivityMeetRegularDetailsArgs,
  ActivityMeetRegular,
  ActivityBeCreative,
  QueryActivityBeCreativeDetailsArgs,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';
import { NewClubLeaderInput } from './types';
import { ClubDto } from '@/models/club/club.dto';

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
              leagueRankNr
              totalClubPoints
              totalClubPointsColor
              firstInLeague
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
              issuesTasks {
                secondaryText
                secondaryTextColor
                secondaryDescription
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

  async getClubsMembers(clubIds: string[]): Promise<ClubMember[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: {
        clubsMembers: ClubMember[];
      };
      errors?: {};
    }>(``, {
      query: `
        query clubsMembers($clubIds: [UUID!]) {
          clubsMembers(clubIds: $clubIds) {
            practitioner {
                id
                user {
                    id
                    firstName
                    surname
                    isActive
                }
            }
          }
      }
      `,
      variables: {
        clubIds,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get all members failed - Server connection error');
    }

    return response.data.data.clubsMembers;
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
        mutation AddNewClubLeader($clubId: UUID!, $practitionerId: UUID!) {
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

  async getActivityMeetRegularDetails(
    input: QueryActivityMeetRegularDetailsArgs
  ): Promise<ActivityMeetRegular> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { activityMeetRegularDetails: ActivityMeetRegular };
      errors?: {};
    }>(``, {
      query: `
        query GetActivityMeetRegularDetails($clubId: UUID!, $month: Int!, $year: Int!) {
          activityMeetRegularDetails(clubId: $clubId, month: $month, year: $year) {
              points
              pointsColor
              upcomingMeetings {
                  meetingDate
              }
              pastMeetings {
                  meetingDate
                  meetingNotes
                  meetingAttendancePerc
                  meetingAttendanceColor
                  points
                  meetingParticipants {
                    practitioner {
                      user {
                        id
                        firstName
                        surname
                      }
                  }
                  meetingAbsentees {
                    practitioner {
                        user {
                            id
                            firstName
                            surname
                          }
                        }
                    }
                } 
              }     
          }
        }
      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get activity meet regular details failed - Server connection error'
      );
    }

    return response.data.data.activityMeetRegularDetails;
  }

  async getActivityBeCreativeDetails(
    input: QueryActivityBeCreativeDetailsArgs
  ): Promise<ActivityBeCreative> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { activityBeCreativeDetails: ActivityBeCreative };
      errors?: {};
    }>(``, {
      query: `
        query GetActivityBeCreativeDetails($clubId: UUID!) {
          activityBeCreativeDetails(clubId: $clubId) {
              points
              pointsColor
              monthlyRecords {
                  monthName
                  description
                  documentName
                  documentReference
              }
          }
        }
      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get activity be creative details failed - Server connection error'
      );
    }

    return response.data.data.activityBeCreativeDetails;
  }

  async getClubForUser(userId: string): Promise<ClubDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { clubForUser: ClubDto };
      errors?: {};
    }>(``, {
      query: `query clubForUser($userId: String) {
          clubForUser(userId: $userId) {
            id
            name
            pointsTotal
            maxPointsTotal
            leagueRanking
            league {
              id
              name
              leagueTypeId
              leagueTypeName
            }
          }
        }`,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get club for user failed - Server connection error');
    }

    return response.data.data.clubForUser;
  }
}

export default ClubService;
