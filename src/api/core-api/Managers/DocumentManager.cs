using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Tenancy.Context;
using HotChocolate;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.Managers
{

    public class DocumentManager
    {

        private IGenericRepositoryFactory _repoFactory;
        private IFileService _fileService;

        public DocumentManager(IGenericRepositoryFactory repoFactory, [Service] IFileService fileService)
        {
            _fileService = fileService;
            _repoFactory = repoFactory;
        }

        public async Task<Document> SaveIncomeStatementPDFAsync(IncomeStatementPDFDoc input)
        {
            if (input != null && input.Reference != "")
            {
                var documentRepo = _repoFactory.CreateGenericRepository<Document>(userContext: input.CreatedUserId);
                var documentTypeRepo = _repoFactory.CreateGenericRepository<DocumentType>(userContext: input.CreatedUserId);
                var workflowStatusTypeRepo = _repoFactory.CreateGenericRepository<WorkflowStatusType>(userContext: input.CreatedUserId);
                var workflowStatusRepo = _repoFactory.CreateGenericRepository<WorkflowStatus>(userContext: input.CreatedUserId);

                // Workflow info
                WorkflowStatusType wsType = workflowStatusTypeRepo.GetAll().Where(x => x.Description == Constants.SSSettings.workflow_pdf_type).FirstOrDefault();
                WorkflowStatus ws = workflowStatusRepo.GetAll().Where(x => x.WorkflowStatusTypeId == wsType.Id && x.Description == Constants.SSSettings.workflow_status_pdf_type).FirstOrDefault();

                // Get the document type
                DocumentType docType = documentTypeRepo.GetAll().Where(x => x.Name == Constants.SSSettings.income_statement_pdf_type).FirstOrDefault();

                // First validate if document is already in db
                var doc = documentRepo.GetAll().Where(x => x.Name == input.FileName && x.UserId == input.UserId && x.DocumentTypeId == docType.Id && x.WorkflowStatusId == ws.Id).FirstOrDefault();
                try { 
                    // Upload the document
                    var document = await _fileService.UploadBase64StringFileAsync(input.Reference, input.FileName, FileTypeEnum.IncomeStatementPDF);

                    if (doc == null)
                    {
                        // Save new document to the database
                        return documentRepo.Insert(new Document
                        {
                            CreatedUserId = input.CreatedUserId,
                            Name = input.FileName,
                            UpdatedBy = input.CreatedUserId,
                            InsertedDate = DateTime.Now,
                            Reference = document.Url.TrimEnd('/'),
                            UserId = input.UserId,
                            DocumentTypeId = docType.Id,
                            WorkflowStatusId = ws.Id,
                            TenantId = TenantExecutionContext.Tenant.Id
                        });
                }
                    else
                {
                    // remove previous file on file server
                    await _fileService.DeleteFile(doc.Name, FileTypeEnum.IncomeStatementPDF);

                    doc.Name = input.FileName;
                    doc.UpdatedBy = input.CreatedUserId;
                    doc.Reference = document.Url.TrimEnd('/');
                    doc.UserId = input.UserId;
                    doc.UpdatedDate = DateTime.Now;
                    return documentRepo.Update(doc);
                }
            }
                catch (Exception e)
                {
                    return null;
                }
            }

            return null;
        }

        public Document SaveIncomeStatementPDF(IncomeStatementPDFDoc input)
        {
            if (input != null && input.Reference != "")
            {
                var documentRepo = _repoFactory.CreateGenericRepository<Document>(userContext: input.CreatedUserId);                
                var documentTypeRepo = _repoFactory.CreateGenericRepository<DocumentType>(userContext: input.CreatedUserId);
                var workflowStatusTypeRepo = _repoFactory.CreateGenericRepository<WorkflowStatusType>(userContext: input.CreatedUserId);
                var workflowStatusRepo = _repoFactory.CreateGenericRepository<WorkflowStatus>(userContext: input.CreatedUserId);

                // Workflow info
                WorkflowStatusType wsType = workflowStatusTypeRepo.GetAll().Where(x => x.Description == Constants.SSSettings.workflow_pdf_type).FirstOrDefault();
                WorkflowStatus ws = workflowStatusRepo.GetAll().Where(x => x.WorkflowStatusTypeId == wsType.Id && x.Description == Constants.SSSettings.workflow_status_pdf_type).FirstOrDefault();

                // Get the document type
                DocumentType docType = documentTypeRepo.GetAll().Where(x => x.Name == Constants.SSSettings.income_statement_pdf_type).FirstOrDefault();

                // First validate if document is already in db
                var doc = documentRepo.GetAll().Where(x => x.Name == input.FileName && x.UserId == input.UserId && x.DocumentTypeId == docType.Id && x.WorkflowStatusId == ws.Id).FirstOrDefault();
                try
                {
                    // Upload the document
                    var document = _fileService.UploadBase64StringFile(input.Reference, input.FileName, FileTypeEnum.IncomeStatementPDF);

                    if (doc == null)
                    {
                        // Save new document to the database
                        return documentRepo.Insert(new Document
                    {
                        CreatedUserId = input.CreatedUserId,
                        Name = input.FileName,
                        UpdatedBy = input.CreatedUserId,
                        InsertedDate = DateTime.Now,
                        Reference = document.Url.TrimEnd('/'),
                        UserId = input.UserId,
                        DocumentTypeId = docType.Id,
                        WorkflowStatusId = ws.Id,
                        TenantId = TenantExecutionContext.Tenant.Id
                    });
                }
                    else
                {
                    // remove previous file on file server
                    _fileService.DeleteFile(doc.Name, FileTypeEnum.IncomeStatementPDF);

                    doc.Name = input.FileName;
                    doc.UpdatedBy = input.CreatedUserId;
                    doc.Reference = document.Url.TrimEnd('/');
                    doc.UserId = input.UserId;
                    doc.UpdatedDate = DateTime.Now;
                    return documentRepo.Update(doc);
                }
            }
                catch (Exception e)
                {
                    return null;
                }
            }

            return null;
        }

    }
}

