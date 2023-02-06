using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.EventRecords;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.EventRecords;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class EventRecordTypeMutationExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public EventRecordType AddEventRecordType(
             [Service] EventRecordManager eventRecordManager,
             EventRecordTypeModel input)
        {
            return eventRecordManager.AddEventRecordType(input);
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public EventRecordType UpdateEventRecordType(
             [Service] EventRecordManager eventRecordManager,
             string id,
             EventRecordTypeModel input)
        {
            return eventRecordManager.UpdateEventRecordType(id, input);
        }
    }
}
