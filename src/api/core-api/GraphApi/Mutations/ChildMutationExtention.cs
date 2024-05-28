using ECDLink.DataAccessLayer.Context;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System;
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.Tenancy.Context;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using EcdLink.Api.CoreApi.Services.Interfaces;
using EcdLink.Api.CoreApi.GraphApi.Models.Input;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ChildMutationExtention
    {
        private readonly Guid _tenantId = TenantExecutionContext.Tenant.Id;

        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.Update)]
        public bool UpdateChildAndCaregiver(
            [Service] IChildService childService,
            UpdateChildAndCaregiverInput input)
        {
            childService.UpdateChild(input);
            return true;
        }
    }
}
