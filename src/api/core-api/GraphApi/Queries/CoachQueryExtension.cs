using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Classroom;
using EcdLink.Api.CoreApi.GraphApi.Models.Portal;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class CoachQueryExtension
    {
        public CoachQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<CoachPractitioner> GetAllPractitionersForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] PersonnelService personnelService,
            [Service] VisitManager visitManager,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var practitioners = dbRepo.GetAll().Where(x => x.IsActive && x.CoachHierarchy.HasValue && x.CoachHierarchy.Value == Guid.Parse(userId)).ToList();
            var coachPractitioners = new List<CoachPractitioner>();

            foreach (var practitioner in practitioners)
            {
                coachPractitioners.Add(new CoachPractitioner
                {
                    Id = practitioner.Id,
                    UserId = practitioner.UserId.Value,
                    ProgrammeType = practitioner.ProgrammeType,
                    timeline = personnelService.GetPractitionerTimeline(practitioner.UserId.ToString())
                });
            }

            return coachPractitioners;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Coach GetCoachByCoachUserId(
            [Service] VisitManager visitManager,
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            Coach coach = dbRepo.GetByUserId(userId);

            List<Visit> visits = visitManager.GetVisitsForClient(userId, Constants.SSSettings.client_coach);

            coach.PractitionerVisits = visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_practitioner_visit || x.VisitType.Name == Constants.SSSettings.visitType_practitioner_call).ToList();

            return coach;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Coach GetCoachByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            //this was used wrong in FE, so adjust to align with FE
            return GetCoachByPractitionerId(contextAccessor, repoFactory, userId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public string GetCoachNameByUserId([Service] ApplicationUserManager userManager,
        string userId)
        {
            var user = userManager.FindByIdAsync(userId).Result;
            return user != null ? user.FullName : null;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Coach GetCoachByPractitionerId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string practitionerId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);

            Practitioner pract = dbRepo.GetByUserId(practitionerId);
            if (pract != null && pract.CoachHierarchy.HasValue)
            {
                var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
                return coachRepo.GetByUserId(pract.CoachHierarchy.ToString());
            }
            else return null;
        }

        public List<Child> GetAllChildrenForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            string userId)
        {

          List<Child> children = [.. dbContext.Children.FromSql($@"
                                        SELECT c.* 
                                        FROM ""Child"" c 
                                        JOIN ""Practitioner"" p ON c.""Hierarchy"" LIKE p.""Hierarchy"" || '%'
                                        WHERE p.""CoachHierarchy"" = {userId}::uuid AND c.""IsActive"" is true
                                        ")];
          return children;
        }

       public List<Classroom> GetAllClassroomsForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            string userId)
        {
            List<Classroom> classrooms = [.. dbContext.Classrooms.FromSql($@"
                                        SELECT c.* 
                                        FROM ""Classroom"" c 
                                        JOIN ""Practitioner"" p ON c.""UserId"" = p.""UserId""
                                        WHERE p.""CoachHierarchy"" = {userId}::uuid AND c.""IsActive"" is true
                                        ")];

            return classrooms;
        }
        public List<ClassroomGroupModel> GetAllClassroomGroupsForCoach(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IClassroomService classroomService,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);

            var userIdGuid = new Guid(userId);

            List<ClassroomGroupModel> classrooms = new List<ClassroomGroupModel>();
            var dbRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = dbRepo.GetAll().Where(x => x.CoachHierarchy == userIdGuid).ToList();
            foreach (var practioner in practitioners)
            {
                var classroomGroups = classroomService.GetClassroomGroupsForUser(practioner.User.Id);
                if (classroomGroups == null)
                {
                    return null;
                }

                var practitionerClasses = classroomGroups.Select(x => new ClassroomGroupModel
                {
                    Id = x.Id,
                    ClassroomId = x.ClassroomId,
                    Name = x.Name,
                    UserId = x.UserId.Value,
                    Learners = x.Learners.Select(y => new BaseLearnerModel
                    {
                        LearnerId = y.Id,
                        ChildUserId = y.UserId.Value,
                        StartedAttendance = y.StartedAttendance,
                        StoppedAttendance = y.StoppedAttendance,
                        IsActive = y.IsActive,
                    }).ToList(),
                    ClassProgrammes = x.ClassProgrammes.Where(x => x.IsActive).ToList(),
                }).ToList();

                classrooms.AddRange(practitionerClasses);
            }
            return classrooms.DistinctBy(x => x.Id).ToList();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        [UseFiltering]
        [UseSorting]
        public List<PortalCoachModel> GetAllPortalCoaches(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            CancellationToken cancellationToken,
            PagedQueryInput pagingInput = null,
            string search = null,
            List<string> connectUsageSearch = null
            )
        {
            var uId = contextAccessor.HttpContext.GetUser()?.Id;
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var shortenUrlEntityRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: uId);
            var sixMonthsAgo = DateTime.Now.AddMonths(-6).GetStartOfMonth().Date;

            if (cancellationToken.IsCancellationRequested)
            {
                return null;
            }

            var coachQuery = coachRepo.GetAll(pagingInput);
            // General search term
            if (!string.IsNullOrWhiteSpace(search))
            {
                coachQuery = coachQuery
                    .Where(h =>
                        EF.Functions.ILike(h.User.FullName, $"%{search}%")
                        || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                        || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                        || EF.Functions.ILike(h.User.Email, $"%{search}%"));
            }
            
            var userIds = coachQuery.Select(x => x.UserId.Value).ToList();
            var invitations = shortenUrlEntityRepo.GetAll()
                .Where(x =>
                    userIds.Contains(x.UserId.Value)
                    && (x.MessageType == TemplateTypeConstants.Invitation)
                    && x.IsActive
                    && x.Clicked == 0)
                .Select(x => new { x.UserId, x.InsertedDate, x.NotificationResult })
                .OrderByDescending(x => x.InsertedDate)
                .GroupBy(x => x.UserId);


            var invitationDates = invitations.ToDictionary(x => x.Key, x => x.Last().InsertedDate);
            var invitationNotifications = invitations.ToDictionary(x => x.Key, x => x.Last().NotificationResult);

            var coachModels = coachQuery
                .Select(item => new PortalCoachModel
                {
                    Id = item.Id,
                    IsRegistered = (item.IsRegistered == null ? false : (bool)item.IsRegistered),
                    UserId = item.UserId,
                    InsertedDate = item.InsertedDate.Date,
                    User = new PortalCoachUserModel(item.User,
                                                    (item.IsRegistered == null ? false : (bool)item.IsRegistered),
                                                    invitationDates.ContainsKey(item.UserId) ? invitationDates[item.UserId] : null,
                                                    invitationNotifications.ContainsKey(item.UserId) ? invitationNotifications[item.UserId] : null)
                })
                .ToList();

            List<PortalCoachModel> filteredUsers = new List<PortalCoachModel>();
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_invitation_active))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_invitation_expired))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_past_6_months))
            {
                filteredUsers.AddRange(coachModels.Where(x =>
                    x.IsRegistered
                    && x.User.IsActive
                    && x.User.LastSeen.Date >= sixMonthsAgo));
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_over_6_months))
            {
                filteredUsers.AddRange(coachModels.Where(x =>
                    x.IsRegistered
                    && x.User.IsActive
                    && x.User.LastSeen.Date <= sixMonthsAgo));
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_removed))
            {
                filteredUsers.AddRange(coachModels.Where(x => x.User.IsActive == false).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_authentication))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_connection))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_insufficient_credits))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_opted_out))
            {
                filteredUsers.AddRange(coachModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            return connectUsageSearch.Any() ? filteredUsers.DistinctBy(x => x.Id).ToList() : coachModels;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<FileModel> CoachTemplateGenerator(
            [Service] IFileGenerationService fileService)
        {
            var fieldDefinitionSheet = $"Field Definition";
            var fieldDefinitionList = new List<List<string>>
            {
                new List<string> {"Column", "Type Description"},
                new List<string> {"Type of identification", "Text, (Must be: 'id' or 'passport')"},
                new List<string> {"ID number", "Number, (required if type of identification is 'id'; must be 13 digits)"},
                new List<string> {"Passport", "Text, (required if type of identification is 'passport')"},
                new List<string> {"First name", "Text, (required)"},
                new List<string> {"Surname", "Text, (required)"},
                new List<string> {"Cellphone number", "Number, (required, 9 or 10 digits)"},
            };

            var templateHeaderSheet = $"{TenantExecutionContext.Tenant.Modules.CoachRoleName} Template";
            var templateHeaders = new List<List<string>>()
            {
                new List<string> 
                {
                    "Type of identification",
                    "ID number",
                    "Passport",
                    "First name",
                    "Surname",
                    "Cellphone number"
                }
            };

            var spreadSheets = new Dictionary<string, List<List<string>>>() {
                { templateHeaderSheet, templateHeaders },
                { fieldDefinitionSheet, fieldDefinitionList }
            };

            var fileName = templateHeaderSheet.Replace(" ", "_");
            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public CoachStatsModel GetCoachStats(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] IClassroomService classroomService,
            [Service] MonthlyAttendanceReport monthlyAttendanceReport,
            [Service] AttendanceService attendanceService,
            Guid userId,
            DateTime startDate,
            DateTime? endDate = null)
        {
            CoachStatsModel stats = new CoachStatsModel();
            if (endDate == null)
            {
                endDate = startDate.AddMonths(1);
            }

            var uId = contextAccessor.HttpContext.GetUser()?.Id;
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var childProgressReportRepo = repoFactory.CreateGenericRepository<ChildProgressReport>(userContext: uId);
            var childProgressReportPeriodRepo = repoFactory.CreateRepository<ChildProgressReportPeriod>(userContext: uId);
            var statementsRepo = repoFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: uId);
            var learnerRepo = repoFactory.CreateGenericRepository<Learner>(userContext: uId);
            var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: uId);

            var coach = coachRepo.GetByUserId(userId);
            var records = practitionerRepo.GetAll().Where(x => x.IsActive == true && x.CoachHierarchy == userId).ToList();

            var principalUserIds = records.Where(x => x.IsPrincipalOrAdmin()).Select(x => x.UserId).Distinct().ToList();
            var allUserIds = records.Where(x => x.IsRegistered == true).Select(x => x.UserId).Distinct().ToList();

            stats.TotalPractitioners = records.Select(x => x.UserId).Distinct().Count();
            stats.TotalNewPractitioners = records.Where(x => x.InsertedDate.Date >= startDate.Date && x.InsertedDate.Date <= endDate.Value.Date).Count();
            stats.TotalSiteVisits = coach.PractitionerVisits != null ? coach.PractitionerVisits.Where(x => x.IsActive && x.ActualVisitDate.Value.Date >= startDate.Date && x.ActualVisitDate.Value.Date <= endDate.Value.Date).Count() : 0;

            var start = startDate.Date;
            var end = endDate.Value;

            // set end-date to end of month
            end = new DateTime(end.Year, end.Month, DateTime.DaysInMonth(end.Year, end.Month));

            var months = Enumerable.Range(0, Int32.MaxValue)
                                 .Select(e => start.AddMonths(e))
                                 .TakeWhile(e => e <= end)
                                 .Select(e => e.Month).Distinct().ToList();

            var years = Enumerable.Range(0, Int32.MaxValue)
                                 .Select(e => start.AddMonths(e))
                                 .TakeWhile(e => e <= end)
                                 .Select(e => e.Year).Distinct().ToList();

            var statementData = statementsRepo.GetAll().Where(x => x.IsActive == true 
                                                                   && principalUserIds.Contains(x.UserId) 
                                                                   && years.Contains(x.Year)
                                                                   && months.Contains(x.Month)).ToList();
            var usersIdsWithStatements = statementData.Where(x => principalUserIds.Contains(x.UserId)).Select(x => x.UserId).ToList();
            var usersIdsWithNoStatements = principalUserIds.Where(x => !usersIdsWithStatements.Contains(x)).Count();


            stats.TotalWithNoIncomeExpense = statementData.Where(x => x.IncomeItems.Count == 0 && x.ExpenseItems.Count == 0).Select(x => x.UserId).Distinct().Count() + usersIdsWithNoStatements;
            stats.TotalWithIncomeExpense = statementData.Where(x => x.IncomeItems.Count > 0 || x.ExpenseItems.Count > 0).Select(x => x.UserId).Distinct().Count(); ;

            var lessThan75 = 0;
            var moreThan75 = 0;

            var attendanceStart = startDate.Date;
            foreach (var id in allUserIds)
            {
                var userMonthReports = new List<MonthlyAttendanceReportModel>();

                foreach (var month in months)
                {
                    var monthReport = monthlyAttendanceReport.GenerateMonthlyAttendanceReport(userId.ToString(), attendanceStart.GetStartOfMonth(), attendanceStart.GetEndOfMonth()).FirstOrDefault();
                    if (monthReport != null)
                    {
                        userMonthReports.Add(monthReport);
                    }
                    attendanceStart = attendanceStart.AddMonths(1);
                }

                if (userMonthReports.Count == 0)
                {
                    lessThan75++;
                }
                else
                {
                    var less = userMonthReports.Where(x => x.PercentageAttendance < 75).Count();
                    var more = userMonthReports.Where(x => x.PercentageAttendance >= 75).Count();

                    if (less >= 0)
                    {
                        lessThan75++;
                    }
                    if (more > 0)
                    {
                        moreThan75++;
                    }
                }
                
            }
            stats.TotalLessThan75AttendanceRegisters = lessThan75;
            stats.TotalMoreThan75hAttendanceRegisters = moreThan75;

            var totalWithNoProgressReports = 0;
            var totalWithProgressReports = 0;
            foreach (var id in allUserIds)
            {
                var classroom = classroomService.GetClassroomForUser((Guid)id);
                var progressPeriodIds = childProgressReportPeriodRepo.GetAll()
                                                                 .Where(x => x.IsActive
                                                                    && x.ClassroomId == classroom.Id
                                                                    && ((x.StartDate.Date >= startDate.Date && x.StartDate.Date <= endDate.Value.Date)
                                                                    || (x.EndDate.Date >= startDate.Date && x.EndDate.Date <= endDate.Value.Date)))
                                                                 .Select(x => x.Id)
                                                                 .ToList();

                // this take the principal vs practitioner role into account
                var classroomGroups = attendanceService.GetUserClassroomGroups(id.ToString());
                var totalLearners = classroomGroups.SelectMany(x => x.Learners.Where(y => y.IsActive && !y.StoppedAttendance.HasValue)).Count();
                
                foreach (var periodId in progressPeriodIds)
                {
                    var progressData = childProgressReportRepo.GetAll().Where(x => x.IsActive == true && x.ChildProgressReportPeriodId == periodId).ToList();
                    if (progressData.Count == 0)
                    {
                        totalWithNoProgressReports++;
                    }
                    else
                    {
                        if (progressData.Count == totalLearners)
                        {
                            totalWithProgressReports++;
                        }
                        else
                        {
                            totalWithNoProgressReports++;
                        }
                    }
                }
            }
            
            stats.TotalWithNoProgressReports = totalWithNoProgressReports; // practitioners did not create progress reports for all children
            stats.TotalWithProgressReports = totalWithProgressReports;// practitioners did create progress reports for all children

            return stats;
        }
    }
}
