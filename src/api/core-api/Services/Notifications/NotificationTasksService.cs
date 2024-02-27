using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using System;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Entities.Notifications;
using System.Collections.Generic;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using System.Linq;
using ECDLink.DataAccessLayer.Repositories;
using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.SmartStart.Services.Interfaces;
using Microsoft.Extensions.Logging;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Managers;
using Microsoft.EntityFrameworkCore;
using EcdLink.Api.CoreApi.Managers.Visits;

namespace EcdLink.Api.CoreApi.Services
{
    public partial class NotificationTasksService : INotificationTasksService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly ApplicationUserManager _userManager;
        private readonly INotificationService _notificationService;
        private readonly IIncomeExpenseService _incomeService;
        private readonly IPersonnelService _personnelService;
        private readonly IPointsEngineService _pointsService;
        private readonly AttendanceTrackingRepository _attendanceTrackingRepository;
        IHolidayService<Holiday> _holidayService;
        private ILogger<NotificationTasksService> _logger;
        private UserAnonymiseService _anonymiser;
        private VisitManager _visitManager;

        public NotificationTasksService(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            [Service] ApplicationUserManager userManager,
            [Service] IIncomeExpenseService incomeService,
            HierarchyEngine hierarchyEngine, 
            [Service] AttendanceTrackingRepository attendanceTrackingRepository, 
            IHolidayService<Holiday> holidayService,
            IPersonnelService personnelService,
            IPointsEngineService pointsService,
            [Service] ILogger<NotificationTasksService> logger,
            [Service] UserAnonymiseService anonymiser,
            VisitManager visitManager)
        {
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _notificationService = notificationService;
            _userManager = userManager;
            _attendanceTrackingRepository = attendanceTrackingRepository;
            _holidayService = holidayService;
            _incomeService = incomeService;
            _personnelService = personnelService;
            _pointsService = pointsService;
            _logger = logger;
            _anonymiser = anonymiser;
            _visitManager = visitManager;
        }

