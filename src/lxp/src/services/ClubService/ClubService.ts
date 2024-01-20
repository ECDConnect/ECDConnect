import { Config } from '@ecdlink/core';
import {
  Club,
  ClubLeader,
  Coach,
  MutationChangeClubNameArgs,
  MutationUpdateCoachAboutInfoArgs,
  NewClubInput,
  NewClubMemberInput,
  ClubMember,
  QueryActivityMeetRegularDetailsArgs,
  ActivityMeetRegular,
  ActivityBeCreative,
  QueryActivityBeCreativeDetailsArgs,
  QueryClubForUserArgs,
  MutationSaveWelcomeMessageArgs,
  MutationAcceptNewClubLeaderRoleArgs,
  ClubMeeting,
  ActivityHostFamilyDays,
  ActivityLeaveNoOneBehind,
  QueryActivityChildProgressArgs,
  ActivityChildAttendance,
  ClubSupport,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';
import {
  BeCreativeActivityInput,
  ChangeClubSupportRoleInput,
  ClubMeetingInput,
  ActivityHostFamilyDetailsInput,
  NewClubLeaderInput,
  ActivityLeaveNoOneBehindDetailsInput,
  ActivityChildAttendanceDetailsInput,
  UpdateClubSupportStatusInput,
} from './types';
import {
  ActivityChildProgressDto,
  DetailClubDto,
} from '@/models/club/club.dto';
import { LeagueClubsDto } from '@/models/club/league.dto';

class ClubService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
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
            name
            eventId
            meetingDate
            meetingNotes
            meetingAttendancePerc
            meetingAttendanceColor
            points
            meetingParticipants {
            userId
            firstName
            surname
            }
            meetingAbsentees {
            userId
            firstName
            surname
            }
        }
        pastMeetings {
            meetingDate
            meetingNotes
            meetingAttendancePerc
            meetingAttendanceColor
            points
            eventId
            meetingParticipants {
            userId
            firstName
            surname
            }
            meetingAbsentees {
            userId
            firstName
            surname
            }
        } 
        }     
    }`,
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
                  documentStatusColor
                  documentStatus
                  imageApproved
                  points
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

  async getActivityChildProgressDetails(
    input: QueryActivityChildProgressArgs
  ): Promise<ActivityChildProgressDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { activityChildProgress: ActivityChildProgressDto };
      errors?: {};
    }>(``, {
      query: `
        query GetActivityChildProgress($clubId: UUID!) {
          activityChildProgress(clubId: $clubId) {
            points
            pointsColor
            monthlyRecords {
              monthName
              progressPoints
              caregiverPoints
              progressPerc
              caregiverPerc
              progressPointsColor
              caregiverPointsColor
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
        'Get activity child progress failed - Server connection error'
      );
    }

    return response.data.data.activityChildProgress;
  }

  async getClubForUser(input: QueryClubForUserArgs): Promise<DetailClubDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { clubForUser: DetailClubDto };
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
              numberOfClubsInLeague
            }
            clubCoach {
              userId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              aboutInfo
            }
            clubLeader {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              dateAccepted
              dateAssigned
            }
            clubSupport {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              dateAssigned
              isNewInSupportRole
            }
            clubMembers {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              welcomeMessage
              shareContactInfo
            }
            clubActivities {
              name
              points
            }   
          }
        }`,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get club for user failed - Server connection error');
    }

    return response.data.data.clubForUser;
  }

  async getClubsForCoach(coachUserId: string): Promise<DetailClubDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { clubsForCoach: DetailClubDto[] };
      errors?: {};
    }>(``, {
      query: `query clubsForCoach($coachUserId: String) {
          clubsForCoach(coachUserId: $coachUserId) {
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
              numberOfClubsInLeague
            }
            clubCoach {
              userId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              aboutInfo
            }
            clubLeader {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              dateAssigned
              dateAccepted
            }
            incomingClubLeader {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              dateAccepted
              dateAssigned
            }
            clubSupport {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              dateAssigned
            }
            clubMembers {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              welcomeMessage
              shareContactInfo
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
        }`,
      variables: {
        coachUserId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get club for user failed - Server connection error');
    }

    return response.data.data.clubsForCoach;
  }

  async getClubById(clubId: string): Promise<DetailClubDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { clubById: DetailClubDto };
      errors?: {};
    }>(``, {
      query: `query GetClubById($clubId: UUID!) {
        clubById(clubId: $clubId) {
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
              numberOfClubsInLeague
            }
            clubCoach {
              userId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              aboutInfo
            }
            clubLeader {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              dateAccepted
            }
            incomingClubLeader {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              dateAccepted
              dateAssigned
            }
            clubSupport {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              dateAssigned
            }
            clubMembers {
              userId
              practitionerId
              firstName
              surname
              phoneNumber
              whatsAppNumber
              profileImageUrl
              welcomeMessage
              shareContactInfo
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
        }`,
      variables: {
        clubId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get club for user failed - Server connection error');
    }

    return response.data.data.clubById;
  }

  async saveWelcomeMessage(
    input: MutationSaveWelcomeMessageArgs
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { saveWelcomeMessage: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation SaveWelcomeMessage($clubId: UUID!, $practitionerId: UUID!, $welcomeMessage: String, $shareContactInfo: Boolean!) {
          saveWelcomeMessage(clubId: $clubId, practitionerId: $practitionerId, welcomeMessage: $welcomeMessage, shareContactInfo: $shareContactInfo) {
          }
        }
      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Save welcome message failed - Server connection error');
    }

    return response.data.data.saveWelcomeMessage;
  }

  async acceptNewClubLeaderRole(
    input: MutationAcceptNewClubLeaderRoleArgs
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { acceptNewClubLeaderRole: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation AcceptNewClubLeaderRole($clubId: UUID!, $practitionerId: UUID!, $clubSupportPractitionerId: UUID!) {
          acceptNewClubLeaderRole(clubId: $clubId, practitionerId: $practitionerId, clubSupportPractitionerId: $clubSupportPractitionerId) {}
        }
      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Accept new club leader role failed - Server connection error'
      );
    }

    return response.data.data.acceptNewClubLeaderRole;
  }

  async changeClubSupportRole(
    input: ChangeClubSupportRoleInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { changeClubSupportRole: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation ChangeClubSupportRole($clubId: UUID!, $practitionerId: UUID!) {
          changeClubSupportRole(clubId: $clubId, practitionerId: $practitionerId) {
          }
        }
      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Change club support role failed - Server connection error'
      );
    }

    return response.data.data.changeClubSupportRole;
  }

  async addClubMeeting(input: ClubMeetingInput): Promise<ClubMeeting> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addClubMeeting: ClubMeeting };
      errors?: {};
    }>(``, {
      query: `
        mutation AddClubMeeting($input: ClubMeetingModelInput) {
          addClubMeeting(input: $input) {
              id
              meetingDate
              meetingNotes
              clubId
              coachAttended
          }
        }    
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add club meeting failed - Server connection error');
    }

    return response.data.data.addClubMeeting;
  }

  async addCaregiverReportBackMeeting(
    clubId: string,
    userId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addCaregiverReportBackMeeting: boolean };
      errors?: {};
    }>(``, {
      query: `mutation AddCaregiverReportBackMeeting($clubId: UUID!, $userId: String) {
          addCaregiverReportBackMeeting(clubId: $clubId, userId: $userId) {
          }
        }`,
      variables: {
        clubId,
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Add club meeting failed - Server connection error');
    }

    return response.data.data.addCaregiverReportBackMeeting;
  }

  async getLeaguesForCoach(input: {
    coachUserId: string;
  }): Promise<LeagueClubsDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { leaguesForCoach: LeagueClubsDto[] };
      errors?: {};
    }>(``, {
      query: `query GetLeaguesForCoach($coachUserId: String) {
          leaguesForCoach(coachUserId: $coachUserId) {
            id
            name
            leagueTypeId
            leagueTypeName
            clubs {
              clubId
              clubName
              leagueRank
              pointsTotal
              coachName
            }
          }
        }`,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get leagues for coach failed - Server connection error');
    }

    return response.data.data.leaguesForCoach;
  }

  async getLeagueForUser(input: { userId: string }): Promise<LeagueClubsDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { leagueForUser: LeagueClubsDto };
      errors?: {};
    }>(``, {
      query: `query GetLeagueForUser($userId: String) {
          leagueForUser(userId: $userId) {
            id
            name
            leagueTypeId
            leagueTypeName
            clubs {
              clubId
              clubName
              leagueRank
              pointsTotal
            }
          }
        }`,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get league for user failed - Server connection error');
    }

    return response.data.data.leagueForUser;
  }

  async addBeCreativeActivity(
    input: BeCreativeActivityInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addBeCreativeActivity: boolean };
      errors?: {};
    }>(``, {
      query: `
        mutation AddBeCreativeActivity($input: BeCreativeUploadInput) {
          addBeCreativeActivity(input: $input) {}
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Add be creative activity failed - Server connection error'
      );
    }

    return response.data.data.addBeCreativeActivity;
  }

  async getActivityHostFamilyDetails(
    input: ActivityHostFamilyDetailsInput
  ): Promise<ActivityHostFamilyDays> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { activityHostFamilyDetails: ActivityHostFamilyDays };
      errors?: {};
    }>(``, {
      query: `
        query GetActivityHostFamilyDetails($clubId: UUID!) {
          activityHostFamilyDetails(clubId: $clubId) {
              points
              pointsColor
              terms {
                  termNr
                  termName
                  eventName
                  description
                  documentStatus
                  documentStatusColor
                  points
                  meetingParticipantsPractitionerIds
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
        'Get Activity Host Family Details failed - Server connection error'
      );
    }

    return response.data.data.activityHostFamilyDetails;
  }

  async getActivityLeaveNoOneBehindDetails(
    input: ActivityLeaveNoOneBehindDetailsInput
  ): Promise<ActivityLeaveNoOneBehind> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { activityLeaveNoOneBehindDetails: ActivityLeaveNoOneBehind };
      errors?: {};
    }>(``, {
      query: `
        query GetActivityLeaveNoOneBehindDetails($clubId: UUID!) {
          activityLeaveNoOneBehindDetails(clubId: $clubId) {
            points
            pointsColor
            greenPerc
            greenText
            redPerc
            redText
            orangePerc
            orangeText
            bluePerc
            blueText
            greenUsers {
                userId
                firstName
                surname
                profileImageUrl
            }
            redUsers {
                userId
                firstName
                surname
                profileImageUrl
            }
            orangeUsers {
                userId
                firstName
                surname
                profileImageUrl
            }
            blueUsers {
                userId
                firstName
                surname
                profileImageUrl
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
        'Get activity leave no one behind details failed - Server connection error'
      );
    }

    return response.data.data.activityLeaveNoOneBehindDetails;
  }

  async getActivityChildAttendanceDetails(
    input: ActivityChildAttendanceDetailsInput
  ): Promise<ActivityChildAttendance> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { activityChildAttendance: ActivityChildAttendance };
      errors?: {};
    }>(``, {
      query: `
        query GetActivityChildAttendance($clubId: UUID!) {
          activityChildAttendance(clubId: $clubId) {
              points
              pointsColor
              monthlyRecords {
                  monthName
                  points
                  pointsColor
                  percentageMembersSubmittedAllRegisters
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
        'Get activity child attendance details failed - Server connection error'
      );
    }

    return response.data.data.activityChildAttendance;
  }

  async addFamilyDayMeeting(input: ClubMeetingInput): Promise<ClubMeeting> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addFamilyDayMeeting: ClubMeeting };
      errors?: {};
    }>(``, {
      query: `
        mutation AddFamilyDayMeeting($input: ClubMeetingModelInput) {
          addFamilyDayMeeting(input: $input) {
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
        'Add family day meeting failed - Server connection error'
      );
    }

    return response.data.data.addFamilyDayMeeting;
  }

  async updateClubSupportStatus(
    input: UpdateClubSupportStatusInput
  ): Promise<ClubSupport> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateClubSupportStatus: ClubSupport };
      errors?: {};
    }>(``, {
      query: `
        mutation UpdateClubSupportStatus($practitionerId: UUID!) {
          updateClubSupportStatus(practitionerId: $practitionerId) {
            id
            isNewInSupportRole
          }
        }
      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Update club support status failed - Server connection error'
      );
    }

    return response.data.data.updateClubSupportStatus;
  }
}

export default ClubService;
