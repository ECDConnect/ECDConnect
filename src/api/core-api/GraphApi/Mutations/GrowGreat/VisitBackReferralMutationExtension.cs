using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat {
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitBackReferralExtension {
        
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public VisitBackReferral AddVisitBackReferralData([Service] VisitBackReferralManager visitBackReferralManager, VisitBackReferralModel input)
        {
            return visitBackReferralManager.AddVisitBackReferral(input);
        }
    }
}
