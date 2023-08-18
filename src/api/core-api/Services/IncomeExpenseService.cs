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
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using System.Reflection.Metadata;
using ECDLink.DataAccessLayer.Entities.Documents;
using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using EcdLink.Api.CoreApi.GraphApi.Queries;
using Document = ECDLink.DataAccessLayer.Entities.Documents.Document;
using HotChocolate;
using EcdLink.Api.CoreApi.Managers;
using ECDLink.DataAccessLayer.Entities;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Hierarchy;

namespace ECDLink.Core.Services
{
    public class IncomeExpenseService : IIncomeExpenseService
    {
        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private string _applicationUserId;
        private string _adminId;
        private readonly ISystemSetting<IncomeStatementSubmitStartOptions> _submitStartDate;
        private readonly ISystemSetting<IncomeStatementSubmitEndOptions> _submitEndDate;
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
            ISystemSetting<IncomeStatementSubmitStartOptions> submitStartDate, 
            ISystemSetting<IncomeStatementSubmitEndOptions> submitEndDate, 
            IPointsEngineService pointsEngineService,
            HierarchyEngine hierarchyEngine
            )
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetIntegrationUserId());
            _submitStartDate = submitStartDate;
            _submitEndDate = submitEndDate;            

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

        public List<StatementsBalanceSheet> GetAllStatementsBalanceSheet(string userId, int year, int month)
        {
            List<StatementsBalanceSheet> balanceSheets = new List<StatementsBalanceSheet>();
            var statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            DateTime nextMonth = DateTime.Now.AddMonths(1);
            int submitStartDate = int.Parse(_submitStartDate.Value.IncomeStatementSubmitStart);
            int submitEndDate = int.Parse(_submitEndDate.Value.IncomeStatementSubmitEnd);
            var allMonths = new List<int>();

            var statements = statementsRepo.GetAll().Where(x => 
                string.Equals(x.UserId, userId) && 
                x.Submitted.Equals(true) && 
                (year == 0 || x.Year.Equals(year))) // Filter to specific year
                .ToList();

            if (statements.Any())
            {
                //supplied year loop
                var allYears = statements.Select(x => x.Year).Distinct().ToList();
                if (allYears.Any())
                {
                    allYears.OrderDescending();
                    foreach (var currentYear in allYears)
                    {
                        //loop months of YTD of supplied year
                        allMonths = statements.Where(x => x.Year == currentYear).Select(y => y.Month).Distinct().ToList();
                        if (month > 0) //filter to specific month if supplied in addition to year
                        {
                            statements = statements.Where(x => x.Month.Equals(month)).ToList();
                        }
                        if (allMonths.Any())
                        {
                            //if currentmonth is not yet submitted, add this too but pull previous entries not yet submitted and include in this iteration
                            allMonths.OrderDescending();
                            foreach (var loopMonth in allMonths)
                            {
                                var statementCheck = statements.Where(x => x.Year.Equals(currentYear) && x.Month.Equals(loopMonth)).OrderBy(x => x.Id).FirstOrDefault();
                                bool isAutoSubmitted = (statementCheck != null ? statementCheck.AutoSubmitted : false);
                                DateTime? submittedDate = (statementCheck != null ? statementCheck.SubmittedDate : null);
                                var allIncome = statements.Where(x => x.Year.Equals(currentYear) && x.Month.Equals(loopMonth)).Select(y => y.IncomeTotal).ToList();
                                var allExpenses = statements.Where(x => x.Year.Equals(currentYear) && x.Month.Equals(loopMonth)).Select(y => y.ExpenseTotal).ToList();

                                double allIncomeTotal = allIncome.Sum();
                                double allExpenseTotal = allExpenses.Sum();

                                double balance = allIncomeTotal - allExpenseTotal;

                                balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round(balance, 2), IncomeTotal = Math.Round(allIncomeTotal, 2), ExpenseTotal = Math.Round(allExpenseTotal, 2), Month = loopMonth, Year = currentYear, UserId = userId, Submitted = true, AutoSubmitted = isAutoSubmitted, SubmittedDate = submittedDate });
                            }
                        }

                    }
                }
                else return new List<StatementsBalanceSheet>();
            }
            if (DateTime.Now.Month.Equals(month) && DateTime.Now.Year.Equals(year) && !IsSubmitted(userId, year, month))
            {
                IncomeExpenseLinesMonthly incomeExpenses = GetMonthlyIncomeExpenses(userId, year, month);
                if (incomeExpenses.AllUnSubmitted != null)
                {
                    balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round((incomeExpenses.AllUnSubmitted.IncomeTotal - incomeExpenses.AllUnSubmitted.ExpenseTotal), 2), IncomeTotal = Math.Round(incomeExpenses.AllUnSubmitted.IncomeTotal, 2), ExpenseTotal = Math.Round(incomeExpenses.AllUnSubmitted.ExpenseTotal, 2), Month = month, Year = year, UserId = userId, AutoSubmitted = false, SubmittedDate = null, Submitted = false });
                }
            }
            else
            {
                if (month == 0 && !IsSubmitted(userId, year, DateTime.Today.Month))
                {
                    IncomeExpenseLinesMonthly incomeExpenses = GetMonthlyIncomeExpenses(userId, year, DateTime.Today.Month);
                    if (incomeExpenses.AllUnSubmitted != null)
                    {
                        balanceSheets.Add(new StatementsBalanceSheet()
                        {
                            Balance = Math.Round((incomeExpenses.AllUnSubmitted.IncomeTotal - incomeExpenses.AllUnSubmitted.ExpenseTotal), 2),
                            IncomeTotal = Math.Round(incomeExpenses.AllUnSubmitted.IncomeTotal, 2),
                            ExpenseTotal = Math.Round(incomeExpenses.AllUnSubmitted.ExpenseTotal, 2),
                            Month = DateTime.Today.Month,
                            Year = year,
                            UserId = userId,
                            AutoSubmitted = false,
                            SubmittedDate = null,
                            Submitted = false
                        });
                    }
                }
                else
                {

                    DateTime lastMonthToSubmit = DateTime.Today.AddMonths(-1);
                    var unsubmittedMonth = DateTime.Today <= new DateTime(DateTime.Today.Year, DateTime.Today.Month, submitEndDate) ? (!allMonths.Contains(lastMonthToSubmit.Month) ? lastMonthToSubmit.Month : DateTime.Today.Month) : DateTime.Today.Month;//check cutoff date for submissions, and if its before or on, its still valid for the previous month if its not yet submitted
                    var unsubmittedMonthYear = DateTime.Today <= new DateTime(DateTime.Today.Year, DateTime.Today.Month, submitEndDate) ? (!allMonths.Contains(lastMonthToSubmit.Month) ? lastMonthToSubmit.Year : DateTime.Today.Year) : DateTime.Today.Year;//check cutoff date for submissions, and if its before or on, its still valid for the previous month if its not yet submitted

                    IncomeExpenseLinesMonthly incomeExpenses = GetMonthlyIncomeExpenses(userId, unsubmittedMonthYear, unsubmittedMonth);

                    if (incomeExpenses.AllUnSubmitted != null && incomeExpenses.AllUnSubmitted.Income != null && incomeExpenses.AllUnSubmitted.Expenses != null)
                    {
                        balanceSheets.Add(new StatementsBalanceSheet() { Balance = Math.Round((incomeExpenses.AllUnSubmitted.IncomeTotal - incomeExpenses.AllUnSubmitted.ExpenseTotal), 2), IncomeTotal = Math.Round(incomeExpenses.AllUnSubmitted.IncomeTotal, 2), ExpenseTotal = Math.Round(incomeExpenses.AllUnSubmitted.ExpenseTotal, 2), Month = unsubmittedMonth, Year = unsubmittedMonthYear, UserId = userId, AutoSubmitted = false, SubmittedDate = null, Submitted = false });
                    }
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

                statementIdAll = latestIncomeRowsAll[0].IncomeStatementId;
            }
            if (latestExpenseRowsAll.Any())
            {
                incomeExpenses.AllLines.Expenses = latestExpenseRowsAll;
                incomeExpenses.AllLines.ExpenseTotal = latestExpenseRowsAll.Select(x => x.Amount).Sum();

                statementIdAll = latestExpenseRowsAll[0].IncomeStatementId;
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

        public List<IncomeExpensePDFDataModel> getMonetaryContributions(string userId, int year, int month, string preschoolFeeId, string moneyId)
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

        public List<IncomeExpensePDFDataModel> getSubsidiesDonationsContributions(string userId, int year, int month, string otherId, List<StatementsIncomeType> incomeTypes)
        {
            List<StatementsIncome> incomeRows = _statementsIncomeRepo.GetAll()
                    .Where(x => string.Equals(x.UserId, userId) && x.IsActive == true
                        && x.DateReceived.Year.Equals(year)
                        && x.DateReceived.Month.Equals(month)
                        && x.Submitted.Equals(true)
                        && x.IncomeTypeId != otherId)
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
        public List<IncomeExpensePDFDataModel> getOtherIncome(string userId, int year, int month, string otherId)
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
                    model.IncomeStatementId = null;
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
                    model.IncomeStatementId = null;
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
            var previousTimePeriod = new DateTime(model.Year, model.Month, 1).AddMonths(-1); //previous months (to submission) date to check for any unsubmitted records of current
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
                    Id = Guid.NewGuid()
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
                        row.IncomeStatementId = submittedStatement.Id.ToString();
                        //row.AutoSubmitted = autoSubmitted;

                        incomeRepo.Update(row);
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
                        row.IncomeStatementId = submittedStatement.Id.ToString();
                        //row.AutoSubmitted = autoSubmitted;

                        expenseRepo.Update(row);
                        rows++;
                    }
                    retVal = true;
                }

                try
                {

                    //statement update
                    submittedStatement.ExpenseTotal = allExpenses;
                    submittedStatement.IncomeTotal = allIncome;
                    submittedStatement.Balance = Math.Round(allIncome - allExpenses, 2);
                    submittedStatement.UpdatedDate = DateTime.Now;
                    submittedStatement.UpdatedBy = _applicationUserId;

                    //try generating autosubmit doc
                    if (rows > 0) //dont create or send empty docs
                    {
                        Task<Document> pdfDoc = new IncomeStatementsQueryExtension().GetStatementsIncomeExpensesPDFFile(_contextAccessor, _fileService, this, _documentManager, _personnelService, _userManager, _repoFactory, model.UserId, model.Year, model.Month);
                        if (pdfDoc != null)
                            submittedStatement.RelatedDocumentId = pdfDoc.Id.ToString();
                    }
                    statementRepo.Insert(submittedStatement);
                    
                }
                catch (Exception e)
                {

                }
            }
            if (!autoSubmitted)
            {
                _pointsEngineService.CalculateIncomeStatements(model.UserId, DateTime.UtcNow);
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
    }
    #endregion

}