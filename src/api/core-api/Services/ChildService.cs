using DinkToPdf.Contracts;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using ECDLink.Security.Extensions;
using ECDLink.DataAccessLayer.Entities.Classroom;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services
{
    public class ChildService : Interfaces.IChildService
    {
        private IGenericRepository<Child, Guid> _childRepo;
        private IGenericRepository<ClassroomGroup, Guid> _classroomGroupRepo;

        public ChildService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine)
        {
            var applicationUserId = (contextAccessor.HttpContext != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetIntegrationUserId());

            _childRepo = repoFactory.CreateGenericRepository<Child>(userContext: applicationUserId);
            _classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: applicationUserId);
        }

        public List<Child> GetChildrenForClassroom(Guid classroomId)
        {
            var learnerUserIds = _classroomGroupRepo.GetAll()
                .Where(x => x.ClassroomId == classroomId)
                .SelectMany(x => x.Learners)
                .Select(x => x.UserId)
                .ToList();

            var children = _childRepo.GetAll()
                .Where(x => learnerUserIds.Contains(x.UserId) && x.User.IsActive && x.IsActive)
                .ToList();

            return children;
        }
    }
}
