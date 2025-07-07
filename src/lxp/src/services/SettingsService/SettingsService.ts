import { Config, SettingTypeDto } from '@ecdlink/core';
import { api } from '../axios.helper';
class SettingsService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getSettingType(): Promise<SettingTypeDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query {
          settings {
            Reporting{
              ChildProgressReportMonths
            }
            Children {
              ChildInitialObservationPeriod
              ChildExpiryTime
            }
          }
        }
          `,
    });

    if (response.status !== 200) {
      throw new Error('Get Settings Failed - Server connection error');
    }

    return response.data.data.settings;
  }

  async queryChangesToSync(lastUpdated: string): Promise<boolean> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query queryChangesToSync (
        $lastUpdated: DateTime!) {
        changesToSync(
            lastUpdated: $lastUpdated
               ) {
    }
    }
          `,
      variables: {
        lastUpdated: lastUpdated,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Changes To Sync Failed - Server connection error');
    }

    return response.data.data.changesToSync;
  }
}

export default SettingsService;
