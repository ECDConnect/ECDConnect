import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { PractitionerDto } from '@ecdlink/core';
class PractitionerService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getPractitionerById(id: number): Promise<PractitionerDto> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetPractitionerById($id: Int) {
          GetPractitionerById(id: $id) {
            id
            user {
              firstName
              surname
              email
              isSouthAfricanCitizen
              verifiedByHomeAffairs
            }
            siteAddress {
              id
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
            attendanceRegisterLink
            maxChildren
            consentForPhoto
            parentFees
            languageUsedInGroups
            startDate
            monthSinceFranchisee
            signingSignature
            coachHierarchy
            principalHierarchy
            isLeaving
            dateLinked
            dateToBeRemoved
            dateAccepted
          }
        }
      `,
      variables: {
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.GetPractitionerById;
  }
}

export default PractitionerService;
