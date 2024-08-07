using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Input;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using System;
using System.Collections.Generic;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IIncomeExpenseService
    {
        StatementsIncomeStatement GetStatement(Guid statementId);
        List<StatementsIncomeStatement> GetStatements(Guid userId, DateTime startDate, DateTime? endDate = null);
        StatementsIncomeStatement CreateStatement(Guid userId, IncomeStatementModel statement);
        StatementsIncomeStatement UpdateStatement(IncomeStatementModel statement);

        string CreateIncomeStatementPDFDocument(string userId, StatementsIncomeStatement statement);
        List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData(Guid statementId);
        List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData(StatementsIncomeStatement statement);

        StatementsIncomeStatement UpdateUserContactStatusForStatement(Guid statementId);
    }
}
