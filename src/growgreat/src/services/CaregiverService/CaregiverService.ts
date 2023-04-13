import { CaregiverDto, Config } from '@ecdlink/core';
import { CaregiverInput, CaregiverClients } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class CaregiverService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

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
          }
        }        
      `,
    });

    if (response.status !== 200) {
      throw new Error('Getting Caregivers failed - Server connection error');
    }

    return response.data.data.allCaregiver;
  }

  async getCaregiversForHealthCareWorker(id: string): Promise<CaregiverDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query getAllCaregiversForHealthCareWorker($id: String) {
          allCaregiversForHealthCareWorker(id: $id) {
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
          }
        }        
        `,
      variables: {
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error('Getting Caregivers failed - Server connection error');
    }

    return response.data.data.allCaregiversForHealthCareWorker;
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

  async getCaregiverClients(caregiverId: string): Promise<CaregiverClients> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { caregiverClients: CaregiverClients };
      errors?: {};
    }>(``, {
      query: `
        query GetCaregiverClients($caregiverId: String) {
          caregiverClients(caregiverId: $caregiverId) {
              mother {
                  id
                  user {
                    id
                    firstName
                  }
                  statusInfo {
                      subject
                      icon
                      color
                      notes
                  }
              }
              infants {
                  id 
                  user {
                    id
                    firstName
                  }
                  statusInfo {
                      subject
                      icon
                      color
                      notes
                  }
              }
          }
        }
      `,
      variables: {
        caregiverId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get Get Caregiver Clients - Server connection error');
    }

    return response.data.data.caregiverClients;
  }
}

export default CaregiverService;
