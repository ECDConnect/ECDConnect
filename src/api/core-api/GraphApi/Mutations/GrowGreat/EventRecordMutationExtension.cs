using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.EventRecords;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities.EventRecords;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class EventRecordMutationExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public EventRecord AddEventRecord(
             [Service] EventRecordManager eventRecordManager,
             EventRecordModel input)
        {
            return eventRecordManager.AddEventRecord(input);
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public EventRecord UpdateEventRecord(
             [Service] EventRecordManager eventRecordManager,
             string id,
             EventRecordModel input)
        {
            return eventRecordManager.UpdateEventRecord(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public EventRecord UpdateEventRecordStatusById(
             [Service] EventRecordManager eventRecordManager,
             Guid eventRecordId,
             bool isActive)
        {
            return eventRecordManager.UpdateEventRecordStatusById(eventRecordId, isActive);
        }
    }
}
