using EcdLink.Api.CoreApi.Security.Managers;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Model;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.Portal
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class TenantSetupInfoMutationExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.Create)]
        public async Task<TenantSetupInfo> AddTenantSetupInfo(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] SecurityNotificationManager notificationManager,
            string setupInfo)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var repo = repoFactory.CreateGenericRepository<TenantSetupInfo>();
            var tenantOrgDetail = JsonConvert.DeserializeObject<TenantOrgDetailModel>(setupInfo);

            var setupRecord =  repo.Insert(
                new TenantSetupInfo()
                {
                    Id = Guid.NewGuid(),
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = uId.ToString(),
                    IsActive = true,
                    OrganisationName = tenantOrgDetail.OrganisationName,
                    SetupJsonData = setupInfo
                });

            // Send email to tenant organisation email to inform of new record.
            await notificationManager.SendNewTenantSetupToAdministratorAsync((Guid)uId, tenantOrgDetail);

            return setupRecord;
        }

    }
}
