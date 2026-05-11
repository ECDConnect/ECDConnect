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
      id: 'invitesByPrincipalId',
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
      id: 'inviteByPractitionerId',
      variables: {
        id: id,
      },
    });

    return response.data?.data?.inviteByPractitionerId || null;
  }

  async getInviteByPractitionerIdNum(idNum: string): Promise<InviteDto | null> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'inviteByPractitionerIdNum',
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
      id: 'updateInviteStatus',
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
      id: 'RemoveInvite',
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
