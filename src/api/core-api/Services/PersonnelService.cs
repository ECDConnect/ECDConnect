using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
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
        private IGenericRepository<LicenseType, Guid> _licenseTypeRepo;
        private IGenericRepository<License, Guid> _licenseRepo;

        private VisitDataManager _visitDataManager;
        private VisitManager _visitManager;

        public PersonnelService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            VisitDataManager visitDataManager,
            VisitManager visitManager)
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
            _licenseTypeRepo = _repoFactory.CreateGenericRepository<LicenseType>(userContext: _applicationUserId);
            _licenseRepo = _repoFactory.CreateGenericRepository<License>(userContext: _applicationUserId);

            _visitDataManager = visitDataManager;
            _visitManager = visitManager;
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

        public Practitioner GetPractitionerForChild([Service] HierarchyEngine hierarchyEngine, string childUserId)
        {
            if (childUserId != null)
            {
                var parentUserId = hierarchyEngine.GetUserParentUserId(childUserId);
                return _practiGenericRepo.GetByUserId(parentUserId);          
            }
            else return null;
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
            var practitionerToPromote = _practiGenericRepo.GetByUserId(newPrincipalUserId);
            var practitionerToDemote = _practiGenericRepo.GetByUserId(oldPrincipalUserId);
            if (practitionerToPromote != null && practitionerToDemote != null)
            {
                practitionerToPromote.IsPrincipal = true;
                practitionerToPromote.ShareInfo = true;
                practitionerToPromote.PrincipalHierarchy = null;
                practitionerToPromote.DateLinked = null;
                practitionerToPromote.DateAccepted = null;
                practitionerToPromote.DateAccepted = null;
                _practiGenericRepo.Update(practitionerToPromote);

                practitionerToDemote.IsPrincipal = false;
                practitionerToDemote.PrincipalHierarchy = Guid.Parse(practitionerToPromote.UserId);
                practitionerToDemote.ShareInfo = true;
                practitionerToDemote.DateLinked = DateTime.Now;
                practitionerToDemote.DateAccepted = DateTime.Now;
                practitionerToPromote.DateAccepted = DateTime.Now;
                _practiGenericRepo.Update(practitionerToDemote);

                //now list through all practitioners and remove the principalhierarchies and assign new
                List<Practitioner> allPrincipalPractitioners = _practiGenericRepo.GetAll().Where(x => x.PrincipalHierarchy.Equals(oldPrincipalUserId)).ToList();
                if (allPrincipalPractitioners.Count > 0)
                {
                    foreach (var practi in allPrincipalPractitioners)
                    {
                        practi.PrincipalHierarchy = Guid.Parse(practitionerToPromote.UserId);
                        _practiGenericRepo.Update(practi);
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

        public PractitionerTimeline GetPractitionerTimeline(string userId)
        {

            PractitionerTimeline timeLine = new PractitionerTimeline();
            DateTime today = DateTime.Today;

            // Starter license received
            var starterDate = (
                from license in _licenseRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true)
                join licenseType in _licenseTypeRepo.GetAll().Where(y => y.Name == Constants.SSSettings.ss_starter_licence) on license.LicenseTypeId equals licenseType.Id
                select license
            ).Select(x => x.LicenseDate).FirstOrDefault();
            if (starterDate != null)
            {
                timeLine.StarterLicenseStatus = Constants.SSSettings.starter_licence_received;
                timeLine.StarterLicenseDate = starterDate;
                timeLine.StarterLicenseColor = MetricsColorEnum.Success.ToString();
            }
            else
            {
                timeLine.StarterLicenseStatus = Constants.SSSettings.starter_licence_not_received;
                timeLine.StarterLicenseColor = MetricsColorEnum.Warning.ToString();
            }

            // SmartSpace license received
            var smartSpaceDate = (
                from license in _licenseRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true)
                join licenseType in _licenseTypeRepo.GetAll().Where(y => y.Name == Constants.SSSettings.ss_smart_space_licence) on license.LicenseTypeId equals licenseType.Id
                select license
            ).Select(x => x.LicenseDate).FirstOrDefault();

            if (smartSpaceDate != null)
            {
                timeLine.SmartSpaceLicenseStatus = Constants.SSSettings.smart_space_licence_received;
                timeLine.SmartSpaceLicenseDate = smartSpaceDate;
                timeLine.SmartSpaceLicenseColor = MetricsColorEnum.Success.ToString();
            }
            else
            {
                timeLine.SmartSpaceLicenseStatus = Constants.SSSettings.smart_space_licence_not_received;
                timeLine.SmartSpaceLicenseColor = MetricsColorEnum.Warning.ToString();
            }

            // TODO: meetings -> consolidation meetings + club meetings - waiting for development to be completed

            // TODO: first aid -> waiting for development to be completed

            // PQA visits
            List<Visit> visits = _visitManager.GetVisitsForClient(userId, Constants.SSSettings.client_practitioner);
            List<Visit> pre_pqa_visits = new List<Visit>();
            List<Visit> pqa_visits = new List<Visit>();
            List<Visit> support_visits = new List<Visit>();
            List<Visit> reaccreditation_visits = new List<Visit>();

            foreach (Visit visit in visits)
            {
                if (visit != null)
                {
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_1)
                    {
                        if (visit.PlannedVisitDate.Date > today.Date)
                        {
                            timeLine.PrePQAVisitDate1Status = Constants.SSSettings.first_site_visit;
                            timeLine.PrePQAVisitDate1Color = MetricsColorEnum.Success.ToString();
                            timeLine.PrePQAVisitDate1 = visit.PlannedVisitDate;
                        }
                        else
                        {
                            timeLine.PrePQAVisitDate1Status = Constants.SSSettings.first_site_visit;
                            timeLine.PrePQAVisitDate1Color = MetricsColorEnum.Warning.ToString();
                            timeLine.PrePQAVisitDate1 = visit.PlannedVisitDate;
                        }
                        pre_pqa_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_2)
                    {
                        if (visit.PlannedVisitDate.Date > today.Date)
                        {
                            timeLine.PrePQAVisitDate1Status = Constants.SSSettings.second_site_visit;
                            timeLine.PrePQAVisitDate1Color = MetricsColorEnum.Success.ToString();
                            timeLine.PrePQAVisitDate1 = visit.PlannedVisitDate;
                        }
                        else
                        {
                            timeLine.PrePQAVisitDate1Status = Constants.SSSettings.second_site_visit;
                            timeLine.PrePQAVisitDate1Color = MetricsColorEnum.Warning.ToString();
                            timeLine.PrePQAVisitDate1 = visit.PlannedVisitDate;
                        }
                        pre_pqa_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1)
                    {
                        PQARating pqaRating = _visitDataManager.GetPractitionerPQARating(userId, Constants.SSSettings.visitType_pqa_visit_1);
                        visit.OverallRatingColor = pqaRating.OverallRatingColor;
                        pqa_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_2)
                    {
                        PQARating pqaRating = _visitDataManager.GetPractitionerPQARating(userId, Constants.SSSettings.visitType_pqa_visit_2);
                        visit.OverallRatingColor = pqaRating.OverallRatingColor;
                        pqa_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_3)
                    {
                        PQARating rating = _visitDataManager.GetPractitionerPQARating(userId, Constants.SSSettings.visitType_pqa_visit_3);
                        visit.OverallRatingColor = rating.OverallRatingColor;
                        pqa_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up)
                    {
                        pqa_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_re_accreditation || visit.VisitType.Name == Constants.SSSettings.visitType_annual_re_accreditation)
                    {
                        PQARating rating = _visitDataManager.GetPractitionerReAccreditationRating(userId, Constants.SSSettings.visitType_re_accreditation);
                        visit.OverallRatingColor = rating.OverallRatingColor;
                        reaccreditation_visits.Add(visit);
                    }
                    if (visit.VisitType.Name == Constants.SSSettings.visitType_support || visit.VisitType.Name == Constants.SSSettings.visitType_call)
                    {
                        support_visits.Add(visit);
                    }
                }
            }

            timeLine.PrePQASiteVisits = pre_pqa_visits;
            timeLine.PQASiteVisits = pqa_visits;
            timeLine.SupportVisits = support_visits;
            timeLine.ReAccreditationVisits = reaccreditation_visits;

            return timeLine;
        }

        public bool DeActivatePractitioner(string userId, string leavingComment)
        {
            Practitioner practitioner = _practiGenericRepo.GetAll().Where(x => x.User.Id == userId).FirstOrDefault();

            if (practitioner != null)
            {
                practitioner.IsActive = false;
                practitioner.UpdatedBy = _applicationUserId;
                practitioner.UpdatedDate = DateTime.Now;
                practitioner.LeavingComment = leavingComment;
                _practiGenericRepo.Update(practitioner);

                return true;
            }
            return false;
        }

        #endregion

        #region Trainees

        public TraineeOnBoardTimeline GetOnBoardTraineeTimeline(string userId)
        {
            var timeline = new TraineeOnBoardTimeline();
            Trainee trainee = _traineeRepo.GetByUserId(userId);


            // DayOneStartUpTraining

            // StarterLicense
            var starterDate = (
                from license in _licenseRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true)
                join licenseType in _licenseTypeRepo.GetAll().Where(y => y.Name == Constants.SSSettings.ss_starter_licence) on license.LicenseTypeId equals licenseType.Id
                select license
            ).Select(x => x.LicenseDate).FirstOrDefault();
            if (starterDate != null)
            {
                timeline.StarterLicenseStatus = Constants.SSSettings.starter_licence_received;
                timeline.StarterLicenseDate = starterDate;
                timeline.StarterLicenseColor = MetricsColorEnum.Success.ToString();
            }

            // ConsolidationMeeting -> smartLink

            // SmartSpaceChecklist
            Visit visit = _visitManager.GetVisitForUserForType(trainee.Id.ToString(), Constants.SSSettings.client_trainee, Constants.SSSettings.visitType_smart_space_checklist);
            if (visit != null)
            {
                if (visit.Attended == true)
                {
                    timeline.SmartSpaceChecklistColor = MetricsColorEnum.Success.ToString();
                    timeline.SmartSpaceChecklistStatus = "SmartSpace Checklist done";
                    timeline.SmartSpaceChecklistDate = visit.UpdatedDate;
                }
            }

            // CommunitySupport

            // ThreeChildrenRegistered
            var allChildren = GetAllChildrenForPractitioner(trainee.Practitioner.Id.ToString());
            if (allChildren.Count >= 3)
            {
                timeline.ThreeChildrenRegisteredColor = MetricsColorEnum.Success.ToString();
                timeline.ThreeChildrenRegisteredStatus = "3 or more children registered";
                timeline.ThreeChildrenRegisteredDate = allChildren.OrderBy(x => x.InsertedDate).GetItemByIndex(0).InsertedDate;
            }

            // SSCoachVisit

            // SignFranchiseeAgreement

            // SignStartUpSupportAgreement

            return timeline;
        }

        #endregion


        private string GetUserIdOrGenerateNew(string userId)
        {
            return userId ?? Guid.NewGuid().ToString();
        }

    }
}

