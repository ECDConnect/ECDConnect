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
using AngleSharp.Css.Dom;

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
            return  GetAllExpenseLines(userId, year, month, LinesStatus.ANY);
        }
        public List<StatementsIncome> GetAllStatementsIncome(string userId, int year, int month)
        {
            return GetAllIncomeLines(userId, year, month, LinesStatus.ANY);
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

        public List<StatementsBalanceSheet> GetAllStatementsBalanceSheet(string userId, int year, int month)
        {
            List<StatementsBalanceSheet> balanceSheets = new List<StatementsBalanceSheet>();
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            DateTime nextMonth= DateTime.Now.AddMonths(1);

            //if (DateTime.Now.Month.Equals(month) && DateTime.Now.Year.Equals(year) && !IsSubmitted(userId, year, month))
            //{
            //    //if (month > 0 && ((year == DateTime.Now.Year && month >= DateTime.Now.Month) || (year == nextMonth.Year && month == nextMonth.Month))) //
            //    //{
            //    //    //FE requests future dated values included in next UNsubmitted set of statement lines
            //    //    double allIncomeTotal = GetAllIncomeTotal(userId, year, month, LinesStatus.SUBMITTED);
            //    //    double allExpenseTotal = GetAllExpensesTotal(userId, year, month, LinesStatus.SUBMITTED);

            //    //    double runningBalance = allIncomeTotal - allExpenseTotal;

            //    //    runningBalance = Math.Round(runningBalance, 2);

            //    //    balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round(runningBalance, 2), IncomeTotal = Math.Round(allIncomeTotal, 2), ExpenseTotal = Math.Round(allExpenseTotal, 2), Month = month, Year = year, UserId = userId, IsAutoSubmitted = false, SubmittedDate = null });
            //    //}
            //    IncomeExpenseLinesMonthly incomeExpenses = GetMonthlyIncomeExpenses(userId, year, month);
            //    if (incomeExpenses.AllUnSubmitted != null)
            //    {
                                        
            //        balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round((incomeExpenses.AllUnSubmitted.IncomeTotal - incomeExpenses.AllUnSubmitted.ExpenseTotal), 2), IncomeTotal = Math.Round(incomeExpenses.AllUnSubmitted.IncomeTotal, 2), ExpenseTotal = Math.Round(incomeExpenses.AllUnSubmitted.ExpenseTotal, 2), Month = month, Year = year, UserId = userId, AutoSubmitted = false, SubmittedDate = null, Submitted = false });

            //    }
            //}
            //else
            //{
                //Only retrieve submitted statements oif not a future dated month is requested


                var statements = statementsRepo.GetAll().Where(x => string.Equals(x.UserId, userId)).ToList();
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
                            var allMonths = statements.Where(x => x.Year == currentYear).Select(y => y.Month).Distinct().ToList();
                            if (month > 0) //filter to specific month
                            {
                                statements = statements.Where(x => x.Month.Equals(month)).ToList();
                            }
                            if (allMonths.Any())
                            {
                                //TODO //if currentmonth is not yet submitted, add this too but pull previous entries not yet submitted and include in this iteration

                                allMonths.OrderDescending();
                                foreach (var loopMonth in allMonths)
                                { 
                                    var statementCheck = statements.Where(x => x.Year.Equals(currentYear) && x.Month.Equals(loopMonth)).FirstOrDefault();
                                    bool isAutoSubmitted = (statementCheck != null ? statementCheck.AutoSubmitted : false);
                                    var allIncome = statements.Where(x => x.Year.Equals(currentYear) && x.Month.Equals(loopMonth)).Select(y => y.IncomeTotal).ToList();
                                    var allExpenses = statements.Where(x => x.Year.Equals(currentYear) && x.Month.Equals(loopMonth)).Select(y => y.ExpenseTotal).ToList();

                                    double allIncomeTotal = allIncome.Sum();
                                    double allExpenseTotal = allExpenses.Sum();

                                    double balance = allIncomeTotal - allExpenseTotal;

                                    balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round(balance, 2), IncomeTotal = Math.Round(allIncomeTotal, 2), ExpenseTotal = Math.Round(allExpenseTotal, 2), Month = loopMonth, Year = currentYear, UserId = userId, Submitted = true, AutoSubmitted = isAutoSubmitted, SubmittedDate = statementCheck.SubmittedDate });
                                }
                            }

                        }
                    }
                    else return new List<StatementsBalanceSheet>();
                }
            if (DateTime.Now.Month.Equals(month) && DateTime.Now.Year.Equals(year) && !IsSubmitted(userId, year, month))
            {
                //if (month > 0 && ((year == DateTime.Now.Year && month >= DateTime.Now.Month) || (year == nextMonth.Year && month == nextMonth.Month))) //
                //{
                //    //FE requests future dated values included in next UNsubmitted set of statement lines
                //    double allIncomeTotal = GetAllIncomeTotal(userId, year, month, LinesStatus.SUBMITTED);
                //    double allExpenseTotal = GetAllExpensesTotal(userId, year, month, LinesStatus.SUBMITTED);

                //    double runningBalance = allIncomeTotal - allExpenseTotal;

                //    runningBalance = Math.Round(runningBalance, 2);

                //    balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round(runningBalance, 2), IncomeTotal = Math.Round(allIncomeTotal, 2), ExpenseTotal = Math.Round(allExpenseTotal, 2), Month = month, Year = year, UserId = userId, IsAutoSubmitted = false, SubmittedDate = null });
                //}
                IncomeExpenseLinesMonthly incomeExpenses = GetMonthlyIncomeExpenses(userId, year, month);
                if (incomeExpenses.AllUnSubmitted != null)
                {

                    balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round((incomeExpenses.AllUnSubmitted.IncomeTotal - incomeExpenses.AllUnSubmitted.ExpenseTotal), 2), IncomeTotal = Math.Round(incomeExpenses.AllUnSubmitted.IncomeTotal, 2), ExpenseTotal = Math.Round(incomeExpenses.AllUnSubmitted.ExpenseTotal, 2), Month = month, Year = year, UserId = userId, AutoSubmitted = false, SubmittedDate = null, Submitted = false });

                }
            } else
            {
                IncomeExpenseLinesMonthly incomeExpenses = GetMonthlyIncomeExpenses(userId, DateTime.Now.Year, DateTime.Now.Month);
                if (incomeExpenses.AllUnSubmitted != null)
                {

                    balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round((incomeExpenses.AllUnSubmitted.IncomeTotal - incomeExpenses.AllUnSubmitted.ExpenseTotal), 2), IncomeTotal = Math.Round(incomeExpenses.AllUnSubmitted.IncomeTotal, 2), ExpenseTotal = Math.Round(incomeExpenses.AllUnSubmitted.ExpenseTotal, 2), Month = DateTime.Now.Month, Year = DateTime.Now.Year, UserId = userId, AutoSubmitted = false, SubmittedDate = null, Submitted = false });

                }
            }
            //}
            //check if current month has any unsubmitted values, then add it to new month if already submitted            
            return balanceSheets;            
        }

        public List<StatementsStartupSupport> GetAllStatementsStartupSupport(string userId, int year, int month)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsStartupSupport>(userContext: _applicationUserId);
            return expenseRepo.GetAll()
                .Where(x => x.UserId.Equals(userId) && x.InsertedDate.Year.Equals(year) && x.InsertedDate.Month.Equals(month))
                .ToList();
        }

        public double GetRunningBalance(string userId, int year, int month, string lineStatus = LinesStatus.ANY)
        {
            double allIncome = GetAllIncomeTotal(userId, year, month, lineStatus);
            double allExpenses = GetAllExpensesTotal(userId, year, month, lineStatus);

            double runningBalance = allIncome - allExpenses;

            return Math.Round(runningBalance, 2);
        }

        private double GetAllIncomeTotal(string userId, int year, int month, string lineStatus = LinesStatus.ANY)
        {
            double allIncome = 0;
            var allIncomeLines = GetAllIncomeLines(userId, year, month, lineStatus);
            if (allIncomeLines.Count > 0)
            {
                allIncome = allIncomeLines.Sum(y => y.Amount);
            }

            return Math.Round(allIncome, 2);
        }

        private List<StatementsIncome> GetAllIncomeLines(string userId, int year, int month, string lineStatus = LinesStatus.ANY)
        {
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            List<StatementsIncome> incomeRows = incomeRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DateReceived.Year.Equals(year) && x.DateReceived.Month.Equals(month))
                    .ToList();

            if (month > 0) //filter into months if we need to focus on a specific month
            {
                incomeRows = incomeRows.Where(y => int.Equals(y.DateReceived.Month, month)).ToList();
            }
            if (lineStatus == LinesStatus.UNSUBMITTED)
            {
                incomeRows = incomeRows.Where(y => y.Submitted.Equals(false)).ToList();
            }
            else if (lineStatus == LinesStatus.SUBMITTED)
            {
                incomeRows = incomeRows .Where(y => y.Submitted.Equals(true)).ToList();
            }

            return incomeRows;
        }

        private List<StatementsIncome> GetAllLateIncomeLines(string userId, int year, int month)
        {
            //function to retrieve lines not submitted from a month where others have been submitted
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            List<StatementsIncome> incomeRows = incomeRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DateReceived.Year.Equals(year) && x.DateReceived.Month.Equals(month) && x.Submitted.Equals(false))
                    .ToList();

            if (month > 0) //filter into months if we need to focus on a specific month
            {
                incomeRows = incomeRows.Where(y => int.Equals(y.DateReceived.Month, month)).ToList();
            }

            return incomeRows;
        }

        private StatementsIncomeStatement GetStatementsIncomeStatementById(string lineId)
        {
            //function to retrieve lines not submitted from a month where others have been submitted
            var statementRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            return statementRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.Id, lineId) && x.IsActive == true)
                    .FirstOrDefault();
        }

        private double GetAllExpensesTotal(string userId, int year, int month, string lineStatus = LinesStatus.ANY)
        {
            double allExpenses = 0;

            var allExpenseLines = GetAllExpenseLines(userId, year, month, lineStatus);
            if (allExpenseLines.Count > 0)
            {
                allExpenses = allExpenseLines.Sum(y => y.Amount);
            }

            return Math.Round(allExpenses, 2);
        }

        private List<StatementsExpenses> GetAllExpenseLines(string userId, int year, int month, string lineStatus = LinesStatus.ANY)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            List<StatementsExpenses> expenseRows = expenseRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DatePaid.Year.Equals(year) && x.DatePaid.Month.Equals(month))
                    .ToList();

            if (month > 0) //filter into months if we need to focus on a specific month
            {
                expenseRows = expenseRows.Where(y => int.Equals(y.DatePaid.Month, month)).ToList();
            }
            if (lineStatus == LinesStatus.UNSUBMITTED)
            {
                expenseRows = expenseRows.Where(y => y.Submitted.Equals(false)).ToList();
            } else if (lineStatus == LinesStatus.SUBMITTED)
            {
                expenseRows = expenseRows.Where(y => y.Submitted.Equals(true)).ToList();
            }
            return expenseRows;
        }

        private List<StatementsExpenses> GetAllLateExpenseLines(string userId, int year, int month)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            List<StatementsExpenses> expenseRows = expenseRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DatePaid.Year.Equals(year) && x.DatePaid.Month.Equals(month) && x.Submitted.Equals(false))
                    .ToList();

            if (month > 0) //filter into months if we need to focus on a specific month
            {
                expenseRows = expenseRows.Where(y => int.Equals(y.DatePaid.Month, month)).ToList();
            }
            return expenseRows;
        }

        private IncomeExpenseLinesMonthly GetMonthlyIncomeExpenses(string userId, int year, int month)
    {
            IncomeExpenseLinesMonthly incomeExpenses = new IncomeExpenseLinesMonthly();    
            DateTime previousTimePeriod = DateTime.Now.AddMonths(-1); //previous months date to check for any unsubmitted records of current - 1 month

            //all
            var latestIncomeRowsAll = GetAllIncomeLines(userId, year, month, LinesStatus.ANY);
            var latestExpenseRowsAll = GetAllExpenseLines(userId, year, month, LinesStatus.ANY);

            incomeExpenses.AllLines = new IncomeExpenseLines();
            incomeExpenses.AllLines.Submitted = false;
            incomeExpenses.AllLines.Month = month;
            incomeExpenses.AllLines.Year = year;
            string statementIdAll = null;
            if (latestIncomeRowsAll.Any()) {
                incomeExpenses.AllLines.Income = latestIncomeRowsAll;
                incomeExpenses.AllLines.IncomeTotal = latestIncomeRowsAll.Select(x => x.Amount).Sum();

                statementIdAll = latestIncomeRowsAll[0].IncomeStatementId;
            }
            if (latestExpenseRowsAll.Any())
            {
                incomeExpenses.AllLines.Expenses = latestExpenseRowsAll;
                incomeExpenses.AllLines.ExpenseTotal = latestExpenseRowsAll.Select(x => x.Amount).Sum();

                statementIdAll = latestExpenseRowsAll[0].IncomeStatementId;
            }
            if (statementIdAll != null) {
                var statement = GetStatementsIncomeStatementById(statementIdAll);
                incomeExpenses.AllLines.AutoSubmitted = statement.AutoSubmitted;
            }
            //submitted
            incomeExpenses.AllSubmitted = new IncomeExpenseLines();
            var latestIncomeRowsSubmitted = GetAllIncomeLines(userId, year, month, LinesStatus.SUBMITTED);
            var latestExpenseRowsSubmitted = GetAllExpenseLines(userId, year, month, LinesStatus.SUBMITTED);
            string statementIdSubmitted = null;

            incomeExpenses.AllSubmitted.Submitted = true;
            incomeExpenses.AllSubmitted.Month = month;
            incomeExpenses.AllSubmitted.Year = year;
            if (latestIncomeRowsSubmitted.Any())
            {
                incomeExpenses.AllSubmitted.Income = latestIncomeRowsSubmitted;
                incomeExpenses.AllSubmitted.IncomeTotal = latestIncomeRowsSubmitted.Select(x => x.Amount).Sum();
                statementIdSubmitted = latestIncomeRowsSubmitted[0].IncomeStatementId;
            }
            if (latestExpenseRowsSubmitted.Any())
            {
                incomeExpenses.AllSubmitted.Expenses = latestExpenseRowsSubmitted;
                incomeExpenses.AllSubmitted.ExpenseTotal = latestExpenseRowsSubmitted.Select(x => x.Amount).Sum();
                statementIdSubmitted = latestExpenseRowsSubmitted[0].IncomeStatementId;
            }
            if (statementIdSubmitted != null)
            {
                var statement = GetStatementsIncomeStatementById(statementIdSubmitted);
                incomeExpenses.AllSubmitted.AutoSubmitted = statement.AutoSubmitted;
            }

            //unsubmitted of this month and previous month
            incomeExpenses.AllUnSubmitted = new IncomeExpenseLines();
            var latestIncomeRowsUnSubmitted = GetAllIncomeLines(userId, year, month, LinesStatus.UNSUBMITTED);
            var latestExpenseRowsUnSubmitted = GetAllExpenseLines(userId, year, month, LinesStatus.UNSUBMITTED);
            var latestIncomeRowsLastMonthUnSubmitted = GetAllLateIncomeLines(userId, previousTimePeriod.Year, previousTimePeriod.Month);
            var latestExpenseRowsLastMonthUnSubmitted = GetAllLateExpenseLines(userId, previousTimePeriod.Year, previousTimePeriod.Month);

            //add late rows  to current month
            if (latestIncomeRowsLastMonthUnSubmitted.Any())
            {
                latestIncomeRowsUnSubmitted.AddRange(latestIncomeRowsLastMonthUnSubmitted);
            }
            if (latestExpenseRowsLastMonthUnSubmitted.Any())
            {
                latestExpenseRowsUnSubmitted.AddRange(latestExpenseRowsLastMonthUnSubmitted);
            }
            
            incomeExpenses.AllUnSubmitted.Month = month;
            incomeExpenses.AllUnSubmitted.Year = year;
            if (latestIncomeRowsUnSubmitted.Any())
            {
                incomeExpenses.AllUnSubmitted.Income = latestIncomeRowsUnSubmitted;
                incomeExpenses.AllUnSubmitted.IncomeTotal = latestIncomeRowsUnSubmitted.Select(x => x.Amount).Sum();
            }
            if (latestIncomeRowsUnSubmitted.Any())
            {
                incomeExpenses.AllUnSubmitted.Expenses = latestExpenseRowsUnSubmitted;
                incomeExpenses.AllUnSubmitted.ExpenseTotal = latestExpenseRowsUnSubmitted.Select(x => x.Amount).Sum();
            }
            incomeExpenses.AllUnSubmitted.AutoSubmitted = false;
            incomeExpenses.AllUnSubmitted.Submitted = false;

            return incomeExpenses;
    }

    private bool IsSubmitted(string userId, int year, int month)
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
            var statementRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            DateTime previousTimePeriod = DateTime.Now.AddMonths(-1); //previous months date to check for any unsubmitted records of current - 1 month

            //var latestIncomeRows = GetAllIncomeLines(model.UserId, model.Year, model.Month, LinesStatus.SUBMITTED);
            //var unsubmittedIncomeRows = GetAllIncomeLines(model.UserId, previousTimePeriod.Year, previousTimePeriod.Month, LinesStatus.UNSUBMITTED);
            //var latestExpenseRows = GetAllExpenseLines(model.UserId, model.Year, model.Month, LinesStatus.SUBMITTED);
            //var unsubmittedExpenseRows = GetAllExpenseLines(model.UserId, previousTimePeriod.Year, previousTimePeriod.Month, LinesStatus.UNSUBMITTED);

            IncomeExpenseLinesMonthly incomeExpenses = GetMonthlyIncomeExpenses(model.UserId, model.Year, model.Month);

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
                if (incomeExpenses.AllUnSubmitted.Income.Count > 0)
                {
                    var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
                    //if (unsubmittedIncomeRows.Any()) // if any statement lines were added after previous months submission, these get added to the newest submission
                    //{
                    //    latestIncomeRows.AddRange(unsubmittedIncomeRows);
                    //}
                    foreach (var row in incomeExpenses.AllUnSubmitted.Income)
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
                if (incomeExpenses.AllUnSubmitted.Expenses.Count > 0)
                {
                    var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
                    //if (unsubmittedExpenseRows.Any()) // if any statement lines were added after previous months submission, these get added to the newest submission
                    //{
                    //    latestExpenseRows.AddRange(unsubmittedExpenseRows);
                    //}
                    foreach (var row in incomeExpenses.AllUnSubmitted.Expenses)
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

            //TODO for service worker

            return new List<string>();
        }
    }
    #endregion

}