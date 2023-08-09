using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Documents;
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

        public bool DeleteUserDocument(string userId, FileTypeEnum fileType)
        {
            var repo = _repositoryFactory.CreateRepository<Document>(userContext: userId);

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
    }
}