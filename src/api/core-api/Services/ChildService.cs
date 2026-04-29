using EcdLink.Api.CoreApi.GraphApi.Models.Input;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly ApplicationUserManager _userManager;
        private ILogger<ChildService> _logger;

        public ChildService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            ILogger<ChildService> logger,
            [Service] ApplicationUserManager userManager,
            [Service] AuthenticationDbContext dbContext,
            [Service] IPointsEngineService pointsService)
        {
            _applicationUserId = (contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId());
            
            _childRepo = repoFactory.CreateRepository<Child>(userContext: _applicationUserId);
            _classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            _learnerRepo = repoFactory.CreateGenericRepository<Learner>(userContext: _applicationUserId);
            _hierarchyEngine = hierarchyEngine;
            _userManager = userManager;
            _pointsService = pointsService;
            _dbContext = dbContext;
            _logger = logger;
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

        public async Task UpdateChildAsync(UpdateChildAndCaregiverInput input)
        {
            var tenantId = TenantExecutionContext.Tenant.Id;
            bool isNew = false;

            Child child = await _childRepo.GetByIdAsync(input.Id);

            if (child == null)
            {
                isNew = true;
                child = new Child
                {
                    Id = input.Id,
                    TenantId = tenantId,
                    IsActive = input.IsActive
                };
            }

            // ────────────────────────────────────────────────
            // 1. Handle ApplicationUser (child's own identity)
            // ────────────────────────────────────────────────
            ApplicationUser childUser;

            if (isNew)
            {
                childUser = new ApplicationUser
                {
                    Id = input.User.Id,
                    UserName = $"External_Edit_{input.User.Id}", 
                    FirstName = input.User?.FirstName,
                    Surname = input.User?.Surname,
                    DateOfBirth = input.User.DateOfBirth,
                    GenderId = input.User?.GenderId,
                    IsSouthAfricanCitizen = input.User.IsSouthAfricanCitizen,
                    IdNumber = input.User?.IdNumber,
                    VerifiedByHomeAffairs = input.User.VerifiedByHomeAffairs,
                    RaceId = input.User?.RaceId,
                    ContactPreference = input.User?.ContactPreference,
                    TenantId = tenantId,
                    IsActive = input.IsActive
                };

                var createResult = await _userManager.CreateAsync(childUser);

                if (!createResult.Succeeded)
                {
                    throw new Exception($"Failed to create child user: {string.Join(", ", createResult.Errors.Select(e => e.Description))}");
                }

                await _userManager.AddToRoleAsync(childUser, "Child");

                child.User = childUser;
                child.UserId = childUser.Id;
            }
            else
            {
                // Existing child → user should already exist
                childUser = child.User;
                if (childUser == null)
                {
                    throw new InvalidOperationException($"Existing child {child.Id} has no associated ApplicationUser");
                }

                // Update existing user fields
                if (input.User != null)
                {
                    childUser.FirstName               = input.User.FirstName               ?? childUser.FirstName;
                    childUser.Surname                 = input.User.Surname                 ?? childUser.Surname;
                    childUser.GenderId                = input.User.GenderId                ?? childUser.GenderId;
                    childUser.IsSouthAfricanCitizen   = input.User.IsSouthAfricanCitizen;
                    childUser.IdNumber                = input.User.IdNumber                ?? childUser.IdNumber;
                    childUser.VerifiedByHomeAffairs   = input.User.VerifiedByHomeAffairs;
                    childUser.RaceId                  = input.User.RaceId                  ?? childUser.RaceId;
                    childUser.ContactPreference       = input.User.ContactPreference       ?? childUser.ContactPreference;

                    if (input.User.DateOfBirth != null) childUser.DateOfBirth             = input.User.DateOfBirth; 
                }
            }

            // Common user/child active status logic
            bool finalIsActive = isNew ? input.IsActive : (child.IsActive && childUser.IsActive && input.IsActive);
            child.IsActive = finalIsActive;
            childUser.IsActive = finalIsActive;

            // ────────────────────────────────────────────────
            // 2. Update core child fields
            // ────────────────────────────────────────────────
            child.Allergies             = input.Allergies;
            child.Disabilities          = input.Disabilities;
            child.OtherHealthConditions = input.OtherHealthConditions;
            child.WorkflowStatusId      = input.WorkflowStatusId;
            child.OtherLanguages        = input.OtherLanguages;

            if (input.ReasonForLeavingId != null)     child.ReasonForLeavingId   = input.ReasonForLeavingId;
            if (input.InactiveDate != null)           child.InactiveDate         = input.InactiveDate;
            if (input.InactiveReason != null)         child.InactiveReason       = input.InactiveReason;
            if (input.InactivityComments != null)     child.InactivityComments   = input.InactivityComments;

            // ────────────────────────────────────────────────
            // 3. Caregiver (optional)
            // ────────────────────────────────────────────────
            if (input.Caregiver != null)
            {
                if (child.Caregiver == null)
                {
                    child.Caregiver = new Caregiver
                    {
                        TenantId = tenantId
                    };
                }

                var cg = child.Caregiver;

                cg.IdNumber                     = input.Caregiver.IdNumber;
                cg.FirstName                    = input.Caregiver.FirstName;
                cg.Surname                      = input.Caregiver.Surname;
                cg.IsActive                     = finalIsActive;
                cg.PhoneNumber                  = input.Caregiver.PhoneNumber;
                cg.RelationId                   = input.Caregiver.RelationId;
                cg.EducationId                  = input.Caregiver.EducationId;
                cg.JoinReferencePanel           = input.Caregiver.JoinReferencePanel;
                cg.Contribution                 = input.Caregiver.Contribution;
                cg.IsAllowedCustody             = input.Caregiver.IsAllowedCustody;
                cg.EmergencyContactFirstName    = input.Caregiver.EmergencyContactFirstName;
                cg.EmergencyContactSurname      = input.Caregiver.EmergencyContactSurname;
                cg.EmergencyContactPhoneNumber  = input.Caregiver.EmergencyContactPhoneNumber;
                cg.AdditionalFirstName          = input.Caregiver.AdditionalFirstName;
                cg.AdditionalSurname            = input.Caregiver.AdditionalSurname;
                cg.AdditionalPhoneNumber        = input.Caregiver.AdditionalPhoneNumber;

                // Site address
                if (input.Caregiver.SiteAddress != null)
                {
                    if (cg.SiteAddress == null)
                    {
                        cg.SiteAddress = new SiteAddress()
                        {
                            TenantId = tenantId
                        };
                    }
                    cg.SiteAddress.AddressLine1 = input.Caregiver.SiteAddress.AddressLine1;
                    cg.SiteAddress.AddressLine2 = input.Caregiver.SiteAddress.AddressLine2;
                    cg.SiteAddress.AddressLine3 = input.Caregiver.SiteAddress.AddressLine3;
                    cg.SiteAddress.Name         = input.Caregiver.SiteAddress.Name;
                    cg.SiteAddress.Ward         = input.Caregiver.SiteAddress.Ward;
                    cg.SiteAddress.PostalCode   = input.Caregiver.SiteAddress.PostalCode;
                    cg.SiteAddress.ProvinceId   = input.Caregiver.SiteAddress.ProvinceId;
                }
            }

            // ────────────────────────────────────────────────
            // 4. Persist
            // ────────────────────────────────────────────────
            if (isNew)
            {
                _childRepo.Insert(child);
            }
            else
            {
                _childRepo.Update(child);
            }

            // ────────────────────────────────────────────────
            // 5. Related updates (languages, grants, learner records, points)
            // ────────────────────────────────────────────────
            if (input.Caregiver?.GrantIds?.Any() == true)
            {
                UpdateCaregiverGrants(child.UserId.Value, input.Caregiver.GrantIds, tenantId);
            }

            if (input.HomeLanguageIds?.Any() == true)
            {
                UpdateChildLanguages(child.UserId.Value, input.HomeLanguageIds, tenantId);
            }

            if (!finalIsActive)
            {
                var learnerRecords = _learnerRepo.GetListByUserId(child.UserId.Value);
                foreach (var learner in learnerRecords.Where(l => l.IsActive))
                {
                    learner.IsActive = false;
                    learner.StoppedAttendance = DateTime.UtcNow;  // consider UTC
                    _learnerRepo.Update(learner);
                }

                if (learnerRecords.Any())
                {
                    _pointsService.CalculateChildRemovedFromPreschool((Guid)_applicationUserId);
                }
            }

            if (finalIsActive && child.WorkflowStatusId == Constants.WorkflowStatus.ActiveId)
            {
                _pointsService.CalculateChildRegistrationComplete((Guid)_applicationUserId);
            }

        }

        // public async Task UpdateChildAsync(UpdateChildAndCaregiverInput input)
        // {
            
        //     bool isNew = false;
         
        //     Child child = _childRepo.GetById(input.Id);
          
        //     if (child == null)
        //     {
        //         child = new Child();
        //         isNew = true;
        //         child.Id = input.Id;
        //     }
        //     var tenantId = TenantExecutionContext.Tenant.Id;
        //     var isActive = isNew ? input.IsActive : (child.IsActive && child.User.IsActive && input.IsActive);

        //     IdentityResult userCreatedResult = null;
        //     // lets create the user first
        //     if (isNew)
        //     {
        //         var childUser = new ApplicationUser();
        //         childUser.Id = input.User.Id;
        //         childUser.UserName = $"External_Edit_{input.User.Id}";
        //         childUser.TenantId = tenantId;
        //         userCreatedResult = await _userManager.CreateAsync(childUser);
        //     }

        //     // Update child fields
        //     child.IsActive = isActive;
        //     child.Allergies = input.Allergies;
        //     child.Disabilities = input.Disabilities;
        //     child.OtherHealthConditions = input.OtherHealthConditions;
        //     child.WorkflowStatusId = input.WorkflowStatusId;
        //     child.OtherLanguages = input.OtherLanguages;

        //     if (input.ReasonForLeavingId != null) child.ReasonForLeavingId = input.ReasonForLeavingId;
        //     if (input.InactiveDate != null) child.InactiveDate = input.InactiveDate;
        //     if (input.InactiveReason != null) child.InactiveReason = input.InactiveReason;
        //     if (input.InactivityComments != null) child.InactivityComments = input.InactivityComments;
        //     // Update child user fields
        //     if (input.User != null)
        //     {
        //         // if (isNew)
        //         // {
        //         //     child.User = new ApplicationUser();
        //         //     child.User.Id = input.User.Id;
        //         //     child.User.UserName = $"External_Edit_{input.User.Id}";
        //         //     child.User.TenantId = tenantId;
        //         // }
        //         if (input.User.FirstName != null) child.User.FirstName = input.User.FirstName;
        //         if (input.User.Surname != null) child.User.Surname = input.User.Surname;
        //         if (input.User.DateOfBirth != null) child.User.DateOfBirth = input.User.DateOfBirth;
        //         if (input.User.GenderId != null) child.User.GenderId = input.User.GenderId;
        //         child.User.IsActive = isActive;
        //         child.User.IsSouthAfricanCitizen = input.User.IsSouthAfricanCitizen;
        //         child.User.IdNumber = input.User.IdNumber;
        //         child.User.VerifiedByHomeAffairs = input.User.VerifiedByHomeAffairs;
        //         child.User.RaceId = input.User.RaceId;
        //         child.User.ContactPreference = input.User.ContactPreference;
        //         child.UserId = child.User.Id;
        //     }
        //     // Update caregiver fields
        //     if (input.Caregiver != null)
        //     {
        //         // Caregiver could be null if this is called from child registration
        //         if (child.Caregiver == null)
        //         {
        //             child.Caregiver = new Caregiver();
        //         }
        //         child.Caregiver.IdNumber = input.Caregiver.IdNumber;
        //         child.Caregiver.FirstName = input.Caregiver.FirstName;
        //         child.Caregiver.Surname = input.Caregiver.Surname;
        //         child.Caregiver.IsActive = isActive;
        //         child.Caregiver.PhoneNumber = input.Caregiver.PhoneNumber;
        //         child.Caregiver.RelationId = input.Caregiver.RelationId;
        //         child.Caregiver.EducationId = input.Caregiver.EducationId;
        //         child.Caregiver.JoinReferencePanel = input.Caregiver.JoinReferencePanel;
        //         child.Caregiver.Contribution = input.Caregiver.Contribution;
        //         child.Caregiver.IsAllowedCustody = input.Caregiver.IsAllowedCustody;
        //         child.Caregiver.EmergencyContactFirstName = input.Caregiver.EmergencyContactFirstName;
        //         child.Caregiver.EmergencyContactSurname = input.Caregiver.EmergencyContactSurname;
        //         child.Caregiver.EmergencyContactPhoneNumber = input.Caregiver.EmergencyContactPhoneNumber;
        //         child.Caregiver.AdditionalFirstName = input.Caregiver.AdditionalFirstName;
        //         child.Caregiver.AdditionalSurname = input.Caregiver.AdditionalSurname;
        //         child.Caregiver.AdditionalPhoneNumber = input.Caregiver.AdditionalPhoneNumber;
        //         child.Caregiver.TenantId = tenantId;
                
        //         if (input.Caregiver.SiteAddress != null)
        //         {
        //             if (child.Caregiver.SiteAddress == null)
        //             {
        //                 child.Caregiver.SiteAddress = new SiteAddress();
        //             }
        //             child.Caregiver.SiteAddress.AddressLine1 = input.Caregiver.SiteAddress.AddressLine1;
        //             child.Caregiver.SiteAddress.AddressLine2 = input.Caregiver.SiteAddress.AddressLine2;
        //             child.Caregiver.SiteAddress.AddressLine3 = input.Caregiver.SiteAddress.AddressLine3;
        //             child.Caregiver.SiteAddress.Name = input.Caregiver.SiteAddress.Name;
        //             child.Caregiver.SiteAddress.Ward = input.Caregiver.SiteAddress.Ward;
        //             child.Caregiver.SiteAddress.PostalCode = input.Caregiver.SiteAddress.PostalCode;
        //             child.Caregiver.SiteAddress.ProvinceId = input.Caregiver.SiteAddress.ProvinceId;
        //         }
        //     }

        //     if (isNew)
        //     {
        //         _childRepo.Insert(child);
        //         _userManager.AddToRoleAsync(child.User, "Child");
        //     }
        //     else
        //     {
        //         _childRepo.Update(child);
        //     }
        //     // Add new grants
        //     if (input.Caregiver != null && input.Caregiver.GrantIds != null)
        //     {
        //         UpdateCaregiverGrants(child.UserId.Value, input.Caregiver.GrantIds, tenantId);
        //     }
        //     // Add home languages
        //     if (input.HomeLanguageIds != null && input.HomeLanguageIds.Any())
        //     {
        //         UpdateChildLanguages(child.UserId.Value, input.HomeLanguageIds, tenantId);
        //     }
        //     // If child is deactivated, ensure all learner records are also disabled
        //     if (!isActive)
        //     {
        //         var learnerRecords = _learnerRepo.GetListByUserId(child.UserId.Value);
        //         if (learnerRecords != null)
        //         {
        //             foreach (var learner in learnerRecords)
        //             {
        //                 if (learner.IsActive)
        //                 {
        //                     learner.IsActive = false;
        //                     learner.StoppedAttendance = DateTime.Now;
        //                     _learnerRepo.Update(learner);
        //                 }
        //             }
        //             _pointsService.CalculateChildRemovedFromPreschool((Guid)_applicationUserId);
        //         }
        //     }
        //     // Calculate points for practitioner
        //     if (isActive && child.WorkflowStatusId == Constants.WorkflowStatus.ActiveId)
        //     {
        //         _pointsService.CalculateChildRegistrationComplete((Guid)_applicationUserId);
        //     }
        // }

        public void RemoveChild(UpdateChildAndCaregiverInput input)
        {
            var child = _childRepo.GetById(input.Id);

            if (child != null)
            {
                try
                {
                    var learner = _dbContext.Learners.Where(x => x.UserId == child.UserId).ToList();
                    if (learner.Any())
                    {
                        foreach (var learnerRow in learner)
                        {
                            _dbContext.Remove(learnerRow);
                        }
                    }
                    _hierarchyEngine.DeleteHierarchy(child.UserId);
                    var documents = _dbContext.Documents.Where(x => x.UserId == child.UserId).ToList();
                    if (documents.Any())
                    {
                        foreach (var docRow in documents)
                        { _dbContext.Remove(docRow); }
                    }

                    _dbContext.Remove(child);
                    _dbContext.SaveChanges();

                    var appUser = _userManager.FindByIdAsync(child.UserId.ToString()).Result;

                    var result = _userManager.DeleteAsync(appUser).Result;
                    if (result.Succeeded)
                    {
                        _logger.LogInformation("RemoveChild Succeeded for child Id: {0} and UserId {1}", child.Id, child.UserId);
                    }

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "RemoveChild Failed for child Id: {0} on {1}", child.Id, ex.Message);
                }
            }
        }

        public void UpdateCaregiverGrants(Guid childUserId, List<Guid> grantIds, Guid tenantId)
        {
            if (grantIds == null || !grantIds.Any())
            {
                return;
            }

            var grantsToAdd = grantIds.Select(x => new UserGrant
            {
                Id = Guid.NewGuid(),
                GrantId = x,
                UserId = childUserId,
                TenantId = tenantId
            });

            var existingGrants = _dbContext.UserGrants
                .Where(x => x.UserId == childUserId);

            //remove
            _dbContext.UserGrants.RemoveRange(existingGrants);
            //reinsert
            _dbContext.UserGrants.AddRange(grantsToAdd);
            _dbContext.SaveChanges();
        }
        
        public void UpdateChildLanguages(Guid childUserId, List<Guid> homeLanguageIds, Guid tenantId)
        {
            if (homeLanguageIds == null || !homeLanguageIds.Any())
            {
                return;
            }

            var languagesToAdd = homeLanguageIds.Select(x => new UserLanguage
            {
                Id = Guid.NewGuid(),
                LanguageId = x,
                UserId = childUserId,
                TenantId = tenantId
            });

            var existingLanguages = _dbContext.UserLanguages
                .Where(x => x.UserId == childUserId);

            //remove
            _dbContext.UserLanguages.RemoveRange(existingLanguages);
            //reinsert
            _dbContext.UserLanguages.AddRange(languagesToAdd);
            _dbContext.SaveChanges();
        }
    }
}
