using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class IncomeStatementsQueryExtension
    {
        public IncomeStatementsQueryExtension()
        {
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.View)]
        public List<StatementsExpenses> GetAllStatementsExpenses([Service] IncomeExpenseService incomeManager,
string userId, int year, int month)
        {
            return incomeManager.GetAllStatementsExpenses(userId, year, month);
        }
        public List<StatementsIncome> GetAllStatementsIncome([Service] IncomeExpenseService incomeManager,
string userId, int year, int month)
        {
            return incomeManager.GetAllStatementsIncome(userId, year, month);
        }
        public List<StatementsIncomeStatement> GetAllStatementsIncomeStatement([Service] IncomeExpenseService incomeManager,
string userId, int year, int month)
        {
            return incomeManager.GetAllStatementsIncomeStatement(userId, year, month);
        }
        public List<StatementsStartupSupport> GetAllStatementsStartupSupport([Service] IncomeExpenseService incomeManager,
string userId, int year, int month)
        {
            return incomeManager.GetAllStatementsStartupSupport(userId, year, month);
        }
        public List<StatementsBalanceSheet> GetAllStatementsBalanceSheet([Service] IncomeExpenseService incomeManager,
string userId, int year, int month)
        {
            return incomeManager.GetAllStatementsBalanceSheet(userId, year, month);
        }
    }
}
