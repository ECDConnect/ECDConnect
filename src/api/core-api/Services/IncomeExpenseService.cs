
using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Core.Services.Interfaces;
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
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.DataAccessLayer.Hierarchy;
using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Child = ECDLink.DataAccessLayer.Entities.Users.Child;
using ECDLink.DataAccessLayer.Managers;
using DinkToPdf.Contracts;

namespace ECDLink.Core.Services
{
    public class IncomeExpenseService : IIncomeExpenseService
    {
        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private IGenericRepository<StatementsExpenseType, Guid> _statementsExpenseTypeRepo;
        private IGenericRepository<StatementsExpenses, Guid> _statementsExpensesRepo;
        private IGenericRepository<StatementsIncomeType, Guid> _statementsIncomeTypeRepo;
        private IGenericRepository<StatementsIncome, Guid> _statementsIncomeRepo;
        private IGenericRepository<StatementsContributionType, Guid> _statementsContributionTypeRepo;
        private IGenericRepository<Child, Guid> _childRepo;
        private IGenericRepository<StatementsIncomeStatement, Guid> _statementsRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;

        private IPointsEngineService _pointsEngineService;

        private ApplicationUserManager _userManager;
        private DocumentManager _documentManager;
        private PersonnelService _personnelService;
        private HierarchyEngine _hierarchyEngine;

        private IConverter _pdfConverter;

