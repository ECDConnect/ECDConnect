using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Points;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Community;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Training;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using static EcdLink.Api.CoreApi.Constants;

namespace EcdLink.Api.CoreApi.Services
{
    public class PointsEngineService : IPointsEngineService, IPointsService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private readonly IGenericRepository<PointsActivity, Guid> _pointsActivityRepo;
        private readonly IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;

        private readonly IGenericRepository<Child, Guid> _childRepo;
        private readonly IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private readonly IGenericRepository<CommunityProfile, Guid> _communityProfileRepo;
        private readonly IGenericRepository<CommunityProfileConnection, Guid> _communityProfileConnectionRepo;
        private readonly IGenericRepository<UserTrainingCourse, Guid> _userTrainingCourseRepo;
        private readonly IGenericRepository<Classroom, Guid> _classRepo;
        private readonly IGenericRepository<ClassroomGroup, Guid> _classroomGroupRepo;
        private readonly IGenericRepository<ChildProgressReport, Guid> _childProgressReportRepo;
        private readonly IGenericRepository<StatementsIncomeStatement, Guid> _statementsRepo;
        private readonly IGenericRepository<StatementsIncome, Guid> _statementsIncomeRepo;
        private readonly IGenericRepository<Programme, Guid> _programmeRepo;
        
        private MonthlyAttendanceReport _monthlyAttendanceReportService;
        private HierarchyEngine _hierarchyEngine;
        private IClassroomService _classroomService;

        private readonly Guid _uId;

