using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
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
        public Mother UpdateMother([Service] MotherManager motherManager, string id, MotherModel input)
        {
            return motherManager.UpdateMother(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Mother UpdateMotherContactDetails([Service] MotherManager motherManager, string id, MotherModel input) {
            return motherManager.UpdateContactDetails(id, input);
        }
    }
}
