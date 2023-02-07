using EcdLink.Api.CoreApi.Managers.IncomeExpense;
using ECDLink.Abstractrions.GraphQL.Enums;
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
        public List<StatementsExpenses> GetAllStatementsExpenses([Service] IncomeExpenseManager incomeManager,
string userId)
        {
            return incomeManager.GetAllStatementsExpenses(userId);
        }
        public List<StatementsIncome> GetAllStatementsIncome([Service] IncomeExpenseManager incomeManager,
string userId)
        {
            return incomeManager.GetAllStatementsIncome(userId);
        }
        public List<StatementsIncomeStatement> GetAllStatementsIncomeStatement([Service] IncomeExpenseManager incomeManager,
string userId)
        {
            return incomeManager.GetAllStatementsIncomeStatement(userId);
        }
        public List<StatementsStartupSupport> GetAllStatementsStartupSupport([Service] IncomeExpenseManager incomeManager,
string userId)
        {
            return incomeManager.GetAllStatementsStartupSupport(userId);
        }
    }
}
