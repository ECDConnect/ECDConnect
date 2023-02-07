using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
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
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            return expenseRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
        }
        public List<StatementsIncome> GetAllStatementsIncome(
string userId)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            return expenseRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
        }
        public List<StatementsIncomeStatement> GetAllStatementsIncomeStatement(
string userId)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            var statements = expenseRepo.GetAll().Where(x => string.Equals(x.UserId, userId)).ToList();
            if (statements.Any())
            {
                return statements;
            }
            else return new List<StatementsIncomeStatement>();
        }
        public List<StatementsStartupSupport> GetAllStatementsStartupSupport(
string userId)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsStartupSupport>(userContext: _applicationUserId);
            return expenseRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
        }

        public StatementsIncomeStatement UpdateIncome(
StatementsIncome model)
        {
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            //if expense already exist, update it rather, else add
            StatementsIncome income = incomeRepo.GetAll().Where(x => x.Id.Equals(model.Id)).FirstOrDefault();
            if (income == null)
            {
                incomeRepo.Insert(model);

                var statements = GetAllStatementsIncomeStatement(model.UserId);
                double runningBalance = GetRunningBalance(model.UserId, model.DateReceived.Value.Month, model.DateReceived.Value.Year);//(row != null ? runningBalance = row.Balance : 0);

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
                    //Balance = (runningBalance + model.Amount)
                };

                var ret = statementsRepo.Insert(statement);
                statement.Balance = runningBalance;
                return statement;
            } else
            {
                incomeRepo.Update(model);
                StatementsIncomeStatement incomeStatement = statementsRepo.GetAll().Where(x => x.Id.Equals(income.IncomeStatementId)).FirstOrDefault();
                if (incomeStatement != null)
                {
                    incomeStatement.IncomeTotal = model.Amount;
                    incomeStatement.Notes = model.Notes;
                    incomeStatement.IsActive = model.IsActive;
                    var ret = statementsRepo.Update(incomeStatement);
                }
                return incomeStatement;
            }
            return new StatementsIncomeStatement();
        }

        public StatementsIncomeStatement UpdateExpense(
StatementsExpenses model)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            //if expense already exist, update it rather, else add
            StatementsExpenses expense = expenseRepo.GetAll().Where(x => x.Id.Equals(model.Id)).FirstOrDefault();
            if (expense == null)
            {
                //insert expenseqqqqqqqqqqq
                expenseRepo.Insert(model);
                //do business logic to determine running balance
                var statements = GetAllStatementsIncomeStatement(model.UserId);

                double runningBalance = GetRunningBalance(model.UserId, model.DatePaid.Value.Month, model.DatePaid.Value.Year);//(row != null ? runningBalance = row.Balance : 0);

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
                    //Balance = (runningBalance - model.Amount)
                };

                var ret = statementsRepo.Insert(statement);
                statement.Balance = runningBalance;
                return statement;
            } else
            {
                expenseRepo.Update(model);
                StatementsIncomeStatement incomeStatement = statementsRepo.GetAll().Where(x => x.Id.Equals(expense.IncomeStatementId)).FirstOrDefault();
                if (incomeStatement != null)
                {
                    incomeStatement.IncomeTotal = model.Amount;
                    incomeStatement.Notes = model.Notes;
                    incomeStatement.IsActive = model.IsActive;
                    var ret = statementsRepo.Update(incomeStatement);
                }
                return incomeStatement;
            }
            return new StatementsIncomeStatement();
        }

        public double GetRunningBalance(string userId, int month, int year)
        {
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            var rows = statementsRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && string.Equals(x.Year, year))
                    .ToList();

            if (month>0) //filter into months if we need to focus on a specific month
            {
                rows = rows.Where(y => string.Equals(y.Month, month)).ToList();
            }

            double allIncome = rows.Sum(x => x.IncomeTotal);
            double allExoenses = rows.Sum(x => x.ExpenseTotal);
            double runningBalance = allIncome - allExoenses;

            return runningBalance;
        }

        public StatementsStartupSupport UpdateStartupSupport(
StatementsStartupSupport model)
        {
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsStartupSupport>(userContext: _applicationUserId);

            //update associatedstartup support filing

            return null;

        }

        public List<StatementsIncomeStatement> SubmitStatement(
StatementsSubmit model)
        {
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            var row = statementsRepo.GetAll().Where(x => string.Equals(x.UserId, model.UserId)).ToList();

            if (row != null)
            {

                if (model.Period == "Annual")
                {
                    //annually needs to look at the entire years statements and sumbit all these for only that year.

                }
                else
                {
                    //assumed monthly, look at month and year passed in and submit the data for only that whole month and that year period

                }
                

            }
            return null;
        }
    }
}

