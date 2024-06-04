using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.SmartStart.Reports.Models;
using ECDLink.SmartStart.Services;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.SmartStart.Reports
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

            var attendanceForPeriod = base.GetAttendanceRecordsForPeriod(
                classroomGroups.SelectMany(x => x.ClassProgrammes).Select(x => x.Id), 
                userId, startMonth.Date, endMonth.GetEndOfDay());


            var monthlyAttendance = new Dictionary<DateTime, List<Tuple<int, int>>>();

            // Do monthly Tracking here
            for (DateTime dt = startMonth; dt <= endMonth; dt = dt.AddMonths(1))
            {
                var attendance = new List<Tuple<int, int>>();
                // Nest into class per month on only groups user is allowed to see
                foreach (var classroomGroup in classroomGroups.Where(x => classroomGroups.Select(y => y.UserId).Contains(x.UserId)))
                {
                    var validClassDays = GetDayRangeWithoutHolidays(dt.GetStartOfMonth(), dt.GetEndOfMonth());

                    foreach (var programme in classroomGroup.ClassProgrammes)
                    {
                        var daysOfClass = CalculateDaysOfClassForMonth(dt, (int)programme.MeetingDay, validClassDays, programme.ProgrammeStartDate.Date, endMonth.Date);
                        
                        if(daysOfClass.Count() > 0)
                        {
                            // TODO - I think this needs to check the year as well
                            var attendedClasses = attendanceForPeriod
                                              .Where(x => x.UserId == Guid.Parse(userId)
                                              && x.ClassroomProgrammeId == programme.Id
                                              && x.AttendanceDate.Date >= programme.ProgrammeStartDate.Date
                                              && x.MonthOfYear == dt.Month);

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
    }
}
