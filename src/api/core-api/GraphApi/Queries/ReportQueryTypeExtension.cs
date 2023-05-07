using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports;
using ECDLink.SmartStart.Reports.ChildProgressReport;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
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

            var attendaceRepo = attendanceRepo.GetAllByDateRange(startOfYear, endOfYear);
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

            var attendaceRepo = attendanceRepo.GetAllByDateRange(fromDate, toDate);

            var attendanceAttended = attendaceRepo.Where(x => x.Attended).Count();
            var attendanceUnAttended = attendaceRepo.Where(x => !x.Attended).Count();

            attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Attended", Value = attendanceAttended.ToString() });
            attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Absent", Value = attendanceUnAttended.ToString() });


            return attendedVsAbsent;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<ClassroomMetricReport> GetClassAttendanceMetrics(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] MonthlyAttendanceReport report,
            DateTime startMonth,
            DateTime endMonth)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerRepo.GetAll().ToList(); //get all practitioners within userhierarchy

            List<ClassroomMetricReport> metrics = new List<ClassroomMetricReport>();
            foreach (var practitioner in practitioners)
            {
                var metric = this.GetClassAttendanceMetricsByUser(repoFactory, attendanceRepo, report,  practitioner.UserId, startMonth, endMonth);
                if (metric.Any())
                {
                    if (metric.FirstOrDefault().classroomGroupId.ToString() != "00000000-0000-0000-0000-000000000000")
                    {
                        metrics.AddRange(metric);
                    }
                }

            }
            return metrics;
        }

        [Permission(PermissionGroups.REPORTING, GraphActionEnum.View)]
        public List<ClassroomMetricReport> GetClassAttendanceMetricsByUser(
            IGenericRepositoryFactory repoFactory,
            [Service] AttendanceTrackingRepository attendanceRepo,
            [Service] MonthlyAttendanceReport report,
            string userId,
            DateTime startMonth,
            DateTime endMonth)
        {
            DateTime reference = DateTime.Now;

            List<ClassroomMetricReport> metric = new List<ClassroomMetricReport>();
            var classGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: userId);
            var LearnerRepo = repoFactory.CreateRepository<Learner>(userContext: userId);

            var fromDate = (startMonth != null ? startMonth : new DateTime(reference.Year, reference.Month, 1));
            fromDate = fromDate.AddMonths(-1);
            var toDate = endMonth;
            if (endMonth == null)
            {
                toDate = reference;
            }

           // var attendanceReport = report.GenerateMonthlyAttendanceReport(userId, null, startMonth.Date, endMonth.Date);

            var classroomGroups = classGroupRepo.GetAll().Where(x => x.UserId.ToString().Contains(userId)).ToList();
            if (classroomGroups != null)
            {
                foreach (var group in classroomGroups)
                {
                    List<Learner> learners = LearnerRepo.GetAll().Where(x => x.ClassroomGroupId.ToString().Contains(group.Id.ToString())).ToList();
                    int childCount = learners.Count;
                    int month = fromDate.Month;
                    int year = fromDate.Year;
                    int weekOfYear = fromDate.GetWeekOfYear();

                    int attendancePercentage = 0;
                    List<Attendance> attendanceData = attendanceRepo.GetAllByDateRangeByClassroom(fromDate, toDate, group.Id, group.UserId.ToString());
                    if (attendanceData.Any())
                    {
                        var attendanceAttended = attendanceData.Where(x => x.Attended == true).Count();
                        var attendanceUnAttended = attendanceData.Where(x => x.Attended == false).Count();
                        if (attendanceUnAttended > 0)
                            attendancePercentage = (int)(childCount > 0 && attendanceAttended > 0 ? Math.Round((double)(attendanceAttended / (double)(attendanceAttended + attendanceUnAttended)) * 100) : 0);
                        //override month and year to attendance month and year
                        month = attendanceData.FirstOrDefault().MonthOfYear;
                        year = attendanceData.FirstOrDefault().Year;
                        weekOfYear = attendanceData.FirstOrDefault().WeekOfYear;
                    }
                    metric.Add(new ClassroomMetricReport() { childCount = childCount, attendancePercentage = attendancePercentage, classroomGroupId = group.Id.ToString(), classroomId = group.ClassroomId.ToString(), month = month, year = year, weekOfYear = weekOfYear, practitionerId = userId });
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

                var attendaceRepo = attendanceRepo.GetAllByDateRange(fromDate, toDate);
                var attendanceAttended = attendaceRepo.Where(x => x.Attended).Count();
                var attendanceUnAttended = attendaceRepo.Where(x => !x.Attended).Count();

                foreach (var c in classes)
                {
                    //calculate attendance
                    var attendedVsAbsent = new List<MetricReportStatItem>();
                    attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Attended", Value = attendanceAttended.ToString() });
                    attendedVsAbsent.Add(new MetricReportStatItem() { Name = "Absent", Value = attendanceUnAttended.ToString() });

                    var thisClass = new ClassroomMetricReport() { childCount = 4, attendancePercentage = 75, classroomId = c.Id.ToString(), month = fromDate.Month, year = fromDate.Year };
                    metrics.Add(thisClass);
                }
            }

            return metrics;
        }

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
            var uId = user.Id;

            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practitionerHieracry = hierarchyEngine.GetUserHierarchy(practitionerId);
            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var classroomGroup = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId)
                    .GetAll().Where(c => c.UserId == Guid.Parse(practitionerId)).FirstOrDefault();

            var notifications = new List<NotificationDisplay>();

            // TODO: use this to apply:
            // https://docs.google.com/spreadsheets/d/1xsS-JECUKWzj26sNcOllesCSZ39QwOh95T8goYdozbk/edit#gid=607178088&range=F71
            // "Note for all actions:
            // - Remove the action item either if the practitioner has completed the associated action and gone online + synced on Funda App(where possible)
            //   OR where the coach has tapped ""I have contacted Bulelwa""(if relevant) "
            var coachHasContactedPractitionerThisMonth = false;

            //set basic dates to be last month and before last
            // TODO: Get reporting interval from: `ChildReportOptions`
            DateTime currentDate = DateTime.Now;

            DateTime currentMonthStart = currentDate.GetStartOfMonth();
            DateTime currentMonthEnd = currentDate.GetEndOfMonth();

            DateTime previousMonthStart = currentDate.GetStartOfPreviousMonth();
            DateTime previousMonthEnd = currentDate.GetEndOfPreviousMonth();


            // Get Missing Attendance
            // Todo: move to service?
            var holidays = holidayService.GetHolidays(previousMonthStart, previousMonthEnd, "en-za").ToList();
            var daysForPeriod = previousMonthStart.DaysBetween(previousMonthEnd);

            var nonHolidayWeekDays = RemoveWeekendDays(RemoveHolidays(daysForPeriod, holidays)).ToList();
            //var onlyClassDays = nonHolidayWeekDays.

            var attendance = new List<Attendance>();

            if (classroomGroup?.Id is not null)
                attendance = attendanceRepo.GetAllByDateRangeByClassroom(previousMonthStart, previousMonthEnd, classroomGroup.Id, practitionerId);

            var availableMeetingDays = nonHolidayWeekDays
                .Select(r => DateOnly.FromDateTime(r))
                .Except(attendance.Select(a => DateOnly.FromDateTime(a.AttendanceDate)));


            var classProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>();
            var meetingDays = classProgrammeRepo.GetAll()
                .Where(p => p.ClassroomGroupId == classroomGroup.Id)
                .Select(cp => (DayOfWeek)cp.MeetingDay)
                .ToList();
            var actualMeetingDays = availableMeetingDays.Where(ad => meetingDays.Contains(ad.DayOfWeek));
            // TODO: Should absentees be subtracted? what happens if a Prac isn't there or the class is just cancelled?
            var missingRegisterDayCount = actualMeetingDays.Count();

            if (missingRegisterDayCount > 0)
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

            // Get Attendance Rate
            if (classroomGroup?.Id is not null)
            {
                // The results of this seem wrong?
                var attendanceReport = attendanceReportService.GetChildAttendance(classroomGroup.Id, practitionerId, previousMonthStart, previousMonthEnd);
                var attendancePercentage = attendanceReport?.AttendancePercentage ?? 0;
                if (attendancePercentage < 80)
                {
                    notifications.Add(new NotificationDisplay()
                    {
                        Subject = $"{attendancePercentage}% attendance rate",
                        // TODO: Warnings or errors?
                        Icon = MetricsIconEnum.Error.ToString(),
                        Color = MetricsColorEnum.Error.ToString(),
                        Message = $"{classroomGroup?.Name} - {previousMonthStart.ToString("MMMM yyyy")}",
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
            var reportPeriodStart = (isPeriod1 ? new DateOnly(previousMonthStart.Year, 1, 1) : new DateOnly(previousMonthStart.Year, 7, 1))
                .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
            var reportPeriodEnd = (isPeriod1 ? new DateOnly(previousMonthStart.Year, 6, 30) : new DateOnly(previousMonthStart.Year, 12, 20))
                .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);

            var reportDueStart = (isPeriod1 ? new DateOnly(previousMonthStart.Year, 6, 1) : new DateOnly(previousMonthStart.Year, 11, 1))
                    .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
            var reportDueEnd = (isPeriod1 ? new DateOnly(previousMonthStart.Year, 6, 30) : new DateOnly(previousMonthStart.Year, 11, 30))
                .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);

            var reportOverDueStart = (isPeriod1 ? new DateOnly(previousMonthStart.Year, 7, 1) : new DateOnly(previousMonthStart.Year, 12, 1))
                .ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
            var reportOverDueEnd = (isPeriod1 ? new DateOnly(previousMonthStart.Year, 7, 31) : new DateOnly(previousMonthStart.Year, 12, 20))
                .ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
            
            int missedReportCount = 0;

            if (classroomGroup?.Id is not null)
            {
                // None of the below is needed if the reports aren't due yet.
                if (currentDate >= reportPeriodStart)
                {
                    var childCount = childRepo.GetAll().Count(c => c.Hierarchy.StartsWith(practitionerHieracry) && c.IsActive == true);

                    var progressReports = repoFactory.CreateRepository<ChildProgressReport>(userContext: user.Id)
                        .GetAll()
                        .Where(x =>
                                x.ClassroomGroupId == classroomGroup.Id
                                && x.ReportDate.ToUniversalTime() >= reportDueStart
                                && x.ReportDate.ToUniversalTime() <= reportOverDueEnd
                                && x.IsActive == true)
                        .OrderBy(x => x.ReportDate)
                        .ToList();

                    var dueReportsSubmitted = progressReports?.Count(r => r.ReportDate >= reportDueStart && r.ReportDate <= reportDueEnd) ?? 0;
                    var overdueReportsSubmitted = progressReports?.Count(r => r.ReportDate >= reportOverDueStart && r.ReportDate <= reportOverDueEnd) ?? 0;
                    var unsibmittedOverdueReportsCount = childCount - overdueReportsSubmitted;
                    missedReportCount = childCount - (dueReportsSubmitted + overdueReportsSubmitted);

                    // Rule:
                    // Show this action as soon as at least 1 of a practitioner's child progress reports become overdue
                    // Note: once the reporting deadline has passed (31 July for June reporting period; and 20 December for the November reporting period),
                    // remove this action item -- if reports were missed, they will show up as the action item in the row below."

                    if (unsibmittedOverdueReportsCount > 0
                        && currentDate >= reportOverDueEnd)
                    {
                        notifications.Add(new NotificationDisplay()
                        {
                            Subject = $"{unsibmittedOverdueReportsCount} overdue progress reports",
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

                    // Rule:
                    // Show only if the practitioner did not submit reports for the
                    // January to June reporting period by the deadline(31 July) or for the 
                    // July to November reporting period by the deadline(20 Dec)

                    if (missedReportCount > 0
                        && currentDate >= reportOverDueEnd)
                    {
                        notifications.Add(new NotificationDisplay()
                        {
                            Subject = $"{missedReportCount} missed progress reports",
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
                    // End Get Due/Overdue Reports


                }
            }
            // Start Get Children not progressed
            // Get children that haven't progressed for 2 or 3 periods
            // but only if:
            // Rule:
            // Show only if the practitioner did not submit reports for the January to June reporting period by the deadline(31 July)
            // or for the July to November reporting period by the deadline(20 Dec)"
            if (missedReportCount > 0
                        && currentDate >= reportOverDueEnd)
            {
                var children = childRepo.GetAll().Where(c => c.IsActive == true && c.Hierarchy.StartsWith(practitionerHieracry)).Include(c => c.User).ToList();
                
                // Get Child Age Groups
                var childrenOutsideAgeGroupCount = children.Count(c => currentDate >= c.User.DateOfBirth.AddYears(3) 
                    && currentDate < c.User.DateOfBirth.AddYears(+6));
                var percentOfChildrenOutsideAgeGroup = childrenOutsideAgeGroupCount / children.Count() * 100;

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
                var hasProgressedInLast2Periods = 0;
                var hasProgressedInLast3Periods = 0;

                foreach (var progressList in progressHistory)
                {
                    var ordered = progressList.Value.OrderByDescending(p => p.Item1);
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
                var hasNotPorgressed2 = childIds.Count() - hasProgressedInLast2Periods;
                var hasNotPorgressed3 = childIds.Count() - hasProgressedInLast3Periods;

                // Rule:
                // Only show this action if there is at least 1 child who did not progress from one reporting period to the next
                // (for e.g.from Jan-Jun 2021 to Jul to Nov 2021) "
                if (hasNotPorgressed2 > 0)
                {
                    notifications.Add(new NotificationDisplay()
                    {
                        Subject = $"{hasNotPorgressed2} children havent progressed",
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
                if (hasNotPorgressed3 > 0)
                {
                    notifications.Add(new NotificationDisplay()
                    {
                        Subject = $"{hasNotPorgressed3} children havent progressed",
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

            return notifications;
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
            IGenericRepositoryFactory repoFactory,
            string type)//, DateTime fromDate,DateTime toDate
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var notificationList = new List<NotificationDisplay>();

            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);

            //set basic dates to be last month and before last
            DateTime reference = DateTime.Now;
            DateTime fromDate = reference.GetStartOfPreviousMonth();
            DateTime toDate = reference.GetEndOfPreviousMonth();

            //// report dates for Practitioner for previous week?
            //{
            //    fromDatePractitioner = reference.GetStartOfPreviousWeek();
            //    toDatePractitioner = fromDate.AddDays(7);
            //}

            int avgClassDays = 20;

            DisplaySet weighting30 = new DisplaySet();
            DisplaySet weighting20 = new DisplaySet();
            DisplaySet weighting10 = new DisplaySet();

            /*Do logic for weighting - loop through each user then
            1: Get all not registered
            2: Get all progress reports overdue
            3: Get all incomplete registers (for practitioners/principals)
            4: Get Days absent (for practitioners/principals)
            5: Get Child attendance for each
            6: get all leavers - practitioners disputing association to principal
            7: get all no classes assigned
            8: 

            Add weighting to each subject, and weigh up for each user what the messages are and use weighting to push the most relevant message up to the top, and assign colour, icon and Message to each
            return list to FE for each user
            */
            type = type.ToLower();

            if (type == "child")
            {
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

                    notificationList.Add(displayChild);
                }
            }

            if (type == "practitioner" || type == "principal" || type == "coach")
            {  //practitioners and principals
                var practitioners = practRepo.GetAll().ToList();
                foreach (var user in practitioners)
                {
                    string finalMessageToDisplay = "";
                    string finalIcon = "";
                    string finalColor = "";
                    string finalNotes = "";
                    int priority = 8; //set the priority high and override as importance goes along
                    int weighting = 0;
                    int absentDays = 0;

                    //get absent days count 
                    var absenteeRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);
                    absentDays = absenteeRepo.GetAll()
                        .Count(x => x.UserId == user.UserId && x.AbsentDate >= fromDate && x.AbsentDate <= toDate);

                    //get is registered?
                    bool isRegistered = user.IsRegistered != null && user.IsRegistered == true;
                    //get is leaving?
                    bool isLeaving = user.IsLeaving != null && user.IsLeaving == true;
                    //get is complete?
                    bool isComplete = user.IsRegistered != null && user.IsRegistered == true; //(double)user.Progress > 0.2 ? true : false; // TODO: when FE is fully integrated to use the progress indicators, then revert and not user IsRegistered

                    int attendancePercentage = 0;
                    if (isRegistered)
                    {
                        //get attendance register counts across all classroomgroups and programmes
                        attendancePercentage = attendanceRepo.GetAttendancePercentileByParent(user.UserId, fromDate, toDate);
                    }
                    //TODO
                    //progress reports overdue count

                    //TODO
                    //incomplete child registers count

                    //TODO
                    //child progress reporting for coach
                    //TODO - logic to calculate "x children did not progress"

                    //priority 0
                    if (isComplete)
                    {
                        weighting10.Icon = MetricsIconEnum.Success.ToString();
                        weighting10.Color = MetricsColorEnum.Success.ToString();
                        weighting10.Subject = "Profile complete";
                        weighting10.Notes = "";
                        priority = 9;
                        weighting = 10;
                    }
                    else
                    {
                        weighting20.Icon = MetricsIconEnum.Error.ToString();
                        weighting20.Color = MetricsColorEnum.Error.ToString();
                        weighting20.Subject = "Profile incomplete";
                        weighting20.Notes = "Complete Profile";
                        priority = 1;
                        weighting = 20;
                    }


                    if (type != "coach")
                    {
                        //absentees - priority varies betwen 4 and 6
                        int absenteePercentage = (100 - (absentDays / avgClassDays) * 100);
                        if (absenteePercentage < 75)
                        {
                            weighting30.Icon = MetricsIconEnum.Error.ToString();
                            weighting30.Color = MetricsColorEnum.Error.ToString();
                            weighting30.Subject = absentDays + " days absent last month";
                            weighting30.Notes = "Improve attendance";
                            priority = 6;
                            weighting = 30;
                        }
                        else if (absenteePercentage >= 75 && absenteePercentage < 90)
                        {
                            weighting20.Icon = MetricsIconEnum.Warning.ToString();
                            weighting20.Color = MetricsColorEnum.Warning.ToString();
                            weighting20.Subject = absentDays + " days absent last month";
                            weighting20.Notes = "Improve attendance";
                            priority = 4;
                            weighting = 20;
                        }
                        else if (absenteePercentage >= 90)
                        {
                            weighting10.Icon = MetricsIconEnum.Success.ToString();
                            weighting10.Color = MetricsColorEnum.Success.ToString();
                            weighting10.Subject = absentDays + " days absent last month";
                            weighting10.Notes = "Excellent attendance";
                            priority = 8;
                            weighting = 10;
                        }
                    }

                    //Calculate Overall Attendance Percentages
                    if (attendancePercentage > 0 && attendancePercentage < 60)
                    {
                        weighting30.Icon = MetricsIconEnum.Error.ToString();
                        weighting30.Color = MetricsColorEnum.Error.ToString();
                        weighting30.Subject = "Child Attendance < 60%";
                        weighting30.Notes = "Improve attendance";
                        priority = 5;
                        weighting = 30;
                    }
                    else if (attendancePercentage >= 60 && attendancePercentage < 79)
                    {
                        weighting20.Icon = MetricsIconEnum.Warning.ToString();
                        weighting20.Color = MetricsColorEnum.Warning.ToString();
                        weighting20.Subject = "Child Attendance > 60% and less than 79%";
                        weighting20.Notes = "Improve Attendance";
                        priority = 7;
                        weighting = 20;
                    }
                    else if (attendancePercentage > 80)
                    {
                        weighting10.Icon = MetricsIconEnum.Success.ToString();
                        weighting10.Color = MetricsColorEnum.Success.ToString();
                        weighting10.Subject = "Child Attendance > 80%";
                        weighting10.Notes = "Well done, attendance is 80% or higher.";
                        priority = 8;
                        weighting = 10;
                    }



                    //Priority 1
                    if (!isRegistered)
                    {
                        weighting30.Icon = MetricsIconEnum.Error.ToString();
                        weighting30.Color = MetricsColorEnum.Error.ToString();
                        weighting30.Subject = "Not registered on Funda App";
                        weighting30.Notes = "Request registration on Funda App";
                        priority = 1;
                        weighting = 30;
                    }


                    //priority 0
                    if (isLeaving)
                    {
                        weighting30.Icon = MetricsIconEnum.Error.ToString();
                        weighting30.Color = MetricsColorEnum.Error.ToString();
                        weighting30.Subject = "Practitioner is leaving on " + user.DateToBeRemoved;
                        weighting30.Notes = "Practitioner is leaving on " + user.DateToBeRemoved;
                        priority = 0;
                        weighting = 30;
                    }


                    /*
                     Working in Priority high to low (in SLA terms, lower digits priority is higher) and weighting low to high (more important carries more weight) in seperate streams so that importance overrides
                    TODO: cleanup and use less code
                     */
                    if (weighting == 10)
                    {
                        finalMessageToDisplay = weighting10.Subject;
                        finalIcon = weighting10.Icon;
                        finalColor = weighting10.Color;
                        finalNotes = weighting10.Notes;
                    }

                    if (priority >= 0 && priority < 9)
                    {
                        if (weighting == 20)
                        {
                            finalMessageToDisplay = weighting20.Subject;
                            finalIcon = weighting20.Icon;
                            finalColor = weighting20.Color;
                            finalNotes = weighting20.Notes;
                        }
                        if (weighting == 30)
                        {
                            finalMessageToDisplay = weighting30.Subject;
                            finalIcon = weighting30.Icon;
                            finalColor = weighting30.Color;
                            finalNotes = weighting30.Notes;
                        }
                    }


                    //build up display for this user
                    NotificationDisplay displayPracti = new NotificationDisplay()
                    {
                        Subject = finalMessageToDisplay,
                        Icon = finalIcon,
                        Color = finalColor,
                        Message = finalMessageToDisplay,
                        Notes = finalNotes,
                        UserId = Guid.Parse(user.UserId),
                        UserType = "practitioner"
                    };

                    notificationList.Add(displayPracti);
                }
            }

            return notificationList;
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

    }
}
