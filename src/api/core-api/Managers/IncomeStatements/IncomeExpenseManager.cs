using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.IncomeExpense
{
    public class IncomeExpenseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private string _applicationUserId;

        public IncomeExpenseManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
        }

        public List<StatementsExpenses> GetAllStatementsExpenses(
string userId)
        {
            var expenseRepo = _repoFactory.CreateRepository<StatementsExpenses>(userContext: _applicationUserId);
            return expenseRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
        }
        public List<StatementsIncome> GetAllStatementsIncome(
string userId)
        {
            var expenseRepo = _repoFactory.CreateRepository<StatementsIncome>(userContext: _applicationUserId);
            return expenseRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
        }
        public List<StatementsIncomeStatement> GetAllStatementsIncomeStatement(
string userId)
        {
            var expenseRepo = _repoFactory.CreateRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            return expenseRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
        }
        public List<StatementsStartupSupport> GetAllStatementsStartupSupport(
string userId)
        {
            var expenseRepo = _repoFactory.CreateRepository<StatementsStartupSupport>(userContext: _applicationUserId);
            return expenseRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
        }

    }
}

