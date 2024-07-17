using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.EGraphQL.Authorization;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using HotChocolate;
using HotChocolate.Types;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.Portal
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ThemeMutationExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public async Task<string> UpdateTenantTheme(
            [Service] TenantService tenantService,
            [Service] IFileService fileService, 
            string theme)
        {
            var fileName = TenantExecutionContext.Tenant.Id.ToString() + "_theme.json";
            using MemoryStream fileStream = new MemoryStream(Encoding.UTF8.GetBytes(theme));
            await fileService.UploadFileStream(fileStream, fileName, FileTypeEnum.Theme);
            fileStream.Dispose();

            // Update themePath on tenant if not available
            if (TenantExecutionContext.Tenant.ThemePath == null)
            {
                var themePath = TenantExecutionContext.Tenant.BlobStorageAddress + "/theme/" + fileName;
                tenantService.UpdateTenantThemePath(TenantExecutionContext.Tenant.Id, themePath);
            }
            return fileName;
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public TenantInternalModel UpdateTenantInfo(
            [Service]TenantService tenantService,
            TenantInfoInputModel input)
        {
            if (input == null)
            {
                throw new ArgumentNullException("input");
            }

            return tenantService.UpdateTenantInfo(TenantExecutionContext.Tenant.Id, input);
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public async Task<TenantInternalModel> RevertTenantSettingsToDefault(
            [Service] TenantService tenantService,
            [Service] IFileService fileService)
        {
            var defaultSettings = JsonConvert.DeserializeObject<TenantDefaultSettingsModel>(TenantExecutionContext.Tenant.DefaultSystemSettings);

            // reverting all colours, images
            await UpdateTenantTheme(tenantService, fileService, TenantExecutionContext.Tenant.DefaultSystemSettings);

            // reverting names and email
            TenantInfoInputModel input = new TenantInfoInputModel()
            {
                ApplicationName = defaultSettings.ApplicationName,
                OrganisationEmail = defaultSettings.OrganisationEmail,
                OrganisationName = defaultSettings.OrganisationName
            };
            return tenantService.UpdateTenantInfo(TenantExecutionContext.Tenant.Id, input);
        }


    }
}
