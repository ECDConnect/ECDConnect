using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.DataAccessLayer.Services;
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

        public ChildrenAnonymiseService(
            IGenericRepositoryFactory repositoryFactory,
            IDocumentManagementService documentManagementService,
            HierarchyEngine hierarchyEngine)
        {
            _repositoryFactory = repositoryFactory;
            _documentManagementService = documentManagementService;
            _hierarchyEngine = hierarchyEngine;
        }

        public void AnonymiseChild()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();

            var childRepo = _repositoryFactory.CreateRepository<Child>(userContext: adminId);
            var workflowRepo = _repositoryFactory.CreateRepository<WorkflowStatus>();
            var workflowStatus = workflowRepo.GetAll()
                                        .Where(x => x.EnumId == WorkflowStatusEnum.ChildDeactivated)
                                        .FirstOrDefault();


            foreach (var child in GetChildrenToRemove(childRepo))
            {
                ChildHelper.AnonymiseChild(child);

                child.WorkflowStatusId = workflowStatus?.Id ?? null;

                childRepo.Update(child);

                childRepo.Delete(child.Id);

                RemoveChildDocuments(child);
            }
        }

        private void RemoveChildDocuments(Child child)
        {
            // Remove Document
            // Remove photo
            // Remove bith documents
            _documentManagementService.DeleteUserDocument(child.UserId, FileTypeEnum.Child);
        }

        private List<Child> GetChildrenToRemove(IGenericRepository<Child, Guid> childRepo)
        {
            var expiryTime = DateTime.UtcNow.AddDays(-30);

            // Removed child where status is pending (not all required information saved)
            // and they were inserted within the last 30 days
            return childRepo.GetAll()
                        .Where(c => c.IsActive && c.WorkflowStatus.EnumId == WorkflowStatusEnum.ChildPending
                                    && c.InsertedDate <= expiryTime).ToList();
        }


    }
}
