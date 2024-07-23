import { CaregiverDto, Config } from '@ecdlink/core';
import { CaregiverInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class CaregiverService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  // Can remove, fetching it with the child
  async getCaregivers(): Promise<CaregiverDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query {
          allCaregiver {
            id
            phoneNumber
            idNumber
            firstName
            surname
            fullName  
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
            relationId
            educationId
            emergencyContactFirstName
            emergencyContactSurname
            emergencyContactPhoneNumber
            additionalFirstName
            additionalSurname
            additionalPhoneNumber
            joinReferencePanel
            contribution
            grants {
              id
              description
            }
            isActive
            isAllowedCustody
          }
        }        
      `,
    });

    if (response.status !== 200) {
      throw new Error('Getting Caregivers failed - Server connection error');
    }

    return response.data.data.allCaregiver;
  }

  async updateCareGiver(
    id: string,
    input: CaregiverInput
  ): Promise<CaregiverDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateCaregiver($input: CaregiverInput, $id: UUID) {
          updateCaregiver(input: $input, id: $id) {
            id
            phoneNumber
            idNumber
            firstName
            surname
            fullName  
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
            relationId
            educationId
            emergencyContactFirstName
            emergencyContactSurname
            emergencyContactPhoneNumber
            additionalFirstName
            additionalSurname
            additionalPhoneNumber
            joinReferencePanel
            contribution
            grants {
              id
              description
            }
            isActive
            isAllowedCustody
          }
        }
      `,
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating caregiver failed - Server connection error');
    }

    return response.data.data.updateCaregiver;
  }

  async createCaregiver(input: CaregiverInput): Promise<CaregiverDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation createCaregiver($input: CaregiverInput) {
          createCaregiver(input: $input) {
            id
            phoneNumber
            idNumber
            firstName
            surname
            fullName  
            siteAddressId          
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
            relationId
            educationId
            emergencyContactFirstName
            emergencyContactSurname
            emergencyContactPhoneNumber
            additionalFirstName
            additionalSurname
            additionalPhoneNumber
            joinReferencePanel
            contribution
            grants {
              id
              description
            }
            isActive
          }
        }
      `,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating caregiver failed - Server connection error');
    }

    return response.data.data.createCaregiver;
  }

  async updateCareGiverGrants(
    childUserId: string,
    grantIds: string[]
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateCaregiverGrants: boolean };
      errors?: {};
    }>(``, {
      query: `mutation updateCareGiverGrants($childUserId: UUID!, $grantIds: [UUID!] ) {
        updateCareGiverGrants(childUserId: $childUserId, grantIds: $grantIds)
      }`,
      variables: {
        childUserId: childUserId,
        grantIds: grantIds,
      },
    });

    if (
      response.status !== 200 ||
      response.data.data.updateCaregiverGrants == false ||
      !!response.data.errors
    ) {
      throw new Error('Updating caregiver failed - Server connection error');
    }

    return response.data.data.updateCaregiverGrants;
  }
}

export default CaregiverService;
