using ECDLink.Abstractrions.Services;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using NPOI.Util;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class ChildAttendanceReport : AttendanceReportBase
    {
        protected AttendanceService _attendanceService;
        public ChildAttendanceReport(IDbContextFactory<AuthenticationDbContext> dbFactory, IHolidayService<Holiday> holidayService, [Service] AttendanceService attendanceService)
          : base(holidayService, dbFactory.CreateDbContext())
        {
            _attendanceService = attendanceService;
        }

        public ChildAttendanceReportModel GetChildAttendanceExpected(Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            return _attendanceService.GetChildAttendanceExpected(classgroupId, userId, startMonth, endMonth);
        }

        public ChildAttendanceReportModel GetChildAttendance(Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            return _attendanceService.GetChildAttendance(classgroupId, userId, startMonth, endMonth);
        }

        private IEnumerable<ChildAttendanceMonthlyReportModel> GetMonthlyReport(Dictionary<DateTime, List<Tuple<int, int>>> monthlyAttendance) { 
            return _attendanceService.GetMonthlyReport(monthlyAttendance);
        }

        public List<ClassroomGroupChildAttendanceReportModel> GetClassroomAttendance(string userId, DateTime startMonth, DateTime endMonth)
        {
            var classReports = new List<ClassroomGroupChildAttendanceReportModel>();

            //retrieve only groups the user is allowed to see
            var classroomGroups = _attendanceService.GetUserClassroomGroups(userId);
            //var validClassDays = GetDayRangeWithoutHolidays(startMonth, endMonth);

            foreach (var classroomGroup in classroomGroups.Where(x => classroomGroups.Select(y => y.UserId).Contains(x.UserId)))
            {
                var learners = _attendanceService.GetAllLearnerGroupInstances(classroomGroup.Id);
                //get all children the user is allowed to see and run against hierarchy
                var children = _attendanceService.GetChildrenForUser(userId);
                if (learners.Any())
                {
                    foreach (var learner in learners.Where(x => children.Any(y => y.UserId == x.UserId)))
                    {
                        var attendanceForPeriod = _attendanceService.GetAttendanceRecordsForPeriod(learner, userId, startMonth, endMonth);
                        var allAttendance = new List<List<Tuple<int, int>>>();
                        var monthlyAttendance = new Dictionary<DateTime, List<Tuple<int, int>>>();

                        //Check monthly Tracking here
                        for (DateTime dt = startMonth; dt <= endMonth; dt = dt.AddMonths(1))
                        {
                            var attendance = new List<Tuple<int, int>>();
                            foreach (var programme in learner.ClassroomGroup.ClassProgrammes)
                            {
                                //var daysOfClass = CalculateDaysOfClassForMonth(dt, (int)programme.MeetingDay, validClassDays, programme.ProgrammeStartDate.Date, endMonth.Date);
                                var daysOfClass = attendanceForPeriod.Where(x => x.UserId == learner.UserId
                                             && x.ClassroomProgrammeId == programme.Id
                                             && x.MonthOfYear == dt.Month
                                             && x.Year == dt.Year);

                                if (daysOfClass.Count() > 0)
                                {
                                    var attendedClasses = attendanceForPeriod
                                                            .Where(x => x.UserId == learner.UserId
                                                            && x.ClassroomProgrammeId == programme.Id
                                                            && x.MonthOfYear == dt.Month
                                                            && x.Year == dt.Year
                                                            && x.Attended == true);

                                    attendance.Add(
                                        Tuple.Create(
                                            daysOfClass.Count(), // Total attendance records for this month (attended or absent)
                                            attendedClasses.Count())); // Days attended

                                }
                            }
                            if (attendance.Any())
                            {
                                monthlyAttendance.Add(dt, attendance);
                                allAttendance.Add(attendance);
                            }
                        }
                        var reports = _attendanceService.GetMonthlyReport(monthlyAttendance);

                        //setting up the days allowed for attendance - not taking into account actual meeting days - but we need this for a calendar PDF
                        var attendanceDays = new SortedDictionary<int, int?>();
                        int daysInMonth = DateTime.DaysInMonth(startMonth.Year, startMonth.Month);
                        for (int i = 1; i <= daysInMonth; i++)
                        {
                            var dtCheck = new DateTime(startMonth.Year, startMonth.Month, i);
                            // TODO - I think this also needs to check if the programme runs on this day
                            if (dtCheck.DayOfWeek != DayOfWeek.Sunday && dtCheck.DayOfWeek != DayOfWeek.Saturday)
                            {
                                if (!attendanceDays.ContainsKey(i))
                                    attendanceDays[i] = null;
                            }
                        }

                        if (reports != null)
                        {
                            var keyDays = attendanceDays.Keys.ToList();
                            foreach (var report in reports.OrderByDescending(x => x.MonthNumber))
                            {
                                var totalAttendance = attendanceDays.Copy();

                                // TODO - We should not need to hit the DB again here, we have already fetched attendance above
                                var attendances = _dbContext.Attendances.Where(c => c.UserId == learner.UserId && keyDays.Contains(c.AttendanceDate.Day) && c.AttendanceDate.Date >= startMonth.Date && c.AttendanceDate.Date <= endMonth.Date).OrderBy(p => p.AttendanceDate).ToList();

                                foreach (var attendance in attendances)
                                {
                                    totalAttendance[attendance.AttendanceDate.Day] = (attendance.Attended ? 1 : 0);
                                }

                                if (classReports.Where(x => x.ChildUserId == learner.UserId.ToString() && x.Month == report.MonthNumber && x.Year == report.Year).FirstOrDefault() != null)
                                {
                                    //append to existing report and not add if child already exists in report list based on different classes child may be in
                                    var existingReport = classReports.Where(x => x.ChildUserId == learner.UserId.ToString() && x.Month == report.MonthNumber && x.Year == report.Year).FirstOrDefault();
                                    
                                    existingReport.TotalActualAttendance = existingReport.TotalActualAttendance + report.ActualAttendance;
                                    existingReport.TotalExpectedAttendance = existingReport.TotalExpectedAttendance + report.ExpectedAttendance;

                                    int totalAttendancePercentage = (existingReport.TotalExpectedAttendance > 0 ? (int)Math.Round((double)existingReport.TotalActualAttendance / existingReport.TotalExpectedAttendance * 100) : 0);
                                                                        
                                    existingReport.AttendancePercentage = totalAttendancePercentage > 0 ? (totalAttendancePercentage > 100 ? 100 : totalAttendancePercentage) : 0;

                                    foreach (var item in totalAttendance)
                                    {
                                        if (existingReport.Attendance.ContainsKey(item.Key))
                                        {
                                            existingReport.Attendance[item.Key] = 
                                                existingReport.Attendance[item.Key] == 1 || item.Value == 1 
                                                    ? 1 
                                                    : existingReport.Attendance[item.Key] == 0 || item.Value == 0
                                                        ? 0
                                                        : null;
                                        }
                                        else
                                        {
                                            existingReport.Attendance.Add(item.Key, item.Value);
                                        }
                                    }
                                }
                                else
                                {

                                    classReports.Add(new ClassroomGroupChildAttendanceReportModel()
                                    {
                                        ChildUserId = learner.UserId.ToString(),
                                        ClassgroupId = classroomGroup.Id,
                                        ChildFullName = learner.User.FirstName + " " + learner.User.Surname,
                                        ChildIdNumber = learner.User.IdNumber,
                                        TotalActualAttendance = report.ActualAttendance,
                                        TotalExpectedAttendance = report.ExpectedAttendance,
                                        AttendancePercentage = report.AttendancePercentage,
                                        Month = report.MonthNumber,
                                        Year = report.Year,
                                        Attendance = totalAttendance
                                    });
                                }
                            }
                        }
                    }
                }
            }

            return classReports;
        }

        public ClassroomGroupChildAttendanceReportOverviewModel GetClassroomAttendanceOverView(string userId, DateTime startMonth, DateTime endMonth)
        {
            var overviewReport = new ClassroomGroupChildAttendanceReportOverviewModel();
            endMonth = (endMonth.Month == DateTime.Now.Month ? (startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1) : DateTime.Now) : endMonth);
            overviewReport.ClassroomAttendanceReport = GetClassroomAttendance(userId, startMonth, endMonth);

            var totalAttendance = new SortedDictionary<int, int?>();
            int totalExpectedAttendance = 0;

            var sessions = new HashSet<int>();
            foreach (var report in overviewReport.ClassroomAttendanceReport)
            {
                totalExpectedAttendance += report.TotalExpectedAttendance;
                foreach (var dayAttendance in report.Attendance)
                {
                    if (totalAttendance.ContainsKey(dayAttendance.Key))
                    {
                        if (!totalAttendance[dayAttendance.Key].HasValue) //current value is null
                        {
                            totalAttendance[dayAttendance.Key] = dayAttendance.Value;
                        }else
                        {
                            if (dayAttendance.Value.HasValue) // current day has a value
                            {
                                totalAttendance[dayAttendance.Key] = totalAttendance[dayAttendance.Key] + dayAttendance.Value.Value;
                            }
                        }
                    }
                    else
                    {
                        totalAttendance.Add(dayAttendance.Key, dayAttendance.Value ?? null);
                    }
                    
                    if (dayAttendance.Value.HasValue)
                    {
                        sessions.Add(dayAttendance.Key);
                    }
                }

            }

            overviewReport.TotalAttendance = totalAttendance;
            var stats = new TotalAttendanceStatsReport();

            // We should get this from the programme details, but just taking the first record now
            stats.TotalSessions = sessions.Count();  

            // Total children who were not absent on any day
            stats.TotalChildrenAttendedAllSessions = overviewReport.ClassroomAttendanceReport.Where(x => x.Attendance.All(y => !y.Value.HasValue || y.Value.Value != 0)).Select(x => x.ChildUserId).Distinct().Count();

            stats.TotalMonthlyAttendance = (int)totalAttendance.Values.Sum();
            overviewReport.TotalAttendanceStatsReport = stats;

            return overviewReport;
        }


    }
}
