using DotLiquid.Util;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart.Input;
using EcdLink.Api.CoreApi.Managers;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class IncomeStatementMutationExtension
    {
        private IHttpContextAccessor _contextAccessor;
        
        public IncomeStatementMutationExtension(
                IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public IncomeItemModel UpdateIncome(
            [Service] IIncomeExpenseService incomeManager,
            StatementsIncome input)
        {
            if (input == null)
            {
                return null;
            }

            var incomeItem = incomeManager.UpdateIncome(input);
            return new IncomeItemModel(incomeItem);
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public ExpenseItemModel UpdateExpense(
            [Service] IIncomeExpenseService incomeManager,
            StatementsExpenses input)
        {
            if (input == null)
            {
                return null;
            }

            var expenseItem = incomeManager.UpdateExpense(input);
            return new ExpenseItemModel(expenseItem);
        }

        // This does not seem to be used by the frontend currently
        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public ResultReturnObject UpdateStartupSupport(
            [Service] IIncomeExpenseService incomeManager,
            StatementsStartupSupport input)
        {
            if (input != null)
            {
                var retObj = incomeManager.UpdateStartupSupport(input);
                return (retObj != null ? new ResultReturnObject() { ResultMessage = "Startup Support Submitted", ResultObject = JsonConvert.SerializeObject(retObj) } : new ResultReturnObject() { Result = false, ResultMessage = "Startup Support could not be processed for criteria" });
            }
            else return new ResultReturnObject() { ResultMessage = "Input object was null" };
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public IncomeStatementModel SubmitMonthlyStatement(
            [Service] IIncomeExpenseService incomeExpenseService,
            SubmitStatementModel input)
        {
            if (input == null)
            {
                return null;
            }

            var statement = incomeExpenseService.SubmitMonthlyStatement(input.Month, input.Year, input.UserId, input.IncomeItemIds, input.ExpenseItemIds);
            return new IncomeStatementModel(statement);
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public ResultReturnObject AutoSubmitStatement(
            [Service] IIncomeExpenseService incomeManager)
        {
            var pracsDueSubmits = incomeManager.GetUnsubmittedStatements();

            foreach (var pracData in pracsDueSubmits)
            {
                DateTime duePeriod  = pracData.Value;
                incomeManager.AutoSubmitStatement(pracData.Key, duePeriod.Year, duePeriod.Month);
            }
            return new ResultReturnObject() { ResultMessage = "OK" };
        }
    }
}
