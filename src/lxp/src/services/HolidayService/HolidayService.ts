import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { HolidayDto } from '@ecdlink/core';
class HolidayService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getHolidaysByYear(year: number): Promise<HolidayDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'holidaysByYear',
      variables: {
        year: year,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Holidays Failed - Server connection error');
    }

    return response.data.data.holidaysByYear;
  }

  async getHolidaysByDateRange(
    startMonth: string,
    endMonth: string
  ): Promise<HolidayDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'holidaysByMonth',
      variables: {
        startMonth: startMonth,
        endMonth: endMonth,
      },
    });

    if (response.status !== 200) {
      throw new Error('Get Holidays Failed - Server connection error');
    }

    return response.data.data.holidaysByMonth;
  }
}

export default HolidayService;
