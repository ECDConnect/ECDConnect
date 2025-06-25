using EcdLink.Api.CoreApi;
using EcdLink.Api.CoreApi.GraphApi.Models;
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
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static EcdLink.Api.CoreApi.Constants;

namespace ECDLink.Api.CoreApi.Services
{
    public class PersonnelService : IPersonnelService
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private Guid? _applicationUserId;
        private IGenericRepository<Practitioner, Guid> _practiGenericRepo;
        private IGenericRepository<Practitioner, Guid> _practiRepo;
        private IGenericRepository<ClassroomGroup, Guid> _classGroupRepo;
        private IGenericRepository<Classroom, Guid> _classRepo;
        private IGenericRepository<SiteAddress, Guid> _addressRepo;
        private IGenericRepository<Coach, Guid> _coachGenericRepo;
        private IGenericRepository<PQARating, Guid> _pqaRatingRepo;
        private AuthenticationDbContext _dbContext;
        private VisitDataManager _visitDataManager;
        private VisitManager _visitManager;
        private ApplicationUserManager _userManager;
        private HierarchyEngine _hierarchyEngine;
        private INotificationService _notificationService;
        private ILogger<UserMutationExtension> _logger;
        private IReassignmentService __reassignmentService;
        private IServiceProvider _services;
        private IAbsenteeService _absenteeService;

