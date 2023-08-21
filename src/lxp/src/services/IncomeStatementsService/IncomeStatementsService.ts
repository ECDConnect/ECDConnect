import { api } from '../axios.helper';
import {
  BalanceSheetDto,
  Config,
  IncomeStatementsDto,
  ReportTableDataDto,
  IncomeStatementPDFDocInput,
} from '@ecdlink/core';
import {
  StatementsIncomeInput,
  StatementsSubmitInput,
} from '@/../../../packages/graphql/lib';

class IncomeStatementsService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async GetAllStatementsIncome(): Promise<IncomeStatementsDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllStatementsIncome() {
        GetAllStatementsIncome() {
          amount
          amountExpected
          childCoverAmount
          childUserId?
          contributionTypeId
          dateReceived
          description
          id
          incomeStatementId
          incomeTypeId
          insertedDate
          isActive
          notes
          payTypeId
          photoProof
          submitted
          updatedBy
          updatedDate
          userId
        }
    }
          `,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements income Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsIncome;
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
      mutation updateIncome($id: String!, $input: StatementsIncomeInput ) { 
         updateIncome( id: $id, input: $input) {
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
        'Update income statement Failed - Server connection error'
      );
    }

    return response.data.data.updateStatementsIncome;
  }

  async saveIncomeStatementPDF(
    input: IncomeStatementPDFDocInput
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation saveIncomeStatementPDF($input: IncomeStatementPDFDocInput) { 
         saveIncomeStatementPDF(input: $input) {
          id
          }
        }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Submit income report statement Failed - Server connection error'
      );
    }

    return response.data.data.saveIncomeStatementPDF;
  }

  async getMonthsIncomeExpensesReport(
    userId: string,
    month: Number,
    year: Number
  ): Promise<ReportTableDataDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `query GetStatementsIncomeExpensesPDFData($userId: String, $month: Int!, $year: Int!) {
                statementsIncomeExpensesPDFData(userId: $userId, month: $month, year: $year) {
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
        userId,
        month,
        year,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all income statementsreports Failed - Server connection error'
      );
    }
    return response.data.data.statementsIncomeExpensesPDFData;
  }

  async allStatementsIncome(
    userId: string,
    month: Number,
    year: Number
  ): Promise<IncomeStatementsDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query allStatementsIncome($userId: String, $month: Int!, $year: Int!) {
        allStatementsIncome(userId: $userId, month: $month, year: $year) {
            id description 
            insertedDate 
            notes 
            childUserId 
            userId 
            submitted 
            amount 
            amountExpected 
            contributionTypeId 
            payTypeId 
            incomeStatementId 
            incomeTypeId
            photoProof
            childCoverAmount
            dateReceived
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
        'Get all statements income Failed - Server connection error'
      );
    }

    return response.data.data.allStatementsIncome;
  }

  async allStatementsIncomeStatement(
    userId: string
  ): Promise<IncomeStatementsDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query allStatementsIncomeStatement($userId: String) {
        allStatementsIncomeStatement(userId: $userId) {
            id
            insertedDate
            notes
            userId
            submitted
            incomeTotal
            expenseTotal
            balance
            submittedDate
            month
            year
            period
        }
    }
          `,
      variables: {
        userId,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements income Failed - Server connection error'
      );
    }

    return response.data.data.allStatementsIncome;
  }

  async submitStatement(input: StatementsSubmitInput): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      mutation submitStatement($input: StatementsSubmitInput) {      
           submitStatement(input: $input) {
            result  resultObject resultMessage 
           } 
       }
      `,
      variables: {
        input,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Update income statement Failed - Server connection error'
      );
    }

    return response.data.data.submitStatement;
  }

  async getAllStatementsBalanceSheet(
    userId: string,
    year: Number,
    month: Number
  ): Promise<BalanceSheetDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query allStatementsBalanceSheet($userId: String, $year: Int!, $month: Int!) { 
         allStatementsBalanceSheet(userId: $userId, year: $year, month: $month) { 
           userId 
           incomeTotal
           expenseTotal
           balance
           month
           year
           autoSubmitted
           submittedDate
           submitted        
          }
}
          `,
      variables: {
        userId,
        year,
        month,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements balance sheet Failed - Server connection error'
      );
    }

    return response.data.data.allStatementsBalanceSheet;
  }

  async GetAllIncomeStatementsInfo(locale: string): Promise<BalanceSheetDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllIncomeStatements($locale: String) { 
            GetAllIncomeStatements(locale: $locale) {
          id
          description 
          }
        }
          `,
      variables: {
        locale,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements info Failed - Server connection error'
      );
    }

    return response.data.data.GetAllIncomeStatements;
  }

  async allContentLanguages(contentType: string): Promise<BalanceSheetDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query allContentLanguages($contentType: String!) {
          allContentLanguages(contentType: $contentType) { 
             id description locale  
             }
            }
          `,
      variables: {
        contentType,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all content languages failed - Server connection error'
      );
    }

    return response.data.data.allContentLanguages;
  }
}

export default IncomeStatementsService;
