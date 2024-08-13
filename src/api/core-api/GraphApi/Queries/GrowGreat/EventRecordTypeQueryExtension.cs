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
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class EventTypeQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<EventRecordType> GetAllEventRecordTypes(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var eventRecordTypeRepo = repoFactory.CreateGenericRepository<EventRecordType>(userContext: uId);
            // getting all the parents without children
            List<EventRecordType> eventRecordTypes = eventRecordTypeRepo.GetAll().Where(x => x.ParentId == null).OrderBy(x => x.NormalizedName).ToList();

            foreach (var eventType in eventRecordTypes)
            {
                // get all children for parents
                var children = eventRecordTypeRepo.GetAll().Where(x => x.ParentId == eventType.Id).ToList();
                eventType.Children = children;
            }
            return eventRecordTypes;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<EventRecordType> GetAllEventRecordTypesForType(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string type)// type will be mother or child
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var eventRecordTypeRepo = repoFactory.CreateGenericRepository<EventRecordType>(userContext: uId);
            // getting all the parents without children
            List<EventRecordType> eventRecordTypes = eventRecordTypeRepo.GetAll().Where(x => x.Type == type && x.ParentId == null).OrderBy(x => x.NormalizedName).ToList();

            foreach (var eventType in eventRecordTypes)
            {
                // get all children for parents
               var children = eventRecordTypeRepo.GetAll().Where(x => x.ParentId == eventType.Id).ToList();
               eventType.Children = children;
            }
            return eventRecordTypes;
        }
    }
}
