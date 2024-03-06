import { Connect, ConnectItem } from '@ecdlink/graphql/lib';
import { api } from '../axios.helper';
import {
  BreastFeedingClubDto,
  CaregiverBaseDto,
  ClinicDto,
  Config,
  LeagueWithClinicRankingsDto,
} from '@ecdlink/core';
import { AddBreastFeedingClubInputModelInput } from '@ecdlink/graphql';

class CommunityService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getAllConnect(locale: string): Promise<Connect[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllConnect: Connect[] };
      errors?: {};
    }>(``, {
      query: `
      query GetAllConnect($locale: String) {
        GetAllConnect(locale: $locale){
          id
          name
        }
      }
      `,
      variables: {
        locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get All Connect Failed - Server connection error');
    }
    return response.data.data.GetAllConnect;
  }

  async getAllConnectItem(locale: string): Promise<ConnectItem[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { GetAllConnectItem: ConnectItem[] };
      errors?: {};
    }>(``, {
      query: `
      query GetAllConnectItem($locale: String) {
        GetAllConnectItem(locale: $locale){
          buttonText
          link
          linkedConnect {
            name
          }
        }
      }
      `,
      variables: {
        locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get All Connect Item Failed - Server connection error');
    }
    return response.data.data.GetAllConnectItem;
  }

  async getLeagueById(leagueId: string): Promise<LeagueWithClinicRankingsDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: {
        leagueById: LeagueWithClinicRankingsDto;
      };
      errors?: {};
    }>(``, {
      query: `
      query getLeagueById($leagueId: UUID!) {
        leagueById(leagueId: $leagueId) {
          id
          name
          startDate
          endDate
          leagueTypeId
          leagueTypeName
          clinics {
            clinicId
            clinicName
            leagueRankingForYear
            pointsTotalForYear
            leagueRankingForQuarter
            pointsTotalForQuarter
          }
        }
      }
      `,
      variables: {
        leagueId: leagueId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('getLeagueById Failed - Server connection error');
    }

    return response.data.data.leagueById;
  }

  async getClinicById(clinicId: string): Promise<ClinicDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: {
        clinicById: ClinicDto;
      };
      errors?: {};
    }>(``, {
      query: `
      query getClinicById($clinicId: UUID!) {
        clinicById(clinicId: $clinicId) {
          id
          name
          phoneNumber
          siteAddress {
            name
            addressLine1
            addressLine2
            addressLine3
            postalCode
            ward
            provinceId
            province {
              description
            }
          }
          league {
            id
            name
            startDate
            endDate
            leagueTypeId
            leagueTypeName
          }
          teamLeads {
            id
            firstName
            surname
            jobTitle
            phoneNumber
            whatsAppNumber
            welcomeMessage
          }
          clinicMembers {
            healthCareWorkerId
            firstName
            surname
            phoneNumber
            whatsAppNumber
            profileImageUrl
            welcomeMessage
            shareContactInfo
          }
          points {
            leagueRanking
            pointsTotal
            maxPointsTotal
            points {
              pointsCategoryId
              pointsTotal
              categoryName
            }
          }
        }
      }
      `,
      variables: {
        clinicId: clinicId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('getClinicById Failed - Server connection error');
    }

    return response.data.data.clinicById;
  }

  async getAvailableCaregiversForBreastFeedingClub(
    clinicId: string
  ): Promise<CaregiverBaseDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: {
        availableCaregiversForBreastFeedingClub: CaregiverBaseDto[];
      };
      errors?: {};
    }>(``, {
      query: `
      query getAvailableCaregiversForBreastFeedingClub($clinicId: UUID!) {
        availableCaregiversForBreastFeedingClub(clinicId: $clinicId) {
          caregiverId
          firstName
          surname
        }
      }
      `,
      variables: {
        clinicId: clinicId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'getAvailableCaregiversForBreastFeedingClub Failed - Server connection error'
      );
    }
    console.log(
      'response.data.data.availableCaregiversForBreastFeedingClub',
      response
    );

    return response.data.data.availableCaregiversForBreastFeedingClub;
  }

  async getBreastFeedingClubs(
    clinicId: string
  ): Promise<BreastFeedingClubDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: {
        breastFeedingClubs: BreastFeedingClubDto[];
      };
      errors?: {};
    }>(``, {
      query: `query getBreastFeedingClubs($clinicId: UUID!) {
          breastFeedingClubs(clinicId: $clinicId) {
            id
            meetingDate
            clientsAttendedConfirmed
            clients {
              caregiverId
              firstName
              surname
            }
          }
        }`,
      variables: {
        clinicId: clinicId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('getBreastFeedingClubs Failed - Server connection error');
    }

    console.log('response.data.data.breastFeedingClubs', response);

    return response.data.data.breastFeedingClubs;
  }

  async addBreastFeedingClub(
    input: AddBreastFeedingClubInputModelInput
  ): Promise<BreastFeedingClubDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { addBreastFeedingClub: BreastFeedingClubDto };
      errors?: {};
    }>(``, {
      query: `mutation addBreastFeedingClub($input: AddBreastFeedingClubInputModelInput) {
          addBreastFeedingClub(input: $input) {
            id
            meetingDate
            clientsAttendedConfirmed
            clients {
              caregiverId
              firstName
              surname
            }
          }
        }`,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('addBreastFeedingClub failed - Server connection error');
    }
    console.log('response.data.data.addBreastFeedingClub', response);

    return response.data.data.addBreastFeedingClub;
  }
}

export default CommunityService;
