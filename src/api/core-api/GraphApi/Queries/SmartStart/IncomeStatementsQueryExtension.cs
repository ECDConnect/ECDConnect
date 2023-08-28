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

        public List<StatementsBalanceSheet> GetAllStatementsBalanceSheet([Service] IncomeExpenseService incomeManager, 
            string userId, int year, int? month = null)
        {
            return incomeManager.GetAllStatementsBalanceSheet(userId, year, month);
        }

        public async Task<Document> GetStatementsIncomeExpensesPDFFile(
            [Service] IncomeExpenseService incomeManager,
            string userId, int year, int month)
        {
            // !!! I'm pretty sure this should just fetch the existing document we saved when submitting the statement, rather than recreating and saving it !!!
            return incomeManager.CreateIncomeStatementPDFDocument(userId, year, month);
        }

        public List<IncomeExpensePDFTableModel> GetStatementsIncomeExpensesPDFData([Service] IncomeExpenseService incomeManager, string userId, int year, int month, bool splitSupport = false)
        {
            return incomeManager.GetStatementsIncomeExpensesPDFData(userId, year, month);
        }
    }
}