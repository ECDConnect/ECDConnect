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

        public ChildrenAnonymiseService(
            IGenericRepositoryFactory repositoryFactory,
            IDocumentManagementService documentManagementService,
            HierarchyEngine hierarchyEngine,
            [Service] UserManager<ApplicationUser> userManager)
        {
            _repositoryFactory = repositoryFactory;
            _documentManagementService = documentManagementService;
            _hierarchyEngine = hierarchyEngine;
            _userManager = userManager;
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
                    if (!string.IsNullOrWhiteSpace(child.UserId) && child.User != null)
                    {
                        RemoveChildDocuments(child, adminId);

                        //remove learners from allocated classes
                        var learnerRow = learnerRepo.GetByUserId(child.UserId);
                        if (learnerRow != null)
                            learnerRepo.Delete(learnerRow.Id);

                        _hierarchyEngine.DeleteHierarchy(child.UserId);
                        if (childRepo.GetAll().Where(c => c.UserId.Equals(child.UserId)).FirstOrDefault() != null)
                        {
                            childRepo.Delete(child.Id);
                        }

                        var result = _userManager.DeleteAsync(child.User).Result;
                    }
                }
                catch (Exception e)
                {
                    //notify of error

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

            // Removed child where status is pending (not all required information saved)
            // and they were inserted within the last 21 days
            return childRepo.GetAll()
                        .Where(c => c.IsActive && c.CaregiverId.Equals(null)
                                    && c.InsertedDate <= expiryTime).Include(c => c.User).Include(c => c.User).ToList();
        }


    }
}
