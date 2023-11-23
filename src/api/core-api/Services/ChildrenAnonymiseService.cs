using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.DataAccessLayer.Services;
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
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly IDocumentManagementService _documentManagementService;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly UserManager<ApplicationUser> _userManager;
        private ILogger<ChildrenAnonymiseService> _logger;

        public ChildrenAnonymiseService(
            IGenericRepositoryFactory repositoryFactory,
            IDocumentManagementService documentManagementService,
            HierarchyEngine hierarchyEngine,
            [Service] UserManager<ApplicationUser> userManager,
            ILogger<ChildrenAnonymiseService> logger)
        {
            _repositoryFactory = repositoryFactory;
            _documentManagementService = documentManagementService;
            _hierarchyEngine = hierarchyEngine;
            _userManager = userManager;
            _logger = logger;
        }

        public void AnonymiseChild()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();

            var childRepo = _repositoryFactory.CreateRepository<Child>(userContext: adminId);
            var learnerRepo = _repositoryFactory.CreateRepository<Learner>(userContext: adminId);

            var children = GetChildrenToRemove(childRepo);
            foreach (var child in children)
            {
                try
                {
                    RemoveChildDocuments(child, adminId);
                    var learner = learnerRepo.GetAll().Where(x => x.UserId == child.UserId).ToList();
                    if (learner.Any())
                    {
                        foreach (var learnerRow in learner)
                        {
                            learnerRepo.Delete(learnerRow.Id);
                        }
                    }
                    _hierarchyEngine.DeleteHierarchy(child.UserId);
                    childRepo.Delete(child.Id);
                    var result = _userManager.DeleteAsync(child.User).Result;
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

        private List<Child> GetChildrenToRemove(IGenericRepository<Child, Guid> childRepo)
        {
            var expiryTime = DateTime.UtcNow.AddDays(-30);

            // Remove child where caregiver has not yet completed all data
            // and they were inserted within the last 30 days
            return childRepo.GetAll()
                        .Where(c => c.IsActive && c.CaregiverId.Equals(null)
                                    && c.InsertedDate <= expiryTime).Include(c => c.User).ToList();
        }


    }
}
