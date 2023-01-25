import { api } from '../axios.helper';
import { Config } from '@ecdlink/core';
import { StatementsIncomeInput } from '@/../../../packages/graphql/lib';

class IncomeStatementsService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async GetAllStatementsIncomeStatement(): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllStatementsIncomeStatement() {
        GetAllStatementsIncomeStatement() {
            id
            insertedDate
            notes
            userId
            incomeTotal
            expenseTotal
            balance
            submittedDate
            submitted
            month
            year
            period
        }
    }
          `,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements income Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsIncomeStatement;
  }

  async GetAllStatementsIncomeType(): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllStatementsIncomeType() {
        GetAllStatementsIncomeType() {
            id description insertedDate notes
        }
    }
          `,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements income Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsIncomeType;
  }

  async GetAllStatementsFeeType(): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllStatementsFeeType() {
        GetAllStatementsFeeType() {
            id description insertedDate notes
        }
    }
          `,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements fee types Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsFeeType;
  }

  async GetAllStatementsContributionType(): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllStatementsContributionType() {
        GetAllStatementsContributionType() {
            id description insertedDate notes
        }
    }
          `,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements contribution types Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsContributionType;
  }

  async GetAllStatementsPayType(): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllStatementsPayType() {
        GetAllStatementsPayType() {
            id description insertedDate notes
        }
    }
          `,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements pay types Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsPayType;
  }

  async UpdateStatementsIncome(
    id: string,
    input: StatementsIncomeInput
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation updateStatementsIncome($input: StatementsIncomeInput, $id: UUID) {
          updateStatementsIncome(input: $input, id: $id) {
                id    __typename  
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
        'Update income statement Failed - Server connection error'
      );
    }

    return response.data.data.updateStatementsIncome;
  }
}

export default IncomeStatementsService;
