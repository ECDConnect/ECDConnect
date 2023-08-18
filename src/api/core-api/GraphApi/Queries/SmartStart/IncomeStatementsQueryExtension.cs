using DinkToPdf;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class IncomeStatementsQueryExtension
    {

        private SynchronizedConverter _pdfConverter = new SynchronizedConverter(new PdfTools());

        public IncomeStatementsQueryExtension()
        {
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.View)]
        public List<StatementsExpenses> GetAllStatementsExpenses([Service] IncomeExpenseService incomeManager,
            string userId, int year, int month)
        {
            return incomeManager.GetAllStatementsExpenses(userId, year, month);
        }
        public List<StatementsIncome> GetAllStatementsIncome([Service] IncomeExpenseService incomeManager,
            string userId, int year, int month)
        {
            return incomeManager.GetAllStatementsIncome(userId, year, month);
        }
        public List<StatementsIncomeStatement> GetAllStatementsIncomeStatement([Service] IncomeExpenseService incomeManager,
            string userId, int year, int month)
        {
            return incomeManager.GetAllStatementsIncomeStatement(userId, year, month);
        }
        public List<StatementsStartupSupport> GetAllStatementsStartupSupport([Service] IncomeExpenseService incomeManager,
            string userId, int year, int month)
        {
            return incomeManager.GetAllStatementsStartupSupport(userId, year, month);
        }
        public List<StatementsBalanceSheet> GetAllStatementsBalanceSheet([Service] IncomeExpenseService incomeManager, 
            string userId, int year, int month)
        {
            return incomeManager.GetAllStatementsBalanceSheet(userId, year, month);
        }

        public async Task<Document> GetStatementsIncomeExpensesPDFFile(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IFileService fileService,
            [Service] IncomeExpenseService incomeManager,
            [Service] DocumentManager documentManager,
            [Service] PersonnelService personnelService,
            [Service] UserManager<ApplicationUser> userManager,
            IGenericRepositoryFactory repoFactory,
            string userId, int year, int month)
        {
            // Data for pdf
            List<IncomeExpensePDFTableModel> htmlData = GetStatementsIncomeExpensesPDFData(incomeManager, userId, year, month);

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var nfi = (NumberFormatInfo)CultureInfo.InvariantCulture.NumberFormat.Clone();
            nfi.NumberGroupSeparator = " ";

            double allIncome = 0.0;
            double allExpense = 0.0;
            string _income = "";
            string _expense = "";
            string _receipts = "";
            Boolean hasExpenses = false;
            List<ExpenseReceipt> receipts = new List<ExpenseReceipt>();

            string _siteAddress = personnelService.GetUserSiteAddress(userManager, userId);
            string _signingSignature = personnelService.GetUserSignature(userManager, userId);
            string signDateRow = documentManager.GetSignatureRow(_signingSignature);
            string _css = documentManager.GetDocumentStyling();
            string _header = documentManager.GetDocumentHeader(year, month) + " Statement";
            string _html = "<html><head>" + _css + "</head><body>";

            PdfDocumentHeader pdfDocumentHeader = new PdfDocumentHeader();
            pdfDocumentHeader.UserId = userId;
            pdfDocumentHeader.SiteAddress = _siteAddress;
            pdfDocumentHeader.ReportType = "StatementsPDF";
            string _userInfo = documentManager.GetDocumentHeaderAddress(userManager, pdfDocumentHeader);

            _html += _userInfo;
            

            //
            //  INCOMES
            //

            _income += "<div style='padding-top:80px;'><h1>INCOME</h1></div>";

            foreach (IncomeExpensePDFTableModel item in htmlData)
            {
                if (item.Type == "Expenses")
                {
                    hasExpenses = true;
                }

                if (item.Type == "Income")
                {
                    var totalIncome = 0.0;
                    _income += "<table width='100%' cellspacing='0' cellpadding='0'><tbody>";
                    _income += "<tr><th style='background-color: #C0C0C0;padding: 4px;' colspan='" + item.Headers.Count + "'>" + item.TableName + "</th></tr>";
                    _income += "<tr>";

                    foreach (IncomeExpensePDFHeaderModel header in item.Headers)
                    {
                        if (header.Header == "Amount")
                        {
                            _income += "<th style='background-color: #E5E5E5;text-align: right; padding-right: 4px;'>" + header.Header + "</th>";
                        }
                        else
                        {
                            _income += "<th style='background-color: #E5E5E5;'>" + header.Header + "</th>";
                        }
                    }
                    _income += "</tr>";

                    foreach (IncomeExpensePDFDataModel _data in item.Data)
                    {
                        _income += "<tr>";
                        foreach (IncomeExpensePDFHeaderModel header in item.Headers)
                        {
                            if (header.Header == "Date")
                            {
                                _income += "<td style='border-bottom: 1px solid black;width:10%;'>" + _data.Date?.ToString("dd/MM/yyyy") + "</td>";
                            }
                            else if (header.Header == "Child")
                            {
                                _income += "<td style='border-bottom: 1px solid black;width:20%;'>" + _data?.Child + "</td>";
                            }
                            else if (header.Header == "Description")
                            {
                                _income += "<td style='border-bottom: 1px solid black;width:20%;'>" + _data?.Description + "</td>";
                            }
                            else if (header.Header == "Item")
                            {
                                _income += "<td style='border-bottom: 1px solid black;width:20%;'>" + _data?.Description ?? "-" + "</td>";
                            }
                            else if (header.Header == "Type")
                            {
                                _income += "<td style='border-bottom: 1px solid black;width:20%;'>" + _data?.Type + "</td>";
                            }
                            else if (header.Header == "Amount")
                            {
                                _income += "<td style='border-bottom: 1px solid black;width:10%;text-align: right;'>R " + _data?.Amount.ToString("#,0.00", nfi) + "</td>";

                                allIncome += (double)_data?.Amount;
                                totalIncome += (double)_data?.Amount;
                            }

                        }
                        _income += "</tr>";
                    }
                    if (item.TableName == "Subsidies, donations, contributions" || item.TableName == "Preschool fees: monetary contributions" || item.TableName == "Other")
                    {
                        _income += "<tr><th style='border-bottom: 1px solid black;' colspan='" + (item.Headers.Count - 1) + "'>Total</th><td style='font-weight: bold;border-bottom: 1px solid black;text-align: right;'>R" + totalIncome.ToString("#,0.00", nfi) + "</td></tr>";
                    }
                    _income += "</tbody></table><br>";

                }
            }
            _html += _income;

            string totalIncomeRow = "<table style='width: 100%; margin-top: 8px;'><tbody><tr><th style='background-color: #808080;padding: 4px;color: white;'>TOTAL INCOME</th><td style='background-color: #808080;padding: 4px;color: white;text-align: right;'>R " + allIncome.ToString("#,0.00", nfi) + "</td></tr></tbody></table>";
            _html += totalIncomeRow;
            _html += signDateRow;

            //
            //  EXPENSES
            //

            if (hasExpenses)
            {
                _expense += "<div style='padding-top:80px;page-break-before: always;'><h1>EXPENSES</h1></div>";

                foreach (IncomeExpensePDFTableModel item in htmlData)
                {
                    if (item.Type == "Expenses")
                    {
                        var totalExpense = 0.0;
                        _expense += "<table width='100%' cellspacing='0' cellpadding='0'><tbody>";
                        _expense += "<tr><th style='background-color: #C0C0C0;padding: 4px;' colspan='" + item.Headers.Count + "'>" + item.TableName + "</th></tr>";
                        _expense += "<tr>";

                        foreach (IncomeExpensePDFHeaderModel header in item.Headers)
                        {
                            if (header.Header == "Amount")
                            {
                                _expense += "<th style='background-color: #E5E5E5;text-align: right; padding-right: 4px;'>" + header.Header + "</th>";
                            }
                            else
                            {
                                _expense += "<th style='background-color: #E5E5E5;'>" + header.Header + "</th>";
                            }
                        }
                        _expense += "</tr>";
                        foreach (IncomeExpensePDFDataModel _data in item.Data)
                        {
                            if (_data.PhotoProof != null)
                            {
                                ExpenseReceipt expenseReceipt = new ExpenseReceipt();
                                expenseReceipt.Name = _data.Description;
                                expenseReceipt.PhotoProof = _data.PhotoProof;
                                receipts.Add(expenseReceipt);
                            }
                            _expense += "<tr>";
                            foreach (IncomeExpensePDFHeaderModel header in item.Headers)
                            {
                                if (header.Header == "Date")
                                {
                                    _expense += "<td style='border-bottom: 1px solid black;width:10%;'>" + _data.Date?.ToString("dd/MM/yyyy") + "</td>";
                                }
                                else if (header.Header == "Description")
                                {
                                    _expense += "<td style='border-bottom: 1px solid black;width:50%;'>" + _data?.Description + "</td>";
                                }
                                else if (header.Header == "Invoice/Receipt #")
                                {
                                    _expense += "<td style='border-bottom: 1px solid black;text-align: center; width:20%;'>" + _data?.InvoiceNr + "</td>";
                                }
                                else if (header.Header == "Amount")
                                {
                                    _expense += "<td style='border-bottom: 1px solid black;width:20%;text-align: right;'>R " + _data?.Amount.ToString("#,0.00", nfi) + "</td>";

                                    allExpense += (double)_data?.Amount;
                                    totalExpense += (double)_data?.Amount;
                                }

                            }
                            _expense += "</tr>";
                        }

                        _expense += "<tr><th style='border-bottom: 1px solid black;' colspan='" + (item.Headers.Count - 1) + "'>Total</th><td style='font-weight: bold;border-bottom: 1px solid black;text-align: right;'>R" + totalExpense.ToString("#,0.00", nfi) + "</td></tr>";
                        _expense += "</tbody></table><br>";
                    }
                }

                _html += _expense;

                string totalExpenseRow = "<table style='width: 100%; margin-top: 8px;'><tbody><tr><th style='background-color: #808080;padding: 4px;color: white;'>TOTAL EXPENSES</th><td style='background-color: #808080;padding: 4px;color: white;text-align: right;'>R " + allExpense.ToString("#,0.00", nfi) + "</td></tr></tbody></table>";
                _html += totalExpenseRow;
                _html += signDateRow;
            }

            //
            //  RECEIPTS
            //
            if (receipts.Count > 0)
            {
                _receipts = "<div style='padding-top:80px;page-break-before: always;'><h1>RECEIPTS</h1></div>";
                var count = 1;
                foreach (var item in receipts)
                {
                    _receipts += "<div><h2>" + item.Name + "</h2><img style='max-width: 400px;' src='" + item.PhotoProof + "'/></div>";

                    if (count < receipts.Count && count % 2 == 0)
                    {
                        _receipts += "<div style='page-break-before: always;'></div>";
                    }
                    count++;
                }
                _html += _receipts;
            }

            _html += "</body></html>";

            // discard result
            HtmlToPdfDocument doc = documentManager.GetPdfSettings(_html, _header, "portrait");
            byte[] pdf = _pdfConverter.Convert(doc);
            string Base64Result = Convert.ToBase64String(pdf);

            PdfDocumentModel pdfDoc = new PdfDocumentModel();
            pdfDoc.Reference = Base64Result;
            pdfDoc.FileName = _header.Replace(" ", "_") + ".pdf";
            pdfDoc.UserId = userId;
            pdfDoc.CreatedUserId = uId;

            return await documentManager.SaveIncomeStatementPDF(fileService, repoFactory, pdfDoc);

        }

        public List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData([Service] IncomeExpenseService incomeManager, string userId, int year, int month, bool splitSupport = false)
        {
            List<IncomeExpensePDFTableModel> tables = new List<IncomeExpensePDFTableModel>();
            var table = new IncomeExpensePDFTableModel();

            //
            //  EXPENSES
            //
            List<StatementsExpenseType> expenseTypes = incomeManager.GetAllStatementExpenseTypes(userId, year, month);
            foreach (StatementsExpenseType type in expenseTypes)
            {
                table = new IncomeExpensePDFTableModel();
                table.TableName = type.Description;
                table.Type = IncomeExpensePDF.EXPENSES;
                table.Headers = getExpensePDFHeader();
                table.Data = incomeManager.GetAllStatementsExpensesForType(userId, year, month, type.Id.ToString());
                if (table.Data != null && table.Data.Count > 0)
                {
                    table.Total = table.Data.Select(x => x.Amount).Sum();
                    tables.Add(table);
                }
            }

            //
            //  INCOME
            //
            List<StatementsIncomeType> incomeTypes = incomeManager.GetAllStatementIncomeTypes(userId, year, month);
            List<StatementsContributionType> contributionTypes = incomeManager.GetAllStatementContributionTypes(userId, year, month);
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
            table.Data = incomeManager.getMonetaryContributions(userId, year, month, preschoolFeeId.ToString(), moneyId.ToString());
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
            table.Data = incomeManager.getNonMonetaryContributions(userId, year, month, preschoolFeeId.ToString(), moneyId.ToString());
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
            table.Data = incomeManager.getSubsidiesDonationsContributions(userId, year, month, otherId.ToString(), incomeTypes);
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
            table.Data = incomeManager.getOtherIncome(userId, year, month, otherId.ToString());
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
}