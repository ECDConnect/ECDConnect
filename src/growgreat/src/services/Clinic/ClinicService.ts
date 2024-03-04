import { api } from '../axios.helper';
import { ClinicDto, Config } from '@ecdlink/core';

class ClinicService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getClinicById(clinicId: string): Promise<ClinicDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
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
            welcomMessage
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
              pointsLibraryId
              pointsTotal
              activityName
              subActivityName
            }
          }
        }
      }
      `,
      variables: {
        clinicId: clinicId,
      },
    });

    if (response.status !== 200) {
      throw new Error('getClinicById Failed - Server connection error');
    }

    return response.data.data.clinicById;
  }
}

export default ClinicService;
