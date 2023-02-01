using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.IncomeExpense;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.DataIngestion;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using ECDLink.UrlShortner.Managers;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

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
        public StatementsIncomeStatement CreateStatementIncome([Service] IncomeExpenseManager incomeManager,
              StatementsIncome model)
        {

            return incomeManager.CreateStatementIncome(model);
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public StatementsIncomeStatement CreateStatementExpense([Service] IncomeExpenseManager incomeManager,
      StatementsExpenses model)
        {

            return incomeManager.CreateStatementExpense(model);
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public StatementsIncomeStatement CreateStatementIncomeStatement([Service] IGenericRepositoryFactory repoFactory,
      [Service] IHttpContextAccessor httpContextAccessor,
      StatementsIncomeStatement model)
        {

            string userId = Guid.NewGuid().ToString();
            var _applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var incomeRepo = repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            //check user dont exist first
            return new StatementsIncomeStatement();
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public StatementsStartupSupport CreateStatementStartupSupport([Service] IGenericRepositoryFactory repoFactory,
[Service] IHttpContextAccessor httpContextAccessor,
StatementsStartupSupport model)
        {

            string userId = Guid.NewGuid().ToString();
            var _applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var incomeRepo = repoFactory.CreateGenericRepository<StatementsStartupSupport>(userContext: _applicationUserId);
            //check user dont exist first
            return new StatementsStartupSupport();
        }
    }
}
