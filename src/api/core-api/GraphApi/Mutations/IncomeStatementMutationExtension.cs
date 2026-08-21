using EcdLink.Api.CoreApi.GraphApi.Models.Statements;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using Fluid.Ast;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
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
            [Service] HierarchyEngine hierarchyEngine,
            IncomeStatementModel input)
        {
            var userId = contextAccessor.HttpContext.GetUser().Id;

            if (input == null)
            {
                throw new ArgumentNullException("input");
            }

            input.IncomeItems ??= new List<IncomeItemModel>();
            input.ExpenseItems ??= new List<ExpenseItemModel>();

            var existingStatement = incomeExpenseService.GetStatement(input.Id);

            if (existingStatement == null)
            {
                // Client may have a local-only id for a month that already exists on the server
                // (offline create, another device, or a stale cache). Merge into that statement.
                var existingForMonth = incomeExpenseService.GetStatements(
                        userId,
                        new DateTime(input.Year, input.Month, 1),
                        new DateTime(input.Year, input.Month, DateTime.DaysInMonth(input.Year, input.Month)))
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.InsertedDate)
                    .FirstOrDefault();

                if (existingForMonth != null)
                {
                    input.Id = existingForMonth.Id;
                    existingStatement = existingForMonth;
                }
            }

            if (existingStatement != null) 
            {
                if (existingStatement.UserId != userId || !hierarchyEngine.UserInHierarchy(userId, existingStatement.UserId.Value, true))
                {
                    throw new UnauthorizedAccessException("You do not have permission to update this statement.");
                }

                var updatedStatement = incomeExpenseService.UpdateStatement(input);
                return new IncomeStatementModel(updatedStatement);
            }

            var newStatement = incomeExpenseService.CreateStatement(userId, input);
            return new IncomeStatementModel(newStatement);
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Update)]
        public StatementsIncomeStatement UpdateUserContactStatusForStatement(
            [Service] IIncomeExpenseService incomeExpenseService,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] HierarchyEngine hierarchyEngine,
            Guid statementId)
        {
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var statement = incomeExpenseService.GetStatement(statementId);

            if (statement == null)
            {
                return null;
            }

            // Coaches/principals mark contact on a practitioner's statement; owner can too
            if (!statement.UserId.HasValue
                || !hierarchyEngine.UserInHierarchy(userId, statement.UserId.Value, true))
            {
                throw new UnauthorizedAccessException("You do not have permission to update this statement.");
            }

            return incomeExpenseService.UpdateUserContactStatusForStatement(statementId);
        }
    }
}
