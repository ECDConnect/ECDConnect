using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ThemeMutationExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public async Task<bool> UpdateTenantTheme([Service] IFileService _fileService, string theme)
        {
            // TODO: (Tenancy) This can't be hardcoded as it will be different for each tenant
            using MemoryStream fileStream = new MemoryStream(Encoding.UTF8.GetBytes(theme));
            await _fileService.UploadFileStream(fileStream, "smartstart.json", FileTypeEnum.Theme);
            fileStream.Dispose();
            return true;
        }
    }
}
