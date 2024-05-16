using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.GraphApi.Mutations;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Calendar;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
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

            var principalUserId = practitioner.IsPrincipalOrAdmin()
                ? practitioner.UserId
                : practitioner.PrincipalHierarchy;

            if (principalUserId == null)
            {
                return null;
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

            // Principal can see all classroom groups for classroom (school)
            if (practitioner.IsPrincipalOrAdmin())
            {
                return _classroomGroupRepo.GetAll()
                    .Include(x => x.Learners
                        .Where(y => y.IsActive 
                            && (!y.StoppedAttendance.HasValue || y.StoppedAttendance > DateTime.Now)))
                    .Where(x =>
                        x.IsActive
                        && x.Classroom.IsActive
                        && x.Classroom.UserId.HasValue
                        && x.Classroom.UserId.Value == userId)
                    .ToList();
            }

            // Practitioner can only see classroom groups assigned to them directly
            return _classroomGroupRepo.GetAll()
                .Where(x => x.IsActive && x.UserId.HasValue && x.UserId.Value == userId)
                .ToList();
        }

        // TODO: This is used in a few places still (like attendance). It makes no sense though and needs to be removed/rewritten when we get there
        public PrincipalClassroom GetClassroomDetailsForPractitioner(string userId)
        {
            PrincipalClassroom principalClassroom = new PrincipalClassroom();
            var practitioner = _practiGenericRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                var principal = ((bool)practitioner.IsPrincipal || (bool)practitioner.IsFundaAppAdmin || practitioner.PrincipalHierarchy == null
                    ? practitioner
                    : _practiGenericRepo.GetByUserId(practitioner.PrincipalHierarchy.ToString()));

                if (principal != null)
                {
                    principalClassroom.PrincipalName = string.IsNullOrWhiteSpace(principal.User.FullName) ? principal.User.FullName : principal.User.FullName;
                    ClassroomGroup classroomGroup = _classroomGroupRepo.GetByUserId(userId);
                    Classroom classroom = null;

                    if (classroomGroup != null)
                    {
                        classroom = _classroomRepo.GetById(classroomGroup.ClassroomId);
                        principalClassroom.ClassroomGroupName = classroomGroup.Name;
                        principalClassroom.ClassroomGroupId = classroomGroup.Id.ToString();
                        ProgrammeType ptype = _programmeRepo.GetAll().Where(p => p.Id == classroomGroup.ProgrammeTypeId).FirstOrDefault();
                        principalClassroom.ProgrammeTypeName = ptype != null ? ptype.Description : "";
                        principalClassroom.ProgrammeTypeId = classroomGroup.ProgrammeTypeId.ToString();
                    }
                    else
                    {
                        //if no classroomgroup is available to look at, use the classroom for principal
                        classroom = _classroomRepo.GetByUserId(principal.UserId.ToString());
                    }
                    if (classroom != null)
                    {
                        principalClassroom.Name = classroom.Name;
                        principalClassroom.Id = classroom.Id.ToString();
                        principalClassroom.InsertedDate = classroom.InsertedDate;
                        principalClassroom.PreschoolFeeAmount = classroom.PreschoolFeeAmount;
                        principalClassroom.PreschoolFeeAmountLastUpdateDate = classroom.PreschoolFeeAmountLastUpdateDate;

                        if (classroom.SiteAddressId != null)
                        {
                            SiteAddress classAddress = _addressRepo.GetById((Guid)classroom.SiteAddressId);
                            principalClassroom.ClassSiteAddress = classAddress.Name + " " + classAddress.AddressLine1 + " " + classAddress.AddressLine2 + " " + classAddress.AddressLine3 + " " + (classAddress.Province != null ? classAddress.Province.Description : string.Empty) + " " + classAddress.PostalCode;
                            principalClassroom.ClassSiteAddressId = classAddress.Id.ToString();
                        }
                    }
                }
            }
            return principalClassroom;
        }

    }
}

