import { Config, UserConsentDto, UserDto } from '@ecdlink/core';
import { UserConsentInput, UserModelInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';
class UserService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getUserById(userId: string): Promise<UserDto> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
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
          nickFirstName
          nickSurname
          nickFullName
          franchisorObjectData {
              id
              userId
              siteAddressId                
              areaOfOperation
              secondaryAreaOfOperation
              startDate
              siteAddress {
                  name
                  addressLine1
                  addressLine2
                  addressLine3
                  postalCode
                  ward
                  province {
                      description
                  }
              }
          }
          coachObjectData {
              id
              userId
              areaOfOperation
              secondaryAreaOfOperation
              startDate
              siteAddress {
                  name
                  addressLine1
                  addressLine2
                  addressLine3
                  postalCode
                  ward
                  province {
                      description
                  }
              }
          }
          principalObjectData {
              id
              userId
              attendanceRegisterLink
              maxChildren
              parentFees
              consentForPhoto
              languageUsedInGroups
              startDate
              siteAddress {
                  name
                  addressLine1
                  addressLine2
                  addressLine3
                  postalCode
                  ward
                  province {
                      description
                  }
              }
               documents {
                  id
                  reference
                  documentType {
                      name
                      description
                      enumId
                  }                    
              }  
              coachHierarchy
              principalHierarchy
              isPrincipal
              isTrainee
              isFundaAppAdmin
              notInvitedYet
              signature  
          }
          practitionerObjectData {
              id
              userId
              attendanceRegisterLink
              maxChildren
              parentFees
              consentForPhoto
              languageUsedInGroups
              startDate
              siteAddress {
                  name
                  addressLine1
                  addressLine2
                  addressLine3
                  postalCode
                  ward
                  province {
                      description
                  }
              }
               documents {
                  id
                  reference
                  documentType {
                      name
                      description
                      enumId
                  }                    
              }  
              coachHierarchy
              principalHierarchy
              isPrincipal
              isTrainee
              isFundaAppAdmin
              notInvitedYet
              signature
          }
          childObjectData {
              id
              userId
              caregiver {
                  firstName
                  surname
              }
              allergies
              disabilities
              otherHealthConditions
              documents {
                  id
                  reference
                  documentType {
                      name
                      description
                      enumId
                  }                    
              }                                
          }
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
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query GetAllUserConsent($createdUserId: String) {
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
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
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
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
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

  async updateUser(userId: string, user: UserModelInput): Promise<boolean> {
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
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
    const apiInstance = await api(Config.graphQlApi, this._accessToken);
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
}

export default UserService;
