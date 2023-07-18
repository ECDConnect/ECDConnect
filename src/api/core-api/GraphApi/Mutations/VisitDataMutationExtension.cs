using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitDataMutationExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool AddVisitData([Service] VisitDataManager visitDataManager, CMSVisitDataInputModel input)
        {
            if (input.MotherId != null)
            {
                visitDataManager.AddAntenatalVisitData(input);
            }
            else if (input.InfantId != null)
            {
                visitDataManager.AddChildVisitData(input);
            }
            else if (input.PractitionerId != null)
            {
                visitDataManager.AddPractitionerVisitData(input, true);
            }
            else if (input.TraineeId != null)
            {
                visitDataManager.AddTraineeVisitData(input);
            }
            return true;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool EditVisitData([Service] VisitDataManager visitDataManager, CMSVisitDataInputModel input)
        {
            return visitDataManager.EditVisitData(input);
        }
    }
}
