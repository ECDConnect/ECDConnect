using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.GraphApi.Mutations;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Calendar;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Services.Interfaces;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using static EcdLink.Api.CoreApi.Constants;

namespace EcdLink.Api.CoreApi.Managers.Users.SmartStart
{
    public class PersonnelService : IPersonnelService
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
        private IGenericRepository<UserConsent, Guid> _userConsentRepo;
        private IGenericRepository<VisitType, Guid> _visitTypeRepo;
        private IGenericRepository<Coach, Guid> _coachRepo;
        private IGenericRepository<PQARating, Guid> _pqaRatingRepo;
        private AuthenticationDbContext _dbContext;
        private IGenericRepository<CalendarEventParticipant, Guid> _calendarEventParticipantRepo;
        private IGenericRepository<StatementsStartupSupport, Guid> _statementStartupSupportRepo;

        private VisitDataManager _visitDataManager;
        private VisitManager _visitManager;
        private UserLicenseManager _userLicenseManager;
        private UserManager<ApplicationUser> _userManager;
        private HierarchyEngine _hierarchyEngine;
        private INotificationService _notificationService;
        private IClubService _clubService;
        private IAbsenteeService _absenteeService;
        private ILogger<UserMutationExtension> _logger;
        private IReassignmentService __reassignmentService;
        private IServiceProvider _services;

