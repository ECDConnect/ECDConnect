import {
  CommunityProfile,
  CommunityProfileInputModelInput,
  Connect,
  ConnectItem,
} from '@ecdlink/graphql/lib';
import { api } from '../axios.helper';
import { CommunityProfileDto, Config } from '@ecdlink/core';

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

  async getCommunityProfile(userId: string): Promise<CommunityProfile> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post(``, {
      query: `
      query GetCommunityProfile($userId: UUID!) {
          communityProfile(userId: $userId) {            
            id
            userId
            aboutShort
            aboutLong
            shareContactInfo
            shareEmail            
            sharePhoneNumber
            shareProfilePhoto
            shareProvince
            provinceId
            provinceName
            shareRole
            clickedECDHeros
            coachUserId
            coachName
            coachPhoneNumber
            completenessPerc
            completenessPercColor
            completenessPercImage
            insertedDate
            profileSkills {
                id
                name
                imageName
                description
                isActive
                ordering
            }
            communityUser {
                id
                fullName
                email
                phoneNumber
                whatsAppNumber
                profilePhoto
                roleName
            }
            acceptedConnections {
                id
                userId
                aboutShort
                aboutLong
                shareEmail
                sharePhoneNumber
                shareProfilePhoto
                shareProvince
                provinceId
                provinceName
                shareRole
                communityUser {
                    id
                    fullName
                    email
                    phoneNumber
                    whatsAppNumber
                    profilePhoto
                    roleName
                }
            }
            pendingConnections {
                id
                userId
                aboutShort
                aboutLong
                shareEmail
                sharePhoneNumber
                shareProfilePhoto
                shareProvince
                provinceId
                provinceName
                shareRole
                communityUser {
                    id
                    fullName
                    email
                    phoneNumber
                    whatsAppNumber
                    profilePhoto
                    roleName
                }
            }
          }
        }
      `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get community profile Failed - Server connection error');
    }
    return response.data.data.communityProfile;
  }

  async saveCommunityProfile(
    input: CommunityProfileInputModelInput
  ): Promise<CommunityProfileDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation SaveCommunityProfile($input: CommunityProfileInputModelInput) {
          saveCommunityProfile(input: $input) {            
           id
            userId
            aboutShort
            aboutLong
            shareContactInfo
            shareEmail            
            sharePhoneNumber
            shareProfilePhoto
            shareProvince
            provinceId
            provinceName
            shareRole
            clickedECDHeros
            coachUserId
            coachName
            completenessPerc
            completenessPercColor
            completenessPercImage
            insertedDate
            profileSkills {
                id
                name
                imageName
                description
                isActive
                ordering
            }
            communityUser {
                id
                fullName
                email
                phoneNumber
                whatsAppNumber
                profilePhoto
                roleName
            }
            acceptedConnections {
                id
                userId
                aboutShort
                aboutLong
                shareEmail
                sharePhoneNumber
                shareProfilePhoto
                shareProvince
                provinceId
                provinceName
                shareRole
                communityUser {
                    id
                    fullName
                    email
                    phoneNumber
                    whatsAppNumber
                    profilePhoto
                    roleName
                }
            }
            pendingConnections {
                id
                userId
                aboutShort
                aboutLong
                shareEmail
                sharePhoneNumber
                shareProfilePhoto
                shareProvince
                provinceId
                provinceName
                shareRole
                communityUser {
                    id
                    fullName
                    email
                    phoneNumber
                    whatsAppNumber
                    profilePhoto
                    roleName
                }
            }
        }
}
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Updating practitioner community status failed - Server connection error'
      );
    }

    return response.data.data.saveCommunityProfile;
  }
}

export default CommunityService;
