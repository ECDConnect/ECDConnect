using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Community;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Training;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Linq;
using static EcdLink.Api.CoreApi.Constants;

namespace EcdLink.Api.CoreApi.Services
{
    public class WLPointsEngineService : IWLPointsEngineService, IWLPointsService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private readonly IGenericRepository<PointsCategory, Guid> _pointsCategoryRepo;
        private readonly IGenericRepository<PointsActivity, Guid> _pointsActivityRepo;
        private readonly IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;

        private readonly IGenericRepository<Child, Guid> _childRepo;
        private readonly IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private readonly IGenericRepository<CommunityProfileConnection, Guid> _communityProfileConnectionRepo;
        private readonly IGenericRepository<UserTrainingCourse, Guid> _userTrainingCourseRepo;
        private readonly IGenericRepository<Classroom, Guid> _classRepo;
        private readonly IGenericRepository<ClassroomGroup, Guid> _classroomGroupRepo;
        private readonly IGenericRepository<StatementsIncomeStatement, Guid> _statementsIncomeStatementRepo;
        private readonly IGenericRepository<IntegrationAudit, Guid> _integrationAuditRepo;
        private readonly IGenericRepository<ChildProgressReport, Guid> _childProgressReportRepo;
        private readonly MonthlyAttendanceReport _monthlyAttendanceReportService;

        private HierarchyEngine _hierarchyEngine;
        private INotificationService _notificationService;

        private readonly Guid _uId;

