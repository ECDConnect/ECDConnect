using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
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

    }
}
