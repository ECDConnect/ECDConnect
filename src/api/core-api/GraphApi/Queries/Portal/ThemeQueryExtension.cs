using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.PostgresTenancy.Services;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ThemeQueryExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.View)]
        public string GetDefaultSettingsForTenant()
        {
            return TenantExecutionContext.Tenant.DefaultSystemSettings;
        }

        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.View)]
        public bool ValidateNewTenantName([Service] TenantService tenantService, string applicationName)
        {
            return tenantService.ValidateNewTenantName(applicationName);
        }

    }
}
