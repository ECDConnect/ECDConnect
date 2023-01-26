using EcdLink.Api.CoreApi.Managers.IncomeExpense;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
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
