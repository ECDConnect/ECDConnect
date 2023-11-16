using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Entities.Notifications;
using System.Collections.Generic;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using System.Linq;
using ECDLink.DataAccessLayer.Repositories;
using EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Documents;

namespace ECDLink.Core.Services
{
    public class NotificationTasksService : INotificationTasksService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly INotificationService _notificationService;
        private readonly IIncomeExpenseService _incomeService;
        private readonly AttendanceTrackingRepository _attendanceTrackingRepository;
        IHolidayService<Holiday> _holidayService;

        public NotificationTasksService(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IIncomeExpenseService incomeService,
            HierarchyEngine hierarchyEngine, 
            [Service] AttendanceTrackingRepository attendanceTrackingRepository, 
            IHolidayService<Holiday> holidayService)
        {
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _notificationService = notificationService;
            _userManager = userManager;
            _attendanceTrackingRepository = attendanceTrackingRepository;
            _holidayService = holidayService;
            _incomeService = incomeService;
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
                from classroomGroupData in classroomGroupRepo.GetAll().Where(x => x.UserId == null)
                join classroomData in classroomRepo.GetAll() on classroomGroupData.ClassroomId equals classroomData.Id
                join principalData in principalRepo.GetAll().Where(p => (p.IsPrincipal == true || p.IsFundaAppAdmin == true)) on classroomData.UserId equals principalData.UserId
                select new { classroomData, principalData.User }
            ).OrderByDescending(y => y.classroomData.InsertedDate).ToList();