        public IncomeExpenseService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] DocumentManager documentManager,
            [Service] ApplicationUserManager userManager,
            [Service] PersonnelService personnelService,
            IPointsEngineService pointsEngineService,
            HierarchyEngine hierarchyEngine,
            IConverter pdfConverter
            )
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetIntegrationUserId().Value);

            _statementsExpenseTypeRepo = _repoFactory.CreateGenericRepository<StatementsExpenseType>(userContext: _applicationUserId);
            _statementsExpensesRepo = _repoFactory.CreateGenericRepository<StatementsExpenses>(userContext: _applicationUserId);
            _statementsIncomeTypeRepo = _repoFactory.CreateGenericRepository<StatementsIncomeType>(userContext: _applicationUserId);
            _statementsIncomeRepo = _repoFactory.CreateGenericRepository<StatementsIncome>(userContext: _applicationUserId);
            _statementsContributionTypeRepo = _repoFactory.CreateGenericRepository<StatementsContributionType>(userContext: _applicationUserId);
            _childRepo = _repoFactory.CreateGenericRepository<Child>(userContext: _applicationUserId);
            _statementsRepo = _repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _applicationUserId);
            _practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);

            _pdfConverter = pdfConverter;

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

        public StatementsIncomeStatement GetStatement(Guid statementId)
        {
            var statement = _statementsRepo.GetAll()
                .Include(x => x.IncomeItems)
                .Include(x => x.ExpenseItems)
                .Where(x => x.Id == statementId)
                .FirstOrDefault();

            return statement;
        }

        /// <summary>
        /// Gets all statements between the given date ranges. End date can be ommitted to get everything from the start date
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate">End date can be ommitted to get everything from the start date</param>
        /// <returns></returns>
        public List<StatementsIncomeStatement> GetStatements(Guid userId, DateTime startDate, DateTime? endDate = null)
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

        public StatementsIncomeStatement CreateStatement(Guid userId, IncomeStatementModel input)
        {
            var newStatement = new StatementsIncomeStatement
            {
                Id = input.Id,
                UserId = userId,
                Month = input.Month,
                Year = input.Year,
                Downloaded = input.Downloaded,
                IncomeItems = input.IncomeItems.Select(x => new StatementsIncome
                {
                    Id = x.Id,
                    Amount = x.Amount,
                    NumberOfChildrenCovered = x.NumberOfChildrenCovered,
                    PhotoProof = x.PhotoProof,
                    ChildUserId = x.ChildUserId,
                    DateReceived = x.DateReceived,
                    IncomeTypeId = x.IncomeTypeId,
                    Notes = x.Notes,
                    PayTypeId = x.PayTypeId,
                    Description = x.Description

                }).ToList(),
                ExpenseItems = input.ExpenseItems.Select(x => new StatementsExpenses
                {
                    Id = x.Id,
                    Amount = x.Amount,
                    DatePaid = x.DatePaid,
                    PhotoProof = x.PhotoProof,
                    ExpenseTypeId = x.ExpenseTypeId,
                    Notes = x.Notes
                }).ToList(),
            };

            return _statementsRepo.Insert(newStatement);
        }

        public StatementsIncomeStatement UpdateStatement(IncomeStatementModel input)
        {
            var exisitingStatement = GetStatement(input.Id);

            if (exisitingStatement == null)
            {
                throw new ArgumentException("Statement not found");
            }

            // set downloaded field
            if (input.Downloaded != exisitingStatement.Downloaded)
            {
                exisitingStatement.Downloaded = input.Downloaded;
                _statementsRepo.Update(exisitingStatement);
            }

            // If not downloaded, update income/expenses

            #region Update Income Items

            // Deletes
            var removedItems = exisitingStatement.IncomeItems.Where(x => !input.IncomeItems.Any(y => y.Id == x.Id)).ToList();
            foreach (var item in removedItems)
            {
                _statementsIncomeRepo.Delete(item.Id);
            }

            // Updates
            foreach (var item in exisitingStatement.IncomeItems)
            {
                var inputItem = input.IncomeItems.FirstOrDefault(x => x.Id == item.Id);
                if (inputItem == null)
                {
                    continue;
                }

                var updated = false;

                if (item.Amount != inputItem.Amount)
                {
                    item.Amount = inputItem.Amount;
                    updated = true;
                }
                if (item.Notes != inputItem.Notes)
                {
                    item.Notes = inputItem.Notes;
                    updated = true;
                }
                if (item.NumberOfChildrenCovered != inputItem.NumberOfChildrenCovered)
                {
                    item.NumberOfChildrenCovered = inputItem.NumberOfChildrenCovered;
                    updated = true;
                }
                if (item.PhotoProof != inputItem.PhotoProof)
                {
                    item.PhotoProof = inputItem.PhotoProof;
                    updated = true;
                }
                if (item.ChildUserId != inputItem.ChildUserId)
                {
                    item.ChildUserId = inputItem.ChildUserId;
                    updated = true;
                }
                if (item.DateReceived != inputItem.DateReceived)
                {
                    item.DateReceived = inputItem.DateReceived;
                    updated = true;
                }
                if (item.PayTypeId != inputItem.PayTypeId)
                {
                    item.PayTypeId = inputItem.PayTypeId;
                    updated = true;
                }
                if (item.Description != inputItem.Description)
                {
                    item.Description = inputItem.Description;
                    updated = true;
                }

                if (updated)
                {
                    _statementsIncomeRepo.Update(item);
                }
            }

            // Additions
            var newItems = input.IncomeItems.Where(x => !exisitingStatement.IncomeItems.Any(y => y.Id == x.Id)).ToList();
            foreach (var newItem in newItems)
            {
                _statementsIncomeRepo.Insert(new StatementsIncome
                {
                    Id = newItem.Id,
                    Amount = newItem.Amount,
                    NumberOfChildrenCovered = newItem.NumberOfChildrenCovered,
                    PhotoProof = newItem.PhotoProof,
                    ChildUserId = newItem.ChildUserId,
                    DateReceived = newItem.DateReceived,
                    IncomeTypeId = newItem.IncomeTypeId,
                    Notes = newItem.Notes,
                    PayTypeId = newItem.PayTypeId,
                    StatementsIncomeStatementId = exisitingStatement.Id
                });
            }

            #endregion

            #region Update Expense Items
            // Deletes
            var removedExpenses = exisitingStatement.ExpenseItems.Where(x => input.ExpenseItems.Any(y => y.Id == x.Id)).ToList();
            foreach (var item in removedItems)
            {
                _statementsExpensesRepo.Delete(item.Id);
            }

            // Updates
            foreach (var item in exisitingStatement.ExpenseItems)
            {
                var inputItem = input.ExpenseItems.FirstOrDefault(x => x.Id == item.Id);
                if (inputItem == null)
                {
                    continue;
                }

                var updated = false;

                if (item.Amount != inputItem.Amount)
                {
                    item.Amount = inputItem.Amount;
                    updated = true;
                }
                if (item.Notes != inputItem.Notes)
                {
                    item.Notes = inputItem.Notes;
                    updated = true;
                }
                if (item.PhotoProof != inputItem.PhotoProof)
                {
                    item.PhotoProof = inputItem.PhotoProof;
                    updated = true;
                }
                if (item.DatePaid.Date != inputItem.DatePaid.Date)
                {
                    item.DatePaid = inputItem.DatePaid;
                    updated = true;
                }

                if (updated)
                {
                    _statementsExpensesRepo.Update(item);
                }
            }

            // Additions
            var newExpenses = input.ExpenseItems.Where(x => !exisitingStatement.ExpenseItems.Any(y => y.Id == x.Id)).ToList();
            foreach (var newItem in newExpenses)
            {
                _statementsExpensesRepo.Insert(new StatementsExpenses
                {
                    Id = newItem.Id,
                    Amount = newItem.Amount,
                    PhotoProof = newItem.PhotoProof,
                    Notes = newItem.Notes,
                    ExpenseTypeId = newItem.ExpenseTypeId,
                    DatePaid = newItem.DatePaid,
                    StatementsIncomeStatementId = exisitingStatement.Id
                });
            }
            #endregion


            return exisitingStatement;
        }

        #region PDF STUFF

        public Document CreateIncomeStatementPDFDocument(string userId, StatementsIncomeStatement statement)
        {
            // Data for pdf
            var htmlData = GetStatementsIncomeExpensesPDFData(statement);

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
            byte[] pdf = _pdfConverter.Convert(doc);
            string Base64Result = Convert.ToBase64String(pdf);

            DocumentModel pdfDoc = new DocumentModel();
            pdfDoc.Reference = Base64Result;
            pdfDoc.FileName = filename.Replace(" ", "_") + ".pdf";
            pdfDoc.UserId = userId;
            pdfDoc.CreatedUserId = _applicationUserId.ToString();
            return null;

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
            var childUserIds = statement.IncomeItems.Where(x => x.ChildUserId.HasValue).Select(x => x.ChildUserId).Distinct().ToList();
            var childNamesById = _childRepo.GetAll()
               .Where(x => childUserIds.Contains(x.UserId))
                .Select(x => new { x.UserId, Name = $"{x.User.FirstName} {x.User.Surname}" })
                .ToDictionary(x => x.UserId.ToString(), x => x.Name);

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
            var monetaryFeeIncome = statement.IncomeItems.Where(x => x.IncomeTypeId == preschoolFeeId);
            tables.Add(new IncomeExpensePDFTableModel
            {
                TableName = IncomeExpensePDF.MONETARY_CONTRIBUTIONS,
                Type = IncomeExpensePDF.INCOME,
                Headers = GetIncomePDFHeader(true, true, false, false, false),
                Data = MapIncomeToPdfData(monetaryFeeIncome, childNamesById),
                Total = monetaryFeeIncome.Select(x => x.Amount).Sum(),
            });

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

        public StatementsIncomeStatement UpdateUserContactStatusForStatement(Guid statementId)
        {
            StatementsIncomeStatement statement = _statementsRepo.GetById(statementId);

            if (statement != null)
            {
                statement.ContactedByCoach = true;
                statement.UpdatedBy = _applicationUserId.ToString();
                statement.UpdatedDate = DateTime.Now;
                return _statementsRepo.Update(statement);
            }
            return null;
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
                var result = new IncomeExpensePDFDataModel();
                result.Description = income.Notes;
                result.Date = income.DateReceived;
                result.Amount = income.Amount;
                result.PhotoProof = income.PhotoProof;
                result.Child = income.ChildUserId.HasValue && childNamesById.ContainsKey(income.ChildUserId.ToString())
                    ? childNamesById[income.ChildUserId.ToString()]
                    : "Unknown";
                results.Add(result);
            }
            return results;
        }
        #endregion
    }
}