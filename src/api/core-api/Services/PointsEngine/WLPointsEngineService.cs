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
using static iTextSharp.text.pdf.AcroFields;

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
        public void CalculateAddNewPractitionerToPreschool(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddNewPractitionerToPreschoolId);
        }
        public void CalculateAddNewClassToPreschool(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddNewClassToPreschoolId);
        }
        public void CalculateDownloadIncomeStatement(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.DownloadIncomeStatementId);
        }
        public void CalculateAddExpenseOrIncomeToStatement(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.AddExpenseOrIncomeToStatementId);
        }
        public void CalculatePreschoolFeesGreaterThan0ForEachChild(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.PreschoolFeesGreaterThan0ForEachChildId);
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










        /*



                #region SS_Children

                public bool CalculateChildrenRegistrationAdd(string userId)
                {
                    var pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_data_collection);
                    var activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac1).FirstOrDefault();

                    var practitioner = _practitionerRepo.GetByUserId(userId);

                    UpdateUserSummaryPoints(
                        userId,
                        activity,
                        DateTime.Now,
                        (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value) || (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value));

                    _notificationService.ExpireNotificationsTypesForUser(userId, TemplateTypeConstants.ChildRegistrationIncomplete);
                    return true;
                }

                public bool CalculateChildrenRegistrationRemoval(string userId, DateTime today)
                {
                    Practitioner practitioner = _practitionerRepo.GetByUserId(userId);
                    if (practitioner != null && !string.IsNullOrEmpty(practitioner.Hierarchy))
                    {
                        // Reading from audit table to retrieve data for practitioner 
                        var childCount = _integrationAuditRepo.GetAll().Where(x => x.Entity == "Child" &&
                                                                                   x.Property == "IsActive" &&
                                                                                   x.ValueBefore == "True" &&
                                                                                   x.ValueAfter == "False" &&
                                                                                   x.UserId.ToString() == userId &&
                                                                                   x.UpdatedDate.Year == today.Year &&
                                                                                   x.UpdatedDate.Month == today.Month)
                                                                        .OrderBy(x => x.InsertedDate)
                                                                        .Count();
                        if (childCount > 0)
                        {
                            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_data_collection);
                            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac2).FirstOrDefault();

                            UpdateUserSummaryPoints(
                                userId, 
                                activity,
                                today,
                                (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value) || (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value));
                        }               
                    }
                    return true;
                }

                #endregion

               


                public bool CalculatePreSchoolFees(string userId, DateTime today)
                {
                    var activity = GetPointsLibraryForActivity(Constants.PointsEngineSettings.income_statement).Where(x => x.SubActivity == Constants.PointsEngineSettings.income_statement_ac1).FirstOrDefault();
                    var activity_record = _pointsUserSummaryRepo.GetAll().Where(x => x.PointsLibraryId == activity.Id && x.UserId.ToString() == userId && x.Year == today.Year).FirstOrDefault();

                    if (activity_record == null)
                    {
                        UpdateUserSummaryPoints(userId, activity, today);
                    }

                    return true;
                }


        */


    }
}
