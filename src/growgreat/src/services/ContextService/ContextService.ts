import { Config } from '@ecdlink/core';
import { api } from '../axios.helper';

class ContextService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async tenantContext(): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query {
       tenantContext {  
        id adminSiteAddress siteAddress applicationName organisationName tenantType themePathVar var1 var2 moodleUrlVar 
      }
    }
      `,
      variables: {},
    });

    if (response.status !== 200) {
      throw new Error('Get Context failed - Server connection error');
    }

    return response.data.data.tenantContext;
  }
}

export default ContextService;
