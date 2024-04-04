using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;

namespace EcdLink.Api.CoreApi.Managers.Users
{
    public class UserLicenseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private HierarchyEngine _hierarchyEngine;
        private readonly INotificationService _notificationService;

        private IGenericRepository<LicenseType, Guid> _licenseTypeRepo;
        private IGenericRepository<License, Guid> _licenseRepo;
        private ApplicationUserManager _userManager;

        public UserLicenseManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            ApplicationUserManager userManager,
            HierarchyEngine hierarchyEngine
            )
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _notificationService = notificationService;
            _userManager = userManager;

            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);

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
                List<TagsReplacements> replacements = new List<TagsReplacements>();
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "DueDate",
                    ReplacementValue = DateTime.Now.AddDays(21).ToShortDateString(),
                });

                var userToSend =  _userManager.FindByIdAsync(userId.ToString()).Result;
                _notificationService.SendNotificationAsync(null, TemplateTypeConstants.TraineeSignAgreement, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(7));

            }

            return null;
        }

        public License UpdateSmartSpaceLicense(Guid userId, DateTime dateAwarded)
        {
            License userLicense = GetLicenseForUserForType(userId, Constants.SSSettings.ss_smart_space_licence);
            if (userLicense != null)
            {
                //license might have previously been declined but is now awarded
                if (userLicense.DeclinedDate != null && userLicense.DeclinedDate < dateAwarded)
                {
                    userLicense.DeclinedDate = null;
                    userLicense.DeclinedCommentsSteps = null;
                    userLicense.LicenseDate = dateAwarded;
                    userLicense.UpdatedDate = DateTime.UtcNow;
                    return _licenseRepo.Update(userLicense);
                }
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

