using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.Api.CoreApi.Services
{
    public class AttendanceService : AttendanceReportBase
    {
        private IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        
        private IGenericRepository<Practitioner, Guid> _practiRepo;
        private IGenericRepository<ClassroomGroup, Guid> _classGroupRepo;
        private IGenericRepository<Child, Guid> _childRepo;

        public AttendanceService(IDbContextFactory<AuthenticationDbContext> dbFactory,
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory, 
            AuthenticationDbContext dbContext, 
            IHolidayService<Holiday> holidayService,
            HierarchyEngine hierarchyEngine) 
            : base(holidayService, dbFactory.CreateDbContext())
        {
            _repoFactory = repoFactory;
            _dbContext = dbContext;

            _applicationUserId = contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();

            _practiRepo = _repoFactory.CreateRepository<Practitioner>(userContext: _applicationUserId);
            _classGroupRepo = _repoFactory.CreateRepository<ClassroomGroup>(userContext: _applicationUserId);
            _childRepo = _repoFactory.CreateRepository<Child>(userContext: _applicationUserId);
        }

        #region Learners and Classrooms

        public List<Learner> GetAllLearnerInstances(string userId, Guid classgroupId = default(Guid))
        {
            var learners = _dbContext.Learners
                            .Include(x => x.ClassroomGroup)
                            .ThenInclude(x => x.ClassProgrammes)
                            .Where(l => l.UserId == Guid.Parse(userId));
            // Get all instances of where the user was a learner

            if (classgroupId != default(Guid))
            {
                learners = learners.Where(l => l.ClassroomGroupId == classgroupId);
            }

            return learners.ToList();
        }

        public List<Learner> GetAllLearnerGroupInstances(Guid classgroupId)
        {
            var learners = from learner in _dbContext.Learners
                           join child in _dbContext.Children on learner.UserId equals child.UserId
                           where learner.IsActive && child.IsActive && learner.ClassroomGroupId == classgroupId
                           select learner;

            return learners
                .Include(x => x.User)
                .Include(x => x.ClassroomGroup)
                .ThenInclude(x => x.ClassProgrammes.Where(x => x.IsActive))
                .ToList();
        }

        public List<Learner> GetLearnersActiveDuringTimePeriod(Guid classgroupId, DateTime startDate, DateTime endTime)
        {
            var learners = _dbContext.Learners
                .Include(x => x.User)
                .Where(x => x.ClassroomGroupId == classgroupId)
                .Where(x => x.StartedAttendance < endTime.Date.GetEndOfDay() && (!x.StoppedAttendance.HasValue || x.StoppedAttendance.Value > startDate))
                .OrderBy(x => x.StartedAttendance)
                .ToList();
            return learners;
        }

        public Classroom GetUserClassroom(string userId, Guid classroomId = default(Guid))
        {
            Practitioner practi = _dbContext.Practitioners.FirstOrDefault(x => Guid.Parse(userId) == x.UserId);

            var classroom = _dbContext.Classrooms
                                .Include(x => x.ClassroomGroups.Where(x => x.IsActive))
                                .ThenInclude(c => c.ClassProgrammes.Where(x => x.IsActive))
                                .Where(x => x.UserId.ToString() == userId)
                                .FirstOrDefault();

            if (classroom == default(Classroom) || classroomId != default(Guid))
            {
                classroom = (Classroom)_dbContext.Classrooms
                                .Include(x => x.ClassroomGroups.Where(x => x.IsActive))
                                .ThenInclude(c => c.ClassProgrammes.Where(x => x.IsActive))
                                .Where(x => x.Id == classroomId)
                                .FirstOrDefault(); 
            }

                if (classroom == default(Classroom))
            {

                //a practitioner may call here on a classroom that only the principal has access to, since practitioners are assigned to classroomgroups, and principals to classrooms.
                //So get the parent of the practitioner and if that matches the classroom id by their principal id to the classroom id, then allow the request
                if (practi != null && practi.PrincipalHierarchy.HasValue)
                {
                    //now test the practitioners principal userid, if its theirs, then show results. If it still doesnt match, throw the error
                    classroom = _dbContext.Classrooms
                    .Include(x => x.ClassroomGroups.Where(x => x.IsActive))
                    .ThenInclude(c => c.ClassProgrammes.Where(x => x.IsActive))
                    .FirstOrDefault(c => c.UserId.ToString().Contains(practi.PrincipalHierarchy.ToString()));// c.Id == classroomId &&
                }

                if (classroom == default(Classroom))
                {

                    throw new UnauthorizedAccessException("User and Principal does not have access to this classroom");
                }
            }

            return classroom;
        }

        public List<ClassroomGroup> GetUserClassroomGroups(string userId)
        {
            Practitioner practi = _dbContext.Practitioners.FirstOrDefault(x => Guid.Parse(userId) == x.UserId);

            if (practi != null && practi.IsPrincipal == true)
            {
               return _classGroupRepo.GetAll()
                              .Include(x => x.Classroom)
                              .Include(x => x.ClassProgrammes.Where(x => x.IsActive))
                              .Where(x => x.IsActive && x.Classroom.UserId.ToString() == userId)
                              .OrderBy(x => x.Id)
                             .ToList();
            }


            var groups = _classGroupRepo.GetAll()
              .Include(x => x.ClassProgrammes.Where(x => x.IsActive))
              .Where(x => x.IsActive && (x.UserId.HasValue && x.UserId.ToString() == userId) && x.Name != "Unsure")                
              .OrderBy(x => x.Id)
             .ToList();

            return groups;
        }

        public List<Child> GetChildrenForUser(string userId)
        {
            return _childRepo.GetAll()
                .Where(x => x.IsActive)
                .ToList(); ; //Hierarchy based children
        }

        public List<Practitioner> GetPractitionersByHierarchy()
        {
            return _practiRepo.GetAll().ToList(); ; //Hierarchy based children
        }

        #endregion

        #region Attendance

        public List<Attendance> GetAttendanceRecordsForPeriod(Learner learner, string userId, DateTime startMonth, DateTime endMonth)
        {
            var programmeIds = learner.ClassroomGroup.ClassProgrammes.Select(x => x.Id).ToList();

            return GetAttendanceRecordsForPeriodByProgramme(programmeIds, learner.UserId.ToString(), startMonth, endMonth);
        }


        #endregion

        #region Reports

        public ChildAttendanceReportModel GetChildAttendance(Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            var learners = GetAllLearnerInstances(userId, classgroupId);

            if (!learners.Any())
            {
                return null;
            }

            var learnerReports = new List<ChildGroupingAttendanceReportModel>();

            foreach (Learner learner in learners)
            {
                var attendanceForPeriod = GetAttendanceRecordsForPeriod(learner, userId, startMonth, endMonth);
                var monthlyAttendance = new Dictionary<DateTime, List<Tuple<int, int>>>();

                // Check monthly Tracking here
                for (DateTime dt = startMonth; dt <= endMonth; dt = dt.AddMonths(1))
                {
                    var attendance = new List<Tuple<int, int>>();

                    foreach (var programme in learner.ClassroomGroup.ClassProgrammes)
                    {
                        var daysOfClass = attendanceForPeriod.Where(x => x.UserId == Guid.Parse(userId)
                                              && x.ClassroomProgrammeId == programme.Id
                                              && x.MonthOfYear == dt.Month
                                              && x.Year == dt.Year);

                        var attendedClasses = attendanceForPeriod
                                              .Where(x => x.UserId == Guid.Parse(userId)
                                              && x.ClassroomProgrammeId == programme.Id
                                              && x.MonthOfYear == dt.Month
                                              && x.Year == dt.Year
                                              && x.Attended == true);              

                        attendance.Add(Tuple.Create(daysOfClass.Count(), (attendedClasses != null ? (daysOfClass.Count() > 0 ? attendedClasses.Count() : 0) : 0))); //limit attendance if there is no actual day of class, to not add a day that isnt allowed

                    }
                    monthlyAttendance.Add(dt, attendance);
                }

                learnerReports.Add(CreateLearnerReport(learner, GetMonthlyReport(monthlyAttendance)));
            }

            return CreateCompleteAttendanceReport(learnerReports);
        }

        public ChildAttendanceReportModel GetChildAttendanceExpected(Guid classgroupId, string userId, DateTime startMonth, DateTime endMonth)
        {
            var learners = GetAllLearnerInstances(userId, classgroupId);

            if (!learners.Any())
            {
                return null;
            }

            var learnerReports = new List<ChildGroupingAttendanceReportModel>();

           

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
                        var validClassDays = GetDayRangeWithoutHolidays(dt.GetStartOfMonth(), dt.GetEndOfMonth());
                        var daysOfClass = CalculateDaysOfClassForMonth(dt, programme.MeetingDay, validClassDays, learner.StartedAttendance, learner.StoppedAttendance);

                        var attendedClasses = attendanceForPeriod
                                              .Where(x => x.UserId == Guid.Parse(userId)
                                              && x.ClassroomProgrammeId == programme.Id
                                              && x.MonthOfYear == dt.Month
                                              && x.Year == dt.Year  
                                              && x.Attended == true);
                        
                        attendance.Add(Tuple.Create(daysOfClass.Count(), (attendedClasses != null ? (daysOfClass.Count() > 0 ? attendedClasses.Count() : 0) : 0))); //limit attendance if there is no actual day of class, to not add a day that isnt allowed
                    }
                    monthlyAttendance.Add(dt, attendance);
                }

                learnerReports.Add(CreateLearnerReport(learner, GetMonthlyReport(monthlyAttendance)));
            }

            return CreateCompleteAttendanceReport(learnerReports);
        }

        public ChildAttendanceReportModel CreateCompleteAttendanceReport(List<ChildGroupingAttendanceReportModel> learnerReports)
        {
            var totalExpectedAttendance = learnerReports.Sum(x => x.ExpectedAttendance);
            var totalActualAttendance = learnerReports.Sum(x => x.ActualAttendance);
            var attendancePercentage = (totalExpectedAttendance > 0 && totalActualAttendance > 0 ? (int)Math.Round(((double)totalActualAttendance / totalExpectedAttendance) * 100) : 0);

            return new ChildAttendanceReportModel
            {
                TotalActualAttendance = totalActualAttendance,
                TotalExpectedAttendance = totalExpectedAttendance,
                ClassGroupAttendance = learnerReports,
                AttendancePercentage = (attendancePercentage > 0 ? (attendancePercentage > 100 ? 100 : attendancePercentage) : 0)
            };
        }

        public ChildGroupingAttendanceReportModel CreateLearnerReport(Learner learner, IEnumerable<ChildAttendanceMonthlyReportModel> monthlyReports)
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
                AttendancePercentage = (attendancePercentage > 0 ? (attendancePercentage > 100 ? 100 : attendancePercentage) : 0)
            };
        }

        public IEnumerable<ChildAttendanceMonthlyReportModel> GetMonthlyReport(Dictionary<DateTime, List<Tuple<int, int>>> monthlyAttendance)
        {
            var report = new List<ChildAttendanceMonthlyReportModel>();

            foreach (var item in monthlyAttendance)
            {
                var expectedAttendance = item.Value.Sum(x => x.Item1);
                var actualAttendance = item.Value.Sum(x => x.Item2);
                var attendancePercentage = (expectedAttendance > 0 && actualAttendance > 0 ? (int)Math.Round(((double)actualAttendance / expectedAttendance) * 100) : 0);

                report.Add(new ChildAttendanceMonthlyReportModel
                {
                    Month = item.Key.ToString("MMMM"),
                    Year = item.Key.Year,
                    MonthNumber = item.Key.Month,
                    ActualAttendance = actualAttendance,
                    ExpectedAttendance = expectedAttendance,
                    AttendancePercentage = (attendancePercentage > 0 ? (attendancePercentage > 100 ? 100 : attendancePercentage) : 0)
                });
            }

            return report.OrderByDescending(report => report.Year).ThenBy(x => x.MonthNumber);
        }


        #endregion

    }
}

