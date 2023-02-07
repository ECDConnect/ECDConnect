using EcdLink.Api.CoreApi.Managers.IncomeExpense;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class IncomeStatementMutationExtension
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private string _applicationUserId;
        public IncomeStatementMutationExtension(
                IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public StatementsIncomeStatement UpdateIncome([Service] IncomeExpenseManager incomeManager, string id,
              StatementsIncome input)
        {

            return incomeManager.UpdateIncome(input);
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public StatementsIncomeStatement UpdateExpense([Service] IncomeExpenseManager incomeManager, string id,
      StatementsExpenses input)
        {

            return incomeManager.UpdateExpense(input);
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public StatementsStartupSupport UpdateStartupSupport([Service] IncomeExpenseManager incomeManager, string id,
StatementsStartupSupport input)
        {

            return incomeManager.UpdateStartupSupport(input);
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public List<StatementsIncomeStatement> SubmitStatement([Service] IncomeExpenseManager incomeManager, string id,
StatementsSubmit input)
        {
            if (input != null)
            {
                return incomeManager.SubmitStatement(input);
            }
            else return null;
        }
    }
}
