using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using iTextSharp.text;
using Microsoft.AspNetCore.Http;
using NPOI.SS.Formula.Functions;
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
                    IncomeTotal = Math.Round(model.Amount, 2),
                    ExpenseTotal = 0,
                    Notes = model.Notes,
                    Balance = runningBalance
                };
                var ret = statementsRepo.Insert(statement);

                model.IncomeStatementId = ret.Id.ToString(); //save incomestatement row id to expense row
                incomeRepo.Insert(model);

                statement.Balance = runningBalance;

                return statement;
            } else
            {
                if (!income.Submitted)//once submitted, no further updates can be made
                {
                    incomeRepo.Update(model);
                    StatementsIncomeStatement incomeStatement = statementsRepo.GetAll().Where(x => x.Id.Equals(income.IncomeStatementId)).FirstOrDefault();
                    if (incomeStatement != null)
                    {
                        incomeStatement.IncomeTotal = Math.Round(model.Amount, 2);
                        incomeStatement.Notes = model.Notes;
                        incomeStatement.IsActive = model.IsActive;
                        var ret = statementsRepo.Update(incomeStatement);
                    }
                    return incomeStatement;
                }
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
                    ExpenseTotal = Math.Round(model.Amount,2),
                    Notes = model.Notes,
                    Balance = runningBalance
                };
                var ret = statementsRepo.Insert(statement);

                model.IncomeStatementId = ret.Id.ToString(); //save incomestatement row id to expense row
                //insert expense
                expenseRepo.Insert(model);

                statement.Balance = runningBalance;

                return statement;
            } else
            {
                if (!expense.Submitted)//once submitted, no further updates can be made
                {
                    expenseRepo.Update(model);
                    StatementsIncomeStatement incomeStatement = statementsRepo.GetAll().Where(x => x.Id.Equals(expense.IncomeStatementId)).FirstOrDefault();
                    if (incomeStatement != null)
                    {
                        incomeStatement.IncomeTotal = Math.Round(model.Amount, 2);
                        incomeStatement.Notes = model.Notes;
                        incomeStatement.IsActive = model.IsActive;
                        var ret = statementsRepo.Update(incomeStatement);
                    }
                    return incomeStatement;
                }
            }
            return new StatementsIncomeStatement();
        }

        public double GetRunningBalance(string userId, int month, int year)
        {
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            var rows = statementsRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && string.Equals(x.Year, year) && x.IsActive == true)
                    .ToList();

            if (month>0) //filter into months if we need to focus on a specific month
            {
                rows = rows.Where(y => string.Equals(y.Month, month)).ToList();
            }

            double allIncome = rows.Sum(x => x.IncomeTotal);
            double allExoenses = rows.Sum(x => x.ExpenseTotal);
            double runningBalance = allIncome - allExoenses;

            return Math.Round(runningBalance,2);
        }

        public StatementsStartupSupport UpdateStartupSupport(
StatementsStartupSupport model)
        {
            var startupRepo = _repoFactory.CreateGenericRepository<StatementsStartupSupport>(userContext: _applicationUserId);
            StatementsStartupSupport supportEntry = startupRepo.GetAll().Where(x => x.Id.Equals(model.Id)).FirstOrDefault();
            if (supportEntry != null)
            {

                startupRepo.Update(model);
            }
            else
            {
                startupRepo.Insert(model);             
            }
            return null;

        }

        public List<StatementsIncomeStatement> SubmitStatement(
StatementsSubmit model)
        {
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            var rows = statementsRepo.GetAll().Where(x => string.Equals(x.UserId, model.UserId) && x.IsActive == true)
                .Where(y => y.Year == model.Year)
                .ToList();

            if (rows != null)
            {

                if (model.Period == "Annual")
                {
                    //annually needs to look at the entire years statements and sumbit all these for only that year.4
                    foreach (var row in rows)
                    {
                        //lock all entries
                        row.Submitted = true;
                        row.SubmittedDate = DateTime.Now;
                        statementsRepo.Update(row);

                        SubmitIncomeExpenses(row.UserId, row.Id.ToString(), (row.ExpenseTotal > 0));
                    }

                }
                else
                {
                    //assumed monthly, look at month and year passed in and submit the data for only that whole month and that year period
                    if (model.Month > 0) //filter into months if we need to focus on a specific month
                    {
                        rows = rows.Where(y => string.Equals(y.Month, model.Month)).ToList();
                        if (rows.Count > 0)
                        {
                            foreach (var row in rows)
                            {
                                //lock all entries
                                row.Submitted = true;
                                row.SubmittedDate = DateTime.Now;
                                statementsRepo.Update(row);

                                SubmitIncomeExpenses(row.UserId, row.Id.ToString(), (row.ExpenseTotal > 0));
                            }
                        }
                    } //update nothing if months arent present - cant assume to submit any months
                }
            }
            return null;
        }

        public bool SubmitIncomeExpenses(string userId, string id, bool isExpense = false)
        {
            bool retOK = false;
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);

            if (!isExpense)
            {
                var row = incomeRepo.GetAll().Where(x => string.Equals(x.UserId, userId) && string.Equals(x.IncomeStatementId, id)).FirstOrDefault();
                if (row != null)
                {
                    row.Submitted = true;
                    incomeRepo.Update(row);
                    retOK = true;
                }               
            } else
            {
                var row = expenseRepo.GetAll().Where(x => string.Equals(x.UserId, userId) && string.Equals(x.IncomeStatementId, id)).FirstOrDefault();
                if (row != null)
                {
                    row.Submitted = true;
                    expenseRepo.Update(row);
                    retOK = true;
                }
            }

            return retOK;
        }
    }
}

