using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IIncomeExpenseService
    {
        List<StatementsExpenses> GetAllStatementsExpenses(string userId, int year, int month);
        List<StatementsIncome> GetAllStatementsIncome(string userId, int year, int month);
        List<StatementsIncomeStatement> GetAllStatementsIncomeStatement(string userId, int year, int month);
        List<StatementsBalanceSheet> GetAllStatementsBalanceSheet(string userId, int year, int? month = null);
        double GetRunningBalance(string userId, int year, int month, string lineStatus = LinesStatus.ANY);
        StatementsIncome UpdateIncome(StatementsIncome model);
        StatementsExpenses UpdateExpense(StatementsExpenses model);
        StatementsStartupSupport UpdateStartupSupport(StatementsStartupSupport model);
        bool SubmitStatement(StatementsSubmit model, bool autoSubmitted = false);
        bool AutoSubmitStatement(string userId, int year, int month);
        Dictionary<string, DateTime> GetUnsubmittedStatements();        
        List<Practitioner> GetPractitionersDueStatements();
    }
}
