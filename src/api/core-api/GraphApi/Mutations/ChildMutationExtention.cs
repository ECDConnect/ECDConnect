using HotChocolate;
using HotChocolate.Types;
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
