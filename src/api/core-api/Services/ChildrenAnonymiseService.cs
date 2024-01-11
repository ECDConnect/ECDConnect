using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using ECDLink.Abstractrions.Constants;

namespace EcdLink.Api.CoreApi.Services
{
    public class ChildrenAnonymiseService : IChildrenAnonymiseService
    {
        private readonly IDocumentManagementService _documentManagementService;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly UserManager<ApplicationUser> _userManager;
        private ILogger<ChildrenAnonymiseService> _logger;
        private readonly AuthenticationDbContext _context;
        private readonly NotificationService _notificationService;

        public ChildrenAnonymiseService(
            IGenericRepositoryFactory repositoryFactory,
            IDocumentManagementService documentManagementService,
            HierarchyEngine hierarchyEngine,
            [Service] UserManager<ApplicationUser> userManager,
            ILogger<ChildrenAnonymiseService> logger,
            [Service] NotificationService notificationService,
            [Service] AuthenticationDbContext context)
        {
            _documentManagementService = documentManagementService;
            _hierarchyEngine = hierarchyEngine;
            _userManager = userManager;
            _logger = logger;
            _context = context;
            _notificationService = notificationService;
        }

        public void AnonymiseChild()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();

            var children = GetChildrenToRemove();
            foreach (var child in children)
            {
                try
                {
                    var learner = _context.Learners.Where(x => x.UserId == child.UserId).ToList();
                    if (learner.Any())
                    {
                        foreach (var learnerRow in learner)
                        {
                            _context.Remove(learnerRow);
                        }
                    }
                    _hierarchyEngine.DeleteHierarchy(child.UserId);
                    var parentUserId = _hierarchyEngine.GetUserParentUserId(child.UserId);
                    _notificationService.ExpireNotificationsTypesForUser(parentUserId, TemplateTypeConstants.ChildRegistrationIncomplete, child.User.FirstName + " " + child.User.Surname); //remove prac notifications for this specific child
                    var documents = _context.Documents.Where(x => x.UserId == child.UserId).ToList();
                    if (documents.Any())
                    {
                        foreach (var docRow in documents)
                        { _context.Remove(docRow); }
                    }
                    var jobNotification = _context.JobNotifications.Where(x => x.UserId == child.UserId).ToList();
                    if (jobNotification.Any())
                    {
                        foreach(var jobNotificationRow in jobNotification)
                        { _context.Remove(jobNotificationRow);}
                    }

                    _context.Remove(child);
                    _context.SaveChanges();
                    
                    var result = _userManager.DeleteAsync(child.User).Result; _notificationService.ExpireNotificationsTypesForUser(parentUserId, TemplateTypeConstants.ChildRegistrationIncomplete);
                    if (result.Succeeded)
                    {
                        _logger.LogInformation("AnonymiseChild Succeeded for child Id: {0} and UserId {1}", child.Id, child.UserId);
                    }
                    
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "AnonymiseChild Failed for child Id: {0} on {1}", child.Id, ex.Message);
                }
            }
        }

        private List<Child> GetChildrenToRemove()
        {
            var expiryTime = DateTime.UtcNow.AddDays(-30);

            // Remove child where caregiver has not yet completed all data and they were inserted within the last 30 days
            return _context.Children.Where(c => c.IsActive && c.CaregiverId.Equals(null)
                                   && c.InsertedDate <= expiryTime).Include(c => c.User).ToList();

        }


    }
}
