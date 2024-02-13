using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
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
            [Service] ChildProgressReportService childProgressReportService,
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
            var practitionerHieracry = hierarchyEngine.GetUserHierarchy(Guid.Parse(practitionerId));

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
            DateTime reportPeriodStart = ChildProgressReportService.GetReportPeriodStart(previousMonthStart.Year, isPeriod1);
            DateTime reportPeriodEnd = ChildProgressReportService.GetReportPeriodEnd(previousMonthStart.Year, isPeriod1);

            DateTime reportDueStart = ChildProgressReportService.GetReportDueStart(previousMonthStart.Year, isPeriod1);
            DateTime reportDueEnd = ChildProgressReportService.GetReportDueEnd(previousMonthStart.Year, isPeriod1);

            var reportOverDueStart = ChildProgressReportService.GetReportOverDueStart(previousMonthStart.Year, isPeriod1);
            var reportOverDueEnd = ChildProgressReportService.GetReportOverDueEnd(previousMonthStart.Year, isPeriod1);

            // Notifications for child progress reports
            var reportCounts = childProgressReportService.GetChildProgressReportStatusCountsForPractitioner(practitioner.Hierarchy, classroomGroups.Select(x => x.Id).ToList());

            // If any reports were submitted in the overdue period (2nd month of the submission window
            if (reportCounts.reportsSubmittedOverdue > 0)
            {
                notifications.Add(new NotificationDisplay()
                {
                    Subject = $"{reportCounts.reportsSubmittedOverdue} overdue progress reports",
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
            if (reportCounts.reportsMissingOrIncomplete > 0
                && currentDate >= reportOverDueEnd)
            {
                notifications.Add(new NotificationDisplay()
                {
                    Subject = $"{reportCounts.reportsMissingOrIncomplete} missed progress reports",
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
            if (reportCounts.reportsMissingOrIncomplete > 0
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
                && ch.ReassignedToUser == Guid.Parse(practitionerId)
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
                DateTime currentReportingPeriodEnd = ChildProgressReportService.GetReportDueEnd(currentDate.Year, isPeriod1);
                var isPreviousMonthPeriod1 = previousMonthStart.Month <= 7;
                DateTime nextReportingPeriodEnd = ChildProgressReportService.GetNextReportDuePeriodEnd(previousMonthStart.Year, isPreviousMonthPeriod1);

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
            DateTime reportPeriodStart = ChildProgressReportService.GetReportPeriodStart(previousMonthStart.Year, isPeriod1);

            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practitionerHieracry = hierarchyEngine.GetUserHierarchy(Guid.Parse(practitionerId));

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
                    percentageOfChildrenNotProgressedForPeriod = childProgress.notProgressedFor2Periods / children?.Count ?? 1,
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
                classroomGroupIds = await classroomGroupRepo.GetAll().Where(cg => cg.Classroom.UserId == practitioner.UserId).Select(cg => cg.Id).ToListAsync();

            }
            else
            {
                classroomGroupIds = await classroomGroupRepo.GetAll()
                    .Where(cg => cg.UserId == practitioner.UserId)
                    .Select(cg => cg.Id)
                    .ToListAsync();
            }

            // Remove weekends and holidays
            var availableDays = RemoveWeekendDays(RemoveHolidays(daysForPeriod, holidays)).ToList();

            int missingRegisterDayCount = 0;

            foreach (var classroomGroupId in classroomGroupIds)
            {
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
                        .Where(c => c.ParentRecordId == practitioner.UserId.ToString())
                        .ToListAsync();
                }
                else
                {
                    allAttendanceForPeriod = await attendanceRepo.GetAllByDateRange(reportingPeriodStart, reportingPeriodEnd)
                        .Where(c => classProgrammes.Select(c => c.Id).Contains(c.ClassroomProgrammeId))
                        .ToListAsync();
                }

                var numberOfDaysNotAttendedForClassroomGroup = availableClassDays.Except(allAttendanceForPeriod.Select(a => a.AttendanceDate));
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

        public ChildProgressReportsStatus GetChildProgressReportsStatus(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            [Service] ChildProgressReportService childProgressReportService,
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
            var reportCounts = childProgressReportService.GetChildProgressReportStatusCountsForPractitioner(practitioner.Hierarchy, classroomGroups.Select(x => x.Id).ToList());

            return new ChildProgressReportsStatus
            {
                CompletedReports = reportCounts.reportsSubmittedOnTime + reportCounts.reportsSubmittedOverdue,
                NumberOfChildren = childCount
            };
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<NotificationDisplay> GetDisplayMetrics(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] IIncomeExpenseService incomeManager,
            [Service] IHolidayService<Holiday> holidayService,
            [Service] PersonnelService personnelService,
            [Service] ChildProgressReportService childProgressReportService,
            [Service] AttendanceService attendanceService,
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
                        incomeManager,
                        holidayService,
                        personnelService,
                        childProgressReportService,
                        attendanceService,
                        repoFactory,
                        uId.ToString(),
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
                    UserId = user.UserId,
                    UserType = "child"
                };

                yield return displayChild;
            }
        }

        private IEnumerable<NotificationDisplay> GetPractitionerNotifications(
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] IIncomeExpenseService incomeManager,
            [Service] IHolidayService<Holiday> holidayService,
            [Service] PersonnelService personnelService,
            [Service] ChildProgressReportService childProgressReportService,
            [Service] AttendanceService attendanceService,
            IGenericRepositoryFactory repoFactory,
            string uId,
            string mode)
        {
            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            var visitRepo = repoFactory.CreateRepository<Visit>(userContext: uId);
            var visitGenRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: uId);
            var absenteeRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);
            var licenseRepo = repoFactory.CreateRepository<License>(userContext: uId);
            //var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: uId);
            //var learnerRepo = repoFactory.CreateRepository<Learner>(userContext: uId);
            var learnerRepo = repoFactory.CreateGenericRepository<Learner>(userContext: uId);
            var clubMeetingRegisterRepo = repoFactory.CreateGenericRepository<ClubMeetingRegister>(userContext: uId);
            var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
            var removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: uId);
            var pqaRatingRepo = repoFactory.CreateGenericRepository<PQARating>(userContext: uId);
            //var docRepo = repoFactory.CreateRepository<Document>(userContext: uId);
            var docRepo = repoFactory.CreateGenericRepository<Document>(userContext: uId);
            var clubMemberRepo = repoFactory.CreateGenericRepository<ClubMember>(userContext: uId);
            var clubMeetingRepo = repoFactory.CreateGenericRepository<ClubMeeting>(userContext: uId);

            var previousMonthStart = DateTime.Now.GetStartOfPreviousMonth();
            var previousMonthEnd = DateTime.Now.GetEndOfPreviousMonth();
            var currentMonthEnd = DateTime.Now.GetEndOfMonth();

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
            var licenses = licenseRepo.GetAll().Where(x => pracitionerUserIds.Contains(x.UserId.ToString())).ToList();
            var visits = visitRepo.GetAll().Where(x => pracitionerUserIds.Contains(x.Practitioner.UserId.ToString())).ToList();
            var classroomGroups = classroomGroupRepo.GetAll().Where(x => x.IsActive && pracitionerUserIds.Contains(x.UserId.ToString())).ToList();
            var clubMemberDictionary = clubMemberRepo.GetAll().Where(x => x.IsActive).Select(x => new { x.PractitionerId, x.ClubId }).ToList();

            var lastMonthClubMeetings = clubMeetingRepo.GetAll()
                .Where(x => x.IsActive && x.MeetingDate.HasValue && x.MeetingDate.Value.Month == DateTime.Now.Month && x.MeetingDate.Value.Year == DateTime.Now.Year)
                .Include(x => x.ClubMeetingRegister)
                .ToList();

            var practitionerClubAbsenceDictionary = clubMeetingRegisterRepo.GetAll()
                .Where(x => x.InsertedDate.Year == DateTime.Now.Year && x.IsActive && !x.Attended)
                .GroupBy(x => x.PractitionerId)
                .ToDictionary(x => x.First().PractitionerId, x => x.Count());

            foreach (var practitioner in practitioners)
            {
                var practitionerClassrooms = classrooms.Where(x => x.UserId == practitioner.UserId || x.UserId.ToString() == practitioner.PrincipalHierarchy.ToString()).ToList();
                var practitionerClassroomGroupIds = classroomGroups.Where(x => x.UserId.HasValue && x.UserId.Value == practitioner.UserId.Value).Select(x => x.Id).ToList();
                var classroom = practitionerClassrooms.FirstOrDefault();
                var practitionerAbsenteeDays = absenteeDays.Where(x => x.UserId == practitioner.UserId && x.AbsentDate <= DateTime.Now.Date).ToList();

                var notification = new NotificationDisplay()
                {
                    UserId = practitioner.UserId,
                    UserType = "practitioner"
                };

                #region NOT REGISTERED ON FUNDA APP
                if (
                    // If they are a trainee, check if they have logged in
                    (practitioner.IsTrainee.HasValue && practitioner.IsTrainee.Value && practitioner.User.LastSeen == DateTime.MinValue)
                    // If they are a practitioner, check is registered
                    || ((!practitioner.IsTrainee.HasValue || !practitioner.IsTrainee.Value) && (!practitioner.IsRegistered.HasValue || !practitioner.IsRegistered.Value)))
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

                #region REMOVED FROM PROGRAMME
                var removalHistory = removalRepo.GetListByUserId(practitioner.UserId.Value)
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

                #region PROGRESS REPORTS OVERDUE
                var isPeriod1 = previousMonthStart.Month <= 7;
                var reportOverDueStart = ChildProgressReportService.GetReportOverDueStart(previousMonthStart.Year, isPeriod1);
                var reportOverDueEnd = ChildProgressReportService.GetReportOverDueEnd(previousMonthStart.Year, isPeriod1);

                if (DateTime.Now > reportOverDueStart && DateTime.Now < reportOverDueEnd)
                {
                    var missedReports = childProgressReportService.GetChildProgressReportStatusCountsForPractitioner(
                    practitioner.Hierarchy,
                    practitionerClassroomGroupIds);

                    if (missedReports.reportsMissingOrIncomplete > 0)
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

                if (mode == "coach")
                {
                    #region TRAINEE ONBOARDING INCOMPLETE (2 weeks) AND (4 weeks) (REMOVE TRAINEE) AND TRAINEE TASKS OVERDUE
                    if (practitioner.IsTrainee.HasValue && practitioner.IsTrainee.Value)
                    {
                        var traineeTimeline = personnelService.GetOnBoardTraineeTimeline(practitioner.UserId.ToString());

                        var warningCount = 0;
                        var warningString = MetricsColorEnum.Warning.ToString();
                        if (traineeTimeline.DayOneStartUpTrainingColor == null || traineeTimeline.DayOneStartUpTrainingColor == warningString) warningCount++;
                        if (traineeTimeline.CommunitySupportColor == null || traineeTimeline.CommunitySupportColor == warningString) warningCount++;
                        if (traineeTimeline.ConsolidationMeetingColor == null || traineeTimeline.ConsolidationMeetingColor == warningString) warningCount++;
                        if (traineeTimeline.SignFranchiseeAgreementColor == null || traineeTimeline.SignFranchiseeAgreementColor == warningString) warningCount++;
                        if (traineeTimeline.SignStartUpSupportAgreementColor == null || traineeTimeline.SignStartUpSupportAgreementColor == warningString) warningCount++;
                        if (traineeTimeline.SmartSpaceChecklistColor == null || traineeTimeline.SmartSpaceChecklistColor == warningString) warningCount++;
                        if (traineeTimeline.SmartSpaceLicenseColor == null || traineeTimeline.SmartSpaceLicenseColor == warningString) warningCount++;
                        if (traineeTimeline.SSCoachVisitColor == null || traineeTimeline.SSCoachVisitColor == warningString) warningCount++;
                        if (traineeTimeline.StarterLicenseColor == null || traineeTimeline.StarterLicenseColor == warningString) warningCount++;
                        if (traineeTimeline.ThreeChildrenRegisteredColor == null || traineeTimeline.ThreeChildrenRegisteredColor == warningString) warningCount++;

                        if (traineeTimeline.StarterLicenseDate < DateTime.Now.AddDays(-28))
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
                        else if (traineeTimeline.StarterLicenseDate < DateTime.Now.AddDays(-14))
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
                            var successtring = MetricsColorEnum.Success.ToString();
                            if (traineeTimeline.CommunitySupportDeadlineDate < DateTime.Now && traineeTimeline.CommunitySupportColor != successtring) overdueCount++;
                            if (traineeTimeline.ConsolidationDeadlineDate < DateTime.Now && traineeTimeline.ConsolidationMeetingColor != successtring) overdueCount++;
                            if (traineeTimeline.SignFranchiseeAgreementDeadlineDate < DateTime.Now && traineeTimeline.SignFranchiseeAgreementColor != successtring) overdueCount++;
                            if ((traineeTimeline.SignStartUpSupportAgreementDeadlineDate < DateTime.Now && traineeTimeline.SignStartUpSupportAgreementColor != successtring)
                            && practitioner.IsOnStipend.HasValue && practitioner.IsOnStipend.Value) overdueCount++;
                            if (traineeTimeline.SmartSpaceChecklistDeadlineDate < DateTime.Now && traineeTimeline.SmartSpaceChecklistColor != successtring) overdueCount++;
                            if (traineeTimeline.SSCoachVisitDeadlineDate < DateTime.Now && traineeTimeline.SSCoachVisitColor != successtring) overdueCount++;
                            if (traineeTimeline.ThreeChildrenRegisteredDeadlineDate < DateTime.Now && traineeTimeline.ThreeChildrenRegisteredColor != successtring) overdueCount++;

                            if (traineeTimeline.SSCoachVisitDeadlineDate < DateTime.Now &&
                                traineeTimeline.SSCoachVisitDone == false)
                            {
                                notification.Subject = "SmartSpace visit overdue";
                                notification.Icon = MetricsIconEnum.Error.ToString();
                                notification.Color = MetricsColorEnum.Error.ToString();
                                notification.Message = "";
                                notification.Notes = "";
                                notification.GroupingName = "SmartSpace visit overdue";
                                yield return notification;
                                continue;
                            }
                            if (traineeTimeline.SSCoachVisitDate > DateTime.Now &&
                               traineeTimeline.SSCoachVisitDone == false)
                            {
                                notification.Subject = $"{((DateTime)traineeTimeline.SSCoachVisitDate).ToString("MMMM dd", CultureInfo.InvariantCulture)}, SmartSpace visit due";
                                notification.Icon = MetricsIconEnum.Error.ToString();
                                notification.Color = MetricsColorEnum.Error.ToString();
                                notification.Message = "";
                                notification.Notes = "";
                                notification.GroupingName = "SmartSpace visit overdue";
                                yield return notification;
                                continue;
                            }

                            if (overdueCount > 0)
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
                        #region NEW TRAINEE
                        notification.Subject = "New trainee";
                        notification.Icon = MetricsIconEnum.Success.ToString();
                        notification.Color = MetricsColorEnum.Success.ToString();
                        notification.Message = "";
                        notification.Notes = "";
                        notification.GroupingName = "New trainee";
                        yield return notification;
                        continue;
                        #endregion
                    }
                    #endregion

                    var firstPqaVisit = visits.Where(x => x.PractitionerId == practitioner.Id && x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1).FirstOrDefault();

                    // NOTE - this might not occur since we auto remove practitioners when delicensing, it's a fallback in case the process was interupted
                    #region DELICENSE SMARTSTARTER
                    if (licenses.Any(x => x.UserId == practitioner.UserId && x.DelicensedDate != null))
                    {
                        var redFlagVisit =
                        (
                            from visit in visitGenRepo.GetAll().Where(x => x.Practitioner.User.Id == practitioner.UserId)
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

                        var pqaRating1 = firstPqaVisit != null ? pqaRatingRepo.GetAll().FirstOrDefault(x => x.VisitId == firstPqaVisit.Id) ?? new PQARating() : new PQARating();

                        if ((new[] { pqaRating1 }).Count(x => x.OverallRatingColor == MetricsColorEnum.Error.ToString()) >= 2)
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
                        notification.GroupingName = "SmartSpace visit overdue";
                        yield return notification;
                        continue;
                    }
                    #endregion
                    #region PQA REACCREDITATION DUE
                    if (firstAccreditationPqaVisit != null && !firstAccreditationPqaVisit.Attended && (firstAccreditationPqaVisit.PlannedVisitDate > DateTime.Now && firstAccreditationPqaVisit.PlannedVisitDate < DateTime.Now.AddMonths(3)))
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
                }

                #region ON LEAVE
                if (practitionerAbsenteeDays.Any(x => x.AbsentDate.Date == DateTime.Now.Date))
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

                #region ON EXTENDED LEAVE
                if (practitionerAbsenteeDays.Any(x => x.AbsentDate.Date <= DateTime.Now.Date || (x.AbsentDateEnd.HasValue && x.AbsentDateEnd.Value.Date <= DateTime.Now.Date)))
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

                #region ABSENT MORE THAN 25%
                if (practitionerAbsenteeDays.Count() > 0 && practitionerAbsenteeDays.Count() > 4)
                {
                    notification.Subject = "Practitioner absent more than 25%";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "On leave";
                    yield return notification;
                    continue;
                }
                #endregion

                #region ABSENT 10-24% LAST MONTH
                if (practitionerAbsenteeDays.Count() > 0 && practitionerAbsenteeDays.Count() <= 5 && practitionerAbsenteeDays.Any(x => x.AbsentDate <= previousMonthEnd))
                {
                    notification.Subject = "Practitioner absent last month";
                    notification.Icon = MetricsIconEnum.Warning.ToString();
                    notification.Color = MetricsColorEnum.Warning.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "On leave";
                    yield return notification;
                    continue;
                }
                #endregion

                if ((practitioner.IsPrincipal.HasValue && (bool)practitioner.IsPrincipal.Value == true) || (practitioner.IsFundaAppAdmin.HasValue && (bool)practitioner.IsFundaAppAdmin.Value == true))
                {

                    var lastMonthStatement = incomeManager.GetStatements(practitioner.UserId.ToString(), previousMonthStart, previousMonthEnd).FirstOrDefault();
                    #region MISSING INCOME STATEMENT
                    if (lastMonthStatement == null || lastMonthStatement.AutoSubmitted)
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

                    #region PROGRAMME LOST R300 IN LAST 2 MONTHS
                    var secondLastMonth = previousMonthStart.AddMonths(-1);
                    var secondLastMonthStatement = incomeManager.GetStatements(practitioner.UserId.ToString(), secondLastMonth, secondLastMonth).FirstOrDefault();
                    if (lastMonthStatement != null && secondLastMonthStatement != null)
                    {
                        var balance = lastMonthStatement.Balance + secondLastMonthStatement.Balance;
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

                    #region MADE R300 PROFIT  - WHAT IS THIS PERIOD? Last 3 moneths? Is it tied to another alert I can look up?
                    if (lastMonthStatement != null && secondLastMonthStatement != null)
                    {
                        var balance = lastMonthStatement.Balance + secondLastMonthStatement.Balance;
                        if (balance > 0)
                        {
                            notification.Subject = $"Made R{balance} profit in {secondLastMonth.ToString("MMM")}-{previousMonthStart.ToString("MMM")}";
                            notification.Icon = MetricsIconEnum.Success.ToString();
                            notification.Color = MetricsColorEnum.Success.ToString();
                            notification.Message = "";
                            notification.Notes = "";
                            notification.GroupingName = "Programme making profit";
                            yield return notification;
                            continue;
                        }
                    }
                    #endregion

                    #region LESS THAN 5 CHILDREN REGISTERED                
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
                    #endregion
                }


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

                if (practitioner.IsTrainee is null || (practitioner.IsTrainee.HasValue && practitioner.IsTrainee == false))
                {
                    #region 50% CHILD ATTENDANCE
                    var attendancePercentage = attendanceRepo.GetAttendancePercentileByParent(practitioner.UserId.ToString(), previousMonthStart, previousMonthEnd);
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
                }

                #region NOT ASSIGNED TO CLUB

                if (!clubMemberDictionary.Any(x => x.PractitionerId == practitioner.Id))
                {
                    notification.Subject = "Not assigned to a club";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "Not assigned to a club";
                    yield return notification;
                    continue;
                }

                #endregion

                #region MISSED 3 CLUB MEETINGS

                var clubId = clubMemberDictionary.First(x => x.PractitionerId == practitioner.Id).ClubId;
                var lastMonthMeeting = lastMonthClubMeetings.FirstOrDefault(x => x.ClubId == clubId);
                if (lastMonthMeeting != null && lastMonthMeeting.ClubMeetingRegister.Any(x => !x.Attended && x.PractitionerId == practitioner.Id))
                {
                    var missedMeetings = practitionerClubAbsenceDictionary.ContainsKey(practitioner.Id) ? practitionerClubAbsenceDictionary[practitioner.Id] : 1;
                    notification.Subject = $"Missed {missedMeetings} club meetings";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "Missed club meetings";
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

                #region INCOMPLETE CHILD REGISTRATIONS
                var learners = new List<Learner>();
                foreach (var group in practitionerClassroomGroupIds)
                {
                    learners.AddRange(attendanceService.GetAllLearnerGroupInstances(group));
                }
                var childUserIds = learners.Select(c => c.UserId).Distinct().ToList();
                var children = childRepo.GetAll().Where(x => childUserIds.Contains(x.UserId)).ToList();
                var documents = docRepo.GetAll().Where(d => childUserIds.Contains(d.UserId) && d.IsActive == true
                    && (d.DocumentType.EnumId == FileTypeEnum.ChildClinicCard || d.DocumentType.EnumId == FileTypeEnum.ChildBirthCertificate)).ToList();

                var incompleteRegistrations = GetIncompleteChildRegistrations(children, learners, documents);
                if (incompleteRegistrations > 0)
                {
                    notification.Subject = $"{incompleteRegistrations} Incomplete child registrations";
                    notification.Icon = MetricsIconEnum.Error.ToString();
                    notification.Color = MetricsColorEnum.Error.ToString();
                    notification.Message = "";
                    notification.Notes = "";
                    notification.GroupingName = "Child Registrations";
                    yield return notification;
                    continue;
                }
                #endregion

                #region CHILDREN DID NOT PROGRESS
                var childProgress = GetChildProgress(repoFactory, ChildProgressReportService.GetReportPeriodStart(previousMonthStart.Year, previousMonthStart.Month <= 7), children);

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
