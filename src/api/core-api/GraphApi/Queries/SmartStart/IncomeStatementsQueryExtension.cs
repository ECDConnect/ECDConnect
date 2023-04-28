using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class IncomeStatementsQueryExtension
    {
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

        public List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData([Service] IncomeExpenseService incomeManager, string userId, int year, int month)
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
