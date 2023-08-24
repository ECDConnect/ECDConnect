using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.Core.Services;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports;
using ECDLink.SmartStart.Reports.ChildProgressReport;
using ECDLink.SmartStart.Reports.Models;
using ECDLink.SmartStart.Services;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
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
                var metric = GetClassAttendanceMetricsByUser(attendanceRepo, attendanceService,  practitioner.UserId, startMonth.Date, endMonth.GetEndOfDay());
                if (metric.Any())
                {
                    metrics.AddRange(metric);
                }

            }
            return metrics;
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
                    
                    int childCount = learners.Count;
                    int month = fromDate.Month;
                    int year = fromDate.Year;
                    int weekOfYear = fromDate.GetWeekOfYear();

                    int attendancePercentage = 0;
                    var learnerReports = new List<ChildGroupingAttendanceReportModel>();

                    if (learners.Any())
                    {
                        foreach (Learner learner in learners)
                        {
                            var attendanceData = attendanceRepo.GetAllByDateRangeByClassroom(fromDate, toDate, group.Id, learner.UserId);
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

        // THIS IS ONLY FETCHING PROGRESS NOTIFICATION INFO FOR THE FIRST CLASS GROUP OF THE PRACTITIONER
        // TODO - Need to update this to handle all classroom groups not just the first
        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<List<NotificationDisplay>> GetClassroomActionItems(
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] IHolidayService<Holiday> holidayService,
            [Service] ChildAttendanceReport attendanceReportService,
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

            var classroomGroups = classroomGroupRepo.GetAll()
                .Where(c => c.UserId == Guid.Parse(practitionerId)).ToList();
            var practitionerHieracry = hierarchyEngine.GetUserHierarchy(practitionerId);

            var practitioner = practRepo.GetByUserId(practitionerId);

            // TODO: use this to apply:
            // https://docs.google.com/spreadsheets/d/1xsS-JECUKWzj26sNcOllesCSZ39QwOh95T8goYdozbk/edit#gid=607178088&range=F71
            // "Note for all actions:
            // - Remove the action item either if the practitioner has completed the associated action and gone online + synced on Funda App(where possible)
            //   OR where the coach has tapped ""I have contacted Bulelwa""(if relevant) "
            var coachHasContactedPractitionerRegardingThisItem = false;

            //set basic dates to be last month and before last
            // TODO: Get reporting interval from: `ChildReportOptions`
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
                classProgrammeRepo,
                attendanceRepo,
                holidayService,
                classroomGroupRepo,
                previousMonthStart,
                previousMonthEnd,
                practitioner);

            if (missingRegisterDayCount > 0)
            {
                notifications.Add(new NotificationDisplay()
                {
                    Subject = $"{missingRegisterDayCount} missing attendance registers",
                    // TODO: Warnings or errors?
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
                // The results of this seem wrong?
                var attendanceReport = attendanceReportService.GetChildAttendance(classroomGroups.First().Id, practitionerId, previousMonthStart, previousMonthEnd);
                var attendancePercentage = attendanceReport?.AttendancePercentage ?? 0;
                if (attendancePercentage < 80)
                {
                    notifications.Add(new NotificationDisplay()
                    {
                        Subject = $"{attendancePercentage}% attendance rate",
                        // TODO: Warnings or errors?
                        Icon = MetricsIconEnum.Error.ToString(),
                        Color = MetricsColorEnum.Error.ToString(),
                        Message = $"{classroomGroups.First().Name} - {previousMonthStart.ToString("MMMM yyyy")}",
                        Notes = "",
                        UserId = Guid.Parse(practitionerId),
                        // TODO: Principal?
                        UserType = "practitioner"
                    });
                }
            }

            // Get Due/Overdue Reports
            // Get Children not progressed
            var isPeriod1 = previousMonthStart.Month <= 7;
            DateTime reportPeriodStart = GetReportPeriodStart(previousMonthStart.Year, isPeriod1);
            DateTime reportPeriodEnd = GetReportPeriodEnd(previousMonthStart.Year, isPeriod1);

            DateTime reportDueStart = GetReportDueStart(previousMonthStart.Year, isPeriod1);
            DateTime reportDueEnd = GetReportDueEnd(previousMonthStart.Year, isPeriod1);

            var reportOverDueStart = GetReportOverDueStart(previousMonthStart.Year, isPeriod1);
            var reportOverDueEnd = GetReportOverDueEnd(previousMonthStart.Year, isPeriod1);

            // Notifications for child progress reports
            var reportCounts = GetChildProgressReportStatusCountsForPractitioner(repoFactory, uId, practitioner.Hierarchy, classroomGroups.Select(x => x.Id).ToList(), DateTime.Now);
            
            // If any reports were submitted in the overdue period (2nd month of the submission window
            if (reportCounts.overdueReportsSubmitted > 0)
            {
                notifications.Add(new NotificationDisplay()
                {
                    Subject = $"{reportCounts.overdueReportsSubmitted} overdue progress reports",
                    // TODO: Warnings or errors?
                    Icon = MetricsIconEnum.Error.ToString(),
                    Color = MetricsColorEnum.Error.ToString(),
                    Message = $"{reportPeriodStart.ToString("MMMM yyyy")} - {reportPeriodEnd.ToString("MMMM yyyy")}",
                    Notes = "",
                    UserId = Guid.Parse(practitionerId),
                    // TODO: Principal?
                    UserType = "practitioner"
                });
            }

            // If any children did not get a report submitted
            if (reportCounts.missedReportCount > 0
                && currentDate >= reportOverDueEnd)
            {
                notifications.Add(new NotificationDisplay()
                {
                    Subject = $"{reportCounts.missedReportCount} missed progress reports",
                    // TODO: Warnings or errors?
                    Icon = MetricsIconEnum.Error.ToString(),
                    Color = MetricsColorEnum.Error.ToString(),
                    Message = $"{reportPeriodStart.ToString("MMMM yyyy")} - {reportPeriodEnd.ToString("MMMM yyyy")}",
                    Notes = "",
                    UserId = Guid.Parse(practitionerId),
                    // TODO: Principal?
                    UserType = "practitioner"
                });
            }

            var children = await childRepo.GetAll()
                .Where(c => c.IsActive == true
                    && c.Hierarchy.StartsWith(practitionerHieracry))
                .Include(c => c.User)
                .ToListAsync();

            // Get Child Age Groups
            int percentOfChildrenOutsideAgeGroup = GetPercentChildrenOutsideAgeGroup(currentDate, children);

            if (percentOfChildrenOutsideAgeGroup > 50)
            {
                notifications.Add(new NotificationDisplay()
                {
                    Subject = $"{percentOfChildrenOutsideAgeGroup} of children in incorrect age group",
                    Icon = MetricsIconEnum.Warning.ToString(),
                    Color = MetricsColorEnum.Warning.ToString(),
                    Message = $"SmartStart programmes are designed for 3 to 5 year olds.",
                    Notes = "",
                    UserId = Guid.Parse(practitionerId),
                    UserType = "practitioner"
                });
            }

            // Start Get Children not progressed
            // Get children that haven't progressed for 2 or 3 periods
            // but only if:
            // Rule:
            // Show only if the practitioner did not submit reports for the January to June reporting period by the deadline(31 July)
            // or for the July to November reporting period by the deadline(20 Dec)"
            if (reportCounts.missedReportCount > 0
                        && currentDate >= reportOverDueEnd)
            {
                var childProgress = GetChildProgress(repoFactory, reportPeriodStart, children);

                // Rule:
                // Only show this action if there is at least 1 child who did not progress from one reporting period to the next
                // (for e.g.from Jan-Jun 2021 to Jul to Nov 2021) "
                if (childProgress.notProgressedFor2Periods > 0)
                {
                    notifications.Add(new NotificationDisplay()
                    {
                        Subject = $"{childProgress.notProgressedFor2Periods} children havent progressed",
                        // TODO: Warnings or errors?
                        Icon = MetricsIconEnum.Warning.ToString(),
                        Color = MetricsColorEnum.Warning.ToString(),
                        Message = $"For 2 reporting periods.",
                        Notes = "",
                        UserId = Guid.Parse(practitionerId),
                        // TODO: Principal?
                        UserType = "practitioner"
                    });
                }

                // Rule:
                // Only show this action if there is at least 1 child who did not progress from one reporting period to the next
                // (for e.g.from Jan-Jun 2021 to Jul to Nov 2021) "
                if (childProgress.notProgressedFor3Periods > 0)
                {
                    notifications.Add(new NotificationDisplay()
                    {
                        Subject = $"{childProgress.notProgressedFor3Periods} children havent progressed",
                        // TODO: Warnings or errors?
                        Icon = MetricsIconEnum.Error.ToString(),
                        Color = MetricsColorEnum.Error.ToString(),
                        Message = $"For 2 reporting periods.",
                        Notes = "",
                        UserId = Guid.Parse(practitionerId),
                        // TODO: Principal?
                        UserType = "practitioner"
                    });
                }
            }

            var classReassignmentHistoryCount = classReassignmentHistoryRepo.GetAll().Count(ch => ch.IsActive
                && ch.ReassignedToUser == practitionerId
                && ch.ReassignedToDate >= previousMonthStart
                && ch.ReassignedToDate <= previousMonthEnd);

            if (classReassignmentHistoryCount > 0)
            {
                notifications.Add(new NotificationDisplay()
                {
                    Subject = $"Class reassigned",
                    // TODO: Warnings or errors?
                    Icon = MetricsIconEnum.Error.ToString(),
                    Color = MetricsColorEnum.Error.ToString(),
                    Message = classReassignmentHistoryCount > 1
                        ? $"{classReassignmentHistoryCount} classes have been reassigned to other practitioners."
                        : $"A class has been assigned to a different practitioner.",
                    Notes = "",
                    UserId = Guid.Parse(practitionerId),
                    // TODO: Principal?
                    UserType = "practitioner"
                });
            }

            return notifications;
        }


        private static DateTime GetReportPeriodStart(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 1, 1) : new DateOnly(year, 7, 1))
                .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        }

        private static DateTime GetNextReportDuePeriodStart(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 11, 1) : new DateOnly(year + 1, 6, 1))
                                .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        }

        private static DateTime GetNextReportDuePeriodEnd(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 11, 30) : new DateOnly(year + 1, 6, 30))
                            .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        }

        private static DateTime GetReportPeriodEnd(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 6, 30) : new DateOnly(year, 12, 20))
                            .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        }

        private static DateTime GetReportDueStart(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 6, 1) : new DateOnly(year, 11, 1))
                                .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        }

        private static DateTime GetReportDueEnd(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 6, 30) : new DateOnly(year, 11, 30))
                            .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        }

        private static DateTime GetReportOverDueStart(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 7, 1) : new DateOnly(year, 12, 1))
                            .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        }

        private static DateTime GetReportOverDueEnd(int year, bool isPeriod1)
        {
            return (isPeriod1 ? new DateOnly(year, 7, 31) : new DateOnly(year, 12, 20))
                            .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
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
                    && r.ReportDate >= reportPeriodStart.GetStartOfYear().AddYears(-2))
                .OrderBy(r => r.ReportDate);
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

                if (last3?.Count() == 3
                    && (last3[0].Item2 > last3[1].Item2)
                    || (last3[0].Item2 > last3[2].Item2)
                    || (last3[1].Item2 > last3[2].Item2))
                    hasProgressedInLast3Periods++;
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
            HierarchyEngine hierarchyEngine,
            string practitionerId)
        {
            var user = contextAccessor.HttpContext.GetUser();
            var uId = user?.Id ?? throw new ArgumentNullException("User.Id");
            var uIdGuid = Guid.Parse(uId);
            var practitionerIdGuid = Guid.Parse(practitionerId);

            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var practitioner = practRepo.GetByUserId(practitionerId);

            var classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            var classroomGroups = await classroomGroupRepo
                .GetAll()
                .Where(c => c.UserId == practitionerIdGuid
                    || c.Classroom.UserId == practitionerId)
                .ToListAsync();

            // TODO: use this to apply:
            // https://docs.google.com/spreadsheets/d/1xsS-JECUKWzj26sNcOllesCSZ39QwOh95T8goYdozbk/edit#gid=607178088&range=F71
            // "Note for all actions:
            // - Remove the action item either if the practitioner has completed the associated action and gone online + synced on Funda App(where possible)
            //   OR where the coach has tapped ""I have contacted Bulelwa""(if relevant) "
            var coachHasContactedPractitionerRegardingThisItem = false;

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
                classProgrammeRepo,
                attendanceRepo,
                holidayService,
                classroomGroupRepo,
                previousMonthStart,
                previousMonthEnd,
                practitioner);

            if (missingRegisterDayCount > 0)
            {
                var isPeriod1 = currentDate.Month <= 7;
                DateTime currentReportingPeriodEnd = GetReportDueEnd(currentDate.Year, isPeriod1);
                var isPreviousMonthPeriod1 = previousMonthStart.Month <= 7;
                DateTime nextReportingPeriodEnd = GetNextReportDuePeriodEnd(previousMonthStart.Year, isPreviousMonthPeriod1);

                return new ActionItemMissedProgressReportsDisplay()
                {
                    Subject = $"{missingRegisterDayCount} missing attendance registers",
                    Icon = MetricsIconEnum.Error.ToString(),
                    Color = MetricsColorEnum.Error.ToString(),
                    Message = previousMonthStart.ToString("MMMM yyyy"),
                    Notes = $"Remind {practitioner.User.FirstName} to track progress for the next reporting period ({nextReportingPeriodEnd.ToString("MMMM yyyy")})",
                    UserId = Guid.Parse(practitionerId),
                    UserType = "practitioner",
                    PractitionerUser = practitioner.User,
                    NextReportingPeriodEnd = nextReportingPeriodEnd,
                    CurrentReportingPeriodEnd = currentReportingPeriodEnd
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

            if (uId == null)
                throw new ArgumentNullException(nameof(uId));

            DateTime currentDate = DateTime.Now;

            DateTime currentMonthStart = currentDate.GetStartOfMonth();
            DateTime currentMonthEnd = currentDate.GetEndOfMonth();

            DateTime previousMonthStart = currentDate.GetStartOfPreviousMonth();
            DateTime previousMonthEnd = currentDate.GetEndOfPreviousMonth();

            var isPeriod1 = previousMonthStart.Month <= 7;
            DateTime reportPeriodStart = GetReportPeriodStart(previousMonthStart.Year, isPeriod1);
            
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practitionerHieracry = hierarchyEngine.GetUserHierarchy(practitionerId);

            var children = await childRepo.GetAll().Where(c => c.IsActive == true
                    && c.Hierarchy.StartsWith(practitionerHieracry))
                    .Include(c => c.User)
                    .ToListAsync();

            var childProgress = GetChildProgress(repoFactory, reportPeriodStart, children);
            var notifications = new List<ChildProgressDisplay>();

            if (childProgress.notProgressedFor2Periods > 0)
                notifications.Add(new ChildProgressDisplay()
                {
                    Subject = $"{childProgress.notProgressedFor2Periods} children haven't progressed",
                    Icon = MetricsIconEnum.Warning.ToString(),
                    Color = MetricsColorEnum.Warning.ToString(),
                    Message = $"For 2 reporting periods.",
                    Notes = "",
                    UserId = Guid.Parse(practitionerId),
                    UserType = "practitioner",
                    numberOfChildrenNotProgressedForPeriod = childProgress.notProgressedFor2Periods,
                    percentageOfChildrenNotProgressedForPeriod = childProgress.notProgressedFor2Periods/ children?.Count ?? 1,
                    totalChildren = children?.Count ?? 0,
                    numberOfPeriods = 2
                });

            if (childProgress.notProgressedFor3Periods > 0)
                notifications.Add(new ChildProgressDisplay()
                {
                    Subject = $"{childProgress.notProgressedFor3Periods} children haven't progressed",
                    Icon = MetricsIconEnum.Warning.ToString(),
                    Color = MetricsColorEnum.Warning.ToString(),
                    Message = $"For 3 reporting periods.",
                    Notes = "",
                    UserId = Guid.Parse(practitionerId),
                    UserType = "practitioner",
                    numberOfChildrenNotProgressedForPeriod = childProgress.notProgressedFor3Periods,
                    percentageOfChildrenNotProgressedForPeriod = childProgress.notProgressedFor3Periods / children?.Count ?? 1,
                    totalChildren = children?.Count ?? 0,
                    numberOfPeriods = 3
                });

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
            var practitionerHieracry = hierarchyEngine.GetUserHierarchy(practitionerId);

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

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public async Task<List<ClassReassignmentDisplay>> GetActionItemClassReassignmentHistory(
            IGenericRepositoryFactory repoFactory,
            [Service] UserManager<ApplicationUser> userManager,
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
                    && ch.ReassignedToUser == practitionerId
                    && ch.ReassignedToDate >= previousMonthStart
                    && ch.ReassignedToDate <= previousMonthEnd)
                .ToListAsync();

            // Fetch all reassigned ClasroomGroups for all History records
            var reassignedClassroomGroupIds = classReassignmentHistoryList
                .SelectMany(ch => ch.ReassignedClassroomGroups.Split(';'))
                .Where(ch => !string.IsNullOrWhiteSpace(ch))
                .Select(
                    ch => {
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
                foreach (var reassignment in classReassignmentHistoryList) {
                    // This is done again to avoid multiple calls to the DB
                    var classesReassignedIds = reassignment.ReassignedClassroomGroups?.Split(';')
                        .Where(ch => !string.IsNullOrWhiteSpace(ch))
                        .Select(
                            ch => {
                                Guid.TryParse(ch, out Guid id);
                                return id;
                            })
                        .ToList();

                    foreach (var classId in classesReassignedIds)
                    {
                        var classroomGroup = reassignedClassroomGroups
                        .Where(c => reassignment.ReassignedClassroomGroups?.Contains(c.Id.ToString()) ?? false)
                        .FirstOrDefault();

                        var pract1 = await userManager.FindByIdAsync(reassignment.ReassignedToUser);
                        var pract2 = await userManager.FindByIdAsync(reassignment.ReassignedBackToUserId);

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
                var childReportObject = JsonSerializer.Deserialize<ChildProgressReportDetailedModel>(childReportContent);
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

        private (int dueReportsSubmitted, int missedReportCount, int overdueReportsSubmitted) GetChildProgressReportStatusCountsForPractitioner(
            IGenericRepositoryFactory repoFactory,
            string userId,
            string practitionerHierarcry,
            IEnumerable<Guid> classroomGroupIds,
            DateTime currentDate)
        {
            DateTime previousMonthStart = currentDate.GetStartOfPreviousMonth();
            DateTime previousMonthEnd = currentDate.GetEndOfPreviousMonth();
            var isPeriod1 = previousMonthStart.Month <= 7;
            DateTime reportPeriodStart = GetReportPeriodStart(previousMonthStart.Year, isPeriod1);
            DateTime reportPeriodEnd = GetReportPeriodEnd(previousMonthStart.Year, isPeriod1);

            DateTime reportDueStart = GetReportDueStart(previousMonthStart.Year, isPeriod1);
            DateTime reportDueEnd = GetReportDueEnd(previousMonthStart.Year, isPeriod1);

            var reportOverDueStart = GetReportOverDueStart(previousMonthStart.Year, isPeriod1);
            var reportOverDueEnd = GetReportOverDueEnd(previousMonthStart.Year, isPeriod1);

            if (DateTime.Now <= reportPeriodStart)
            {
                // Reports aren't due yet
                return (0, 0, 0);
            }

            var childRepo = repoFactory.CreateRepository<Child>(userContext: userId);
            var childProgressReportRepo = repoFactory.CreateRepository<ChildProgressReport>(userContext: userId);

            var progressReports = childProgressReportRepo
                .GetAll()
                .Where(x =>
                        classroomGroupIds.Contains(x.ClassroomGroupId.Value)
                        && x.ReportDate.ToUniversalTime() >= reportDueStart
                        && x.ReportDate.ToUniversalTime() <= reportOverDueEnd
                        && x.IsActive == true)
                .OrderBy(x => x.ReportDate)
                .ToList();

            var dueReportsSubmitted = progressReports?.Count(r => r.ReportDate >= reportDueStart && r.ReportDate <= reportDueEnd) ?? 0;
            var overdueReportsSubmitted = progressReports?.Count(r => r.ReportDate >= reportOverDueStart && r.ReportDate <= reportOverDueEnd) ?? 0;

            var childCount = childRepo.GetAll().Count(c => c.IsActive == true && c.Hierarchy.StartsWith(practitionerHierarcry));

            var missedReportCount = childCount - (dueReportsSubmitted + overdueReportsSubmitted);

            return (dueReportsSubmitted, missedReportCount, overdueReportsSubmitted);
        }

        private async Task<int> GetMissingAttendanceReportsAsync(
            IGenericRepository<ClassProgramme, Guid> classProgrammeRepo,
            AttendanceTrackingRepository attendanceRepo,
            IHolidayService<Holiday> holidayService,
            IGenericRepository<ClassroomGroup, Guid> classroomGroupRepo,
            DateTime reportingPeriodStart,
            DateTime reportingPeriodEnd,
            Practitioner practitioner)
        {
            var holidays = holidayService.GetHolidays(reportingPeriodStart, reportingPeriodEnd, "en-za").ToList();
            var daysForPeriod = reportingPeriodStart.DaysBetween(reportingPeriodEnd);

            var attendanceForClassAllPracPrin = new List<Attendance>();
            var classroomGroupIds = new List<Guid>();

            // Get attendance reports submitted for period
            if (practitioner?.IsPrincipal == true)
            {
                classroomGroupIds = await classroomGroupRepo.GetAll().Where(cg => cg.Classroom.UserId == practitioner.UserId.ToString()).Select(cg=>cg.Id).ToListAsync();
                
            }
            else {
                classroomGroupIds = await classroomGroupRepo.GetAll()
                    .Where(cg => cg.UserId.ToString() == practitioner.UserId)
                    .Select(cg => cg.Id)
                    .ToListAsync();
            }

            // Remove weekends and holidays
            var availableDays = RemoveWeekendDays(RemoveHolidays(daysForPeriod, holidays)).ToList();
            
            int missingRegisterDayCount = 0;

            foreach (var classroomGroupId in classroomGroupIds) {
                // Get meeting days for the classroom group
                var classProgrammes = (await classProgrammeRepo.GetAll()
                    .Where(p => p.ClassroomGroupId == classroomGroupId)
                    .ToListAsync());
                List<Attendance> allAttendanceForPeriod = null;

                // remove days that the class doesn't meet
                var availableClassDays = availableDays.Where(a => classProgrammes.Select(cp => (DayOfWeek)cp.MeetingDay).Contains(a.DayOfWeek));

                // Get Attendance for period
                if (practitioner.IsPrincipal == true)
                {
                    allAttendanceForPeriod = await attendanceRepo.GetAllByDateRange(reportingPeriodStart, reportingPeriodEnd)
                        .Where(c => c.ParentRecordId == practitioner.UserId)
                        .ToListAsync();
                } else
                {
                    allAttendanceForPeriod = await attendanceRepo.GetAllByDateRange(reportingPeriodStart, reportingPeriodEnd)
                        .Where(c => classProgrammes.Select(c => c.Id).Contains(c.ClassroomProgrammeId))
                        .ToListAsync();
                }

                var numberOfDaysNotAttendedForClassroomGroup = availableClassDays.Except(allAttendanceForPeriod.Select(a=> a.AttendanceDate));
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

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<NotificationDisplay> GetDisplayMetrics(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] VisitDataManager visitDataManager,
            [Service] IncomeExpenseService incomeManager,
            [Service] IHolidayService<Holiday> holidayService,
            [Service] PersonnelService personnelService,
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
                case "coach":
                    var practitionerResults = GetPractitionerNotifications(
                        attendanceRepo,
                        visitDataManager,
                        incomeManager,
                        holidayService,
                        personnelService,
                        repoFactory,
                        uId,
                        type).ToList();
                    return practitionerResults;
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
                    UserId = Guid.Parse(user.UserId),
                    UserType = "child"
                };

                yield return displayChild;
            }
        }

        private IEnumerable<NotificationDisplay> GetPractitionerNotifications(
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] VisitDataManager visitDataManager,
            [Service] IncomeExpenseService incomeManager,
            [Service] IHolidayService<Holiday> holidayService,
            [Service] PersonnelService personnelService,
            IGenericRepositoryFactory repoFactory,
            string uId,
            string mode)
        {
            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            var visitRepo = repoFactory.CreateRepository<Visit>(userContext: uId);
            var visitDataRepo = repoFactory.CreateRepository<VisitData>(userContext: uId);
            var absenteeRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);
            var licenseRepo = repoFactory.CreateRepository<License>(userContext: uId);
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var clubMeetingRegisterRepo = repoFactory.CreateGenericRepository<ClubMeetingRegister>(userContext: uId);
            var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
            var removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: uId);

            var previousMonthStart = DateTime.Now.GetStartOfPreviousMonth();
            var previousMonthEnd = DateTime.Now.GetEndOfPreviousMonth();
            var currentMonthEnd = DateTime.Now.GetEndOfMonth();

            List<Practitioner> practitioners;
            switch (mode)
            {
                case "coach":
                    practitioners = practRepo.GetAll().Where(x => x.CoachHierarchy.HasValue && x.CoachHierarchy.Value == Guid.Parse(uId)).ToList();
                    break;
                case "principal":
                    practitioners = practRepo.GetAll().Where(x => x.PrincipalHierarchy.HasValue && x.PrincipalHierarchy.Value == Guid.Parse(uId)).ToList();
                    break;
                default:
                    // How/Does this get used by a single practitioner ???
                    practitioners = practRepo.GetAll().Where(x => x.UserId.Equals(uId)).ToList();
                    break;
            }

            var pracitionerUserIds = practitioners.Select(y => y.UserId);
            var classrooms = classroomRepo.GetAll().ToList();
            var absenteeDays = absenteeRepo.GetAll().Where(x => pracitionerUserIds.Contains(x.UserId) && x.AbsentDate >= previousMonthStart).ToList();
            var licenses = licenseRepo.GetAll().Where(x => pracitionerUserIds.Contains(x.UserId)).ToList();
            var visits = visitRepo.GetAll().Where(x => pracitionerUserIds.Contains(x.Practitioner.UserId)).ToList();
            var classroomGroups = classroomGroupRepo.GetAll().Where(x => pracitionerUserIds.Contains(x.UserId.ToString())).ToList();

            foreach (var practitioner in practitioners)
            {
                var notification = new NotificationDisplay()
                {
                    UserId = Guid.Parse(practitioner.UserId),
                    UserType = "practitioner"
                };

                #region ON LEAVE
                if (absenteeDays.Any(x => x.UserId == practitioner.UserId && x.AbsentDate.Date == DateTime.Now.Date))
                {
                    notification.Subject = "On leave";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "On leave";
                    yield return notification;
                    continue;
                }
                #endregion

                var firstPqaVisit = visits.Where(x => x.PractitionerId == practitioner.Id && x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1).FirstOrDefault();
                var secondPqaVisit = visits.Where(x => x.PractitionerId == practitioner.Id && x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_2).FirstOrDefault();
                var thirdPqaVisit = visits.Where(x => x.PractitionerId == practitioner.Id && x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_3).FirstOrDefault();

                // NOTE - this might not occur since we auto remove practitioners when delicensing, it's a fallback in case the process was interupted
                #region DELICENSE SMARTSTARTER
                if (licenses.Any(x => x.UserId == practitioner.UserId && x.DelicensedDate != null))
                {
                    var redFlagVisit =
                    (
                        from visit in visitRepo.GetAll().Where(x => x.Practitioner.User.Id == practitioner.UserId)
                        join visitData in visitDataRepo.GetAll().Where(y => y.Question == Constants.SSSettings.step16_q1 && y.QuestionAnswer == Constants.SSSettings.answer_yes) on visit.Id equals visitData.VisitId
                        select visitData
                    ).OrderByDescending(y => y.InsertedDate).Any();

                    if (redFlagVisit)
                    {
                        notification.Subject = "Delicense SmartStarter";
                        notification.Icon = MetricsIconEnum.Error.ToString();
                        notification.Color = MetricsColorEnum.Error.ToString();
                        notification.Message = "";
                        notification.Notes = "";
                        notification.GroupingName = "Delicense SmartStarter";
                        yield return notification;
                        continue;
                    }

                    var pqaRating1 = firstPqaVisit != null ? visitDataManager.GetPractitionerPQARating(firstPqaVisit) : new PQARating();
                    var pqaRating2 = secondPqaVisit != null ? visitDataManager.GetPractitionerPQARating(secondPqaVisit) : new PQARating();
                    var pqaRating3 = thirdPqaVisit != null ? visitDataManager.GetPractitionerPQARating(thirdPqaVisit) : new PQARating();

                    if ((new[] { pqaRating1, pqaRating2, pqaRating3 }).Count(x => x.OverallRatingColor == MetricsColorEnum.Error.ToString()) >= 2)
                    {
                        notification.Subject = "Delicense SmartStarter";
                        notification.Icon = MetricsIconEnum.Error.ToString();
                        notification.Color = MetricsColorEnum.Error.ToString();
                        notification.Message = "";
                        notification.Notes = "";
                        notification.GroupingName = "Delicense SmartStarter";
                        yield return notification;
                        continue;
                    }
                }
                #endregion

                #region NOT REGISTERED ON FUNDA APP
                if (!practitioner.IsRegistered.HasValue || practitioner.IsRegistered.Value == false)
                {
                    notification.Subject = "Not registered on Funda App";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "Request registration on Funda App";
                    notification.GroupingName = "Not registered on Funda App";
                    yield return notification;
                    continue;
                }
                #endregion

                #region FIRST PQA OVERDUE
                if (firstPqaVisit != null && !firstPqaVisit.Attended && firstPqaVisit.PlannedVisitDate < DateTime.Now)
                {
                    notification.Subject = "First PQA overdue";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = firstPqaVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "First PQA overdue";
                    yield return notification;
                    continue;
                }
                #endregion

                #region PQA REACCREDITATION OVERDUE
                var firstAccreditationPqaVisit = visits.Where(x => x.PractitionerId == practitioner.Id && x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();
                if (firstAccreditationPqaVisit != null && !firstAccreditationPqaVisit.Attended && firstAccreditationPqaVisit.PlannedVisitDate < DateTime.Now)
                {
                    notification.Subject = "PQA reacceditation overdue";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = firstAccreditationPqaVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "PQA reaccreditation overdue";
                    yield return notification;
                    continue;
                }
                #endregion

                #region FIRST SITE VISIT OVERDUE
                var firstSiteVisit = visits.Where(x => x.PractitionerId == practitioner.Id && x.VisitType.Name == Constants.SSSettings.first_site_visit).FirstOrDefault();
                if (firstSiteVisit != null && !firstSiteVisit.ActualVisitDate.HasValue && firstSiteVisit.PlannedVisitDate < DateTime.Now)
                {
                    notification.Subject = "First site visit overdue";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = firstSiteVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "First site visist overdue";
                    yield return notification;
                    continue;
                }
                #endregion

                #region SECOND SITE VISIT OVERDUE
                var secondSiteVisit = visits.Where(x => x.PractitionerId == practitioner.Id && x.VisitType.Name == Constants.SSSettings.second_site_visit).FirstOrDefault();
                if (secondSiteVisit != null && !secondSiteVisit.ActualVisitDate.HasValue && secondSiteVisit.PlannedVisitDate < DateTime.Now)
                {
                    notification.Subject = "Second site visit overdue";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = secondSiteVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "Second site visit overdue";
                    yield return notification;
                    continue;
                }
                #endregion
                                
                #region SMARTSPACE VISIT OVERDUE
                var smartSpaceVisit = visits.Where(x => x.PractitionerId == practitioner.Id && x.VisitType.Name == Constants.SSSettings.visitType_smart_space_checklist).FirstOrDefault();
                if (smartSpaceVisit != null && !smartSpaceVisit.ActualVisitDate.HasValue && smartSpaceVisit.PlannedVisitDate < DateTime.Now)
                {
                    notification.Subject = "SmartSpace visit overdue";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = smartSpaceVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "SmartSpace visist overdue";
                    yield return notification;
                    continue;
                }
                #endregion

                #region REMOVED FROM PROGRAMME
                var removalHistory = removalRepo.GetListByUserId(practitioner.UserId)
                    .Where(x => x.IsActive)
                    .OrderByDescending(x => x.InsertedDate)
                    .FirstOrDefault();

                if (removalHistory != null)
                {
                    notification.Subject = "Removed from programme";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = $"Practitioner is leaving on {removalHistory.DateOfRemoval}";
                    notification.GroupingName = "Removed from programe";
                    yield return notification;
                    continue;
                }
                #endregion

                #region OFFLINE ON FUNDA APP FOR 2 WEEKS
                if (practitioner.User.LastSeen < DateTime.Now.AddDays(-14))
                {
                    notification.Subject = "Offline on Funda app for 2 weeks";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = $"Last login was {practitioner.User.LastSeen.ToString("MM/dd/yyyy h:mm tt")}";
                    notification.GroupingName = "Offline on Funda app for 2 weeks";
                    yield return notification;
                    continue;
                }
                #endregion

                #region MISSING INCOME STATEMENT
                var previousMonthBalanceSheet = incomeManager.GetAllStatementsBalanceSheet(practitioner.UserId, previousMonthEnd.Year, previousMonthEnd.Month).FirstOrDefault();
                if (previousMonthBalanceSheet == null || previousMonthBalanceSheet.SubmittedDate == null || previousMonthBalanceSheet.AutoSubmitted)
                {
                    notification.Subject = $"Missing income statement";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "Missing income statement";
                    yield return notification;
                    continue;
                }
                #endregion

                #region PROGRESS REPORTS OVERDUE
                var isPeriod1 = previousMonthStart.Month <= 7;
                var reportOverDueStart = GetReportOverDueStart(previousMonthStart.Year, isPeriod1);
                var reportOverDueEnd = GetReportOverDueEnd(previousMonthStart.Year, isPeriod1);

                if (DateTime.Now > reportOverDueStart && DateTime.Now < reportOverDueEnd)
                {
                    var missedReports = GetChildProgressReportStatusCountsForPractitioner(
                    repoFactory,
                    uId,
                    practitioner.Hierarchy,
                    classroomGroups.Where(x => x.UserId.HasValue && x.UserId.Value == Guid.Parse(practitioner.UserId)).Select(x => x.Id).ToList(),
                    DateTime.Now);

                    if (missedReports.overdueReportsSubmitted > 0)
                    {
                        notification.Subject = "Progress reports overdue";
                        notification.Icon = MetricsIconEnum.Error.ToString();
                        notification.Color = MetricsColorEnum.Error.ToString();
                        notification.Message = "";
                        notification.Notes = "";
                        notification.GroupingName = "Progress reports overdue";
                        yield return notification;
                        continue;
                    }
                }
                #endregion

                #region MISSING ATTENDANCE REGISTERS
                var missingRegisterDayCount = GetMissingAttendanceReportsAsync(
                classProgrammeRepo,
                attendanceRepo,
                holidayService,
                classroomGroupRepo,
                previousMonthStart,
                previousMonthEnd,
                practitioner).Result;

                if (missingRegisterDayCount > 0)
                {
                    notification.Subject = $"Missing attendance registers";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "Missing attendance registers";
                    yield return notification;
                    continue;
                }
                #endregion

                #region PROGRAMME LOST R300 IN LAST 2 MONTHS
                var lastMonthBalance = incomeManager.GetAllStatementsBalanceSheet(practitioner.UserId, previousMonthStart.Year, previousMonthStart.Month).FirstOrDefault();
                var secondLastMonth = previousMonthStart.AddMonths(-1);
                var secondLastMonthBalance = incomeManager.GetAllStatementsBalanceSheet(practitioner.UserId, secondLastMonth.Year, secondLastMonth.Month).FirstOrDefault();
                if (lastMonthBalance != null && secondLastMonthBalance != null)
                {
                    var balance = lastMonthBalance.Balance + secondLastMonthBalance.Balance;
                    if (balance < 0)
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

                #region 50% CHILD ATTENDANCE
                var attendancePercentage = attendanceRepo.GetAttendancePercentileByParent(practitioner.UserId, previousMonthStart, previousMonthEnd);
                if (attendancePercentage < 60)
                {
                    notification.Subject = $"{attendancePercentage}% child attendance in {previousMonthStart.ToString("MMM")}";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "Improve attendance";
                    notification.GroupingName = "50% child attendance last month";
                    yield return notification;
                    continue;
                }
                #endregion

                #region TRAINEE ONBOARDING INCOMPLETE (2 weeks) AND (4 weeks) (REMOVE TRAINEE) AND TRAINEE TASKS OVERDUE
                if (practitioner.IsTrainee.HasValue && practitioner.IsTrainee.Value)
                {
                    var traineeTimeline = personnelService.GetOnBoardTraineeTimeline(practitioner.UserId);

                    var warningCount = 0;
                    var warningString = MetricsColorEnum.Warning.ToString();
                    if (traineeTimeline.DayOneStartUpTrainingColor == warningString) warningCount++;
                    if (traineeTimeline.CommunitySupportColor == warningString) warningCount++;
                    if (traineeTimeline.ConsolidationMeetingColor == warningString) warningCount++;
                    if (traineeTimeline.SignFranchiseeAgreementColor == warningString) warningCount++;
                    if (traineeTimeline.SignStartUpSupportAgreementColor == warningString) warningCount++;
                    if (traineeTimeline.SmartSpaceChecklistColor == warningString) warningCount++;
                    if (traineeTimeline.SmartSpaceLicenseColor == warningString) warningCount++;
                    if (traineeTimeline.SSCoachVisitColor == warningString) warningCount++;
                    if (traineeTimeline.StarterLicenseColor == warningString) warningCount++;
                    if (traineeTimeline.ThreeChildrenRegisteredColor == warningString) warningCount++;

                    if (traineeTimeline.SmartSpaceLicenseDate < DateTime.Now.AddDays(-28))
                    {
                        if (warningCount > 0)
                        {
                            notification.Subject = "Remove Trainee";
                            notification.Icon = MetricsIconEnum.Error.ToString();
                            notification.Color = MetricsColorEnum.Error.ToString();
                            notification.Message = "";
                            notification.Notes = "";
                            notification.GroupingName = "Remove trainee";
                            yield return notification;
                            continue;
                        }
                    }
                    else if (traineeTimeline.SmartSpaceLicenseDate < DateTime.Now.AddDays(-14))
                    {
                        if (warningCount > 0)
                        {
                            notification.Subject = "Trainee onboarding incomplete";
                            notification.Icon = MetricsIconEnum.Error.ToString();
                            notification.Color = MetricsColorEnum.Error.ToString();
                            notification.Message = "";
                            notification.Notes = "";
                            notification.GroupingName = "Trainee onboarding incomplete";
                            yield return notification;
                            continue;
                        }
                    }
                    else
                    {
                        var overdueCount = 0;
                        if (traineeTimeline.CommunitySupportDeadlineDate < DateTime.Now) overdueCount++;
                        if (traineeTimeline.ConsolidationDeadlineDate < DateTime.Now) overdueCount++;
                        if (traineeTimeline.SignFranchiseeAgreementDeadlineDate < DateTime.Now) overdueCount++;
                        if (traineeTimeline.SignStartUpSupportAgreementDeadlineDate < DateTime.Now) overdueCount++;
                        if (traineeTimeline.SmartSpaceChecklistDeadlineDate < DateTime.Now) overdueCount++;
                        if (traineeTimeline.SSCoachVisitDeadlineDate < DateTime.Now) overdueCount++;
                        if (traineeTimeline.ThreeChildrenRegisteredDeadlineDate < DateTime.Now) overdueCount++;

                        if (overdueCount > 2)
                        {
                            notification.Subject = $"{overdueCount} trainee onboarding tasks overdue";
                            notification.Icon = MetricsIconEnum.Error.ToString();
                            notification.Color = MetricsColorEnum.Error.ToString();
                            notification.Message = "";
                            notification.Notes = "";
                            notification.GroupingName = "Trainee onboarding tasks overdue";
                            yield return notification;
                            continue;
                        }
                    }
                }
                #endregion

                // STARTUP SUPPORT ENDING (1 month)

                // Club features not implemented yet
                // NOT ASSIGNED TO A CLUB
                // MISSED 3 CLUB MEETINGS

                #region LESS THAN 5 CHILDREN REGISTERED                
                var practitionerClassrooms = classrooms.Where(x => x.UserId == practitioner.UserId || x.UserId == practitioner.PrincipalHierarchy.ToString()).ToList();
                var classroom = practitionerClassrooms.FirstOrDefault();

                if ((practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value) || (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value))
                {                    
                    var numberOfLearners = classroomGroupRepo.GetAll()
                        .Where(x => practitionerClassrooms.Select(x => x.Id).Contains(x.ClassroomId))
                        .SelectMany(x => x.Learners)
                        .Count();

                    if (numberOfLearners < 5)
                    {
                        notification.Subject = "Less than 5 children registered";
                        notification.Icon = MetricsIconEnum.Error.ToString();
                        notification.Color = MetricsColorEnum.Error.ToString();
                        notification.Message = "";
                        notification.Notes = "";
                        notification.GroupingName = "Less than 5 children registered";
                        yield return notification;
                    }
                }
                #endregion

                #region PQA REACCREDITATION DUE
                if (firstAccreditationPqaVisit != null && !firstAccreditationPqaVisit.Attended && firstAccreditationPqaVisit.PlannedVisitDate > DateTime.Now)
                {
                    notification.Subject = $"{firstAccreditationPqaVisit.PlannedVisitDate.ToShortDateString()}, PQA reaccreditation due";
                    notification.Icon = MetricsIconEnum.None.ToString(); //TODO
                    notification.Color = MetricsColorEnum.None.ToString(); // TODO
                    notification.Message = "";
                    notification.Notes = firstAccreditationPqaVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "PQA reaccreditation due";
                    yield return notification;
                    continue;
                }
                #endregion

                #region FIRST PQA DUE
                if (firstPqaVisit != null && !firstPqaVisit.Attended && firstPqaVisit.PlannedVisitDate > DateTime.Now)
                {
                    notification.Subject = $"{firstPqaVisit.PlannedVisitDate.ToShortDateString()}, First PQA due";
                    notification.Icon = MetricsIconEnum.None.ToString(); //TODO
                    notification.Color = MetricsColorEnum.None.ToString(); // TODO
                    notification.Message = "";
                    notification.Notes = firstPqaVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "First PQA visit due";
                    yield return notification;
                    continue;
                }
                #endregion

                #region SMARTSPACE VISIT DUE
                if (smartSpaceVisit != null && !smartSpaceVisit.ActualVisitDate.HasValue && smartSpaceVisit.PlannedVisitDate > DateTime.Now)
                {
                    notification.Subject = $"{smartSpaceVisit.PlannedVisitDate.ToShortDateString()}, SmartSpace visit due";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = smartSpaceVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "SmartSpace visit due";
                    yield return notification;
                    continue;
                }
                #endregion

                #region FIRST SITE VISIT DUE
                if (firstSiteVisit != null && !firstSiteVisit.ActualVisitDate.HasValue && firstSiteVisit.PlannedVisitDate > DateTime.Now)
                {
                    notification.Subject = $"{firstSiteVisit.PlannedVisitDate.ToShortDateString()}, First site visit due";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = firstSiteVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "First site visit due";
                    yield return notification;
                    continue;
                }
                #endregion

                #region SECOND SITE VISIT DUE
                if (secondSiteVisit != null && !secondSiteVisit.ActualVisitDate.HasValue && secondSiteVisit.PlannedVisitDate > DateTime.Now)
                {
                    notification.Subject = $"{secondSiteVisit.PlannedVisitDate.ToShortDateString()}, Second site visit due";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = secondSiteVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "Second site visit due";
                    yield return notification;
                    continue;
                }
                #endregion

                #region PQA FOLLOW UP VISIT DUE
                var pqaFollowupVisit = visits.Where(x => x.PractitionerId == practitioner.Id && x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).FirstOrDefault();
                if (pqaFollowupVisit != null && !pqaFollowupVisit.Attended && pqaFollowupVisit.PlannedVisitDate < DateTime.Now)
                {
                    notification.Subject = $"{pqaFollowupVisit.PlannedVisitDate.ToShortDateString()}, PQA follow up visit due";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = pqaFollowupVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "PQA follow up visit due";
                    yield return notification;
                    continue;
                }
                #endregion

                #region REACCREDITATION FOLLOW UP VISIT DUE
                var reaccreditationFollowupVisit = visits.Where(x => x.PractitionerId == practitioner.Id && x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();
                if (reaccreditationFollowupVisit != null && !reaccreditationFollowupVisit.Attended && reaccreditationFollowupVisit.PlannedVisitDate < DateTime.Now)
                {
                    notification.Subject = $"{reaccreditationFollowupVisit.PlannedVisitDate.ToShortTimeString()}, PQA reaccreditation follow up due";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = reaccreditationFollowupVisit.PlannedVisitDate.ToShortDateString();
                    notification.GroupingName = "PQA reaccreditation follow up due";
                    yield return notification;
                    continue;
                }
                #endregion

                #region BUSINESS SKILLS TRAINING DUE
                if (!practitioner.AttendedBusinessSkills.HasValue || !practitioner.AttendedBusinessSkills.Value)
                {
                    notification.Subject = $"Business skills training due";
                    notification.Icon = MetricsIconEnum.Warning.ToString();
                    notification.Color = MetricsColorEnum.Warning.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "Business skills training due";
                    yield return notification;
                    continue;
                }
                #endregion

                #region CHILD PROGRESS TRAINING DUE
                if (!practitioner.AttendedChildProgress.HasValue || !practitioner.AttendedChildProgress.Value)
                {
                    notification.Subject = $"Child progress training due";
                    notification.Icon = MetricsIconEnum.Warning.ToString();
                    notification.Color = MetricsColorEnum.Warning.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "Child progress training due";
                    yield return notification;
                    continue;
                }
                #endregion

                // STARTUP SUPPORT ENDING (3 months)

                #region 70% CHILD ATTENDENCE
                if (attendancePercentage < 80)
                {
                    notification.Subject = $"{attendancePercentage}% child attendance in {previousMonthStart.ToString("MMM")}";
                    notification.Icon = MetricsIconEnum.Warning.ToString();
                    notification.Color = MetricsColorEnum.Warning.ToString();
                    notification.Message = "";
                    notification.Notes = "Improve attendance";
                    notification.GroupingName = "70% child attendance";
                    yield return notification;
                    continue;
                }
                #endregion

                #region CHILDREN DID NOT PROGRESS
                var children = childRepo.GetAll().Where(c => c.IsActive == true
                    && c.Hierarchy.StartsWith(practitioner.Hierarchy))
                    .Include(c => c.User)
                    .ToListAsync().Result;
                var childProgress = GetChildProgress(repoFactory, GetReportPeriodStart(previousMonthStart.Year, previousMonthStart.Month <= 7), children);

                if (childProgress.notProgressedFor2Periods > 0)
                {
                    notification.Subject = $"{childProgress.notProgressedFor2Periods} children did not progress";
                    notification.Icon = MetricsIconEnum.Warning.ToString();
                    notification.Color = MetricsColorEnum.Warning.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "Children did not progress";
                    yield return notification;
                    continue;
                }
                #endregion

                #region NEW TRAINEE
                if (practitioner.IsTrainee.HasValue && practitioner.IsTrainee.Value)
                {
                    notification.Subject = "New trainee";
                    notification.Icon = MetricsIconEnum.Success.ToString();
                    notification.Color = MetricsColorEnum.Success.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "New trainee";
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
                    notification.GroupingName = "80% child attendance";
                    yield return notification;
                    continue;
                }
                #endregion

                #region MADE R300 PROFIT  - WHAT IS THIS PERIOD? Last 3 moneths? Is it tied to another alert I can look up?
                if (lastMonthBalance != null && secondLastMonthBalance != null)
                {
                    var balance = lastMonthBalance.Balance + secondLastMonthBalance.Balance;
                    if (balance > 0)
                    {
                        notification.Subject = $"Made R{balance} profit in {secondLastMonth.ToString("MMM")}-{previousMonthStart.ToString("MMM")}";
                        notification.Icon = MetricsIconEnum.Error.ToString();
                        notification.Color = MetricsColorEnum.Error.ToString();
                        notification.Message = "";
                        notification.Notes = "";
                        notification.GroupingName = "Programme making profit";
                        yield return notification;
                        continue;
                    }
                }
                #endregion

                #region NEW SMARTSTARTER
                if (practitioner.IsRegistered.HasValue && practitioner.IsRegistered.Value && practitioner.StartDate.HasValue && practitioner.StartDate.Value > DateTime.Now.AddMonths(-3))
                {
                    notification.Subject = "New SmartStarter";
                    notification.Icon = MetricsIconEnum.Success.ToString();
                    notification.Color = MetricsColorEnum.Success.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "New SmartStarter";
                    yield return notification;
                    continue;
                }
                #endregion
                
                #region CLASSROOM NAME
                notification.Subject = classroom?.Name ?? "Unknown classroom";
                notification.Icon = MetricsIconEnum.Success.ToString();
                notification.Color = MetricsColorEnum.Success.ToString();
                notification.Message = "";
                notification.Notes = "";
                yield return notification;
                continue;
                #endregion
            }
        }
    }
}
