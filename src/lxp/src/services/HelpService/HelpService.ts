import { api } from '../axios.helper';
import { APIs, Config, HelpFormModel } from '@ecdlink/core';
class HelpService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async SendHelp(body: HelpFormModel): Promise<boolean> {
    const apiInstance = api(Config.authApi);
    const response = await apiInstance.post(
      APIs.submitUserHelpForm,
      JSON.stringify(body)
    );

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Send help message failed - Server connection error');
    }

    return true;
  }
}

export default HelpService;
