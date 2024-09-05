using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users.SmartStart
{
    public class ClassroomService : IClassroomService
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private Guid? _applicationUserId;
        private IGenericRepository<Practitioner, Guid> _practiGenericRepo;
        private IGenericRepository<ClassroomGroup, Guid> _classroomGroupRepo;
        private IGenericRepository<Classroom, Guid> _classroomRepo;
        private IGenericRepository<SiteAddress, Guid> _addressRepo;
        private IGenericRepository<ProgrammeType, Guid> _programmeRepo;

        public ClassroomService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser()?.Id;

            _practiGenericRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _classroomGroupRepo = _repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            _classroomRepo = _repoFactory.CreateGenericRepository<Classroom>(userContext: _applicationUserId);
            _addressRepo = _repoFactory.CreateGenericRepository<SiteAddress>(userContext: _applicationUserId);
            _programmeRepo = _repoFactory.CreateGenericRepository<ProgrammeType>(userContext: _applicationUserId);
        }

        public Classroom GetClassroomForUser(Guid userId)
        {
            var practitioner = _practiGenericRepo.GetByUserId(userId);
            if (practitioner == null)
            {
                throw new QueryException("Practitioner not found.");
            }

            if (TenantExecutionContext.Tenant.TenantType == ECDLink.Tenancy.Enums.TenantType.WhiteLabelTemplate
                && !practitioner.IsPrincipalOrAdmin()
                && practitioner.DateAccepted == null)
            {
                return null;
            }
          
            if (!practitioner.IsPrincipalOrAdmin() &&  (practitioner.PrincipalHierarchy == null || practitioner.Progress < 2))
            {
                return _classroomRepo.GetAll()
                    .Where(x =>
                        x.IsActive
                        && x.UserId.HasValue
                        && x.UserId.Value == practitioner.UserId)
                    .OrderByDescending(x => x.InsertedDate)
                    .FirstOrDefault();
            }

            var principalUserId = practitioner.IsPrincipalOrAdmin()
                ? practitioner.UserId
                : practitioner.PrincipalHierarchy;

            if (principalUserId == null)
            {
                 throw new QueryException("Principal not found.");
            }

            return _classroomRepo.GetAll()
            .Where(x =>
                x.IsActive
                && x.UserId.HasValue
                && x.UserId.Value == principalUserId.Value)
            .OrderByDescending(x => x.InsertedDate)
            .FirstOrDefault();
        }

        public List<ClassroomGroup> GetClassroomGroupsForUser(Guid userId)
        {
            var practitioner = _practiGenericRepo.GetByUserId(userId);

            if (practitioner == null)
            {
               throw new QueryException("Practitioner not found.");
            }

            // Principal can see all classroom groups for classroom (school)
            if (practitioner.IsPrincipalOrAdmin())
            {
                return _classroomGroupRepo.GetAll()
                    .Include(x => x.Learners
                        .Where(y => y.IsActive 
                            && (!y.StoppedAttendance.HasValue || y.StoppedAttendance > DateTime.Now)))
                    .Include(x => x.Classroom)
                    .Where(x =>
                        x.IsActive
                        && x.Classroom.IsActive
                        && x.Classroom.UserId.HasValue
                        && x.Classroom.UserId.Value == userId)
                    .ToList();
            }

            // Practitioner can only see classroom groups assigned to them directly
            return _classroomGroupRepo.GetAll()
                .Include(x => x.Learners
                    .Where(y => y.IsActive
                    && (!y.StoppedAttendance.HasValue || y.StoppedAttendance > DateTime.Now)))
                .Include(x => x.Classroom)
                .Where(x => 
                    x.IsActive 
                    && x.UserId.HasValue 
                    && x.UserId.Value == userId
                    && x.Classroom.IsActive)
                .ToList();
        }

        public List<PrincipalClassroomModel> GetPrincipalUserIdsForClassesWithoutPractitioners()
        {
            return _classroomGroupRepo.GetAll()
                    .Include(x => x.Classroom)
                    .Where(x =>
                        x.IsActive
                        && !x.UserId.HasValue
                        && x.Classroom.IsActive
                        && !x.Classroom.IsDummySchool.Value 
                        && x.Classroom.UserId.HasValue)
                    .Select(x => new PrincipalClassroomModel(x.Id, x.Name, x.Classroom.User))
                    .Distinct()
                    .ToList();
        }
    }
}

