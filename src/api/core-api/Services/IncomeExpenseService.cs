using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using ECDLink.Security.Extensions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.CodeDom.Compiler;
using System.ComponentModel;

namespace ECDLink.Core.Services
{
    public class IncomeExpenseService : IIncomeExpenseService
    {
        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly ISystemSetting<AbsenteeCutoffDelayOptions> _absenteeDelay;
        private readonly AttendanceTrackingRepository _attendanceRepo;
        private string _applicationUserId;

        public IncomeExpenseService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
        }

        #region Statement Queries

        public List<StatementsExpenses> GetAllStatementsExpenses(string userId, int year, int month)
        {
            return  GetAllExpenseLines(userId, year, month, true);
        }
        public List<StatementsIncome> GetAllStatementsIncome(string userId, int year, int month)
        {
            return GetAllIncomeLines(userId, year, month, true);
        }
        public List<StatementsIncomeStatement> GetAllStatementsIncomeStatement(string userId, int year, int month)
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

        //TODO:realign with new functions
        public List<StatementsBalanceSheet> GetAllStatementsBalanceSheet(string userId, int year, int month)
        {
            List<StatementsBalanceSheet> balanceSheets = new List<StatementsBalanceSheet>();
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            DateTime nextMonth= DateTime.Now.AddMonths(1);
            if (month > 0 && ((year == DateTime.Now.Year && month >= DateTime.Now.Month) || (year == nextMonth.Year && month == nextMonth.Month))) //
            {
                //FE requests future dated values included in next UNsubmitted set of statement lines
                double allIncomeTotal = GetAllIncomeTotal(userId, year, month, false);
                double allExpenseTotal = GetAllExpensesTotal(userId, year, month, false);

                double runningBalance = allIncomeTotal - allExpenseTotal;

                runningBalance = Math.Round(runningBalance, 2);

                balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round(runningBalance, 2), IncomeTotal = Math.Round(allIncomeTotal, 2), ExpenseTotal = Math.Round(allExpenseTotal, 2), Month = month, Year = year, UserId = userId, IsAutoSubmitted = false, SubmittedDate = null });
            }
            else 
            {
                //Only retrieve submitted statements oif not a future dated month is requested
                var statements = statementsRepo.GetAll().Where(x => string.Equals(x.UserId, userId) && x.Submitted.Equals(true)).ToList();
                if (statements.Any())
                {
                    if (year > 0) //filter to specific year
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
                            var allMonths = statements.Where(x => x.Year == year).Select(y => y.Month).Distinct().ToList();
                            if (month > 0) //filter to specific month
                            {
                                statements = statements.Where(x => x.Month.Equals(month)).ToList();
                            }
                            if (allMonths.Any())
                            {
                                allMonths.OrderDescending();
                                foreach (var currentMonth in allMonths)
                                {
                                    var statementCheck = statements.Where(x => x.Year.Equals(year) && x.Month.Equals(currentMonth)).FirstOrDefault();
                                    bool isAutoSubmitted = (statementCheck != null ? statementCheck.AutoSubmitted : false);
                                    var allIncome = statements.Where(x => x.Year.Equals(year) && x.Month.Equals(currentMonth)).Select(y => y.IncomeTotal).ToList();
                                    var allExpenses = statements.Where(x => x.Year.Equals(year) && x.Month.Equals(currentMonth)).Select(y => y.ExpenseTotal).ToList();

                                    double allIncomeTotal = allIncome.Sum();
                                    double allExpenseTotal = allExpenses.Sum();

                                    double balance = allIncomeTotal - allExpenseTotal;

                                    balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round(balance, 2), IncomeTotal = Math.Round(allIncomeTotal, 2), ExpenseTotal = Math.Round(allExpenseTotal, 2), Month = currentMonth, Year = currentYear, UserId = userId, IsAutoSubmitted = isAutoSubmitted, SubmittedDate = statementCheck.SubmittedDate });
                                }
                            }
                        }
                    }
                    else return new List<StatementsBalanceSheet>();
                }
            }
            return balanceSheets;            
        }

        public List<StatementsStartupSupport> GetAllStatementsStartupSupport(string userId, int year, int month)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsStartupSupport>(userContext: _applicationUserId);
            return expenseRepo.GetAll()
                .Where(x => x.UserId.Equals(userId) && x.InsertedDate.Year.Equals(year) && x.InsertedDate.Month.Equals(month))
                .ToList();
        }

        public double GetRunningBalance(string userId, int year, int month, bool includeSubmitted = false)
        {
            double allIncome = GetAllIncomeTotal(userId, year, month, includeSubmitted);
            double allExpenses = GetAllExpensesTotal(userId, year, month, includeSubmitted);

            double runningBalance = allIncome - allExpenses;

            return Math.Round(runningBalance, 2);
        }

        private double GetAllIncomeTotal(string userId, int year, int month, bool includeSubmitted = false)
        {
            double allIncome = 0;
            var allIncomeLines = GetAllIncomeLines(userId, year, month, includeSubmitted);
            if (allIncomeLines.Count > 0)
            {
                allIncome = allIncomeLines.Sum(y => y.Amount);
            }

            return Math.Round(allIncome, 2);
        }

        private List<StatementsIncome> GetAllIncomeLines(string userId, int year, int month, bool includeSubmitted = false)
        {
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            List<StatementsIncome> incomeRows = incomeRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DateReceived.Year.Equals(year) && x.DateReceived.Month.Equals(month))
                    .ToList();

            if (month > 0) //filter into months if we need to focus on a specific month
            {
                incomeRows = incomeRows.Where(y => int.Equals(y.DateReceived.Month, month)).ToList();
            }
            if (!includeSubmitted)
            {
                incomeRows = incomeRows.Where(y => y.Submitted.Equals(false)).ToList();
            }

            return incomeRows;
        }

        private double GetAllExpensesTotal(string userId, int year, int month, bool includeSubmitted = false)
        {
            double allExpenses = 0;

            var allExpenseLines = GetAllExpenseLines(userId, year, month, includeSubmitted);
            if (allExpenseLines.Count > 0)
            {
                allExpenses = allExpenseLines.Sum(y => y.Amount);
            }

            return Math.Round(allExpenses, 2);
        }

        private List<StatementsExpenses> GetAllExpenseLines(string userId, int year, int month, bool includeSubmitted = false)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            List<StatementsExpenses> expenseRows = expenseRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DatePaid.Year.Equals(year) && x.DatePaid.Month.Equals(month))
                    .ToList();

            if (month > 0) //filter into months if we need to focus on a specific month
            {
                expenseRows = expenseRows.Where(y => int.Equals(y.DatePaid.Month, month)).ToList();
            }
            if (!includeSubmitted)
            {
                expenseRows = expenseRows.Where(y => y.Submitted.Equals(false)).ToList();
            }
            return expenseRows;
        }

        private bool IsStatementSubmitted(string userId, int year, int month)
        {
            bool isStatementSubmitted = false;
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            var rows = statementsRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && string.Equals(x.Year, year) && x.Submitted == true && x.IsActive == true)
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

        #endregion

        #region Statement Mutations

        public StatementsIncome UpdateIncome(StatementsIncome model)
        {
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);

            double incomeAmount = Math.Round(model.Amount, 2);
            model.Amount = incomeAmount;
            
            //bool isSubmitted = IsStatementSubmitted(model.UserId, model.DateReceived.Year, model.DateReceived.Month);

            StatementsIncome income = incomeRepo.GetAll().Where(x => x.Id.Equals(model.Id)).FirstOrDefault();
            if (income == null)
            {
                model.Submitted = false;
                model.IncomeStatementId = null;
                incomeRepo.Insert(model); 
                return model;
            }
            else
            {
                if (!income.Submitted)//once submitted, no further updates can be made
                {
                    incomeRepo.Update(model);
                    return model;
                }
            }
            return new StatementsIncome();
        }

        public StatementsExpenses UpdateExpense(StatementsExpenses model)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);

            double expenseAmount = Math.Round(model.Amount, 2);
            model.Amount = expenseAmount;
            
            //bool isSubmitted = IsStatementSubmitted(model.UserId, model.DatePaid.Year, model.DatePaid.Month);

            StatementsExpenses expense = expenseRepo.GetAll().Where(x => x.Id.Equals(model.Id)).FirstOrDefault();
            if (expense == null)
            {
                model.Submitted = false;
                model.IncomeStatementId = null;
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
      
        public StatementsStartupSupport UpdateStartupSupport(StatementsStartupSupport model)
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

        public bool SubmitStatement(StatementsSubmit model, bool autoSubmitted = false)
        {
            bool retVal = false;
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            var statementRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            DateTime previousTimePeriod = DateTime.Now.AddMonths(-1); //previous months date to check for any unsubmitted records of current - 1 month

            var latestIncomeRows = GetAllIncomeLines(model.UserId, model.Year, model.Month, false);
            var unsubmittedIncomeRows = GetAllIncomeLines(model.UserId, previousTimePeriod.Year, previousTimePeriod.Month, false);
            var latestExpenseRows = GetAllExpenseLines(model.UserId, model.Year, model.Month, false);
            var unsubmittedExpenseRows = GetAllExpenseLines(model.UserId, previousTimePeriod.Year, previousTimePeriod.Month, false);

            if (model.Period == "Annual")
            {
                ////annually needs to look at the entire years statements and sumbit all these for only that year.
                var annualRows = statementRepo.GetAll().Where(x => string.Equals(x.UserId, model.UserId) && x.AnnualSubmittedDate == null && x.SubmittedDate.Year.Equals(model.Year)).ToList();
                foreach (var row in annualRows)
                {
                    //lock all entries
                    row.AnnualSubmittedDate = DateTime.Now;
                    row.AutoSubmitted = autoSubmitted;
                    statementRepo.Update(row);
                }
            }
            else
            {
                double allIncome = 0;
                double allExpenses = 0;
                //statement insert
                StatementsIncomeStatement submittedStatement = new StatementsIncomeStatement() { AutoSubmitted= autoSubmitted, 
                    Balance = 0, 
                    ExpenseTotal = 0,
                    IncomeTotal = 0, 
                    InsertedDate = DateTime.Now, 
                    IsActive = true, 
                    Month = model.Month, 
                    Year = model.Year, 
                    Notes = "Manual Monthly Statement Submission",
                    Period = "Monthly", 
                    Submitted = true, 
                    SubmittedDate = DateTime.Now, 
                    UserId = model.UserId, 
                    Id = Guid.NewGuid() 
                };
                statementRepo.Insert(submittedStatement);

                //income
                if (latestIncomeRows.Count > 0)
                {
                    if (unsubmittedIncomeRows.Any()) // if any statement lines were added after previous months submission, these get added to the newest submission
                    {
                        latestIncomeRows.AddRange(unsubmittedIncomeRows);
                    }
                    foreach (var row in latestIncomeRows)
                    {
                        allIncome += row.Amount;
                        //lock all entries
                        row.Submitted = true;
                        row.IncomeStatementId = submittedStatement.Id.ToString();
                        //row.AutoSubmitted = autoSubmitted;

                        incomeRepo.Update(row);
                    }
                    retVal = true;
                }
                //expenses
                if (latestExpenseRows.Count > 0)
                {
                    if (unsubmittedExpenseRows.Any()) // if any statement lines were added after previous months submission, these get added to the newest submission
                    {
                        latestExpenseRows.AddRange(unsubmittedExpenseRows);
                    }
                    foreach (var row in latestExpenseRows)
                    {
                        allExpenses += row.Amount;
                        //lock all entries
                        row.Submitted = true;
                        row.IncomeStatementId = submittedStatement.Id.ToString();
                        //row.AutoSubmitted = autoSubmitted;

                        expenseRepo.Update(row);
                    }
                    retVal= true;
                }
                //statement update
                submittedStatement.ExpenseTotal = allExpenses;
                submittedStatement.IncomeTotal = allIncome;
                submittedStatement.Balance = Math.Round(allIncome - allExpenses, 2);
                submittedStatement.UpdatedDate = DateTime.Now;
                submittedStatement.UpdatedBy = _applicationUserId;
                statementRepo.Update(submittedStatement);
            }
            return retVal;
        }

        public bool AutoSubmitStatement(string userId, int year, int month)
        {
            StatementsSubmit statement = new StatementsSubmit() { UserId= userId, Month = month, Year = year, Period = "Monthly" };
            return SubmitStatement(statement,true);
        }

        public List<string> GetUnsubmittedStatements(int forceSubmitDay)
        {
            //find statements that have not been submitted for the previous month, assuming the SW runs the <<forceSubmitDay>> of the following month,
            //not having a statement for any users but have income/expenses mean they have not submitted and needs to be auto submit.
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);

            return new List<string>();
        }
    }
    #endregion
}