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
      query: `query GetAllStatementsIncomeType() {
          GetAllStatementsIncomeType() {
            id description insertedDate notes
          }
        }`,
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
      query: `query GetAllStatementsPayType() {
          GetAllStatementsPayType() {
            id description insertedDate notes
          }
        }`,
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
      query: `query incomeStatements($userId: UUID!, $startDate: DateTime!, $endDate: DateTime) { 
          incomeStatements(userId: $userId, startDate: $startDate, endDate: $endDate) { 
            id 
            month
            year
            contactedByCoach
            downloaded
            incomeItems {
              incomeTypeId
              id
              dateReceived
              amount
              childUserId
              notes
              numberOfChildrenCovered
              payTypeId
              photoProof
              description
            } 
            expenseItems {
              expenseTypeId
              id
              datePaid
              amount
              notes
              photoProof
            }    
          }
        }`,
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
      query: `mutation UpdateIncomeStatement($input: IncomeStatementModelInput) {      
          updateIncomeStatement(input: $input) {
            id 
            month
            year
            downloaded
            incomeItems {
              incomeTypeId
              id
              dateReceived
              amount
              childUserId
              notes
              numberOfChildrenCovered
              payTypeId
              photoProof
            } 
            expenseItems {
              expenseTypeId
              id
              datePaid
              amount
              notes
              photoProof
            }
          } 
        }`,
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

  // Used to generate the PDF, can we refactor to fetch a link to the backend PDF,
  // or to use the income statement to create the pdf? Then it could work offline?
  async getMonthsIncomeExpensesReport(
    statementId: string
  ): Promise<ReportTableDataDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `query GetStatementsIncomeExpensesPDFData($statementId: UUID!) {
          statementsIncomeExpensesPDFData(statementId: $statementId) {
          tableName
          type
          total
          headers {
              header
              dataKey
          }
          data {
              child
              date
              description
              amount
              invoiceNr
              photoProof
              type
          }
        }
      }`,
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

  async updateUserContactStatusForStatement(
    statementId: string
  ): Promise<IncomeStatementDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateUserContactStatusForStatement: IncomeStatementDto };
    }>(``, {
      query: `
        mutation UpdateUserContactStatusForStatement($statementId: UUID!) {
          updateUserContactStatusForStatement(statementId: $statementId) {
            id 
            month
            year
            downloaded
            incomeItems {
              incomeTypeId
              id
              dateReceived
              amount
              childUserId
              notes
              numberOfChildrenCovered
              payTypeId
              photoProof
            } 
            expenseItems {
              expenseTypeId
              id
              datePaid
              amount
              notes
              photoProof
            }
          }
        }
      `,
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
      query: `query GetIncomeStatementPdf($statementId: UUID!) { 
          incomeStatementPdf(statementId: $statementId) { 
    }}`,
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
