using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.SmartStart.Reports.Models;
using ECDLink.SmartStart.Services;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.SmartStart.Reports
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

        public List<ClassroomGroupChildAttendanceReportModel> GetClassroomAttendance(Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            List<ClassroomGroupChildAttendanceReportModel> classReports = new List<ClassroomGroupChildAttendanceReportModel>();
            //get classroom
            var classroom = _attendanceService.GetUserClassroom(userId, classgroupId);

            if (!classroom.ClassroomGroups.Any())
            {
                return null;
            }

            //retrieve only groups the user is allowed to see
            List<ClassroomGroup> groups = _attendanceService.GetUserClassroomGroups(userId);
            var validClassDays = GetDayRangeWithoutHolidays(startMonth, endMonth);

            foreach (var classroomGroup in classroom.ClassroomGroups.Where(x => groups.Select(y => y.UserId).Contains(x.UserId)))
            {
                var learners = _attendanceService.GetAllLearnerGroupInstances(classroomGroup.Id);
                //get all children the user is allowed to see and run against hierarchy
                List<Child> children = _attendanceService.GetChildrenForUser(userId);
                if (learners.Any())
                {
                    foreach (var learner in learners.Where(x => children.Select(y => y.UserId).Contains(x.UserId)))
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
                                var daysOfClass = attendanceForPeriod.Where(x => string.Equals(x.UserId, learner.UserId)
                                             && x.ClassroomProgrammeId == programme.Id
                                             && x.MonthOfYear == dt.Month
                                             && x.Year == dt.Year);

                                if (daysOfClass.Count() > 0)
                                {
                                    var attendedClasses = attendanceForPeriod
                                                            .Where(x => string.Equals(x.UserId, learner.UserId)
                                                            && x.ClassroomProgrammeId == programme.Id
                                                            && x.MonthOfYear == dt.Month
                                                            && x.Year == dt.Year
                                                            && x.Attended == true);

                                    attendance.Add(Tuple.Create(daysOfClass.Count(), (attendedClasses != null ? (daysOfClass.Count() > 0 ? attendedClasses.Count() : 0) : 0))); //limit attendance if there is no actual day of class, to not add a day that isnt allowed

                                }// else attendance.Add(Tuple.Create(0, 0));
                            }
                            if (attendance.Any())
                            {
                                monthlyAttendance.Add(dt, attendance);
                                allAttendance.Add(attendance);
                            }
                        }
                        var reports = _attendanceService.GetMonthlyReport(monthlyAttendance);
                        //setting up the days allowed for attendance - not taking into account actual meeting days - but we need this for a calendar PDF
                        SortedDictionary<int, int> attendanceDays = new SortedDictionary<int, int>();
                        int daysInMonth = DateTime.DaysInMonth(startMonth.Year, startMonth.Month);
                        for (int i = 1; i <= daysInMonth; i++)
                        {
                            DateTime dtCheck = Convert.ToDateTime(startMonth.Year + "-" + startMonth.Month + "-" + i.ToString());
                            if (dtCheck.DayOfWeek != DayOfWeek.Sunday && dtCheck.DayOfWeek != DayOfWeek.Saturday)
                            {
                                if (!attendanceDays.ContainsKey(i))
                                    attendanceDays[i] = 0;
                            }
                        }

                        if (reports != null)
                        {
                            var keyDays = attendanceDays.Keys.ToList();
                            foreach (var report in reports.OrderByDescending(x => x.MonthNumber))
                            {
                                SortedDictionary<int, int> totalAttendance = attendanceDays.Copy();

                                List<Attendance> attendances = _dbContext.Attendances.Where(c => c.UserId == learner.UserId && keyDays.Contains(c.AttendanceDate.Day) && c.AttendanceDate.Date >= startMonth.Date && c.AttendanceDate.Date <= endMonth.Date).OrderBy(p => p.AttendanceDate).ToList();

                                foreach (var attendance in attendances)
                                {
                                    totalAttendance[attendance.AttendanceDate.Day] = (attendance.Attended ? 1 : 0);
                                }

                                if (classReports.Where(x => x.ChildUserId.Equals(learner.UserId)).FirstOrDefault() != null)
                                {
                                    //append to existing report and not add if child already exists in report list based on different classes child may be in
                                    ClassroomGroupChildAttendanceReportModel existingReport = classReports.Where(x => x.ChildUserId.Equals(learner.UserId) && x.Month == report.MonthNumber && x.Year == report.Year).FirstOrDefault();
                                    int totalActualAttendance = existingReport.TotalActualAttendance + report.ActualAttendance;
                                    existingReport.TotalActualAttendance = totalActualAttendance;
                                    int totalExpectedAttendance = existingReport.TotalExpectedAttendance + report.ExpectedAttendance;
                                    existingReport.TotalExpectedAttendance = totalExpectedAttendance;
                                    int totalAttendancePercentage = existingReport.AttendancePercentage + report.AttendancePercentage;
                                    existingReport.AttendancePercentage = totalAttendancePercentage > 0 ? (totalAttendancePercentage > 100 ? 100 : totalAttendancePercentage) : 0;
                                    foreach (var item in totalAttendance)
                                    {
                                        if (existingReport.Attendance.ContainsKey(item.Key))
                                            existingReport.Attendance[item.Key] = existingReport.Attendance[item.Key] + item.Value;
                                    }
                                }
                                else
                                {

                                    classReports.Add(new ClassroomGroupChildAttendanceReportModel()
                                    {
                                        ChildUserId = learner.UserId,
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

        public ClassroomGroupChildAttendanceReportOverviewModel GetClassroomAttendanceOverView( Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            ClassroomGroupChildAttendanceReportOverviewModel overviewReport = new ClassroomGroupChildAttendanceReportOverviewModel();
            endMonth = (endMonth.Month == DateTime.Now.Month ? (startMonth.Date == DateTime.Now.Date ? DateTime.Now.AddDays(1) : DateTime.Now) : endMonth);
            overviewReport.ClassroomAttendanceReport = GetClassroomAttendance(classgroupId, userId, startMonth, endMonth);

            SortedDictionary<int, int> totalAttendance = new SortedDictionary<int, int>();
            int totalExpectedAttendance = 0;

            foreach (var report in overviewReport.ClassroomAttendanceReport)
            {
                totalExpectedAttendance += report.TotalExpectedAttendance;
                foreach (var dayAttendance in report.Attendance)
                {
                    if (totalAttendance.ContainsKey(dayAttendance.Key))
                        totalAttendance[dayAttendance.Key] = totalAttendance[dayAttendance.Key] + dayAttendance.Value;
                    else
                        totalAttendance.Add(dayAttendance.Key, dayAttendance.Value);
                }

            }

            overviewReport.TotalAttendance = totalAttendance;
            TotalAttendanceStatsReport stats = new TotalAttendanceStatsReport();
            stats.TotalSessions = totalExpectedAttendance;
            stats.TotalChildrenAttendedSessions = overviewReport.ClassroomAttendanceReport.Count();
            stats.TotalMonthlyAttendance = totalAttendance.Values.Sum();
            overviewReport.TotalAttendanceStatsReport = stats;

            return overviewReport;
        }


    }
}
