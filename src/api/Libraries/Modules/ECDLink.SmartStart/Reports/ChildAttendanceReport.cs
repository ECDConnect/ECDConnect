using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
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

        public ChildAttendanceReportModel GetChildAttendanceExpected(Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            var learners = GetAllLearnerInstances(userId, classgroupId);

            if (!learners.Any())
            {
                return null;
            }

            var learnerReports = new List<ChildGroupingAttendanceReportModel>();

            var validClassDays = GetDayRangeWithoutHolidays(startMonth, endMonth);

            foreach (var learner in learners)
            {
                var attendanceForPeriod = GetAttendanceRecordsForPeriod(learner, userId, startMonth, endMonth);

                var monthlyAttendance = new Dictionary<DateTime, List<Tuple<int, int>>>();

                // Do monthly Tracking here
                for (DateTime dt = startMonth; dt <= endMonth; dt = dt.AddMonths(1))
                {
                    var attendance = new List<Tuple<int, int>>();

                    foreach (var programme in learner.ClassroomGroup.ClassProgrammes)
                    {
                        var daysOfClass = CalculateDaysOfClassForMonth(dt, programme.MeetingDay, validClassDays, learner.StartedAttendance, learner.StoppedAttendance);

                        var attendedClasses = attendanceForPeriod
                                              .Where(x => string.Equals(x.UserId, userId)
                                              && x.ClassroomProgrammeId == programme.Id
                                              && x.MonthOfYear == dt.Month
                                              && x.Year == dt.Year);

                        attendance.Add(Tuple.Create(daysOfClass.Count(), attendedClasses.Count()));
                    }
                    monthlyAttendance.Add(dt, attendance);
                }

                learnerReports.Add(CreateLearnerReport(learner, GetMonthlyReport(monthlyAttendance)));
            }

            return CreateCompleteAttendanceReport(learnerReports);
        }

        public ChildAttendanceReportModel GetChildAttendance(Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            var learners = GetAllLearnerInstances(userId, classgroupId);

            if (!learners.Any())
            {
                return null;
            }

            var learnerReports = new List<ChildGroupingAttendanceReportModel>();

            // prolly one 1 for now
            foreach (var learner in learners)
            {
                var attendanceForPeriod = GetAttendanceRecordsForPeriod(learner, userId, startMonth, endMonth);

                var monthlyAttendance = new Dictionary<DateTime, List<Tuple<int, int>>>();

                // Do monthly Tracking here
                for (DateTime dt = startMonth; dt <= endMonth; dt = dt.AddMonths(1))
                {
                    var attendance = new List<Tuple<int, int>>();

                    foreach (var programme in learner.ClassroomGroup.ClassProgrammes)
                    {
                        var daysOfClass = attendanceForPeriod.Where(x => string.Equals(x.UserId, userId)
                                              && x.ClassroomProgrammeId == programme.Id
                                              && x.MonthOfYear == dt.Month
                                              && x.Year == dt.Year);

                        var attendedClasses = attendanceForPeriod
                                              .Where(x => string.Equals(x.UserId, userId)
                                              && x.ClassroomProgrammeId == programme.Id
                                              && x.MonthOfYear == dt.Month
                                              && x.Year == dt.Year
                                              && x.Attended == true);

                        attendance.Add(Tuple.Create(daysOfClass.Count(), (attendedClasses != null ? attendedClasses.Count() : 0)));

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
            var attendancePercentage = (int)Math.Round(((double)totalActualAttendance / totalExpectedAttendance) * 100);

            return new ChildAttendanceReportModel
            {
                TotalActualAttendance = totalActualAttendance,
                TotalExpectedAttendance = totalExpectedAttendance,
                ClassGroupAttendance = learnerReports,
                AttendancePercentage = (attendancePercentage > 0 ? attendancePercentage : 0)
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
            var attendancePercentage = (int)Math.Round(((double)totalActualAttendance / totalExpectedAttendance) * 100);

            return new ChildGroupingAttendanceReportModel
            {
                ActualAttendance = totalActualAttendance,
                ExpectedAttendance = totalExpectedAttendance,
                StartDate = learner.StartedAttendance,
                ClassroomGroupId = learner.ClassroomGroupId,
                ClassroomGroupName = learner.ClassroomGroup.Name,
                MonthlyAttendance = monthlyReports,
                EndDate = learner.StoppedAttendance,
                AttendancePercentage = (attendancePercentage > 0 ? attendancePercentage : 0)
            };
        }

        private IEnumerable<Learner> GetAllLearnerInstances(string userId, Guid classgroupId = default(Guid))
        {
            var learners = _dbContext.Learners
                            .Include(x => x.ClassroomGroup)
                            .ThenInclude(x => x.ClassProgrammes)
                            .Where(l => string.Equals(l.UserId, userId));
            // Get all instances of where the user was a learner

            if (classgroupId != default(Guid))
            {
                learners = learners.Where(l => l.ClassroomGroupId == classgroupId);
            }

            return learners.ToList();
        }
        private IEnumerable<Learner> GetAllLearnerGroupInstances(Guid classgroupId = default(Guid))
        {
            var learners = _dbContext.Learners
                            .Include(x => x.ClassroomGroup)
                            .ThenInclude(x => x.ClassProgrammes)
                            .Where(l => l.ClassroomGroupId == classgroupId);
            return learners.ToList();
        }


        private IEnumerable<ChildAttendanceMonthlyReportModel> GetMonthlyReport(Dictionary<DateTime, List<Tuple<int, int>>> monthlyAttendance)
        {
            var report = new List<ChildAttendanceMonthlyReportModel>();

            foreach (var item in monthlyAttendance)
            {
                var totalAttendance = item.Value.Sum(x => x.Item1);
                var actualAttendance = item.Value.Sum(x => x.Item2);
                var attendancePercentage = (int)Math.Round(((double)actualAttendance / totalAttendance) * 100);

                report.Add(new ChildAttendanceMonthlyReportModel
                {
                    Month = item.Key.ToString("MMMM"),
                    Year = item.Key.Year,
                    MonthNumber = item.Key.Month,
                    ActualAttendance = actualAttendance,
                    ExpectedAttendance = totalAttendance,
                    AttendancePercentage = (attendancePercentage > 0 ? attendancePercentage : 0)
                });
            }

            return report.OrderByDescending(report => report.Year).ThenBy(x => x.MonthNumber);
        }

        public List<ClassroomGroupChildAttendanceReportModel> GetClassroomAttendance(Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            List<ClassroomGroupChildAttendanceReportModel> classReports = new List<ClassroomGroupChildAttendanceReportModel>();
            //get classroom
            Classroom classroom = _dbContext.Classrooms
                    .Include(x => x.ClassroomGroups)
                    .ThenInclude(c => c.ClassProgrammes)
                    .FirstOrDefault(c => c.Id == classgroupId && string.Equals(userId, c.UserId));

            if (classroom == default(Classroom))
            {
                //a practitioner may call here on a classroom that only the principal has access to, since practitioners are assigned to classroomgroups, and principals to classrooms.
                //So get the parent of the practitioner and if that matches the classroom id by their principal id to the classroom id, then allow the request

                Practitioner practi = _dbContext.Practitioners.FirstOrDefault(x => string.Equals(userId, x.UserId));
                if (practi != null && practi.PrincipalHierarchy.HasValue)
                {
                    //now test the practitioners principal userid, if its theirs, then show results. If it still doesnt match, throw the error
                    classroom = _dbContext.Classrooms
                    .Include(x => x.ClassroomGroups)
                    .ThenInclude(c => c.ClassProgrammes)
                    .FirstOrDefault(c => c.Id == classgroupId && c.UserId.Contains(practi.PrincipalHierarchy.ToString()));// && string.Equals(practi.PrincipalHierarchy, c.UserId)
                }

                if (classroom == default(Classroom))
                {
                    throw new UnauthorizedAccessException("User and Principal does not have access to this classroom");
                }
            }

            if (!classroom.ClassroomGroups.Any())
            {
                return null;
            }

            foreach (var classroomGroup in classroom.ClassroomGroups)
            {
                var learners = GetAllLearnerGroupInstances(classroomGroup.Id);

                if (learners.Any())
                {
                    foreach (var learner in learners)
                    {
                        var attendanceForPeriod = GetAttendanceRecordsForPeriod(learner, userId, startMonth, endMonth);
                        var allAttendance = new List<List<Tuple<int, int>>>();
                        var monthlyAttendance = new Dictionary<DateTime, List<Tuple<int, int>>>();

                        // Do monthly Tracking here
                        for (DateTime dt = startMonth; dt <= endMonth; dt = dt.AddMonths(1))
                        {
                            var attendance = new List<Tuple<int, int>>();

                            foreach (var programme in learner.ClassroomGroup.ClassProgrammes)
                            {
                                var daysOfClass = attendanceForPeriod.Where(x => string.Equals(x.UserId, userId)
                                                      && x.ClassroomProgrammeId == programme.Id
                                                      && x.MonthOfYear == dt.Month
                                                      && x.Year == dt.Year);

                                var attendedClasses = attendanceForPeriod
                                                      .Where(x => string.Equals(x.UserId, userId)
                                                      && x.ClassroomProgrammeId == programme.Id
                                                      && x.MonthOfYear == dt.Month
                                                      && x.Year == dt.Year
                                                      && x.Attended == true);

                                attendance.Add(Tuple.Create(daysOfClass.Count(), (attendedClasses != null ? attendedClasses.Count() : 0)));
                            }
                            monthlyAttendance.Add(dt, attendance);
                            allAttendance.Add(attendance);
                        }
                        var reports = GetMonthlyReport(monthlyAttendance);
                        //for (int i = startMonth.Month; i <= endMonth.Month; i++)
                        //{


                        //}
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

                                List<Attendance> attendances = _dbContext.Attendances.Where(c => c.UserId == learner.UserId && keyDays.Contains(c.AttendanceDate.Day)).OrderBy(p => p.AttendanceDate).ToList();

                                foreach (var attendance in attendances)
                                {
                                    totalAttendance[attendance.AttendanceDate.Day] = (attendance.Attended ? 1 : 0);
                                }

                                classReports.Add(new ClassroomGroupChildAttendanceReportModel()
                                {
                                    ChildUserId = learner.UserId,
                                    ClassgroupId = classgroupId,
                                    ChildFullName = learner.User.FullName,
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

            return classReports;
        }

        public ClassroomGroupChildAttendanceReportOverviewModel GetClassroomAttendanceOverView(Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            ClassroomGroupChildAttendanceReportOverviewModel overviewReport = new ClassroomGroupChildAttendanceReportOverviewModel();
            overviewReport.ClassroomAttendanceReport = GetClassroomAttendance(classgroupId, userId, startMonth, endMonth);

            SortedDictionary<int, int> totalAttendance = new SortedDictionary<int, int>();

            foreach (var report in overviewReport.ClassroomAttendanceReport)
            {
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
            stats.TotalSessions = totalAttendance.Count;
            stats.TotalChildrenAttendedSessions = overviewReport.ClassroomAttendanceReport.Count();
            stats.TotalMonthlyAttendance = totalAttendance.Count();
            overviewReport.TotalAttendanceStatsReport = stats;

            return overviewReport;
        }


        }
}
