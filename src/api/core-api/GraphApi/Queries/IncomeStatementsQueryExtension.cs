using EcdLink.Api.CoreApi.GraphApi.Models.Statements;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
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
        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.View)]
        public List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData(
            [Service] IIncomeExpenseService incomeManager, Guid statementId)
        {
            return incomeManager.GetStatementsIncomeExpensesPDFData(statementId);
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.View)]
            public List<IncomeStatementModel> GetIncomeStatements(
            [Service] IIncomeExpenseService incomeExpenseService,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] HierarchyEngine engine,
            Guid userId,
            DateTime startDate,
            DateTime? endDate)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            if (!contextAccessor.HttpContext.IsInRole(new[] { Roles.COACH, Roles.PRINCIPAL, Roles.PRACTITIONER })
                 || !engine.UserInHierarchy(uId, userId, true))
            {
                throw new UnauthorizedAccessException("You do not have permission to retrieve this data.");
            }
            var statements = incomeExpenseService.GetStatements(userId, startDate, endDate);

            return statements.Select(x => new IncomeStatementModel(x)).ToList();
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
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