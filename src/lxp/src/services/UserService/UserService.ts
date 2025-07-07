import { Config, UserConsentDto, UserDto } from '@ecdlink/core';
import {
  UserByToken,
  UserConsentInput,
  UserModelInput,
  UserSyncStatus,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';

class UserService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getUserById(userId: string): Promise<UserDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query userById($userId: String) {
          userById(userId: $userId) {
            id
            userName
            email
            isSouthAfricanCitizen
            verifiedByHomeAffairs
            dateOfBirth
            idNumber   
            isImported   
            resetData      
            firstName
            surname
            fullName
            raceId
            languageId
            emergencyContactFirstName
            emergencyContactSurname
            emergencyContactPhoneNumber
            nextOfKinContactNumber
            nextOfKinFirstName
            nextOfKinSurname
            contactPreference
            genderId
            principalObjectData  {
              isPrincipal
            }
            phoneNumber
            profileImageUrl
            roles {
              id
              name
              systemName
            }   
            resetData         
          }
        }
      `,
      variables: {
        userId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Users Failed - Server connection error');
    }

    return response.data.data.userById;
  }

  async getUserConsents(userId: string): Promise<UserConsentDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllUserConsent($createdUserId: UUID) {
          GetAllUserConsent (where: {
            and: [{ 
              createdUserId: {eq: $createdUserId}
            }]
          }) {
            id
            isActive
            consentId
            consentType
            userId
            createdUserId
            insertedDate            
          }
        }        
      `,
      variables: {
        createdUserId: userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Getting GetAllUserConsent failed - Server connection error'
      );
    }

    return response.data.data.GetAllUserConsent;
  }

  async updateUserConsents(
    id: string,
    input: UserConsentInput
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateUserConsent($id: UUID!,$input: UserConsentInput) {
          updateUserConsent(id: $id, input: $input) {
            id
          }
        }
      `,
      variables: {
        id: id,
        input: input,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating UserConsent failed - Server connection error');
    }

    return true;
  }

  async resetUserPassword(
    userId: string,
    newPassword: string
  ): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation resetUserPassword($id: String!, $newPassword: String!) {
          resetUserPassword(id: $id, newPassword: $newPassword)
        }
      `,
      variables: {
        id: userId,
        newPassword: newPassword,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Resetting User Password failed - Server connection error'
      );
    }

    return true;
  }

  async getUserSyncStatus(
    userId: string,
    lastSyncDate: Date,
    classroomId: string
  ): Promise<UserSyncStatus> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query getUserSyncStatus($userId: UUID!, $lastSync: DateTime!, $classroomId: UUID!) {
        userSyncStatus(userId: $userId, lastSync: $lastSync, classroomId: $classroomId) {
          syncChildren
          syncClassroom
          syncReportingPeriods
          syncPoints
          syncPermissions
        }
      }
      `,
      variables: {
        userId: userId,
        lastSync: lastSyncDate,
        classroomId: classroomId,
      },
    });

    if (response.status !== 200) {
      throw new Error('User Sync Status failed - Server connection error');
    }

    return response.data.data.userSyncStatus;
  }

  async updateUser(userId: string, user: UserModelInput): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateUser($id: String!, $input: UserModelInput) {
          updateUser(id: $id, input: $input) {
            id
          }
        }
      `,
      variables: {
        id: userId,
        input: user,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating User failed - Server connection error');
    }

    return true;
  }

  async addUser(user: UserModelInput): Promise<UserDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation addUser($input: UserModelInput) {
        addUser(input: $input) {
          id
          userName
          email
          isSouthAfricanCitizen
          verifiedByHomeAffairs
          dateOfBirth
          idNumber            
          firstName
          surname
          fullName
          contactPreference
          genderId
          phoneNumber
          profileImageUrl
          roles {
            id
            name
          }            
        }
      }
      `,
      variables: {
        input: user,
      },
    });

    if (response.status !== 200) {
      throw new Error('Updating User failed - Server connection error');
    }

    return response.data.data.addUser;
  }

  async getUserByToken(token: string): Promise<UserByToken> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query userByToken($token: String) {          
        userByToken(token: $token) {      
          fullName 
          phoneNumber 
          roleName 
          userId   
        }        
      }
      `,
      variables: {
        token: token,
      },
    });

    if (response.status !== 200) {
      throw new Error('Cannot retrieve usre by token');
    }

    return response.data.data.userByToken;
  }
}

export default UserService;
