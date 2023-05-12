using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using ECDLink.Core.Services;
using ECDLink.Core.Services.Interfaces;
using EcdLink.Api.CoreApi.GraphApi.Models;
using System;
using System.IO;
using System.Threading.Tasks;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.Tenancy.Context;
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Workflow;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class IncomeStatementMutationExtension
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private string _applicationUserId;
        private IFileService _fileService;
        private IGenericRepository<Document, Guid> _documentRepo;
        private IGenericRepository<DocumentType, Guid> _documentTypRepo;
        private IGenericRepository<WorkflowStatusType, Guid> _workflowStatusTypeRepo;
        private IGenericRepository<WorkflowStatus, Guid> _workflowStatusRepo;

        public IncomeStatementMutationExtension(
                IHttpContextAccessor contextAccessor,
                IGenericRepositoryFactory repoFactory, 
                IFileService fileService)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            _fileService = fileService;
            _documentRepo = _repoFactory.CreateGenericRepository<Document>(userContext: _applicationUserId);
            _documentTypRepo = _repoFactory.CreateGenericRepository<DocumentType>(userContext: _applicationUserId);
            _workflowStatusTypeRepo = _repoFactory.CreateGenericRepository<WorkflowStatusType>(userContext: _applicationUserId);
            _workflowStatusRepo = _repoFactory.CreateGenericRepository<WorkflowStatus>(userContext: _applicationUserId);
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
        public ResultReturnObject SubmitStatement([Service] IncomeExpenseService incomeManager, string id,
StatementsSubmit input)
        {
            if (input != null)
            {
                var retObj = incomeManager.SubmitStatement(input);
                return (retObj == true ? new ResultReturnObject() { Result = true, ResultMessage = "Statement Submitted", ResultObject = JsonConvert.SerializeObject(retObj) } : new ResultReturnObject() { Result = false, ResultMessage = "Statement could not be processed for criteria" });
            }
            else return new ResultReturnObject() { ResultMessage = "Input object was null" };
        }

        [Permission(PermissionGroups.INCOMESTATEMENTS, GraphActionEnum.Create)]
        public bool SaveIncomeStatementPDF(IncomeStatementPDFDoc input)
        {
            if (input != null)
            {
                // Upload the document
                var b64Str = input.Reference.Substring(input.Reference.LastIndexOf(',') + 1);
                var bytes = Convert.FromBase64String(b64Str);

                using MemoryStream fileStream = new MemoryStream(bytes);
                var fileUrl = Task.Run(() => _fileService.UploadFileStream(fileStream, input.FileName, FileTypeEnum.IncomeStatementPDF)).Result;
                fileStream.Dispose();

                // Get the document type
                DocumentType docType = _documentTypRepo.GetAll().Where(x => x.Name == Constants.SSSettings.income_statement_pdf_type).FirstOrDefault();

                // Workflow info
                WorkflowStatusType wsType = _workflowStatusTypeRepo.GetAll().Where(x => x.Description == Constants.SSSettings.workflow_pdf_type).FirstOrDefault();
                WorkflowStatus ws = _workflowStatusRepo.GetAll().Where(x => x.WorkflowStatusTypeId == wsType.Id && x.Description == Constants.SSSettings.workflow_status_pdf_type).FirstOrDefault();

                // First validate if document is already in db
                var doc = _documentRepo.GetAll().Where(x => x.Name == input.FileName && x.UserId == input.UserId && x.DocumentTypeId == docType.Id && x.WorkflowStatusId == ws.Id).FirstOrDefault();

                if (doc == null)
                {
                    // Save new document to the database
                    doc = new Document
                    {
                        CreatedUserId = _applicationUserId,
                        Name = input.FileName,
                        UpdatedBy = _applicationUserId,
                        InsertedDate = DateTime.Now,
                        Reference = fileUrl,
                        UserId = input.UserId,
                        DocumentTypeId = docType.Id,
                        WorkflowStatusId = ws.Id,
                        TenantId = TenantExecutionContext.Tenant.Id
                    };
                    _documentRepo.Insert(doc);

                } else {

                    doc.Name = input.FileName;
                    doc.UpdatedBy = _applicationUserId;
                    doc.Reference = fileUrl;
                    doc.UserId = input.UserId;
                    doc.UpdatedDate = DateTime.Now;
                    _documentRepo.Update(doc);

                }
            }

            return true;
        }
    }
}
