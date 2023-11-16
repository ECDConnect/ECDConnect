using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.DataAccessLayer.Services;
using HotChocolate;
using Microsoft.AspNetCore.Identity;
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
        private readonly ApplicationUserManager _userManager;

        public ChildrenAnonymiseService(
            IGenericRepositoryFactory repositoryFactory,
            IDocumentManagementService documentManagementService,
            HierarchyEngine hierarchyEngine,
            [Service] ApplicationUserManager userManager)
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
                    if (child.User != null)
                    {
                        //check that child record hasnt already been removed
                        if (childRepo.GetAll().Where(c => c.UserId == child.UserId).FirstOrDefault() != null)
                        {
                            childRepo.Delete(child.Id);
                        }
                        //remove learners from allocated classes
                        var learnerRow = learnerRepo.GetByUserId(child.UserId.ToString());
                        if (learnerRow != null)
                            learnerRepo.Delete(learnerRow.Id);

                        _hierarchyEngine.DeleteHierarchy(child.UserId);

                        RemoveChildDocuments(child, adminId?.ToString());

                        var result = _userManager.DeleteAsync(child.User).Result;
                    } else
                    {
                        //remove user - find it first
                        ApplicationUser childUser = _userManager.FindByIdAsync(child.UserId.ToString()).Result;
                        if (childUser != null)
                        {
                            var result = _userManager.DeleteAsync(childUser).Result;
                        }
                        //notify of problem child that cant delete
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
            // Remove Document
            // Remove photo
            // Remove bith documents
            _documentManagementService.DeleteUserDocument(accessUserId, FileTypeEnum.ChildBirthCertificate);
            _documentManagementService.DeleteUserDocument(accessUserId, FileTypeEnum.ChildClinicCard);
            _documentManagementService.DeleteUserDocument(accessUserId, FileTypeEnum.ChildRegistrationForm);
        }

        private List<Child> GetChildrenToRemove(IGenericRepository<Child, Guid> childRepo)
        {
            var expiryTime = DateTime.UtcNow.AddDays(-21);

            // Removed child where status is pending (not all required information saved)
            // and they were inserted within the last 21 days
            return childRepo.GetAll()
                        .Where(c => c.IsActive && c.CaregiverId == null
                                    && c.InsertedDate <= expiryTime).ToList();
        }


    }
}
