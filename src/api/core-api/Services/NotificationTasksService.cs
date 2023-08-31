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

namespace ECDLink.Core.Services
{
    public class NotificationTasksService : INotificationTasksService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly INotificationService _notificationService;
        private readonly IncomeExpenseService _incomeService;

        public NotificationTasksService(
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            [Service] UserManager<ApplicationUser> userManager,
            HierarchyEngine hierarchyEngine)
        {
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _notificationService = notificationService;
            _userManager = userManager;
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
                    string parentUserId = _hierarchyEngine.GetUserParentUserId(child.User.Id);
                    var userToSend = await _userManager.FindByIdAsync(parentUserId);
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
            replacements.Add(new TagsReplacements()
            {
                FindValue = "StatementMonth",
                ReplacementValue = DateTime.Now.AddMonths(-1).Month.ToString("ddd")
            }); ;
            replacements.Add(new TagsReplacements()
            {
                FindValue = "StatementCutOffDate",
                ReplacementValue = DateTime.Now.GetStartOfMonth().AddDays(7).ToString()
            });
            foreach (var pracData in pracsDueSubmits)
            {
                DateTime duePeriod = pracData.Value;
                var userToSend = await _userManager.FindByIdAsync(pracData.Key.ToString());
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.IncomeStatementIncompleteBy1st, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
            }
        }

        public async Task WeeklyAttendancesReminderAsync()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();

            var pracsDueSubmits = _incomeService.GetUnsubmittedStatements();
            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "StatementMonth",
                ReplacementValue = DateTime.Now.AddMonths(-1).Month.ToString("ddd")
            }); ;
            replacements.Add(new TagsReplacements()
            {
                FindValue = "StatementCutOffDate",
                ReplacementValue = DateTime.Now.GetStartOfMonth().AddDays(7).ToString()
            });
            foreach (var pracData in pracsDueSubmits)
            {
                DateTime duePeriod = pracData.Value;
                var userToSend = await _userManager.FindByIdAsync(pracData.Key.ToString());
                await _notificationService.SendNotificationAsync(null, TemplateTypeConstants.AttendanceWeekly, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(7));
            }
        }



    }
}
