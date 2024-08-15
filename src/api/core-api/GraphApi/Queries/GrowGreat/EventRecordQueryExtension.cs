using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.EventRecords;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class EventQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<EventRecord> GetEventRecordsForClient(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            Guid clientId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var eventRecordRepo = repoFactory.CreateGenericRepository<EventRecord>(userContext: uId);
            return eventRecordRepo.GetAll().Where(x => x.IsActive && (x.MotherId == clientId || x.InfantId == clientId)).OrderByDescending(x => x.InsertedDate).ToList();
        }
        
    }
}
