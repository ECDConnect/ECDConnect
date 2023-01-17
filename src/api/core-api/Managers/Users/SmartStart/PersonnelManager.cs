using System;
using System.Collections.Generic;
using System.Linq;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;

namespace EcdLink.Api.CoreApi.Managers.Users.SmartStart
{
    public class PersonnelManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private string _applicationUserId;

        public PersonnelManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
        }


        #region Practitioners
        public List<Practitioner> GetPractitionerPeers(string practitionerId)
        {
            var practiRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);

            List<Practitioner> peers = new List<Practitioner>();

            Practitioner practitioner = practiRepo.GetByUserId(practitionerId.ToString());
            if (practitioner != null)
            {
                

                if (practitioner.PrincipalHierarchy.HasValue || practitioner.IsPrincipal == true)
                {
                    peers = practiRepo.GetAll().Where(x => x.PrincipalHierarchy.HasValue ? x.PrincipalHierarchy.Equals(practitioner.PrincipalHierarchy) : x.IsPrincipal == true ? x.UserId.Equals(practitionerId) : x.UserId.Equals(practitionerId)).ToList();
                    //also add principal
                    if (practitioner.IsPrincipal == true)
                    {
                        Practitioner practiPrincipal = practiRepo.GetByUserId(practitioner.UserId.ToString());
                        if (practiPrincipal != null && !peers.Contains(practiPrincipal))
                            peers.Add(practiPrincipal);
                    }
                    if (practitioner.PrincipalHierarchy.HasValue)
                    {
                        Practitioner practiPrincipal = practiRepo.GetByUserId(practitioner.PrincipalHierarchy.ToString());
                        if (practiPrincipal != null && !peers.Contains(practiPrincipal)) 
                            peers.Add(practiPrincipal);
                    }
                } else
                {
                    peers.Add(practitioner);
                }
            }
            return peers;
        }

        public List<Child> GetAllChildrenForPractitioner(
        string practitionerId)
        {
            var childRepo = _repoFactory.CreateRepository<Child>(userContext: _applicationUserId);

            var practiRepo = _repoFactory.CreateRepository<Practitioner>(userContext: _applicationUserId);
            Practitioner practitioner = practiRepo.GetByUserId(practitionerId);

            return childRepo.GetAll().Where(x => x.Hierarchy.StartsWith(practitioner.Hierarchy)).ToList();
        }

        public List<ClassroomGroup> GetAllClassroomGroupsForPractitioner(string practitionerId)
        {
            var classRepo = _repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            return classRepo.GetListByUserId(practitionerId.ToString());
        }

        public List<Classroom> GetAllClassroomsForPractitioner(string practitionerId)
        {
            var classRepo = _repoFactory.CreateGenericRepository<Classroom>(userContext: _applicationUserId);
            return classRepo.GetListByUserId(practitionerId);
        }

        public PrincipalClassroom GetClassroomDetailsForPractitioner(
    string userId)
        {
            var classroomGroupRepo = _repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            var classroomRepo = _repoFactory.CreateGenericRepository<Classroom>(userContext: _applicationUserId);
            var practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId); //BYPASS USERHIERARCHY TO SEE UP THE CHAIN
            PrincipalClassroom principalClassroom = new PrincipalClassroom();
            var practitioner = practitionerRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                var principal = practitionerRepo.GetByUserId(practitioner.PrincipalHierarchy.ToString());
                if (principal != null)
                {
                    principalClassroom.PrincipalName = string.IsNullOrWhiteSpace(principal.User.FullName) ? principal.User.FullName : principal.User.FullName;
                    ClassroomGroup classroomGroup = classroomGroupRepo.GetByUserId(userId);
                    Classroom classroom = null;

                    if (classroomGroup != null)
                    {
                        classroom = classroomRepo.GetById(classroomGroup.ClassroomId);
                        principalClassroom.ClassroomGroupName = classroomGroup.Name;
                        principalClassroom.ClassroomGroupId = classroomGroup.Id.ToString();
                    }
                    else
                    {
                        //if no classroomgroup is available to look at, use the classroom for principal
                        classroom = classroomRepo.GetByUserId(principal.UserId);
                    }
                    principalClassroom.ClassroomName = classroom.Name;
                    principalClassroom.ClassroomId = classroom.Id.ToString();
                    principalClassroom.InsertedDate = classroom.InsertedDate;
                }
            }
            return principalClassroom;
        }

        public List<Practitioner> GetAllPractitionersForPrincipal(string userId)
        {
            var principalRepo = _repoFactory.CreateRepository<Practitioner>(userContext: _applicationUserId);
            List<Practitioner> practitioners = principalRepo.GetAll().Where(x => x.PrincipalHierarchy.Equals(userId)).ToList();

            return practitioners;
        }

        #endregion


        private string GetUserIdOrGenerateNew(string userId)
        {
            return userId ?? Guid.NewGuid().ToString();
        }

    }
}