            foreach (var unassignedClass in unassignedClassroom)
            {
                List<TagsReplacements> replacements = new List < TagsReplacements >();
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "ClassName",
                    ReplacementValue = unassignedClass.classroomData.Name
                });
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.UnassignedClasses, DateTime.Now, unassignedClass.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
            }
        }

        public async Task DailyChildrenRegistrationsIncompleteNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: adminId);

            //find the principal that owns the classroomgroup and message them
            var unregisteredChildren = childRepo.GetAll().Where(p => p.InsertedDate <= DateTime.Now.AddDays(-20) && p.CaregiverId == null).ToList();
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
                        ReplacementValue = DateTime.Now.AddDays(30).ToLongDateString()
                    });
                    var parentUserId = _hierarchyEngine.GetUserParentUserId(child.User.Id);
                    var userToSend = await _userManager.FindByIdAsync(parentUserId.Value.ToString());
                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ChildRegistrationIncomplete, DateTime.Now, userToSend, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(7));
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
                from classroomGroupData in classroomGroupRepo.GetAll().Where(x => x.Name == "Unsure")
                join learnerData in learnerRepo.GetAll() on classroomGroupData.Id equals learnerData.ClassroomGroupId
                join childData in childRepo.GetAll() on learnerData.UserId equals childData.UserId
                join classroomData in classroomRepo.GetAll() on classroomGroupData.ClassroomId equals classroomData.Id
                join principalData in principalRepo.GetAll().Where(p => (p.IsPrincipal == true || p.IsFundaAppAdmin == true)) on classroomData.UserId equals principalData.UserId
                select new { classroomData, principalData.User }
            ).OrderByDescending(y => y.classroomData.InsertedDate).ToList();

            foreach (var child in unassignedChildren)
            {
                if (child.User != null)
                {
                    List<TagsReplacements> replacements = new List<TagsReplacements>();
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "ChildsName",
                        ReplacementValue = child.User != null ? child.User.FirstName + " " + child.User.Surname : "Child"
                    });
                    await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ChildNotAssignedToClass, DateTime.Now, child.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
                }
            }
        }

        public async Task Daily3WeekLogonCheck()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var principalRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);

            var userNotLoggedIn = principalRepo.GetAll().Where(p => p.User.LastSeen <= DateTime.Now.AddDays(-21).Date).ToList();

            foreach (var user in userNotLoggedIn)
            {
                List<TagsReplacements> replacements = new List<TagsReplacements>();
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ThreeWeekLoginNotification, DateTime.Now, user.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
            }
        }

        public async Task DailyUnassignedProgrammesNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();

            var principalRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            var classRoomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: adminId);
            var classRoomRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: adminId);

            var unassignedClasses =
              (
                  from classroomGroupData in classRoomGroupRepo.GetAll().Where(x => x.UserId == null)
                  join classroomData in classRoomRepo.GetAll() on classroomGroupData.ClassroomId equals classroomData.Id
                  join principalData in principalRepo.GetAll().Where(p => (p.IsPrincipal == true || p.IsFundaAppAdmin == true)) on classroomData.UserId equals principalData.UserId
                  select new { classroomGroupData, principalData.User }
              ).OrderByDescending(y => y.classroomGroupData.InsertedDate).ToList();

            foreach (var classroom in unassignedClasses)
            {
                List<TagsReplacements> replacements = new List<TagsReplacements>();
                replacements.Add(new TagsReplacements()
                {
                    FindValue = "ClassName",
                    ReplacementValue = classroom.classroomGroupData.Name
                });
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.UnassignedClasses, DateTime.Now, classroom.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
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
                ReplacementValue = DateTime.Now.GetStartOfMonth().AddDays(7).ToString()
            });

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
                    FindValue = "StatementCutOffDate",
                    ReplacementValue = isStipendReceiver ? stipendText : ""
                });

                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.IncomeStatementIncompleteBy1st, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
            }
        }

        public async Task MonthlyStartupSupportEndReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            var practitioners = practitionerRepo.GetAll().Where(x => x.IsActive.Equals(true) && (x.IsPrincipal.Equals(true) || x.IsFundaAppAdmin.Equals(true))).ToList();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            //replacements.Add(new TagsReplacements()
            //{
            //    FindValue = "EndMonth",
            //    ReplacementValue = startupsupportEndDate.Month.ToString("ddd")
            //});
            //replacements.Add(new TagsReplacements()
            //{
            //    FindValue = "EndYear",
            //    ReplacementValue = startupsupportEndDate.Year.ToString()
            //});
            foreach (var pracData in practitioners)
            {
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.StartupSupportEndingIn2Months, DateTime.Now, pracData.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
            }
        }
        public async Task MonthlyPlanningReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: adminId);
            //find all practitioners that has not yet created planning for their classes after a month of having the class
            var practitioners = practitionerRepo.GetAll().Where(x => x.IsActive.Equals(true) && (x.IsPrincipal.Equals(true) || x.IsFundaAppAdmin.Equals(true))).ToList();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            foreach (var pracData in practitioners)
            {
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.PlanYourProgrammes, DateTime.Now, pracData.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
            }
        }

        public async Task MonthlyPointsgReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.MonthlyPointsReminderA, DateTime.Now, null, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
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
            List<Practitioner> principals = practitionerRepo.GetAll().Where(x => x.IsActive.Equals(true) && (x.IsPrincipal.Equals(true) || x.IsFundaAppAdmin.Equals(true))).ToList();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "CurrentYear",
                ReplacementValue = DateTime.Now.Year.ToString()
            });
            foreach (var item in principals)
            {
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.UpdatePreschoolFee, DateTime.Now, item.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(31));
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
                        await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.SubmitWeeksAttendance, DateTime.Now, requiredAttendance.practitionerData.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(2));
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
                var docs = docRepo.GetAll().Where(d => d.UserId == requiredAttendance.entityData.UserId && d.DocumentTypeId.Equals(attendancePDF.Id)).ToList();
                //TODO: finish gathering docs and sending to SL


            }
        }

        public async Task DailyAttendanceNotTrackedNotification()
        {
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
                            await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.SubmitDailyAttendance, DateTime.Now, requiredAttendance.practitionerData.User, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(1));
                        }
                    }
                }
            //}
            }

        public async Task WeeklyCoachTraineesCheckReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            var traineeRepo = _repositoryFactory.CreateGenericRepository<Trainee>(userContext: adminId);
            //find all practitioners that has not yet created planning for their classes after a month of having the class
            var newTrainee = traineeRepo.GetAll().Where(x => x.IsActive.Equals(true) && x.InsertedDate >= DateTime.Now.AddDays(-7)).ToList();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            foreach (var trainee in newTrainee)
            {
                var parentUserId = trainee.CoachHierarchy != null ? trainee.CoachHierarchy : _hierarchyEngine.GetUserParentUserId(trainee.UserId).Value;
                var userToSend = await _userManager.FindByIdAsync(parentUserId.Value.ToString());
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.CoachNewTrainees, DateTime.Now, userToSend, "", MessageStatusConstants.Green, replacements, DateTime.Now.AddDays(2));
            }
        }



    }
}