        public async Task DailyUnassignedClassesNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var classroomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: adminId);
            var classroomRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: adminId);
            var principalRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);

            //find the principal that owns the classroomgroup and message them
            var unassignedClassroom =
            (
                from classroomGroupData in classroomGroupRepo.GetAll().Where(x => x.UserId == null && x.Name != "Unsure" && x.IsActive == true)
                join classroomData in classroomRepo.GetAll() on classroomGroupData.ClassroomId equals classroomData.Id
                join principalData in principalRepo.GetAll().Where(p => (p.IsPrincipal == true || p.IsFundaAppAdmin == true) && p.UserId.ToString() == "4b723ba0-5ad6-432d-8551-ffb98e4e8a4f") on classroomData.UserId equals principalData.UserId
                select new { classroomData,classroomGroupData, principalData.User }
            ).OrderByDescending(y => y.classroomData.InsertedDate).ToList();

            foreach (var unassignedClass in unassignedClassroom)
            {
                if (!string.IsNullOrWhiteSpace(unassignedClass.classroomGroupData.Name))
                {
                    List<TagsReplacements> replacements = new List<TagsReplacements>();
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "ClassName",
                        ReplacementValue = unassignedClass.classroomGroupData.Name
                    });

                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.UnassignedClasses, DateTime.Now.Date, unassignedClass.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7).Date, false, true, null, unassignedClass.User.Id.ToString());
                }
            }
        }


        public async Task DailyUserOfflineNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);

            var offlinePractitionesrs = practitionerRepo.GetAll().Where(x => x.User.IsActive == true && x.User.LastSeen.Date <= DateTime.Now.AddDays(-14).Date).OrderByDescending(x => x.User.LastSeen).ToList();//&& x.UserId.ToString() == "15b8b74e-7691-4a3a-a92d-22a7ee6d25a5"

            foreach (var prac in offlinePractitionesrs)
            {
                TimeSpan daysToCheck = (DateTime.Now - prac.User.LastSeen);
                if (daysToCheck.Days > 0)
                {
                    if (daysToCheck.Days >= 21 && daysToCheck.Days <30)
                    {

                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ThreeWeekNotLoggedOn, DateTime.Now.Date, prac.User, "", null, null, null, false, true, null, prac.UserId.ToString());
                    }
                    else if (daysToCheck.Days >= 30)
                    {

                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.FourWeekNotLoggedOn, DateTime.Now.Date, prac.User, "", null, null, null, false, true, null, prac.UserId.ToString());
                    }
                }
            }
        }
        public async Task DailyAttendanceSMSNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            //to return to, old logic has been dumped now have to bring it back
            
        }

        //public async Task DailyUnassignedProgrammesNotification()
        //{
        //    var adminId = _hierarchyEngine.GetAdminUserId();

        //    var principalRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
        //    var classRoomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: adminId);
        //    var classRoomRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: adminId);

        //    var unassignedClasses =
        //      (
        //          from classroomGroupData in classRoomGroupRepo.GetAll().Where(x => x.UserId == null)
        //          join classroomData in classRoomRepo.GetAll() on classroomGroupData.ClassroomId equals classroomData.Id
        //          join principalData in principalRepo.GetAll().Where(p => (p.IsPrincipal == true || p.IsFundaAppAdmin == true)) on classroomData.UserId equals principalData.UserId
        //          select new { classroomGroupData, principalData.User }
        //      ).OrderByDescending(y => y.classroomGroupData.InsertedDate).ToList();

        //    foreach (var classroom in unassignedClasses)
        //    {
        //        List<TagsReplacements> replacements = new List<TagsReplacements>();
        //        replacements.Add(new TagsReplacements()
        //        {
        //            FindValue = "ClassName",
        //            ReplacementValue = classroom.classroomGroupData.Name
        //        });
        //        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.UnassignedClasses, DateTime.Now.Date, classroom.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7).Date, false, true);
        //    }
        //}

        public async Task DailyChildrenRegistrationsIncompleteNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: adminId);

            //find the principal that owns the classroomgroup and message them
            var unregisteredChildren = childRepo.GetAll().Where(p => p.IsActive == true && p.InsertedDate <= DateTime.Now.AddDays(-20) && p.CaregiverId == null).ToList();
            foreach (var child in unregisteredChildren)
            {
                if (child.User != null)
                {
                    List<TagsReplacements> replacements = new List<TagsReplacements>();
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "ChildsName",
                        ReplacementValue = child.User != null ? child.User.FirstName + " " + child.User.Surname : "Child"
                    });
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "RemovalDate",
                        ReplacementValue = child.InsertedDate.AddDays(30).ToLongDateString()
                    });
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "ChildId",
                        ReplacementValue = child.Id.ToString()
                    });
                    var parentUserId = _hierarchyEngine.GetUserParentUserId(child.User.Id);
                    var userToSend = await _userManager.FindByIdAsync(parentUserId.ToString());
                    if (userToSend != null && userToSend.coachObjectData == null) //do not send to coach parent objects
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ChildRegistrationIncomplete, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, null, false, true, null, child.UserId.ToString());
                    }
                }
            }
        }

        public async Task DailyChildrenNotAssignedToClassNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var classroomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: adminId);
            var classroomRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: adminId);
            var learnerRepo = _repositoryFactory.CreateGenericRepository<Learner>(userContext: adminId);
            var childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: adminId);
            var principalRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);

            //find the principal that owns the classroomgroup and message them
            var unassignedChildren =
            (
                from classroomGroupData in classroomGroupRepo.GetAll().Where(x => x.Name == "Unsure" && x.IsActive == true)
                join learnerData in learnerRepo.GetAll() on classroomGroupData.Id equals learnerData.ClassroomGroupId where learnerData.InsertedDate.Date <= learnerData.InsertedDate.Date.AddDays(-7) && learnerData.IsActive == true
                join childData in childRepo.GetAll() on learnerData.UserId equals childData.UserId
                join classroomData in classroomRepo.GetAll() on classroomGroupData.ClassroomId equals classroomData.Id
                join principalData in principalRepo.GetAll().Where(p => (p.IsPrincipal == true || p.IsFundaAppAdmin == true)) on classroomData.UserId equals principalData.UserId
                select new { classroomData, principalData, childData }
            ).OrderByDescending(y => y.classroomData.InsertedDate).ToList();

            foreach (var child in unassignedChildren)
            {
                if (child.childData.User != null)
                {
                    List<TagsReplacements> replacements = new List<TagsReplacements>();
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "ChildsName",
                        ReplacementValue = child.childData.User != null ? child.childData.User.FirstName + " " + child.childData.User.Surname : "Child"
                    });
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "ChildUserId",
                        ReplacementValue = child.childData.UserId.ToString()
                    });
                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ChildNotAssignedToClass, DateTime.Now.Date, child.principalData.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7),false, true, null, child.childData.UserId.ToString());
                }
            }
        }

        public async Task MonthlyStatementsReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();

            var pracsDueSubmits = _incomeService.GetUnsubmittedStatements();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            string stipendText = "You need to submit your income statement to receive your stipend.";
            replacements.Add(new TagsReplacements()
            {
                FindValue = "StatementMonth",
                ReplacementValue = DateTime.Now.AddMonths(-1).ToString("MMMM")
            });
            replacements.Add(new TagsReplacements()
            {
                FindValue = "StatementCutOffDate",
                ReplacementValue = DateTime.Now.GetStartOfMonth().AddDays(7).ToShortDateString()
            }) ;

            foreach (var pracData in pracsDueSubmits)
            {
                DateTime duePeriod = pracData.Value;
                var userToSend = await _userManager.FindByIdAsync(pracData.Key.ToString());
                bool isStipendReceiver = false;
                if (userToSend.principalObjectData != null)
                {
                    if (userToSend.principalObjectData.IsOnStipend.HasValue)
                        isStipendReceiver = (bool)userToSend.principalObjectData.IsOnStipend;
                }
                else if (userToSend.practitionerObjectData != null)
                {
                    if (userToSend.practitionerObjectData.IsOnStipend.HasValue)
                        isStipendReceiver = (bool)userToSend.practitionerObjectData.IsOnStipend;
                }
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "IsStipendReceiverText",
                    ReplacementValue = isStipendReceiver ? stipendText : ""
                });

                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.IncomeStatementIncompleteBy1st, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(6),false,true, pracData.Key.ToString());
            }
        }

        //public async Task MonthlyStartupSupportEndReminderAsync()
        //{
        //    var adminId = _hierarchyEngine.GetAdminUserId();
        //    var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
        //    var practitioners = practitionerRepo.GetAll().Where(x => x.IsActive.Equals(true) && (x.IsPrincipal.Equals(true) || x.IsFundaAppAdmin.Equals(true))).ToList();
        //    List<TagsReplacements> replacements = new List<TagsReplacements>();
        //    //replacements.Add(new TagsReplacements()
        //    //{
        //    //    FindValue = "EndMonth",
        //    //    ReplacementValue = startupsupportEndDate.Month.ToString("ddd")
        //    //});
        //    //replacements.Add(new TagsReplacements()
        //    //{
        //    //    FindValue = "EndYear",
        //    //    ReplacementValue = startupsupportEndDate.Year.ToString()
        //    //});
        //    foreach (var pracData in practitioners)
        //    {
        //        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.StartupSupportEndingIn2Months, DateTime.Now.Date, pracData.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        //    }
        //}
        public async Task MonthlyPlanningReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            var classroomRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: adminId);
            //find all practitioners that has not yet created planning for their classes after a month of having the class
            var practitioners = practitionerRepo.GetAll().Where(x => x.IsActive == true && (x.IsPrincipal == true || x.IsFundaAppAdmin == true) && x.InsertedDate < DateTime.Now.AddMonths(-1).Date).ToList();

            List<TagsReplacements> replacements = new List<TagsReplacements>();
            foreach (var pracData in practitioners)
            {
                var classRooms = classroomRepo.GetAll()                    
                    .Include(x => x.Programmes)
                    .Where(x => x.UserId.Equals(pracData.UserId) && x.Programmes.Count < 3)
                    .ToList();
                if (classRooms.Any())
                {
                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.PlanYourProgrammes, DateTime.Now.Date, pracData.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7), false, true, null, pracData.UserId.ToString());
                }
            }
        }

        public async Task MonthlyPointsgReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.MonthlyPointsReminderA, DateTime.Now.Date, null, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
        }
        public async Task ProgressReportsReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();          
        }
        public async Task YearlyPreschoolFeeReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            //get all principals and FAAs
            List<Practitioner> principals = practitionerRepo.GetAll().Where(x => x.IsActive == true && x.IsRegistered == true && (x.IsPrincipal == true || x.IsFundaAppAdmin == true)).ToList();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentYear",
                ReplacementValue = DateTime.Now.Year.ToString()
            });
            foreach (var item in principals)
            {
                if (item.IsActive == true && (item.IsPrincipal == true || item.IsFundaAppAdmin == true))
                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.UpdatePreschoolFee, DateTime.Now.Date, item.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(31), false, true);
            }
        }

        public async Task SelfAssessmentReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            var visitRepo = _repositoryFactory.CreateGenericRepository<Visit>(userContext: adminId);
            var assessmentsDue = (
                from pracData in practitionerRepo.GetAll().Where(x => x.IsActive == true && x.IsTrainee == false)
                join visitData in visitRepo.GetAll().Where(x => x.VisitType.Name == Constants.SSSettings.visitType_self_assessment && x.DueDate <= DateTime.Now.AddDays(30) && x.Attended == false && x.ActualVisitDate == null && x.IsActive == true) on pracData.UserId equals visitData.Practitioner.UserId
                select new { pracData, visitData }
            ).ToList();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            foreach (var item in assessmentsDue)
            {
                DateTime dueDate = (item.visitData.DueDate.HasValue ? (DateTime)item.visitData.DueDate : DateTime.Now.AddDays(21));
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "DueDate",
                    ReplacementValue = dueDate.ToString("dddd, dd MMMM yyyy")
                });
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.FillInSelfAsessmentForm, DateTime.Now.Date, item.pracData.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(90), false, true, null, item.pracData.UserId.ToString());
            }
        }

        public async Task SelfAssessmentReminderNewAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            var visitRepo = _repositoryFactory.CreateGenericRepository<Visit>(userContext: adminId);
            var assessmentsPracs = practitionerRepo.GetAll().Where(x => x.IsActive == true && x.IsTrainee == false && x.IsRegistered == true).ToList();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            foreach (var prac in assessmentsPracs)
            {
                PractitionerTimeline practTimeline = _personnelService.GetPractitionerTimeline(prac.UserId.ToString());
                if (practTimeline != null)
                {
                    if (practTimeline.SelfAssessmentStatus != null && practTimeline.SelfAssessmentStatus != Constants.SSSettings.self_assessment)
                    {
                        DateTime dueDate = (practTimeline.SelfAssessmentDate.HasValue ? (DateTime)practTimeline.SelfAssessmentDate : DateTime.Now.AddDays(21));
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "DueDate",
                            ReplacementValue = dueDate.ToString("dddd, dd MMMM yyyy")
                        });
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.FillInSelfAsessmentForm, DateTime.Now.Date, prac.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(90), false, true, null, prac.UserId.ToString());

                    }
                }

            }
        }

        public async Task WeeklyAttendancesReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var classroomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: adminId);
            var learnerRepo = _repositoryFactory.CreateGenericRepository<Learner>(userContext: adminId);

            DateTime inDate = DateTime.Now.Date;
                    
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);

            DateTime trackingWeekDate = inDate.StartOfWeek(DayOfWeek.Monday);
            DateTime followingWeekDate = inDate.AddDays(7).StartOfWeek(DayOfWeek.Monday);

            var allRequiredAttendance =
            (
                from classroomGroupData in classroomGroupRepo.GetAll().Where(x => x.Name != "Unsure" && x.IsActive.Equals(true) && x.UserId != null) //do not count the default unsurae classes                    
                join practitionerData in practitionerRepo.GetAll().Where(p => p.IsActive.Equals(true)) on classroomGroupData.UserId equals practitionerData.UserId
                join learnerData in learnerRepo.GetAll().Where(l => l.StoppedAttendance == null && l.StartedAttendance <= inDate && l.IsActive == true) on classroomGroupData.Id equals learnerData.ClassroomGroupId
                select new { classroomGroupData, practitionerData }
            ).OrderByDescending(y => y.classroomGroupData.InsertedDate).ToList();

            string stipendReceiverText = " receive your stipend and ";
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            foreach (var requiredAttendance in allRequiredAttendance)
            {
                IEnumerable<Attendance> attendanceData = new AttendanceQueryExtension().GetWeeklyAttendance(_attendanceTrackingRepository, requiredAttendance.classroomGroupData.UserId.ToString(), trackingWeekDate.Year, trackingWeekDate.Month, trackingWeekDate.GetWeekOfYear());

                    if (!attendanceData.Any())
                    {
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "IsStipendReceiverText",
                            ReplacementValue = requiredAttendance.practitionerData.IsOnStipend.HasValue && requiredAttendance.practitionerData.IsOnStipend == true ? stipendReceiverText : ""
                        });
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.SubmitWeeksAttendance, DateTime.Now.Date, requiredAttendance.practitionerData.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(2),false,true, null, requiredAttendance.practitionerData.UserId.ToString());
                    }
            }
        }

        public async Task MonthlyAttendanceSLSyncAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var classroomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: adminId);
            var learnerRepo = _repositoryFactory.CreateGenericRepository<Learner>(userContext: adminId);
            var entityRepo = _repositoryFactory.CreateGenericRepository<IntegrationEntityMapping>(userContext: adminId);
            var docRepo = _repositoryFactory.CreateGenericRepository<Document>(userContext: adminId);
            var docTypeRepo = _repositoryFactory.CreateGenericRepository<DocumentType>(userContext: adminId);

            var attendancePDF = docTypeRepo.GetAll().Where(d => d.Name.Equals("AttendancePDF")).FirstOrDefault();

            DateTime startPeriod = DateTime.Now.GetStartOfMonth();

            var allRequiredAttendance =
                (
                    from classroomGroupData in classroomGroupRepo.GetAll().Where(x => x.Name != "Unsure" && x.IsActive.Equals(true) && x.UserId != null) //do not count the default unsurae classes                    
                    join entityData in entityRepo.GetAll().Where(p => p.IsActive.Equals(true) && p.LastAttendanceSubmittedDate <= startPeriod && p.LocalEntity.Equals("Practitioner")) on classroomGroupData.UserId equals entityData.UserId
                    join learnerData in learnerRepo.GetAll().Where(l => l.StoppedAttendance == null && l.StartedAttendance <= startPeriod && l.IsActive == true) on classroomGroupData.Id equals learnerData.ClassroomGroupId
                    select new { classroomGroupData, entityData }
                ).OrderByDescending(y => y.classroomGroupData.InsertedDate).ToList();
            foreach (var requiredAttendance in allRequiredAttendance)
            {
                var docs = docRepo.GetAll().Where(d => d.UserId.Equals(requiredAttendance.entityData.UserId) && d.DocumentTypeId.Equals(attendancePDF.Id)).ToList();
                //TODO: finish gathering docs and sending to SL


            }
        }

        public async Task DailyAttendanceNotTrackedNotification()
        {
            try { 
            var adminId = _hierarchyEngine.GetAdminUserId();
            var classroomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: adminId);
            var learnerRepo = _repositoryFactory.CreateGenericRepository<Learner>(userContext: adminId);

            DateTime inDate = DateTime.Now.Date;
                     
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            var programmeRepo = _repositoryFactory.CreateGenericRepository<ClassProgramme>(userContext: adminId);

            DateTime trackingWeekDate = inDate.StartOfWeek(DayOfWeek.Monday);
            DateTime followingWeekDate = inDate.AddDays(7).StartOfWeek(DayOfWeek.Monday);
            var holidays = _holidayService.GetHolidays(trackingWeekDate, followingWeekDate, "en-za").ToList();//get holidays to determine which days are falling on holidays
            //check that it is actuallya  meeting day and not a holiday and not a weeken
            //if (!holidays.Contains(inDate))
            //{
                var allRequiredAttendance =
                (
                    from classroomGroupData in classroomGroupRepo.GetAll().Where(x => x.Name != "Unsure" && x.IsActive.Equals(true) && x.UserId != null) //do not count the default unsurae classes                    
                    join practitionerData in practitionerRepo.GetAll().Where(p => p.IsActive.Equals(true)) on classroomGroupData.UserId equals practitionerData.UserId
                    join learnerData in learnerRepo.GetAll().Where(l => l.StoppedAttendance == null && l.StartedAttendance <= inDate && l.IsActive == true) on classroomGroupData.Id equals learnerData.ClassroomGroupId
                    select new { classroomGroupData, practitionerData }
                ).OrderByDescending(y => y.classroomGroupData.InsertedDate).ToList();

                string stipendReceiverText = "to receive your stipend and ";
                List<TagsReplacements> replacements = new List<TagsReplacements>();
                foreach (var requiredAttendance in allRequiredAttendance)
                {
                    var classProgrammes = (programmeRepo.GetAll()
                        .Where(p => p.ClassroomGroupId == requiredAttendance.classroomGroupData.Id)
                        .ToList());
                    //check if today is even a class day? by checking if the day of the week is a meeting day
                    //var availableClassDays = availableDays.Where(a => classProgrammes.Select(cp => (DayOfWeek)cp.MeetingDay).Contains(a.DayOfWeek));
                    var programmeDay = programmeRepo.GetAll().Where(d => d.MeetingDay == (int)inDate.DayOfWeek).ToList();
                    if (programmeDay.Any())
                    {
                        IEnumerable<Attendance> attendanceData = new AttendanceQueryExtension().GetDailyAttendance(_attendanceTrackingRepository, requiredAttendance.classroomGroupData.UserId.ToString(), inDate).ToList();

                        if (!attendanceData.Any())
                        {
                            replacements.Add(new TagsReplacements()
                            {
                                FindValue = "IsStipendReceiverText",
                                ReplacementValue = requiredAttendance.practitionerData.IsOnStipend.HasValue && requiredAttendance.practitionerData.IsOnStipend == true ? stipendReceiverText : ""
                            });
                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.SubmitDailyAttendance, DateTime.Now.Date, requiredAttendance.practitionerData.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(1));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Issue with attendance tracking in DailyAttendanceNotTrackedNotification" + ex.Message, ex);
            }
        }


        public async Task CoachChecksTraineeNotification(bool weeklyChecksOnly = false)
        {

            _logger.LogInformation("DailyCoachChecksNotification started at " + DateTime.Now);
            var adminId = _hierarchyEngine.GetAdminUserId();
            var traineeRepo = _repositoryFactory.CreateGenericRepository<Trainee>(userContext: adminId);
            var coachRepo = _repositoryFactory.CreateGenericRepository<Coach>(userContext: adminId);
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            int traineeOnboardingCount = 7;

            ////find all trainees thats new in last 7 days            
            List<Coach> coaches = coachRepo.GetAll().Where(x => x.IsActive.Equals(true)).ToList();

            foreach (var coach in coaches)
            {
                var coachToSend = coach.User;

                if (weeklyChecksOnly)
                {
                    var newTraineesCheck = traineeRepo.GetAll()
                        .Where(x => x.IsActive.Equals(true) && x.InsertedDate >= DateTime.Now.AddDays(-7) && x.TraineeConvertedDate == null && x.CoachHierarchy.Equals(coach.UserId))
                        .ToList(); //because some trainees dont have practtitioner records
                    if (newTraineesCheck.Any())
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachNewTrainees, DateTime.Now.Date, coachToSend, "", MessageStatusConstants.Blue, null, DateTime.Now.AddDays(2), false, true);
                    }
                }
                else
                {

                    bool overdueVisists = false;
                    var newTraineesForCoach = traineeRepo.GetAll()
                        .Where(x => x.IsActive.Equals(true) && x.TraineeConvertedDate == null && (x.CoachHierarchy.HasValue && x.CoachHierarchy == coach.UserId) && x.UserId.ToString() == "2d76240e-0fcb-ee11-8355-00155dee5a05")
                        .ToList();

                    foreach (var trainee in newTraineesForCoach)
                    {
                        var prac = practitionerRepo.GetByUserId(trainee.UserId.ToString());
                        if (prac != null && prac.IsTrainee == true && prac.IsRegistered != true)
                        {
                            List<TagsReplacements> replacements = new List<TagsReplacements>();
                            try
                            {
                                if (trainee.User != null)
                                {
                                    //if stipenreceiver then 9 steps otherwise 7
                                    if (trainee.IsOnStipend.HasValue && (bool)trainee.IsOnStipend == true)
                                        traineeOnboardingCount = 8;

                                    bool cancelStarter = false; //remove startup notificatiosn for trainee
                                    bool flagDelete = false;
                                    bool flag4weeks = false;
                                    bool flag2weeks = false;
                                    //switch off any StartTraineeJourney items if any of the timeline items have been done at this point
                                    var traineeTimeline = _personnelService.GetOnBoardTraineeTimeline(trainee.UserId.ToString());
                                    if (traineeTimeline != null)
                                    {
                                        //await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachNewTrainees, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(2), true);
                                        //1) check trainees ready for smartspace visits - SendCoachTraineeReadySmartspaceCheckNotification
                                        /*
                                        1 Starter Licence received d
                                        2 Consolidation meeting attended d
                                        3 SmartSpace checklist complete d
                                        4 3 children registered
                                        5 Community support checked
                                        */
                                        string traineeName = trainee.User.FirstName + " " + trainee.User.Surname;

                                        replacements.Add(new TagsReplacements()
                                        {
                                            FindValue = "TraineeFirstName",
                                            ReplacementValue = traineeName
                                        });
                                        replacements.Add(new TagsReplacements()
                                        {
                                            FindValue = "TraineeName",
                                            ReplacementValue = traineeName
                                        });
                                        replacements.Add(new TagsReplacements()
                                        {
                                            FindValue = "PractitionerUserId",
                                            ReplacementValue = trainee.UserId.ToString()
                                        });
                                        replacements.Add(new TagsReplacements()
                                        {
                                            FindValue = "PractitionerId",
                                            ReplacementValue = trainee.UserId.ToString()
                                        });
                                        if (traineeTimeline.StarterLicenseStatus == Constants.SSSettings.starter_licence_received && 
                                            traineeTimeline.ConsolidationMeetingStatus == Constants.SSSettings.consolidation_meeting && 
                                            traineeTimeline.SmartSpaceChecklistStatus == Constants.SSSettings.checklist_done && 
                                            traineeTimeline.ThreeChildrenRegisteredStatus == Constants.SSSettings.children_registered && 
                                            traineeTimeline.CommunitySupportStatus == Constants.SSSettings.community_support &&
                                            traineeTimeline.SSCoachVisitDone == true &&
                                            traineeTimeline.SmartSpaceLicenseStatus != Constants.SSSettings.smart_space_licence_received)
                                        {
                                            cancelStarter = true;
                                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachTraineeReadySmartspaceCheck, DateTime.Now.Date, coachToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(2), false, true, traineeName, trainee.UserId.ToString());
                                        }
                                        bool flagIncompleteOnboarding = false;
                                        bool flagOnboardingComplete = false;
                                        if (trainee.IsOnStipend.HasValue && (bool)trainee.IsOnStipend == true)
                                        {
                                            if ((traineeTimeline.SmartSpaceLicenseStatus != Constants.SSSettings.smart_space_licence_received ||
                                                traineeTimeline.ConsolidationMeetingStatus != Constants.SSSettings.consolidation_meeting ||
                                                traineeTimeline.SmartSpaceChecklistStatus != Constants.SSSettings.checklist_done ||
                                                traineeTimeline.ThreeChildrenRegisteredStatus != Constants.SSSettings.children_registered ||
                                                traineeTimeline.CommunitySupportStatus != Constants.SSSettings.community_support ||
                                                traineeTimeline.SSCoachVisitStatus != Constants.SSSettings.coach_visit) ||
                                                traineeTimeline.SSCoachVisitDone == true &&
                                                traineeTimeline.SignStartUpSupportAgreementStatus != Constants.SSSettings.support_agreement_signed ||
                                                traineeTimeline.StarterLicenseStatus != Constants.SSSettings.starter_licence_received)
                                            {
                                                flagIncompleteOnboarding = true;
                                            } else flagOnboardingComplete = true;
                                        } else
                                        {
                                            if ((traineeTimeline.SmartSpaceLicenseStatus != Constants.SSSettings.smart_space_licence_received ||
                                                traineeTimeline.ConsolidationMeetingStatus != Constants.SSSettings.consolidation_meeting ||
                                                traineeTimeline.SmartSpaceChecklistStatus != Constants.SSSettings.checklist_done ||
                                                traineeTimeline.ThreeChildrenRegisteredStatus != Constants.SSSettings.children_registered ||
                                                traineeTimeline.CommunitySupportStatus != Constants.SSSettings.community_support ||                                            
                                                traineeTimeline.SSCoachVisitDone != true) ||
                                                traineeTimeline.StarterLicenseStatus != Constants.SSSettings.starter_licence_received)
                                            {
                                                flagIncompleteOnboarding = true;
                                            } else flagOnboardingComplete = true;
                                        }

                                        if (flagIncompleteOnboarding)
                                        {
                                            cancelStarter = false;
                                            TimeSpan daysToCheck = trainee.StarterLicenceDate.HasValue ? (DateTime.Now - (DateTime)trainee.StarterLicenceDate) : (DateTime.Now - (DateTime)trainee.InsertedDate);

                                            if (daysToCheck.Days >= 28 && daysToCheck.Days < 35)
                                            {
                                                //3) Trainees not completed onboarding - 4 weeks - remove
                                                flag4weeks = true;
                                            }
                                            else if (daysToCheck.Days >= 14 && daysToCheck.Days < 28)
                                            {
                                                //2) Trainees not completed onboarding - 2 weeks
                                                flag2weeks = true;
                                            }
                                            else if (daysToCheck.Days >= 35)
                                            {
                                                //mark trainee to be deleted
                                                flagDelete = true;
                                            }

                                            if (flag4weeks) 
                                                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachRemoveTrainee, DateTime.Now.Date, coachToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(2), false, true, traineeName, trainee.UserId.ToString());
                                            else if (flag2weeks)
                                                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.Trainee2WeekOnboardingWarning, DateTime.Now.Date, coachToSend, "", MessageStatusConstants.Blue, replacements, DateTime.Now.AddDays(2), false, true, traineeName, trainee.UserId.ToString());
                                            else if (flagDelete)
                                            {
                                                cancelStarter = true;
                                                //now delete the profile
                                                await _notificationService.DeleteAllNotificationsForUser(trainee.UserId.ToString());
                                                _anonymiser.AnonymiseUser((Guid)trainee.UserId, "Trainee");
                                            }
                                            if (!flagDelete)
                                            {
                                                DateTime dueDate = DateTime.Now;
                                                //overdue trainee tasks EC-997
                                                //find out which is the first item missing and youngest date missed

                                                if (traineeTimeline.StarterLicenseStatus != Constants.SSSettings.starter_licence_received)
                                                {
                                                    if (traineeTimeline.StarterLicenseDate.HasValue && traineeTimeline.StarterLicenseDate.Value < dueDate)
                                                        dueDate = traineeTimeline.StarterLicenseDate.Value;
                                                }
                                                if (traineeTimeline.ConsolidationMeetingStatus != Constants.SSSettings.consolidation_meeting)
                                                {
                                                    if (traineeTimeline.ConsolidationDeadlineDate.HasValue && traineeTimeline.ConsolidationDeadlineDate.Value < dueDate)
                                                        dueDate = traineeTimeline.ConsolidationDeadlineDate.Value;
                                                }
                                                if (traineeTimeline.SmartSpaceChecklistStatus != Constants.SSSettings.checklist_done)
                                                {
                                                    if (traineeTimeline.SmartSpaceChecklistDeadlineDate.HasValue && traineeTimeline.SmartSpaceChecklistDeadlineDate.Value < dueDate)
                                                        dueDate = traineeTimeline.SmartSpaceChecklistDeadlineDate.Value;
                                                }
                                                if (traineeTimeline.CommunitySupportStatus != Constants.SSSettings.community_support)
                                                {
                                                    if (traineeTimeline.CommunitySupportDeadlineDate.HasValue && traineeTimeline.CommunitySupportDeadlineDate.Value < dueDate)
                                                        dueDate = traineeTimeline.CommunitySupportDeadlineDate.Value;
                                                }
                                                if (traineeTimeline.ThreeChildrenRegisteredStatus != Constants.SSSettings.children_registered)
                                                {
                                                    if (traineeTimeline.ThreeChildrenRegisteredDeadlineDate.HasValue && traineeTimeline.ThreeChildrenRegisteredDeadlineDate.Value < dueDate)
                                                        dueDate = traineeTimeline.ThreeChildrenRegisteredDeadlineDate.Value;
                                                }
                                                //if (traineeTimeline.SSCoachVisitDone != true)
                                                //{
                                                //    if (traineeTimeline.SSCoachVisitDeadlineDate.HasValue && traineeTimeline.SSCoachVisitDeadlineDate.Value < dueDate)
                                                //        dueDate = traineeTimeline.SSCoachVisitDeadlineDate.Value;
                                                //}
                                                if (traineeTimeline.SmartSpaceLicenseStatus != Constants.SSSettings.smart_space_licence_received)
                                                {
                                                    if (traineeTimeline.SmartSpaceLicenseDate.HasValue && traineeTimeline.SmartSpaceLicenseDate.Value < dueDate)
                                                        dueDate = traineeTimeline.SmartSpaceLicenseDate.Value;
                                                }
                                                if (trainee.IsOnStipend.HasValue && (bool)trainee.IsOnStipend == true && traineeTimeline.SignStartUpSupportAgreementStatus != Constants.SSSettings.support_agreement_signed)
                                                {
                                                    if (traineeTimeline.SignStartUpSupportAgreementDeadlineDate.HasValue && traineeTimeline.SignStartUpSupportAgreementDeadlineDate.Value < dueDate)
                                                        dueDate = traineeTimeline.SignStartUpSupportAgreementDeadlineDate.Value;
                                                }

                                                replacements.Add(new TagsReplacements()
                                                {
                                                    FindValue = "DueDate",
                                                    ReplacementValue = dueDate.ToShortDateString()
                                                });

                                                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.TraineeOverdueTasks, DateTime.Now.Date, trainee.User, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(7),false, true, null, trainee.UserId.ToString());
                                            }
                                            //user specific

                                        }
                                        else if (flagOnboardingComplete)
                                        { //disable all teh onboarding warnings for this trainee if they are complete
                                            await _notificationService.ExpireNotificationsTypesForUser(coachToSend.Id.ToString(), TemplateTypeConstants.TwoOnboardingStepsLeft, traineeName, null, trainee.UserId.ToString());
                                            await _notificationService.ExpireNotificationsTypesForUser(coachToSend.Id.ToString(), TemplateTypeConstants.Trainee2WeekOnboardingWarning, traineeName, null, trainee.UserId.ToString());
                                            await _notificationService.ExpireNotificationsTypesForUser(coachToSend.Id.ToString(), TemplateTypeConstants.CoachRemoveTrainee, traineeName, null, trainee.UserId.ToString());
                                        }
                                        if (cancelStarter)
                                        {
                                            //switch off starter notifications for this trainee if there was any
                                            await _notificationService.ExpireNotificationsTypesForUser(coachToSend.Id.ToString(), TemplateTypeConstants.StartTraineeJourney, traineeName, null, trainee.UserId.ToString());
                                        }
                                        if (!flagDelete && !flag2weeks && !flag4weeks) //if not even started dont botehr with this
                                        {
                                            //count how many onboarding steps has been completed and fire off notifications if only 2 more is left etc
                                            int traineeCount = 0;
                                            if (traineeTimeline.StarterLicenseStatus == Constants.SSSettings.starter_licence_received)
                                                traineeCount++;
                                            if (traineeTimeline.ConsolidationMeetingStatus == Constants.SSSettings.consolidation_meeting)
                                                traineeCount++;
                                            if (traineeTimeline.SmartSpaceChecklistStatus == Constants.SSSettings.checklist_done)
                                                traineeCount++;
                                            if (traineeTimeline.CommunitySupportStatus == Constants.SSSettings.community_support)
                                                traineeCount++;
                                            if (traineeTimeline.ThreeChildrenRegisteredStatus == Constants.SSSettings.children_registered)
                                                traineeCount++;
                                            if (traineeTimeline.SmartSpaceLicenseStatus == Constants.SSSettings.smart_space_licence_received)
                                                traineeCount++;
                                            //if (traineeTimeline.SSCoachVisitDone)
                                            //    traineeCount++;
                                            if (traineeTimeline.SignFranchiseeAgreementStatus == Constants.SSSettings.franchisee_signed)
                                                traineeCount++;
                                            if (trainee.IsOnStipend.HasValue && (bool)trainee.IsOnStipend == true && traineeTimeline.SignStartUpSupportAgreementStatus == Constants.SSSettings.support_agreement_signed)
                                                traineeCount++;



                                            if (traineeOnboardingCount - traineeCount == 2)
                                            {
                                                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.TwoOnboardingStepsLeft, DateTime.Now.Date, trainee.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7), false, true, traineeName, trainee.UserId.ToString());
                                            }
                                            else if (traineeOnboardingCount - traineeCount < 2)
                                            {
                                                //cancel any 2 step messages
                                                await _notificationService.ExpireNotificationsTypesForUser(trainee.UserId.ToString(), TemplateTypeConstants.TwoOnboardingStepsLeft, null, null, trainee.UserId.ToString());                                            
                                            } 
                                        }
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError("Issue with trainee timeline in DailyCoachChecksNotification" + ex.Message, ex);
                            }
                        }
                    }

                    if (overdueVisists)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachVisitsOverdue, DateTime.Now.Date, coachToSend, "", MessageStatusConstants.Red, null, DateTime.Now.AddDays(2), false, true);
                    }
                }

            }
            _logger.LogInformation("DailyCoachChecksNotification ended at " + DateTime.Now);
        }

        public async Task CoachChecksPractitionersNotification(bool weeklyChecksOnly = false)
        {

            _logger.LogInformation("DailyCoachChecksPractitionersNotification started at " + DateTime.Now);
            var adminId = _hierarchyEngine.GetAdminUserId();
            var coachRepo = _repositoryFactory.CreateGenericRepository<Coach>(userContext: adminId);
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);

            ////find all trainees thats new in last 7 days            
            List<Coach> coaches = coachRepo.GetAll().Where(x => x.IsActive.Equals(true)).ToList();

            foreach (var coach in coaches)
            {
                bool overdueVisists = false;
                var coachToSend = coach.User;

                if (weeklyChecksOnly)
                {
                    //weekly practitioner by coach checks
                }
                else
                {
                    var practitioners = practitionerRepo.GetAll().Where(x => x.IsActive == true && x.IsTrainee == false && x.IsRegistered == true && (x.CoachHierarchy.HasValue && x.CoachHierarchy == coach.UserId)).ToList();
                    foreach (var prac in practitioners)
                    {
                        List<TagsReplacements> replacements = new List<TagsReplacements>();
                        try
                        {
                            string visitType = "";
                            string pracName = prac.User.FirstName + " " + prac.User.Surname;
                            //4) Practitioner not completed self assessment form - find any practitioners not completed self assessment forms yet
                            PractitionerTimeline practTimeline = _personnelService.GetPractitionerTimeline(prac.UserId.ToString());
                            if (practTimeline != null)
                            {
                                if (practTimeline.SelfAssessmentStatus != null && practTimeline.SelfAssessmentStatus != Constants.SSSettings.self_assessment)
                                {
                                    if (practTimeline.PrePQAVisitDate1 <= DateTime.Now.AddDays(14))
                                        visitType = "First PQA";

                                    if (practTimeline.ReAccreditationVisits != null)
                                    {
                                        foreach (var visit in practTimeline.ReAccreditationVisits)
                                        {
                                            if (visit.DueDate <= DateTime.Now.AddDays(14))
                                            {
                                                visitType = "First Re-accreditation";
                                            }
                                        }
                                    }
                                    replacements.Add(new TagsReplacements()
                                    {
                                        FindValue = "VisitType",
                                        ReplacementValue = visitType //First PQA / Re-accreditation = show First PQA if that is the upcoming visit for which the self-assessment form is required; else show Re-accreditation if that is the upcoming visit for which the self-assessment is required.
                                    });
                                    replacements.Add(new TagsReplacements()
                                    {
                                        FindValue = "PractitionerFirstName",
                                        ReplacementValue = pracName
                                    });
                                    replacements.Add(new TagsReplacements()
                                    {
                                        FindValue = "PractitionerUserId",
                                        ReplacementValue = prac.UserId.ToString()
                                    });
                                    await _notificationService.ExpireNotificationsTypesForUser(coachToSend.Id.ToString(), TemplateTypeConstants.CoachSelfAssessmentFormReminder, pracName, null, prac.UserId.ToString());
                                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachSelfAssessmentFormReminder, DateTime.Now.Date, coachToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(14), false, true, pracName, prac.UserId.ToString());
                                }
                                else
                                {
                                    //self assessments may need to be checked again directly
                                    List<Visit> visits = _visitManager.GetVisitsForClient(prac.UserId.ToString(), Constants.SSSettings.client_practitioner);
                                    visits = visits.OrderBy(x => x.InsertedDate).ToList();
                                    var selfAssessments = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_self_assessment).ToList();

                                    if (selfAssessments.Any())
                                    {
                                        foreach (var item in selfAssessments)
                                        {
                                            if (item.Attended == false && item.ActualVisitDate == null && item.DueDate < DateTime.Now)
                                            {
                                                if (practTimeline.PrePQAVisitDate1 <= DateTime.Now.AddDays(14))
                                                    visitType = "First PQA";

                                                if (practTimeline.ReAccreditationVisits != null)
                                                {
                                                    foreach (var visit in practTimeline.ReAccreditationVisits)
                                                    {
                                                        if (visit.DueDate <= DateTime.Now.AddDays(14))
                                                        {
                                                            visitType = "First Re-accreditation";
                                                        }
                                                    }
                                                }
                                                replacements.Add(new TagsReplacements()
                                                {
                                                    FindValue = "VisitType",
                                                    ReplacementValue = visitType //First PQA / Re-accreditation = show First PQA if that is the upcoming visit for which the self-assessment form is required; else show Re-accreditation if that is the upcoming visit for which the self-assessment is required.
                                                });
                                                replacements.Add(new TagsReplacements()
                                                {
                                                    FindValue = "PractitionerFirstName",
                                                    ReplacementValue = pracName
                                                });
                                                replacements.Add(new TagsReplacements()
                                                {
                                                    FindValue = "PractitionerUserId",
                                                    ReplacementValue = prac.UserId.ToString()
                                                });
                                                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachSelfAssessmentFormReminder, DateTime.Now.Date, coachToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(14), false, true, pracName, prac.UserId.ToString());
                                            }
                                        }
                                    }
                                }

                                ////5) Overdue visits - find any trainees/practitioners that are overdue any visits                    
                                if (practTimeline.RequestedCoachVisits.Any())
                                {
                                    foreach (var item in practTimeline.RequestedCoachVisits)
                                    {
                                        if (item.DueDate < DateTime.Now)
                                        {
                                            overdueVisists = true;
                                        }
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError("Issue with practitioner timeline in DailyCoachChecksPractitionersNotification " + ex.Message, ex);
                        }
                    }

                    if (overdueVisists)
                    {
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachVisitsOverdue, DateTime.Now.Date, coachToSend, "", MessageStatusConstants.Red, null, DateTime.Now.AddDays(2), false, true);
                    }
                }

            }
            _logger.LogInformation("DailyCoachChecksPractitionersNotification ended at " + DateTime.Now);
        }



    }
}
