import { api } from '../axios.helper';
import {
  Config,
  UserDto,
  PractitionerDto,
  PractitionerColleagues,
} from '@ecdlink/core';
import {
  MutationAddPractitionerToPrincipalArgs,
  MutationUpdatePractitionerContactInfoArgs,
} from '@ecdlink/graphql';

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
    const apiInstance = api(Config.graphQlApi, this._accessToken);
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
            dateLinked
            dateAccepted
            dateToBeRemoved
            isLeaving
            progress
            isCompletedBusinessWalkThrough
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
    const apiInstance = api(Config.graphQlApi, this._accessToken);
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
            dateLinked
            dateAccepted
            dateToBeRemoved
            isLeaving
            progress
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
    const apiInstance = api(Config.graphQlApi, this._accessToken);
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
            signingSignature
            dateLinked
            dateAccepted
            dateToBeRemoved
            isLeaving
            user {
              idNumber
              fullName
              firstName
              surname
              id
              email
              phoneNumber
              profileImageUrl
              roles {
                id
                name
              }
            }
            dateLinked
            dateAccepted
            dateToBeRemoved
            isLeaving
            progress
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
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
       query GetPractitionerByIdNumber($idNumber: String) {
          practitionerByIdNumber(idNumber: $idNumber) {
            appUser {
              id
              idNumber
              firstName
              surname
              userName
              practitionerObjectData {
                isRegistered
                isPrincipal
                id
                shareInfo
                principalHierarchy
                dateLinked
                dateAccepted
                dateToBeRemoved
                isLeaving
                progress

              }
            }
            note
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
    const apiInstance = api(Config.graphQlApi, this._accessToken);
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

  async getClassroomDetailsForPractitioner(
    userId: string
  ): Promise<{ principalName: string; name: string }> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query classroomDetailsForPractitioner($userId: String) {
          classroomDetailsForPractitioner(userId: $userId) {
            principalName
            name
            classroomGroupName
            id
            insertedDate
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

    return response.data.data.classroomDetailsForPractitioner;
  }

  async UpdatePractitionerShareInfo(
    practitionerId: string,
    principalId: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updatePractitionerShareInfo(
          $practitionerId: String
        ) {
          updatePractitionerShareInfo(
            practitionerId: $practitionerId
          )
        }
      `,
      variables: {
        practitionerId,
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
    status: boolean = true
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation UpdatePractitionerRegistered(
          $practitionerId: String
          $status: Boolean
        ) {
          updatePractitionerRegistered(
            practitionerId: $practitionerId
            status: $status
          )
        }
      `,
      variables: {
        practitionerId,
        status,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerRegistered;
  }

  async UpdatePractitionerProgress(
    practitionerId: string,
    progress: any
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updatePractitionerProgress(
          $practitionerId: String
          $progress: Decimal!
        ) {
          updatePractitionerProgress(
            practitionerId: $practitionerId
            progress: $progress
          )
        }
      `,
      variables: {
        practitionerId,
        progress,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'UpdatePractitionerProgress Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerProgress;
  }

  async AddPractitionerToPrincipal(
    input: MutationAddPractitionerToPrincipalArgs
  ): Promise<UserDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
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

  async UpdatePractitionerByid(
    practitionerId: string,
    input: MutationUpdatePractitionerContactInfoArgs
  ): Promise<PractitionerDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation updatePractitionerContactInfo($practitionerId: String, $firstName: String, $lastName: String, $phoneNumber: String, $email: String) {
        updatePractitionerContactInfo(practitionerId: $practitionerId, firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber, email: $email) {
            id
            idNumber
            firstName
            nickFirstName
            nickSurname
              email
            phoneNumber
        }
      }
      `,
      variables: {
        practitionerId,
        input,
      },
    });
    if (response.status !== 200) {
      throw new Error(
        'Update Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerContactInfo;
  }

  async UpdatePrincipalInvitation(
    practitionerId: string,
    principalId: string,
    accepted: boolean = true
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation updatePrincipalInvitation(
        $practitionerId: String
        $principalId: String
        $accepted: Boolean!
      ) {
        updatePrincipalInvitation(
          practitionerId: $practitionerId
          principalId: $principalId
          accepted: $accepted
        ) {
          leavingDate
          acceptedDate
          linkedDate
          leaving
        }
      }
      `,
      variables: {
        practitionerId,
        principalId,
        accepted,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Practitioner by ID number Failed - Server connection error'
      );
    }

    return response.data.data.updatePractitionerRegistered;
  }

  async displayMetrics(): Promise<PractitionerDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query displayMetrics($type: String) {
        displayMetrics(type: $type) {
      subject icon color message notes userId userType

        }
      }
      `,
    });

    if (response.status !== 200) {
      throw new Error('Display metrics Failed - Server connection error');
    }

    return response.data.data.displayMetrics;
  }

  async practitionerColleagues(
    userId: string
  ): Promise<PractitionerColleagues[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query practitionerColleagues($userId: String) {
        practitionerColleagues(userId: $userId) {
          name title nickName contactNumber classroomNames profilePhoto
        }
      }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Practitioner Colleagues Failed - Server connection error'
      );
    }

    return response.data.data.practitionerColleagues;
  }

  async getMoodleSessionForUserId(userId: string): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `
      query getMoodleSessionForUserId($userId: String) {
        getMoodleSessionForUserId(userId: $userId) {
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

    return response.data.data.getMoodleSessionForUserId;
  }
}

export default PractitionerService;
