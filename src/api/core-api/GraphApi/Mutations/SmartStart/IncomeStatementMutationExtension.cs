using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers;
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
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class IncomeStatementMutationExtension
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        
        public IncomeStatementMutationExtension(
                IHttpContextAccessor contextAccessor,
                IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public ResultReturnObject UpdateIncome([Service] IncomeExpenseService incomeManager, string id,
              StatementsIncome input)
        {
            var retObj = incomeManager.UpdateIncome(input);
            return (retObj != null ? new ResultReturnObject() { Result = true, ResultMessage = "Income Submitted", ResultObject = JsonConvert.SerializeObject(retObj) } : new ResultReturnObject() { Result = false, ResultMessage = "Income line could not be processed for criteria" });
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public ResultReturnObject UpdateExpense([Service] IncomeExpenseService incomeManager, string id,
      StatementsExpenses input)
        {
            if (input != null)
            {
                var retObj = incomeManager.UpdateExpense(input);
                return (retObj != null ? new ResultReturnObject() { ResultMessage = "Expense Submitted",  ResultObject = JsonConvert.SerializeObject(retObj) } : new ResultReturnObject() { Result = false, ResultMessage = "Expense line could not be processed for criteria" });
            }
            else return new ResultReturnObject() { ResultMessage = "Input object was null" };
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public ResultReturnObject UpdateStartupSupport([Service] IncomeExpenseService incomeManager, string id,
            StatementsStartupSupport input)
        {
            if (input != null)
            {
                var retObj = incomeManager.UpdateStartupSupport(input);
                return (retObj != null ? new ResultReturnObject() { ResultMessage = "Startup Support Submitted", ResultObject = JsonConvert.SerializeObject(retObj) } : new ResultReturnObject() { Result = false, ResultMessage = "Startup Support could not be processed for criteria" });
            }
            else return new ResultReturnObject() { ResultMessage = "Input object was null" };
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public ResultReturnObject SubmitStatement(
            [Service] IncomeExpenseService incomeManager, 
            StatementsSubmit input)
        {
            if (input != null)
            {
                var retObj = incomeManager.SubmitStatement(input);
                return (retObj == true 
                    ? new ResultReturnObject() { Result = true, ResultMessage = "Statement Submitted", ResultObject = JsonConvert.SerializeObject(retObj) } 
                    : new ResultReturnObject() { Result = false, ResultMessage = "Statement could not be processed for criteria" });
            }
            else return new ResultReturnObject() { ResultMessage = "Input object was null" };
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public ResultReturnObject AutoSubmitStatement([Service] IncomeExpenseService incomeManager)
        {
            var pracsDueSubmits = incomeManager.GetUnsubmittedStatements();

            foreach (var pracData in pracsDueSubmits)
            {
                DateTime duePeriod  = pracData.Value;
                incomeManager.AutoSubmitStatement(pracData.Key, duePeriod.Year, duePeriod.Month);
            }
            return new ResultReturnObject() { ResultMessage = "OK" };
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.View)]
        public async Task<Document> SaveIncomeStatementPDF(
            [Service] DocumentManager documentManager,
            PdfDocumentModel input)
        {
            input.CreatedUserId = _contextAccessor.HttpContext.GetUser().Id;

            return await documentManager.SaveIncomeStatementPDF(input);            
        }
    }
}
