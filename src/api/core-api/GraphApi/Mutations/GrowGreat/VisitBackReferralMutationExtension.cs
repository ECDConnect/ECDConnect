using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat 
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitBackReferralExtension 
    {        
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public VisitBackReferral AddVisitBackReferral([Service] VisitBackReferralManager visitBackReferralManager, VisitBackReferralModel input)
        {
            return visitBackReferralManager.AddVisitBackReferral(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public VisitBackReferral AddVisitBackReferralAdminComment(
            [Service] VisitBackReferralManager visitBackReferralManager, 
            Guid visitBackReferralId,
            string comment)
        {
            return visitBackReferralManager.AddVisitBackReferralAdminComment(visitBackReferralId, comment);
        }
    }
}
