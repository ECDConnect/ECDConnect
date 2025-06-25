using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Services;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Classroom;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Api.CoreApi.Services
{
    public class MonthlyAttendanceReport : AttendanceReportBase
    {
        protected AttendanceService _attendanceService;
        public MonthlyAttendanceReport(IDbContextFactory<AuthenticationDbContext> dbFactory, IHolidayService<Holiday> holidayService, [Service] AttendanceService attendanceService)
          : base(holidayService, dbFactory.CreateDbContext())
        {
            _attendanceService = attendanceService;
        }

        public IEnumerable<MonthlyAttendanceReportModel> GenerateMonthlyAttendanceReport(string userId, DateTime startMonth, DateTime endMonth)
        {
            var classroomGroups = _attendanceService.GetUserClassroomGroups(userId);

            var attendanceForPeriod = GetAttendanceTakenRecordsForPeriod(
                classroomGroups.SelectMany(x => x.ClassProgrammes).Select(x => x.Id),
                startMonth,
                endMonth);

            var monthlyAttendance = new Dictionary<DateTime, List<Tuple<int, int>>>();

            // Do monthly Tracking here
            for (DateTime dt = startMonth; dt <= endMonth; dt = dt.AddMonths(1))
            {
                var attendance = new List<Tuple<int, int>>();
                // Nest into class per month on only groups user is allowed to see
                foreach (var classroomGroup in classroomGroups)
                {
                    var validClassDays = GetDayRangeWithoutHolidays(dt.GetStartOfMonth(), dt.GetEndOfMonth());

                    foreach (var programme in classroomGroup.ClassProgrammes)
                    {
                        var daysOfClass = CalculateDaysOfClassForMonth(dt, (int)programme.MeetingDay, validClassDays, programme.ProgrammeStartDate.Date, endMonth.Date);
                        var learners = _attendanceService.GetLearnersActiveDuringTimePeriod(classroomGroup.Id, programme.ProgrammeStartDate.Date, endMonth.Date);

                        if (daysOfClass.Count() > 0 && learners.Count() > 0)
                        {
                            var attendedClasses = attendanceForPeriod.Where(x =>
                                x.ClassroomProgrammeId == programme.Id
                                && x.AttendanceDate.Date >= programme.ProgrammeStartDate.Date
                                && x.MonthOfYear == dt.Month
                                && x.Year == dt.Year
                                && x.Attended == true);

                            attendance.Add(Tuple.Create(daysOfClass.Count(), attendedClasses.Count()));
                        }
                    }
                }
                if (attendance.Any())
                {
                    monthlyAttendance.Add(dt, attendance);
                }
            }
            return CreateReport(monthlyAttendance);
        }

        private IEnumerable<MonthlyAttendanceReportModel> CreateReport(Dictionary<DateTime, List<Tuple<int, int>>> monthlyAttendance)
        {
            var report = new List<MonthlyAttendanceReportModel>();

            foreach (var item in monthlyAttendance)
            {
                int totalAttendance = item.Value.Sum(x => x.Item1);
                int actualAttendance = item.Value.Sum(x => x.Item2);
                int reportPercentage = (actualAttendance > 0 ? (int)((actualAttendance / (totalAttendance * 1.0)) * 100) : 0);
                report.Add(new MonthlyAttendanceReportModel
                {
                    MonthOfYear = item.Key.Month,
                    Month = item.Key.ToString("MMMM"),
                    Year = item.Key.Year,
                    PercentageAttendance = reportPercentage > 100 ? 100 : (reportPercentage < 0 ? 0 : reportPercentage),
                    NumberOfSessions = actualAttendance,
                    TotalScheduledSessions = totalAttendance,
                });
            }

            return report;
        }

        private List<Attendance> GetAttendanceTakenRecordsForPeriod(IEnumerable<Guid> ClassroomProgrammeIds, DateTime startMonth, DateTime endMonth)
        {
            return _dbContext.Attendances
              .Include(i => i.ClassroomProgramme)
              .Where(a => a.UserId.HasValue && a.ParentRecordId == a.UserId.Value.ToString() && ClassroomProgrammeIds.Contains(a.ClassroomProgrammeId))
              .Where(f => f.AttendanceDate >= startMonth.Date && f.AttendanceDate < endMonth.GetEndOfDay())
              .ToList();
        }
    }
}
