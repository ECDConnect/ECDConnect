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
      query GetAllStatementsExpenses() {
        GetAllStatementsExpenses() {
            id description
            insertedDate
            notes
            userId
            submitted
            amount
            expenseTypeId
            incomeStatementId
            photoProof
            datePaid
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

  async GetAllStatementsExpensesType(): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllStatementsExpenseType() {
        GetAllStatementsExpenseType() {
            id description insertedDate notes
        }
    }
          `,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements expenses Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsExpenseType;
  }
}

export default ExpensesStatementsService;
