import { api } from '../axios.helper';
import {
  BalanceSheetDto,
  Config,
  IncomeStatementsDto,
  ReportTableDataDto,
  IncomeStatementPDFDocInput,
  IncomeStatementsTypes,
  StatementsFeeTypes,
  StatementsContributionTypes,
  StatementsPayTypes,
  IncomeStatementDto,
  ExpensesStatementsDto,
  ExpenseItemDto,
  IncomeItemDto,
} from '@ecdlink/core';
import {
  StatementsExpensesInput,
  StatementsIncomeInput,
  SubmitStatementModelInput,
} from '@/../../../packages/graphql/lib';

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

  async GetAllStatementsFeeType(): Promise<StatementsFeeTypes[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `query GetAllStatementsFeeType() {
          GetAllStatementsFeeType() {
            id description insertedDate notes
          }
        }`,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements fee types Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsFeeType;
  }

  async GetAllStatementsContributionType(): Promise<
    StatementsContributionTypes[]
  > {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `query GetAllStatementsContributionType() {
          GetAllStatementsContributionType() {
            id description insertedDate notes
          }
        }`,
    });

    if (response.status !== 200) {
      throw new Error(
        'Get all statements contribution types Failed - Server connection error'
      );
    }

    return response.data.data.GetAllStatementsContributionType;
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

  async UpdateStatementsIncome(
    input: StatementsIncomeInput
  ): Promise<IncomeItemDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `mutation updateIncome($input: StatementsIncomeInput) { 
          updateIncome(input: $input) {
            incomeTypeId
            id
            dateReceived
            amount
            childUserId
            notes
            description
            amountExpected
            childCoverAmount
            payTypeId
            contributionTypeId
            photoProof
            feeTypeId
          }
        }`,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Update income statement Failed - Server connection error'
      );
    }

    return response.data.data.updateIncome;
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

  // THIS CAN PROBABLY BE REMOVED< OR REFACTORED TO ONLY GET THE LATEST
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
            statementsIncomeStatementId 
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

  // IS THIS USED
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

  async submitStatement(
    input: SubmitStatementModelInput
  ): Promise<IncomeStatementDto | undefined> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);

    const response = await apiInstance.post<any>(``, {
      query: `mutation submitMonthlyStatement($input: SubmitStatementModelInput) {      
          submitMonthlyStatement(input: $input) {
            id 
            incomeTotal
            expenseTotal
            balance
            month
            year
            incomeItems {
              incomeTypeId
              id
              dateReceived
              amount              
              childUserId
            } 
            expenseItems {
              expenseTypeId
              id
              datePaid
              amount
            }
          } 
        }`,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Submit income statement Failed - Server connection error'
      );
    }

    return response.data.data.submitMonthlyStatement;
  }

  // Can remove this later
  async getAllStatementsBalanceSheet(
    userId: string,
    year: Number,
    month: Number | undefined
  ): Promise<BalanceSheetDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `query allStatementsBalanceSheet($userId: String, $year: Int!, $month: Int) { 
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
        }`,
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

  // NOT SURE WHAT THIS DOES
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

  // FIX RETURN TYPE!!! WHY DOES THIS NOT USE THE DEFAULT LANGUAGE DTO!!!
  async allContentLanguages(contentType: string): Promise<BalanceSheetDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `query allContentLanguages($contentType: String!) {
          allContentLanguages(contentType: $contentType) { 
            id description locale  
          }
        }`,
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

  async getIncomeStatements(
    userId: string,
    startDate: Date,
    endDate: Date | undefined
  ): Promise<IncomeStatementDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `query incomeStatements($userId: String, $startDate: DateTime!, $endDate: DateTime) { 
          incomeStatements(userId: $userId, startDate: $startDate, endDate: $endDate) { 
            id 
            incomeTotal
            expenseTotal
            balance
            month
            year
            incomeItems {
              incomeTypeId
              id
              dateReceived
              amount
              childUserId
            } 
            expenseItems {
              expenseTypeId
              id
              datePaid
              amount
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

  async getUnsubmittedIncomeItems(userId: string): Promise<IncomeItemDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `query unsubmittedIncomeItems($userId: String) { 
          unsubmittedIncomeItems(userId: $userId) {           
            incomeTypeId
            id
            dateReceived
            amount
            childUserId
            notes
            description
            amountExpected
            childCoverAmount
            payTypeId
            contributionTypeId
            photoProof
            feeTypeId
          }
        }`,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Get unsubmitted income items Failed - Server connection error'
      );
    }

    return response.data.data.unsubmittedIncomeItems;
  }

  async getUnsubmittedExpenseItems(userId: string): Promise<ExpenseItemDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `query unsubmittedExpenseItems($userId: String) { 
          unsubmittedExpenseItems(userId: $userId) {           
            expenseTypeId
            id
            datePaid
            amount
            description
            notes
            photoProof
          }
        }`,
      variables: {
        userId,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Get unsubmitted expense items Failed - Server connection error'
      );
    }

    return response.data.data.unsubmittedExpenseItems;
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

  async updateStatementsExpense(
    input: StatementsExpensesInput
  ): Promise<ExpenseItemDto> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `mutation updateExpense($input: StatementsExpensesInput ) { 
          updateExpense(input: $input) {
            expenseTypeId
            id
            datePaid
            amount
            description
            notes
            photoProof
        }
      }`,
      variables: {
        input,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error(
        'Update expense statement Failed - Server connection error'
      );
    }

    return response.data.data.updateExpense;
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

export default IncomeStatementsService;
