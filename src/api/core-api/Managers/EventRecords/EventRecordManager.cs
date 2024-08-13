using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.EventRecords;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
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
        private HierarchyEngine _hierarchyEngine;
        private readonly INotificationService _notificationService;

        private IGenericRepository<EventRecordType, Guid> _eventRecordTypeRepo;
        private IGenericRepository<EventRecord, Guid> _eventRecordRepo;
        private IGenericRepository<Mother, Guid> _motherRepo;

        private Guid _applicationUserId;

        public EventRecordManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            InfantManager infantManager,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _infantManger = infantManager;
            _notificationService = notificationService;
            _hierarchyEngine = hierarchyEngine;

            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);

            _eventRecordTypeRepo = _repoFactory.CreateGenericRepository<EventRecordType>(userContext: _applicationUserId);
            _eventRecordRepo = _repoFactory.CreateGenericRepository<EventRecord>(userContext: _applicationUserId);
            _motherRepo = _repoFactory.CreateGenericRepository<Mother>(userContext: _applicationUserId);
        }

        //
        //  EVENT RECORD TYPE FUNCTIONS
        //

        public EventRecordType AddEventRecordType(EventRecordTypeModel input)
        {
            return _eventRecordTypeRepo.Insert(new EventRecordType()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToString(),
                Name = input.Name,
                NormalizedName = input.NormalizedName,
                Description = input.Description,
                ParentId = new Guid(input.ParentId),
                Type = input.Type
            });
        }

        public EventRecordType UpdateEventRecordType(string id, EventRecordTypeModel input)
        {
            var entityToUpdate = _eventRecordTypeRepo.GetById(Guid.Parse(id));

            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId.ToString();
            entityToUpdate.Name = input.Name;
            entityToUpdate.NormalizedName = input.NormalizedName;
            entityToUpdate.Description = input.Description;
            entityToUpdate.ParentId = new Guid(input.ParentId);
            entityToUpdate.Type = input.Type;

            return _eventRecordTypeRepo.Update(entityToUpdate);
        }

        //
        //  EVENT RECORD FUNCTIONS
        //

        public EventRecord AddEventRecord(EventRecordModel input)
        {
            var eventRecord = GetEventRecordFromInputModel(input);
            var eventRec = _eventRecordTypeRepo.GetById(Guid.Parse(input.EventRecordTypeId.ToString()));

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

            return _eventRecordRepo.Insert(eventRecord);
        }

        public EventRecord UpdateEventRecord(string id, EventRecordModel input)
        {
            var entityToUpdate = _eventRecordRepo.GetById(Guid.Parse(id));

            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId.ToString();
            entityToUpdate.Notes = input.Notes;
            entityToUpdate.MotherId = input.MotherId;
            entityToUpdate.InfantId = input.InfantId;

            if (entityToUpdate != null && entityToUpdate.InfantId != null)
            {
                ArchiveInfant(entityToUpdate.InfantId.ToString());
            }
            if (entityToUpdate != null && entityToUpdate.MotherId != null)
            {
                ArchiveMother(entityToUpdate.MotherId.ToString());
            }

            return _eventRecordRepo.Update(entityToUpdate);
        }

        public EventRecord UpdateEventRecordStatusById(Guid eventRecordId, bool isActive)
        {
            var entityToUpdate = _eventRecordRepo.GetById(eventRecordId);
            entityToUpdate.IsActive = isActive;
            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId.ToString();
            return _eventRecordRepo.Update(entityToUpdate);
        }

        private EventRecord GetEventRecordFromInputModel(EventRecordModel input)
        {
            if (input == null)
            {
                return null;
            }

            if (input.InfantId != null)
            {
                var infantId = _infantManger.GetInfantIdByUserId(input.InfantId.Value);

                if (infantId != null)
                {
                    input.InfantId = infantId;
                }
            }
            if (input.MotherId != null)
            {
                Mother mother = _motherRepo.GetAll().Where(x => x.UserId == input.MotherId).OrderBy(x => x.Id).FirstOrDefault();
                input.MotherId = mother?.Id;
            }

            return new EventRecord()
            {
                Id = Guid.NewGuid(),
                IsActive = (bool)(input.status != null ? input.status : true),
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToString(),
                Notes = input.Notes,
                EventRecordTypeId = (Guid)input.EventRecordTypeId,
                MotherId = input.MotherId,
                InfantId = input.InfantId
            };
        }

        private void ArchiveMother(string motherId)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<Mother>(userContext: applicationUserId);
            Mother mother = repository.GetById(Guid.Parse(motherId));
            mother.IsActive = false;
            repository.Update(mother);

            _notificationService.DeleteGroupNotifications(TemplateTypeConstants.DuplicateMotherAdded, mother.Id);
        }

        private void ArchiveInfant(string infantId)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<Infant>(userContext: applicationUserId);
            Infant infant = repository.GetById(Guid.Parse(infantId));
            infant.IsActive = false;
            repository.Update(infant);

            _notificationService.DeleteGroupNotifications(TemplateTypeConstants.DuplicateChildAdded, infant.Id);
        }
    }
}

