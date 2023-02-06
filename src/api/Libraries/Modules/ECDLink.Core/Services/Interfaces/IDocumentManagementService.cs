using ECDLink.Abstractrions.Enums;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IDocumentManagementService
    {
        public bool DeleteDocumentById(string documentId);

        public bool DeleteUserDocument(string userId, FileTypeEnum fileType);
    }
}
