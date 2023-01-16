using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Users;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class MotherMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Mother AddMother([Service] MotherManager motherManager, MotherModel input)
        {
            return motherManager.AddMother(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Mother UpdateMother(
            [Service] MotherManager motherManager,
            string id,
            MotherModel input)
        {
            return motherManager.UpdateMother(id, input);
        }
    }
}
