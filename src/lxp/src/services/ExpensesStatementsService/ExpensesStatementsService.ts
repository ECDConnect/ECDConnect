import { api } from '../axios.helper';
import { Config, ExpensesStatementsDto } from '@ecdlink/core';
import { StatementsExpensesInput } from '@/../../../packages/graphql/lib';

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
            statementsIncomeStatementId
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

  async UpdateStatementsExpense(
    id: string,
    input: StatementsExpensesInput
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
              mutation updateExpense($id: String!, $input: StatementsExpensesInput ) { 
                updateExpense( id: $id, input: $input) {
                  result  resultObject resultMessage 
                 }
               }
      `,
      variables: {
        id,
        input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Update expense statement Failed - Server connection error'
      );
    }

    return response.data.data.updateStatementsExpenses;
  }

  async allStatementsExpenses(
    userId: string,
    month: Number,
    year: Number
  ): Promise<ExpensesStatementsDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query allStatementsExpenses($userId: String, $month: Int!, $year: Int!) {
        allStatementsExpenses(userId: $userId, month: $month, year: $year) {
            id description 
            insertedDate 
            notes 
            expenseTypeId 
            userId 
            submitted 
            amount 
            datePaid
            insertedDate
            statementsIncomeStatementId
            photoProof
        }
    }
          `,
      variables: {
        userId,
        month,
        year,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements expenses Failed - Server connection error'
      );
    }
    return response.data.data.allStatementsExpenses;
  }
}

export default ExpensesStatementsService;
