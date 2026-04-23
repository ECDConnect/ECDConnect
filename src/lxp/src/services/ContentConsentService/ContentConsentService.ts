import { Config, ConsentDto, ContentConsentTypeEnum } from '@ecdlink/core';
import { api } from '../axios.helper';

class ContentConsentService {
  _locale: string;
  _accessToken: string;

  constructor(locale: string, accessToken: string) {
    this._locale = locale;
    this._accessToken = accessToken;
  }

  async getConsent(): Promise<ConsentDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      id: 'GetAllConsent',
      variables: {
        locale: this._locale,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Consent forms failed - Server connection error');
    }

    return response.data.data.GetAllConsent;
  }

  async getOpenConsent(name: ContentConsentTypeEnum): Promise<ConsentDto[]> {
    const apiInstance = api(Config.graphQlApi);

    const response = await apiInstance.post<any>(``, {
      id: 'openConsent',
      variables: {
        locale: this._locale,
        name: name,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Consent forms failed - Server connection error');
    }

    return response.data.data.openConsent;
  }
}

export default ContentConsentService;
