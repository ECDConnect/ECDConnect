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
using Microsoft.EntityFrameworkCore;
using Child = ECDLink.DataAccessLayer.Entities.Users.Child;

namespace ECDLink.Core.Services
{
    public class IncomeExpenseService : IIncomeExpenseService
    {
        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private string _applicationUserId;
        private IGenericRepository<StatementsExpenseType, Guid> _statementsExpenseTypeRepo;
        private IGenericRepository<StatementsExpenses, Guid> _statementsExpensesRepo;
        private IGenericRepository<StatementsIncomeType, Guid> _statementsIncomeTypeRepo;
        private IGenericRepository<StatementsIncome, Guid> _statementsIncomeRepo;
        private IGenericRepository<StatementsContributionType, Guid> _statementsContributionTypeRepo;
        private IGenericRepository<Child, Guid> _childRepo;
        private IGenericRepository<StatementsIncomeStatement, Guid> _statementsRepo;

        private IPointsEngineService _pointsEngineService;

        private UserManager<ApplicationUser> _userManager;
        private DocumentManager _documentManager;
        private PersonnelService _personnelService;
        private HierarchyEngine _hierarchyEngine;

        public IncomeExpenseService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
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

            _statementsExpenseTypeRepo = _repoFactory.CreateGenericRepository<StatementsExpenseType>(userContext: _applicationUserId);
            _statementsExpensesRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            _statementsIncomeTypeRepo = _repoFactory.CreateGenericRepository<StatementsIncomeType>(userContext: _applicationUserId);
            _statementsIncomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            _statementsContributionTypeRepo = _repoFactory.CreateGenericRepository<StatementsContributionType>(userContext: _applicationUserId);
            _childRepo = _repoFactory.CreateGenericRepository<Child>(userContext: _applicationUserId);
            _statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);

            _userManager = userManager;
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