        public WLPointsEngineService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            HierarchyEngine hierarchyEngine,
            [Service] MonthlyAttendanceReport monthlyAttendanceReportService,
            [Service] INotificationService notificationService)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _monthlyAttendanceReportService = monthlyAttendanceReportService;
            _uId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().GetValueOrDefault());

            _pointsCategoryRepo = _repositoryFactory.CreateGenericRepository<PointsCategory>(userContext: _uId);
            _pointsActivityRepo = _repositoryFactory.CreateGenericRepository<PointsActivity>(userContext: _uId);
            _pointsUserSummaryRepo = _repositoryFactory.CreateGenericRepository<PointsUserSummary>(userContext: _uId);

            _practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
            _childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);

            _statementsIncomeStatementRepo = _repositoryFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _uId);

            _classRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: _uId);
            _classroomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _uId);

            _childProgressReportRepo = _repositoryFactory.CreateGenericRepository<ChildProgressReport>(userContext: _uId);

            _communityProfileConnectionRepo = _repositoryFactory.CreateGenericRepository<CommunityProfileConnection>(userContext: _uId);
            _userTrainingCourseRepo = _repositoryFactory.CreateGenericRepository<UserTrainingCourse>(userContext: _uId);
            _integrationAuditRepo = _repositoryFactory.CreateRepository<IntegrationAudit>(userContext: _uId);

            _notificationService = notificationService;
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

                _pointsUserSummaryRepo.Update(currentPoints);
            }
        }

        /// <summary>
        /// Child attendance register saved (ie user taps "Save" on a child attendance register)
        /// Since the user can edit a register, do not give the user more points for saving a register for the same class on the same day multiple times 
        /// (e.g. user saves register for Lions class for 4 May; then goes back to edit the register and taps "Save" again for Lions class for 4 May -- they should still only earn 5 points).
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateChildAttendanceRegisterSaved(Guid userId)
        {
            if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.AttendanceEnabled)
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
                    // 5 points per register
                    // max month 100 && max year 1200
                    AddOrUpdatePoints(
                        PointsActivityConstants.ChildAttendanceRegisterSavedId,
                        userId,
                        timesScored > 20 ? (int)activity.MaxPointsIndividualMonthly : timesScored * activity.Points,
                        timesScored);
                }
            }
        }

        /// <summary>
        /// Child registration complete (all steps)
        /// 10 points per child fully registered (all registration steps complete)
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateChildRegistrationComplete(Guid childUserId)
        {
            // CalculateChildRegistrationComplete
            var parentUserId = _hierarchyEngine.GetUserParentUserId(childUserId);
            var practitioner = _practitionerRepo.GetByUserId(parentUserId.ToString());
            if (practitioner != null)
            {
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildRegistrationCompleteId);
                var today = DateTime.Now;
                var practitionerChildren = _childRepo.GetAll().Where(x => x.Hierarchy.Contains(practitioner.Hierarchy)
                                                                    && x.UpdatedDate.Year == today.Year
                                                                    && x.CaregiverId.HasValue).ToList();

                AddOrUpdatePoints(
                    PointsActivityConstants.ChildRegistrationCompleteId,
                    (Guid)parentUserId,
                    practitionerChildren.Count > 4 ? (int)activity.MaxPointsIndividualYearly : practitionerChildren.Count * activity.Points,
                    practitionerChildren.Count
                   );
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
            Practitioner practitioner = _practitionerRepo.GetByUserId(userId);
            if (practitioner != null && !string.IsNullOrEmpty(practitioner.Hierarchy))
            {
                var today = DateTime.Now;

                // Reading from audit table to retrieve data for practitioner 
                var childCount = _integrationAuditRepo.GetAll().Where(x => x.Entity == "Child" &&
                                                                           x.Property == "IsActive" &&
                                                                           x.ValueBefore == "True" &&
                                                                           x.ValueAfter == "False" &&
                                                                           x.UserId.ToString() == userId.ToString() &&
                                                                           x.UpdatedDate.Year == today.Year)
                                                                .OrderBy(x => x.InsertedDate)
                                                                .Count();
                if (childCount > 0)
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildRemovedFromPreschoolId);

                    AddOrUpdatePoints(
                        PointsActivityConstants.ChildRemovedFromPreschoolId,
                        userId,
                        childCount > 4 ? (int)activity.MaxPointsIndividualYearly : childCount * activity.Points,
                        childCount
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
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ThemePlannedId);

            }
        }
        public void CalculateNoThemePlanned(Guid userId)
        {
            if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.ProgressEnabled)
            {
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.NoThemePlannedId);

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
                var practitioners = _practitionerRepo.GetAll().Where(x => x.IsActive
                                                                && x.PrincipalHierarchy == userId
                                                                && x.DateLinked.HasValue
                                                                && x.DateLinked.Value.Year == today.Year)
                                            .Select(x => new { x.DateLinked.Value.Month, x.Id })
                                            .ToList()
                                            .GroupBy(x => x.Month)
                                            .Select(x => new { Month = x.Key, Total = x.Count() })
                                            .ToList();
                if (practitioners.Any())
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddNewPractitionerToPreschoolId);
                    foreach (var item in practitioners)
                    {
                        AddOrUpdatePoints(
                          PointsActivityConstants.AddNewPractitionerToPreschoolId,
                          userId,
                          activity.Points * item.Total,
                          item.Total,
                          new DateTime(today.Year, item.Month, today.Day)
                        );
                    }
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
                var schoolClasses = _classRepo.GetAll()
                                            .Where(x => x.IsActive && x.UserId == userId && x.ClassroomGroups.Count != 0)
                                            .SelectMany(x => x.ClassroomGroups.Where(x => x.InsertedDate.Year == today.Year))
                                            .Select(x => new { x.InsertedDate.Month, x.Id })
                                            .ToList()
                                            .GroupBy(x => x.Month)
                                            .Select(x => new { Month = x.Key, Total = x.Count() })
                                            .ToList();
                if (schoolClasses.Any())
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddNewClassToPreschoolId);
                    var currentPoints = _pointsUserSummaryRepo.GetAll().Where(x =>
                                            x.UserId == userId
                                            && x.PointsActivityId == activity.Id
                                            && x.DateScored.Year >= today.Year)
                                            .Count();

                    var userPoints = currentPoints == 0 ? activity.Points : 0;
                    foreach ( var item in schoolClasses)
                    {
                        AddOrUpdatePoints(
                          PointsActivityConstants.AddNewClassToPreschoolId,
                          userId,
                          userPoints,
                          item.Total,
                          new DateTime(today.Year, item.Month, today.Day)
                        );
                        userPoints = 0; //reset user points - max 20 for year
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
                var statements = _statementsIncomeStatementRepo
                                    .GetAll().Where(x => x.IsActive && x.UserId == userId && x.Year == today.Year && x.Downloaded)
                                    .Select(x => new { x.Month, x.Id })
                                    .ToList()
                                    .GroupBy(x => x.Month)
                                    .Select(x => new { Month = x.Key, Total = x.Count() })
                                    .ToList();
                if (statements.Count > 0)
                {
                    var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.DownloadIncomeStatementId);
                    foreach (var item in statements)
                    {
                        AddOrUpdatePoints(
                          PointsActivityConstants.DownloadIncomeStatementId,
                          userId,
                          activity.Points,
                          item.Total,
                          new DateTime(today.Year, item.Month, today.Day)
                        );
                    }
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
                    var incomeExpenseItems = _statementsIncomeStatementRepo
                                            .GetAll().Where(x => x.IsActive && x.UserId == userId && x.Year == today.Year)
                                            .Select(x => new { Month = x.Month, IncomeCount = x.IncomeItems.Where(y => y.Amount > 0).Count(), ExpenseCount = x.ExpenseItems.Where(y => y.Amount > 0).Count() })
                                            .ToList();

                    if (incomeExpenseItems.Count > 0)
                    {
                        var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddExpenseOrIncomeToStatementId);
                        foreach (var item in incomeExpenseItems)
                        {
                            var monthPoints = (item.IncomeCount + item.ExpenseCount) * activity.Points;
                            AddOrUpdatePoints(
                              PointsActivityConstants.AddExpenseOrIncomeToStatementId,
                              userId,
                              monthPoints > 25 ? activity.Points : monthPoints,
                              (item.IncomeCount + item.ExpenseCount),
                              new DateTime(today.Year, item.Month, today.Day)
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
            //if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.BusinessEnabled)
            //{
            var today = DateTime.Now;
            var month = 7;
            var year = 2024;
            var preschoolFeeStatements = _statementsIncomeStatementRepo
                                        .GetAll()
                                        .Where(x => x.IsActive == true
                                            && x.Month == month
                                            && x.Year == year
                                            && x.IncomeItems.Count > 0)
                                        .ToList()
                                        .SelectMany(x => x.IncomeItems)
                                        .Where(x => x.IncomeTypeId == PointsActivityConstants.PreschoolFeeId && x.Amount > 0 && x.IsActive)
                                        .Select(x => x.StatementsIncomeStatement)
                                        .Distinct()
                                        .ToList();
            
            var principalUserIds = preschoolFeeStatements.Select(x => x.UserId).Distinct().ToList();

            var principalLearnerTotals = _classRepo
                                            .GetAll()
                                            .Where(x => x.IsActive && principalUserIds.Contains(x.UserId))
                                            .ToList()
                                            .Select(x => new { Key = x.UserId, Value = x.ClassroomGroups.SelectMany(y => y.Learners).Where(y => y.IsActive).Count() })
                                            .ToList();

            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.PreschoolFeesGreaterThan0ForEachChildId);
            foreach (var item in preschoolFeeStatements)
            {
                var principalLearnerTotal = principalLearnerTotals.Where(x => x.Key == item.UserId).FirstOrDefault();
                var preschoolIncomeTotal = item.IncomeItems.Count();

                if (principalLearnerTotal != null)
                {
                    if (principalLearnerTotal.Value == preschoolIncomeTotal)
                    {
                        AddOrUpdatePoints(
                            PointsActivityConstants.PreschoolFeesGreaterThan0ForEachChildId,
                            (Guid)item.UserId,
                            activity.Points,
                            1,
                            new DateTime(today.Year, today.Month, today.Day)
                        );
                    }
                }
            }
        }
        public void CalculateCompleteChildProgressObservations(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.CompleteChildProgressObservationsId);
        }
        public void CalculateCreateChildProgressReport(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.CreateChildProgressReportId);
        }
        public void CalculateDownloadPreschoolOrClassProgressSummary(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.DownloadPreschoolOrClassProgressSummaryId);
        }
        public void CalculateCompleteOnlineTrainingCourse(Guid userId)
        {
            var today = DateTime.Now;
            var trainingCourses = _userTrainingCourseRepo.GetAll().Where(x => x.IsActive && x.UserId == userId && x.CompletedDate.Year == today.Year).ToList();
            if (trainingCourses.Count > 0)
            {
                // 200 points per course completed in the "Training" section
                // Max scores for the year is 200 
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.CompleteOnlineTrainingCourseId);
                AddOrUpdatePoints(
                    PointsActivityConstants.CompleteOnlineTrainingCourseId,
                    userId,
                    activity.Points,
                    trainingCourses.Count);
            }
        }
        public void CalculateAddingShortDescription(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddingShortDescriptionId);
            AddOrUpdatePoints(
                PointsActivityConstants.AddingShortDescriptionId,
                userId,
                activity.Points,
                1);
        }
        public void CalculateCompleteCommunityProfile(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.CompleteCommunityProfileId);
            AddOrUpdatePoints(
                PointsActivityConstants.CompleteCommunityProfileId,
                userId,
                activity.Points,
                1);
        }
        public void CalculateConnectWithAnotherUser(Guid userId)
        {
            var today = DateTime.Now;
            var acceptedConnectionsForYear = _communityProfileConnectionRepo
                                            .GetAll()
                                            .Where(x => x.IsActive
                                                    && x.InviteAccepted.HasValue
                                                    && x.InviteAccepted == true
                                                    && (x.FromProfile.UserId == userId || x.ToProfile.UserId == userId)
                                                    && x.UpdatedDate.Year == today.Year
                                                    )
                                            .Select(x => new { x.UpdatedDate.Month, x.Id })
                                            .ToList()
                                            .GroupBy(x => x.Month)
                                            .Select(x => new { Month = x.Key, ConnectionCount = x.Count() })
                                            .ToList();
            if (acceptedConnectionsForYear.Count > 0)
            {
                // principal and practitioner max month(10) and max year(120)
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ConnectWithAnotherUserId);

                foreach (var item in acceptedConnectionsForYear)
                {
                    AddOrUpdatePoints(
                      PointsActivityConstants.ConnectWithAnotherUserId,
                      userId,
                      item.ConnectionCount > 2 ? (int)activity.MaxPointsIndividualMonthly : item.ConnectionCount * activity.Points,
                      acceptedConnectionsForYear.Count,
                      new DateTime(today.Year, item.Month, today.Day)
                    );
                }

            }
        }

    }

    internal record NewRecord(Guid? UserId, IEnumerable<ICollection<Learner>> Item);
}
