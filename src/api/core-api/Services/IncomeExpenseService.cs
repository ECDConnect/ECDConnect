using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using ECDLink.Security.Extensions;
using ECDLink.Core.Extensions;
using Document = ECDLink.DataAccessLayer.Entities.Documents.Document;
using HotChocolate;
using EcdLink.Api.CoreApi.Managers;
using ECDLink.DataAccessLayer.Entities;
using Microsoft.AspNetCore.Identity;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.DataAccessLayer.Hierarchy;
using DinkToPdf;
using System.Globalization;

namespace ECDLink.Core.Services
{
    public class IncomeExpenseService : IIncomeExpenseService
    {
        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private string _applicationUserId;
        private string _adminId;
        private readonly int _submitEndDate;
        private IGenericRepository<StatementsExpenseType, Guid> _statementsExpenseTypeRepo;
        private IGenericRepository<StatementsExpenses, Guid> _statementsExpensesRepo;
        private IGenericRepository<StatementsIncomeType, Guid> _statementsIncomeTypeRepo;
        private IGenericRepository<StatementsIncome, Guid> _statementsIncomeRepo;
        private IGenericRepository<StatementsContributionType, Guid> _statementsContributionTypeRepo;
        private IGenericRepository<Child, Guid> _childRepo;

        private IPointsEngineService _pointsEngineService;

        private UserManager<ApplicationUser> _userManager;
        private IFileService _fileService;
        private DocumentManager _documentManager;
        private PersonnelService _personnelService;
        private HierarchyEngine _hierarchyEngine;

