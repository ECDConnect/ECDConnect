using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.AzureStorage.Blob;
using ECDLink.Core.Services.Interfaces;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
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
        public Task<string> UpdateTenantTheme(
            [Service] ITenantService tenantService,
            [Service] IFileService fileService, 
            string theme)
        {
            var fileName = TenantExecutionContext.Tenant.Id.ToString() + "_theme.json";
            using MemoryStream fileStream = new MemoryStream(Encoding.UTF8.GetBytes(theme));
            //await fileService.UploadFileStream(fileStream, fileName, FileTypeEnum.Theme);
            var fileUrl = Task.Run(() => fileService.UploadFileStreamAsync(fileStream, fileName, FileTypeEnum.Theme)).Result;
            fileStream.Dispose();
           
            tenantService.UpdateTenantThemePath(TenantExecutionContext.Tenant.Id, fileUrl);
            
            return Task.FromResult(fileName);
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Update)]
        public TenantInternalModel UpdateTenantInfo(
            [Service] ITenantService tenantService,
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
            [Service] ITenantService tenantService,
            [Service] IFileService fileService)
        {
            var orgDetail = JsonConvert.DeserializeObject<TenantOrgDetailModel>(TenantExecutionContext.Tenant.DefaultSystemSettings);

            // reverting all colours, images
            await UpdateTenantTheme(tenantService, fileService, TenantExecutionContext.Tenant.DefaultSystemSettings);

            // reverting names and email
            TenantInfoInputModel input = new TenantInfoInputModel()
            {
                ApplicationName = orgDetail.ApplicationName,
                OrganisationEmail = orgDetail.OrganisationEmail,
                OrganisationName = orgDetail.OrganisationName
            };
            return tenantService.UpdateTenantInfo(TenantExecutionContext.Tenant.Id, input);
        }


    }
}
