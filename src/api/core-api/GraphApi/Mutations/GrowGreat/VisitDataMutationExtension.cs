using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitDataMutationExtension
    {
        
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Boolean AddVisitData([Service] VisitDataManager visitDataManager, CMSVisitDataInputModel input)
        {
            if (input.MotherId != "")
            {
                visitDataManager.AddAntenatalVisitData(input);

            } else
            {
                visitDataManager.AddChildVisitData(input);
            }
            return true;
        }
    }
}
