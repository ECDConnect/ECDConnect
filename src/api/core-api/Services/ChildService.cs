using EcdLink.Api.CoreApi.GraphApi.Models.Input;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services
{
    public class ChildService : Interfaces.IChildService
    {
        private IGenericRepository<Child, Guid> _childRepo;
        private IGenericRepository<ClassroomGroup, Guid> _classroomGroupRepo;
        private IGenericRepository<Learner, Guid> _learnerRepo;
        private AuthenticationDbContext _dbContext;
        private readonly IPointsEngineService _pointsService;
        private Guid? _applicationUserId;

        public ChildService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            [Service] AuthenticationDbContext dbContext,
            [Service] IPointsEngineService pointsService)
        {
            _applicationUserId = (contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId());

            _childRepo = repoFactory.CreateGenericRepository<Child>(userContext: _applicationUserId);
            _classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            _learnerRepo = repoFactory.CreateGenericRepository<Learner>(userContext: _applicationUserId);

            _pointsService = pointsService;

            _dbContext = dbContext;
        }

        public List<Child> GetChildrenForClassroomGroup(Guid classroomGroupId)
        {
            var learnerUserIds = _learnerRepo.GetAll()
                .Where(x => x.IsActive && x.ClassroomGroupId == classroomGroupId && !x.StoppedAttendance.HasValue)
                .Select(x => x.UserId)
                .ToList();

            var children = _childRepo.GetAll()
                .Where(x => learnerUserIds.Contains(x.UserId) && x.IsActive)
                .Distinct()
                .ToList();

            return children;
        }

        public List<Child> GetChildrenForClassroom(Guid classroomId)
        {
            var learnerUserIds = _classroomGroupRepo.GetAll()
                .Where(x => x.IsActive && x.ClassroomId == classroomId)
                .SelectMany(x => x.Learners)
                .Where(x => x.IsActive)
                .Select(x => x.UserId)
                .ToList();

            var children = _childRepo.GetAll()
                .Where(x => learnerUserIds.Contains(x.UserId) && x.IsActive)
                .Distinct()
                .ToList();

            return children;
        }

        public void UpdateChild(UpdateChildAndCaregiverInput input)
        {
            var child = _childRepo.GetById(input.Id);
            var isActive = child.IsActive && child.User.IsActive && input.IsActive;

            // Update child fields
            child.IsActive = isActive;
            child.LanguageId = input.LanguageId;
            child.Allergies = input.Allergies;
            child.Disabilities = input.Disabilities;
            child.OtherHealthConditions = input.OtherHealthConditions;
            child.WorkflowStatusId = input.WorkflowStatusId;
            if (input.ReasonForLeavingId != null) child.ReasonForLeavingId = input.ReasonForLeavingId;
            if (input.InactiveDate != null) child.InactiveDate = input. InactiveDate;
            if (input.InactiveReason != null) child.InactiveReason = input.InactiveReason;
            if (input.InactivityComments != null) child.InactivityComments = input.InactivityComments;
            
            // Update child user fields
            if (input.User != null)
            {
                child.User.FirstName = input.User.FirstName;
                child.User.Surname = input.User.Surname;
                child.User.IsActive = isActive;
                child.User.IsSouthAfricanCitizen = input.User.IsSouthAfricanCitizen;
                child.User.IdNumber = input.User.IdNumber;
                child.User.VerifiedByHomeAffairs = input.User.VerifiedByHomeAffairs;
                child.User.DateOfBirth = input.User.DateOfBirth;
                child.User.GenderId = input.User.GenderId;
                child.User.RaceId = input.User.RaceId;
                child.User.ContactPreference = input.User.ContactPreference;
                child.User.ProfileImageUrl = input.User.profileImageUrl;
                // TODO - do we need to set updated date/by, do we need to check if we updated the user?
            }

            // Update caregiver fields
            if (input.Caregiver != null)
            {
                // Caregiver could be null if this is called from child registration
                if (child.Caregiver == null)
                {
                    child.Caregiver = new Caregiver();
                }

                child.Caregiver.IdNumber = input.Caregiver.IdNumber;
                child.Caregiver.FirstName = input.Caregiver.FirstName;
                child.Caregiver.Surname = input.Caregiver.Surname;
                child.Caregiver.IsActive = isActive;
                child.Caregiver.PhoneNumber = input.Caregiver.PhoneNumber;
                child.Caregiver.RelationId = input.Caregiver.RelationId;
                child.Caregiver.EducationId = input.Caregiver.EducationId;
                child.Caregiver.JoinReferencePanel = input.Caregiver.JoinReferencePanel;
                child.Caregiver.Contribution = input.Caregiver.Contribution;
                child.Caregiver.IsAllowedCustody = input.Caregiver.IsAllowedCustody;
                child.Caregiver.EmergencyContactFirstName = input.Caregiver.EmergencyContactFirstName;
                child.Caregiver.EmergencyContactSurname = input.Caregiver.EmergencyContactSurname;
                child.Caregiver.EmergencyContactPhoneNumber = input.Caregiver.EmergencyContactPhoneNumber;
                child.Caregiver.AdditionalFirstName = input.Caregiver.AdditionalFirstName;
                child.Caregiver.AdditionalSurname = input.Caregiver.AdditionalSurname;
                child.Caregiver.AdditionalPhoneNumber = input.Caregiver.AdditionalPhoneNumber;
                // TODO - do we need to set updated date/by, do we need to check if we updated the caregiver?

                if (input.Caregiver.SiteAddress != null)
                {
                    if (child.Caregiver.SiteAddress == null)
                    {
                        child.Caregiver.SiteAddress = new SiteAddress();
                    }

                    child.Caregiver.SiteAddress.AddressLine1 = input.Caregiver.SiteAddress.AddressLine1;
                    child.Caregiver.SiteAddress.AddressLine2 = input.Caregiver.SiteAddress.AddressLine2;
                    child.Caregiver.SiteAddress.AddressLine3 = input.Caregiver.SiteAddress.AddressLine3;
                    child.Caregiver.SiteAddress.Name = input.Caregiver.SiteAddress.Name;
                    child.Caregiver.SiteAddress.Ward = input.Caregiver.SiteAddress.Ward;
                    child.Caregiver.SiteAddress.PostalCode = input.Caregiver.SiteAddress.PostalCode;
                    child.Caregiver.SiteAddress.ProvinceId = input.Caregiver.SiteAddress.ProvinceId;
                    // TODO - do we need to set updated date/by, do we need to check if we updated the caregiver?
                }
            }

            _childRepo.Update(child);

            // Add new grants
            if (input.Caregiver != null && input.Caregiver.GrantIds != null)
            {
                UpdateCaregiverGrants(child.UserId.Value, input.Caregiver.GrantIds);
            }

            // If child is deactivated, ensure all learner records are also disabled
            if (!isActive)
            {
                var learnerRecords = _learnerRepo.GetListByUserId(child.UserId.Value);
                if (learnerRecords != null)
                {
                    foreach (var learner in learnerRecords)
                    {
                        if (learner.IsActive)
                        {
                            learner.IsActive = false;
                            learner.StoppedAttendance = DateTime.Now;
                            _learnerRepo.Update(learner);

                        }
                    }
                    _pointsService.CalculateChildRemovedFromPreschool((Guid)_applicationUserId);
                }
            }

            // Calculate points for practitioner
            if (isActive && child.WorkflowStatusId == Constants.WorkflowStatus.ActiveId)
            {
                _pointsService.CalculateChildRegistrationComplete((Guid)_applicationUserId);
            }
        }

        public void UpdateCaregiverGrants(Guid childUserId, List<Guid> grantIds)
        {
            if (grantIds == null || !grantIds.Any())
            {
                return;
            }

            var grantsToAdd = grantIds.Select(x => new UserGrant
            {
                GrantId = x,
                UserId = childUserId,
            });

            var existingGrants = _dbContext.UserGrants
                .Where(x => x.UserId == childUserId);

            //remove
            _dbContext.UserGrants.RemoveRange(existingGrants);
            //reinsert
            _dbContext.UserGrants.AddRange(grantsToAdd);
            _dbContext.SaveChanges();
        }
    }
}
