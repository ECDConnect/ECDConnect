using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.ChildProgress;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ReportQueryTypeExtension
    {

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public PractitionerMetricReport GetPractitionerMetrics(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var practitionerMetricReport = new PractitionerMetricReport();
            practitionerMetricReport.AvgChildren = 0;
            practitionerMetricReport.CompletedProfiles = 0;
            practitionerMetricReport.OutstandingSyncs = 0; // TODO: ADD
            practitionerMetricReport.ProgramTypesData = new List<MetricReportStatItem>();
            practitionerMetricReport.StatusData = new List<MetricReportStatItem>();

            var userId = contextAccessor.HttpContext.GetUser().Id;

            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: userId);
            var programmeTypeRepo = repoFactory.CreateRepository<ProgrammeType>(userContext: userId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: userId);
            var childRepo = repoFactory.CreateRepository<Child>(userContext: userId);

            var allClassrooms = classroomRepo.GetAll();
            var allProgrammeTypes = programmeTypeRepo.GetAll();
            var allChildren = childRepo.GetAll();
            var allPractitioners = practitionerRepo.GetAll();
            var allClassroomGroups = classroomGroupRepo.GetAll().ToList();

            var practitionerCount = allPractitioners.Where(x => x.IsActive).Count();
            var childCount = allChildren.Where(x => x.IsActive).Count();
            practitionerMetricReport.AvgChildren = practitionerCount > 0 && childCount > 0 ? childCount / practitionerCount : 0;
            practitionerMetricReport.CompletedProfiles = allClassrooms.Where(x => x.IsActive).Count();

            foreach (var programType in allProgrammeTypes)
            {
                var classroomGroupProgramTypeGroup = allClassroomGroups.Where(x => x.ProgrammeTypeId == programType.Id).GroupBy(x => x.ClassroomId);
                var classroomGroupProgramTypeGroupCount = classroomGroupProgramTypeGroup.Count();
                practitionerMetricReport.ProgramTypesData.Add(new MetricReportStatItem() { Name = programType.Description, Value = classroomGroupProgramTypeGroupCount.ToString() });
            }


            practitionerMetricReport.StatusData.Add(new MetricReportStatItem() { Name = "Active", Value = allPractitioners.Where(x => x.IsActive).Count().ToString() });
            practitionerMetricReport.StatusData.Add(new MetricReportStatItem() { Name = "InActive", Value = allPractitioners.Where(x => !x.IsActive).ToString() });


            return practitionerMetricReport;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public int GetPractitionerNewSignupMetric(
            [Service] IHttpContextAccessor contextAccessor, IGenericRepositoryFactory repoFactory, DateTime fromDate,
            DateTime toDate)
        {
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            var allPractitioners = practitionerRepo.GetAll();
            var newPractitioners = allPractitioners.Where(f => f.InsertedDate >= fromDate && f.InsertedDate < toDate).Count();

            return newPractitioners;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public ChildrenMetricReport GetChildrenMetrics(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] AttendanceTrackingRepository attendanceRepo)
        {
            var userId = contextAccessor.HttpContext.GetUser().Id;

            var childrenMetricReport = new ChildrenMetricReport();
            childrenMetricReport.TotalChildren = 0;
            childrenMetricReport.TotalChildProgressReports = 0;
            childrenMetricReport.UnverifiedDocuments = 0;
            childrenMetricReport.StatusData = new List<MetricReportStatItem>();
            childrenMetricReport.ChildAttendacePerMonthData = new List<MetricReportStatItem>();

            var startOfYear = DateTime.Now.GetStartOfYear();
            var endOfYear = DateTime.Now.GetEndOfYear();

            var attendaceRepo = attendanceRepo.GetAllByDateRangeByFullMonth(startOfYear, endOfYear);
            var childRepo = repoFactory.CreateRepository<Child>(userContext: userId);
            var documentRepo = repoFactory.CreateRepository<Document>(userContext: userId);
            var workflowStatusRepo = repoFactory.CreateRepository<WorkflowStatus>(userContext: userId);
            var childProgressReportRepo = repoFactory.CreateRepository<ChildProgressReport>(userContext: userId);

            var allWorkflowStatus = workflowStatusRepo.GetAll();
            var allChildren = childRepo.GetAll().ToList();

            childrenMetricReport.TotalChildren = allChildren.Count();
            childrenMetricReport.TotalChildProgressReports = childProgressReportRepo.GetAll().Count();
            childrenMetricReport.UnverifiedDocuments = documentRepo.GetAll().Where(x => x.WorkflowStatus.EnumId == WorkflowStatusEnum.DocumentPendingVerification).Count();

            // TODO: CREATE A CONSTANT ENUM FOR WORKSTATUS TYPES
            foreach (var workflowStatus in allWorkflowStatus.Where(x => x.WorkflowStatusType.Description == "Child"))
            {
                var childrenWithStatusCount = allChildren.Where(x => x.WorkflowStatusId == workflowStatus.Id).Count();
                childrenMetricReport.StatusData.Add(new MetricReportStatItem() { Name = workflowStatus.Description, Value = childrenWithStatusCount.ToString() });
            }

            for (int i = 0; i <= 11; i++)
            {
                var month = CultureInfo.CurrentCulture.DateTimeFormat.MonthNames[i];
                var attendanceCount = attendaceRepo.Where(x => x.AttendanceDate.Month == i).Count();
                childrenMetricReport.ChildAttendacePerMonthData.Add(new MetricReportStatItem() { Name = month, Value = attendanceCount.ToString() });
            }


            return childrenMetricReport;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<MetricReportStatItem> GetChildrenAttendedVsAbsentMetrics([Service] AttendanceTrackingRepository attendanceRepo,
            DateTime fromDate,
            DateTime toDate)
        {
            var attendedVsAbsent = new List<MetricReportStatItem>();

            var attendaceRepo = attendanceRepo.GetAllByDateRangeByFullMonth(fromDate, toDate);

            var attendanceAttended = attendaceRepo.Where(x => x.Attended).Count();
            var attendanceUnAttended = attendaceRepo.Where(x => !x.Attended).Count();

            attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Attended", Value = attendanceAttended.ToString() });
            attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Absent", Value = attendanceUnAttended.ToString() });


            return attendedVsAbsent;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<ClassroomMetricReport> GetClassAttendanceMetrics(
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] AttendanceService attendanceService,
            DateTime startMonth,
            DateTime endMonth)
        {
            List<Practitioner> practitioners = attendanceService.GetPractitionersByHierarchy();

            List<ClassroomMetricReport> metrics = new List<ClassroomMetricReport>();
            foreach (var practitioner in practitioners)
            {
                var metric = GetClassAttendanceMetricsByUser(attendanceRepo, attendanceService, practitioner.UserId.ToString(), startMonth.Date, endMonth.GetEndOfDay());
                if (metric.Any())
                {
                    metrics.AddRange(metric);
                }

            }
            return metrics;
        }


        public List<ClassroomMetricReport> GetClassAttendanceByUser(
                    [Service] AttendanceTrackingRepository attendanceRepo,
                    [Service] AttendanceService attendanceService,
                    [Service] AuthenticationDbContext dbContext,
                    string userId,
                    DateTime startMonth,
                    DateTime endMonth)
        {
            var metric = new List<ClassroomMetricReport>();

            var fromDate = startMonth.GetStartOfMonth();
            var toDate = endMonth.GetEndOfMonth().GetEndOfDay();

            var classroomGroups = attendanceService.GetUserClassroomGroups(userId);

            var results = dbContext.Learners
            .Where(x => classroomGroups.Select(a => a.Id).Contains(x.ClassroomGroupId))
            .Join(dbContext.Attendances,
                    l => l.UserId,
                    a => a.UserId,
                    (l, a) => new { Learner = l, Attendance = a })
            .Where(joined => joined.Attendance.MonthOfYear == fromDate.Month
                     && joined.Attendance.Year == fromDate.Year
                     && joined.Attendance.AttendanceDate >= fromDate)
            .ToList();

            var distinctLearnerCount = results
                .Select(joined => joined.Learner)
                .Distinct()
                .Count();

            var attendance = results
                .Select(joined => joined.Attendance)
                .ToList();

            var attended = attendance.Where(x => x.Attended).Count();
            var notAttended = attendance.Where(x => !x.Attended).Count();

            int attendancePercentage = (int)(attendance.Count() > 0 && attended > 0
                                                           ? Math.Round((double)(attended / (double)(attended + notAttended)) * 100)
                                                           : 0);

            metric.Add(
                    new ClassroomMetricReport()
                    {
                        ChildCount = distinctLearnerCount,
                        AttendancePercentage = attendancePercentage,
                    });

            return metric;
        }



        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<ClassroomMetricReport> GetClassAttendanceMetricsByUser(
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] AttendanceService attendanceService,
            string userId,
            DateTime startMonth,
            DateTime endMonth)
        {
            var metric = new List<ClassroomMetricReport>();

            var fromDate = startMonth.GetStartOfMonth();
            var toDate = endMonth.GetEndOfMonth().GetEndOfDay();

            var classroomGroups = attendanceService.GetUserClassroomGroups(userId);

            if (classroomGroups != null)
            {
                foreach (var group in classroomGroups)
                {
                    var learners = attendanceService.GetAllLearnerGroupInstances(group.Id);

                    int childCount = 0;
                    int month = fromDate.Month;
                    int year = fromDate.Year;
                    int weekOfYear = fromDate.GetWeekOfYear();

                    int attendancePercentage = 0;
                    var learnerReports = new List<ChildGroupingAttendanceReportModel>();

                    if (learners.Any())
                    {
                        foreach (Learner learner in learners)
                        {
                            if (learner.StartedAttendance >= fromDate)
                            {
                                childCount++;
                                var attendanceData = attendanceRepo.GetAllByDateRangeByClassroom(fromDate, toDate, group.Id, learner.UserId.ToString());
                                if (attendanceData.Any())
                                {
                                    var attendanceAttended = attendanceData.Where(x => x.Attended == true).Count();
                                    var attendanceUnAttended = attendanceData.Where(x => x.Attended == false).Count();
                                    if (attendanceAttended > 0)
                                    {
                                        attendancePercentage =
                                            (int)(childCount > 0 && attendanceAttended > 0
                                                ? Math.Round((double)(attendanceAttended / (double)(attendanceAttended + attendanceUnAttended)) * 100)
                                                : 0);
                                    }

                                    //override month and year to attendance month and year
                                    month = attendanceData.FirstOrDefault().MonthOfYear;
                                    year = attendanceData.FirstOrDefault().Year;
                                    weekOfYear = attendanceData.FirstOrDefault().WeekOfYear;
                                }
                            }
                        }
                    }
                    metric.Add(
                        new ClassroomMetricReport()
                        {
                            ChildCount = childCount,
                            AttendancePercentage = attendancePercentage,
                            ClassroomGroupId = group.Id.ToString(),
                            ClassroomId = group.ClassroomId.ToString(),
                            Month = month,
                            Year = year,
                            WeekOfYear = weekOfYear,
                            PractitionerId = userId
                        });
                }
            }

            return metric;
        }


        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<ClassroomMetricReport> GetYearlyClassAttendanceMetricsByUser(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] AttendanceTrackingRepository attendanceRepo,
            string userId)
        {

            var uId = contextAccessor.HttpContext.GetUser().Id;

            DateTime reference = DateTime.Now;

            List<ClassroomMetricReport> metrics = new List<ClassroomMetricReport>();
            var classRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classes = classRepo.GetAll(); //get all classrooms assigned to user

            for (int idx = 1; idx <= 12; idx++)
            {
                var fromDate = new DateTime(reference.Year, reference.Month, 1);
                fromDate = fromDate.AddMonths(-idx);
                var toDate = reference.AddMonths(idx + 1).AddDays(-1); //todate is always start of the month, + 1 month - 1 day gives the last day of that month

                var attendaceRepo = attendanceRepo.GetAllByDateRangeByFullMonth(fromDate, toDate);
                var attendanceAttended = attendaceRepo.Where(x => x.Attended).Count();
                var attendanceUnAttended = attendaceRepo.Where(x => !x.Attended).Count();

                foreach (var c in classes)
                {
                    //calculate attendance
                    var attendedVsAbsent = new List<MetricReportStatItem>();
                    attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Attended", Value = attendanceAttended.ToString() });
                    attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Absent", Value = attendanceUnAttended.ToString() });

                    var thisClass = new ClassroomMetricReport() { ChildCount = 4, AttendancePercentage = 75, ClassroomId = c.Id.ToString(), Month = fromDate.Month, Year = fromDate.Year };
                    metrics.Add(thisClass);
                }
            }

            return metrics;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<List<NotificationDisplay>> GetClassroomActionItems(
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IChildProgressReportService childProgressReportService,
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] IHolidayService<Holiday> holidayService,
            [Service] IClassroomService classroomService,
            [Service] ChildAttendanceReport attendanceReportService,
            [Service] AttendanceService attendanceService,
            [Service] MonthlyAttendanceReport monthlyAttendanceReportService,
            HierarchyEngine hierarchyEngine,
            string practitionerId)
        {
            var user = contextAccessor.HttpContext.GetUser();
            var uId = user?.Id ?? throw new ArgumentNullException("User.Id");

            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            var classReassignmentHistoryRepo = repoFactory.CreateGenericRepository<ClassReassignmentHistory>();

            var notifications = new List<NotificationDisplay>();

            var classroomGroups = classroomService.GetClassroomGroupsForUser(Guid.Parse(practitionerId));

            var practitionerHieracry = hierarchyEngine.GetUserHierarchy(Guid.Parse(practitionerId));
            var practitioner = practRepo.GetByUserId(practitionerId);

            DateTime currentDate = DateTime.Now;

            DateTime currentMonthStart = currentDate.GetStartOfMonth();
            DateTime currentMonthEnd = currentDate.GetEndOfMonth();

            DateTime previousMonthStart = currentDate.GetStartOfPreviousMonth();
            DateTime previousMonthEnd = currentDate.GetEndOfPreviousMonth();


            // Get Missing Attendance
            // Todo: move to service
            var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>();
            var programmeRepo = repoFactory.CreateGenericRepository<Programme>();
            var dailyProgrammeRepo = repoFactory.CreateGenericRepository<DailyProgramme>();
            var missingRegisterDayCount = await GetMissingAttendanceReportsAsync(
                holidayService,
                attendanceService,
                previousMonthStart,
                previousMonthEnd,
                practitioner);

            if (missingRegisterDayCount > 0)
            {
                notifications.Add(new NotificationDisplay()
                {
                    Subject = $"{missingRegisterDayCount} attendance registers not saved",
                    Icon = MetricsIconEnum.Error.ToString(),
                    Color = MetricsColorEnum.Error.ToString(),
                    Message = previousMonthStart.ToString("MMMM yyyy"),
                    Notes = "",
                    UserId = Guid.Parse(practitionerId),
                    UserType = "practitioner"
                });
            }

            // Get Attendance Rate - why is this just for one classroom group. TODO - fix for multiple classes
            if (classroomGroups.Any())
            {
                var monthlyReport = monthlyAttendanceReportService.GenerateMonthlyAttendanceReport(practitioner.UserId.ToString(), previousMonthStart, previousMonthEnd).SingleOrDefault();

                if (monthlyReport != null)
                {
                    if (monthlyReport.TotalScheduledSessions > 0)
                    {
                        var attendancePercentage = monthlyReport.PercentageAttendance;
                        if (attendancePercentage < 50)
                        {
                            ClassroomGroup group = classroomGroups.FirstOrDefault();
                            notifications.Add(new NotificationDisplay()
                            {
                                Subject = $"{attendancePercentage}% attendance rate",
                                Icon = MetricsIconEnum.Error.ToString(),
                                Color = MetricsColorEnum.Error.ToString(),
                                Message = $"{group.Name} - {previousMonthStart.ToString("MMMM yyyy")}",
                                Notes = "",
                                UserId = Guid.Parse(practitionerId),
                                UserType = "practitioner"
                            });
                        }
                    }
                }
            }


            //// TODO: Need to refactor dates for reporting periods
            //// Get Due/Overdue Reports
            //// Get Children not progressed
            //var isPeriod1 = previousMonthStart.Month <= 7;
            //DateTime reportPeriodStart = ChildProgressReportService.GetReportPeriodStart(previousMonthStart.Year, isPeriod1);
            //DateTime reportPeriodEnd = ChildProgressReportService.GetReportPeriodEnd(previousMonthStart.Year, isPeriod1);

            //DateTime reportDueStart = ChildProgressReportService.GetReportDueStart(previousMonthStart.Year, isPeriod1);
            //DateTime reportDueEnd = ChildProgressReportService.GetReportDueEnd(previousMonthStart.Year, isPeriod1);

            //var reportOverDueStart = ChildProgressReportService.GetReportOverDueStart(previousMonthStart.Year, isPeriod1);
            //var reportOverDueEnd = ChildProgressReportService.GetReportOverDueEnd(previousMonthStart.Year, isPeriod1);

            //// Notifications for child progress reports
            //var reportCounts = childProgressReportService.GetChildProgressReportStatusCountsForPractitioner(practitioner.Hierarchy, classroomGroups.Select(x => x.Id).ToList());
            //var childCount = reportCounts.reportsSubmittedOnTime + reportCounts.reportsSubmittedOverdue;

            //// If any children did not get a report submitted
            //if (practitioner?.IsPrincipal == true && reportCounts.reportsMissingOrIncomplete > 0
            //    && currentDate >= reportOverDueEnd)
            //{
            //    notifications.Add(new NotificationDisplay()
            //    {
            //        Subject = $"{reportCounts.reportsMissingOrIncomplete} missed progress reports",
            //        Icon = MetricsIconEnum.Error.ToString(),
            //        Color = MetricsColorEnum.Error.ToString(),
            //        Message = $"{reportPeriodStart.ToString("MMMM yyyy")} - {reportPeriodEnd.ToString("MMMM yyyy")}",
            //        Notes = "",
            //        UserId = Guid.Parse(practitionerId),
            //        UserType = "practitioner"
            //    });
            //}

            //// If any reports were submitted in the overdue period (2nd month of the submission window
            //if (reportCounts.reportsSubmittedOverdue > 0 && currentDate >= reportOverDueEnd)
            //{
            //    notifications.Add(new NotificationDisplay()
            //    {
            //        Subject = $"See progress summary",
            //        // TODO: Warnings or errors?
            //        Icon = MetricsIconEnum.None.ToString(),
            //        Color = MetricsColorEnum.None.ToString(),
            //        Message = $"{childCount} children",
            //        Notes = "",
            //        UserId = Guid.Parse(practitionerId),
            //        UserType = "practitioner"
            //    });
            //}

            return notifications;
        }


        private static (int notProgressedFor2Periods, int notProgressedFor3Periods) GetChildProgress(
            IGenericRepositoryFactory repoFactory,
            DateTime reportPeriodStart,
            List<Child> children)
        {
            // Get Child Ids
            var childIds = children
                .Select(c => (Guid)c.Id)
                .ToList();

            // Get Progress reports for last 2 years (4 periods)
            // TODO: use settings, what if periods change?
            var childProgressReportsFor2Years = repoFactory.CreateGenericRepository<ChildProgressReport>()
                .GetAll()
                .Where(r => childIds.Contains(r.ChildId)
                    && r.ChildProgressReportPeriod.StartDate >= reportPeriodStart.GetStartOfYear().AddYears(-2))
                .OrderBy(r => r.ChildProgressReportPeriod.StartDate);
            Dictionary<Guid, List<(DateTime, int)>> childProgressHistory = GetChildProgressHistory(childProgressReportsFor2Years);

            var hasProgressedInLast2Periods = 0;
            var hasProgressedInLast3Periods = 0;

            foreach (var childProgressList in childProgressHistory)
            {
                var ordered = childProgressList.Value.OrderByDescending(p => p.Item1);
                var last2 = ordered?.Take(2).ToList();
                var last3 = ordered?.Take(3).ToList();

                if (last2?.Count() == 2 && last2[0].Item2 > last2[1].Item2)
                    hasProgressedInLast2Periods++;

                if (last3?.Count() == 3)
                {
                    if ((last3[0].Item2 > last3[1].Item2)
                    || (last3[0].Item2 > last3[2].Item2)
                    || (last3[1].Item2 > last3[2].Item2))
                        hasProgressedInLast3Periods++;

                }
            }
            // Calculate count of children who haven't progressed
            int hasNotPorgressed2 = childIds.Count() - hasProgressedInLast2Periods;
            int hasNotPorgressed3 = childIds.Count() - hasProgressedInLast3Periods;

            return (hasNotPorgressed2, hasNotPorgressed3);
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<ActionItemMissedProgressReportsDisplay> GetActionItemMissedProgressReportsAsync(
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] IHolidayService<Holiday> holidayService,
            [Service] AttendanceService attendanceService,
            HierarchyEngine hierarchyEngine,
            string practitionerId)
        {
            var user = contextAccessor.HttpContext.GetUser();
            var uId = user?.Id ?? throw new ArgumentNullException("User.Id");
            var practitionerIdGuid = Guid.Parse(practitionerId);

            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var practitioner = practRepo.GetByUserId(practitionerId);

            var classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            var classroomGroups = await classroomGroupRepo
                .GetAll()
                .Where(c => c.UserId == practitionerIdGuid
                    || c.Classroom.UserId.ToString() == practitionerId)
                .ToListAsync();

            // TODO: use this to apply:
            // https://docs.google.com/spreadsheets/d/1xsS-JECUKWzj26sNcOllesCSZ39QwOh95T8goYdozbk/edit#gid=607178088&range=F71
            // "Note for all actions:
            // - Remove the action item either if the practitioner has completed the associated action and gone online + synced on Funda App(where possible)
            //   OR where the coach has tapped ""I have contacted Bulelwa""(if relevant) "
            //var coachHasContactedPractitionerRegardingThisItem = false;

            DateTime currentDate = DateTime.Now;

            DateTime previousMonthStart = currentDate.GetStartOfPreviousMonth();
            DateTime previousMonthEnd = currentDate.GetEndOfPreviousMonth();

            int missingRegisterDayCount = 0;
            // Get Missing Attendance
            // Todo: move to service
            var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>();
            var programmeRepo = repoFactory.CreateGenericRepository<Programme>();
            var dailyProgrammeRepo = repoFactory.CreateGenericRepository<DailyProgramme>();
            missingRegisterDayCount = await GetMissingAttendanceReportsAsync(
                holidayService,
                attendanceService,
                previousMonthStart,
                previousMonthEnd,
                practitioner);

            if (missingRegisterDayCount > 0)
            {
                // TODO: Need to refactor dates for reporting periods
                //var isPeriod1 = currentDate.Month <= 7;
                //DateTime currentReportingPeriodEnd = ChildProgressReportService.GetReportDueEnd(currentDate.Year, isPeriod1);
                //var isPreviousMonthPeriod1 = previousMonthStart.Month <= 7;
                //DateTime nextReportingPeriodEnd = ChildProgressReportService.GetNextReportDuePeriodEnd(previousMonthStart.Year, isPreviousMonthPeriod1);

                return new ActionItemMissedProgressReportsDisplay()
                {
                    Subject = $"{missingRegisterDayCount} missing attendance registers",
                    Icon = MetricsIconEnum.Error.ToString(),
                    Color = MetricsColorEnum.Error.ToString(),
                    Message = previousMonthStart.ToString("MMMM yyyy"),
                    //Notes = $"Remind {practitioner.User.FirstName} to track progress for the next reporting period ({nextReportingPeriodEnd.ToString("MMMM yyyy")})",
                    UserId = Guid.Parse(practitionerId),
                    UserType = "practitioner",
                    PractitionerUser = practitioner.User,
                    //NextReportingPeriodEnd = nextReportingPeriodEnd,
                    //CurrentReportingPeriodEnd = currentReportingPeriodEnd
                };
            }

            return null;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<List<ChildProgressDisplay>> GetActionItemChildProgress(
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor contextAccessor,
            HierarchyEngine hierarchyEngine,
            string practitionerId)
        {
            var user = contextAccessor.HttpContext.GetUser();
            var uId = user?.Id ?? throw new ArgumentNullException("User.Id");

            DateTime currentDate = DateTime.Now;

            // TODO: Need to refactor for reporting periods
            DateTime currentMonthStart = currentDate.GetStartOfMonth();
            DateTime currentMonthEnd = currentDate.GetEndOfMonth();

            DateTime previousMonthStart = currentDate.GetStartOfPreviousMonth();
            DateTime previousMonthEnd = currentDate.GetEndOfPreviousMonth();

            //var isPeriod1 = previousMonthStart.Month <= 7;
            //DateTime reportPeriodStart = ChildProgressReportService.GetReportPeriodStart(previousMonthStart.Year, isPeriod1);

            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practitionerHieracry = hierarchyEngine.GetUserHierarchy(Guid.Parse(practitionerId));

            var children = await childRepo.GetAll().Where(c => c.IsActive == true
                    && c.Hierarchy.StartsWith(practitionerHieracry))
                    .Include(c => c.User)
                    .ToListAsync();

            //var childProgress = GetChildProgress(repoFactory, reportPeriodStart, children);
            var notifications = new List<ChildProgressDisplay>();

            //if (childProgress.notProgressedFor2Periods > 0)
            //    notifications.Add(new ChildProgressDisplay()
            //    {
            //        Subject = $"{childProgress.notProgressedFor2Periods} children haven't progressed",
            //        Icon = MetricsIconEnum.Warning.ToString(),
            //        Color = MetricsColorEnum.Warning.ToString(),
            //        Message = $"For 2 reporting periods.",
            //        Notes = "",
            //        UserId = Guid.Parse(practitionerId),
            //        UserType = "practitioner",
            //        numberOfChildrenNotProgressedForPeriod = childProgress.notProgressedFor2Periods,
            //        percentageOfChildrenNotProgressedForPeriod = childProgress.notProgressedFor2Periods / children?.Count ?? 1,
            //        totalChildren = children?.Count ?? 0,
            //        numberOfPeriods = 2
            //    });

            //if (childProgress.notProgressedFor3Periods > 0)
            //    notifications.Add(new ChildProgressDisplay()
            //    {
            //        Subject = $"{childProgress.notProgressedFor3Periods} children haven't progressed",
            //        Icon = MetricsIconEnum.Warning.ToString(),
            //        Color = MetricsColorEnum.Warning.ToString(),
            //        Message = $"For 3 reporting periods.",
            //        Notes = "",
            //        UserId = Guid.Parse(practitionerId),
            //        UserType = "practitioner",
            //        numberOfChildrenNotProgressedForPeriod = childProgress.notProgressedFor3Periods,
            //        percentageOfChildrenNotProgressedForPeriod = childProgress.notProgressedFor3Periods / children?.Count ?? 1,
            //        totalChildren = children?.Count ?? 0,
            //        numberOfPeriods = 3
            //    });

            return notifications;
        }


        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<AgeSpreadDisplay> GetActionItemAgeSpread(
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor contextAccessor,
            HierarchyEngine hierarchyEngine,
            string practitionerId)
        {
            DateTime currentDate = DateTime.Now;

            var user = contextAccessor.HttpContext.GetUser();
            var uId = user.Id;
            var practitionerHieracry = hierarchyEngine.GetUserHierarchy(Guid.Parse(practitionerId));

            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var children = childRepo.GetAll().Where(c => c.IsActive == true
                    && c.Hierarchy.StartsWith(practitionerHieracry))
                    .Include(c => c.User)
                    .ToList();

            // Get Child Age Groups
            int percentOfChildrenOutsideAgeGroup = GetPercentChildrenOutsideAgeGroup(currentDate, children);

            if (percentOfChildrenOutsideAgeGroup > 50)
            {
                return new AgeSpreadDisplay()
                {
                    Subject = $"{percentOfChildrenOutsideAgeGroup} of children in incorrect age group",
                    Icon = MetricsIconEnum.Warning.ToString(),
                    Color = MetricsColorEnum.Warning.ToString(),
                    Message = $"SmartStart programmes are designed for 3 to 5 year olds.",
                    Notes = "",
                    UserId = Guid.Parse(practitionerId),
                    UserType = "practitioner",
                    PercentChildrenOutsideAgeGroup = percentOfChildrenOutsideAgeGroup
                };
            }

            return null;
        }

        private static int GetPercentChildrenOutsideAgeGroup(DateTime currentDate, List<Child> children)
        {
            var childrenOutsideAgeGroupCount = children?.Count(c => currentDate >= c.User?.DateOfBirth.AddYears(3)
                            && currentDate < c.User?.DateOfBirth.AddYears(+6));
            var percentOfChildrenOutsideAgeGroup = childrenOutsideAgeGroupCount ?? 1 / (children?.Count ?? 1) * 100;
            return percentOfChildrenOutsideAgeGroup;
        }
        private static int GetIncompleteChildRegistrations(List<Child> children, List<Learner> learners, List<Document> documents)
        {
            var incompleteRegistrations = 0;
            if (children != null && children.Count() > 0)
            {
                foreach (var child in children)
                {
                    if (child != null)
                    {
                        if (learners != null && learners.Count() > 0)
                        {
                            var existingLearner = learners.Where(l => l.UserId == child.UserId).FirstOrDefault();
                            if (existingLearner == null)
                            {
                                incompleteRegistrations += 1;
                            }
                            else
                            {
                                var existingDocument = documents.Where(d => d.UserId == child.UserId).FirstOrDefault();
                                if (child.CaregiverId is null || (existingDocument == null && child.InsertedDate < DateTime.Now.AddDays(-14)))
                                {
                                    incompleteRegistrations += 1;
                                }
                            }
                        }
                        else
                        {
                            incompleteRegistrations += 1;
                        }

                    }
                }
            }
            return incompleteRegistrations;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<List<ClassReassignmentDisplay>> GetActionItemClassReassignmentHistory(
            IGenericRepositoryFactory repoFactory,
            [Service] ApplicationUserManager userManager,
            string practitionerId)
        {
            DateTime currentDate = DateTime.Now;

            DateTime currentMonthStart = currentDate.GetStartOfMonth();
            DateTime currentMonthEnd = currentDate.GetEndOfMonth();

            DateTime previousMonthStart = currentDate.GetStartOfPreviousMonth();
            DateTime previousMonthEnd = currentDate.GetEndOfPreviousMonth();

            var classReassignmentHistoryRepo = repoFactory.CreateGenericRepository<ClassReassignmentHistory>();
            var classReassignmentHistoryList = await classReassignmentHistoryRepo.GetAll()
                .Where(ch => ch.IsActive
                    && ch.ReassignedToUser == Guid.Parse(practitionerId)
                    && ch.ReassignedToDate >= previousMonthStart
                    && ch.ReassignedToDate <= previousMonthEnd)
                .ToListAsync();

            // Fetch all reassigned ClasroomGroups for all History records
            var reassignedClassroomGroupIds = classReassignmentHistoryList
                .SelectMany(ch => ch.ReassignedClassroomGroups.Split(';'))
                .Where(ch => !string.IsNullOrWhiteSpace(ch))
                .Select(
                    ch =>
                    {
                        Guid.TryParse(ch, out Guid id);
                        return id;
                    })
                .ToList();
            var classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>();
            var reassignedClassroomGroups = await classroomGroupRepo.GetAll()
                .Where(cg => reassignedClassroomGroupIds.Contains(cg.Id))
                .ToListAsync();

            // Build detail list of reassigned classes
            var reassignedClassList = new List<ClassReassignmentDisplay>();

            if (classReassignmentHistoryList?.Count() > 0)
            {
                foreach (var reassignment in classReassignmentHistoryList)
                {
                    // This is done again to avoid multiple calls to the DB
                    var classesReassignedIds = reassignment.ReassignedClassroomGroups?.Split(';')
                        .Where(ch => !string.IsNullOrWhiteSpace(ch))
                        .Select(
                            ch =>
                            {
                                Guid.TryParse(ch, out Guid id);
                                return id;
                            })
                        .ToList();

                    foreach (var classId in classesReassignedIds)
                    {
                        var classroomGroup = reassignedClassroomGroups
                        .Where(c => reassignment.ReassignedClassroomGroups?.Contains(c.Id.ToString()) ?? false)
                        .FirstOrDefault();

                        var pract1 = await userManager.FindByIdAsync(reassignment.ReassignedToUser.ToString());
                        var pract2 = await userManager.FindByIdAsync(reassignment.ReassignedBackToUserId.ToString());

                        reassignedClassList.Add(new ClassReassignmentDisplay()
                        {
                            Subject = $"Class reassigned",
                            Icon = MetricsIconEnum.None.ToString(),
                            Color = MetricsColorEnum.None.ToString(),
                            Message = $"{reassignment?.User?.FirstName} has reassigned the {classroomGroup?.Name} class",
                            Notes = "",
                            UserId = Guid.Parse(practitionerId),
                            UserType = "principal",
                            ReassignedFromUser = pract1,
                            ReassignedToUser = pract2,
                            ReassignedClassroomGroup = classroomGroup
                        });
                    }
                }
            }

            return reassignedClassList;
        }

        private static Dictionary<Guid, List<(DateTime, int)>> GetChildProgressHistory(IOrderedQueryable<ChildProgressReport> childProgressReportsFor2Years)
        {
            var childProgressReportContents = childProgressReportsFor2Years?.Select(r => r.ReportContent).ToList();

            var progressHistory = new Dictionary<Guid, List<(DateTime, int)>>();
            foreach (var childReportContent in childProgressReportContents)
            {
                var childReportObject = JsonConvert.DeserializeObject<ChildProgressReportDetailedModel>(childReportContent);
                // TODO: Use childReportObject.DateCompleted or ReportingDate?
                var childId = Guid.Parse(childReportObject.ChildId);
                if (progressHistory.TryGetValue(childId, out var childHistory))
                {
                    childHistory.Add(
                        (DateTime.Parse(childReportObject.ReportingDate), childReportObject.AchievedLevelId));
                }
                else
                {
                    progressHistory.Add(childId,
                        new List<(DateTime, int)>() {
                                        (DateTime.Parse(childReportObject.ReportingDate),
                                        childReportObject.AchievedLevelId)
                        });
                }
            }

            return progressHistory;
        }

        private async Task<int> GetMissingAttendanceReportsAsync(
            IHolidayService<Holiday> holidayService,
            [Service] AttendanceService attendanceService,
            DateTime reportingPeriodStart,
            DateTime reportingPeriodEnd,
            Practitioner practitioner)
        {
            var holidays = holidayService.GetHolidays(reportingPeriodStart, reportingPeriodEnd, "en-za").ToList();
            var daysForPeriod = reportingPeriodStart.DaysBetween(reportingPeriodEnd);

            var attendanceForClassAllPracPrin = new List<Attendance>();

            int missingRegisterDayCount = 0;

            var classroomGroups = attendanceService.GetUserClassroomGroups(practitioner.UserId.ToString());


            foreach (var classroomGroup in classroomGroups.Where(x => classroomGroups.Select(y => y.UserId).Contains(x.UserId)))
            {
                List<Guid> classProgrammeIds = new List<Guid>();
                classProgrammeIds.AddRange(classroomGroup.ClassProgrammes.Select(x => x.Id).ToList());

                for (DateTime dt = reportingPeriodStart; dt <= reportingPeriodEnd; dt = dt.AddMonths(1))
                {
                    var attendanceForPeriod = attendanceService.GetAttendanceRecordsForPeriodByProgramme((IEnumerable<Guid>)classProgrammeIds, practitioner.UserId.ToString(), reportingPeriodStart, reportingPeriodEnd);

                    foreach (var programme in classroomGroup.ClassProgrammes)
                    {
                        var validClassDays = attendanceService.GetDayRangeWithoutHolidays(dt.GetStartOfMonth(), dt.GetEndOfMonth());
                        var learners = attendanceService.GetLearnersActiveDuringTimePeriod(classroomGroup.Id, programme.ProgrammeStartDate.Date, reportingPeriodEnd.Date);

                        if (learners.Count() > 0)
                        {
                            var firstLearnerStart = learners.Select(x => x.StartedAttendance).FirstOrDefault();
                            var daysOfClass = attendanceService.CalculateDaysOfClassForMonth(dt, (int)programme.MeetingDay, validClassDays, firstLearnerStart.Date, reportingPeriodEnd.Date);

                            var attendedClasses = attendanceForPeriod
                                                  .Where(x => x.ClassroomProgrammeId == programme.Id
                                                  && x.MonthOfYear == dt.Month
                                                  && x.Year == dt.Year);

                            if (daysOfClass.Count() > 0 && daysOfClass.Count() > attendedClasses.Count())
                            {
                                missingRegisterDayCount += daysOfClass.Count() - attendedClasses.Count();
                            }
                        }
                    }
                }
            }

            return missingRegisterDayCount;
        }

        public IEnumerable<DateTime> RemoveHolidays(IEnumerable<DateTime> days, List<Holiday> holidays)
        {
            var holidayDates = holidays.Select(x => x.Day);

            return days.Except(holidayDates);
        }

        public IEnumerable<DateTime> RemoveWeekendDays(IEnumerable<DateTime> days)
        {
            var weekendDays = new List<DayOfWeek>() { DayOfWeek.Saturday, DayOfWeek.Sunday };

            return days.Where(d => !weekendDays.Contains(d.DayOfWeek));
        }

        // TODO: Move to ChildProgressReportQuery
        public ChildProgressReportsStatus GetChildProgressReportsStatus(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            [Service] IChildProgressReportService childProgressReportService,
            string userId)
        {
            var user = contextAccessor.HttpContext.GetUser();
            var uId = user?.Id ?? throw new ArgumentNullException("User.Id");

            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);


            var practitioner = practRepo.GetByUserId(userId);
            var practitionerHieracry = hierarchyEngine.GetUserHierarchy(Guid.Parse(userId));

            var classroomGroups = classroomGroupRepo.GetAll()
                .Where(c => c.UserId.HasValue && c.UserId.Value == Guid.Parse(userId)).ToList();

            var childCount = childRepo.GetAll()
               .Where(c => c.IsActive == true
                   && c.Hierarchy.StartsWith(practitionerHieracry))
               .Include(c => c.User)
               .Count();

            // Notifications for child progress reports
            //var reportCounts = childProgressReportService.GetChildProgressReportStatusCountsForPractitioner(practitioner.Hierarchy, classroomGroups.Select(x => x.Id).ToList());

            return new ChildProgressReportsStatus
            {
                CompletedReports = 0,//reportCounts.reportsSubmittedOnTime + reportCounts.reportsSubmittedOverdue,
                NumberOfChildren = childCount
            };
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<NotificationDisplay> GetDisplayMetrics(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] IIncomeExpenseService incomeManager,
            [Service] IHolidayService<Holiday> holidayService,
            [Service] AttendanceService attendanceService,
            [Service] AuthenticationDbContext dbContext,
            [Service] MonthlyAttendanceReport monthlyAttendanceReportService,
            [Service] IAbsenteeService absenteeService,
            IGenericRepositoryFactory repoFactory,
            string type)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            switch (type)
            {
                case "child":
                    var childResults = GetChildNotifications(contextAccessor, repoFactory).ToList();
                    return childResults;
                case "practitioner":
                case "principal":
                    var principalResults = GetPractitionerNotificationsForPrincipal(
                        monthlyAttendanceReportService,
                        attendanceRepo,
                        attendanceService,
                        dbContext,
                        absenteeService,
                        repoFactory,
                        uId.ToString(),
                        type).ToList();
                    return principalResults;
                case "coach":
                    var coachResults = GetPractitionerNotificationsForCoach(
                        attendanceRepo,
                        incomeManager,
                        holidayService,
                        attendanceService,
                        monthlyAttendanceReportService,
                        repoFactory,
                        uId.ToString(),
                        type).ToList();
                    return coachResults;
                default:
                    return new List<NotificationDisplay>(); // THIS SHOULD 400
            }
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public PractitionerMetricReport GetOwnershipMetrics(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var practitionerMetricReport = new PractitionerMetricReport();
            practitionerMetricReport.AvgChildren = 0;
            practitionerMetricReport.CompletedProfiles = 0;
            practitionerMetricReport.OutstandingSyncs = 0; // TODO: ADD
            practitionerMetricReport.ProgramTypesData = new List<MetricReportStatItem>();
            practitionerMetricReport.StatusData = new List<MetricReportStatItem>();

            var userId = contextAccessor.HttpContext.GetUser().Id;

            //all user hierarchy related data
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: userId);
            var programmeTypeRepo = repoFactory.CreateRepository<ProgrammeType>(userContext: userId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: userId);
            var childRepo = repoFactory.CreateRepository<Child>(userContext: userId);

            var allClassrooms = classroomRepo.GetAll();
            var allProgrammeTypes = programmeTypeRepo.GetAll();
            var allChildren = childRepo.GetAll();
            var allPractitioners = practitionerRepo.GetAll();
            var allClassroomGroups = classroomGroupRepo.GetAll().ToList();

            var practitionerCount = allPractitioners.Where(x => x.IsActive).Count();
            var childCount = allChildren.Where(x => x.IsActive).Count();
            practitionerMetricReport.AvgChildren = practitionerCount > 0 && childCount > 0 ? childCount / practitionerCount : 0;
            practitionerMetricReport.CompletedProfiles = allClassrooms.Where(x => x.IsActive).Count();
            practitionerMetricReport.AllChildren = allChildren.Where(x => x.IsActive).Count();
            practitionerMetricReport.AllClassrooms = allClassrooms.Where(x => x.IsActive).Count();
            practitionerMetricReport.AllClassroomGroups = allClassroomGroups.Where(x => x.IsActive).Count();

            foreach (var programType in allProgrammeTypes)
            {
                var classroomGroupProgramTypeGroup = allClassroomGroups.Where(x => x.ProgrammeTypeId == programType.Id).GroupBy(x => x.ClassroomId);
                var classroomGroupProgramTypeGroupCount = classroomGroupProgramTypeGroup.Count();
                practitionerMetricReport.ProgramTypesData.Add(new MetricReportStatItem() { Name = programType.Description, Value = classroomGroupProgramTypeGroupCount.ToString() });
            }


            practitionerMetricReport.StatusData.Add(new MetricReportStatItem() { Name = "Active", Value = allPractitioners.Where(x => x.IsActive).Count().ToString() });
            practitionerMetricReport.StatusData.Add(new MetricReportStatItem() { Name = "InActive", Value = allPractitioners.Where(x => !x.IsActive).ToString() });


            return practitionerMetricReport;
        }

        private IEnumerable<NotificationDisplay> GetChildNotifications(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);

            //child view from practitioner/principal/coach
            var children = childRepo.GetAll();
            foreach (var user in children)
            {
                NotificationDisplay displayChild = new NotificationDisplay()
                {
                    Subject = "Missing Attendance",
                    Icon = MetricsIconEnum.Error.ToString(),
                    Color = MetricsColorEnum.Error.ToString(),
                    Message = "",
                    Notes = "",
                    UserId = user.UserId,
                    UserType = "child"
                };

                yield return displayChild;
            }
        }

        private IEnumerable<NotificationDisplay> GetPractitionerNotificationsForCoach(
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] IIncomeExpenseService incomeManager,
            [Service] IHolidayService<Holiday> holidayService,
            [Service] AttendanceService attendanceService,
            [Service] MonthlyAttendanceReport monthlyAttendanceReportService,
            IGenericRepositoryFactory repoFactory,
            string uId,
            string mode)
        {
            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            var visitRepo = repoFactory.CreateRepository<Visit>(userContext: uId);
            var absenteeRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);
            var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
            var removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: uId);

            var previousMonthStart = DateTime.Now.GetStartOfPreviousMonth();
            var previousMonthEnd = DateTime.Now.GetEndOfPreviousMonth();
            var currentMonthEnd = DateTime.Now.GetEndOfMonth();

            var applicationName = TenantExecutionContext.Tenant.ApplicationName;

            List<Practitioner> practitioners;
            switch (mode)
            {
                case "coach":
                    practitioners = practRepo.GetAll().Where(x => x.IsActive && x.CoachHierarchy.HasValue && x.CoachHierarchy.Value == Guid.Parse(uId)).ToList();
                    break;
                case "principal":
                    practitioners = practRepo.GetAll().Where(x => x.IsActive && x.PrincipalHierarchy.HasValue && x.PrincipalHierarchy.Value == Guid.Parse(uId)).ToList();
                    break;
                default:
                    practitioners = practRepo.GetAll().Where(x => x.UserId == Guid.Parse(uId)).ToList();
                    break;
            }

            var pracitionerUserIds = practitioners.Select(y => y.UserId.ToString());
            var classrooms = classroomRepo.GetAll().ToList();
            var absenteeDays = absenteeRepo.GetAll().Where(x => pracitionerUserIds.Contains(x.UserId.ToString()) && x.AbsentDate >= previousMonthStart).ToList();
            var visits = visitRepo.GetAll().Where(x => pracitionerUserIds.Contains(x.Practitioner.UserId.ToString())).ToList();
            var classroomGroups = classroomGroupRepo.GetAll().Where(x => x.IsActive && pracitionerUserIds.Contains(x.UserId.ToString())).ToList();

            foreach (var practitioner in practitioners)
            {
                var practitionerClassrooms = classrooms.Where(x => x.UserId == practitioner.UserId || x.UserId.ToString() == practitioner.PrincipalHierarchy.ToString()).ToList();
                var practitionerClassroomGroupIds = classroomGroups.Where(x => x.UserId.HasValue && x.UserId.Value == practitioner.UserId.Value).Select(x => x.Id).ToList();
                var classroom = practitionerClassrooms.FirstOrDefault();
                var practitionerAbsenteeDays = absenteeDays.Where(x => x.UserId == practitioner.UserId && x.AbsentDate <= DateTime.Now.Date && x.Reason != "Practitioner removed from programme").ToList();

                var notification = new NotificationDisplay()
                {
                    UserId = practitioner.UserId,
                    UserType = "practitioner"
                };

                #region NOT REGISTERED ON APP
                if (
                   !practitioner.IsRegistered.HasValue || !practitioner.IsRegistered.Value)
                {
                    notification.Subject = $"Not registered on {applicationName}";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "Request registration";
                    notification.GroupingName = "Not registered on app";
                    yield return notification;
                    continue;
                }
                #endregion

                #region OFFLINE ON APP FOR 2 WEEKS
                if (practitioner.User.LastSeen < DateTime.Now.AddDays(-14))
                {
                    notification.Subject = $"Offline on {applicationName} for 2 weeks";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = $"Last login was {practitioner.User.LastSeen.ToString("MM/dd/yyyy h:mm tt")}";
                    notification.GroupingName = "Offline for 2 weeks";
                    yield return notification;
                    continue;
                }
                #endregion      

                #region REMOVED FROM PRESCHOOL
                var removalHistory = removalRepo.GetListByUserId(practitioner.UserId.Value)
                    .Where(x => x.IsActive)
                    .OrderByDescending(x => x.InsertedDate)
                    .FirstOrDefault();

                if (removalHistory != null)
                {
                    notification.Subject = "Removed from preschool";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = $"Practitioner is leaving on {removalHistory.DateOfRemoval.ToString("dd MMMM yyyy")}";
                    notification.GroupingName = "Removed from preschool";
                    yield return notification;
                    continue;
                }
                #endregion                             

                #region MISSING ATTENDANCE REGISTERS
                var missingRegisterDayCount = GetMissingAttendanceReportsAsync(
                holidayService,
                attendanceService,
                previousMonthStart,
                previousMonthEnd,
                practitioner).Result;

                if (missingRegisterDayCount > 0)
                {
                    notification.Subject = $"Missing attendance registers in {previousMonthEnd.ToString("MMM")}";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "Missing attendance registers";
                    yield return notification;
                    continue;
                }
                #endregion

                if (practitioner.IsPrincipal.HasValue && (bool)practitioner.IsPrincipal.Value == true)
                {
                    var lastMonthStatement = incomeManager.GetStatements(practitioner.UserId.Value, previousMonthStart, previousMonthEnd).FirstOrDefault();
                    var lastMonthStatementBalance = lastMonthStatement != null
                        ? lastMonthStatement.IncomeItems.Sum(x => x.Amount) - lastMonthStatement.ExpenseItems.Sum(x => x.Amount)
                        : 0;
                    #region MISSING INCOME STATEMENT
                    if (lastMonthStatement == null || (!lastMonthStatement.ExpenseItems.Any() && !lastMonthStatement.IncomeItems.Any()))
                    {
                        notification.Subject = $"No income/expenses tracked in {previousMonthEnd.ToString("MMM")}";
                        notification.Icon = MetricsIconEnum.Error.ToString();
                        notification.Color = MetricsColorEnum.Error.ToString();
                        notification.Message = "";
                        notification.Notes = "";
                        notification.GroupingName = "Missing income statement";
                        yield return notification;
                        continue;
                    }
                    #endregion

                    #region PROGRAMME LOST x IN LAST 2 MONTHS
                    var secondLastMonth = previousMonthStart.AddMonths(-1);
                    var secondLastMonthStatement = incomeManager.GetStatements(practitioner.UserId.Value, secondLastMonth, secondLastMonth).FirstOrDefault();

                    if (lastMonthStatement != null && secondLastMonthStatement != null)
                    {
                        var secondLastMonthStatementBalance = secondLastMonthStatement.IncomeItems.Sum(x => x.Amount) - secondLastMonthStatement.ExpenseItems.Sum(x => x.Amount);

                        var balance = lastMonthStatementBalance + secondLastMonthStatementBalance;
                        if (lastMonthStatementBalance < 0 && secondLastMonthStatementBalance < 0)
                        {
                            notification.Subject = $"Programme lost R{balance} in {secondLastMonth.ToString("MMM")}-{previousMonthStart.ToString("MMM")}";
                            notification.Icon = MetricsIconEnum.Error.ToString();
                            notification.Color = MetricsColorEnum.Error.ToString();
                            notification.Message = "";
                            notification.Notes = "";
                            notification.GroupingName = "Programme losing money";
                            yield return notification;
                            continue;
                        }
                    }
                    #endregion

                    #region PROGRAMME MADE A PROFIT LAST MONTH
                    if (lastMonthStatement != null)
                    {
                        if (lastMonthStatementBalance > 0)
                        {
                            notification.Subject = $"Made R{lastMonthStatementBalance} profit in {previousMonthStart.ToString("MMM")}";
                            notification.Icon = MetricsIconEnum.Success.ToString();
                            notification.Color = MetricsColorEnum.Success.ToString();
                            notification.Message = "";
                            notification.Notes = "";
                            notification.GroupingName = "Programme made profit";
                            yield return notification;
                            continue;
                        }
                    }
                    #endregion
                }

                    var monthlyReport = monthlyAttendanceReportService.GenerateMonthlyAttendanceReport(practitioner.UserId.ToString(), previousMonthStart, previousMonthEnd).SingleOrDefault();

                    if (monthlyReport != null)
                    {
                        if (monthlyReport.TotalScheduledSessions > 0)
                        {
                            var attendancePercentage = monthlyReport.PercentageAttendance;
                            #region 60% CHILD ATTENDANCE
                            if (attendancePercentage < 60)
                            {
                                notification.Subject = $"{attendancePercentage}% child attendance in {previousMonthStart.ToString("MMM")}";
                                notification.Icon = MetricsIconEnum.Error.ToString();
                                notification.Color = MetricsColorEnum.Error.ToString();
                                notification.Message = "";
                                notification.Notes = "Improve attendance";
                                notification.GroupingName = "60% child attendance last month";
                                yield return notification;
                                continue;
                            }
                            #endregion

                            #region 70% CHILD ATTENDENCE
                            if (attendancePercentage >= 60 && attendancePercentage < 80)
                            {
                                notification.Subject = $"{attendancePercentage}% child attendance in {previousMonthStart.ToString("MMM")}";
                                notification.Icon = MetricsIconEnum.Warning.ToString();
                                notification.Color = MetricsColorEnum.Warning.ToString();
                                notification.Message = "";
                                notification.Notes = "Improve attendance";
                                notification.GroupingName = "Less than 80% child attendance last month";
                                yield return notification;
                                continue;
                            }
                            #endregion

                            #region 80% CHILD ATTENDANCE
                            if (attendancePercentage >= 80)
                            {
                                notification.Subject = $"{attendancePercentage}% child attendance in {previousMonthStart.ToString("MMM")}";
                                notification.Icon = MetricsIconEnum.Success.ToString();
                                notification.Color = MetricsColorEnum.Success.ToString();
                                notification.Message = "";
                                notification.Notes = "";
                                notification.GroupingName = "80% child attendance last month";
                                yield return notification;
                                continue;
                            }
                            #endregion
                        }
                    }
                

                notification.Subject = "";
                notification.Icon = MetricsIconEnum.None.ToString();
                notification.Color = MetricsColorEnum.None.ToString();
                notification.Message = "";
                notification.Notes = "";
                notification.GroupingName = "Practitioner";
                yield return notification;
                continue;
            }
        }

        private IEnumerable<NotificationDisplay> GetPractitionerNotificationsForPrincipal(
            [Service] MonthlyAttendanceReport monthlyAttendanceReportService,
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] AttendanceService attendanceService,
            [Service] AuthenticationDbContext dbContext,
            [Service] IAbsenteeService absenteeService,
            IGenericRepositoryFactory repoFactory,
            string uId,
            string mode)
        {
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            var removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: uId);

            var today = DateTime.Now;
            var previousMonthStart = DateTime.Now.GetStartOfPreviousMonth();
            var previousMonthEnd = DateTime.Now.GetEndOfPreviousMonth();
            var currentMonthEnd = DateTime.Now.GetEndOfMonth();
            var currentMonthStart = DateTime.Now.GetStartOfMonth();

            var mondayOfLastWeek = DateTime.Now.AddDays(-(int)DateTime.Now.DayOfWeek - 6);
            var sundayOfLastWeek = DateTime.Now.AddDays(-(int)DateTime.Now.DayOfWeek);

            var applicationName = TenantExecutionContext.Tenant.ApplicationName;

            List<Practitioner> practitioners;
            switch (mode)
            {
                case "coach":
                    practitioners = practitionerRepo.GetAll().Where(x => x.IsActive && x.CoachHierarchy.HasValue && x.CoachHierarchy.Value == Guid.Parse(uId)).ToList();
                    break;
                case "principal":
                    practitioners = practitionerRepo.GetAll().Where(x => x.IsActive && x.PrincipalHierarchy.HasValue && x.PrincipalHierarchy.Value == Guid.Parse(uId)).ToList();
                    break;
                default:
                    practitioners = practitionerRepo.GetAll().Where(x => x.UserId == Guid.Parse(uId)).ToList();
                    break;
            }

            var pracitionerUserIds = practitioners.Select(y => y.UserId.ToString());
            var classrooms = classroomRepo.GetAll().ToList();
            var classroomGroups = classroomGroupRepo.GetAll().Where(x => x.IsActive && pracitionerUserIds.Contains(x.UserId.ToString())).ToList();

            foreach (var practitioner in practitioners)
            {
                var practitionerClassrooms = classrooms.Where(x => x.UserId == practitioner.UserId || x.UserId.ToString() == practitioner.PrincipalHierarchy.ToString()).ToList();
                var practitionerClassroomGroupIds = classroomGroups.Where(x => x.UserId.HasValue && x.UserId.Value == practitioner.UserId.Value).Select(x => x.Id).ToList();
                var classroom = practitionerClassrooms.FirstOrDefault();

                var notification = new NotificationDisplay()
                {
                    UserId = practitioner.UserId,
                    UserType = "practitioner"
                };

                #region REMOVED FROM PRESCHOOL
                var removalHistory = removalRepo.GetListByUserId(practitioner.UserId.Value)
                    .Where(x => x.IsActive)
                    .OrderByDescending(x => x.InsertedDate)
                    .FirstOrDefault();

                if (removalHistory != null)
                {
                    notification.Subject = $"Practitioner is leaving on {removalHistory.DateOfRemoval.ToString("dd MMMM yyyy")}";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = $"Practitioner is leaving on {removalHistory.DateOfRemoval.ToString("dd MMMM yyyy")}";
                    notification.GroupingName = "Removed from preschool";
                    yield return notification;
                    continue;
                }
                #endregion                             

                #region NOT REGISTERED ON APP
                if (!practitioner.IsRegistered.HasValue || !practitioner.IsRegistered.Value)
                {
                    notification.Subject = $"Not registered on {applicationName}";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "Request registration";
                    notification.GroupingName = "Not registered on app";
                    yield return notification;
                    continue;
                }
                #endregion

                #region LEAVE
                var absentDays = absenteeService.GetAbsentDayCountForUser(practitioner.UserId.Value, previousMonthStart, previousMonthEnd);
                if (absentDays > 0)
                {

                    notification.Subject = $"{absentDays} days absent last month";
                    notification.Icon = MetricsIconEnum.Warning.ToString();
                    notification.Color = MetricsColorEnum.Warning.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "Absent";
                    yield return notification;
                    continue;
                }

                #endregion

                #region ATTENDANCE
                var monthlyReport = monthlyAttendanceReportService.GenerateMonthlyAttendanceReport(practitioner.UserId.ToString(), previousMonthStart, previousMonthEnd).SingleOrDefault();
                var metrics = GetClassAttendanceByUser(attendanceRepo, attendanceService, dbContext, practitioner.UserId.ToString(), previousMonthStart.Date, previousMonthEnd.GetEndOfDay());
                if (monthlyReport != null)
                {
                    if (monthlyReport.TotalScheduledSessions > 0)
                    {
                        var attendancePercentage = metrics[0].AttendancePercentage;

                        #region LOW CHILD ATTENDENCE
                        if (attendancePercentage < 75)
                        {
                            notification.Subject = $"{attendancePercentage}% child attendance in {previousMonthStart.ToString("MMM")}";
                            notification.Icon = MetricsIconEnum.Warning.ToString();
                            notification.Color = MetricsColorEnum.Warning.ToString();
                            notification.Message = "";
                            notification.Notes = "Improve attendance";
                            notification.GroupingName = "Less than 75% child attendance last month";
                            yield return notification;
                            continue;
                        }
                        #endregion

                        #region GOOD CHILD ATTENDANCE
                        if (attendancePercentage >= 75)
                        {
                            notification.Subject = $"{attendancePercentage}% child attendance in {previousMonthStart.ToString("MMM")}";
                            notification.Icon = MetricsIconEnum.Success.ToString();
                            notification.Color = MetricsColorEnum.Success.ToString();
                            notification.Message = "";
                            notification.Notes = "";
                            notification.GroupingName = "Better than 75% child attendance last month";
                            yield return notification;
                            continue;
                        }
                        #endregion
                    }
                }
                #endregion

                notification.Subject = "";
                notification.Icon = MetricsIconEnum.Success.ToString();
                notification.Color = MetricsColorEnum.Success.ToString();
                notification.Message = "";
                notification.Notes = "";
                notification.GroupingName = "Practitioner";
                yield return notification;
                continue;
            }
        }
    }
}