        public PointsEngineService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            HierarchyEngine hierarchyEngine,
            [Service] MonthlyAttendanceReport monthlyAttendanceReportService,
            [Service] IClassroomService classroomService)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _monthlyAttendanceReportService = monthlyAttendanceReportService;
            _uId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().GetValueOrDefault());

            _pointsActivityRepo = _repositoryFactory.CreateGenericRepository<PointsActivity>(userContext: _uId);
            _pointsUserSummaryRepo = _repositoryFactory.CreateGenericRepository<PointsUserSummary>(userContext: _uId);

            _practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
            _childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);

            _classRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: _uId);
            _classroomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _uId);
            _programmeRepo = _repositoryFactory.CreateGenericRepository<Programme>(userContext: _uId);

            _childProgressReportRepo = _repositoryFactory.CreateGenericRepository<ChildProgressReport>(userContext: _uId);

            _communityProfileConnectionRepo = _repositoryFactory.CreateGenericRepository<CommunityProfileConnection>(userContext: _uId);
            _communityProfileRepo = _repositoryFactory.CreateGenericRepository<CommunityProfile>(userContext: _uId);
            _userTrainingCourseRepo = _repositoryFactory.CreateGenericRepository<UserTrainingCourse>(userContext: _uId);
            _statementsRepo = _repositoryFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _uId);
            _statementsIncomeRepo = _repositoryFactory.CreateGenericRepository<StatementsIncome>(userContext: _uId);

            _classroomService = classroomService;
        }

        public List<PointsUserSummary> GetSummaryUserPoints(Guid userId, DateTime startDate, DateTime? endDate = null)
        {
            return _pointsUserSummaryRepo.GetAll().Where(
                x => x.UserId == userId &&
                // After the start
                (x.DateScored >= startDate) &&
                // Before the end or no end date
                (!endDate.HasValue || x.DateScored <= endDate)
                ).Distinct().ToList();
        }

        public List<PointsActivity> GetPointActivities()
        {
            return _pointsActivityRepo.GetAll().Where(x => x.IsActive).Distinct().ToList();
        }

        public PointsToDoItemModel GetPointsTodoItems(Guid userId)
        {
            var pointsToDoItems = new PointsToDoItemModel();

            var monthStart = DateTime.Now.GetStartOfMonth();
            var monthEnd = DateTime.Now.GetEndOfMonth();

            var practitioner = _practitionerRepo.GetByUserId(userId);
            var isPrincipal = practitioner.IsPrincipalOrAdmin();

            // 1.Completing profile(ie they are not part of a preschool yet)(see W3)
            var preschool = _classroomService.GetClassroomForUser(userId);
            pointsToDoItems.IsPartOfPreschool = (preschool != null) ? true : false;

            // Phase 1
            if (!isPrincipal)
            {
                // 3.Practitioner(non - principal) only-- plan at least 1 day - ie picked all activities & story for the day (W11)
                pointsToDoItems.PlannedOneDay = false;
                if (preschool != null)
                {
                    var programmeCount = _programmeRepo
                                        .GetAll()
                                        .Where(p => p.IsActive
                                            && p.ClassroomGroupId != null
                                            && p.ClassroomGroup.UserId == userId
                                            && p.StartDate.Year == monthStart.Year && p.EndDate.Year == monthStart.Year)
                                        .Include(c => c.DailyProgrammes)
                                        .SelectMany(x => x.DailyProgrammes)
                                        .Where(x => x.IsActive && x.SmallGroupActivityId != 0 && x.LargeGroupActivityId != 0 && x.StoryBookId != 0 && x.StoryActivityId != 0)
                                        .Count();

                    pointsToDoItems.PlannedOneDay = programmeCount > 0 ? true : false;
                }
            }
            else
            {
                // 2.Principal only-- save 1 income or expense yet(W12)
                var itemsCount = _statementsRepo.GetAll().Where(x => x.IsActive 
                                                                && x.UserId == userId 
                                                                && x.Year == monthStart.Year 
                                                                && (x.IncomeItems.Count > 0 || x.ExpenseItems.Count > 0)).Count();

                pointsToDoItems.SavedIncomeOrExpense = itemsCount > 0 ? true : false;
            }

            // 4.Gone to Community section of app at least once
            var communityProfile = _communityProfileRepo.GetByUserId(userId);
            pointsToDoItems.ViewedCommunitySection = communityProfile == null ? false: true;

            return pointsToDoItems;
        }

        private UserRankingPointsModel GetRankingDataForUser(Practitioner practitioner, List<Guid?> userIds, List<PointsUserSummary> userPointsData, bool isMonthly)
        {
            var isPrincipal = practitioner.IsPrincipalOrAdmin();
            var role = isPrincipal ? "principal" : "practitioner";

            var userPermissions = practitioner.User.UserPermissions;
            var maxTotal = 0;
            if (isMonthly)
            {
                maxTotal = isPrincipal ? Constants.MaxPointsTotal.PrincipalMaxMonthPoints : Constants.MaxPointsTotal.PractitionerMaxMonthPoints;
            } else
            {
                maxTotal = isPrincipal ? Constants.MaxPointsTotal.PrincipalMaxYearPoints : Constants.MaxPointsTotal.PractitionerMaxYearPoints;
            }

            var takeAttendance = userPermissions.Where(x => x.Permission.Name == Constants.PractitionerPermissions.TakeAttendance && x.IsActive).FirstOrDefault();
            var planClassroomActivities = userPermissions.Where(x => x.Permission.Name == Constants.PractitionerPermissions.PlanClassroomActivities && x.IsActive).FirstOrDefault();
            var createProgressReports = userPermissions.Where(x => x.Permission.Name == Constants.PractitionerPermissions.CreateProgressReports && x.IsActive).FirstOrDefault();

            if (!isPrincipal)
            {
                if (takeAttendance == null && planClassroomActivities == null && createProgressReports == null)
                {
                    maxTotal = isMonthly ? Constants.MaxPointsTotal.NoPermissionPractitionerMaxMonthPoints : MaxPointsTotal.NoPermissionPractitionerMaxYearPoints;
                }
                else
                {
                    if (takeAttendance != null || planClassroomActivities != null || createProgressReports != null)
                    {
                        maxTotal = isMonthly ? Constants.MaxPointsTotal.PermissionPractitionerMaxMonthPoints : Constants.MaxPointsTotal.PermissionPractitionerMaxYearPoints;
                    }
                }
            }

            var userPoints = userPointsData
                            .GroupBy(x => x.UserId)
                            .Select(x => new UserRankingPointsModel() { UserId = (Guid)x.First().UserId, PointsTotal = x.Sum(y => y.PointsTotal) })
                            .ToList()
                            .OrderByDescending(x => x.PointsTotal)
                            .ToList();
            if (userPoints.Count > 1)
            {
                userPoints[0].RankingNr = 1;
            }
            
            for (int i = 1; i < userPoints.Count; i++)
            {
                if (userPoints[i].PointsTotal == userPoints[i - 1].PointsTotal)
                {
                    userPoints[i].RankingNr = userPoints[i - 1].RankingNr;
                }
                else
                {
                    userPoints[i].RankingNr = i + 1;
                }
            }

            var totalUsers = userPoints.Count() + 1;
            for (int i = 0; i < userPoints.Count; i++)
            {
                userPoints[i].ComparativeTargetPercentage = (totalUsers == 0 ? 0 : Math.Round((double)(totalUsers -  userPoints[i].RankingNr) / (double)(totalUsers) * 100));
                userPoints[i].NonComparativeTargetPercentage = maxTotal == 0 ? 0 : Math.Round((double)userPoints[i].PointsTotal / (double)(maxTotal) * 100);

                userPoints[i].ComparativeTargetPercentage = userPoints[i].ComparativeTargetPercentage > 100 ? 100 : userPoints[i].ComparativeTargetPercentage;
                userPoints[i].NonComparativeTargetPercentage = userPoints[i].NonComparativeTargetPercentage > 100 ? 100 : userPoints[i].NonComparativeTargetPercentage;
            }

            var userPointRecord = userPoints.Where(x => x.UserId == practitioner.UserId).FirstOrDefault();
            if (userPointRecord != null)
            {
                userPointRecord = GetRankingMessagesForUser(userPointRecord, role, practitioner.User.FirstName);
            }
            return userPointRecord;
        }

        private UserRankingPointsModel GetRankingMessagesForUser(UserRankingPointsModel userPointRecord, string roleName, string firstName)
        {
            // COMPARATIVE
            if (userPointRecord.RankingNr == 1)
            {
                userPointRecord.MessageNr = 1;
                userPointRecord.ComparativePrimaryMessage = $"Well done {firstName}, you are the top {roleName} on {TenantExecutionContext.Tenant.ApplicationName}!";
                userPointRecord.ComparativeSecondaryMessage = "You are the top points earner so far this month. Keep it up!";
                userPointRecord.ComparativeTargetPercentageColor = Constants.CSSColorClasses.Green;
            } else
            {
                if (userPointRecord.ComparativeTargetPercentage < 50)
                {
                    userPointRecord.MessageNr = 4;
                    userPointRecord.ComparativePrimaryMessage = $"Keep going {firstName}!";
                    userPointRecord.ComparativeSecondaryMessage = $"Most of the practitioners on {TenantExecutionContext.Tenant.ApplicationName} have earned more than {userPointRecord.PointsTotal} points! Earn more points to join them.";
                    userPointRecord.ComparativeTargetPercentageColor = Constants.CSSColorClasses.Orange;
                }
                else if (userPointRecord.ComparativeTargetPercentage >= 50 && userPointRecord.ComparativeTargetPercentage < 75)
                {
                    userPointRecord.MessageNr = 3;
                    userPointRecord.ComparativePrimaryMessage = $"Wow, great job {firstName}!";
                    userPointRecord.ComparativeSecondaryMessage = $"You have more points than most other {TenantExecutionContext.Tenant.ApplicationName} {roleName}s!";
                    userPointRecord.ComparativeTargetPercentageColor = Constants.CSSColorClasses.Blue;
                }
                else if (userPointRecord.ComparativeTargetPercentage >= 75)
                {
                    userPointRecord.MessageNr = 2;
                    userPointRecord.ComparativePrimaryMessage = $"Well done {firstName}, you are one of the top {roleName}s on {TenantExecutionContext.Tenant.ApplicationName}!";
                    userPointRecord.ComparativeSecondaryMessage = "You are one of the top points earners so far this month. Keep it up!";
                    userPointRecord.ComparativeTargetPercentageColor = Constants.CSSColorClasses.Green;
                } 
                else if (userPointRecord.ComparativeTargetPercentage == 100)
                {
                    userPointRecord.MessageNr = 1;
                    userPointRecord.ComparativePrimaryMessage = $"Well done {firstName}, you are the top {roleName} on {TenantExecutionContext.Tenant.ApplicationName}!";
                    userPointRecord.ComparativeSecondaryMessage = "You are the top points earner so far this month. Keep it up!";
                    userPointRecord.ComparativeTargetPercentageColor = Constants.CSSColorClasses.Green;
                }
            }
            

            // NON COMPARATIVE
            userPointRecord.NonComparativeTargetPercentageColor = Constants.CSSColorClasses.Orange;

            if (userPointRecord.NonComparativeTargetPercentage >= 60 && userPointRecord.NonComparativeTargetPercentage <= 79)
            {
                userPointRecord.NonComparativeTargetPercentageColor = Constants.CSSColorClasses.Blue;
            }
            else if (userPointRecord.NonComparativeTargetPercentage >= 80)
            {
                userPointRecord.ComparativeTargetPercentageColor = Constants.CSSColorClasses.Green;
            }

            if (userPointRecord.NonComparativeTargetPercentage >= 80)
            {
                userPointRecord.NonComparativePrimaryMessage = $"Well done {firstName}!";
                userPointRecord.NonComparativeSecondaryMessage = "You're doing well, keep it up!";
            }
            else if (userPointRecord.NonComparativeTargetPercentage >= 60 && userPointRecord.NonComparativeTargetPercentage <= 79)
            {
                userPointRecord.NonComparativePrimaryMessage = $"Wow, great job {firstName}!";
                userPointRecord.NonComparativeSecondaryMessage = "You're doing well, keep it up! You can still earn more points this month.";
            }
            else if (userPointRecord.PointsTotal > 0 && userPointRecord.NonComparativeTargetPercentage < 60)
            {
                userPointRecord.NonComparativePrimaryMessage = $"Keep going {firstName}!";
                userPointRecord.NonComparativeSecondaryMessage = $"Keep using {TenantExecutionContext.Tenant.ApplicationName} to earn points!";
            } else if (userPointRecord.PointsTotal == 0)
            {
                userPointRecord.NonComparativePrimaryMessage = $"No points earned yet";
                userPointRecord.NonComparativeSecondaryMessage = $"Keep going to earn points!";
            }
            return userPointRecord;
        }

        public PointsUserYearMonthSummary GetYearPointsView(Guid userId)
        {
            var practitioner = _practitionerRepo.GetByUserId(userId);
            var today = DateTime.Now;
            var summaryData = _pointsUserSummaryRepo.GetAll().Where(x => x.IsActive
                                                                    && x.UserId == userId
                                                                    && x.DateScored.Year == today.Year)
                                                             .Select(x => new { Month = x.DateScored.Month, 
                                                                                MonthName = x.DateScored.ToString("MMMM"),
                                                                                Activity = x.PointsActivity.Name, 
                                                                                PointsTotal = x.PointsTotal, 
                                                                                TimesScored = x.TimesScored})
                                                             .ToList()
                                                             .OrderByDescending(x => x.Month);

            var months = summaryData.Select(x => new { Month = x.Month, MonthName = x.MonthName }).Distinct().ToList();
            var sumYear = summaryData.Sum(x => x.PointsTotal);
            var monthlySummary = new List<MonthSummary>();

            foreach (var item in months)
            {
                var monthTotal = summaryData.Where(x => x.Month == item.Month).Sum(x => x.PointsTotal);
                var monthActivities = summaryData.Where(x => x.Month == item.Month)
                    .Select(x => new { x.Activity, x.TimesScored, x.PointsTotal })
                    .ToList()
                    .GroupBy(x => x.Activity)
                    .Select(x => new ActivityDetail(x.First().Activity, x.Sum(y => y.TimesScored), x.Sum(y => y.PointsTotal)))
                    .ToList();
                var monthSummary = summaryData.Where(x => x.Month == item.Month).Select(x => new MonthSummary(x.MonthName, monthTotal, monthActivities)).FirstOrDefault();
                monthlySummary.Add(monthSummary);
            }
            return new PointsUserYearMonthSummary(sumYear, monthlySummary);
        }

        public PointsUserDateSummary GetSharedData(Guid userId, bool isMonthly)
        {
            var practitioner = _practitionerRepo.GetByUserId(userId);
            var isPrincipal = practitioner.IsPrincipalOrAdmin();
            var startDate = DateTime.Now.GetStartOfMonth();
            var endDate = DateTime.Now.GetEndOfMonth();


            var userIds = new List<Guid?>() { userId};
            if (isPrincipal)
            {
                userIds.AddRange(_practitionerRepo.GetAll().Where(x => x.IsActive
                                                            && x.IsRegistered.HasValue && x.IsRegistered.Value
                                                            && x.IsPrincipal.HasValue && x.IsPrincipal.Value).Select(x => x.UserId).Distinct().ToList());
            }
            else
            {
                userIds.AddRange(_practitionerRepo.GetAll().Where(x => x.IsActive
                                                            && x.IsRegistered.HasValue && x.IsRegistered.Value
                                                            && !x.IsPrincipal.HasValue || (x.IsPrincipal.HasValue && !x.IsPrincipal.Value)).Select(x => x.UserId).Distinct().ToList());
            }

            var userPointsData = isMonthly
                ? _pointsUserSummaryRepo.GetAll().Where(x => x.IsActive && x.UserId.HasValue && userIds.Contains(x.UserId.Value) && (x.DateScored >= startDate) && (x.DateScored <= endDate)).ToList()
                : _pointsUserSummaryRepo.GetAll().Where(x => x.IsActive && x.UserId.HasValue && userIds.Contains(x.UserId.Value) && x.DateScored.Year == DateTime.Now.Year).ToList();

            var rankingData = GetRankingDataForUser(practitioner, userIds, userPointsData, isMonthly);

            var totalChildren = 0;
            if (isPrincipal)
            {
                //principal = the number of children at the preschool;
                totalChildren = _classroomGroupRepo.GetAll()
                                .Where(x => x.IsActive && x.Classroom.UserId == userId && x.Classroom.IsActive)
                                .SelectMany(x => x.Learners.Where(y => y.IsActive && y.User.IsActive))
                                .Count();
            } else
            {
                //practitioner = the number of children assigned to the user
                totalChildren = _childRepo.GetAll()
                                .Where(x => x.IsActive && x.Hierarchy.StartsWith(practitioner.Hierarchy)).Count();
            }
            
            var summaryData = userPointsData.Where(x => x.UserId == userId)
                                    .Select(x => new
                                        {
                                            Activity = x.PointsActivity.Name,
                                            PointsTotal = x.PointsTotal,
                                            TimesScored = x.TimesScored
                                        })
                                    .GroupBy(x => x.Activity)
                                    .Select(x => new ActivityDetail(x.First().Activity, x.Sum(y => y.TimesScored), x.Sum(y => y.PointsTotal)))
                                    .ToList();

            return new PointsUserDateSummary(summaryData.Sum(x => x.PointsTotal), totalChildren, summaryData, rankingData);
        }

        private void AddOrUpdatePoints(Guid activityId, Guid userId, int pointsTotal, int? timesScored = null, DateTime? dateScored = null)
        {
            var monthStart = (dateScored ?? DateTime.Now).GetStartOfMonth();
            var monthEnd = (dateScored ?? DateTime.Now).GetEndOfMonth();
            var currentPoints = _pointsUserSummaryRepo.GetAll().Where(x =>
                x.UserId == userId
                && x.PointsActivityId == activityId
                && x.DateScored >= monthStart
                && x.DateScored <= monthEnd)
                .FirstOrDefault();

            if (currentPoints == null)
            {
                _pointsUserSummaryRepo.Insert(new PointsUserSummary
                {
                    DateScored = dateScored ?? DateTime.Now.GetStartOfMonth(),
                    UserId = userId,
                    PointsActivityId = activityId,
                    TimesScored = timesScored ?? 1,
                    PointsTotal = pointsTotal,
                });
            }
            else
            {
                currentPoints.TimesScored = timesScored ?? currentPoints.TimesScored + 1;
                currentPoints.PointsTotal = pointsTotal;
                currentPoints.UpdatedDate = DateTime.Now;

                _pointsUserSummaryRepo.Update(currentPoints);
            }
        }

        /// <summary>
        /// Child attendance register saved (ie user taps "Save" on a child attendance register)
        /// Since the user can edit a register, do not give the user more points for saving a register for the same class on the same day multiple times 
        /// (e.g. user saves register for Lions class for 4 May; then goes back to edit the register and taps "Save" again for Lions class for 4 May -- they should still only earn 5 points).
        ///  5 points per register
        ///  max month 100 && max year 1200
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateChildAttendanceRegisterSaved(Guid userId)
        {
            if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.AttendanceEnabled)
            {
                var practitioner = _practitionerRepo.GetByUserId(userId);
                if (practitioner != null)
                {
                    var today = DateTime.Now;
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildAttendanceRegisterSavedId);

                    var classrooms = _classroomGroupRepo.GetAll()
                                        .Where(x => x.UserId.HasValue && x.UserId == userId && x.IsActive)
                                        .Select(x => x.Classroom)
                                        .Distinct()
                                        .ToList();

                    if (classrooms.Any())
                    {
                        var timesScored = 0;
                        foreach (var classroom in classrooms)
                        {
                            var monthlyReport = _monthlyAttendanceReportService.GenerateMonthlyAttendanceReport(userId.ToString(), today.GetStartOfMonth(), today.GetEndOfMonth()).SingleOrDefault();

                            if (monthlyReport != null)
                            {
                                timesScored += monthlyReport.NumberOfSessions;
                            }
                        }
                        var userPoints = timesScored * activity.Points;
                        AddOrUpdatePoints(
                            PointsActivityConstants.ChildAttendanceRegisterSavedId,
                            userId,
                            userPoints,
                            timesScored);
                    }
                }
            }
        }

        /// <summary>
        /// Child registration complete (all steps)
        /// 10 points per child fully registered (all registration steps complete)
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateChildRegistrationComplete(Guid userId)
        {
            var practitioner = _practitionerRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                var today = DateTime.Now;

                var learnerCount = _childRepo
                                    .GetAll()
                                    .Where(x => x.IsActive 
                                            && x.Hierarchy.Contains(practitioner.Hierarchy) 
                                            && x.WorkflowStatusId == Constants.WorkflowStatus.ActiveId
                                            && x.UpdatedDate.Year == today.Year
                                            && x.UpdatedDate.Month == today.Month)
                                    .Count();

                if (learnerCount > 0)
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildRegistrationCompleteId);
                    var userPoints = learnerCount * activity.Points;
                    AddOrUpdatePoints(
                        PointsActivityConstants.ChildRegistrationCompleteId,
                        userId,
                        userPoints,
                        learnerCount
                       );
                }

            }
        }

        /// <summary>
        /// Child removed from the preschool
        /// 5 points per child removed - max 25 for the year
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateChildRemovedFromPreschool(Guid userId)
        {
            var practitioner = _practitionerRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                var today = DateTime.Now;

                var learners = _classroomGroupRepo.GetAll()
                                .Where(x =>
                                    x.IsActive
                                    && x.Classroom.UserId == userId
                                    && x.Classroom.IsActive)
                                .SelectMany(x => x.Learners)
                                .Where(x => !x.IsActive && x.StoppedAttendance.HasValue && x.UpdatedDate.Year == today.Year && x.UpdatedDate.Month == today.Month)
                                .ToList();

                if (learners.Count > 0)
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildRemovedFromPreschoolId);
                    var userPoints = learners.Count * activity.Points;
                    AddOrUpdatePoints(
                        PointsActivityConstants.ChildRemovedFromPreschoolId,
                        userId,
                        userPoints,
                        learners.Count
                       );
                }
            }
        }

        /// <summary>
        /// Theme planned in "Activities" section
        /// 100 points per theme planned
        /// Max month 100 Max year 1200
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateThemePlanned(Guid userId)
        {
            if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.ProgressEnabled)
            {
                var practitioner = _practitionerRepo.GetByUserId(userId);
                if (practitioner != null)
                {
                    var today = DateTime.Now;
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ThemePlannedId);

                    if (practitioner?.IsPrincipal == true)
                    {
                        var schoolClasses = _classRepo.GetAll().Where(x => x.IsActive && x.UserId == userId).ToList();
                        if (schoolClasses.Any())
                        {
                            var classroomProgrammes = schoolClasses
                                                    .SelectMany(x => x.Programmes)
                                                    .Where(x => x.IsActive && x.InsertedDate.Year == today.Year && x.InsertedDate.Month == today.Month && x.Name != "No theme")
                                                    .ToList();

                            if (classroomProgrammes.Count > 0)
                            {
                                AddOrUpdatePoints(
                                    PointsActivityConstants.ThemePlannedId,
                                    userId,
                                    activity.Points * classroomProgrammes.Count,
                                    classroomProgrammes.Count,
                                    today.GetStartOfMonth()
                                );
                            }
                        }
                    }
                    else
                    {
                        var userPermissions = practitioner.User.UserPermissions;
                        var planClassroomActivities = userPermissions.Where(x => x.Permission.Name == Constants.PractitionerPermissions.PlanClassroomActivities && x.IsActive).FirstOrDefault();
                        if (planClassroomActivities != null && planClassroomActivities.IsActive == true)
                        {
                            var classRoomGroup = _classroomGroupRepo.GetByUserId(userId);
                            if (classRoomGroup != null)
                            {
                                var classroomProgrammes = _programmeRepo.GetAll()
                                                                        .Where(x => x.IsActive
                                                                                    && x.InsertedDate.Year == today.Year
                                                                                    && x.InsertedDate.Month == today.Month
                                                                                    && x.Name != "No theme"
                                                                                    && x.ClassroomGroupId == classRoomGroup.Id)
                                                                        .ToList();

                                if (classroomProgrammes.Count > 0)
                                {
                                    AddOrUpdatePoints(
                                        PointsActivityConstants.ThemePlannedId,
                                        userId,
                                        activity.Points * classroomProgrammes.Count,
                                        classroomProgrammes.Count,
                                        today.GetStartOfMonth()
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Full "No theme" day planned - all items are chosen for the day - small group, large group, story, story activity
        /// 5 points per day planned
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateNoThemePlanned(Guid userId)
        {
            if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.ProgressEnabled)
            {
                var practitioner = _practitionerRepo.GetByUserId(userId);
                if (practitioner != null)
                {
                    var today = DateTime.Now;
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.NoThemePlannedId);

                    if (practitioner?.IsPrincipal == true)
                    {
                        var schoolClasses = _classRepo.GetAll().Where(x => x.IsActive && x.UserId == userId).ToList();
                        if (schoolClasses.Any())
                        {
                            var totalCompletedDays = schoolClasses
                                                    .SelectMany(x => x.Programmes)
                                                    .Where(x => x.IsActive && x.StartDate.Year >= today.Year && x.Name == "No theme")
                                                    .ToList()
                                                    .SelectMany(x => x.DailyProgrammes)
                                                    .ToList()
                                                    .Where(x => x.IsActive && x.DateCompleted.HasValue && x.DateCompleted.Value.Year == today.Year && x.DateCompleted.Value.Month == today.Month)
                                                    .Select(x => x.Id)
                                                    .Count();
                            if (totalCompletedDays > 0)
                            {
                                AddOrUpdatePoints(
                                    PointsActivityConstants.NoThemePlannedId,
                                    userId,
                                    activity.Points * totalCompletedDays,
                                    totalCompletedDays
                                    );
                            }
                        }
                    }
                    else
                    {
                        var userPermissions = practitioner.User.UserPermissions;
                        var planClassroomActivities = userPermissions.Where(x => x.Permission.Name == Constants.PractitionerPermissions.PlanClassroomActivities && x.IsActive).FirstOrDefault();
                        if (planClassroomActivities != null && planClassroomActivities.IsActive == true)
                        {
                            var classRoomGroup = _classroomGroupRepo.GetByUserId(userId);
                            if (classRoomGroup != null)
                            {
                                var totalCompletedDays = _programmeRepo.GetAll()
                                                    .Where(x => x.IsActive
                                                            && x.StartDate.Year >= today.Year
                                                            && x.Name == "No theme"
                                                            && x.ClassroomGroupId == classRoomGroup.Id)
                                                    .SelectMany(x => x.DailyProgrammes)
                                                    .ToList()
                                                    .Where(x => x.IsActive && x.DateCompleted.HasValue && x.DateCompleted.Value.Year == today.Year && x.DateCompleted.Value.Month == today.Month)
                                                    .Select(x => x.Id)
                                                    .Count();

                                if (totalCompletedDays > 0)
                                {
                                    AddOrUpdatePoints(
                                        PointsActivityConstants.NoThemePlannedId,
                                        userId,
                                        activity.Points * totalCompletedDays,
                                        totalCompletedDays
                                        );
                                }
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Add a new practitioner to the preschool
        /// 20 points per practitioner added
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateAddNewPractitionerToPreschool(Guid userId)
        {
            var practitioner = _practitionerRepo.GetByUserId(userId);
            if (practitioner != null && practitioner.IsPrincipal == true)
            {
                var today = DateTime.Now;
                var practitionersCount = _practitionerRepo.GetAll().Where(x => x.IsActive
                                                                && x.PrincipalHierarchy == userId
                                                                && x.DateLinked.HasValue
                                                                && x.DateLinked.Value.Year == today.Year
                                                                && x.DateLinked.Value.Month == today.Month).Count();
                if (practitionersCount > 0)
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddNewPractitionerToPreschoolId);
                    AddOrUpdatePoints(
                            PointsActivityConstants.AddNewPractitionerToPreschoolId,
                            userId,
                            activity.Points * practitionersCount,
                            practitionersCount
                        );
                }
            }
        }

        /// <summary>
        /// Add a new class to the preschool
        /// 20 points per class added
        /// Yearly max for principal is 20
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateAddNewClassToPreschool(Guid userId)
        {
            var practitioner = _practitionerRepo.GetByUserId(userId);
            if (practitioner != null && practitioner.IsPrincipal == true)
            {
                var today = DateTime.Now;
                var schoolClasses = _classroomGroupRepo.GetAll()
                                            .Where(x => x.IsActive && x.Classroom.UserId == userId && x.InsertedDate.Year == today.Year && x.InsertedDate.Month == today.Month)
                                            .ToList()
                                            .Select(x => new { x.InsertedDate.Month, x.Id })
                                            .ToList()
                                            .GroupBy(x => x.Month)
                                            .Select(x => new { Month = x.Key, Total = x.Count() })
                                            .ToList();
                if (schoolClasses.Count > 0)
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddNewClassToPreschoolId);
                    foreach(var item in schoolClasses)
                    {
                        AddOrUpdatePoints(
                            PointsActivityConstants.AddNewClassToPreschoolId,
                            userId,
                            activity.Points * item.Total,
                            item.Total,
                            new DateTime(today.Year, item.Month, 01)
                        );
                    }
                }
            }
        }

        /// <summary>
        /// Downloading an income statement for the month for the first time (ie, don't give points for downloading the same statement multiple times)
        /// 50 points for downloading a register for the month (earned once, see comment)
        /// Month max 50 Year max 600
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateDownloadIncomeStatement(Guid userId)
        {
            var practitioner = _practitionerRepo.GetByUserId(userId);
            if (practitioner != null && practitioner.IsPrincipal == true)
            {
                var today = DateTime.Now;
                var statementCount = _statementsRepo
                                    .GetAll().Where(x => x.IsActive && x.UserId == userId && x.Year == today.Year && x.Month == today.Month && x.Downloaded)
                                    .Count();
                if (statementCount > 0)
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.DownloadIncomeStatementId);
                    //var yearPoints = _pointsUserSummaryRepo.GetAll().Where(x =>
                    //                        x.UserId == userId
                    //                        && x.PointsActivityId == activity.Id
                    //                        && x.DateScored.Year >= today.Year).Select(x => x.PointsTotal).Sum();
                    
                    AddOrUpdatePoints(
                        PointsActivityConstants.DownloadIncomeStatementId,
                        userId,
                        activity.Points,
                        statementCount
                    );
                }
            }
        }

        /// <summary>
        /// Adding an expense OR income item to a statement
        /// 5 points per expense OR income item added
        /// Month max 25 Year max 2500
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateAddExpenseOrIncomeToStatement(Guid userId)
        {
            if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.BusinessEnabled)
            {
                var practitioner = _practitionerRepo.GetByUserId(userId);
                if (practitioner != null && practitioner.IsPrincipal == true)
                {
                    var today = DateTime.Now;
                    var statements = _statementsRepo
                                            .GetAll()
                                            .Where(x => x.IsActive 
                                                    && x.UserId == userId 
                                                    && x.Year >= today.Year 
                                                    && (x.IncomeItems.Count > 0 || x.ExpenseItems.Count > 0))
                                            .ToList();

                    if (statements.Count > 0)
                    {
                        var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddExpenseOrIncomeToStatementId);
                        foreach (var item in statements)
                        {
                            var itemsCount = item.IncomeItems.Count + item.ExpenseItems.Count;
                            var monthPoints = itemsCount * activity.Points;

                            AddOrUpdatePoints(
                              PointsActivityConstants.AddExpenseOrIncomeToStatementId,
                              userId,
                              monthPoints,
                              itemsCount,
                              new DateTime(item.Year, item.Month, 01)
                            );
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Preschool fees greater than 0 were added for each child this month
        /// 50 points per month, calculated at the end of the month; IF the principal added a preschool fee for each active child in the preschool that is greater than zero Rand.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculatePreschoolFeesGreaterThan0ForEachChild()
        {
            if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.BusinessEnabled)
            {
                var today = DateTime.Now;
                var monthlyPreSchoolItems = _statementsIncomeRepo
                                            .GetAll()
                                            .Where(x => x.IsActive 
                                                && x.StatementsIncomeStatement.Month == today.Month 
                                                && x.StatementsIncomeStatement.Year == today.Year
                                                && x.StatementsIncomeStatement.IsActive
                                                && x.ChildUserId.HasValue
                                                && x.IncomeTypeId == PointsActivityConstants.PreschoolFeeId
                                                && x.Amount > 0
                                                && x.ChildUser.IsActive)
                                            .Select(x => new { x.StatementsIncomeStatement.UserId, x.Id})
                                            .ToList()
                                            .GroupBy(x => x.UserId)
                                            .Select(x => new { UserId = x.Key, Total = x.Count() })
                                            .ToList();

                if (monthlyPreSchoolItems.Any())
                {
                    var principalUserIds = monthlyPreSchoolItems.Select(x => x.UserId).Distinct().ToList();
                    var principalLearnerTotals = _classroomGroupRepo
                                                .GetAll()
                                                .Where(x => x.IsActive && principalUserIds.Contains(x.Classroom.UserId) && x.Classroom.IsActive)
                                                .SelectMany(x => x.Learners.Where(y => y.IsActive && y.User.IsActive))
                                                .Select(x => new { x.ClassroomGroup.Classroom.UserId, x.Id })
                                                .GroupBy(x => x.UserId)
                                                .Select(x => new { UserId = x.Key, Total = x.Count() })
                                                .ToList(); 

                    if (principalLearnerTotals.Any())
                    {
                        var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.PreschoolFeesGreaterThan0ForEachChildId);
                        foreach (var item in monthlyPreSchoolItems)
                        {
                            var principalLearnerTotal = principalLearnerTotals.Where(x => x.UserId == item.UserId).FirstOrDefault();
                            if (principalLearnerTotal != null)
                            {
                                if (item.Total == principalLearnerTotal.Total)
                                {
                                    AddOrUpdatePoints(
                                        PointsActivityConstants.PreschoolFeesGreaterThan0ForEachChildId,
                                        (Guid)item.UserId,
                                        activity.Points,
                                        1
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Complete child progress observations
        /// 5 points IF all progress observations for a child have been completed.
        /// max month 10 max year 50
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateCompleteChildProgressObservations(Guid userId)
        {
            if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.ProgressEnabled)
            {
                var practitioner = _practitionerRepo.GetByUserId(userId);
                if (practitioner != null)
                {
                    var today = DateTime.Now;
                    
                    var childProgressReports = _childProgressReportRepo
                                                    .GetAll()
                                                    .Where(x => x.IsActive
                                                            && x.UserId == userId
                                                            && x.ObservationsCompleteDate.HasValue
                                                            && x.ObservationsCompleteDate.Value.Year == today.Year
                                                            && x.ObservationsCompleteDate.Value.Month == today.Month)
                                                    .Select(x => new { x.ObservationsCompleteDate.Value.Month, x.Id })
                                                    .ToList()
                                                    .GroupBy(x => x.Month)
                                                    .Select(x => new { Month = x.Key, Total = x.Count() })
                                                    .ToList();
                    if (childProgressReports.Any())
                    {
                        var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.CompleteChildProgressObservationsId);
                        foreach (var item in childProgressReports)
                        {
                            var userPoints = activity.Points * item.Total;
                            AddOrUpdatePoints(
                                PointsActivityConstants.CompleteChildProgressObservationsId,
                                userId,
                                userPoints,
                                item.Total,
                                new DateTime(today.Year, item.Month, 01)
                            );
                        }
                    }

                }
            }
        }

        /// <summary>
        /// Create a child progress report
        /// 5 points per child progress report created
        /// Max year = 50
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateCreateChildProgressReport(Guid userId)
        {
           if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.ProgressEnabled)
           {
                var practitioner = _practitionerRepo.GetByUserId(userId);
                if (practitioner != null)
                {
                    var today = DateTime.Now;
                    
                    var childProgressReports = _childProgressReportRepo
                                                    .GetAll()
                                                    .Where(x => x.IsActive 
                                                            && x.UserId == userId
                                                            && x.DateCompleted.Value.Year == today.Year
                                                            && x.DateCompleted.Value.Month == today.Month)
                                                    .Select(x => new { x.DateCompleted.Value.Month, x.Id })
                                                    .ToList()
                                                    .GroupBy(x => x.Month)
                                                    .Select(x => new { Month = x.Key, Total = x.Count() })
                                                    .ToList();
                    if (childProgressReports.Any())
                    {
                        var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.CreateChildProgressReportId);
                        foreach (var item in childProgressReports)
                        {
                            AddOrUpdatePoints(
                                PointsActivityConstants.CreateChildProgressReportId,
                                userId,
                                item.Total * activity.Points,
                                item.Total,
                                new DateTime(today.Year, item.Month, 01)
                            );
                        }
                    }
                }
           }
        }

        /// <summary>
        /// Download preschool or class progress summary
        /// 5 points per progress summary downloaded
        /// Max year = 10
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateDownloadPreschoolOrClassProgressSummary(Guid userId)
        {
            if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.ProgressEnabled)
            {
                var practitioner = _practitionerRepo.GetByUserId(userId);
                if (practitioner != null)
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.DownloadPreschoolOrClassProgressSummaryId);
                    var today = DateTime.Now;
                    var schoolClassIds = _classRepo.GetAll().Where(x => x.IsActive && x.UserId == userId).Select(x => x.Id).ToList();
                    AddOrUpdatePoints(
                        PointsActivityConstants.DownloadPreschoolOrClassProgressSummaryId,
                        userId,
                        activity.Points,
                        1,
                        new DateTime(today.Year, today.Month, 01)
                    );
                }
            }
        }

        /// <summary>
        /// Complete an online training course
        /// 200 points per course completed in the "Training" section
        /// Max Year 200
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateCompleteOnlineTrainingCourse(Guid userId)
        {
            if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.TrainingEnabled)
            {
                var today = DateTime.Now;
                var trainingCoursesCount = _userTrainingCourseRepo.GetAll().Where(x => x.IsActive 
                                                                                    && x.UserId == userId 
                                                                                    && x.CompletedDate.Year == today.Year
                                                                                    && x.CompletedDate.Month == today.Month).Count();
                if (trainingCoursesCount > 0)
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.CompleteOnlineTrainingCourseId);
                    //var yearPoints = _pointsUserSummaryRepo.GetAll().Where(x =>
                    //                       x.UserId == userId
                    //                       && x.PointsActivityId == activity.Id
                    //                       && x.DateScored.Year >= today.Year).Select(x => x.PointsTotal).Sum();
                    //var userPoints = yearPoints == 0 ? activity.Points : 0;
                    AddOrUpdatePoints(
                        PointsActivityConstants.CompleteOnlineTrainingCourseId,
                        userId,
                        activity.Points,
                        trainingCoursesCount);
                }
            }
        }

        /// <summary>
        /// 10 points for adding short description (once-off)
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateAddingShortDescription(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddingShortDescriptionId);
            AddOrUpdatePoints(
                PointsActivityConstants.AddingShortDescriptionId,
                userId,
                activity.Points,
                1);
        }

        /// <summary>
        /// 50 points for completing your community profile (once-off)
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateCompleteCommunityProfile(Guid userId)
        {
            
            var userCommunityProfile = _communityProfileRepo.GetAll()
                                        .Include(x => x.User)
                                        .Include(x => x.ProfileSkills)
                                        .ThenInclude(x => x.CommunitySkill)
                                        .Where(x => x.UserId == userId).FirstOrDefault();

            // Users will always have 10% complete.
            var totalPoints = 10;
            // -Edit contact details -user saves form(note that they're not required to select any of the boxes) - 18 percentage points
            if (userCommunityProfile.ShareContactInfo.HasValue && userCommunityProfile.ShareContactInfo.Value)
            {
                totalPoints += 18;
            }
            //- Edit basic info -user has filled in short description and province -18 percentage points
            if (!string.IsNullOrEmpty(userCommunityProfile.AboutShort) && userCommunityProfile.ProvinceId != null)
            {
                totalPoints += 18;
            }
            //-About - user has filled in the field -18 percentage points
            if (!string.IsNullOrEmpty(userCommunityProfile.AboutLong))
            {
                totalPoints += 18;
            }
            //-ECD skills - user has checked at least 1 skill - 18 percentage points
            if (userCommunityProfile.ProfileSkills.Count > 0)
            {
                totalPoints += 18;
            }
            //-Photo - user has added a photo -18 percentage points
            if (!string.IsNullOrEmpty(userCommunityProfile.User.ProfileImageUrl))
            {
                totalPoints += 18;
            }

            if (totalPoints == 100)
            {
                var currentPoints = _pointsUserSummaryRepo.GetListByUserId(userId)
                                    .Where(x => x.PointsActivityId == PointsActivityConstants.CompleteCommunityProfileId)
                                    .FirstOrDefault();

                // You can only receive these points once
                if (currentPoints == null)
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.CompleteCommunityProfileId);
                    AddOrUpdatePoints(
                        PointsActivityConstants.CompleteCommunityProfileId,
                        userId,
                        activity.Points,
                        1);
                } 
            }
        }

        /// <summary>
        /// 5 points for connecting with another user via the Community section (points earned when one of the following happens: i) user's sent request is accepted; ii) user accepts a request sent to them)
        /// Max Month 10 Max Year 120
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateConnectWithAnotherUser(Guid userId)
        {
            var today = DateTime.Now;
            var acceptedConnectionsCount = _communityProfileConnectionRepo
                                            .GetAll()
                                            .Where(x => x.IsActive
                                                    && x.InviteAccepted.HasValue
                                                    && x.InviteAccepted == true
                                                    && (x.FromProfile.UserId == userId || x.ToProfile.UserId == userId)
                                                    && x.UpdatedDate.Year == today.Year
                                                    && x.UpdatedDate.Month == today.Month
                                                    )
                                            .Count();
            if (acceptedConnectionsCount > 0)
            {
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ConnectWithAnotherUserId);
                var userPoints = acceptedConnectionsCount * activity.Points;

                AddOrUpdatePoints(
                    PointsActivityConstants.ConnectWithAnotherUserId,
                    userId,
                    userPoints,
                    acceptedConnectionsCount
                );

            }
        }
    }
}
