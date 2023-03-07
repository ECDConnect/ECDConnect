using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat {
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitDataMutationExtension
    {
        
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Boolean AddVisitData([Service] VisitDataManager visitDataManager, CMSVisitDataInputModel input)
        {

            if (input.MotherId != null)
            {
                visitDataManager.AddAntenatalVisitData(input);

            } else if (input.InfantId != null)
            {
                // TODO: Remove this code for visitId - this is temp - currently the visit id is null
                input.VisitId = "364949e7-e5fb-4cd8-93cb-bef6c5f7f9c3";

                visitDataManager.AddChildVisitData(input);
            }
            return true;
        }
    }
}
