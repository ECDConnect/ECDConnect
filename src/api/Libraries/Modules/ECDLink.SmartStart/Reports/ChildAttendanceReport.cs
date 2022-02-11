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
    public class ChildAttendanceReport : AttendanceReportBase
    {
        public ChildAttendanceReport(IDbContextFactory<AuthenticationDbContext> dbFactory, IHolidayService<Holiday> holidayService)
          : base(holidayService, dbFactory.CreateDbContext())
        {
        }

        public ChildAttendanceReportModel GetChildAttendance(Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            var learners = GetAllLearnerInstances(userId, classgroupId);

            if (!learners.Any())
            {
                return null;
            }

            var learnerReports = new List<ChildGroupingAttendanceReportModel>();

            var validClassDays = GetDayRangeWithoutHolidays(startMonth, endMonth);

            // prolly one 1 for now
            foreach (var learner in learners)
            {
                var attendanceForPeriod = GetAttendanceRecordsForPeriod(learner, userId, startMonth, endMonth);

                var monthlyAttendance = new Dictionary<DateTime, List<Tuple<int, int>>>();

                // Do monthly Tracking here
                for (DateTime dt = startMonth; dt < endMonth; dt = dt.AddMonths(1))
                {
                    var attendance = new List<Tuple<int, int>>();

                    foreach (var programme in learner.ClassroomGroup.ClassProgrammes)
                    {
                        var daysOfClass = CalculateDaysOfClassForMonth(dt, programme.MeetingDay, validClassDays, learner.StartedAttendance, learner.StoppedAttendance);

                        var attendedClasses = attendanceForPeriod
                                              .Where(x => string.Equals(x.UserId, userId)
                                              && x.ClassroomProgrammeId == programme.Id
                                              && x.MonthOfYear == dt.Month);

                        attendance.Add(Tuple.Create(daysOfClass.Count(), attendedClasses.Count()));
                    }

                    monthlyAttendance.Add(dt, attendance);
                }

                learnerReports.Add(CreateLearnerReport(learner, GetMonthlyReport(monthlyAttendance)));
            }

            return CreateCompleteAttendanceReport(learnerReports);
        }

        private ChildAttendanceReportModel CreateCompleteAttendanceReport(List<ChildGroupingAttendanceReportModel> learnerReports)
        {
            var totalExpectedAttendance = learnerReports.Sum(x => x.ExpectedAttendance);
            var totalActualAttendance = learnerReports.Sum(x => x.ActualAttendance);

            return new ChildAttendanceReportModel
            {
                TotalActualAttendance = totalActualAttendance,
                TotalExpectedAttendance = totalExpectedAttendance,
                ClassGroupAttendance = learnerReports
            };
        }

        private List<Attendance> GetAttendanceRecordsForPeriod(Learner learner, string userId, DateTime startMonth, DateTime endMonth)
        {
            var programmeIds = learner.ClassroomGroup.ClassProgrammes.Select(x => x.Id).ToList();

            return GetAttendanceRecordsForPeriod(programmeIds, userId, startMonth, endMonth);
        }

        private ChildGroupingAttendanceReportModel CreateLearnerReport(Learner learner, IEnumerable<ChildAttendanceMonthlyReportModel> monthlyReports)
        {
            var totalExpectedAttendance = monthlyReports.Sum(x => x.ExpectedAttendance);
            var totalActualAttendance = monthlyReports.Sum(x => x.ActualAttendance);

            return new ChildGroupingAttendanceReportModel
            {
                ActualAttendance = totalActualAttendance,
                ExpectedAttendance = totalExpectedAttendance,
                StartDate = learner.StartedAttendance,
                ClassroomGroupId = learner.ClassroomGroupId,
                ClassroomGroupName = learner.ClassroomGroup.Name,
                MonthlyAttendance = monthlyReports,
                EndDate = learner.StoppedAttendance
            };
        }

        private IEnumerable<Learner> GetAllLearnerInstances(string userId, Guid classgroupId = default(Guid))
        {
            // Get all instances of where the user was a learner
            var learners = _dbContext.Learners
                            .Include(x => x.ClassroomGroup)
                            .ThenInclude(x => x.ClassProgrammes)
                            .Where(l => string.Equals(l.UserId, userId));

            if (classgroupId != default(Guid))
            {
                learners = learners.Where(l => l.ClassroomGroupId == classgroupId);
            }

            return learners.ToList();
        }

        private IEnumerable<ChildAttendanceMonthlyReportModel> GetMonthlyReport(Dictionary<DateTime, List<Tuple<int, int>>> monthlyAttendance)
        {
            var report = new List<ChildAttendanceMonthlyReportModel>();

            foreach (var item in monthlyAttendance)
            {
                var totalAttendance = item.Value.Sum(x => x.Item1);
                var actualAttendance = item.Value.Sum(x => x.Item2);

                report.Add(new ChildAttendanceMonthlyReportModel
                {
                    Month = item.Key.ToString("MMMM"),
                    MonthNumber = item.Key.Month,
                    ActualAttendance = actualAttendance,
                    ExpectedAttendance = totalAttendance
                });
            }

            return report.OrderBy(report => report.MonthNumber);
        }
    }
}
