import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';

class ExpensesStatementsService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async GetAllStatementsExpenses(): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query {
            GetAllStatementsExpenses {
              id insertedDate notes
          }
        }
          `,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements expenses Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsExpenses;
  }
}

export default ExpensesStatementsService;