        public List<StatementsIncomeStatement> GetAllStatementsIncomeStatement(string userId, int year, int month)
        {
            var statementRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            var statements = statementRepo.GetAll()
                .Include(x => x.IncomeItems)
                .Include(x => x.ExpenseItems)
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

        private bool IsSubmitted(string userId, int year, int month)
        {
            var statementSubmitted = _statementsRepo.GetAll() //get all rows for year to date
                    .Where(x => 
                        string.Equals(x.UserId, userId) && 
                        x.Year == year &&
                        x.Month == month &&
                        x.Submitted == true && 
                        x.IsActive == true)
                    .Any();
            
            return statementSubmitted;
        }

        private DateTime? GetLastSubmittedDate(string userId)
        {
            var row = _statementsRepo.GetAll() //get all rows for year to date
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

        private List<StatementReport> GetAllStatementExpenses(string userId, string statementId)
        {
            List<StatementReport> reportData = new List<StatementReport>();
            // Only return types linked to expenses for params
            var report =
            (
                from statementsExpenses in _statementsExpensesRepo.GetAll().Where(y => string.Equals(y.UserId, userId) && y.IsActive == true && (y.StatementsIncomeStatementId.HasValue && y.StatementsIncomeStatementId.ToString() == statementId))
                join statementExpenseType in _statementsExpenseTypeRepo.GetAll().Where(x => x.IsActive == true).OrderBy(z => z.Description) on statementsExpenses.ExpenseTypeId equals statementExpenseType.Id.ToString()
                select new { statementExpenseType.Description, statementsExpenses.Amount }
            ).ToList();           
            foreach ( var statement in report )
            {
                reportData.Add(new StatementReport() { StatementLine = statement.Description, Value = statement.Amount, StatementType = "Expenses" });
            }

            return reportData;
        }

        private List<StatementReport> GetAllStatementIncome(string userId, string statementId)
        {
            List<StatementReport> reportData = new List<StatementReport>();
            // Only return types linked to income for params
            var report =
            (
                from StatementsIncome in _statementsIncomeRepo.GetAll().Where(y => string.Equals(y.UserId, userId) && y.IsActive == true && (y.StatementsIncomeStatementId.HasValue && y.StatementsIncomeStatementId.ToString() == statementId))
                join StatementsIncomeType in _statementsIncomeTypeRepo.GetAll().Where(x => x.IsActive == true).OrderBy(z => z.Description) on StatementsIncome.IncomeTypeId equals StatementsIncomeType.Id.ToString()
                select new { StatementsIncomeType.Description, StatementsIncome.Amount }
            ).ToList();
            foreach (var statement in report)
            {
                reportData.Add(new StatementReport() { StatementLine = statement.Description, Value = statement.Amount, StatementType = "Income" });
            }

            return reportData;
        }
        
        /// <summary>
        /// Gets all statements between the given date ranges. End date can be ommitted to get everything from the start date
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate">End date can be ommitted to get everything from the start date</param>
        /// <returns></returns>
        public List<StatementsIncomeStatement> GetStatements(string userId, DateTime startDate, DateTime? endDate = null)
        {
            var statementsQuery = _statementsRepo.GetAll()
                .Include(x => x.IncomeItems)
                .Include(x => x.ExpenseItems)
                .Where(x => x.UserId == userId && 
                    (x.Year > startDate.Year || (x.Year == startDate.Year && x.Month >= startDate.Month)));

            if (endDate.HasValue)
            {
                statementsQuery = statementsQuery.Where(x => x.Year < endDate.Value.Year || (x.Year == endDate.Value.Year && x.Month <= endDate.Value.Month));
            }

            return statementsQuery.ToList();
        }

        /// <summary>
        /// Gets all income items not yet linked to a statement
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<StatementsIncome> GetUnsubmittedIncomeItems(string userId)
        {
            var incomeQuery = _statementsIncomeRepo.GetAll()
                .Where(x => x.UserId == userId && x.StatementsIncomeStatementId == null);

            return incomeQuery.ToList();
        }

        /// <summary>
        /// Gets all expense items not yet linked to a balance sheet
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<StatementsExpenses> GetUnsubmittedExpenseItems(string userId)
        {
            var expenseQuery = _statementsExpensesRepo.GetAll()
                .Where(x => x.UserId == userId && x.StatementsIncomeStatementId == null);

            return expenseQuery.ToList();
        }

        #endregion

        #region Statement Mutations

        public StatementsIncome UpdateIncome(StatementsIncome model)
        {
            var incomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);

            double incomeAmount = Math.Round(model.Amount, 2);
            model.Amount = incomeAmount;

            var existingIncomeItem = incomeRepo.GetById(model.Id);
            if (existingIncomeItem == null)
            {
                //validity duplication check
                var incomeCheck = incomeRepo.GetAll().Where(x => x.Amount.Equals(model.Amount) && x.DateReceived.Equals(model.DateReceived) && x.IncomeTypeId.Equals(model.IncomeTypeId) && x.PayTypeId.Equals(model.PayTypeId) && x.UserId.Equals(model.UserId) && x.ChildUserId.Equals(model.ChildUserId)).OrderBy(x => x.Id).FirstOrDefault();
                if (incomeCheck != null)
                {
                    return incomeCheck;
                }

                model.Submitted = false;
                model.StatementsIncomeStatementId = null;
                incomeRepo.Insert(model);
                return model;
            }
            else
            {
                if (!existingIncomeItem.Submitted && !existingIncomeItem.StatementsIncomeStatementId.HasValue)//once submitted, no further updates can be made
                {
                    existingIncomeItem.Amount = model.Amount;
                    existingIncomeItem.AmountExpected = model.AmountExpected;
                    existingIncomeItem.ChildCoverAmount = model.ChildCoverAmount;
                    existingIncomeItem.PhotoProof = model.PhotoProof;
                    existingIncomeItem.UpdatedDate = DateTime.Now;
                    existingIncomeItem.UpdatedBy = _applicationUserId;
                    existingIncomeItem.ChildUserId = model.ChildUserId;
                    existingIncomeItem.ContributionTypeId = model.ContributionTypeId;
                    existingIncomeItem.Description = model.Description;
                    existingIncomeItem.DateReceived = model.DateReceived;
                    existingIncomeItem.FeeTypeId = model.FeeTypeId;
                    existingIncomeItem.IncomeTypeId = model.IncomeTypeId;
                    existingIncomeItem.Notes = model.Notes;
                    existingIncomeItem.PayTypeId = model.PayTypeId;

                    incomeRepo.Update(existingIncomeItem);
                    return existingIncomeItem;
                }
                else
                {
                    return existingIncomeItem;
                }
            }
        }

        public StatementsExpenses UpdateExpense(StatementsExpenses model)
        {
            var expenseRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);

            double expenseAmount = Math.Round(model.Amount, 2);
            model.Amount = expenseAmount;

            var exisitingExpenseItem = expenseRepo.GetById(model.Id);
            if (exisitingExpenseItem == null)
            {
                //validity duplication check
                var expenseCheck = expenseRepo.GetAll().Where(x => x.Amount.Equals(model.Amount) && x.DatePaid.Equals(model.DatePaid) && x.ExpenseTypeId.Equals(model.ExpenseTypeId)).OrderBy(x => x.Id).FirstOrDefault();

                if (expenseCheck != null)
                {
                    return expenseCheck;
                }

                model.Submitted = false;
                model.StatementsIncomeStatementId = null;
                expenseRepo.Insert(model);
                return model;
            }
            else
            {
                if (!exisitingExpenseItem.Submitted && !exisitingExpenseItem.StatementsIncomeStatementId.HasValue)//once submitted, no further updates can be made
                {
                    exisitingExpenseItem.Amount = model.Amount;
                    exisitingExpenseItem.DatePaid = model.DatePaid;
                    exisitingExpenseItem.PhotoProof = model.PhotoProof;
                    exisitingExpenseItem.Description = model.Description;
                    exisitingExpenseItem.ExpenseTypeId = model.ExpenseTypeId;
                    exisitingExpenseItem.Notes = model.Notes;
                    exisitingExpenseItem.UpdatedBy = model.UpdatedBy;
                    exisitingExpenseItem.UpdatedDate = DateTime.Now;

                    expenseRepo.Update(exisitingExpenseItem);
                    return model;
                }
                else
                {
                    return exisitingExpenseItem;
                }
            }
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

        public bool AutoSubmitStatement(string userId, int year, int month)
        {
            var incomeItems = _statementsIncomeRepo.GetAll().Where(x => x.UserId == userId && x.Submitted == false && x.StatementsIncomeStatementId == null).ToList();
            var expenseItems = _statementsExpensesRepo.GetAll().Where(x => x.UserId == userId && x.Submitted == false && x.StatementsIncomeStatementId == null).ToList();

            var statement = SubmitMonthlyStatement(month, year, userId, incomeItems, expenseItems, true);

            return statement != null;
        }

        public StatementsIncomeStatement SubmitMonthlyStatement(int month, int year, string userId, IEnumerable<Guid> incomeItemIds, IEnumerable<Guid> expenseItemIds, bool autoSubmitted = false)
        {
            var incomeItems = _statementsIncomeRepo.GetAll().Where(x => incomeItemIds.Contains(x.Id)).ToList();
            var expenseItems = _statementsExpensesRepo.GetAll().Where(x => expenseItemIds.Contains(x.Id)).ToList();

            return SubmitMonthlyStatement(month, year, userId, incomeItems, expenseItems, autoSubmitted);
        }

        private StatementsIncomeStatement SubmitMonthlyStatement(int month, int year, string userId, IEnumerable<StatementsIncome> incomeItems, IEnumerable<StatementsExpenses> expenseItems, bool autoSubmitted = false)
        {
            // Get income items 
            var incomeTotal = incomeItems.Sum(x => x.Amount);
            var expenseTotal = expenseItems.Sum(x => x.Amount);

            // Set submitted fields on income and expenses
            var newId = Guid.NewGuid();
            foreach (var income in incomeItems)
            {
                income.Submitted = true;
                income.StatementsIncomeStatementId = newId;
            }

            foreach (var expense in expenseItems)
            {
                expense.Submitted = true;
                expense.StatementsIncomeStatementId = newId;
            }

            var submittedStatement = new StatementsIncomeStatement()
            {
                Id = newId,
                IsActive = true,
                AutoSubmitted = autoSubmitted,
                Balance = Math.Round(incomeTotal - expenseTotal, 2),
                ExpenseTotal = expenseTotal,
                IncomeTotal = incomeTotal,
                Month = month,
                Year = year,
                Notes = $"{(autoSubmitted ? "Auto" : "Manual")} Monthly Statement Submission",
                Period = "Monthly",
                Submitted = true,
                SubmittedDate = DateTime.Now,
                UserId = userId,
                UpdatedBy = _applicationUserId,
                UpdatedDate = DateTime.Now,
                InsertedDate = DateTime.Now,
                IncomeItems = incomeItems.ToList(),
                ExpenseItems = expenseItems.ToList(),
            };

            _statementsRepo.Insert(submittedStatement);

            //try generating autosubmit doc
            if (incomeItems.Any() || expenseItems.Any()) //dont create or send empty docs
            {
                // TODO FIX THE DATA INPUT INTO CREATE PDF
                var pdfDoc = CreateIncomeStatementPDFDocument(userId, submittedStatement);
                if (pdfDoc != null)
                {
                    submittedStatement.RelatedDocumentId = pdfDoc.Id.ToString();
                }

                _statementsRepo.Update(submittedStatement);
            }

            if (!autoSubmitted)
            {
                _pointsEngineService.CalculateIncomeStatements(userId, DateTime.Now);
            }

            return submittedStatement;
        }

        // TODO - investigate what this is doing and if used. It might just update all statements to autosubmitted and otherwise just sets one date on them
        public void SubmitAnnualStatement(string userId, int year, bool autoSubmitted = false)
        {
            //annually needs to look at the entire years statements and sumbit all these for only that year.
            var annualRows = _statementsRepo.GetAll().Where(x => x.UserId == userId && x.AnnualSubmittedDate == null && x.SubmittedDate.Year.Equals(year)).ToList();
            foreach (var row in annualRows)
            {
                //lock all entries
                row.AnnualSubmittedDate = DateTime.Now;
                row.AutoSubmitted = autoSubmitted;
                _statementsRepo.Update(row);
            }
        }

        public Dictionary<string, DateTime> GetUnsubmittedStatements()
        {
            StatementsSubmitPeriod submitPeriod = GetStatementPeriod();

            //find statements that have not been submitted for the previous month, assuming the SW runs the <<forceSubmitDay>> of the following month,
            //not having a statement for any users but have income/expenses mean they have not submitted and needs to be auto submit.
            List<Practitioner> allPractitionersToCheck = GetPractitionersDueStatements();
            Dictionary<string, DateTime> allDuePractitioners = new Dictionary<string, DateTime>();
            foreach (var practitioner in allPractitionersToCheck)
            {
                if (!IsSubmitted(practitioner.UserId, submitPeriod.Start.Year, submitPeriod.Start.Month))
                {
                    allDuePractitioners.Add(practitioner.UserId, submitPeriod.Start);
                } 
                else
                {
                    //get last submitted date
                    DateTime? lastDate = GetLastSubmittedDate(practitioner.UserId);

                    if (!lastDate.HasValue)
                    {
                        allDuePractitioners.Add(practitioner.UserId, submitPeriod.Start);
                    } 
                    else
                    {
                        DateTime dateperiodToSubmit = lastDate.Value;

                        int calcMonths = 0;
                        //check how many months to go back to catch up autosubmits to start of year
                        for (int i = dateperiodToSubmit.Month; i <= submitPeriod.Start.Month; i++)
                        {
                            dateperiodToSubmit = dateperiodToSubmit.AddMonths(calcMonths);
                            if (dateperiodToSubmit.Month == submitPeriod.Start.Month && dateperiodToSubmit.Year == submitPeriod.Start.Year)
                            {
                                allDuePractitioners.Add(practitioner.UserId, dateperiodToSubmit);
                                break;
                            } 
                            else 
                            {
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
            StatementsSubmitPeriod submitPeriod = GetStatementPeriod();
            var pracsRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            return pracsRepo.GetAll().Where(x => (x.IsPrincipal == true || x.IsFundaAppAdmin == true) && x.InsertedDate.Date <= submitPeriod.Start.Date).ToList();
        }

        #endregion

        #region PDF STUFF

        public Document CreateIncomeStatementPDFDocument(string userId, StatementsIncomeStatement statement)
        {
            // Data for pdf
            var htmlData = GetStatementsIncomeExpensesPDFData(statement);

            var uId = _contextAccessor.HttpContext.GetUser().Id;
            var nfi = (NumberFormatInfo)CultureInfo.InvariantCulture.NumberFormat.Clone();
            nfi.NumberGroupSeparator = " ";

            double allIncome = 0.0;
            double allExpense = 0.0;
            string incomeText = "";
            string expenseText = "";
            var hasExpenses = false;
            var receipts = new List<ExpenseReceipt>();

            string signDateRow = _documentManager.GetSignatureRow(_personnelService.GetUserSignature(userId));
            string filename = $"{new DateTime(statement.Year, statement.Month, 1).ToString("MMMM yyyy")} Statement";
            string html = $"<html><head>{_documentManager.GetDocumentStyling()}</head><body>";

            var pdfDocumentHeader = new PdfDocumentHeader();
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

        public List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData(Guid statementId)
        {
            var statement = _statementsRepo.GetAll()
                .Include(x => x.IncomeItems)
                .Include(x => x.ExpenseItems)
                .Where(x => x.Id == statementId)
                .First();

            return GetStatementsIncomeExpensesPDFData(statement);
        }

        public List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData(StatementsIncomeStatement statement)
        {
            var tables = new List<IncomeExpensePDFTableModel>();

            var expenseTypes = _statementsExpenseTypeRepo.GetAll().ToList();
            var incomeTypes = _statementsIncomeTypeRepo.GetAll().ToList();
            var contributionTypes = _statementsContributionTypeRepo.GetAll().ToList();
            var childUserIds = statement.IncomeItems.Where(x => !string.IsNullOrWhiteSpace(x.ChildUserId)).Select(x => x.ChildUserId);
            var childNamesById = _childRepo.GetAll()
                .Include(x => x.User)
                .Where(x => childUserIds.Contains(x.UserId))
                .Select(x => new { x.UserId, Name = $"{x.User.FirstName} {x.User.Surname}" })
                .ToDictionary(x => x.UserId, x => x.Name);

            //
            //  EXPENSES
            //
            foreach (StatementsExpenseType type in expenseTypes)
            {
                var expenses = statement.ExpenseItems.Where(x => x.ExpenseTypeId == type.Id.ToString());

                if (!expenses.Any())
                {
                    continue;
                }

                tables.Add(new IncomeExpensePDFTableModel
                {
                    TableName = type.Description,
                    Type = IncomeExpensePDF.EXPENSES,
                    Headers = getExpensePDFHeader(),
                    Data = MapExpenseToPdfData(expenses),
                    Total = expenses.Select(x => x.Amount).Sum(),
                });
            }

            //
            //  INCOME
            //
            var otherId = incomeTypes.Where(x => x.Description == IncomeExpensePDF.OTHER).Select(y => y.Id).First().ToString();
            var preschoolFeeId = incomeTypes.Where(x => x.Description == IncomeExpensePDF.PRESCHOOL_FEE).Select(y => y.Id).First().ToString();
            var moneyId = contributionTypes.Where(x => x.Description == IncomeExpensePDF.MONEY).Select(y => y.Id).First().ToString();


            // Preschool fees: Monetary contributions
            var monetaryFeeIncome = statement.IncomeItems.Where(x => x.IncomeTypeId == preschoolFeeId && x.ContributionTypeId == moneyId);
            tables.Add(new IncomeExpensePDFTableModel {
                TableName = IncomeExpensePDF.MONETARY_CONTRIBUTIONS,
                Type = IncomeExpensePDF.INCOME,
                Headers = GetIncomePDFHeader(true, true, false, false, false),
                Data = MapIncomeToPdfData(monetaryFeeIncome, childNamesById),
                Total = monetaryFeeIncome.Select(x => x.Amount).Sum(),
            });

            // Preschool fees: Non-monetary contributions
            var nonMonetaryFeeIncome = statement.IncomeItems.Where(x => x.IncomeTypeId == preschoolFeeId && x.ContributionTypeId != moneyId);
            if (nonMonetaryFeeIncome.Any())
            {
                tables.Add(new IncomeExpensePDFTableModel
                {
                    TableName = IncomeExpensePDF.NON_MONETARY_CONTRIBUTIONS,
                    Type = IncomeExpensePDF.INCOME,
                    Headers = GetIncomePDFHeader(true, false, false, false, false),
                    Data = MapIncomeToPdfData(nonMonetaryFeeIncome, childNamesById),
                });
            }

            // Subsidies, donations, contributions
            var subsidyAndDonationIncome = statement.IncomeItems.Where(x => x.IncomeTypeId != preschoolFeeId && x.IncomeTypeId != otherId);
            if (subsidyAndDonationIncome.Any())
            {
                tables.Add(new IncomeExpensePDFTableModel
                {
                    TableName = IncomeExpensePDF.SUBSIDIES_DONATIONS_CONTRIBUTIONS,
                    Type = IncomeExpensePDF.INCOME,
                    Headers = GetIncomePDFHeader(false, true, false, true, true),
                    Data = MapIncomeToPdfData(subsidyAndDonationIncome, childNamesById),
                    Total = subsidyAndDonationIncome.Select(x => x.Amount).Sum()
                });
            }

            // Other
            var otherIncome = statement.IncomeItems.Where(x => x.IncomeTypeId == otherId);
            if (otherIncome.Any())
            {
                tables.Add(new IncomeExpensePDFTableModel
                {
                    TableName = IncomeExpensePDF.OTHER,
                    Type = IncomeExpensePDF.INCOME,
                    Headers = GetIncomePDFHeader(false, true, true, false, false),
                    Data = MapIncomeToPdfData(otherIncome, childNamesById),
                    Total = otherIncome.Select(x => x.Amount).Sum()
                });
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

        private List<IncomeExpensePDFHeaderModel> GetIncomePDFHeader(bool includeChild, bool includeAmount, bool includeDescription, bool includeType, bool includeItem)
        {
            var headers = new List<IncomeExpensePDFHeaderModel>();

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

        private List<IncomeExpensePDFDataModel> MapExpenseToPdfData(IEnumerable<StatementsExpenses> expenseRows)
        {
            var results = new List<IncomeExpensePDFDataModel>();
            var invoiceNr = 1;
            foreach (var expense in expenseRows)
            {
                results.Add(new IncomeExpensePDFDataModel
                {
                    Description = expense.Notes,
                    Date = expense.DatePaid,
                    Amount = expense.Amount,
                    PhotoProof = expense.PhotoProof,
                    InvoiceNr = invoiceNr,
                });
                invoiceNr++;
            }
            return results;
        }


        private List<IncomeExpensePDFDataModel> MapIncomeToPdfData(IEnumerable<StatementsIncome> incomeRows, IDictionary<string, string> childNamesById)
        {
            var results = new List<IncomeExpensePDFDataModel>();
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
        #endregion
    }
}