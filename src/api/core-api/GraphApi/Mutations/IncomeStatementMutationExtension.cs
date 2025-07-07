using EcdLink.Api.CoreApi.GraphApi.Models.Statements;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
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

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Update)]
        public IncomeStatementModel UpdateIncomeStatement(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IIncomeExpenseService incomeExpenseService,
            IncomeStatementModel input)
        {
            var userId = contextAccessor.HttpContext.GetUser().Id;

            if (input == null)
            {
                throw new ArgumentNullException("input");
            }

            var exisitingStatement = incomeExpenseService.GetStatement(input.Id);

            if (exisitingStatement != null)
            {
                // Check if it's downloaded
                var updatedStatement = incomeExpenseService.UpdateStatement(input);
                return new IncomeStatementModel(updatedStatement);
            }

            var statementsForMonth = incomeExpenseService.GetStatements(
                userId,
                new DateTime(input.Year, input.Month, 1),
                new DateTime(input.Year, input.Month, DateTime.DaysInMonth(input.Year, input.Month)));

            // User already has a statement for the month, but it does not match the input id
            if (statementsForMonth.Any())
            {
                throw new ValidationException("User has already submitted a statement for this month");
            }

            var newStatement = incomeExpenseService.CreateStatement(userId, input);

            //var statement = incomeExpenseService.SubmitMonthlyStatement(input.Month, input.Year, input.UserId, input.IncomeItemIds, input.ExpenseItemIds);
            return new IncomeStatementModel(newStatement);
        }

        public StatementsIncomeStatement UpdateUserContactStatusForStatement(
            [Service] IIncomeExpenseService incomeExpenseService,
            Guid statementId)
        {
            return incomeExpenseService.UpdateUserContactStatusForStatement(statementId);
        }
    }
}
