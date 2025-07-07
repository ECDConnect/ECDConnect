using EcdLink.Api.CoreApi.GraphApi.Models.Visits;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Visits
{
    public class VisitDataStatusManager : BaseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private VisitManager _visitManager;
        private ApplicationUserManager _userManager;

        private INotificationService _notificationService;
        private HierarchyEngine _hierarchyEngine;

        private VisitType _additionalVisitType;
        private Guid _applicationUserId;
        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitData, Guid> _visitDataRepo;
        private IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;
        private IGenericRepository<VisitType, Guid> _visitTypeRepo;

        private string _visitId;

        public VisitDataStatusManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitManager visitManager,
            [Service] ApplicationUserManager userManager,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _visitManager = visitManager;
            _userManager = userManager;
            _notificationService = notificationService;
            _hierarchyEngine = hierarchyEngine;

            _applicationUserId = contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: _applicationUserId);
            _visitDataRepo = _repoFactory.CreateGenericRepository<VisitData>(userContext: _applicationUserId);
            _visitDataStatusRepo = _repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: _applicationUserId);
            _visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: _applicationUserId);
        }

        private Boolean AddAdditionalVisit(string clientId, string userType, string comment)
        {
            Visit visitRecord = _visitRepo.GetById(new Guid(_visitId));
            //Only add additional visits if the visit is not already an additional visit
            if (visitRecord != null && visitRecord.VisitType.Name != _additionalVisitType.Name)
            {
                // Only 1 additional visit per planned visit allowed
                Visit record = _visitRepo.GetAll().Where(x => x.LinkedVisitId == new Guid(_visitId) &&
                                                          x.VisitType.Name == _additionalVisitType.Name //&&
                                                        ).FirstOrDefault();
                if (record == null)
                {
                    DateTime nextVisitDate = (DateTime)_visitManager.GetClientsNextVisitDate(new Guid(clientId), userType);
                    if (nextVisitDate == default(DateTime))
                    {
                        nextVisitDate = DateTime.Now.Date;
                    }
                    DateTime nextVisitDueDate = (DateTime)_visitManager.GetClientsNextDueVisitDate(new Guid(clientId), userType);
                    if (nextVisitDueDate == default(DateTime))
                    {
                        nextVisitDueDate = DateTime.Now.Date;
                    }

                    VisitModel newVisit = new VisitModel();
                    newVisit.Attended = false;
                    newVisit.VisitType = _additionalVisitType;
                    newVisit.Comment = comment;
                    newVisit.LinkedVisitId = new Guid(_visitId);
                    newVisit.PlannedVisitDate = nextVisitDate;
                    newVisit.DueDate = nextVisitDueDate;
                    _visitManager.AddAdditionalVisit(newVisit);
                }
            }

            return true;
        }
        private Boolean AddVisitDataStatus(VisitData input, string comment, string color, string type, string section, Boolean isCompleted)
        {
            if (input != null)
            {
                var visitDataStatus = GetVisitDataStatusFromInputModel(input);
                visitDataStatus.Id = Guid.NewGuid();
                visitDataStatus.Comment = comment;
                visitDataStatus.Color = color;
                visitDataStatus.Type = type;
                visitDataStatus.Section = section;
                visitDataStatus.IsCompleted = isCompleted;
                InsertVisitDataStatus(visitDataStatus);
            }
            return true;
        }

        private Boolean InsertVisitDataStatus(VisitDataStatus input)
        {
            // Ensure we don't add duplicate records for a client
            if (!ValidateVisitDataStatusRecord(input))
            {
                _visitDataStatusRepo.Insert(input);
            }
            return true;
        }
        private Boolean ValidateVisitDataStatusRecord(VisitDataStatus input)
        {
            var visitStatusRecord = _visitDataStatusRepo.GetAll().Where(x => x.Comment == input.Comment && x.Type == input.Type && x.VisitDataId == input.VisitDataId).OrderBy(x => x.Id).FirstOrDefault();

            if (visitStatusRecord != null)
            {
                return true;
            }
            return false;
        }
        private VisitDataStatus GetVisitDataStatusFromInputModel(VisitData input)
        {
            if (input == null)
            {
                return null;
            }

            return new VisitDataStatus()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId.ToString(),
                VisitDataId = input.Id,
                Comment = "",
                Color = "",
                Type = "",
                Section = ""
            };
        }
        
    }
}
