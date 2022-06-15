using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.SmartStart.Reports.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.SmartStart.Reports
{
    public class MonthlyAttendanceReport : AttendanceReportBase
    {
        public MonthlyAttendanceReport(IDbContextFactory<AuthenticationDbContext> dbFactory, IHolidayService<Holiday> holidayService)
          : base(holidayService, dbFactory.CreateDbContext())
        {
        }

        public IEnumerable<MonthlyAttendanceReportModel> GenerateMonthlyAttendanceReport(string userId, Guid classroomId, DateTime startMonth, DateTime endMonth)
        {
            var classroom = _dbContext.Classrooms
                                .Include(x => x.ClassroomGroups)
                                .ThenInclude(c => c.ClassProgrammes)
                                .FirstOrDefault(c => c.Id == classroomId && string.Equals(userId, c.UserId));

            if (classroom == default(Classroom))
            {
                throw new UnauthorizedAccessException("User does not have access to this classroom");
            }

            return GenerateMonthlyAttendanceReport(userId, classroom, startMonth, endMonth);
        }

        public IEnumerable<MonthlyAttendanceReportModel> GenerateMonthlyAttendanceReport(string userId, Classroom classroom, DateTime startMonth, DateTime endMonth)
        {
            if (!classroom.ClassroomGroups.Any())
            {
                return null;
            }

            var validClassDays = GetDayRangeWithoutHolidays(startMonth, endMonth);

            var attendanceForPeriod = GetAttendanceRecordsForPeriod(classroom, userId, startMonth, endMonth);

            var monthlyAttendance = new Dictionary<DateTime, List<Tuple<int, int>>>();

            // Do monthly Tracking here
            for (DateTime dt = startMonth; dt <= endMonth; dt = dt.AddMonths(1))
            {
                var attendance = new List<Tuple<int, int>>();
                // Nest into class per month
                foreach (var classroomGroup in classroom.ClassroomGroups)
                {
                    foreach (var programme in classroomGroup.ClassProgrammes)
                    {
                        var daysOfClass = CalculateDaysOfClassForMonth(dt, (int)programme.MeetingDay, validClassDays, programme.ProgrammeStartDate, null);

                        var attendedClasses = attendanceForPeriod
                                              .Where(x => string.Equals(x.UserId, userId)
                                              && x.ClassroomProgrammeId == programme.Id
                                              && x.MonthOfYear == dt.Month);

                        attendance.Add(Tuple.Create(daysOfClass.Count(), attendedClasses.Count()));
                    }
                }

                monthlyAttendance.Add(dt, attendance);
            }

            return CreateReport(monthlyAttendance);
        }

        private List<Attendance> GetAttendanceRecordsForPeriod(Classroom classroom, string userId, DateTime startMonth, DateTime endMonth)
        {
            var classroomGroups = classroom.ClassroomGroups.ToList();
            var programmeIdList = classroomGroups.SelectMany(x => x.ClassProgrammes).Select(x => x.Id);

            return base.GetAttendanceRecordsForPeriod(programmeIdList, userId, startMonth, endMonth);
        }

        private IEnumerable<MonthlyAttendanceReportModel> CreateReport(Dictionary<DateTime, List<Tuple<int, int>>> monthlyAttendance)
        {
            var report = new List<MonthlyAttendanceReportModel>();

            foreach (var item in monthlyAttendance)
            {
                var totalAttendance = item.Value.Sum(x => x.Item1);
                var actualAttendance = item.Value.Sum(x => x.Item2);

                report.Add(new MonthlyAttendanceReportModel
                {
                    MonthOfYear = item.Key.Month,
                    Month = item.Key.ToString("MMMM"),
                    Year = item.Key.Year,
                    PercentageAttendance = actualAttendance > 0 ? (int)((actualAttendance / (totalAttendance * 1.0)) * 100) : 0
                });
            }

            return report;
        }
    }
}
