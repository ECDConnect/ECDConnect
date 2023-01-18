using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.DataAccessLayer.Entities.EventRecords;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.EventRecords
{
    public class EventRecordManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;

        public EventRecordManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
        }

        //
        //  EVENT RECORD TYPE FUNCTIONS
        //

        public EventRecordType AddEventRecordType(EventRecordTypeModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<EventRecordType>(userContext: applicationUserId);
            var eventRecordType = GetEventRecordTypeFromInputModel(input, applicationUserId);

            return repository.Insert(eventRecordType);
        }

        public EventRecordType UpdateEventRecordType(string id, EventRecordTypeModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<EventRecordType>(userContext: applicationUserId);
            var entityToUpdate = repository.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).OrderBy(x => x.Id).FirstOrDefault();

            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = applicationUserId;
            entityToUpdate.Name = input.Name;
            entityToUpdate.NormalizedName = input.NormalizedName;
            entityToUpdate.Description = input.Description;
            entityToUpdate.ParentId = new Guid(input.ParentId);
            entityToUpdate.Type = input.Type;

            return repository.Update(entityToUpdate);
        }

        private EventRecordType GetEventRecordTypeFromInputModel(EventRecordTypeModel input, string applicationUserId)
        {
            if (input == null)
            {
                return null;
            }

            return new EventRecordType()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId,
                Name = input.Name,
                NormalizedName = input.NormalizedName,
                Description = input.Description,
                ParentId = new Guid(input.ParentId),
                Type = input.Type
            };
        }

        //
        //  EVENT RECORD FUNCTIONS
        //

        public EventRecord AddEventRecord(EventRecordModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<EventRecord>(userContext: applicationUserId);
            var eventRecord = GetEventRecordFromInputModel(input, applicationUserId);

            return repository.Insert(eventRecord);
        }

        public EventRecord UpdateEventRecord(string id, EventRecordModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<EventRecord>(userContext: applicationUserId);
            var entityToUpdate = repository.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).OrderBy(x => x.Id).FirstOrDefault();

            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = applicationUserId;
            entityToUpdate.Notes = input.Notes;
            entityToUpdate.MotherId = input.MotherId;
            entityToUpdate.InfantId = input.InfantId;
            entityToUpdate.LinkedVisitId = new Guid(input.LinkedVisitId);

            return repository.Update(entityToUpdate);
        }

        private EventRecord GetEventRecordFromInputModel(EventRecordModel input, string applicationUserId)
        {
            if (input == null)
            {
                return null;
            }

            return new EventRecord()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId,
                Notes = input.Notes,
                EventRecordTypeId = input.EventRecordType.Id,
                MotherId = input.MotherId,
                InfantId = input.InfantId,
                LinkedVisitId = new Guid(input.LinkedVisitId)
            };
        }

    }
}

