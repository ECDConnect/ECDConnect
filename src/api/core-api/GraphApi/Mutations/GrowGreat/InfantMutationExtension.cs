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
    public class InfantMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Infant AddInfant([Service] InfantManager infantManager, InfantModel input)
        {
            return infantManager.AddInfant(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Infant UpdateInfant(
            [Service] InfantManager infantManager,
            string id,
            InfantModel input)
        {
            return infantManager.UpdateInfant(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Infant UpdateInfantCaregiverContactDetails([Service] InfantManager infantManager, string id, InfantModel input)
        {
            return infantManager.UpdateInfantCaregiverContactDetails(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Infant UpdateInfantCaregiverAddress([Service] InfantManager infantManager, string id, InfantModel input)
        {
            return infantManager.UpdateInfantCaregiverAddress(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Infant UpdateInfantCaregiver([Service] InfantManager infantManager, string infantId, InfantModel input)
        {
            return infantManager.UpdateInfantCaregiver(infantId, input);
        }
        
    }
}
