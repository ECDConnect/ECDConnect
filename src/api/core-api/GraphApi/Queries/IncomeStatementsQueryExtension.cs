using EcdLink.Api.CoreApi.GraphApi.Models.Statements;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class IncomeStatementsQueryExtension
    {
        public IncomeStatementsQueryExtension()
        {
        }

        // Probably don't need this
        public List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData(
            [Service] IIncomeExpenseService incomeManager, Guid statementId)
        {
            return incomeManager.GetStatementsIncomeExpensesPDFData(statementId);
        }

        /// <summary>
        /// Fetches a list of income statements, including lists of all income and expense items linked to it
        /// </summary>
        /// <param name="userId">UserId to retrieve data for</param>
        /// <param name="startDate">Date to fetch statements from</param>
        /// <param name="endDate">Date to fetch statements until, can be ommitted to fetch all from start date</param>
        /// <returns>List of income statements, including lists of all income and expense items linked to it</returns>
        public List<IncomeStatementModel> GetIncomeStatements([Service] IIncomeExpenseService incomeExpenseService,
            Guid userId,
            DateTime startDate,
            DateTime? endDate)
        {
            var statements = incomeExpenseService.GetStatements(userId, startDate, endDate);

            return statements.Select(x => new IncomeStatementModel(x)).ToList();
        }

        public string GetIncomeStatementPdf(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IIncomeExpenseService incomeExpenseService,
            Guid statementId)
        {
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var statement = incomeExpenseService.GetStatement(statementId);

            var document = incomeExpenseService.CreateIncomeStatementPDFDocument(userId.ToString(), statement);

            return document;
        }
    }
}