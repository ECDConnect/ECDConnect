using ECDLink.Abstractrions.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IDocumentManagementService
    {
        public bool DeleteDocumentById(string documentId);

        public bool DeleteUserDocument(string userId, FileTypeEnum fileType);
    }
}
