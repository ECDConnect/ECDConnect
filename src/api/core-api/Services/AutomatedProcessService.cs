using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using Microsoft.AspNetCore.Identity;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services
{
    public class AutomatedProcessService : IAutomatedProcessService
    {
        private IGenericRepository<PractitionerRemovalHistory, Guid> _removalRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private string _adminUserId;
        private UserManager<ApplicationUser> _userManager;

        public AutomatedProcessService(
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            UserManager<ApplicationUser> userManager) 
        {
            _adminUserId = hierarchyEngine.GetAdminUserId()?.ToString();
            _removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: _adminUserId);
            _practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: _adminUserId);

            _userManager = userManager;
        }

        public void ProcessPractitionerRemovals()
        {
            var removals = _removalRepo.GetAll()
                .Where(x => x.IsActive && x.DateOfRemoval < DateTime.Now)
                .ToList();

            foreach (var removal in removals)
            {
                var practitioner = _practitionerRepo.GetByUserId(removal.UserId.ToString());
                var user = _userManager.FindByIdAsync(removal.UserId.ToString()).Result;

                if (practitioner != null && user != null)
                {
                    practitioner.CoachHierarchy = null;
                    practitioner.PrincipalHierarchy = null;
                    practitioner.DateToBeRemoved = DateTime.Now;
                    practitioner.IsLeaving = true;
                    practitioner.IsActive = false;
                    practitioner.UpdatedBy = _adminUserId;
                    practitioner.UpdatedDate = DateTime.Now;
                    _practitionerRepo.Update(practitioner);

                    user.IsActive = false;
                    user.LockoutEnabled = true;
                    user.LockoutEnd = DateTime.MaxValue;
                    var userResult = _userManager.UpdateAsync(user).Result;

                    removal.IsActive = false;
                    removal.UpdatedBy = _adminUserId;
                    _removalRepo.Update(removal);
                }
            }
        }
    }
}