        public PersonnelService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            AuthenticationDbContext dbContext,
            VisitDataManager visitDataManager,
            VisitManager visitManager,
            [Service] INotificationService notificationService,
            [Service] IClassroomService classroomService,
            ApplicationUserManager userManager,
            [Service] HierarchyEngine hierarchyEngine,
            [Service] ILogger<UserMutationExtension> logger,
            IServiceProvider services,
            [Service] IAbsenteeService absenteeService)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _practiGenericRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _practiRepo = _repoFactory.CreateRepository<Practitioner>(userContext: _applicationUserId);
            _classGroupRepo = _repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            _classRepo = _repoFactory.CreateGenericRepository<Classroom>(userContext: _applicationUserId);
            _addressRepo = _repoFactory.CreateGenericRepository<SiteAddress>(userContext: _applicationUserId);
            _coachGenericRepo = _repoFactory.CreateGenericRepository<Coach>(userContext: _applicationUserId);
            _pqaRatingRepo = _repoFactory.CreateGenericRepository<PQARating>(userContext: _applicationUserId);
            _dbContext = dbContext;

            _visitDataManager = visitDataManager;
            _visitManager = visitManager;
            _userManager = userManager;
            _hierarchyEngine = hierarchyEngine;
            _notificationService = notificationService;
            _logger = logger;
            _services = services;
            _absenteeService = absenteeService;
        }

        private IReassignmentService _reassignmentService
        {
            get
            {
                if (__reassignmentService == null) __reassignmentService = (IReassignmentService)_services.GetService<IReassignmentService>();
                return __reassignmentService;
            }
        }


        #region Practitioners

        public List<PractitionerModel> GetAllPractitioners()
        {
            ApplicationUser currentUser = (ApplicationUser)_contextAccessor.HttpContext.GetUser();

            List<Practitioner> practitioners = new List<Practitioner>();

            if (currentUser.coachObjectData != null)
            {
                practitioners = _practiGenericRepo.GetAll().Where(x => x.IsActive == true && x.CoachHierarchy.HasValue && x.CoachHierarchy == currentUser.Id).OrderBy(x => x.User.FirstName).ToList();
            }
            else if (currentUser.principalObjectData != null && currentUser.principalObjectData.IsPrincipal.HasValue && currentUser.principalObjectData.IsPrincipal.Value)
            {
                practitioners = _practiGenericRepo.GetAll().Where(x => x.IsActive == true && x.PrincipalHierarchy.HasValue && x.PrincipalHierarchy.Value == currentUser.Id).OrderBy(x => x.User.FirstName).ToList();
            }

            List<PractitionerModel> practitionerList = new List<PractitionerModel>();

            foreach (var practitioner in practitioners)
            {
                practitionerList.Add(GetPractitionerDetails(practitioner));
            }

            return practitionerList;
        }

        public PractitionerModel GetPractitionerDetails(Practitioner practitioner)
        {
            var practitionerRecord = new PractitionerModel
            {
                Id = practitioner.Id,
                UserId = practitioner.UserId.Value,
                IsPrincipal = practitioner.IsPrincipal,
                IsRegistered = practitioner.IsRegistered,
                PrincipalHierarchy = practitioner.PrincipalHierarchy,
                AttendanceRegisterLink = practitioner.AttendanceRegisterLink,
                ConsentForPhoto = practitioner.ConsentForPhoto,
                ParentFees = practitioner.ParentFees,
                LanguageUsedInGroups = practitioner.LanguageUsedInGroups,
                SigningSignature = practitioner.SigningSignature,
                StartDate = practitioner.StartDate,
                ShareInfo = practitioner.ShareInfo,
                DateLinked = practitioner.DateLinked,
                DateAccepted = practitioner.DateAccepted,
                DateToBeRemoved = practitioner.DateToBeRemoved,
                IsLeaving = practitioner.IsLeaving,
                Progress = practitioner.Progress,
                IsCompletedBusinessWalkThrough = practitioner.IsCompletedBusinessWalkThrough,
                ProgrammeType = practitioner.ProgrammeType,
                CoachHierarchy = practitioner.CoachHierarchy,
                CoachName = practitioner.Coach != null ? practitioner.Coach.User.FullName : "",
                CoachProfilePic = practitioner.Coach != null ? practitioner.Coach.User.ProfileImageUrl : "",
                UsePhotoInReport = practitioner.UsePhotoInReport,
                Permissions = practitioner.User.UserPermissions.Select(x => new UserPermissionModel(x)).ToList(),
                ClickedCommunityTab = practitioner.ClickedCommunityTab,
                CommunitySectionViewDate = practitioner.CommunitySectionViewDate,
                ProgressWalkthroughComplete = practitioner.ProgressWalkthroughComplete
            };

            practitionerRecord.Absentees = _absenteeService.GetAbsenteeByUser(practitioner.UserId.ToString());

            ApplicationUser practitionerUser = _userManager.FindByIdAsync(practitioner.UserId).Result;
            if (practitionerUser != null) {
                 practitionerRecord.User = practitionerUser;
            }
            if (practitioner.SiteAddressId != null) {
                SiteAddress address = _addressRepo.GetById((Guid)practitioner.SiteAddressId);
                if (address != null) {
                    practitionerRecord.SiteAddress = address;
                }
            }
            return practitionerRecord;
        }

        public List<Practitioner> GetPractitionerPeers(string practitionerId)
        {
            List<Practitioner> peers = new List<Practitioner>();
            Practitioner practitioner = _practiGenericRepo.GetByUserId(practitionerId.ToString());
            if (practitioner != null)
            {
                if (practitioner.PrincipalHierarchy.HasValue || practitioner.IsPrincipal == true )
                {
                    peers = _practiGenericRepo.GetAll().Where(x => x.PrincipalHierarchy.HasValue ? x.PrincipalHierarchy == practitioner.PrincipalHierarchy : x.IsPrincipal == true ? x.UserId == Guid.Parse(practitionerId) : x.UserId == Guid.Parse(practitionerId)).ToList();
                    //also add principal
                    if (practitioner.IsPrincipal == true)
                    {
                        Practitioner practiPrincipal = _practiGenericRepo.GetByUserId(practitioner.UserId.ToString());
                        if (practiPrincipal != null && !peers.Contains(practiPrincipal))
                        {
                            peers.Add(practiPrincipal);
                        }
                        //now add principal's practitioners
                        List<Practitioner> practiList = _practiGenericRepo.GetAll().Where(x => x.PrincipalHierarchy == practitioner.UserId).ToList();
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
                        List<Practitioner> practiList = _practiGenericRepo.GetAll().Where(x => x.PrincipalHierarchy == practitioner.UserId).ToList();
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

        public Practitioner GetPractitionerForChild(string childUserId)
        {
            if (childUserId != null)
            {
                var parentUserId = _hierarchyEngine.GetUserParentUserId(Guid.Parse(childUserId));
                return _practiGenericRepo.GetByUserId(parentUserId.Value);          
            }
            else return null;
        }

        public List<Practitioner> GetAllPractitionersForPrincipal(string userId)
        {
            List<Practitioner> practitioners = _practiRepo.GetAll().Where(x => x.PrincipalHierarchy == Guid.Parse(userId)).ToList();

            return practitioners;
        }

        public string GetSiteNameForPractitioner(string userId)
        {
            string siteName = "N/A";
            var classroomgroup = _classGroupRepo.GetAll().Where(x => x.UserId.ToString() == userId).OrderBy(x => x.Id).FirstOrDefault();
            if (classroomgroup != null) //principals and practitioners are assigned to classroom groups
            {
                siteName = _classRepo.GetAll().Where(x => x.Id == classroomgroup.ClassroomId).OrderBy(x => x.Id).Select(x => x.Name).FirstOrDefault();
            }
            else //only principals/FAA are assigned to classrooms only
            {
                siteName = _classRepo.GetAll().Where(x => x.UserId.ToString() == userId).OrderBy(x => x.Id).Select(y => y.Name).FirstOrDefault();
            }

            return siteName;
        }

        public Practitioner SwitchPrincipal(string oldPrincipalUserId, string newPrincipalUserId)
        {
            var practitionerToPromote = _practiGenericRepo.GetByUserId(newPrincipalUserId);
            var practitionerToDemote = _practiGenericRepo.GetByUserId(oldPrincipalUserId);

            var isRolePrincipal = practitionerToDemote.IsPrincipal.HasValue && practitionerToDemote.IsPrincipal.Value;

            if (practitionerToPromote != null && practitionerToDemote != null)
            {
                if (isRolePrincipal) { practitionerToPromote.IsPrincipal = true; }

                practitionerToPromote.ShareInfo = true;
                practitionerToPromote.PrincipalHierarchy = null;
                practitionerToPromote.DateLinked = null;
                practitionerToPromote.DateAccepted = null;
                practitionerToPromote.DateAccepted = null;
                _practiGenericRepo.Update(practitionerToPromote);

                if (isRolePrincipal) { practitionerToDemote.IsPrincipal = false; }

                practitionerToDemote.PrincipalHierarchy = practitionerToPromote.UserId;
                practitionerToDemote.ShareInfo = true;
                practitionerToDemote.DateLinked = DateTime.Now;
                practitionerToDemote.DateAccepted = DateTime.Now;
                practitionerToDemote.DateAccepted = DateTime.Now;
                _practiGenericRepo.Update(practitionerToDemote);

                //Classrooms swap
                string classroomName = "";
                var classroom = _classRepo.GetByUserId(practitionerToDemote.UserId.Value);
                if (classroom != null)
                {
                    classroomName = classroom.Name;
                    classroom.UserId = practitionerToPromote.UserId;
                    _classRepo.Update(classroom);
                }

                //Swap the unsure class if there is one
                var unsureClassroomGroup = _classGroupRepo.GetListByUserId(practitionerToDemote.UserId.ToString()).Where(x => x.Name == "Unsure").FirstOrDefault();
                if(unsureClassroomGroup != null)
                {
                    _reassignmentService.AddReassignmentForPractitioner(practitionerToDemote.UserId.ToString(), practitionerToPromote.UserId.ToString(), "New principal/administrator", DateTime.Now, _applicationUserId.ToStringOrNull(), unsureClassroomGroup.Id.ToString(), true);
                }

                //now add user to principal
                var userToPromote = _userManager.FindByIdAsync(newPrincipalUserId).Result;
                IdentityResult result = null;
                _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [PersonnelService.SwitchPrincipal(1)]", Roles.PRACTITIONER, userToPromote.Id, _applicationUserId);
                result = _userManager.RemoveFromRoleAsync(userToPromote, Roles.PRACTITIONER).Result;
                if (isRolePrincipal) 
                {
                    _logger.LogInformation("Roles: Add {0} to user {1} by {2} [PersonnelService.SwitchPrincipal(1)]", Roles.PRINCIPAL, userToPromote.Id, _applicationUserId); 
                    result = _userManager.AddToRoleAsync(userToPromote, Roles.PRINCIPAL).Result; 
                }

                var userToDemote = _userManager.FindByIdAsync(oldPrincipalUserId).Result;
                if (isRolePrincipal) 
                {
                    _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [PersonnelService.SwitchPrincipal(2)]", Roles.PRINCIPAL, userToDemote.Id, _applicationUserId);
                    result = _userManager.RemoveFromRoleAsync(userToDemote, Roles.PRINCIPAL).Result; 
                }
                
                _logger.LogInformation("Roles: Add {0} to user {1} by {2} [PersonnelService.SwitchPrincipal(2)]", Roles.PRACTITIONER, userToDemote.Id, _applicationUserId);

                //send notification to new Principal/FAA
                List<TagsReplacements> principalreplacements = new List<TagsReplacements>
                {
                    new TagsReplacements()
                    {
                        FindValue = "ProgrammeName",
                        ReplacementValue = classroomName
                    }
                };

                _notificationService.SendNotificationAsync(null, TemplateTypeConstants.PromotedToPrincipalOrFAA, DateTime.Now.Date, userToPromote, "", MessageStatusConstants.Green, principalreplacements, DateTime.Now.AddDays(7), false, true);


                result = _userManager.AddToRoleAsync(userToDemote, Roles.PRACTITIONER).Result;
            }
            return practitionerToPromote;
        }

        public Practitioner PromotePractitionerToPrincipal(string userId, bool sendComm = false)
        {
            var practitionerToPromote = _practiRepo.GetByUserId(userId);            
            if (practitionerToPromote!=null)
            {
                practitionerToPromote.IsPrincipal = true;
                practitionerToPromote.ShareInfo = true;
                _practiGenericRepo.Update(practitionerToPromote);

                //now add user to principal
                var user = _userManager.FindByIdAsync(userId).Result;
                _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [PersonnelService.PromotePractitionerToPrincipal]", Roles.PRACTITIONER, user.Id, _applicationUserId);
                var remove = _userManager.RemoveFromRoleAsync(user, Roles.PRACTITIONER).Result;
                _logger.LogInformation("Roles: Add {0} to user {1} by {2} [PersonnelService.PromotePractitionerToPrincipal]", Roles.PRINCIPAL, user.Id, _applicationUserId);
                var add = _userManager.AddToRoleAsync(user, Roles.PRINCIPAL).Result;

                if (sendComm)
                {
                    var classroom = _classRepo.GetByUserId(practitionerToPromote.UserId.Value);
                    List<TagsReplacements> replacements = new List<TagsReplacements>
                    {
                        new TagsReplacements()
                        {
                            FindValue = "ProgrammeName",
                            ReplacementValue = classroom.Name
                        }
                    };
                    _notificationService.SendNotificationAsync(null, TemplateTypeConstants.PromotedToPrincipalOrFAA, DateTime.Now.Date, practitionerToPromote.User, null, MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(7), false, true);
                }

            }
            return practitionerToPromote;
        }

        public Practitioner DemotePractitionerAsPrincipal(string userId)
        {
            var practitionerToDemote = _practiRepo.GetByUserId(userId);
            if (practitionerToDemote != null)
            {
                practitionerToDemote.IsPrincipal = false;
                _practiRepo.Update(practitionerToDemote);

                //now list through all practitioners and remove the principalhierarchies
                List<Practitioner> allPrincipalPractitioners = _practiRepo.GetAll().Where(x => x.PrincipalHierarchy == Guid.Parse(userId)).ToList();
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
                var user = _userManager.FindByIdAsync(userId).Result;
                _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [PersonnelService.DemotePractitionerAsPrincipal]", Roles.PRINCIPAL, user.Id, _applicationUserId);
                _userManager.RemoveFromRoleAsync(user, Roles.PRINCIPAL);
                _logger.LogInformation("Roles: Add {0} to user {1} by {2} [PersonnelService.DemotePractitionerAsPrincipal]", Roles.PRACTITIONER, user.Id, _applicationUserId);
                _userManager.AddToRoleAsync(user, Roles.PRACTITIONER);
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
                ConsentForPhoto = practitioner.ConsentForPhoto,
                ParentFees = practitioner?.ParentFees,
                LanguageUsedInGroups = practitioner?.LanguageUsedInGroups,
                StartDate = practitioner.StartDate,
                UserId = practitioner.UserId,
                SiteAddressId = practitioner?.SiteAddressId,
                IsPrincipal = true,
                CoachHierarchy = practitioner?.CoachHierarchy,
                SigningSignature = practitioner?.SigningSignature,
                ShareInfo = practitioner?.ShareInfo,
                IsRegistered = practitioner.IsRegistered,
            };

            return userToMap;
        }

        public PractitionerTimeline GetPractitionerTimeline(string userId)
        {
            Practitioner practitioner = _practiGenericRepo.GetByUserId(userId);
            Coach coach = _coachGenericRepo.GetByUserId(practitioner.CoachHierarchy.ToString());
            PractitionerTimeline timeline = new PractitionerTimeline();
            DateTime today = DateTime.Today;

            // PQA Visits --------------------------
            List<Visit> allPqaVisits = _visitManager.GetPQAVisitsForPractitioner(userId);
            // Get rating for each visit for display in front-end
            var pqaRatings = _pqaRatingRepo.GetAll().Where(x => allPqaVisits.Select(y  => y.Id).Contains(x.VisitId)).ToList();            
            timeline.PQARatings = pqaRatings;

            // Re-accreditation --------------------------
            List<Visit> allAccreditationVisits = _visitManager.GetReAccreditationVisitsForPractitioner(userId);
            var accreditationRatings = _pqaRatingRepo.GetAll().Where(x => allAccreditationVisits.Select(y => y.Id).Contains(x.VisitId)).ToList();
            timeline.ReAccreditationRatings = accreditationRatings;

            // PQA visits
            List<Visit> visits = _visitManager.GetVisitsForClient(userId, Constants.SSSettings.client_practitioner);
            visits = visits.OrderBy(x => x.InsertedDate).ToList();

            var prePqaVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_1 || x.VisitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_2).ToList();
            var pqaVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1 || x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).ToList();
            var reaccreditationVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1 || x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up).ToList();
            var supportVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_support || x.VisitType.Name == Constants.SSSettings.visitType_call).ToList();
         //   var requestedCoachVisits = _visitManager.GetCoachVisits(coach.Id, practitioner.Id); 
            var selfAssessments = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_self_assessment).ToList();
            List<Visit> selfVisits = new List<Visit>();

            foreach (Visit visit in pqaVisits)
            {
                var visitData = _visitDataManager.GetVisitDataForVisitId(visit.Id.ToString());
                var pqaRating = pqaRatings.FirstOrDefault(x => x.VisitId == visit.Id) ?? new PQARating(); // New PQA rating is just temp, since the DB is missing entries for old PQAs
                visit.OverallRatingColor = pqaRating.OverallRatingColor;
                visit.HasAnswerData = visitData.Count > 0;
                visit.DelicenseQuestionAnswered = visitData.Any(x => x.Question == SSSettings.step16_q1 && x.QuestionAnswer == "true");
            }

            foreach (Visit visit in reaccreditationVisits)
            {
                var visitData = _visitDataManager.GetVisitDataForVisitId(visit.Id.ToString());
                var pqaRating = accreditationRatings.FirstOrDefault(x => x.VisitId == visit.Id) ?? new PQARating();
                visit.OverallRatingColor = pqaRating.OverallRatingColor;
                visit.HasAnswerData = visitData.Count > 0;
                visit.DelicenseQuestionAnswered = visitData.Any(x => x.Question == SSSettings.step16_q1 && x.QuestionAnswer == "true");
            }

            foreach (Visit visit in prePqaVisits)
            {
                if (visit.VisitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_1)
                {
                    if (visit.PlannedVisitDate.Date > today.Date)
                    {
                        timeline.PrePQAVisitDate1Status = Constants.SSSettings.first_site_visit;
                        timeline.PrePQAVisitDate1Color = MetricsColorEnum.Success.ToString();
                        timeline.PrePQAVisitDate1 = visit.PlannedVisitDate;
                    }
                    else
                    {
                        timeline.PrePQAVisitDate1Status = Constants.SSSettings.first_site_visit;
                        timeline.PrePQAVisitDate1Color = MetricsColorEnum.Warning.ToString();
                        timeline.PrePQAVisitDate1 = visit.PlannedVisitDate;
                    }
                }
                    
                if (visit.VisitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_2)
                {
                    if (visit.PlannedVisitDate.Date > today.Date)
                    {
                        timeline.PrePQAVisitDate2Status = Constants.SSSettings.second_site_visit;
                        timeline.PrePQAVisitDate2Color = MetricsColorEnum.Success.ToString();
                        timeline.PrePQAVisitDate2 = visit.PlannedVisitDate;
                    }
                    else
                    {
                        timeline.PrePQAVisitDate2Status = Constants.SSSettings.second_site_visit;
                        timeline.PrePQAVisitDate2Color = MetricsColorEnum.Warning.ToString();
                        timeline.PrePQAVisitDate2 = visit.PlannedVisitDate;
                    }
                }
            }

            // do not return any pqa visits if the pre pqa visits are not done.
            // first pqa visit is created when SmartSpace licence is received + 3 months
            var prePqaVisitsCompleted = prePqaVisits.Where(x => x.Attended == false).FirstOrDefault();
            if (prePqaVisitsCompleted != null)
            {
                pqaVisits = new List<Visit>();
                reaccreditationVisits = new List<Visit>();
            }

            // Self Assessment
            if (selfAssessments.Count > 0)
            {
                // Only include a self assessment if the linked visit is not completed
                foreach (var item in selfAssessments)
                {
                    Visit linkedVisit = visits.Where(x => x.Id == item.LinkedVisitId).FirstOrDefault();
                    if (linkedVisit != null && linkedVisit.Attended == false)
                    {
                        selfVisits.Add(item);
                    }
                }

                if (selfVisits.Count > 0)
                {
                    Visit selfVisit = selfVisits.OrderBy(x => x.PlannedVisitDate).FirstOrDefault();

                    timeline.SelfAssessmentStatus = Constants.SSSettings.self_assessment;
                    timeline.SelfAssessmentColor = MetricsColorEnum.Success.ToString();
                    timeline.SelfAssessmentDate = selfVisit?.ActualVisitDate;
                }
            }

            timeline.PrePQASiteVisits = prePqaVisits.OrderBy(x => x.PlannedVisitDate).ToList();
            timeline.PQASiteVisits = pqaVisits.OrderBy(x => x.PlannedVisitDate).ToList();
            timeline.SupportVisits = supportVisits.OrderBy(x => x.PlannedVisitDate).ToList();
            timeline.ReAccreditationVisits = reaccreditationVisits.OrderBy(x => x.PlannedVisitDate).ToList();
            timeline.SelfAssessmentVisits = selfVisits.OrderBy(x => x.PlannedVisitDate).ToList();

            return timeline;
        }

        public async Task<bool> DeActivatePractitionerAsync(string userId, string leavingComment, string reasonForPractitionerLeavingId, string reasonDetails)
        {
            var practitioner = _practiGenericRepo.GetByUserId(userId);
            var user = _userManager.FindByIdAsync(userId).Result;

            if (practitioner != null && user != null)
            {
                practitioner.CoachHierarchy = null;
                practitioner.PrincipalHierarchy = null;
                practitioner.DateToBeRemoved = DateTime.Now;
                practitioner.IsLeaving = true;
                practitioner.IsActive = false;
                practitioner.UpdatedBy = _applicationUserId.ToStringOrNull();
                practitioner.UpdatedDate = DateTime.Now;
                practitioner.LeavingComment = leavingComment;
                practitioner.ReasonForPractitionerLeavingId = Guid.Parse(reasonForPractitionerLeavingId);
                practitioner.ReasonForLeavingDetails = reasonDetails;
                _practiGenericRepo.Update(practitioner);

                user.IsActive = false;
                user.LockoutEnabled = true;
                user.LockoutEnd = DateTime.MaxValue;
                var userResult = await _userManager.UpdateAsync(user);

                // Remove any roles
                var roles = _userManager.GetRolesAsync(user).Result;
                foreach (var role in roles)
                {
                    _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [PersonnelService.DeActivatePractitionerAsync]", role, user.Id, _applicationUserId);
                    var result = _userManager.RemoveFromRoleAsync(user, role).Result;
                }

                // Use dbContext to get signup
                var oaSiteAddress = _dbContext.Tenants.Where(x => x.TenantTypeId == ECDLink.Tenancy.Enums.TenantType.OpenAccess).Select(x => x.SiteAddress).FirstOrDefault();
                // Send notification to practitioner
                var replacements = new List<TagsReplacements>
                 {
                     new TagsReplacements()
                     {
                         FindValue = "ApplicationName",
                         ReplacementValue = TenantExecutionContext.Tenant.ApplicationName
                     },
                     new TagsReplacements()
                     {
                         FindValue = "OASignup",
                         ReplacementValue = "https://" + oaSiteAddress +"/oa-sign-up-or-login"
                     }
                 };
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachRemovePractitioner, DateTime.Now.Date, user, "", "", replacements, null, false, false, null);

                return userResult?.Succeeded ?? false;
            }
            return false;
        }

        public bool UpdatePractitionerBusinessWalkthrough(string userId)
        {
            Practitioner practitioner = _practiGenericRepo.GetByUserId(userId);
            practitioner.IsCompletedBusinessWalkThrough = true;
            practitioner.UpdatedBy = _applicationUserId.ToStringOrNull();
            practitioner.UpdatedDate = DateTime.Now;
            _practiGenericRepo.Update(practitioner);
            return true;
        }

        public void UpdatePractitioneProgressWalkthrough(string userId)
        {
            var practitioner = _practiGenericRepo.GetByUserId(userId);
            practitioner.ProgressWalkthroughComplete = true;
            _practiGenericRepo.Update(practitioner);
        }

        #endregion

      

        public string GetUserSignature(string userId)
        {
            ApplicationUser user = _userManager.FindByIdAsync(userId).Result;

            if (user?.coachObjectData?.SigningSignature != null)
            {
                return user?.coachObjectData.SigningSignature;
            }
            else if (user?.principalObjectData?.SigningSignature != null)
            {
                return user?.principalObjectData.SigningSignature;
            }
            else if (user?.practitionerObjectData?.SigningSignature != null)
            {
                return user?.practitionerObjectData.SigningSignature;
            }
            return "";
        }

        public string GetUserSiteAddress(string userId)
        {
            var _siteAddress = new SiteAddress();
            ApplicationUser user = _userManager.FindByIdAsync(userId).Result;

            if (user?.coachObjectData?.SiteAddress != null)
            {
                _siteAddress = user?.coachObjectData.SiteAddress;
            }
            else if (user?.principalObjectData?.SiteAddress != null)
            {
                _siteAddress = user?.principalObjectData.SiteAddress;
            }
            else if (user?.practitionerObjectData?.SiteAddress != null)
            {
                _siteAddress = user?.practitionerObjectData.SiteAddress;
            }

            return _siteAddress?.AddressLine1 ?? "" + _siteAddress?.AddressLine2 ?? "" + _siteAddress?.AddressLine3 ?? "" + _siteAddress?.PostalCode ?? "" + _siteAddress?.Province.Description ?? "";
        }

        public bool RemovePractitionerClassrooms(List<Guid> classroomIds)
        {
            List<Classroom> classrooms = _classRepo.GetAll().Where(x => classroomIds.Contains(x.Id)).ToList();
            _dbContext.Classrooms.RemoveRange(classrooms);
            _dbContext.SaveChanges();
            return true;
        }

        public Practitioner AddOAPractitioner(Guid userId, string userName)
        {
            var practitioner = _practiRepo.Insert(
                new Practitioner
                {
                    Id = userId,
                    UserId = userId,
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = _applicationUserId.ToString(),
                });

            // also create a dummy pre-school (classroom) for practitioner to test with
            _classRepo.Insert(new Classroom
            {
                Id = Guid.NewGuid(),
                Name = userName + "'s testing pre-school",
                UserId = userId,
                NumberPractitioners = 0,
                NumberOfAssistants = 0,
                NumberOfOtherAssistants = 0,
                IsDummySchool = true,
                Hierarchy = practitioner.Hierarchy
            });

            return practitioner;
        }

        public bool RegisterWLUser(Guid userId)
        {
            // This WL user can be a practitioner or coach
            var practitioner = _practiGenericRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                practitioner.IsRegistered = true;
                practitioner.StartDate = DateTime.Now;
                practitioner.UpdatedDate = DateTime.Now;
                practitioner.UpdatedBy = _applicationUserId.ToString();
                _practiGenericRepo.Update(practitioner);
                return true;
            } 
            else
            {
                var coach = _coachGenericRepo.GetByUserId(userId);
                if (coach != null)
                {
                    coach.IsRegistered = true;
                    coach.StartDate = DateTime.Now;
                    coach.UpdatedDate = DateTime.Now;
                    coach.UpdatedBy = _applicationUserId.ToString();
                    _coachGenericRepo.Update(coach);
                    return true;
                }
            }
            return false;
        }

        
        public bool UpdateWLUserShareInfo(Guid userId, bool shareInfo)
        {
            var practitioner = _practiGenericRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                practitioner.ShareInfo = shareInfo;
                practitioner.UpdatedDate = DateTime.Now;
                practitioner.UpdatedBy = _applicationUserId.ToString();
                _practiGenericRepo.Update(practitioner);
                return true;
            } 
            else
            {
                var coach = _coachGenericRepo.GetByUserId(userId);
                if (coach != null)
                {
                    coach.ShareInfo = shareInfo;
                    coach.UpdatedDate = DateTime.Now;
                    coach.UpdatedBy = _applicationUserId.ToString();
                    _coachGenericRepo.Update(coach);
                    return true;
                }
            }
            return false;
        }
    }
}

