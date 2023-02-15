using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
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
string userId, int year, int month)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            return expenseRepo.GetAll()
                .Where(x => x.UserId.Equals(userId) && x.InsertedDate.Year.Equals(year) && x.InsertedDate.Month.Equals(month))                
                .ToList();
        }
        public List<StatementsIncome> GetAllStatementsIncome(
string userId, int year, int month)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            return expenseRepo.GetAll()
                .Where(x => x.UserId.Equals(userId) && x.InsertedDate.Year.Equals(year) && x.InsertedDate.Month.Equals(month))
                .ToList();
        }
        public List<StatementsIncomeStatement> GetAllStatementsIncomeStatement(
string userId, int year, int month)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            var statements = expenseRepo.GetAll()
                .Where(x => x.UserId.Equals(userId) && x.InsertedDate.Year.Equals(year) && x.InsertedDate.Month.Equals(month))
                .ToList();
            if (statements.Any())
            {
                return statements;
            }
            else return new List<StatementsIncomeStatement>();
        }

        public List<StatementsBalanceSheet> GetAllStatementsBalanceSheet(
string userId, int year)
        {
            List<StatementsBalanceSheet> balanceSheets = new List<StatementsBalanceSheet>();
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            var statements = statementsRepo.GetAll().Where(x => string.Equals(x.UserId, userId)).Where(y => y.Submitted==true).ToList();
            if (statements.Any())
            {
                if (year > 0)
                {
                    statements = statements.Where(x => x.Year.Equals(year)).ToList();
                }
                //year loop
                var allYears = statements.Select(x => x.Year).Distinct().ToList();
                if (allYears.Any())
                {
                    allYears.OrderDescending();
                    foreach (var currentYear in allYears)
                    {
                        //months loop
                        var months = statements.Where(x => x.Year == year).Select(y => y.Month).Distinct().ToList();
                        if (months.Any())
                        {
                            months.OrderDescending();
                            foreach (var month in months)
                            {
                                var allIncome = statements.Where(x => x.Year.Equals(year) && x.Month.Equals(month)).Select(y => y.IncomeTotal).ToList();
                                var allExpenses = statements.Where(x => x.Year.Equals(year) && x.Month.Equals(month)).Select(y => y.ExpenseTotal).ToList();

                                double allIncomeTotal = allIncome.Sum();
                                double allExpenseTotal =allExpenses.Sum();

                                double balance = allIncomeTotal - allExpenseTotal;

                                balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round(balance,2), IncomeTotal = Math.Round(allIncomeTotal,2), ExpenseTotal = Math.Round(allExpenseTotal,2), Month = month, Year = year, UserId = userId });
                            }
                        }
                    }
                    return balanceSheets;
                }
                else return new List<StatementsBalanceSheet>();
            }
            else return new List<StatementsBalanceSheet>();
        }

        public List<StatementsStartupSupport> GetAllStatementsStartupSupport(
string userId, int year, int month)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsStartupSupport>(userContext: _applicationUserId);
            return expenseRepo.GetAll()
                .Where(x => x.UserId.Equals(userId) && x.InsertedDate.Year.Equals(year) && x.InsertedDate.Month.Equals(month))
                .ToList();
        }

        public StatementsIncome UpdateIncome(
StatementsIncome model)
        {
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            double incomeAmount = Math.Round(model.Amount, 2);
            model.Amount = incomeAmount;

            StatementsIncome income = incomeRepo.GetAll().Where(x => x.Id.Equals(model.Id)).FirstOrDefault();
            if (income == null)
            {
                incomeRepo.Insert(model);
                return model;
            } else
            {
                if (!income.Submitted)//once submitted, no further updates can be made
                {
                    incomeRepo.Update(model);
                    return model;
                }
            }
            return new StatementsIncome();
        }

        public StatementsExpenses UpdateExpense(
StatementsExpenses model)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            double expenseAmount = Math.Round(model.Amount, 2);
            model.Amount = expenseAmount;

            StatementsExpenses expense = expenseRepo.GetAll().Where(x => x.Id.Equals(model.Id)).FirstOrDefault();
            if (expense == null)
            {
                expenseRepo.Insert(model);
                return model;
            }
            else
            {
                if (!expense.Submitted)//once submitted, no further updates can be made
                {
                    expenseRepo.Update(model);
                    return model;
                }
            }
            return new StatementsExpenses();
        }

        public double GetRunningBalance(string userId,string moneyType, int month, int year)
        {
            double runningBalance = 0;
            double allIncome = 0;
            double allExpenses = 0;


            switch (moneyType)
            {
                case "Income":
                    var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
                    var incomeRows = incomeRepo.GetAll() //get all rows for year to date
                            .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DateReceived.Value.Year.Equals(year) && x.DateReceived.Value.Month.Equals(month))
                            .ToList();

                    if (month > 0) //filter into months if we need to focus on a specific month
                    {
                        incomeRows = incomeRows.Where(y => string.Equals(y.DateReceived, month)).ToList();
                    }
                    allIncome = incomeRows.Sum(y => y.Amount);
                    break;
                case "Expenses":
                    var expensesRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
                    var expenseRows = expensesRepo.GetAll() //get all rows for year to date
                            .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DatePaid.Value.Year.Equals(year) && x.DatePaid.Value.Month.Equals(month))
                            .ToList();

                    if (month > 0) //filter into months if we need to focus on a specific month
                    {
                        expenseRows = expenseRows.Where(y => string.Equals(y.DatePaid, month)).ToList();
                    }
                    allExpenses = expenseRows.Sum(y => y.Amount);
                    break;
                default:
                    break;
            }

            runningBalance = allIncome - allExpenses;

            return Math.Round(runningBalance,2);
        }

        public bool IsStatementSubmitted(string userId, int year, int month)
        {
            bool isStatementSubmitted = false;
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            var rows = statementsRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && string.Equals(x.Year, year))
                    .Where(y => y.Submitted == true && y.IsActive == true)
                    .ToList();
            if (month > 0) //filter into months if we need to focus on a specific month
            {
                rows = rows.Where(y => string.Equals(y.Month, month)).ToList();
            }
            if (rows.Count > 0)
            {
                isStatementSubmitted = true;
            }
            return isStatementSubmitted;
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

        public List<StatementsIncomeStatement> AutoSubmitStatement(
string userId, int year, int month)
        {
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            var rows = statementsRepo.GetAll().Where(x => string.Equals(x.UserId, userId) && x.IsActive == true)
                .Where(y => y.Year == year)
                .ToList();

            if (rows != null)
            {                
                if (month > 0)
                {
                    rows = rows.Where(y => string.Equals(y.Month, month)).ToList();
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

