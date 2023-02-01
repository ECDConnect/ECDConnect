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

        public StatementsIncomeStatement CreateStatementIncome(
StatementsIncome model)
        {
            var incomeRepo = _repoFactory.CreateRepository<StatementsIncome>(userContext: _applicationUserId);
            var statementsRepo = _repoFactory.CreateRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            incomeRepo.Insert(model);

            double runningBalance = 0;
            //do business logic to determine running balance
            var statements = GetAllStatementsIncomeStatement(model.UserId);
            var row = statementsRepo.GetAll().Where(x => x.UserId== model.UserId).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
            runningBalance = (row != null ? runningBalance = row.Balance : 0);

            StatementsIncomeStatement statement = new StatementsIncomeStatement()
            {
                Id = model.Id,
                UserId = model.UserId,
                TenantId = model.TenantId,
                Submitted = false,
                SubmittedDate = null,
                Month = DateTime.Now.Month,
                Year = DateTime.Now.Year,
                Period = "Monthly",
                IncomeTotal = model.Amount,
                ExpenseTotal = 0,
                Notes = model.Notes,
                Balance = (runningBalance + model.Amount)
            };

            var ret = statementsRepo.Insert(statement);
            return statement;

        }

        public StatementsIncomeStatement CreateStatementExpense(
StatementsExpenses model)
        {
            var incomeRepo = _repoFactory.CreateRepository<StatementsExpenses>(userContext: _applicationUserId);
            var statementsRepo = _repoFactory.CreateRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            incomeRepo.Insert(model);

            double runningBalance = 0;
            //do business logic to determine running balance
            var statements = GetAllStatementsIncomeStatement(model.UserId);
            var row = statementsRepo.GetAll().Where(x => x.UserId == model.UserId).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
            runningBalance = (row != null ? runningBalance = row.Balance : 0);

            StatementsIncomeStatement statement = new StatementsIncomeStatement()
            {
                Id = model.Id,
                UserId = model.UserId,
                TenantId = model.TenantId,
                Submitted = false,
                SubmittedDate = null,
                Month = DateTime.Now.Month,
                Year = DateTime.Now.Year,
                Period = "Monthly",
                IncomeTotal = 0,
                ExpenseTotal = model.Amount,
                Notes = model.Notes,
                Balance = (runningBalance - model.Amount)
            };

            var ret = statementsRepo.Insert(statement);
            return statement;

        }

    }
}

