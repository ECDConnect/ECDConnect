using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Core.Services.Interfaces;
using HotChocolate;
using HotChocolate.Types;
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
            string userId,
            DateTime startDate,
            DateTime? endDate)
        {
            var statements = incomeExpenseService.GetStatements(userId, startDate, endDate);

            return statements.Select(x => new IncomeStatementModel(x)).ToList();
        }

        /// <summary>
        /// Fetches all unsubmitted income items for a user
        /// </summary>
        /// <param name="userId">UserId to fetch data for</param>
        /// <returns>List of IncomeItemModels</returns>
        public List<IncomeItemModel> GetUnsubmittedIncomeItems([Service] IIncomeExpenseService incomeExpenseService,
            string userId)
        {
            var incomeItems = incomeExpenseService.GetUnsubmittedIncomeItems(userId);

            return incomeItems.Select(x => new IncomeItemModel(x)).ToList();
        }

        /// <summary>
        /// Fetchs all unsubmitted expense items for a user
        /// </summary>
        /// <param name="userId">UserId to fetch data for</param>
        /// <returns>List of ExpenseItemModels</returns>
        public List<ExpenseItemModel> GetUnsubmittedExpenseItems([Service] IIncomeExpenseService incomeExpenseService,
            string userId)
        {
            var expenseItems = incomeExpenseService.GetUnsubmittedExpenseItems(userId);

            return expenseItems.Select(x => new ExpenseItemModel(x)).ToList();
        }
    }
}