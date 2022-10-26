using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using NPOI.HPSF;
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
            var fileName = GetFileNameFromTenant();
            using MemoryStream fileStream = new MemoryStream(Encoding.UTF8.GetBytes(theme));
            await _fileService.UploadFileStream(fileStream, fileName, FileTypeEnum.Theme);
            fileStream.Dispose();
            return true;
        }

        // TODO: (Tenancy) Tenant should be an Enum
        private string GetFileNameFromTenant()
        {
            switch (TenantExecutionContext.Tenant.ApplicationName)
            {
                case "GrowGreat":
                    return "growgreat.json";
                default:
                    return "smartstart.json";
            }
        }
    }
}
