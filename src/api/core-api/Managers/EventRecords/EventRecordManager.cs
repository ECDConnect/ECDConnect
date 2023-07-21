using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using ECDLink.DataAccessLayer.Entities.EventRecords;
using ECDLink.DataAccessLayer.Entities.Users;
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
        private InfantManager _infantManger;

        public EventRecordManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            InfantManager infantManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _infantManger = infantManager;
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
            var entityToUpdate = repository.GetById(Guid.Parse(id));

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
            var eventRecordTypeRepo = _repoFactory.CreateGenericRepository<EventRecordType>(userContext: applicationUserId);
            var eventRec = eventRecordTypeRepo.GetById(Guid.Parse(input.EventRecordTypeId.ToString()));


            if (eventRecord != null && eventRecord.InfantId != null)
            {
                //do not archive for caregiver_is_pregnant && caregiver_has_changed
                if (eventRec != null && eventRec.Name != Constants.GGSettings.caregiverIsPregnant && eventRec.Name != Constants.GGSettings.newChildInFamily &&
                    eventRec.Name != Constants.GGSettings.caregiverHasChanged) {
                    ArchiveInfant(eventRecord.InfantId.ToString());
                }
            }
            if (eventRecord != null && eventRecord.MotherId != null)
            {
                ArchiveMother(eventRecord.MotherId.ToString());
            }

            return repository.Insert(eventRecord);
        }

        public EventRecord UpdateEventRecord(string id, EventRecordModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<EventRecord>(userContext: applicationUserId);
            var entityToUpdate = repository.GetById(Guid.Parse(id));

            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = applicationUserId;
            entityToUpdate.Notes = input.Notes;
            entityToUpdate.MotherId = input.MotherId;
            entityToUpdate.InfantId = input.InfantId;
            //entityToUpdate.LinkedVisitId = new Guid(input.LinkedVisitId);

            if (entityToUpdate != null && entityToUpdate.InfantId != null)
            {
                ArchiveInfant(entityToUpdate.InfantId.ToString());
            }
            if (entityToUpdate != null && entityToUpdate.MotherId != null)
            {
                ArchiveMother(entityToUpdate.MotherId.ToString());
            }

            return repository.Update(entityToUpdate);
        }

        private EventRecord GetEventRecordFromInputModel(EventRecordModel input, string applicationUserId)
        {
            if (input == null)
            {
                return null;
            }

            if (input.InfantId != null)
            {
                var infantId = _infantManger.GetInfantIdByUserId(input.InfantId.ToString());

                if (infantId != null)
                {
                    input.InfantId = infantId;
                }
            }
            if (input.MotherId != null)
            {
                var repository = _repoFactory.CreateGenericRepository<Mother>(userContext: applicationUserId);
                Mother mother = repository.GetAll().Where(x => x.UserId.Equals(input.MotherId.ToString())).OrderBy(x => x.Id).FirstOrDefault();
                input.MotherId = mother?.Id;
            }


            return new EventRecord()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId,
                Notes = input.Notes,
                EventRecordTypeId = (Guid)input.EventRecordTypeId,
                MotherId = input.MotherId,
                InfantId = input.InfantId//,
                // LinkedVisitId = input.LinkedVisitId
            };
        }

        private void ArchiveMother(string motherId)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<Mother>(userContext: applicationUserId);
            Mother mother = repository.GetById(Guid.Parse(motherId));
            mother.IsActive = false;
            repository.Update(mother);
        }

        private void ArchiveInfant(string infantId)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<Infant>(userContext: applicationUserId);
            Infant infant = repository.GetById(Guid.Parse(infantId));
            infant.IsActive = false;
            repository.Update(infant);
        }

    }
}

