import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { InviteDto } from '@ecdlink/core/src/models/dto/Invite/invite.dto';
class InviteService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getInvitesByPrincipalId(id: string): Promise<InviteDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query invitesByPrincipalId($id: String!) {
        invitesByPrincipalId(id: $id) {
          id
          isAccepted
          status
          acceptedDate
          rejectedDate
          insertedDate
          practitionerId
          principalId
          practitioner {
            id
            userId
            user {
              id
              firstName
              surname
              fullName
            }
          }
          principal {
            id
            userId
            user {
              id
              firstName
              surname
              fullName
            }
          }
          user {
            id
            phoneNumber
          }
        }
      }
    `,
      variables: {
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Failed to fetch invites by principal ID - Server connection error'
      );
    }

    return response.data.data.invitesByPrincipalId;
  }

  async getInviteByPractitionerId(id: string): Promise<InviteDto | null> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query inviteByPractitionerId($id: String!) {
  inviteByPractitionerId(id: $id) {
    id
    status
    isAccepted
    principalId
    practitionerId
    principal {
        userId
    }
  }
}
    `,
      variables: {
        id: id,
      },
    });

    return response.data?.data?.inviteByPractitionerId || null;
  }

  async getInviteByPractitionerIdNum(idNum: string): Promise<InviteDto | null> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query inviteByPractitionerIdNum($idNum: String!) {
  inviteByPractitionerIdNum(idNum: $idNum) {
    id
  }
}
    `,
      variables: {
        idNum: idNum,
      },
    });

    return response.data?.data?.inviteByPractitionerIdNum || null;
  }

  async setInviteAccptedOrRejected(
    id: string,
    isAccepted: boolean
  ): Promise<InviteDto | null> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation updateInviteStatus($id: String!, $isAccepted: Boolean!) {
        updateInviteStatus(id: $id, isAccepted: $isAccepted) {
          id
        }
      }
    `,
      variables: {
        id: id,
        isAccepted: isAccepted,
      },
    });

    return response.data.data.setInviteAccptedOrRejected;
  }

  async deleteInvite(id: string | undefined): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation RemoveInvite($id: String) {
          RemoveInvite(id: $id) {
          }
        }
      `,
      variables: {
        id: id,
      },
    });

    if (response.status !== 200) {
      throw new Error('Deleting invite failed - Server connection error');
    }

    return true;
  }
}

export default InviteService;
