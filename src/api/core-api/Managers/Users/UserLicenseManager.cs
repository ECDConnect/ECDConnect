using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users
{
    public class UserLicenseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private HierarchyEngine _hierarchyEngine;

        private IGenericRepository<LicenseType, Guid> _licenseTypeRepo;
        private IGenericRepository<License, Guid> _licenseRepo;


        public UserLicenseManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine
            )
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;

            _applicationUserId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetIntegrationUserId().Value);

            _licenseTypeRepo = _repoFactory.CreateGenericRepository<LicenseType>(userContext: _applicationUserId);
            _licenseRepo = _repoFactory.CreateGenericRepository<License>(userContext: _applicationUserId);
        }

        public List<License> GetLicensesForUser(Guid userId)
        {
            return _licenseRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).ToList();
        }

        public License GetLicenseForUserForType(Guid userId, string type)
        {
            return _licenseRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true && x.LicenseType.Name == type).FirstOrDefault();
        }

        public bool DelicenseUser(LicenseModel input)
        {
            List<License> license1 = _licenseRepo.GetAll().Where(x => x.UserId == Guid.Parse(input.UserId)).ToList();

            foreach (License license in license1)
            {
                license.IsActive = false;
                license.DelicensedDate = DateTime.Now;
                if (license.LicenseType.Name == Constants.SSSettings.ss_smart_space_licence)
                {
                    license.DelicensedComment = input.DelicensedComment;
                    license.CollectedSSPlaykit = input.CollectedSSPlaykit;
                    license.CollectedSSHandbook = input.CollectedSSHandbook;
                }

                _licenseRepo.Update(license);
            }
            return true;
        }

        public License AddSmartSpaceLicense(Guid userId, DateTime dateAwarded)
        {
            License userLicense = GetLicenseForUserForType(userId, Constants.SSSettings.ss_smart_space_licence);
            if (userLicense == null)
            {
                LicenseType licenseType = _licenseTypeRepo.GetAll().Where(x => x.Name == Constants.SSSettings.ss_smart_space_licence).FirstOrDefault();
                License input = new License() 
                { 
                    UserId = userId,
                    LicenseType = licenseType,
                    LicenseDate = dateAwarded,
                    InsertedDate = DateTime.UtcNow,
                    IsActive = true,
                    CollectedSSHandbook = false,
                    CollectedSSPlaykit = false,
                    DeclinedDate = null, //if previously declined, clear this detail
                    DeclinedCommentsSteps = null,
                };

                return _licenseRepo.Insert(input);
            }
            
            return null;
        }

        public License DeclineSmartSpaceLicense(Guid userId, DateTime dateDeclined, string NextStepsComments)
        {
            LicenseType licenseType = _licenseTypeRepo.GetAll().Where(x => x.Name == Constants.SSSettings.ss_smart_space_licence).FirstOrDefault();
            License userLicense = GetLicenseForUserForType(userId, Constants.SSSettings.ss_smart_space_licence);
            if (userLicense == null)
            {
                
                License input = new License()
                {
                    UserId = userId,
                    LicenseType = licenseType,
                    InsertedDate = DateTime.UtcNow,
                    IsActive = true,
                    CollectedSSHandbook = false,
                    CollectedSSPlaykit = false,
                    DeclinedDate = dateDeclined,
                    DeclinedCommentsSteps = NextStepsComments, 
                    LicenseDate = dateDeclined
                };

                return _licenseRepo.Insert(input);
            } else
            {
                userLicense.DeclinedDate = dateDeclined;
                userLicense.DeclinedCommentsSteps = NextStepsComments;
                userLicense.LicenseDate = dateDeclined;
                _licenseRepo.Update(userLicense);

                return userLicense;
            }            
        }

    }
}