        public IncomeExpenseService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] IFileService fileService,
            [Service] DocumentManager documentManager,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] PersonnelService personnelService,
            ISystemSetting<IncomeStatementSubmitEndOptions> submitEndDate, 
            IPointsEngineService pointsEngineService,
            HierarchyEngine hierarchyEngine
            )
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetIntegrationUserId());
            _submitEndDate = int.Parse(submitEndDate.Value.IncomeStatementSubmitEnd);            

            _statementsExpenseTypeRepo = _repoFactory.CreateGenericRepository<StatementsExpenseType>(userContext: _applicationUserId);
            _statementsExpensesRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            _statementsIncomeTypeRepo = _repoFactory.CreateGenericRepository<StatementsIncomeType>(userContext: _applicationUserId);
            _statementsIncomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            _statementsContributionTypeRepo = _repoFactory.CreateGenericRepository<StatementsContributionType>(userContext: _applicationUserId);
            _childRepo = _repoFactory.CreateGenericRepository<Child>(userContext: _applicationUserId);

            _userManager = userManager;
            _fileService = fileService;
            _documentManager = documentManager;
            _personnelService = personnelService;
            _pointsEngineService = pointsEngineService;
        }

        #region Utils
        public static StatementsSubmitPeriod GetStatementPeriod()
        {
            return new StatementsSubmitPeriod() { Start = DateTime.Now.GetStartOfPreviousMonth().AddDays(24).Date, End = DateTime.Now.GetStartOfMonth().AddDays(7).Date };
        }
        #endregion

        #region Statement Queries

        public List<StatementsExpenses> GetAllStatementsExpenses(string userId, int year, int month)
        {
            return GetAllExpenseLines(userId, year, month, LinesStatus.ANY);
        }
        public List<StatementsIncome> GetAllStatementsIncome(string userId, int year, int month)
        {
            return GetAllIncomeLines(userId, year, month, LinesStatus.ANY);
        }
        public List<StatementsIncomeStatement> GetAllStatementsIncomeStatement(string userId, int year, int month)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            var statements = expenseRepo.GetAll()
                .Where(x => x.UserId.Equals(userId) && x.Year.Equals(year))
                .ToList();

            if (statements.Any())
            {
                //check month
                if (statements.Where(x => x.Month >= month).Count() > 0)
                    return statements.Where(x => x.Month >= month).ToList();
                else
                    return statements;
            }
            else return new List<StatementsIncomeStatement>();
        }

        /// <summary>
        /// Returns the balance sheets for all months in the given year, or limited to a specific month if that is passed in
        /// </summary>
        /// <param name="userId">UserId of practitioner to fetch balance sheets for</param>
        /// <param name="year">Year to fetch balance sheets for (Required)</param>
        /// <param name="month">Month to get balance sheet for if only one is required</param>
        /// <returns>Balance sheet for each month required. For the current month this will be calculated from the current income and expnses</returns>
        public List<StatementsBalanceSheet> GetAllStatementsBalanceSheet(string userId, int year, int? month = null)
        {
            var balanceSheets = new List<StatementsBalanceSheet>();
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);            

            var statements = statementsRepo.GetAll().Where(x => 
                string.Equals(x.UserId, userId) && 
                x.Submitted && 
                x.Year == year &&
                (!month.HasValue || x.Month == month.Value)) // Filter by month if desired
                .ToList();
                        
            var lastMonthRequired = 0;            
            if(month.HasValue)
            {
                lastMonthRequired = month.Value;
            }
            else if (DateTime.Now.Year == year)
            {
                lastMonthRequired = DateTime.Now.Month;
            }
            else
            {
                lastMonthRequired = 12;
            }

            for (int i = month ?? 1; i <= lastMonthRequired; i++)
            {
                var statement = statements.Where(x => x.Year == year && x.Month == i).FirstOrDefault();

                // If we have a statement return that
                if (statement != null)
                {
                    balanceSheets.Add(new StatementsBalanceSheet()
                    {
                        Balance = Math.Round(statement.IncomeTotal - statement.ExpenseTotal, 2),
                        IncomeTotal = Math.Round(statement.IncomeTotal, 2),
                        ExpenseTotal = Math.Round(statement.ExpenseTotal, 2),
                        Month = i,
                        Year = year,
                        UserId = userId,
                        Submitted = true,
                        AutoSubmitted = statement.AutoSubmitted,
                        SubmittedDate = statement.SubmittedDate
                    });
                }
                // Only build from income/expenses if it is the current month, or its last month and we are before the end of the submit window
                else if (DateTime.Now.Year == year && (DateTime.Now.Month == i || (DateTime.Now.Month-1 == i && DateTime.Now.Day <= _submitEndDate))) 
                {
                    // Build a statement estimate from income and expenses (include any unsubmitted items from previous month, if a statement has been submitted for that month)
                    var lastMonthSubmitted = statements.Any(x => x.Year == year && x.Month == i - 1);
                    var incomeExpensesForThisMonth = GetMonthlyIncomeExpenses(userId, year, i);
                    var incomeExpensesForLastMonth = GetMonthlyIncomeExpenses(userId, year, i-1);

                    var incomeTotal = incomeExpensesForThisMonth.AllUnSubmitted?.IncomeTotal ?? 0 + (!lastMonthSubmitted ? incomeExpensesForLastMonth.AllUnSubmitted?.IncomeTotal ?? 0 : 0);
                    var expenseTotal = incomeExpensesForThisMonth.AllUnSubmitted?.ExpenseTotal ?? 0 + (!lastMonthSubmitted ? incomeExpensesForLastMonth.AllUnSubmitted?.ExpenseTotal ?? 0 : 0);

                    balanceSheets.Add(new StatementsBalanceSheet()
                    {
                        Balance = Math.Round((incomeTotal - expenseTotal), 2),
                        IncomeTotal = Math.Round(incomeTotal, 2),
                        ExpenseTotal = Math.Round(expenseTotal, 2),
                        Month = i,
                        Year = year,
                        UserId = userId,
                        AutoSubmitted = false,
                        SubmittedDate = null,
                        Submitted = false
                    });
                }
            }

            return balanceSheets;
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

        private List<StatementsIncome> GetAllIncomeLines(string userId, int year, int month, string lineStatus)
        {
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            List<StatementsIncome> incomeRows = incomeRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DateReceived.Year.Equals(year))
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
                incomeRows = incomeRows.Where(y => y.Submitted.Equals(true)).ToList();
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

        private StatementsIncomeStatement GetStatementsIncomeStatementById(string lineId, string userId)
        {
            //retrieve lines not submitted from a month where others have been submitted
            var statementRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            return statementRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.Id, lineId) && x.IsActive == true && string.Equals(x.UserId, userId))
                    .OrderBy(x => x.Id)
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

        private List<StatementsExpenses> GetAllExpenseLines(string userId, int year, int month, string lineStatus)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            List<StatementsExpenses> expenseRows = expenseRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DatePaid.Year.Equals(year))
                    .ToList();

            if (month > 0) //filter into months if we need to focus on a specific month
            {
                expenseRows = expenseRows.Where(y => int.Equals(y.DatePaid.Month, month)).ToList();
            }
            if (lineStatus == LinesStatus.UNSUBMITTED)
            {
                expenseRows = expenseRows.Where(y => y.Submitted.Equals(false)).ToList();
            }
            else if (lineStatus == LinesStatus.SUBMITTED)
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
            var previousTimePeriod = new DateTime(year, month, 1).AddMonths(-1); //previous months (to submission) date to check for any unsubmitted records of current

            //all lines
            var latestIncomeRowsAll = GetAllIncomeLines(userId, year, month, LinesStatus.ANY);
            var latestExpenseRowsAll = GetAllExpenseLines(userId, year, month, LinesStatus.ANY);

            incomeExpenses.AllLines = new IncomeExpenseLines();
            incomeExpenses.AllLines.Submitted = false;
            incomeExpenses.AllLines.Month = month;
            incomeExpenses.AllLines.Year = year;
            string statementIdAll = null;
            if (latestIncomeRowsAll.Any())
            {
                incomeExpenses.AllLines.Income = latestIncomeRowsAll;
                incomeExpenses.AllLines.IncomeTotal = latestIncomeRowsAll.Select(x => x.Amount).Sum();

                statementIdAll = latestIncomeRowsAll[0].StatementsIncomeStatementId.ToString();
            }
            if (latestExpenseRowsAll.Any())
            {
                incomeExpenses.AllLines.Expenses = latestExpenseRowsAll;
                incomeExpenses.AllLines.ExpenseTotal = latestExpenseRowsAll.Select(x => x.Amount).Sum();

                statementIdAll = latestExpenseRowsAll[0].StatementsIncomeStatementId.ToString();
            }
            if (statementIdAll != null)
            {
                var statement = GetStatementsIncomeStatementById(statementIdAll, userId);
                if (statement != null)
                {
                    incomeExpenses.AllLines.AutoSubmitted = statement.AutoSubmitted;
                }
            }
            //submitted lines only
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
                statementIdSubmitted = latestIncomeRowsSubmitted[0].StatementsIncomeStatementId.ToString();
            }
            if (latestExpenseRowsSubmitted.Any())
            {
                incomeExpenses.AllSubmitted.Expenses = latestExpenseRowsSubmitted;
                incomeExpenses.AllSubmitted.ExpenseTotal = latestExpenseRowsSubmitted.Select(x => x.Amount).Sum();
                statementIdSubmitted = latestExpenseRowsSubmitted[0].StatementsIncomeStatementId.ToString();
            }
            if (statementIdSubmitted != null)
            {
                var statement = GetStatementsIncomeStatementById(statementIdSubmitted, userId);
                if (statement != null)
                {
                    incomeExpenses.AllSubmitted.AutoSubmitted = statement.AutoSubmitted;
                }
            }

            //unsubmitted lines of this month and previous month
            incomeExpenses.AllUnSubmitted = new IncomeExpenseLines();
            var latestIncomeRowsUnSubmitted = GetAllIncomeLines(userId, year, month, LinesStatus.UNSUBMITTED);
            var latestExpenseRowsUnSubmitted = GetAllExpenseLines(userId, year, month, LinesStatus.UNSUBMITTED);
            var latestIncomeRowsLastMonthUnSubmitted = GetAllLateIncomeLines(userId, previousTimePeriod.Year, previousTimePeriod.Month);
            var latestExpenseRowsLastMonthUnSubmitted = GetAllLateExpenseLines(userId, previousTimePeriod.Year, previousTimePeriod.Month);

            //add late rows  to current month - only if the previous month is not the same as what is being submitted 1 = 1
            if (!previousTimePeriod.Year.Equals(year) && !previousTimePeriod.Month.Equals(month))
            {
                if (latestIncomeRowsLastMonthUnSubmitted.Any())
                {
                    latestIncomeRowsUnSubmitted.AddRange(latestIncomeRowsLastMonthUnSubmitted);
                }
                if (latestExpenseRowsLastMonthUnSubmitted.Any())
                {
                    latestExpenseRowsUnSubmitted.AddRange(latestExpenseRowsLastMonthUnSubmitted);
                }
            }

            incomeExpenses.AllUnSubmitted.Month = month;
            incomeExpenses.AllUnSubmitted.Year = year;
            if (latestIncomeRowsUnSubmitted.Any())
            {
                incomeExpenses.AllUnSubmitted.Income = latestIncomeRowsUnSubmitted;
                incomeExpenses.AllUnSubmitted.IncomeTotal = latestIncomeRowsUnSubmitted.Select(x => x.Amount).Sum();
            }
            if (latestExpenseRowsUnSubmitted.Any())
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
                rows = rows.Where(y => y.Month >= month).ToList();
            }
            if (rows.Count > 0)
            {
                isStatementSubmitted = true;
            }
            return isStatementSubmitted;
        }

        private DateTime? GetLastSubmittedDate(string userId)
        {
            bool isStatementSubmitted = false;
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            var row = statementsRepo.GetAll() //get all rows for year to date
                    .Where(x => string.Equals(x.UserId, userId))
                   .OrderByDescending(y => y.SubmittedDate)
                   .Select(y => y.SubmittedDate)
                    .FirstOrDefault();
            return row;            
        }

        public List<StatementReport> GetStatementLinesToReport(string userId, int year, int month)
        {
            var submittedStatements = GetAllStatementsIncomeStatement(userId, year, month);
            List<StatementReport> statements = new List<StatementReport>();
            //get income
            List<StatementReport> incomes = GetAllStatementIncome(userId, submittedStatements.FirstOrDefault().Id.ToString());

            //get expenses
            List<StatementReport> expenses = GetAllStatementExpenses(userId, submittedStatements.FirstOrDefault().Id.ToString());

            statements.AddRange(incomes);
            statements.AddRange(expenses);

            return statements;
        }

        public List<StatementReport> GetAllStatementExpenses(string userId, string statementId)
        {
            List<StatementReport> reportData = new List<StatementReport>();
            // Only return types linked to expenses for params
            var report = 
            (
                from statementsExpenses in _statementsExpensesRepo.GetAll().Where(y => string.Equals(y.UserId, userId) && y.IsActive == true && y.StatementsIncomeStatementId.Equals(statementId))
                join statementExpenseType in _statementsExpenseTypeRepo.GetAll().Where(x => x.IsActive == true).OrderBy(z => z.Description) on statementsExpenses.ExpenseTypeId equals statementExpenseType.Id.ToString()
                select new { statementExpenseType.Description, statementsExpenses.Amount }
            ).ToList();
            foreach ( var statement in report )
            {
                reportData.Add(new StatementReport() { StatementLine = statement.Description, Value = statement.Amount, StatementType = "Expenses" });
            }

            return reportData;
        }

        public List<StatementReport> GetAllStatementIncome(string userId, string statementId)
        {
            List<StatementReport> reportData = new List<StatementReport>();
            // Only return types linked to income for params
            var report =
            (
                from StatementsIncome in _statementsIncomeRepo.GetAll().Where(y => string.Equals(y.UserId, userId) && y.IsActive == true && y.StatementsIncomeStatementId.Equals(statementId))
                join StatementsIncomeType in _statementsIncomeTypeRepo.GetAll().Where(x => x.IsActive == true).OrderBy(z => z.Description) on StatementsIncome.IncomeTypeId equals StatementsIncomeType.Id.ToString()
                select new { StatementsIncomeType.Description, StatementsIncome.Amount }
            ).ToList();
            foreach (var statement in report)
            {
                reportData.Add(new StatementReport() { StatementLine = statement.Description, Value = statement.Amount, StatementType = "Income" });
            }

            return reportData;
        }


        public List<StatementsExpenseType> GetAllStatementExpenseTypes(string userId, int year, int month)
        {
            // Only return types linked to expenses for params
            return
            (
                from statementsExpenses in _statementsExpensesRepo.GetAll().Where(y => string.Equals(y.UserId, userId) && y.IsActive == true && y.DatePaid.Year.Equals(year) && y.DatePaid.Month.Equals(month) && y.Submitted.Equals(true))
                join statementExpenseType in _statementsExpenseTypeRepo.GetAll().Where(x => x.IsActive == true).OrderBy(z => z.Description) on statementsExpenses.ExpenseTypeId equals statementExpenseType.Id.ToString()
                select statementExpenseType
            ).Distinct().ToList();
        }

        public List<IncomeExpensePDFDataModel> GetAllStatementsExpensesForType(string userId, int year, int month, string expenseTypeId)
        {
            List<StatementsExpenses> expenseRows = _statementsExpensesRepo.GetAll()
                    .Where(x => string.Equals(x.UserId, userId)
                        && x.IsActive == true
                        && x.DatePaid.Year.Equals(year)
                        && x.DatePaid.Month.Equals(month)
                        && string.Equals(x.ExpenseTypeId, expenseTypeId)
                        && x.Submitted.Equals(true))
                    .ToList();

            List<IncomeExpensePDFDataModel> results = new List<IncomeExpensePDFDataModel>();
            var invoiceNr = 1;
            foreach (var expense in expenseRows)
            {
                var result = new IncomeExpensePDFDataModel();
                result.Description = expense.Notes;
                result.Date = expense.DatePaid;
                result.Amount = expense.Amount;
                result.PhotoProof = expense.PhotoProof;
                result.InvoiceNr = invoiceNr;
                results.Add(result);
                invoiceNr++;
            }
            return results;
        }

        public List<StatementsIncomeType> GetAllStatementIncomeTypes(string userId, int year, int month)
        {
            // Only return types linked to incomes for params
            return
            (
                from statementsIncome in _statementsIncomeRepo.GetAll().Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DateReceived.Year.Equals(year) && x.DateReceived.Month.Equals(month) && x.Submitted.Equals(true))
                join statementIncomeType in _statementsIncomeTypeRepo.GetAll().Where(x => x.IsActive == true).OrderBy(z => z.Description) on statementsIncome.IncomeTypeId equals statementIncomeType.Id.ToString()
                select statementIncomeType
            ).Distinct().ToList();
        }
        public List<StatementsContributionType> GetAllStatementContributionTypes(string userId, int year, int month)
        {
            // Only return types linked to incomes for params
            return
            (
                from statementsIncome in _statementsIncomeRepo.GetAll().Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DateReceived.Year.Equals(year) && x.DateReceived.Month.Equals(month) && x.Submitted.Equals(true))
                join statementContributionType in _statementsContributionTypeRepo.GetAll().Where(x => x.IsActive == true).OrderBy(z => z.Description) on statementsIncome.ContributionTypeId equals statementContributionType.Id.ToString()
                select statementContributionType
            ).Distinct().ToList();
        }

        public List<IncomeExpensePDFDataModel> GetMonetaryContributions(string userId, int year, int month, string preschoolFeeId, string moneyId)
        {
            List<StatementsIncome> incomeRows = _statementsIncomeRepo.GetAll()
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true
                        && x.DateReceived.Year.Equals(year)
                        && x.DateReceived.Month.Equals(month)
                        && x.Submitted.Equals(true)
                        && x.IncomeTypeId == preschoolFeeId
                        && x.ContributionTypeId == moneyId)
                    .ToList();

            List<IncomeExpensePDFDataModel> results = new List<IncomeExpensePDFDataModel>();
            foreach (var income in incomeRows)
            {
                var child = _childRepo.GetAll().Where(x => x.Id.ToString() == income.ChildUserId).Select(x => x.User).FirstOrDefault();
                var result = new IncomeExpensePDFDataModel();
                result.Description = income.Notes;
                result.Date = income.DateReceived;
                result.Amount = income.Amount;
                result.PhotoProof = income.PhotoProof;
                result.Child = child?.FirstName + " " + child?.Surname;
                results.Add(result);
            }
            return results;
        }

        public List<IncomeExpensePDFDataModel> getNonMonetaryContributions(string userId, int year, int month, string preschoolFeeId, string moneyId)
        {
            List<StatementsIncome> incomeRows = _statementsIncomeRepo.GetAll()
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true
                        && x.DateReceived.Year.Equals(year)
                        && x.DateReceived.Month.Equals(month)
                        && x.Submitted.Equals(true)
                        && x.IncomeTypeId == preschoolFeeId
                        && x.ContributionTypeId != moneyId)
                    .ToList();

            List<IncomeExpensePDFDataModel> results = new List<IncomeExpensePDFDataModel>();
            foreach (var income in incomeRows)
            {
                var child = _childRepo.GetAll().Where(x => x.Id.ToString() == income.ChildUserId).Select(x => x.User).FirstOrDefault();
                var result = new IncomeExpensePDFDataModel();
                result.Description = income.Notes;
                result.Date = income.DateReceived;
                result.Amount = income.Amount;
                result.PhotoProof = income.PhotoProof;
                result.Child = child?.FirstName + " " + child?.Surname;
                results.Add(result);
            }
            return results;
        }

        public List<IncomeExpensePDFDataModel> GetSubsidiesDonationsContributions(string userId, int year, int month, string otherId, List<StatementsIncomeType> incomeTypes)
        {
            List<string> incomeIds = incomeTypes.Select(x => x.Id.ToString()).ToList();

            List<StatementsIncome> incomeRows = _statementsIncomeRepo.GetAll()
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true
                        && x.DateReceived.Year.Equals(year)
                        && x.DateReceived.Month.Equals(month)
                        && x.Submitted.Equals(true)
                        && x.IncomeTypeId != otherId
                        && incomeIds.Contains(x.IncomeTypeId))
                    .ToList();

            List<IncomeExpensePDFDataModel> results = new List<IncomeExpensePDFDataModel>();
            foreach (var income in incomeRows)
            {
                var result = new IncomeExpensePDFDataModel();
                result.Description = income.Notes;
                result.Date = income.DateReceived;
                result.Amount = income.Amount;
                result.PhotoProof = income.PhotoProof;
                result.Type = incomeTypes.Where(x => x.Id.ToString() == income.IncomeTypeId).Select(y => y.Description).FirstOrDefault();
                results.Add(result);
            }
            return results;

        }
        public List<IncomeExpensePDFDataModel> GetOtherIncome(string userId, int year, int month, string otherId)
        {
            List<StatementsIncome> incomeRows = _statementsIncomeRepo.GetAll()
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DateReceived.Year.Equals(year) && x.DateReceived.Month.Equals(month) && x.Submitted.Equals(true) && x.IncomeTypeId.Equals(otherId))
                    .ToList();

            List<IncomeExpensePDFDataModel> results = new List<IncomeExpensePDFDataModel>();
            foreach (var income in incomeRows)
            {
                var result = new IncomeExpensePDFDataModel();
                result.Description = income.Notes;
                result.Date = income.DateReceived;
                result.Amount = income.Amount;
                result.PhotoProof = income.PhotoProof;
                results.Add(result);
            }
            return results;
        }

        #endregion

        #region Statement Mutations

        public StatementsIncome UpdateIncome(StatementsIncome model)
        {
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);

            double incomeAmount = Math.Round(model.Amount, 2);
            model.Amount = incomeAmount;

            StatementsIncome income = incomeRepo.GetById(model.Id);
            if (income == null)
            {
                //validity duplication check
                StatementsIncome incomeCheck = incomeRepo.GetAll().Where(x => x.Amount.Equals(model.Amount) && x.DateReceived.Equals(model.DateReceived) && x.IncomeTypeId.Equals(model.IncomeTypeId) && x.PayTypeId.Equals(model.PayTypeId) && x.UserId.Equals(model.UserId) && x.ChildUserId.Equals(model.ChildUserId)).OrderBy(x => x.Id).FirstOrDefault();
                if (incomeCheck == null)
                {

                    model.Submitted = false;
                    model.StatementsIncomeStatementId = null;
                    incomeRepo.Insert(model);
                    return model;
                }
            }
            else
            {
                if (!income.Submitted)//once submitted, no further updates can be made
                {
                    incomeRepo.Update(model);
                    return model;
                }
            }
            return null;
        }

        public StatementsExpenses UpdateExpense(StatementsExpenses model)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);

            double expenseAmount = Math.Round(model.Amount, 2);
            model.Amount = expenseAmount;

            StatementsExpenses expense = expenseRepo.GetById(model.Id);
            if (expense == null)
            {
                //validity duplication check
                StatementsExpenses expenseCheck = expenseRepo.GetAll().Where(x => x.Amount.Equals(model.Amount) && x.DatePaid.Equals(model.DatePaid) && x.ExpenseTypeId.Equals(model.ExpenseTypeId)).OrderBy(x => x.Id).FirstOrDefault();
                if (expenseCheck == null)
                {
                    model.Submitted = false;
                    model.StatementsIncomeStatementId = null;
                    expenseRepo.Insert(model);
                    return model;
                }
            }
            else
            {
                if (!expense.Submitted)//once submitted, no further updates can be made
                {
                    expenseRepo.Update(model);
                    return model;
                }
            }
            return null;
        }

        public StatementsStartupSupport UpdateStartupSupport(StatementsStartupSupport model)
        {
            var startupRepo = _repoFactory.CreateGenericRepository<StatementsStartupSupport>(userContext: _applicationUserId);
            StatementsStartupSupport supportEntry = startupRepo.GetById(model.Id);
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
            var retVal = false;
            var statementRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            var rows = 0;
            var incomeExpenses = GetMonthlyIncomeExpenses(model.UserId, model.Year, model.Month);

            if (model.Period == "Annual")
            {
                // annually needs to look at the entire years statements and sumbit all these for only that year.
                var annualRows = statementRepo.GetAll().Where(x => string.Equals(x.UserId, model.UserId) && x.AnnualSubmittedDate == null && x.SubmittedDate.Year.Equals(model.Year)).ToList();
                foreach (var row in annualRows)
                {
                    //lock all entries
                    row.AnnualSubmittedDate = DateTime.Now;
                    row.AutoSubmitted = autoSubmitted;
                    statementRepo.Update(row);
                    rows++;
                }
            }
            else
            {
                double allIncome = 0;
                double allExpenses = 0;
                // statement insert
                var submittedStatement = new StatementsIncomeStatement()
                {
                    AutoSubmitted = autoSubmitted,
                    Balance = 0,
                    ExpenseTotal = 0,
                    IncomeTotal = 0,
                    InsertedDate = DateTime.Now,
                    IsActive = true,
                    Month = model.Month,
                    Year = model.Year,
                    Notes = (autoSubmitted ? "Auto" : "Manual") + " Monthly Statement Submission",
                    Period = "Monthly",
                    Submitted = true,
                    SubmittedDate = DateTime.Now,
                    UserId = model.UserId,
                    Id = Guid.NewGuid(),
                    IncomeItems = new List<StatementsIncome>(),
                    ExpenseItems = new List<StatementsExpenses>()                    
                };

                // income
                if (incomeExpenses.AllUnSubmitted.Income?.Count > 0)
                {
                    var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
                    // if any statement lines were added after previous months submission, these get added to the newest submission
                    foreach (var row in incomeExpenses.AllUnSubmitted.Income)
                    {
                        allIncome += row.Amount;
                        //lock all entries
                        row.Submitted = true;
                        row.StatementsIncomeStatementId = submittedStatement.Id;
                        submittedStatement.IncomeItems.Add(row);

                        rows++;
                    }
                    retVal = true;
                }

                //expenses
                if (incomeExpenses.AllUnSubmitted.Expenses != null && incomeExpenses.AllUnSubmitted.Expenses.Count > 0)
                {
                    var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
                    // if any statement lines were added after previous months submission, these get added to the newest submission
                    foreach (var row in incomeExpenses.AllUnSubmitted.Expenses)
                    {
                        allExpenses += row.Amount;
                        //lock all entries
                        row.Submitted = true;
                        row.StatementsIncomeStatementId = submittedStatement.Id;
                        submittedStatement.ExpenseItems.Add(row);

                        rows++;
                    }
                    retVal = true;
                }

                //statement update
                submittedStatement.ExpenseTotal = allExpenses;
                submittedStatement.IncomeTotal = allIncome;
                submittedStatement.Balance = Math.Round(allIncome - allExpenses, 2);
                submittedStatement.UpdatedDate = DateTime.Now;
                submittedStatement.UpdatedBy = _applicationUserId;

                //try generating autosubmit doc
                if (rows > 0) //dont create or send empty docs
                {
                    var pdfDoc = CreateIncomeStatementPDFDocument(model.UserId, model.Year, model.Month);
                    if (pdfDoc != null)
                        submittedStatement.RelatedDocumentId = pdfDoc.Id.ToString();
                }

                statementRepo.Insert(submittedStatement);
                if (!autoSubmitted)
                {
                    _pointsEngineService.CalculateIncomeStatements(model.UserId, DateTime.UtcNow);
                }
            }            

            return retVal;
        }

        public bool AutoSubmitStatement(string userId, int year, int month)
        {
            StatementsSubmit statement = new StatementsSubmit() { UserId = userId, Month = month, Year = year, Period = "Monthly" };
            return SubmitStatement(statement, true);
        }

        public Dictionary<string, DateTime> GetUnsubmittedStatements()
        {
            StatementsSubmitPeriod submitPeriod = IncomeExpenseService.GetStatementPeriod();

            //find statements that have not been submitted for the previous month, assuming the SW runs the <<forceSubmitDay>> of the following month,
            //not having a statement for any users but have income/expenses mean they have not submitted and needs to be auto submit.
            List<Practitioner> allPractitionersToCheck = GetPractitionersDueStatements();
            Dictionary<string, DateTime> allDuePractitioners = new Dictionary<string, DateTime>();
            foreach (var practitioner in allPractitionersToCheck)
            {
                if (!IsSubmitted(practitioner.UserId, submitPeriod.Start.Year, submitPeriod.Start.Month))
                {
                    allDuePractitioners.Add(practitioner.UserId, submitPeriod.Start);
                } else
                {
                    //get last submitted date
                    DateTime? lastDate = GetLastSubmittedDate(practitioner.UserId);

                    if (lastDate == null)
                    {
                        allDuePractitioners.Add(practitioner.UserId, submitPeriod.Start);
                    } else
                    {
                        DateTime dateperiodToSubmit = (DateTime)lastDate;

                        int calcMonths = 0;
                        //check how many months to go back to catch up autosubmits to start of year
                        for (int i = dateperiodToSubmit.Month; i <= submitPeriod.Start.Month; i++)
                        {
                            dateperiodToSubmit = dateperiodToSubmit.AddMonths(calcMonths);
                            if (dateperiodToSubmit.Month == submitPeriod.Start.Month && dateperiodToSubmit.Year == submitPeriod.Start.Year)
                            {
                                allDuePractitioners.Add(practitioner.UserId, dateperiodToSubmit);
                                break;
                            } else {

                                allDuePractitioners.Add(practitioner.UserId, dateperiodToSubmit);
                            }
                            calcMonths++;
                        }
                        //allDuePractitioners.Add(practitioner.UserId, dateperiodToSubmit.AddMonths(1));
                    }
                }
            }
            return allDuePractitioners;
        }

        public List<Practitioner> GetPractitionersDueStatements()
        {
            //find all users that are principal and/or FAA that were created before the start of the  submission period, as they would be due statements for stipends
            StatementsSubmitPeriod submitPeriod = IncomeExpenseService.GetStatementPeriod();
            var pracsRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            return pracsRepo.GetAll().Where(x => (x.IsPrincipal == true || x.IsFundaAppAdmin == true) && x.InsertedDate.Date <= submitPeriod.Start.Date).ToList();
        }

        public Document CreateIncomeStatementPDFDocument(string userId, int year, int month)
        {
            // Data for pdf
            var htmlData = GetStatementsIncomeExpensesPDFData(userId, year, month);

            var uId = _contextAccessor.HttpContext.GetUser().Id;
            var nfi = (NumberFormatInfo)CultureInfo.InvariantCulture.NumberFormat.Clone();
            nfi.NumberGroupSeparator = " ";

            double allIncome = 0.0;
            double allExpense = 0.0;
            string incomeText = "";
            string expenseText = "";
            var hasExpenses = false;
            var receipts = new List<ExpenseReceipt>();

            string signDateRow = _documentManager.GetSignatureRow(
                _personnelService.GetUserSignature(userId));
            string filename = _documentManager.GetDocumentHeader(year, month) + " Statement";
            string html = $"<html><head>{_documentManager.GetDocumentStyling()}</head><body>";

            PdfDocumentHeader pdfDocumentHeader = new PdfDocumentHeader();
            pdfDocumentHeader.UserId = userId;
            pdfDocumentHeader.SiteAddress = _personnelService.GetUserSiteAddress(userId);
            pdfDocumentHeader.ReportType = "StatementsPDF";
            var userInfo = _documentManager.GetDocumentHeaderAddress(_userManager, pdfDocumentHeader);

            html += userInfo;


            //
            //  INCOMES
            //

            incomeText += "<div style='padding-top:80px;'><h1>INCOME</h1></div>";

            foreach (IncomeExpensePDFTableModel item in htmlData)
            {
                if (item.Type == "Expenses")
                {
                    hasExpenses = true;
                }

                if (item.Type == "Income")
                {
                    var totalIncome = 0.0;
                    incomeText += "<table width='100%' cellspacing='0' cellpadding='0'><tbody>";
                    incomeText += "<tr><th style='background-color: #C0C0C0;padding: 4px;' colspan='" + item.Headers.Count + "'>" + item.TableName + "</th></tr>";
                    incomeText += "<tr>";

                    foreach (IncomeExpensePDFHeaderModel header in item.Headers)
                    {
                        if (header.Header == "Amount")
                        {
                            incomeText += "<th style='background-color: #E5E5E5;text-align: right; padding-right: 4px;'>" + header.Header + "</th>";
                        }
                        else
                        {
                            incomeText += "<th style='background-color: #E5E5E5;'>" + header.Header + "</th>";
                        }
                    }
                    incomeText += "</tr>";

                    foreach (IncomeExpensePDFDataModel _data in item.Data)
                    {
                        incomeText += "<tr>";
                        foreach (IncomeExpensePDFHeaderModel header in item.Headers)
                        {
                            if (header.Header == "Date")
                            {
                                incomeText += "<td style='border-bottom: 1px solid black;width:10%;'>" + _data.Date?.ToString("dd/MM/yyyy") + "</td>";
                            }
                            else if (header.Header == "Child")
                            {
                                incomeText += "<td style='border-bottom: 1px solid black;width:20%;'>" + _data?.Child + "</td>";
                            }
                            else if (header.Header == "Description")
                            {
                                incomeText += "<td style='border-bottom: 1px solid black;width:20%;'>" + _data?.Description + "</td>";
                            }
                            else if (header.Header == "Item")
                            {
                                incomeText += "<td style='border-bottom: 1px solid black;width:20%;'>" + _data?.Description ?? "-" + "</td>";
                            }
                            else if (header.Header == "Type")
                            {
                                incomeText += "<td style='border-bottom: 1px solid black;width:20%;'>" + _data?.Type + "</td>";
                            }
                            else if (header.Header == "Amount")
                            {
                                incomeText += "<td style='border-bottom: 1px solid black;width:10%;text-align: right;'>R " + _data?.Amount.ToString("#,0.00", nfi) + "</td>";

                                allIncome += (double)_data?.Amount;
                                totalIncome += (double)_data?.Amount;
                            }

                        }
                        incomeText += "</tr>";
                    }
                    if (item.TableName == "Subsidies, donations, contributions" || item.TableName == "Preschool fees: monetary contributions" || item.TableName == "Other")
                    {
                        incomeText += "<tr><th style='border-bottom: 1px solid black;' colspan='" + (item.Headers.Count - 1) + "'>Total</th><td style='font-weight: bold;border-bottom: 1px solid black;text-align: right;'>R" + totalIncome.ToString("#,0.00", nfi) + "</td></tr>";
                    }
                    incomeText += "</tbody></table><br>";

                }
            }
            html += incomeText;

            string totalIncomeRow = "<table style='width: 100%; margin-top: 8px;'><tbody><tr><th style='background-color: #808080;padding: 4px;color: white;'>TOTAL INCOME</th><td style='background-color: #808080;padding: 4px;color: white;text-align: right;'>R " + allIncome.ToString("#,0.00", nfi) + "</td></tr></tbody></table>";
            html += totalIncomeRow;
            html += signDateRow;

            //
            //  EXPENSES
            //

            if (hasExpenses)
            {
                expenseText += "<div style='padding-top:80px;page-break-before: always;'><h1>EXPENSES</h1></div>";

                foreach (IncomeExpensePDFTableModel item in htmlData)
                {
                    if (item.Type == "Expenses")
                    {
                        var totalExpense = 0.0;
                        expenseText += "<table width='100%' cellspacing='0' cellpadding='0'><tbody>";
                        expenseText += "<tr><th style='background-color: #C0C0C0;padding: 4px;' colspan='" + item.Headers.Count + "'>" + item.TableName + "</th></tr>";
                        expenseText += "<tr>";

                        foreach (IncomeExpensePDFHeaderModel header in item.Headers)
                        {
                            if (header.Header == "Amount")
                            {
                                expenseText += "<th style='background-color: #E5E5E5;text-align: right; padding-right: 4px;'>" + header.Header + "</th>";
                            }
                            else
                            {
                                expenseText += "<th style='background-color: #E5E5E5;'>" + header.Header + "</th>";
                            }
                        }
                        expenseText += "</tr>";
                        foreach (IncomeExpensePDFDataModel _data in item.Data)
                        {
                            if (_data.PhotoProof != null)
                            {
                                ExpenseReceipt expenseReceipt = new ExpenseReceipt();
                                expenseReceipt.Name = _data.Description;
                                expenseReceipt.PhotoProof = _data.PhotoProof;
                                receipts.Add(expenseReceipt);
                            }
                            expenseText += "<tr>";
                            foreach (IncomeExpensePDFHeaderModel header in item.Headers)
                            {
                                if (header.Header == "Date")
                                {
                                    expenseText += "<td style='border-bottom: 1px solid black;width:10%;'>" + _data.Date?.ToString("dd/MM/yyyy") + "</td>";
                                }
                                else if (header.Header == "Description")
                                {
                                    expenseText += "<td style='border-bottom: 1px solid black;width:50%;'>" + _data?.Description + "</td>";
                                }
                                else if (header.Header == "Invoice/Receipt #")
                                {
                                    expenseText += "<td style='border-bottom: 1px solid black;text-align: center; width:20%;'>" + _data?.InvoiceNr + "</td>";
                                }
                                else if (header.Header == "Amount")
                                {
                                    expenseText += "<td style='border-bottom: 1px solid black;width:20%;text-align: right;'>R " + _data?.Amount.ToString("#,0.00", nfi) + "</td>";

                                    allExpense += (double)_data?.Amount;
                                    totalExpense += (double)_data?.Amount;
                                }

                            }
                            expenseText += "</tr>";
                        }

                        expenseText += "<tr><th style='border-bottom: 1px solid black;' colspan='" + (item.Headers.Count - 1) + "'>Total</th><td style='font-weight: bold;border-bottom: 1px solid black;text-align: right;'>R" + totalExpense.ToString("#,0.00", nfi) + "</td></tr>";
                        expenseText += "</tbody></table><br>";
                    }
                }

                html += expenseText;

                string totalExpenseRow = "<table style='width: 100%; margin-top: 8px;'><tbody><tr><th style='background-color: #808080;padding: 4px;color: white;'>TOTAL EXPENSES</th><td style='background-color: #808080;padding: 4px;color: white;text-align: right;'>R " + allExpense.ToString("#,0.00", nfi) + "</td></tr></tbody></table>";
                html += totalExpenseRow;
                html += signDateRow;
            }

            //
            //  RECEIPTS
            //
            if (receipts.Count > 0)
            {
                var receiptsText = "<div style='padding-top:80px;page-break-before: always;'><h1>RECEIPTS</h1></div>";
                var count = 1;
                foreach (var item in receipts)
                {
                    receiptsText += "<div><h2>" + item.Name + "</h2><img style='max-width: 400px;' src='" + item.PhotoProof + "'/></div>";

                    if (count < receipts.Count && count % 2 == 0)
                    {
                        receiptsText += "<div style='page-break-before: always;'></div>";
                    }
                    count++;
                }
                html += receiptsText;
            }

            html += "</body></html>";

            // discard result
            Console.WriteLine($"HTML FOR DOCUMENT = {html.Length}");
            var doc = _documentManager.GetPdfSettings(html, filename, "portrait");
            var pdfConvertor = new SynchronizedConverter(new PdfTools());
            byte[] pdf = pdfConvertor.Convert(doc);
            string Base64Result = Convert.ToBase64String(pdf);

            PdfDocumentModel pdfDoc = new PdfDocumentModel();
            pdfDoc.Reference = Base64Result;
            pdfDoc.FileName = filename.Replace(" ", "_") + ".pdf";
            pdfDoc.UserId = userId;
            pdfDoc.CreatedUserId = uId;

            return _documentManager.SaveIncomeStatementPDF(pdfDoc).Result;
        }

        public List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData(string userId, int year, int month, bool splitSupport = false)
        {
            List<IncomeExpensePDFTableModel> tables = new List<IncomeExpensePDFTableModel>();
            var table = new IncomeExpensePDFTableModel();

            //
            //  EXPENSES
            //
            List<StatementsExpenseType> expenseTypes = GetAllStatementExpenseTypes(userId, year, month);
            foreach (StatementsExpenseType type in expenseTypes)
            {
                table = new IncomeExpensePDFTableModel();
                table.TableName = type.Description;
                table.Type = IncomeExpensePDF.EXPENSES;
                table.Headers = getExpensePDFHeader();
                table.Data = GetAllStatementsExpensesForType(userId, year, month, type.Id.ToString());
                if (table.Data != null && table.Data.Count > 0)
                {
                    table.Total = table.Data.Select(x => x.Amount).Sum();
                    tables.Add(table);
                }
            }

            //
            //  INCOME
            //
            List<StatementsIncomeType> incomeTypes = GetAllStatementIncomeTypes(userId, year, month);
            List<StatementsContributionType> contributionTypes = GetAllStatementContributionTypes(userId, year, month);
            var otherId = incomeTypes.Where(x => x.Description == IncomeExpensePDF.OTHER).Select(y => y.Id).FirstOrDefault();
            var preschoolFeeId = incomeTypes.Where(x => x.Description == IncomeExpensePDF.PRESCHOOL_FEE).Select(y => y.Id).FirstOrDefault();
            var moneyId = contributionTypes.Where(x => x.Description == IncomeExpensePDF.MONEY).Select(y => y.Id).FirstOrDefault();

            var includeChild = true;
            var includeAmount = true;
            var includeDescription = true;
            var includeType = true;
            var includeItem = true;

            // Preschool fees: Monetary contributions
            includeChild = true; includeAmount = true; includeDescription = false; includeType = false; includeItem = false;
            table = new IncomeExpensePDFTableModel();
            table.TableName = IncomeExpensePDF.MONETARY_CONTRIBUTIONS;
            table.Type = IncomeExpensePDF.INCOME;
            table.Headers = getIncomePDFHeader(includeChild, includeAmount, includeDescription, includeType, includeItem);
            table.Data = GetMonetaryContributions(userId, year, month, preschoolFeeId.ToString(), moneyId.ToString());
            if (table.Data != null && table.Data.Count > 0)
            {
                table.Total = table.Data.Select(x => x.Amount).Sum();
                tables.Add(table);
            }

            // Preschool fees: Non-monetary contributions
            includeChild = true; includeAmount = false; includeDescription = false; includeType = false; includeItem = true;
            table = new IncomeExpensePDFTableModel();
            table.TableName = IncomeExpensePDF.NON_MONETARY_CONTRIBUTIONS;
            table.Type = IncomeExpensePDF.INCOME;
            table.Headers = getIncomePDFHeader(includeChild, includeAmount, includeDescription, includeType, includeItem);
            table.Data = getNonMonetaryContributions(userId, year, month, preschoolFeeId.ToString(), moneyId.ToString());
            if (table.Data != null && table.Data.Count > 0)
            {
                tables.Add(table);
            }

            // Subsidies, donations, contributions
            includeChild = false; includeAmount = true; includeDescription = false; includeType = true; includeItem = true;
            table = new IncomeExpensePDFTableModel();
            table.TableName = IncomeExpensePDF.SUBSIDIES_DONATIONS_CONTRIBUTIONS;
            table.Type = IncomeExpensePDF.INCOME;
            table.Headers = getIncomePDFHeader(includeChild, includeAmount, includeDescription, includeType, includeItem);
            table.Data = GetSubsidiesDonationsContributions(userId, year, month, otherId.ToString(), incomeTypes);
            if (table.Data != null && table.Data.Count > 0)
            {
                table.Total = table.Data.Select(x => x.Amount).Sum();
                tables.Add(table);
            }

            // Other
            includeChild = false; includeAmount = true; includeDescription = true; includeType = false; includeItem = false;
            table = new IncomeExpensePDFTableModel();
            table.TableName = IncomeExpensePDF.OTHER;
            table.Type = IncomeExpensePDF.INCOME;
            table.Headers = getIncomePDFHeader(includeChild, includeAmount, includeDescription, includeType, includeItem);
            table.Data = GetOtherIncome(userId, year, month, otherId.ToString());
            if (table.Data != null && table.Data.Count > 0)
            {
                table.Total = table.Data.Select(x => x.Amount).Sum();
                tables.Add(table);
            }

            return tables;
        }

        private List<IncomeExpensePDFHeaderModel> getExpensePDFHeader()
        {
            List<IncomeExpensePDFHeaderModel> headers = new List<IncomeExpensePDFHeaderModel>();

            var header = new IncomeExpensePDFHeaderModel();
            header.Header = "Date";
            header.DataKey = "date";
            headers.Add(header);

            header = new IncomeExpensePDFHeaderModel();
            header.Header = "Description";
            header.DataKey = "description";
            headers.Add(header);

            header = new IncomeExpensePDFHeaderModel();
            header.Header = "Invoice/Receipt #";
            header.DataKey = "invoiceNr";
            headers.Add(header);

            header = new IncomeExpensePDFHeaderModel();
            header.Header = "Amount";
            header.DataKey = "amount";
            headers.Add(header);

            return headers;
        }

        private List<IncomeExpensePDFHeaderModel> getIncomePDFHeader(bool includeChild, bool includeAmount, bool includeDescription, bool includeType, bool includeItem)
        {
            List<IncomeExpensePDFHeaderModel> headers = new List<IncomeExpensePDFHeaderModel>();

            var header = new IncomeExpensePDFHeaderModel();
            header.Header = "Date";
            header.DataKey = "date";
            headers.Add(header);

            if (includeChild)
            {
                header = new IncomeExpensePDFHeaderModel();
                header.Header = "Child";
                header.DataKey = "child";
                headers.Add(header);
            }

            if (includeDescription)
            {
                header = new IncomeExpensePDFHeaderModel();
                header.Header = "Description";
                header.DataKey = "description";
                headers.Add(header);
            }

            if (includeType)
            {
                header = new IncomeExpensePDFHeaderModel();
                header.Header = "Type";
                header.DataKey = "type";
                headers.Add(header);
            }

            if (includeItem)
            {
                header = new IncomeExpensePDFHeaderModel();
                header.Header = "Item";
                header.DataKey = "item";
                headers.Add(header);
            }

            if (includeAmount)
            {
                header = new IncomeExpensePDFHeaderModel();
                header.Header = "Amount";
                header.DataKey = "amount";
                headers.Add(header);
            }
            return headers;
        }
    }
    #endregion

}