        public PersonnelService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            AuthenticationDbContext dbContext,
            VisitDataManager visitDataManager,
            VisitManager visitManager,
            UserLicenseManager userLicenseManager,
            [Service] INotificationService notificationService,
            [Service] IClubService clubService,
            [Service] IAbsenteeService absenteeService,
            UserManager<ApplicationUser> userManager,
            [Service] HierarchyEngine hierarchyEngine,
            [Service] ILogger<UserMutationExtension> logger,
            IServiceProvider services
            )
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser()?.Id;

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
            _userConsentRepo = _repoFactory.CreateGenericRepository<UserConsent>(userContext: _applicationUserId);
            _visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: _applicationUserId);
            _coachRepo = _repoFactory.CreateGenericRepository<Coach>(userContext: _applicationUserId);
            _pqaRatingRepo = _repoFactory.CreateGenericRepository<PQARating>(userContext: _applicationUserId);
            _calendarEventParticipantRepo = repoFactory.CreateGenericRepository<CalendarEventParticipant>(userContext: _applicationUserId);
            _statementStartupSupportRepo = repoFactory.CreateGenericRepository<StatementsStartupSupport>(userContext: _applicationUserId);
            _dbContext = dbContext;

            _visitDataManager = visitDataManager;
            _visitManager = visitManager;
            _userLicenseManager = userLicenseManager;
            _userManager = userManager;
            _hierarchyEngine = hierarchyEngine;
            _notificationService = notificationService;
            _clubService = clubService;
            _absenteeService = absenteeService;
            _logger = logger;
            _services = services;
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
                practitioners = _practiGenericRepo.GetAll().Where(x => x.IsActive == true && x.CoachHierarchy.HasValue && x.CoachHierarchy.Value == Guid.Parse(currentUser.Id)).OrderBy(x => x.User.FirstName).ToList();
            }
            else if (currentUser.practitionerObjectData != null && currentUser.practitionerObjectData.IsPrincipal.HasValue && currentUser.practitionerObjectData.IsPrincipal.Value)
            {
                practitioners = _practiGenericRepo.GetAll().Where(x => x.IsActive == true && x.PrincipalHierarchy.HasValue && x.PrincipalHierarchy.Value == Guid.Parse(currentUser.Id)).OrderBy(x => x.User.FirstName).ToList();
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
            PractitionerModel practitionerRecord = new PractitionerModel();

            practitionerRecord.Id = practitioner.Id;
            practitionerRecord.UserId = practitioner.UserId;
            practitionerRecord.User = practitioner.User;
            practitionerRecord.SiteAddress = practitioner.SiteAddress;
            practitionerRecord.IsPrincipal = practitioner.IsPrincipal;
            practitionerRecord.IsRegistered = practitioner.IsRegistered;
            practitionerRecord.PrincipalHierarchy = practitioner.PrincipalHierarchy;
            practitionerRecord.AttendanceRegisterLink = practitioner.AttendanceRegisterLink;
            practitionerRecord.MaxChildren = practitioner.MaxChildren;
            practitionerRecord.ConsentForPhoto = practitioner.ConsentForPhoto;
            practitionerRecord.ParentFees = practitioner.ParentFees;
            practitionerRecord.LanguageUsedInGroups = practitioner.LanguageUsedInGroups;
            practitionerRecord.SigningSignature = practitioner.SigningSignature;
            practitionerRecord.StartDate = practitioner.StartDate;
            practitionerRecord.MonthSinceFranchisee = practitioner.MonthSinceFranchisee;
            practitionerRecord.ShareInfo = practitioner.ShareInfo;
            practitionerRecord.DateLinked = practitioner.DateLinked;
            practitionerRecord.DateAccepted = practitioner.DateAccepted;
            practitionerRecord.DateToBeRemoved = practitioner.DateToBeRemoved;
            practitionerRecord.IsLeaving = practitioner.IsLeaving;
            practitionerRecord.Progress = practitioner.Progress;
            practitionerRecord.IsCompletedBusinessWalkThrough = practitioner.IsCompletedBusinessWalkThrough;
            practitionerRecord.ProgrammeType = practitioner.ProgrammeType;
            practitionerRecord.IsTrainee = practitioner.IsTrainee;
            practitionerRecord.CoachHierarchy = practitioner.CoachHierarchy;
            practitionerRecord.AttendedChildProgress = practitioner.AttendedChildProgress;
            practitionerRecord.UsePhotoInReport = practitioner.UsePhotoInReport;
            practitionerRecord.SetupTraineeInitiated = practitioner.SetupTraineeInitiated;
            practitionerRecord.IsOnStipend = practitioner.IsOnStipend;
            practitionerRecord.StipendType = practitioner.StipendType;

            ClubMember clubMember = _clubService.GetClubForPractitioner(practitioner.Id);
            if (practitionerRecord != null)
            {
                practitionerRecord.ClubId = clubMember?.Club?.Id;
                practitionerRecord.ClubName = clubMember?.Club?.Name;
                practitionerRecord.IsNewInClub = clubMember?.IsNewInClub;
            }

            List<AbsenteeDetail> absentees = _absenteeService.GetAbsenteeByUser(practitioner.UserId, DateTime.Now.GetStartOfPreviousMonth());
            if (absentees.Any())
            {
                practitionerRecord.Absentees = absentees;
                //check if currently on leave?
                if (absentees.Where(x => x.AbsentDate.Date <= DateTime.Now.Date && x.AbsentDateEnd.HasValue && x.AbsentDateEnd.Value.Date >= DateTime.Now.Date).Any() )
                {
                    practitionerRecord.IsOnLeave = true;
                }
            }
            practitionerRecord.DaysAbsentLastMonth = _absenteeService.GetAbsenteeCountByUser(practitioner.UserId);

            return practitionerRecord;
        }


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

        public List<Child> GetAllChildrenForPractitioner(string practitionerId)
        {
            Practitioner practitioner = _practiGenericRepo.GetByUserId(practitionerId);
            if (practitioner != null && !string.IsNullOrEmpty(practitioner.Hierarchy))
            {
                var children = _childRepo.GetAll().Where(x => x.Hierarchy.StartsWith(practitioner.Hierarchy)).ToList();
                return children;
            }
            else return new List<Child>();
        }

        public Practitioner GetPractitionerForChild(string childUserId)
        {
            if (childUserId != null)
            {
                var parentUserId = _hierarchyEngine.GetUserParentUserId(childUserId);
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

        public PrincipalClassroom GetClassroomDetailsForPractitioner(string userId)
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
                        principalClassroom.ProgrammeTypeId = classroomGroup.ProgrammeTypeId.ToString();
                    }
                    else
                    {
                        //if no classroomgroup is available to look at, use the classroom for principal
                        classroom = _classRepo.GetByUserId(principal.UserId);
                    }
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
            return principalClassroom;
        }

        public List<Practitioner> GetAllPractitionersForPrincipal(string userId)
        {
            List<Practitioner> practitioners = _practiRepo.GetAll().Where(x => x.PrincipalHierarchy.Equals(Guid.Parse(userId))).ToList();

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

        public Practitioner SwitchPrincipal(string oldPrincipalUserId, string newPrincipalUserId)
        {
            var practitionerToPromote = _practiGenericRepo.GetByUserId(newPrincipalUserId);
            var practitionerToDemote = _practiGenericRepo.GetByUserId(oldPrincipalUserId);

            var isRolePrincipal = practitionerToDemote.IsPrincipal.HasValue && practitionerToDemote.IsPrincipal.Value;
            var isRoleFAA = practitionerToDemote.IsFundaAppAdmin.HasValue && practitionerToDemote.IsFundaAppAdmin.Value;

            if (practitionerToPromote != null && practitionerToDemote != null)
            {
                if (isRolePrincipal) { practitionerToPromote.IsPrincipal = true; }
                if (isRoleFAA) { practitionerToPromote.IsFundaAppAdmin = true; }
                practitionerToPromote.ShareInfo = true;
                practitionerToPromote.PrincipalHierarchy = null;
                practitionerToPromote.DateLinked = null;
                practitionerToPromote.DateAccepted = null;
                practitionerToPromote.DateAccepted = null;
                _practiGenericRepo.Update(practitionerToPromote);

                if (isRolePrincipal) { practitionerToDemote.IsPrincipal = false; }
                if (isRoleFAA) { practitionerToDemote.IsFundaAppAdmin = false; }
                practitionerToDemote.PrincipalHierarchy = Guid.Parse(practitionerToPromote.UserId);
                practitionerToDemote.ShareInfo = true;
                practitionerToDemote.DateLinked = DateTime.Now;
                practitionerToDemote.DateAccepted = DateTime.Now;
                practitionerToDemote.DateAccepted = DateTime.Now;
                _practiGenericRepo.Update(practitionerToDemote);

                //now list through all practitioners and remove the principalhierarchies and assign new
                List<Practitioner> allPrincipalPractitioners = _practiGenericRepo.GetAll().Where(x => x.PrincipalHierarchy.Equals(Guid.Parse(oldPrincipalUserId))).ToList();
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

                //Swap the unsure class if there is one
                var unsureClassroomGroup = _classGroupRepo.GetListByUserId(practitionerToDemote.UserId).Where(x => x.Name == "Unsure").FirstOrDefault();
                if(unsureClassroomGroup != null)
                {
                    _reassignmentService.AddReassignmentForPractitioner(practitionerToDemote.UserId, practitionerToPromote.UserId, "New principal/administrator", DateTime.Now, _applicationUserId, unsureClassroomGroup.Id.ToString(), true);
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
                if (isRoleFAA) 
                {
                    _logger.LogInformation("Roles: Add {0} to user {1} by {2} [PersonnelService.SwitchPrincipal(1)]", Roles.ADMINISTRATOR, userToPromote.Id, _applicationUserId);
                    result = _userManager.AddToRoleAsync(userToPromote, Roles.ADMINISTRATOR).Result; 
                }

                var userToDemote = _userManager.FindByIdAsync(oldPrincipalUserId).Result;
                if (isRolePrincipal) 
                {
                    _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [PersonnelService.SwitchPrincipal(2)]", Roles.PRINCIPAL, userToDemote.Id, _applicationUserId);
                    result = _userManager.RemoveFromRoleAsync(userToDemote, Roles.PRINCIPAL).Result; 
                }
                if (isRoleFAA) 
                {
                    _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [PersonnelService.SwitchPrincipal(2)]", Roles.ADMINISTRATOR, userToDemote.Id, _applicationUserId);
                    result = _userManager.RemoveFromRoleAsync(userToDemote, Roles.ADMINISTRATOR).Result; 
                }
                _logger.LogInformation("Roles: Add {0} to user {1} by {2} [PersonnelService.SwitchPrincipal(2)]", Roles.PRACTITIONER, userToDemote.Id, _applicationUserId);
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
                _practiRepo.Update(practitionerToPromote);

                //now add user to principal
                var user = _userManager.FindByIdAsync(userId).Result;
                _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [PersonnelService.PromotePractitionerToPrincipal]", Roles.PRACTITIONER, user.Id, _applicationUserId);
                var remove = _userManager.RemoveFromRoleAsync(user, Roles.PRACTITIONER).Result;
                _logger.LogInformation("Roles: Add {0} to user {1} by {2} [PersonnelService.PromotePractitionerToPrincipal]", Roles.PRINCIPAL, user.Id, _applicationUserId);
                var add = _userManager.AddToRoleAsync(user, Roles.PRINCIPAL).Result;

                if (sendComm)
                {
                    List<TagsReplacements> replacements = new List<TagsReplacements>();
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "PrincipalOrFAA",
                        ReplacementValue = "Principal"
                    });
                    //var classroom = GetClassroomDetailsForPractitioner(practitionerToPromote.UserId);
                    var classroom = _classRepo.GetByUserId(practitionerToPromote.UserId);
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "ProgrammeName",
                        ReplacementValue = classroom.Name
                    });
                    _notificationService.SendNotificationAsync(null, TemplateTypeConstants.PromotedToPrincipalOrFAA, DateTime.Now, practitionerToPromote.User, null, MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(7));
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
                List<Practitioner> allPrincipalPractitioners = _practiRepo.GetAll().Where(x => x.PrincipalHierarchy.Equals(Guid.Parse(userId))).ToList();
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

                //send notifications that user has been demoted
                List<TagsReplacements> replacements = new List<TagsReplacements>();
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "principalOrFAA",
                    ReplacementValue = "Principal"
                });

                var classroom = GetClassroomDetailsForPractitioner(practitionerToDemote.UserId);
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "ProgrammeName",
                    ReplacementValue = classroom.Name
                });
                _notificationService.SendNotificationAsync(null, TemplateTypeConstants.DemotedFromPrincipalOrFAA, DateTime.Now, practitionerToDemote.User, null, MessageStatusConstants.Amber, replacements);
            }

            return practitionerToDemote;
        }
        public Practitioner MarkFAA(string userId, bool isFAA = false)
        {
            var practitioner = _practiRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                practitioner.IsFundaAppAdmin = isFAA;
                _practiRepo.Update(practitioner);
            }

            return practitioner;
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
            Trainee trainee = _traineeRepo.GetByUserId(userId);
            Practitioner practitioner = _practiGenericRepo.GetByUserId(userId);
            Coach coach = _coachRepo.GetByUserId(practitioner.CoachHierarchy.ToString());
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

            // Starter license received
            License starterLicense = _userLicenseManager.GetLicenseForUserForType(userId, Constants.SSSettings.ss_starter_licence);
            if (starterLicense?.LicenseDate != null)
            {
                timeline.StarterLicenseStatus = Constants.SSSettings.starter_licence_received;
                timeline.StarterLicenseDate = starterLicense?.LicenseDate;
                timeline.StarterLicenseColor = MetricsColorEnum.Success.ToString();
            }
            else
            {
                timeline.StarterLicenseStatus = Constants.SSSettings.starter_licence_not_received;
                timeline.StarterLicenseColor = MetricsColorEnum.Warning.ToString();
            }

            // SmartSpace license received
            License smartSpaceLicense = _userLicenseManager.GetLicenseForUserForType(userId, Constants.SSSettings.ss_smart_space_licence);
            if (smartSpaceLicense?.LicenseDate != null  && smartSpaceLicense?.DeclinedDate == null)
            {
                timeline.SmartSpaceLicenseStatus = Constants.SSSettings.smart_space_licence_received;
                timeline.SmartSpaceLicenseDate = smartSpaceLicense?.LicenseDate;
                timeline.SmartSpaceLicenseColor = MetricsColorEnum.Success.ToString();
            }
            else
            {
                timeline.SmartSpaceLicenseStatus = Constants.SSSettings.smart_space_licence_not_received;
                timeline.SmartSpaceLicenseColor = MetricsColorEnum.Warning.ToString();
            }

            // Practice license received
            License practiceLicense = _userLicenseManager.GetLicenseForUserForType(userId, Constants.SSSettings.ss_practice_licence);
            if (practiceLicense?.LicenseDate != null)
            {
                timeline.PracticeLicenseStatus = Constants.SSSettings.practice_licence_received;
                timeline.PracticeLicenseDate = practiceLicense?.LicenseDate;
                timeline.PracticeLicenseColor = MetricsColorEnum.Success.ToString();
            }
            else
            {
                timeline.PracticeLicenseStatus = Constants.SSSettings.practice_licence_not_received;
                timeline.PracticeLicenseColor = MetricsColorEnum.Warning.ToString();
            }

            // consolidation meetings 
            /*if (trainee?.ConsolidationMeetingDate != null)
            {
                timeline.ConsolidationMeetingStatus = Constants.SSSettings.consolidation_meeting;
                timeline.ConsolidationMeetingColor = MetricsColorEnum.Success.ToString();
                timeline.ConsolidationMeetingDate = trainee?.ConsolidationMeetingDate;
            } else
            {
                timeline.ConsolidationMeetingStatus = Constants.SSSettings.no_consolidation_meeting;
                timeline.ConsolidationMeetingColor = MetricsColorEnum.Warning.ToString();
                timeline.ConsolidationMeetingDate = trainee?.ConsolidationMeetingDate;
            }*/

            // First Aid
            if (practitioner?.AttendedFirstAidCourse == true)
            {
                timeline.FirstAidCourseStatus = Constants.SSSettings.attended_first_aid;
                timeline.FirstAidCourseColor = MetricsColorEnum.Success.ToString();
                //timeline.FirstAidDate = "";
            } else
            {
                timeline.FirstAidCourseStatus = Constants.SSSettings.not_attended_first_aid;
                timeline.FirstAidCourseColor = MetricsColorEnum.Warning.ToString();
                //timeline.FirstAidDate = "";
            }

            // Child Progress
            timeline.ChildProgressTrainingStatus = Constants.SSSettings.child_progress_training;
            timeline.ChildProgressTrainingColor = practitioner.AttendedChildProgress == true ? MetricsColorEnum.Success.ToString() : MetricsColorEnum.Warning.ToString();

            // PQA visits
            List<Visit> visits = _visitManager.GetVisitsForClient(userId, Constants.SSSettings.client_practitioner);
            visits = visits.OrderBy(x => x.InsertedDate).ToList();

            var prePqaVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_1 || x.VisitType.Name == Constants.SSSettings.visitType_pre_pqa_visit_2).ToList();
            var pqaVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1 || x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).ToList();
            var reaccreditationVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1 || x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up).ToList();
            var supportVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_support || x.VisitType.Name == Constants.SSSettings.visitType_call).ToList();
            var requestedCoachVisits = _visitManager.GetCoachVisits(coach.Id, practitioner.Id); 
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

            // Coach Circles
            // get all attendance for practitioner
            PractitionerAttendance attendance = _clubService.GetPractitionerAttendance(practitioner.Id, Constants.CoachingCircleSettings.meeting_type_coach_circle);
            if (attendance.MeetingRegister != null && attendance.MeetingRegister.Count > 0)
            {
                // coach circle color application
                attendance.AttendanceColor = attendance.PercAttended >= 60 ? MetricsColorEnum.Success.ToString() : MetricsColorEnum.Warning.ToString();
                timeline.CoachCircles = attendance;
            }

            // Club meetings
            var clubAttendance = _clubService.GetPractitionerAttendance(practitioner.Id, Constants.ClubSettings.meeting_type_club_meeting);
            if (clubAttendance.MeetingRegister != null && clubAttendance.MeetingRegister.Count > 0)
            {
                clubAttendance.AttendanceColor = clubAttendance.PercAttended >= 60 ? MetricsColorEnum.Success.ToString() : MetricsColorEnum.Warning.ToString();
                timeline.ClubMeetings = clubAttendance;
            }

            timeline.PrePQASiteVisits = prePqaVisits.OrderBy(x => x.PlannedVisitDate).ToList();
            timeline.PQASiteVisits = pqaVisits.OrderBy(x => x.PlannedVisitDate).ToList();
            timeline.SupportVisits = supportVisits.OrderBy(x => x.PlannedVisitDate).ToList();
            timeline.ReAccreditationVisits = reaccreditationVisits.OrderBy(x => x.PlannedVisitDate).ToList();
            timeline.RequestedCoachVisits = requestedCoachVisits.OrderBy(x => x.PlannedVisitDate).ToList();
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
                practitioner.UpdatedBy = _applicationUserId;
                practitioner.UpdatedDate = DateTime.Now;
                practitioner.LeavingComment = leavingComment;
                practitioner.ReasonForPractitionerLeavingId = Guid.Parse(reasonForPractitionerLeavingId);
                practitioner.ReasonForLeavingDetails = reasonDetails;
                _practiGenericRepo.Update(practitioner);

                user.IsActive = false;
                user.LockoutEnabled = true;
                user.LockoutEnd = DateTime.MaxValue;
                var userResult = await _userManager.UpdateAsync(user);

                // Archive club member/leader/support
                _clubService.ArchiveClubUser(practitioner.Id);

                // Remove any roles
                var roles = _userManager.GetRolesAsync(user).Result;
                foreach (var role in roles)
                {
                    _logger.LogInformation("Roles: Remove {0} from user {1} by {2} [PersonnelService.DeActivatePractitionerAsync]", role, user.Id, _applicationUserId);
                    var result = _userManager.RemoveFromRoleAsync(user, role).Result;
                }

                return userResult?.Succeeded ?? false;
            }
            return false;
        }

        public bool UpdatePractitionerBusinessWalkthrough(string userId)
        {
            Practitioner practitioner = _practiGenericRepo.GetByUserId(userId);
            practitioner.IsCompletedBusinessWalkThrough = true;
            practitioner.UpdatedBy = _applicationUserId;
            practitioner.UpdatedDate = DateTime.Now;
            _practiGenericRepo.Update(practitioner);
            return true;
        }


        #endregion

        #region Trainees

        public Trainee ScheduleConsolidationMeetingDate(string userId, DateTime? scheduledDate)
        {
            Trainee trainee = _traineeRepo.GetByUserId(userId);
            if (trainee == null) return null;

            trainee.ScheduledConsolidationMeetingDate = scheduledDate;

            _traineeRepo.Update(trainee);

            return trainee;
        }

        public Trainee UpdateCommunitySupport(string userId, bool? haveCommunitySupport)
        {
            Trainee trainee = _traineeRepo.GetByUserId(userId);
            if (trainee == null) return null;

            trainee.HaveCommunitySupport = haveCommunitySupport;
            if (haveCommunitySupport == true)
            {
                trainee.CommunitySupportGained = DateTime.Now;
            }

            _traineeRepo.Update(trainee);

            return trainee;
        }

        public TraineeOnBoardTimeline GetOnBoardTraineeTimeline(string userId)
        {
            var timeline = new TraineeOnBoardTimeline();
            Trainee trainee = _traineeRepo.GetByUserId(userId);

            timeline.TraineeVisits = _visitManager.GetVisitsForClient(userId, Constants.SSSettings.client_trainee);

            // StarterLicense
            License starterLicense = _userLicenseManager.GetLicenseForUserForType(userId, Constants.SSSettings.ss_starter_licence);
            if (starterLicense?.LicenseDate != null)
            {
                timeline.StarterLicenseStatus = Constants.SSSettings.starter_licence_received;
                timeline.StarterLicenseDate = starterLicense?.LicenseDate;
                timeline.StarterLicenseColor = MetricsColorEnum.Success.ToString();
            } else
            {
                timeline.StarterLicenseStatus = Constants.SSSettings.starter_licence_not_received;
                timeline.StarterLicenseColor = MetricsColorEnum.Warning.ToString();
            }

            // SmartSpace license received
            License smartSpaceLicense = _userLicenseManager.GetLicenseForUserForType(userId, Constants.SSSettings.ss_smart_space_licence);
            if (smartSpaceLicense?.LicenseDate != null && smartSpaceLicense?.DeclinedDate == null)
            {
                timeline.SmartSpaceLicenseStatus = Constants.SSSettings.smart_space_licence_received;
                timeline.SmartSpaceLicenseDate = smartSpaceLicense?.LicenseDate;
                timeline.SmartSpaceLicenseColor = MetricsColorEnum.Success.ToString();

                timeline.SignFranchiseeAgreementDeadlineDate = smartSpaceLicense?.LicenseDate.Value.AddDays(7);
                timeline.SignStartUpSupportAgreementDeadlineDate = smartSpaceLicense?.LicenseDate.Value.AddDays(7);
            }
            else
            {
                if (smartSpaceLicense?.LicenseDate != null && smartSpaceLicense?.DeclinedDate != null)
                {
                    timeline.SmartSpaceLicenseNotAwardedDate = smartSpaceLicense?.DeclinedDate;
                    timeline.SmartSpaceLicenseNotAwardedSteps = smartSpaceLicense?.DeclinedCommentsSteps;
                    timeline.SmartSpaceLicenseStatus = Constants.SSSettings.smart_space_licence_not_received;
                    timeline.SmartSpaceLicenseDate = smartSpaceLicense?.LicenseDate;
                    timeline.SmartSpaceLicenseColor = MetricsColorEnum.Warning.ToString();
                }
                else
                {
                    timeline.SmartSpaceLicenseStatus = Constants.SSSettings.smart_space_licence_not_received;
                    timeline.SmartSpaceLicenseColor = MetricsColorEnum.Warning.ToString();
                }
            }

            // DayOneStartUpTraining
            if (trainee?.AttendedStartUpTraining == true)
            {
                timeline.DayOneStartUpTrainingStatus = "";
                timeline.DayOneStartUpTrainingColor = MetricsColorEnum.Success.ToString();
                timeline.DayOneStartUpTrainingDate = trainee.StartDate;
            }

            // ConsolidationMeeting -> smartLink
            if (starterLicense?.LicenseDate != null)
            {
                // Consolidation meeting = date of starter license + 7 days
                timeline.ConsolidationDeadlineDate = starterLicense?.LicenseDate.Value.AddDays(7);
            }
            if (trainee != null)
            {
                if (trainee.ConsolidationMeetingDate != null) {
                    timeline.ConsolidationMeetingStatus = Constants.SSSettings.consolidation_meeting;
                    timeline.ConsolidationMeetingColor = MetricsColorEnum.Success.ToString();
                    timeline.ConsolidationMeetingDate = trainee.ConsolidationMeetingDate;
                }
                timeline.ConsolidationMeetingDateScheduled = trainee.ScheduledConsolidationMeetingDate;
            }
            List<DateTime> consolidationDates = new List<DateTime>();
            if (timeline.ConsolidationDeadlineDate != null)
            {
                consolidationDates.Add(timeline.ConsolidationDeadlineDate.Value);
            }
            if (timeline.ConsolidationMeetingDate != null)
            {
                consolidationDates.Add(timeline.ConsolidationMeetingDate.Value);
            }
            if (timeline.ConsolidationMeetingDateScheduled != null)
            {
                consolidationDates.Add(timeline.ConsolidationMeetingDateScheduled.Value);
            }

            // Deadline dates
            if (consolidationDates.Count > 0)
            {
                DateTime latestConsolidationDate = consolidationDates.OrderBy(x => x.Date).LastOrDefault();
                timeline.SmartSpaceChecklistDeadlineDate = latestConsolidationDate.AddDays(14);
                timeline.CommunitySupportDeadlineDate = latestConsolidationDate.AddDays(14);
                timeline.ThreeChildrenRegisteredDeadlineDate = latestConsolidationDate.AddDays(14);
            }

            // SmartSpaceChecklist
            if (trainee != null)
            {
                Visit visit = _visitManager.GetVisitForUserForType(trainee.Id.ToString(), Constants.SSSettings.client_trainee, Constants.SSSettings.visitType_smart_space_checklist);
                if (visit != null)
                {
                    if (visit?.Attended == true)
                    {
                        timeline.SmartSpaceChecklistStatus = Constants.SSSettings.checklist_done;
                        timeline.SmartSpaceChecklistColor = MetricsColorEnum.Success.ToString();
                        timeline.SmartSpaceChecklistDate = visit.UpdatedDate;
                    }
                }
            }

            // CommunitySupport
            // User completed the consolidation meeting step (ie they attended the consolidation meeting)
            if (timeline.ConsolidationMeetingStatus != "")
            {
                if (trainee?.HaveCommunitySupport == true) {
                    timeline.CommunitySupportStatus = Constants.SSSettings.community_support;
                    timeline.CommunitySupportColor = MetricsColorEnum.Success.ToString();
                    timeline.CommunitySupportDate = trainee.CommunitySupportGained;
                }
            }

            Visit coachVisit = null;
            if (trainee != null)
            {
                // ThreeChildrenRegistered
                var allChildren = GetAllChildrenForPractitioner(trainee.Practitioner.UserId.ToString());
                if (allChildren.Count >= 3)
                {
                    timeline.ThreeChildrenRegisteredStatus = Constants.SSSettings.children_registered;
                    timeline.ThreeChildrenRegisteredColor = MetricsColorEnum.Success.ToString();
                    timeline.ThreeChildrenRegisteredDate = allChildren.OrderBy(x => x.InsertedDate).GetItemByIndex(0).InsertedDate;
                }

                // SSCoachVisit - normally this visit is linked to a coach id and a trainee id
                coachVisit = _visitManager.GetVisitForUserForType(trainee.Id.ToString(), Constants.SSSettings.client_trainee, Constants.SSSettings.visitType_trainee_visit);
                if (coachVisit != null)
                {
                    timeline.SSCoachVisitStatus = Constants.SSSettings.coach_visit;
                    timeline.SSCoachVisitColor = coachVisit.ActualVisitDate.HasValue && coachVisit.Attended ? MetricsColorEnum.Success.ToString() : MetricsColorEnum.None.ToString();
                    timeline.SSCoachVisitDate = coachVisit.PlannedVisitDate;
                    timeline.SSCoachVisitDeadlineDate = coachVisit.PlannedVisitDate;
                    timeline.SSCoachVisitId = coachVisit.Id;
                    timeline.SSCoachVisitDone = coachVisit.ActualVisitDate.HasValue && coachVisit.Attended;
                    timeline.SSCoachVisitEventId = coachVisit.EventId;
                }
            }

            // SSCoachVisit deadline date 
            // SmartSpace visit from coach = date when steps 1 though 6 are complete + 7 days (in future, this will also link to calendar functionality)
            List<string> sections = trainee != null ? _visitDataManager.GetVisitStatusForSSChecklist(trainee.Id) : new List<string>();
            List<DateTime> dates = new List<DateTime>();
            if (coachVisit == null)
            {
                if (trainee?.AttendedStartUpTraining == true)
                {
                    if (trainee?.StartDate != null)
                    {
                        dates.Add(trainee.StartDate.Value);
                    }
                }
                if (timeline.StarterLicenseColor == MetricsColorEnum.Success.ToString())
                {
                    dates.Add(timeline.StarterLicenseDate.Value);
                }
                if (timeline.ConsolidationMeetingColor == MetricsColorEnum.Success.ToString())
                {
                    dates.Add(timeline.ConsolidationMeetingDate.Value);
                }
                if (timeline.CommunitySupportColor == MetricsColorEnum.Success.ToString())
                {
                    dates.Add(timeline.CommunitySupportDate.Value);
                }

                if (/* sections.Count == 4  && */ timeline.ThreeChildrenRegisteredColor == MetricsColorEnum.Success.ToString() && dates.Count >= 3)
                {
                    var latestDate = dates.OrderDescending().First();
                    latestDate = latestDate.AddDays(7);
                    if (trainee != null)
                    {
                        Coach coach = _coachRepo.GetByUserId(trainee.Practitioner.CoachHierarchy.ToString());

                        VisitType visitType = _visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_coach) && x.Name == Constants.SSSettings.visitType_trainee_visit).FirstOrDefault();

                        VisitModel input = new VisitModel();
                        input.VisitType = visitType;
                        input.Attended = false;
                        input.CoachId = coach.Id;
                        input.TraineeId = trainee.Id;
                        input.PlannedVisitDate = Convert.ToDateTime(latestDate, CultureInfo.InvariantCulture);

                        coachVisit = _visitManager.AddVisitForCoach(input);
                        timeline.SSCoachVisitStatus = Constants.SSSettings.coach_visit;
                        timeline.SSCoachVisitColor = MetricsColorEnum.None.ToString();
                        timeline.SSCoachVisitDate = coachVisit.PlannedVisitDate;
                        timeline.SSCoachVisitDeadlineDate = coachVisit.PlannedVisitDate;
                        timeline.SSCoachVisitId = coachVisit.Id;
                        timeline.SSCoachVisitDone = false;
                        timeline.SSCoachVisitEventId = null;
                    }
                }
            }


            // SignFranchiseeAgreement
            UserConsent franchiseeAgreement = _userConsentRepo.GetAll().Where(x => x.UserId == userId && x.ConsentType == Constants.SSSettings.consent_type_franchisee).FirstOrDefault();
            if (franchiseeAgreement != null)
            {
                timeline.SignFranchiseeAgreementStatus = Constants.SSSettings.franchisee_signed;
                timeline.SignFranchiseeAgreementColor = MetricsColorEnum.Success.ToString();
                timeline.SignFranchiseeAgreementDate = franchiseeAgreement.InsertedDate;
            }

            // SignStartUpSupportAgreement
            // User should be identified as a start-up recipient in SmartLink; user has completed the franchisee agreement step.
            if (franchiseeAgreement != null && trainee?.Practitioner.IsOnStipend == true)
            {

                // Get support agreement data captured
                Visit supportVisit = _visitManager.GetVisitForUserForType(trainee?.Id.ToString(), Constants.SSSettings.client_trainee, Constants.SSSettings.visitType_startup_support_agreement);
                if (supportVisit != null)
                {
                    timeline.SignStartUpSupportAgreementStatus = Constants.SSSettings.support_agreement_signed;
                    timeline.SignStartUpSupportAgreementColor = MetricsColorEnum.Success.ToString();
                    timeline.SignStartUpSupportAgreementDate = supportVisit.InsertedDate;
                }
            }

            // Startup Support
            if (trainee != null)
            {
                StatementsStartupSupport startupSupport = _statementStartupSupportRepo.GetAll().Where(x => x.UserId == trainee.UserId && x.IsActive == true).OrderByDescending(x => x.StartDate).FirstOrDefault();
                if (startupSupport != null)
                {
                    timeline.StartUpSupportStartDate = startupSupport?.StartDate;
                    timeline.StartUpSupportEndDate = startupSupport?.EndDate;
                    timeline.StartUpSupportAmount = startupSupport?.Amount;
                }
            }

            return timeline;
        }
        #endregion

        public string GetUserSignature(string userId)
        {
            ApplicationUser user = _userManager.FindByIdAsync(userId).Result;

            if (user?.franchisorObjectData?.SigningSignature != null)
            {
                return user?.franchisorObjectData.SigningSignature;
            }
            else if (user?.coachObjectData?.SigningSignature != null)
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

            if (user?.franchisorObjectData?.SiteAddress != null)
            {
                _siteAddress = user?.franchisorObjectData.SiteAddress;
            }
            else if (user?.coachObjectData?.SiteAddress != null)
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
    }
}

