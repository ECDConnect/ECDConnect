using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

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
        private IGenericRepository<Trainee, Guid> _traineeRepo;


        public PersonnelService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : null;

            _practiGenericRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _practiRepo = _repoFactory.CreateRepository<Practitioner>(userContext: _applicationUserId);
            _classGroupRepo = _repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            _classRepo = _repoFactory.CreateGenericRepository<Classroom>(userContext: _applicationUserId);
            _addressRepo = _repoFactory.CreateGenericRepository<SiteAddress>(userContext: _applicationUserId);
            _programmeRepo = _repoFactory.CreateGenericRepository<ProgrammeType>(userContext: _applicationUserId);
            _childRepo = _repoFactory.CreateGenericRepository<Child>(userContext: _applicationUserId);
            _traineeRepo = _repoFactory.CreateRepository<Trainee>(userContext: _applicationUserId);
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

        public Practitioner SwitchPrincipal([Service] UserManager<ApplicationUser> userManager, string oldPrincipalUserId, string newPrincipalUserId)
        {
            var practitionerToPromote = _practiRepo.GetByUserId(newPrincipalUserId);
            var practitionerToDemote = _practiRepo.GetByUserId(oldPrincipalUserId);
            if (practitionerToPromote != null && practitionerToDemote != null)
            {
                practitionerToPromote.IsPrincipal = true;
                practitionerToPromote.ShareInfo = true;
                _practiRepo.Update(practitionerToPromote);

                practitionerToDemote.IsPrincipal = false;
                _practiRepo.Update(practitionerToDemote);

                //now list through all practitioners and remove the principalhierarchies and assign new
                List<Practitioner> allPrincipalPractitioners = _practiRepo.GetAll().Where(x => x.PrincipalHierarchy.Equals(oldPrincipalUserId)).ToList();
                if (allPrincipalPractitioners.Count > 0)
                {
                    foreach (var practi in allPrincipalPractitioners)
                    {
                        practi.PrincipalHierarchy = Guid.Parse(practitionerToPromote.UserId);                        
                        _practiRepo.Update(practi);
                    }
                }

                //Classrooms swap
                var classroom = _classRepo.GetByUserId(practitionerToDemote.UserId);
                if (classroom!=null)
                {
                    classroom.UserId = practitionerToPromote.UserId;
                    _classRepo.Update(classroom);
                }

                //now add user to principal
                var userToPromote = userManager.FindByIdAsync(newPrincipalUserId).Result;
                userManager.RemoveFromRoleAsync(userToPromote, Roles.PRACTITIONER);
                userManager.AddToRoleAsync(userToPromote, Roles.PRINCIPAL);

                var userToDemote = userManager.FindByIdAsync(oldPrincipalUserId).Result;
                userManager.RemoveFromRoleAsync(userToDemote, Roles.PRINCIPAL);
                userManager.AddToRoleAsync(userToDemote, Roles.PRACTITIONER);

            }
            return practitionerToPromote;
        }

        public Practitioner PromotePractitionerToPrincipal(
         [Service] UserManager<ApplicationUser> userManager,
         string userId)
        {
            var practitionerToPromote = _practiRepo.GetByUserId(userId);            
            if (practitionerToPromote!=null)
            {
                practitionerToPromote.IsPrincipal = true;
                practitionerToPromote.ShareInfo = true;
                _practiRepo.Update(practitionerToPromote);

                //now add user to principal
                var user = userManager.FindByIdAsync(userId).Result;
                userManager.RemoveFromRoleAsync(user, Roles.PRACTITIONER);
                userManager.AddToRoleAsync(user, Roles.PRINCIPAL);
            }
            return practitionerToPromote;
        }

        public Practitioner DemotePractitionerAsPrincipal([Service] UserManager<ApplicationUser> userManager,
             string userId)
        {
            var practitionerToDemote = _practiRepo.GetByUserId(userId);
            if (practitionerToDemote != null)
            {
                practitionerToDemote.IsPrincipal = false;
                _practiRepo.Update(practitionerToDemote);

                //now list through all practitioners and remove the principalhierarchies
                List<Practitioner> allPrincipalPractitioners = _practiRepo.GetAll().Where(x => x.PrincipalHierarchy.Equals(userId)).ToList();
                if (allPrincipalPractitioners.Count > 0)
                {
                    foreach (var practi in allPrincipalPractitioners)
                    {
                        practi.PrincipalHierarchy = null;
                        practi.ShareInfo = false;
                        _practiRepo.Update(practi);
                    }
                }

                //now add user back to practitioner
                var user = userManager.FindByIdAsync(userId).Result;
                userManager.RemoveFromRoleAsync(user, Roles.PRINCIPAL);
                userManager.AddToRoleAsync(user, Roles.PRACTITIONER);
            }

            return practitionerToDemote;
        }

        public Principal MapPractitionerToPrincipal(Practitioner practitioner)
        {
            Principal userToMap = new Principal()
            {
                Id = practitioner.Id,
                IsActive = practitioner.IsActive,
                InsertedDate = practitioner.InsertedDate,
                UpdatedBy = practitioner.UpdatedBy,
                UpdatedDate = practitioner.UpdatedDate,
                Hierarchy = practitioner.Hierarchy,
                AttendanceRegisterLink = practitioner.AttendanceRegisterLink,
                MaxChildren = practitioner.MaxChildren,
                ConsentForPhoto = practitioner.ConsentForPhoto,
                ParentFees = practitioner?.ParentFees,
                LanguageUsedInGroups = practitioner?.LanguageUsedInGroups,
                StartDate = practitioner.StartDate,
                MonthSinceFranchisee = practitioner?.MonthSinceFranchisee,
                UserId = practitioner.UserId,
                SiteAddressId = practitioner?.SiteAddressId,
                IsPrincipal = true,
                CoachHierarchy = practitioner?.CoachHierarchy,
                IsFundaAppAdmin = practitioner?.IsFundaAppAdmin,
                IsTrainee = practitioner?.IsTrainee,
                SigningSignature = practitioner?.SigningSignature,
                ShareInfo = practitioner?.ShareInfo,
                IsRegistered = practitioner.IsRegistered,
            };

            return userToMap;
        }

        public Trainee GetTraineeByUserId(
            [Service] UserLicenseManager userLicenseManager,
            string userId)
        {
            Trainee trainee = _traineeRepo.GetByUserId(userId);
            if (trainee != null)
            {
                trainee.Practitioner = _practiRepo.GetByUserId(userId);
                //trainee.Licenses = userLicenseManager.GetLicensesForUser(userId);

                return trainee;
            }

            return null;
        }

        #endregion        


        private string GetUserIdOrGenerateNew(string userId)
        {
            return userId ?? Guid.NewGuid().ToString();
        }

    }
}

