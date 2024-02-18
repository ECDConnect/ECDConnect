using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using ECDLink.Abstractrions.Constants;
using NPOI.POIFS.Properties;
using Org.BouncyCastle.Asn1.Ocsp;
using static ECDLink.Core.SystemSettings.SettingGroups;

namespace EcdLink.Api.CoreApi.Services
{
    public class UserAnonymiseService
    {
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly ApplicationUserManager _userManager;
        private ILogger<UserAnonymiseService> _logger;
        private readonly AuthenticationDbContext _context;
        private readonly INotificationService _notificationService;

        public UserAnonymiseService(
            IGenericRepositoryFactory repositoryFactory,
            IDocumentManagementService documentManagementService,
            HierarchyEngine hierarchyEngine,
            [Service] ApplicationUserManager userManager,
            ILogger<UserAnonymiseService> logger,
            [Service] INotificationService notificationService,
            [Service] AuthenticationDbContext context)
        {
            _hierarchyEngine = hierarchyEngine;
            _userManager = userManager;
            _logger = logger;
            _context = context;
            _notificationService = notificationService;
        }

        public void AnonymiseUser(Guid userId, string userType)
        {
            var adminId = _hierarchyEngine.GetAdminUserId();

            if (userId != null)
            {
                try
                {
                    
                    var parentUserId = _hierarchyEngine.GetUserParentUserId(userId);
                    
                    if (userType == "Trainee")
                    {
                        var pracToDelete = _context.Practitioners.Where(p => p.UserId.Equals(userId)).FirstOrDefault();
                        
                        var traineeToDelete = _context.Trainees.Where(c => c.UserId.ToString() == userId.ToString())
                            .Include(c => c.User)
                            .FirstOrDefault();

                        if (parentUserId!=null) //delete any messages to the parent user about this user
                            _notificationService.ExpireNotificationsTypesForUser(parentUserId.ToString(), TemplateTypeConstants.ChildRegistrationIncomplete, traineeToDelete.User.FirstName.Trim() + " " + traineeToDelete.User.Surname.Trim()); //remove parent related notifications for this specific user

                        if (traineeToDelete != null && traineeToDelete.User != null)
                        {
                            if (pracToDelete != null)
                            {
                                //remove practitioner
                                _context.Remove(pracToDelete);
                            }
                            var documents = _context.Documents.Where(x => x.UserId == userId).ToList();
                            if (documents.Any())
                            {
                                foreach (var docRow in documents)
                                { _context.Remove(docRow); }
                            }
                            var jobNotification = _context.JobNotifications.Where(x => x.UserId == userId).ToList();
                            if (jobNotification.Any())
                            {
                                foreach (var jobNotificationRow in jobNotification)
                                { _context.Remove(jobNotificationRow); }
                            }

                            //remove hierarchy
                            _hierarchyEngine.DeleteHierarchy(userId);
                            //remove trainee
                            _context.Remove(traineeToDelete);
                            _context.SaveChanges();
                            //remove user
                            var result = _userManager.DeleteAsync(traineeToDelete.User).Result;
                            if (result.Succeeded)
                            {
                                _logger.LogInformation("Trainee Removal Succeeded for Type: {0} and UserId {1}", userType, userId);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "AnonymiseUser Failed for trainee Id: {0} on {1}", userId, ex.Message);
                }
            }
        }

    }
}
