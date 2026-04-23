import { api } from '../axios.helper';
import {
  Config,
  ReportTableDataDto,
  IncomeStatementsTypes,
  StatementsPayTypes,
  IncomeStatementDto,
} from '@ecdlink/core';

class IncomeStatementsService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async GetAllStatementsIncomeType(): Promise<IncomeStatementsTypes[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllStatementsIncomeType',
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements income Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsIncomeType;
  }

  async GetAllStatementsPayType(): Promise<StatementsPayTypes[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllStatementsPayType',
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements pay types Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsPayType;
  }

  async getIncomeStatements(
    userId: string,
    startDate: Date,
    endDate: Date | undefined
  ): Promise<IncomeStatementDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'incomeStatements',
      variables: {
        userId,
        startDate,
        endDate,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('Get income statements Failed - Server connection error');
    }

    return response.data.data.incomeStatements;
  }

  async updateStatement(
    input: IncomeStatementDto
  ): Promise<IncomeStatementDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<{
      data: { updateIncomeStatement: IncomeStatementDto };
      errors?: {};
    }>(``, {
      id: 'UpdateIncomeStatement',
      variables: {
        input: {
          id: input.id,
          month: input.month,
          year: input.year,
          incomeItems: input.incomeItems,
          expenseItems: input.expenseItems,
          contactedByCoach: input.contactedByCoach,
          downloaded: input.downloaded,
        },
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Update income statement Failed - Server connection error'
      );
    }

    return response.data.data.updateIncomeStatement;
  }

  async getMonthsIncomeExpensesReport(
    statementId: string
  ): Promise<ReportTableDataDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetStatementsIncomeExpensesPDFData',
      variables: {
        statementId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all income statementsreports Failed - Server connection error'
      );
    }
    return response.data.data.statementsIncomeExpensesPDFData;
  }

  async GetAllStatementsExpensesType(): Promise<any[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetAllStatementsExpenseType',
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements expenses Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsExpenseType;
  }

  async updateUserContactStatusForStatement(
    statementId: string
  ): Promise<IncomeStatementDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateUserContactStatusForStatement: IncomeStatementDto };
    }>(``, {
      id: 'UpdateUserContactStatusForStatement',
      variables: {
        statementId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Updating User Contact Status For Statement failed - Server connection error'
      );
    }

    return response.data.data.updateUserContactStatusForStatement;
  }

  async getIncomeStatementPdf(statementId: string): Promise<string> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      id: 'GetIncomeStatementPdf',
      variables: {
        statementId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Get income statement pdf Failed - Server connection error'
      );
    }

    return response.data.data.incomeStatementPdf;
  }
}

export default IncomeStatementsService;
