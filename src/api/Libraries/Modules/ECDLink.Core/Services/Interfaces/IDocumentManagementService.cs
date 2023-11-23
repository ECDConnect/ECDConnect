using ECDLink.Abstractrions.Enums;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IDocumentManagementService
    {
        public bool DeleteDocumentById(string documentId);

        public bool DeleteUserDocument(string userId, string accessUserId, FileTypeEnum fileType);

        public bool AddUserDocument(string userId, string fileType, string file, string fileName, string addedByUserId);
    }
}
