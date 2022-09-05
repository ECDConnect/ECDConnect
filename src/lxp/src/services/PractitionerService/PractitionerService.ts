import { api } from '../axios.helper';
import { Config, UserDto, PractitionerDto } from '@ecdlink/core';
import { MutationAddPractitionerToPrincipalArgs } from '@ecdlink/graphql';

class PractitionerService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getPractitionersForCoach(userId: string): Promise<PractitionerDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
        query allPractitionersForCoach($userId: String) {
          allPractitionersForCoach(userId: $userId) {
            id
            userId
          }
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioners For Coach Failed - Server connection error'
      );
    }

    return response.data.data.allPractitionersForCoach;
  }

  async getPractitionerById(id: string): Promise<PractitionerDto> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetPractitionerById($id: UUID) {
          GetPractitionerById(id: $id) {
            id
            userId
            user {
              firstName
              surname
              fullName
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
            isPrincipal
            isRegistered
            principalHierarchy
            attendanceRegisterLink
            maxChildren
            consentForPhoto
            parentFees
            languageUsedInGroups
            startDate
            monthSinceFranchisee
            shareInfo
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

  async getPractitionerByUserId(userId: string): Promise<PractitionerDto> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetPractitionerByUserId($userId: String) {
          practitionerByUserId(userId: $userId) {
            id
            userId
            user {
              id
              firstName
              surname
              fullName
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
            isPrincipal
            isRegistered
            principalHierarchy
            attendanceRegisterLink
            maxChildren
            consentForPhoto
            parentFees
            languageUsedInGroups
            startDate
            monthSinceFranchisee
            shareInfo
          }
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.practitionerByUserId;
  }

  async getAllPractitioners(): Promise<PractitionerDto[]> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllPractitioners {
          GetAllPractitioner {
            id
            userId
            isPrincipal
            isFundaAppAdmin
            isTrainee
            principalHierarchy
            isActive
            coachHierarchy
            isRegistered
            shareInfo
            user {
              idNumber
              fullName
              firstName
              surname
              id
              email
              phoneNumber
            }
          }
        }
      `,
    });

    if (response.status !== 200) {
      throw new Error('Get Practitioner Failed - Server connection error');
    }

    return response.data.data.GetAllPractitioner;
  }

  async getPractitionerByIdNumber(idNumber: string): Promise<UserDto> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
       query GetPractitionerByIdNumber($idNumber: String) {
          practitionerByIdNumber(idNumber: $idNumber) {
            id
            idNumber
            firstName
            surname
            userName
            practitionerObjectData {
              isRegistered
              id
            }
          }
        }
      `,
      variables: {
        idNumber,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.practitionerByIdNumber;
  }

  // promotePractitionerToPrincipal(userId: String): Practitioner
  async PromotePractitionerToPrincipal(userId: string): Promise<UserDto> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation promotePractitionerToPrincipal($userId: String) {
          promotePractitionerToPrincipal(userId: $userId) {
            id
            isPrincipal
            user {
              roles {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.promotePractitionerToPrincipal;
  }

  async UpdatePractitionerShareInfo(
    practitionerId: string,
    principalId: string
  ): Promise<boolean> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updatePractitionerShareInfo(
          $practitionerId: String
          $principalId: String
        ) {
          updatePractitionerShareInfo(
            practitionerId: $practitionerId
            principalId: $principalId
          )
        }
      `,
      variables: {
        practitionerId,
        principalId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerShareInfo;
  }

  async UpdatePractitionerRegistered(
    practitionerId: string,
    principalId: string
  ): Promise<boolean> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updatePractitionerShareInfo(
          $practitionerId: String
          $principalId: String
        ) {
          updatePractitionerShareInfo(
            practitionerId: $practitionerId
            principalId: $principalId
          )
        }
      `,
      variables: {
        practitionerId,
        principalId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerShareInfo;
  }

  async AddPractitionerToPrincipal(
    input: MutationAddPractitionerToPrincipalArgs
  ): Promise<UserDto> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation addPractitionerToPrincipal ($firstName: String, $idNumber: String, $lastName: String, $userId: String) {
          addPractitionerToPrincipal(
            firstName: $firstName
            idNumber: $idNumber
            lastName: $lastName
            userId: $userId
          ) {
            userId
            isActive
          }
        }
      `,
      variables: {
        userId: input.userId,
        idNumber: input.idNumber,
        firstName: input.firstName,
        lastName: input.lastName,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.addPractitionerToPrincipal;
  }
}

export default PractitionerService;
