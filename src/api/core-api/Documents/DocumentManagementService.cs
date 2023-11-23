using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Repositories.Factories;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.Documents
{
    public class DocumentManagementService : IDocumentManagementService
    {
        private readonly IFileService _fileService;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        public DocumentManagementService(IFileService fileService, IGenericRepositoryFactory repositoryFactory)
        {
            _fileService = fileService;
            _repositoryFactory = repositoryFactory;
        }

        public bool DeleteDocumentById(string documentId)
        {
            var repo = _repositoryFactory.CreateRepository<Document>();

            var documentGuid = Guid.Parse(documentId);

            var document = repo.GetById(documentGuid);

            if (document == default(Document))
            {
                return false;
            }

            var isDeleted = _fileService.DeleteFile(document.Reference, document.DocumentType.EnumId).Result;

            if (!isDeleted)
            {
                return false;
            }

            repo.Delete(documentGuid);

            return true;
        }

        public bool DeleteUserDocument(string userId, string accessUserId, FileTypeEnum fileType)
        {
            var repo = _repositoryFactory.CreateRepository<Document>(userContext: accessUserId);

            var documents = repo.GetAll()
                                .Where(x => string.Equals(x.UserId, userId)
                                && x.DocumentType.EnumId == fileType)
                                .ToList();

            foreach (var document in documents)
            {
                var fileName = document.Reference.Split("/").Last();

                var isDeleted = _fileService.DeleteFile(fileName, document.DocumentType.EnumId).Result;

                if (!isDeleted)
                {
                    continue;
                }

                repo.Delete(document.Id);
            }

            return true;
        }

        public bool AddUserDocument(string userId, string fileType, string file, string fileName, string addedByUserId)
        {
            var repo = _repositoryFactory.CreateRepository<Document>(userContext: addedByUserId);
            var documentTypeRepo = _repositoryFactory.CreateGenericRepository<DocumentType>(userContext: addedByUserId);
            var workflowRepo = _repositoryFactory.CreateGenericRepository<WorkflowStatus>(userContext: addedByUserId);
            var docType = documentTypeRepo.GetAll().Where(x => x.Id == Guid.Parse(fileType)).FirstOrDefault();
            var wfPending = workflowRepo.GetAll().Where(w => w.Description.Equals("Pending Verification")).FirstOrDefault();

            var doc = repo.GetAll().
                            Where(x => x.Name == fileName && x.UserId == userId
                            && x.DocumentTypeId == docType.Id)
                            .FirstOrDefault();

            if (doc != null)
            {
                _fileService.DeleteFile(doc.Name, doc.DocumentType.EnumId);
            }

            var document = _fileService.UploadBase64StringFileAsync(file, fileName, docType.EnumId).Result;
            try
            {
                if (doc == null)
                {
                    // Save new document to the database
                    doc = new Document
                    {
                        Id = Guid.NewGuid(),
                        CreatedUserId = addedByUserId,
                        Name = fileName,
                        UpdatedBy = addedByUserId,
                        InsertedDate = DateTime.Now,
                        Reference = document.Url.TrimEnd('/'),
                        UserId = userId,
                        DocumentTypeId = docType.Id,
                        WorkflowStatusId = wfPending.Id,
                    };
                    repo.Insert(doc);
                }
                else
                {
                    doc.Name = fileName;
                    doc.UpdatedBy = addedByUserId;
                    doc.Reference = document.Url.TrimEnd('/');
                    doc.UserId = userId;
                    doc.UpdatedDate = DateTime.Now;
                    repo.Update(doc);
                }
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }
    }
}