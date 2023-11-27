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

namespace EcdLink.Api.CoreApi.Services
{
    public class ChildrenAnonymiseService : IChildrenAnonymiseService
    {
        private readonly IDocumentManagementService _documentManagementService;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly UserManager<ApplicationUser> _userManager;
        private ILogger<ChildrenAnonymiseService> _logger;
        private readonly AuthenticationDbContext _context;

        public ChildrenAnonymiseService(
            IGenericRepositoryFactory repositoryFactory,
            IDocumentManagementService documentManagementService,
            HierarchyEngine hierarchyEngine,
            [Service] UserManager<ApplicationUser> userManager,
            ILogger<ChildrenAnonymiseService> logger,
            [Service] AuthenticationDbContext context)
        {
            _documentManagementService = documentManagementService;
            _hierarchyEngine = hierarchyEngine;
            _userManager = userManager;
            _logger = logger;
            _context = context;
        }

        public void AnonymiseChild()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();

            var children = GetChildrenToRemove();
            foreach (var child in children)
            {
                try
                {
                    RemoveChildDocuments(child, adminId);
                    var learner = _context.Learners.Where(x => x.UserId == child.UserId).ToList();
                    if (learner.Any())
                    {
                        foreach (var learnerRow in learner)
                        {
                            _context.Remove(learnerRow);
                        }
                    }
                    _hierarchyEngine.DeleteHierarchy(child.UserId);
                    _context.Remove(child);
                    _context.SaveChanges();
                    var result = _userManager.DeleteAsync(child.User).Result;
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

        private void RemoveChildDocuments(Child child, string accessUserId)
        {
            // Remove Document,photo,birth documents
            _documentManagementService.DeleteUserDocument(child.UserId, accessUserId, FileTypeEnum.ChildBirthCertificate);
            _documentManagementService.DeleteUserDocument(child.UserId, accessUserId, FileTypeEnum.ChildClinicCard);
            _documentManagementService.DeleteUserDocument(child.UserId, accessUserId, FileTypeEnum.ChildRegistrationForm);
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
