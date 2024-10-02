import {
  AcceptRejectCommunityRequestsInputModelInput,
  CoachFeedbackInputModelInput,
  CommunityConnectInputModelInput,
  CommunityProfile,
  CommunityProfileInputModelInput,
  Connect,
  ConnectItem,
  FeedbackTypeSortInput,
  SupportRatingSortInput,
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
                connectionAccepted
                communityUser {
                    id
                    fullName
                    email
                    phoneNumber
                    whatsAppNumber
                    profilePhoto
                    roleName
                }
                      profileSkills {
                id
                name
                imageName
                description
                isActive
                ordering
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
                connectionAccepted
                communityUser {
                    id
                    fullName
                    email
                    phoneNumber
                    whatsAppNumber
                    profilePhoto
                    roleName
                }
                      profileSkills {
                id
                name
                imageName
                description
                isActive
                ordering
            }
            }
            userConnectionRequests {
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
                connectionAccepted
                communityUser {
                    id
                    fullName
                    email
                    phoneNumber
                    whatsAppNumber
                    profilePhoto
                    roleName
                }
                      profileSkills {
                id
                name
                imageName
                description
                isActive
                ordering
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
                      profileSkills {
                id
                name
                imageName
                description
                isActive
                ordering
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
                      profileSkills {
                id
                name
                imageName
                description
                isActive
                ordering
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
        'Saving practitioner community profile failed - Server connection error'
      );
    }

    return response.data.data.saveCommunityProfile;
  }

  async getUsersToConnectWith(
    userId: string,
    provinceIds: string[],
    communitySkillIds: string[],
    connectionTypes: string[]
  ): Promise<CommunityProfile[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post(``, {
      query: `
      query GetUsersToConnectWith($userId: UUID!, $provinceIds: [UUID!], $communitySkillIds: [UUID!], $connectionTypes: [String]) {
    usersToConnectWith(userId: $userId, provinceIds: $provinceIds, communitySkillIds: $communitySkillIds, connectionTypes: $connectionTypes) {
        id
            userId
            aboutShort
            aboutLong
            shareContactInfo
            shareEmail            
            sharePhoneNumber
            shareProfilePhoto
            shareProvince
                        profileSkills {
                id
                name
                imageName
                description
                isActive
                ordering
            }
            provinceId
            provinceName
            shareRole
            insertedDate
             communityUser {
                id
                fullName
                email
                phoneNumber
                whatsAppNumber
                profilePhoto
                roleName
            }
            connectionAccepted
    }
}
      `,
      variables: {
        userId,
        provinceIds,
        communitySkillIds,
        connectionTypes,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get community ECD heroes Failed - Server connection error'
      );
    }
    return response.data.data.usersToConnectWith;
  }

  async getOtherConnections(
    userId: string,
    provinceIds: string[],
    communitySkillIds: string[]
  ): Promise<CommunityProfile[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post(``, {
      query: `
      query GetOtherConnections($userId: UUID!, $provinceIds: [UUID!], $communitySkillIds: [UUID!]) {
    otherConnections(userId: $userId, provinceIds: $provinceIds, communitySkillIds: $communitySkillIds) {
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
            insertedDate
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
      `,
      variables: {
        userId,
        provinceIds,
        communitySkillIds,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get community ECD heroes Failed - Server connection error'
      );
    }
    return response.data.data.otherConnections;
  }

  async saveCommunityProfileConnections(
    input: CommunityConnectInputModelInput[]
  ): Promise<CommunityConnectInputModelInput[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation SaveCommunityProfileConnections($input: [CommunityConnectInputModelInput]) {
    saveCommunityProfileConnections(input: $input) {
        fromCommunityProfileId
        toCommunityProfileId
    }
}
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Updating practitioner community connections failed - Server connection error'
      );
    }

    return response.data.data.saveCommunityProfileConnections;
  }

  async cancelCommunityRequest(
    input: CommunityConnectInputModelInput
  ): Promise<CommunityConnectInputModelInput> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation CancelCommunityRequest($input: CommunityConnectInputModelInput) {
    cancelCommunityRequest(input: $input) {
        fromCommunityProfileId
        toCommunityProfileId
        isActive
    }
}
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Updating cancel community connection failed - Server connection error'
      );
    }

    return response.data.data.saveCommunityProfileConnections;
  }

  async saveCoachFeedback(
    input: CoachFeedbackInputModelInput
  ): Promise<CoachFeedbackInputModelInput> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation SaveCoachFeedback($input: CoachFeedbackInputModelInput) {
    saveCoachFeedback(input: $input) {
        id
        fromUserId
        toUserId
        supportRatingId
        feedbackDetails
        coachFeedbackTypes {
            id
            feedbackTypeId
        }
    }
}
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Saving coach feedback failed - Server connection error');
    }

    return response.data.data.saveCoachFeedback;
  }

  async getFeedbackTypes(): Promise<FeedbackTypeSortInput> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post(``, {
      query: `
      query GetFeedbackTypes() {
    feedbackTypes() {
        id
        name
        ordering
    }
}
      `,
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Get community ECD heroes Failed - Server connection error'
      );
    }
    return response.data.data.feedbackTypes;
  }

  async getSupportRatings(): Promise<SupportRatingSortInput> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post(``, {
      query: `
      query GetSupportRatings() {
    supportRatings() {
        id
        name
        imageName
        ordering
    }
}
      `,
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Get support ratings Failed - Server connection error');
    }
    return response.data.data.supportRatings;
  }

  async acceptCommunityRequests(
    input: AcceptRejectCommunityRequestsInputModelInput
  ): Promise<CommunityProfileDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation AcceptRejectCommunityRequests($input: AcceptRejectCommunityRequestsInputModelInput) {
    acceptRejectCommunityRequests(input: $input) {
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
             
             userConnectionRequests {
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
                connectionAccepted
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
        'Accepting community connections requests failed - Server connection error'
      );
    }

    return response.data.data.acceptRejectCommunityRequests;
  }

  async deleteCommunityProfile(communityProfileId: string): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation DeleteCommunityProfile($communityProfileId: UUID!) {
    deleteCommunityProfile(communityProfileId: $communityProfileId) {
     
    }
}
      `,
      variables: {
        communityProfileId,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error(
        'Deleting practitioner community profile failed - Server connection error'
      );
    }

    return response.data.data.deleteCommunityProfile;
  }
}

export default CommunityService;
