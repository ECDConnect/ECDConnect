using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using HotChocolate;
using System;
using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IIncomeExpenseService
    {
        List<StatementsIncomeStatement> GetAllStatementsIncomeStatement(string userId, int year, int month);
        StatementsIncome UpdateIncome(StatementsIncome model);
        StatementsExpenses UpdateExpense(StatementsExpenses model);
        StatementsStartupSupport UpdateStartupSupport(StatementsStartupSupport model);
        StatementsIncomeStatement SubmitMonthlyStatement(int month, int year, string userId, IEnumerable<Guid> incomeItemIds, IEnumerable<Guid> expenseItemIds, bool autoSubmitted = false);
        bool AutoSubmitStatement(string userId, int year, int month);
        Dictionary<string, DateTime> GetUnsubmittedStatements();        
        List<Practitioner> GetPractitionersDueStatements();
        Document CreateIncomeStatementPDFDocument(string userId, StatementsIncomeStatement statement);
        List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData(Guid statementId);
        List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData(StatementsIncomeStatement statement);
        List<StatementsIncomeStatement> GetStatements(string userId, DateTime startDate, DateTime? endDate = null);
        List<StatementsIncome> GetUnsubmittedIncomeItems(string userId);
        List<StatementsExpenses> GetUnsubmittedExpenseItems(string userId);
        List<StatementReport> GetStatementLinesToReport(string userId, int year, int month);
    }
}
