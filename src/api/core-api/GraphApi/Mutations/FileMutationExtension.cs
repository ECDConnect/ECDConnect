using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models.Storage;
using ECDLink.Core.Services.Interfaces;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class FileMutationExtension
    {
        [Permission(PermissionGroups.DOCUMENTS, GraphActionEnum.Create)]
        public async Task<DocumentModel> FileUpload([Service] IFileService _fileService, string file, string fileName, FileTypeEnum fileType)
        {
            var document = await _fileService.UploadBase64StringFileAsync(file, fileName, fileType);
            return document;
        }
    }
}
