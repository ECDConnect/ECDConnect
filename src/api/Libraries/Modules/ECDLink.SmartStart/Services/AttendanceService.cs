using System;
using System.Collections.Generic;
using System.Linq;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace ECDLink.SmartStart.Services
{
    public class AttendanceService
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private string _applicationUserId;
        private IGenericRepository<Practitioner, Guid> _practiGenericRepo;
        private IGenericRepository<Practitioner, Guid> _practiRepo;
        private IGenericRepository<ClassroomGroup, Guid> _classGroupRepo;
        private IGenericRepository<Classroom, Guid> _classRepo;
        private IGenericRepository<SiteAddress, Guid> _addressRepo;
        private IGenericRepository<ProgrammeType, Guid> _programmeRepo;
        private IGenericRepository<Child, Guid> _childRepo;

        public AttendanceService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;

            _practiGenericRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _practiRepo = _repoFactory.CreateRepository<Practitioner>(userContext: _applicationUserId);
            _classGroupRepo = _repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            _classRepo = _repoFactory.CreateGenericRepository<Classroom>(userContext: _applicationUserId);
            _addressRepo = _repoFactory.CreateGenericRepository<SiteAddress>(userContext: _applicationUserId);
            _programmeRepo = _repoFactory.CreateGenericRepository<ProgrammeType>(userContext: _applicationUserId);
            _childRepo = _repoFactory.CreateGenericRepository<Child>(userContext: _applicationUserId);
        }


        #region Practitioners
        //public Classroom GetUserClassroom(string userId, string classroomId = null)
        //{
        //    Classroom userClassroom = new Classroom();
        //    Practitioner practi = _practiGenericRepo.GetByUserId(userId);
        //    if (practi != null)
        //    {
                



        //    }

        //    var classroom = _dbContext.Classrooms
        //                        .Include(x => x.ClassroomGroups)
        //                        .ThenInclude(c => c.ClassProgrammes)
        //                        .FirstOrDefault(c => string.Equals(userId, c.UserId));// c.Id == classroomId &&

        //    if (classroom == default(Classroom))
        //    {
        //        //a practitioner may call here on a classroom that only the principal has access to, since practitioners are assigned to classroomgroups, and principals to classrooms.
        //        //So get the parent of the practitioner and if that matches the classroom id by their principal id to the classroom id, then allow the request


        //        if (practi != null && practi.PrincipalHierarchy.HasValue)
        //        {
        //            //now test the practitioners principal userid, if its theirs, then show results. If it still doesnt match, throw the error
        //            classroom = _dbContext.Classrooms
        //            .Include(x => x.ClassroomGroups)
        //            .ThenInclude(c => c.ClassProgrammes)
        //            .FirstOrDefault(c => c.UserId.Contains(practi.PrincipalHierarchy.ToString()));// c.Id == classroomId &&
        //        }

        //        if (classroom == default(Classroom))
        //        {

        //            throw new UnauthorizedAccessException("User and Principal does not have access to this classroom");
        //        }
        //    }

        //    return classroom;
        //}


        #endregion        


        private string GetUserIdOrGenerateNew(string userId)
        {
            return userId ?? Guid.NewGuid().ToString();
        }

    }
}

