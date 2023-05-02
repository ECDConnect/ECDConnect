using System;
using System.Collections.Concurrent;
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

namespace EcdLink.Api.CoreApi.Managers.Users.SmartStart
{
    public class PersonnelService
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

        public PersonnelService(
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
        public List<Practitioner> GetPractitionerPeers(string practitionerId)
        {
            List<Practitioner> peers = new List<Practitioner>();
            Practitioner practitioner = _practiGenericRepo.GetByUserId(practitionerId.ToString());
            if (practitioner != null)
            {
                if (practitioner.PrincipalHierarchy.HasValue || (practitioner.IsPrincipal == true || practitioner.IsFundaAppAdmin == true))
                {
                    peers = _practiGenericRepo.GetAll().Where(x => x.PrincipalHierarchy.HasValue ? x.PrincipalHierarchy.Equals(practitioner.PrincipalHierarchy) : x.IsPrincipal == true ? x.UserId.Equals(practitionerId) : x.UserId.Equals(practitionerId)).ToList();
                    //also add principal
                    if (practitioner.IsPrincipal == true || practitioner.IsFundaAppAdmin == true)
                    {
                        Practitioner practiPrincipal = _practiGenericRepo.GetByUserId(practitioner.UserId.ToString());
                        if (practiPrincipal != null && !peers.Contains(practiPrincipal))
                        {
                            peers.Add(practiPrincipal);
                        }
                        //now add principal's practitioners
                        List<Practitioner> practiList = _practiGenericRepo.GetAll().Where(x => string.Equals(x.PrincipalHierarchy.ToString(), practitioner.UserId)).ToList();
                        if (practiList != null)
                        {
                            foreach (Practitioner practi in practiList)
                            {
                                if (!peers.Contains(practi))
                                {
                                    peers.Add(practi);
                                }
                            }
                        }
                    }
                    if (practitioner.PrincipalHierarchy.HasValue)
                    {
                        List<Practitioner> practiList = _practiGenericRepo.GetAll().Where(x => string.Equals(x.PrincipalHierarchy.ToString(), practitioner.UserId)).ToList();
                        if (practiList != null)
                        {
                            foreach (Practitioner practi in practiList)
                            {
                                if (!peers.Contains(practi))
                                {
                                    peers.Add(practi);
                                }
                            }
                            //add principal
                            Practitioner practiPrincipal = _practiGenericRepo.GetByUserId(practitioner.PrincipalHierarchy.ToString());
                            if (practiPrincipal != null && !peers.Contains(practiPrincipal))
                            {
                                peers.Add(practiPrincipal);
                            }
                        }
                    }
                }
            }
            else
            {
                peers.Add(practitioner);
            }
            return peers;
        }

        public List<Child> GetAllChildrenForPractitioner(
        string practitionerId)
        {
            Practitioner practitioner = _practiGenericRepo.GetByUserId(practitionerId);
            if (practitioner != null && !string.IsNullOrEmpty(practitioner.Hierarchy))
            {
                var children = _childRepo.GetAll().Where(x => x.Hierarchy.StartsWith(practitioner.Hierarchy)).ToList();
                return children;
            }
            else return new List<Child>();
        }

        public List<ClassroomGroup> GetAllClassroomGroupsForPractitioner(string practitionerId)
        {            
            return _classGroupRepo.GetListByUserId(practitionerId.ToString());
        }

        public List<Classroom> GetAllClassroomsForPractitioner(string userIdOfPractitioner)
        {
            return _classRepo.GetListByUserId(userIdOfPractitioner);
        }

        public PrincipalClassroom GetClassroomDetailsForPractitioner(
    string userId)
        {                       
            PrincipalClassroom principalClassroom = new PrincipalClassroom();
            var practitioner = _practiGenericRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                var principal = ((bool)practitioner.IsPrincipal || (bool)practitioner.IsFundaAppAdmin ? practitioner : _practiGenericRepo.GetByUserId(practitioner.PrincipalHierarchy.ToString()));
                if (principal != null)
                {
                    principalClassroom.PrincipalName = string.IsNullOrWhiteSpace(principal.User.FullName) ? principal.User.FullName : principal.User.FullName;
                    ClassroomGroup classroomGroup = _classGroupRepo.GetByUserId(userId);
                    Classroom classroom = null;

                    if (classroomGroup != null)
                    {
                        classroom = _classRepo.GetById(classroomGroup.ClassroomId);
                        principalClassroom.ClassroomGroupName = classroomGroup.Name;
                        principalClassroom.ClassroomGroupId = classroomGroup.Id.ToString();
                        ProgrammeType ptype = _programmeRepo.GetAll().Where(p => p.Id.Equals(classroomGroup.ProgrammeTypeId)).FirstOrDefault();
                        principalClassroom.ProgrammeTypeName = ptype!=null ? ptype.Description : "";
                    }
                    else
                    {
                        //if no classroomgroup is available to look at, use the classroom for principal
                        classroom = _classRepo.GetByUserId(principal.UserId);
                    }
                    principalClassroom.Name = classroom.Name;
                    principalClassroom.Id = classroom.Id.ToString();
                    principalClassroom.InsertedDate = classroom.InsertedDate;
                    if (classroom.SiteAddressId != null)
                    {
                        SiteAddress classAddress = _addressRepo.GetById((Guid)classroom.SiteAddressId);
                        principalClassroom.ClassSiteAddress = classAddress.Name + " " + classAddress.AddressLine1 + " " + classAddress.AddressLine2 + " " + classAddress.AddressLine3 + " " + (classAddress.Province != null ? classAddress.Province.Description : string.Empty) + " " + classAddress.PostalCode;
                    }
                }
            }
            return principalClassroom;
        }

        public List<Practitioner> GetAllPractitionersForPrincipal(string userId)
        {            
            List<Practitioner> practitioners = _practiRepo.GetAll().Where(x => x.PrincipalHierarchy.Equals(userId)).ToList();

            return practitioners;
        }

        public string GetSiteNameForPractitioner(string userId)
        {
            string siteName = "N/A";
            var classroomgroup = _classGroupRepo.GetAll().Where(x => x.UserId.ToString() == userId).OrderBy(x => x.Id).FirstOrDefault();
            if (classroomgroup != null) //principals and practitioners are assigned to classroom groups
            {
                siteName = _classRepo.GetAll().Where(x => x.Id.Equals(classroomgroup.ClassroomId)).OrderBy(x => x.Id).Select(x => x.Name).FirstOrDefault();
            }
            else //only principals/FAA are assigned to classrooms only
            {
                siteName = _classRepo.GetAll().Where(x => x.UserId.ToString() == userId).OrderBy(x => x.Id).Select(y => y.Name).FirstOrDefault();
            }

            return siteName;
        }


        #endregion        


        private string GetUserIdOrGenerateNew(string userId)
        {
            return userId ?? Guid.NewGuid().ToString();
        }

    }
}

