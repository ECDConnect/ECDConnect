using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Extensions;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports;
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

        private readonly IGenericRepository<PointsLibrary, Guid> _pointsLibraryRepo;
        private readonly IGenericRepository<PointsCategory, Guid> _pointsCategoryRepo;
        private readonly IGenericRepository<PointsActivity, Guid> _pointsActivityRepo;
        private readonly IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;
        private readonly IGenericRepository<PointsClinicSummary, Guid> _pointsClinicSummaryRepo;

        private readonly IGenericRepository<Child, Guid> _childRepo;
        private readonly IGenericRepository<Practitioner, Guid> _practitionerRepo;


        private readonly IGenericRepository<Classroom, Guid> _classRepo;
        private readonly IGenericRepository<ClassroomGroup, Guid> _classroomGroupRepo;

        private readonly IGenericRepository<StatementsIncomeStatement, Guid> _statementsIncomeStatementRepo;

        private readonly IGenericRepository<IntegrationAudit, Guid> _integrationAuditRepo;

        private readonly IGenericRepository<Club, Guid> _clubRepo;
        private readonly IGenericRepository<ClubMember, Guid> _clubMemberRepo;
        private readonly IGenericRepository<ClubPoints, Guid> _clubPointsRepo;
        private readonly IGenericRepository<ClubPointsLibrary, Guid> _clubPointsLibraryRepo;
        private readonly IGenericRepository<ClubMeeting, Guid> _clubMeetingRepo;        

        private readonly IGenericRepository<ChildProgressReport, Guid> _childProgressReportRepo;

        private readonly IGenericRepository<Clinic, Guid> _clinicRepo;
        private readonly IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;
        private readonly IGenericRepository<Mother, Guid> _motherRepo;
        private readonly IGenericRepository<Infant, Guid> _infantRepo;

        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;

        private readonly IGenericRepository<League, Guid> _leagueRepo;

        private readonly MonthlyAttendanceReport _monthlyAttendanceReportService;

        private readonly IChildService _childService;

        private VisitManager _visitManager;
        private HierarchyEngine _hierarchyEngine;
        private INotificationService _notificationService;

        private readonly Guid _uId;

        public PointsEngineService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            VisitManager visitManager,
            HierarchyEngine hierarchyEngine,
            [Service] MonthlyAttendanceReport monthlyAttendanceReportService,
            [Service] IChildService childService,
            [Service] INotificationService notificationService)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _monthlyAttendanceReportService = monthlyAttendanceReportService;
            _childService = childService;
            _uId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().GetValueOrDefault());

            _pointsLibraryRepo = _repositoryFactory.CreateGenericRepository<PointsLibrary>(userContext: _uId);
            _pointsCategoryRepo = _repositoryFactory.CreateGenericRepository<PointsCategory>(userContext: _uId);
            _pointsActivityRepo = _repositoryFactory.CreateGenericRepository<PointsActivity>(userContext: _uId);
            _pointsUserSummaryRepo = _repositoryFactory.CreateGenericRepository<PointsUserSummary>(userContext: _uId);
            _pointsClinicSummaryRepo = _repositoryFactory.CreateGenericRepository<PointsClinicSummary>(userContext: _uId);

            _practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
            _childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);

            _statementsIncomeStatementRepo = _repositoryFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _uId);

            _classRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: _uId);
            _classroomGroupRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _uId);
            _integrationAuditRepo = _repositoryFactory.CreateRepository<IntegrationAudit>(userContext: _uId);

            _clubMemberRepo = _repositoryFactory.CreateGenericRepository<ClubMember>(userContext: _uId);

            _clubRepo = _repositoryFactory.CreateGenericRepository<Club>(userContext: _uId);
            _clubMemberRepo = _repositoryFactory.CreateGenericRepository<ClubMember>(userContext: _uId);
            _clubPointsRepo = _repositoryFactory.CreateGenericRepository<ClubPoints>(userContext: _uId);
            _clubPointsLibraryRepo = _repositoryFactory.CreateGenericRepository<ClubPointsLibrary>(userContext: _uId);
            _clubMeetingRepo = _repositoryFactory.CreateGenericRepository<ClubMeeting>(userContext: _uId);

            _childProgressReportRepo = _repositoryFactory.CreateGenericRepository<ChildProgressReport>(userContext: _uId);

            _clubMeetingRepo = _repositoryFactory.CreateGenericRepository<ClubMeeting>(userContext: _uId);

            _clinicRepo = _repositoryFactory.CreateGenericRepository<Clinic>(userContext: _uId);
            _healthCareWorkerRepo = _repositoryFactory.CreateGenericRepository<HealthCareWorker>(userContext: _uId);
            _motherRepo = _repositoryFactory.CreateGenericRepository<Mother>(userContext: _uId);
            _infantRepo = _repositoryFactory.CreateGenericRepository<Infant>(userContext: _uId);

            _visitRepo = _repositoryFactory.CreateGenericRepository<Visit>(userContext: _uId);
            _visitDataStatusRepo = _repositoryFactory.CreateGenericRepository<VisitDataStatus>(userContext: _uId);

            _leagueRepo = _repositoryFactory.CreateGenericRepository<League>(userContext: _uId);

            _visitManager = visitManager;
            _notificationService = notificationService;
        }

        #region PointsLibrary

        public List<PointsLibrary> GetPointsLibraryForActivity(string activity, string subActivity = null)
        {
            return _pointsLibraryRepo.GetAll()
                .Where(x => x.Activity == activity
                    && (subActivity == null || x.SubActivity == subActivity))
                .ToList();
        }

        public List<PointsLibrary> GetPointsLibraryForTenant()
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return _pointsLibraryRepo.GetAll().Where(x => x.TenantId == tenantId).ToList();
        }

        public List<PointsUserSummary> GetOldSummaryUserPoints(Guid userId, DateTime startDate, DateTime? endDate = null)
        {
            return _pointsUserSummaryRepo.GetAll().Where(
                x => x.UserId == userId &&
                // After the start
                (x.Year > startDate.Year || (x.Year == startDate.Year && x.Month >= startDate.Month)) &&
                // Before the end or no end date
                (!endDate.HasValue || x.Year < endDate.Value.Year || (x.Year == endDate.Value.Year && x.Month <= endDate.Value.Month))).ToList();
        }

        public List<PointsUserSummary> GetSummaryUserPoints(Guid userId, DateTime startDate, DateTime? endDate = null)
        {
            return _pointsUserSummaryRepo.GetAll().Where(
                x => x.UserId == userId &&
                // After the start
                (x.DateScored >= startDate) &&
                // Before the end or no end date
                (!endDate.HasValue || x.DateScored <= endDate)).ToList();
        }

        public PointsUserSummary InsertIndividualSummaryUserPoints(PointsUserSummary input)
        {
            return _pointsUserSummaryRepo.Insert(input);
        }

        public PointsUserSummary UpdateIndividualSummaryUserPoints(PointsUserSummary input)
        {
            return _pointsUserSummaryRepo.Update(input);
        }
        #endregion

        #region UserSummary

        public void UpdateUserSummaryPoints(string userId, PointsLibrary activity, DateTime today, bool isPrincipalOrAdmin = false, int? timeScored = null)
        {
            var pointsScoredThisYear = _pointsUserSummaryRepo.GetAll().Where(x => x.UserId.ToString() == userId && x.Year == today.Year && x.PointsLibraryId == activity.Id).ToList();

            // Get new totals, sum of current month or year, plus one more score
            int monthTotal = pointsScoredThisYear.Where(x => x.Month == today.Month).Select(x => x.PointsTotal).Sum() + activity.Points;
            int ytdTotal = pointsScoredThisYear.Select(x => x.PointsTotal).Sum() + activity.Points;

            if (!timeScored.HasValue)
            {
                var monthPointsSummary = pointsScoredThisYear.Where(x => x.Month == today.Month).FirstOrDefault();
                timeScored = monthPointsSummary == null ? 1 : monthPointsSummary.TimesScored + 1;
            }

            UpdateUserSummaryPoints(userId, activity, today, isPrincipalOrAdmin, monthTotal, ytdTotal, timeScored.Value);
        }

        private void UpdateUserSummaryPoints(string userId, PointsLibrary activity, DateTime today, bool isPrincipalOrAdmin, int monthTotal, int ytdTotal, int timesScored)
        {
            var pointsScoredThisYear = _pointsUserSummaryRepo.GetAll().Where(x => x.UserId.ToString() == userId && x.Year == today.Year && x.PointsLibraryId == activity.Id).ToList();
                        
            if (isPrincipalOrAdmin)
            {
                if (activity.MaxPointsPrincipalMonthly != 0 && monthTotal > activity.MaxPointsPrincipalMonthly)
                {
                    monthTotal = activity.MaxPointsNonPrincipalMonthly;
                }
                if (activity.MaxPointsPrincipalYearly != 0 && ytdTotal > activity.MaxPointsPrincipalYearly)
                {
                    ytdTotal = activity.MaxPointsPrincipalYearly;
                }
            }
            else
            {
                if (activity.MaxPointsIndividualMonthly != 0 && monthTotal > activity.MaxPointsIndividualMonthly)
                {
                    monthTotal = activity.MaxPointsNonPrincipalMonthly;
                }
                if (activity.MaxPointsNonPrincipalYearly != 0 && ytdTotal > activity.MaxPointsNonPrincipalYearly)
                {
                    ytdTotal = activity.MaxPointsNonPrincipalYearly;
                }
            }

            if (monthTotal > 0 && ytdTotal > 0)
            {
                var record = _pointsUserSummaryRepo.GetAll().Where(x => x.UserId.ToString() == userId && x.Month == today.Month && x.Year == today.Year && x.PointsLibraryId == activity.Id).FirstOrDefault();
                if (record == null)
                {
                    InsertIndividualSummaryUserPoints(
                        new PointsUserSummary
                        {
                            Id = Guid.NewGuid(),
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            UpdatedBy = _uId.ToString(),
                            Month = today.Month,
                            Year = today.Year,
                            UserId = new Guid(userId),
                            PointsLibraryId = activity.Id,
                            PointsTotal = monthTotal,
                            PointsYTD = ytdTotal,
                            TimesScored = timesScored,
                        }
                    );
                } else
                {
                    record.PointsTotal = monthTotal;
                    record.PointsYTD = ytdTotal;
                    record.UpdatedDate = DateTime.Now;
                    record.UpdatedBy = _uId.ToString();
                    record.TimesScored = timesScored;

                    UpdateIndividualSummaryUserPoints(record);
                }
            }
        }

        #endregion

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

        #region SS_Attendance
        public bool CalculateAttendanceSubmitted(string userId, DateTime today)
        {
            var pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_data_collection);
            var activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac3).FirstOrDefault();
            
            var classrooms = _classroomGroupRepo.GetAll()
                .Where(x => x.UserId.HasValue && x.UserId.Value.ToString() == userId && x.IsActive)
                .Select(x => x.Classroom)
                .Distinct()
                .ToList();

            var allScores = new List<int>();
            var timesScored = 0;
            foreach (var classroom in classrooms)
            {
                var monthlyReport = _monthlyAttendanceReportService.GenerateMonthlyAttendanceReport(userId, classroom, today.GetStartOfMonth(), today.GetEndOfMonth()).SingleOrDefault();

                timesScored += monthlyReport.NumberOfSessions;
                allScores.Add(monthlyReport.PercentageAttendance);
            }

            var perc = 0.0;
            if (allScores.Any())
            {
                perc = allScores.Sum() / allScores.Count();
            }

            if (perc > 50)
            {
                var practitioner = _practitionerRepo.GetByUserId(userId);

                var pointsScoredThisYear = _pointsUserSummaryRepo.GetAll().Where(x => x.UserId.ToString() == userId && x.Year == today.Year && x.PointsLibraryId == activity.Id).ToList();

                // Get new totals, sum of current month or year, plus one more score
                int monthTotal = (int)perc;
                int ytdTotal = pointsScoredThisYear.Where(x => x.Month != today.Month).Select(x => x.PointsTotal).Sum() + monthTotal;

                UpdateUserSummaryPoints(
                    userId, 
                    activity, 
                    today,
                    (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value) || (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value),
                    monthTotal, 
                    ytdTotal,
                    timesScored);
            }
            return true;
        }

        #endregion

        #region SS_IncomeStatements

        public bool CalculateIncomeStatements(string userId, StatementsIncomeStatement lastStatement)
        {
            var pointsMonth = new DateTime(lastStatement.Year, lastStatement.Month, 1);

            var statementPointsActivities = GetPointsLibraryForActivity(Constants.PointsEngineSettings.income_statement);

            var practitioner = _practitionerRepo.GetByUserId(userId);
            var isPrincipalOrAdmin = (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value) || (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value);

            // SUBMIT STATEMENT POINTS
            // Just add points for submitting for the current month, we only call this after submitting
            var submitActivity = statementPointsActivities.Where(x => x.SubActivity == Constants.PointsEngineSettings.income_statement_ac3).FirstOrDefault();
            
            UpdateUserSummaryPoints(
                userId,
                submitActivity,
                pointsMonth,
                isPrincipalOrAdmin);

            // ALL CHILDREN WITH FEES POINTS
            var feesActivity = statementPointsActivities.Where(x => x.SubActivity == Constants.PointsEngineSettings.income_statement_ac2).FirstOrDefault();

            // Fetch all children for principal
            var classroom = _classRepo.GetByUserId(userId);

            if (classroom != null)
            {
                var children = _childService.GetChildrenForClassroom(classroom.Id);

                if (children.Any())
                {
                    // Check preschool fees exist for all children
                    var allChildrenHaveFees = children.All(x => lastStatement.IncomeItems.Any(y => y.ChildUserId == x.UserId));

                    if (allChildrenHaveFees)
                    {
                        UpdateUserSummaryPoints(
                           userId,
                           feesActivity,
                           pointsMonth,
                           isPrincipalOrAdmin,
                           children.Count());
                    }
                }
            }

            // THREE SUBMITS IN A ROW
            var timeSinceLastBonus = new TimeSpan();
            var consecutiveBonusActivity = statementPointsActivities.Where(x => x.SubActivity == Constants.PointsEngineSettings.income_statement_ac4).FirstOrDefault();

            var lastBonus = _pointsUserSummaryRepo.GetAll()
                .Where(x => x.PointsLibraryId == consecutiveBonusActivity.Id && x.UserId.ToString() == userId)
                .OrderByDescending(x => x.InsertedDate)
                .FirstOrDefault();

            if (lastBonus != null)
            {
                // Just use first day for easier setup, we just need to check the months diff
                var lastBonusDate = new DateTime(lastBonus.Year, lastBonus.Month, 1);
                timeSinceLastBonus = pointsMonth - lastBonusDate;
            }

            if (lastBonus == null || timeSinceLastBonus.TotalDays > 70) // At least three months
            {
                var lastMonth = pointsMonth.AddMonths(-1);
                var previousMonth = pointsMonth.AddMonths(-2);

                // Check previous two months statements were also submitted
                var previousTwoStatementsSubmitted = _statementsIncomeStatementRepo.GetAll()
                    .Where(x => x.UserId.ToString() == userId && !x.AutoSubmitted)
                    .Where(x => (x.Year == lastMonth.Year && x.Month == lastMonth.Month) || (x.Year == previousMonth.Year && x.Month == previousMonth.Month))
                    .Count() == 2;

                if (previousTwoStatementsSubmitted)
                {
                    UpdateUserSummaryPoints(
                        userId,
                        consecutiveBonusActivity,
                        pointsMonth,
                        isPrincipalOrAdmin);
                }
            }
            
            return true;
        }


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

        #endregion

        public List<KeyValuePair<string, int>> GetClubMemberPointsTotals(Guid clubId, int year, int? month = null)
        {
            var clubUserIds = _clubMemberRepo.GetAll()
                .Include(x => x.Practitioner)
                .Where(x => x.ClubId == clubId && x.IsActive)
                .Select(x => x.Practitioner.UserId.Value)
                .ToList();

           return GetUserPointsTotals(clubUserIds, year, month);
        }

        public List<KeyValuePair<string, int>> GetUserPointsTotals(List<Guid> userIds, int year, int? month = null)
        {
            var usersPoints = _pointsUserSummaryRepo.GetAll()
               .Where(x => x.UserId.HasValue && userIds.Contains(x.UserId.Value)
                    && x.Year == year
                    && (month == null || x.Month == month.Value))
               .GroupBy(x => x.UserId)
               .Select(x => new KeyValuePair<string, int>(x.First().UserId.ToString(), x.Sum(y => y.PointsTotal)))
               .ToList();

            return usersPoints;
        }

        /// <summary>
        /// Gets the percentile standing of a user within relative to others within the club
        /// 
        /// NOTE: Old standings for Smart Start, can remove
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public UserClubStandingModel GetUserClubStanding(string userId)
        {
            var practitionerId = _practitionerRepo.GetByUserId(userId).Id;
            var clubMember = _clubMemberRepo.GetAll().Where(x => x.IsActive && x.PractitionerId == practitionerId).FirstOrDefault();

            if (clubMember == null)
            {
                return new UserClubStandingModel();
            }

            var clubUserIds = _clubMemberRepo.GetAll()
                .Include(x => x.Practitioner)
                .Where(x => x.ClubId == clubMember.ClubId && x.IsActive)
                .Select(x => x.Practitioner.UserId)
                .ToList();

            var usersPoints = _pointsUserSummaryRepo.GetAll()
                .Where(x => clubUserIds.Contains(x.UserId) && x.Year == DateTime.Now.Year)
                .GroupBy(x => x.UserId)
                .Select(x => new { x.First().UserId, PointsSummaries = x.Select(y => new { y.Month, y.PointsTotal }) })
                .ToList();

            var usersByMonth = usersPoints
                .Select(x => new { x.UserId, PointsTotal = x.PointsSummaries.Where(y => y.Month == DateTime.Now.Month).Sum(z => z.PointsTotal) })
                .OrderByDescending(x => x.PointsTotal)
                .ToList();

            var usersByYear = usersPoints
                .Select(x => new { x.UserId, PointsTotal = x.PointsSummaries.Sum(y => y.PointsTotal) })
                .OrderByDescending(x => x.PointsTotal)
                .ToList();


            var totalMembers = clubUserIds.Count();

            var userMonthPoints = usersByMonth.FirstOrDefault(x => x.UserId.ToString() == userId)?.PointsTotal ?? 0;
            var userYearPoints = usersByYear.FirstOrDefault(x => x.UserId.ToString() == userId)?.PointsTotal ?? 0;

            var usersWithMorePointsThisMonth = usersByMonth.Where(x => x.PointsTotal > userMonthPoints && userId != x.UserId.ToString()).Count();
            var usersWithMorePointsThisYear = usersByYear.Where(x => x.PointsTotal > userYearPoints && userId != x.UserId.ToString()).Count();

            var percentageWithMorePointsThisMonth = (double)usersWithMorePointsThisMonth / (totalMembers - 1) * 100;
            var percentageWithMorePointsThisYear = (double)usersWithMorePointsThisYear / (totalMembers - 1) * 100;

            var userWithFewerPointsThisMonth = usersByMonth.Where(x => x.PointsTotal < userMonthPoints && userId != x.UserId.ToString()).Count();
            var userWithFewerPointsThisYear = usersByYear.Where(x => x.PointsTotal < userYearPoints && userId != x.UserId.ToString()).Count();

            if (userMonthPoints > 0)
            {
                userWithFewerPointsThisMonth += clubUserIds.Where(x => x.ToString() != userId && !usersByMonth.Any(y => y.UserId == x)).Count();
            }

            if (userYearPoints > 0)
            {
                userWithFewerPointsThisYear += clubUserIds.Where(x => x.ToString() != userId && !usersByYear.Any(y => y.UserId == x)).Count();
            }

            var percentageWithFewerPointsThisMonth = (double)userWithFewerPointsThisMonth / (totalMembers - 1) * 100;
            var percentageWithFewerPointsThisYear = (double)userWithFewerPointsThisYear / (totalMembers - 1) * 100;


            // Offset for first place ties
            if (percentageWithFewerPointsThisMonth == 100 && usersByMonth.Count() > 1 && usersByMonth[0].PointsTotal == usersByMonth[1].PointsTotal)
            {
                percentageWithFewerPointsThisMonth = 99;
            }

            if (percentageWithFewerPointsThisYear == 100 && usersByYear.Count() > 1 && usersByYear[0].PointsTotal == usersByYear[1].PointsTotal)
            {
                percentageWithFewerPointsThisYear = 99;
            }

            return new UserClubStandingModel
            {
                PercentageMembersWithFewerPointsForCurrentMonth = (int)percentageWithFewerPointsThisMonth,
                PercentageMembersWithFewerPointsForCurrentYear = (int)percentageWithFewerPointsThisYear,
                PercentageMembersWithMorePointsForCurrentMonth = (int)percentageWithMorePointsThisMonth,
                PercentageMembersWithMorePointsForCurrentYear = (int)percentageWithMorePointsThisYear
            };
        }

        /// <summary>
        /// Gets the percentile standing of a user within relative to others within the team/clinic
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public TeamStandingModel GetHealthCareWorkerTeamStanding(Guid userId)
        {
            var clinicId = _healthCareWorkerRepo.GetAll().Where(x => x.IsActive && x.UserId.HasValue && x.UserId.Value == userId).Select(x => x.ClinicId).FirstOrDefault();

            if (!clinicId.HasValue)
            {
                return new TeamStandingModel();
            }

            var teamUserIds = _healthCareWorkerRepo.GetAll()
                .Where(x => x.ClinicId == clinicId.Value && x.IsActive)
                .Select(x => x.UserId)
                .ToList();

            var startDate = new DateTime(DateTime.Now.Year, 1, 1);

            var usersPoints = _pointsUserSummaryRepo.GetAll()
                .Where(x => teamUserIds.Contains(x.UserId) && x.DateScored >= startDate)
                .GroupBy(x => x.UserId)
                .Select(x => new { x.First().UserId, PointsSummaries = x.Select(y => new { y.DateScored.Month, y.PointsTotal }) })
                .ToList();

            var usersByMonth = usersPoints
                .Select(x => new { x.UserId, PointsTotal = x.PointsSummaries.Where(y => y.Month == DateTime.Now.Month).Sum(z => z.PointsTotal) })
                .OrderByDescending(x => x.PointsTotal)
                .ToList();

            var usersByYear = usersPoints
                .Select(x => new { x.UserId, PointsTotal = x.PointsSummaries.Sum(y => y.PointsTotal) })
                .OrderByDescending(x => x.PointsTotal)
                .ToList();


            var totalMembers = teamUserIds.Count();

            var userMonthPoints = usersByMonth.FirstOrDefault(x => x.UserId.HasValue && x.UserId.Value == userId)?.PointsTotal ?? 0;
            var userYearPoints = usersByYear.FirstOrDefault(x => x.UserId.HasValue && x.UserId.Value == userId)?.PointsTotal ?? 0;

            var usersWithMorePointsThisMonth = usersByMonth.Where(x => x.PointsTotal > userMonthPoints && userId != x.UserId).Count();
            var usersWithMorePointsThisYear = usersByYear.Where(x => x.PointsTotal > userYearPoints && userId != x.UserId).Count();

            var percentageWithMorePointsThisMonth = (double)usersWithMorePointsThisMonth / (totalMembers - 1) * 100;
            var percentageWithMorePointsThisYear = (double)usersWithMorePointsThisYear / (totalMembers - 1) * 100;

            var userWithFewerPointsThisMonth = usersByMonth.Where(x => x.PointsTotal < userMonthPoints && userId != x.UserId).Count();
            var userWithFewerPointsThisYear = usersByYear.Where(x => x.PointsTotal < userYearPoints && userId != x.UserId).Count();

            if (userMonthPoints > 0)
            {
                userWithFewerPointsThisMonth += teamUserIds.Where(x => x != userId && !usersByMonth.Any(y => y.UserId == x)).Count();
            }

            if (userYearPoints > 0)
            {
                userWithFewerPointsThisYear += teamUserIds.Where(x => x != userId && !usersByYear.Any(y => y.UserId == x)).Count();
            }

            var percentageWithFewerPointsThisMonth = (double)userWithFewerPointsThisMonth / (totalMembers - 1) * 100;
            var percentageWithFewerPointsThisYear = (double)userWithFewerPointsThisYear / (totalMembers - 1) * 100;


            // Offset for first place ties
            if (percentageWithFewerPointsThisMonth == 100 && usersByMonth.Count() > 1 && usersByMonth[0].PointsTotal == usersByMonth[1].PointsTotal)
            {
                percentageWithFewerPointsThisMonth = 99;
            }

            if (percentageWithFewerPointsThisYear == 100 && usersByYear.Count() > 1 && usersByYear[0].PointsTotal == usersByYear[1].PointsTotal)
            {
                percentageWithFewerPointsThisYear = 99;
            }

            return new TeamStandingModel
            {
                PercentageMembersWithFewerPointsForCurrentMonth = (int)percentageWithFewerPointsThisMonth,
                PercentageMembersWithFewerPointsForCurrentYear = (int)percentageWithFewerPointsThisYear,
                PercentageMembersWithMorePointsForCurrentMonth = (int)percentageWithMorePointsThisMonth,
                PercentageMembersWithMorePointsForCurrentYear = (int)percentageWithMorePointsThisYear
            };
        }

        // TODO - Can probably remove all this
        #region Clubs

        // Yearly, calculate by 30 November and will be triggered by a cron job
        public void CalculateLeaveNoOneBehind() 
        {
            // For reaccreditations, we use all from 1 Dec the previous year
            var startDate = new DateTime(DateTime.Now.Year - 1, 11, 1);

            // Get all active clubs with a league
            var allClubs = _clubRepo.GetAll()
                .Where(x => x.IsActive && x.LeagueId.HasValue)
                .Include(x => x.ClubMembers.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .Include(x => x.ClubLeaders.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .Include(x => x.ClubSupport.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .ToList();

            var purpleClubActivity = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.leave_no_one_behind && x.Type == Constants.ClubSettings.name_purple).FirstOrDefault();
            var nonPurpleClubActivity = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.leave_no_one_behind && x.Type != Constants.ClubSettings.name_purple).FirstOrDefault();

            foreach (var club in allClubs)
            {
                var isClubPurple = club.League.LeagueType.Name == Constants.ClubSettings.name_purple;

                var practitioners = new List<Guid>();

                if (club.ClubMembers != null)
                {
                    practitioners.AddRange(club.ClubMembers.Select(x => x.Practitioner.UserId.Value).Distinct().ToList());
                }
                if (club.ClubLeaders != null)
                {
                    practitioners.AddRange(club.ClubLeaders.Select(x => x.Practitioner.UserId.Value).Distinct().ToList());
                }
                if (club.ClubSupport != null)
                {
                    practitioners.AddRange(club.ClubSupport.Select(x => x.Practitioner.UserId.Value).Distinct().ToList());
                }

                // ensure we don't have any duplicate user Ids
                practitioners = practitioners.Distinct().ToList();

                if (!practitioners.Any())
                {
                    continue;
                }

                var greenRatings = 0;

                if (isClubPurple) 
                {
                    foreach (var practitionerUserId in practitioners)
                    {
                        var latestVisit = _visitManager.GetReAccreditationVisitsForPractitioner(practitionerUserId.ToString())
                            .Where(x => x.ActualVisitDate.HasValue && x.ActualVisitDate > startDate)
                            .OrderByDescending(x => x.ActualVisitDate).FirstOrDefault();

                        if (latestVisit != null 
                            && latestVisit.PQARating != null
                            && latestVisit.PQARating.OverallRatingColor == MetricsColorEnum.Success.ToString())
                        {
                            greenRatings++;
                        }
                    }
                } 
                else 
                {
                    foreach (var practitionerUserId in practitioners)
                    {
                        var latestVisit = _visitManager.GetPQAVisitsForPractitioner(practitionerUserId.ToString())
                            .OrderByDescending(x => x.ActualVisitDate).FirstOrDefault();

                        if (latestVisit != null 
                            && latestVisit.PQARating != null
                            && latestVisit.PQARating.OverallRatingColor == MetricsColorEnum.Success.ToString())
                        {
                            greenRatings++;
                        }
                    }
                }

                var finalRating = (greenRatings * 100) / practitioners.Count();

                var activityId = isClubPurple ? purpleClubActivity.Id : nonPurpleClubActivity.Id;
                var clubPoints = _clubPointsRepo.GetAll().Where(x => 
                        x.ClubId == club.Id 
                        && x.ClubPointsLibraryId == activityId
                        && x.Year == DateTime.Now.Year)
                    .FirstOrDefault();

                if (clubPoints != null)
                {
                    clubPoints.Points = finalRating;
                    clubPoints.PointsYTD = finalRating;
                    clubPoints.UpdatedDate = DateTime.Now;
                    clubPoints.UpdatedBy = _uId.ToString();

                    _clubPointsRepo.Update(clubPoints);
                } 
                else
                {
                    _clubPointsRepo.Insert(new ClubPoints()
                    {
                        Id = Guid.NewGuid(),
                        ClubId = club.Id,
                        UserId = _uId,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _uId.ToString(),
                        IsActive = true,
                        ClubPointsLibraryId = activityId,
                        Month = 11,
                        Year = DateTime.Now.Year,
                        Points = finalRating,
                        PointsYTD = finalRating
                    });
                }
            }
        }

        public bool CalculateHostFamilyDays(Guid clubId, string userId, DateTime today)
        {
            var club = _clubRepo.GetById(clubId);
            ClubPointsLibrary clubPointsLibrary;

            if (club?.League.LeagueType.Name == Constants.ClubSettings.name_purple)
            {
                clubPointsLibrary = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.host_family_days && x.Type == Constants.ClubSettings.name_purple).FirstOrDefault();
            }
            else
            {
                clubPointsLibrary = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.host_family_days && x.Type != Constants.ClubSettings.name_purple).FirstOrDefault();
            }

            if (clubPointsLibrary == null) { return false; }

            var totalClubPoints = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId && x.Year == today.Year && x.ClubPointsLibraryId == clubPointsLibrary.Id).Select(x => x.Points).Sum();

            var pointsEarned = clubPointsLibrary.Points;
            var newTotal = totalClubPoints + clubPointsLibrary.Points;

            if (newTotal > clubPointsLibrary.MaxPointsYearly)
            {
                newTotal = clubPointsLibrary.MaxPointsYearly;
                pointsEarned = clubPointsLibrary.MaxPointsYearly - totalClubPoints;
            }

            _clubPointsRepo.Insert(new ClubPoints()
            {
                Id = Guid.NewGuid(),
                ClubId = clubId,
                UserId = Guid.Parse(userId),
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _uId.ToString(),
                IsActive = true,
                ClubPointsLibraryId = clubPointsLibrary.Id,
                Month = today.Month,
                Year = today.Year,
                Points = pointsEarned,
                PointsYTD = newTotal
            });

            return true;
        }

        public void CalculateCompleteChildProgressReports()
        {
            var childProgressActivity = _clubPointsLibraryRepo.GetAll()
                .Where(x => x.Activity == Constants.ClubSettings.child_progress_reports 
                    && x.Type == Constants.ClubSettings.name_purple
                    && x.SubActivity == Constants.ClubSettings.sub_progress_tracking)
                .FirstOrDefault();

            // Twice a year: by 31 July and 30 November
            var startDate = DateTime.Now.Month <= 7 ? DateTime.Now.GetStartOfYear() : DateTime.Now.GetStartOfYear().AddMonths(7);
            var scoringMonth = DateTime.Now.Month <= 7 ? 7 : 11;

            // Get all active purple clubs
            var purpleClubs = _clubRepo.GetAll()
                .Where(x => x.IsActive && x.League.LeagueType.Name == Constants.ClubSettings.name_purple)
                .Include(x => x.ClubMembers.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .Include(x => x.ClubLeaders.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .Include(x => x.ClubSupport.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .ToList();

            foreach (var club in purpleClubs)
            {
                var totalComplete = 0;

                var practitionerInClub = club.ClubLeaders.Select(x => x.Practitioner).ToList();
                practitionerInClub.AddRange(club.ClubSupport.Select(x => x.Practitioner));
                practitionerInClub.AddRange(club.ClubMembers.Select(x => x.Practitioner));

                practitionerInClub = practitionerInClub.Distinct().ToList();

                if (!practitionerInClub.Any())
                {
                    continue;
                }
                
                foreach (var practitioner in practitionerInClub)
                {
                    var totalChildren = _childRepo.GetAll().Where(x => x.Hierarchy.StartsWith(practitioner.Hierarchy) && x.IsActive).Count();
                    var totalReports = _childProgressReportRepo.GetAll().Where(x =>
                            x.Hierarchy == practitioner.Hierarchy
                            && x.ReportDate >= startDate.Date
                            && x.ReportDate <= DateTime.Now.Date
                            && x.IsActive
                            && !x.ReportContent.Contains(Constants.ClubSettings.first_reporting_period))
                        .Select(x => x.ChildId)
                        .Distinct()
                        .Count();

                    if (totalChildren != 0 && totalChildren == totalReports)
                    {
                        totalComplete++;
                        //send notification
                        List<TagsReplacements> replacements = new List<TagsReplacements>();
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "MeetingDate",
                            ReplacementValue = startDate.ToShortDateString()
                        });
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "ClubId",
                            ReplacementValue = club.Id.ToString()
                        });
                        _notificationService.SendNotificationAsync(null, TemplateTypeConstants.RecordCaregiverMeeting, DateTime.Now.Date, practitioner.User, "", MessageStatusConstants.Red, replacements, DateTime.Now.AddDays(14), false, true);
                    }
                }

                var pointsScored = Math.Round(childProgressActivity.Points * ((double)totalComplete / practitionerInClub.Count()));

                var currentPoints = _clubPointsRepo.GetAll().Where(x =>
                        x.ClubId == club.Id
                        && x.ClubPointsLibraryId == childProgressActivity.Id
                        && x.Month == scoringMonth
                        && x.Year == DateTime.Now.Year)
                    .FirstOrDefault();

                var prevScore = 0;
                if (scoringMonth > 7)
                {
                    // Get previous score for YTD total
                    prevScore = _clubPointsRepo.GetAll().Where(x =>
                        x.ClubId == club.Id
                        && x.ClubPointsLibraryId == childProgressActivity.Id
                        && x.Month == 7
                        && x.Year == DateTime.Now.Year).FirstOrDefault()?.Points ?? 0;
                }

                if (currentPoints != null)
                {
                    currentPoints.Points = (int)pointsScored;
                    currentPoints.PointsYTD = prevScore + (int)pointsScored;
                    currentPoints.UpdatedDate = DateTime.Now;
                    currentPoints.UpdatedBy = _uId.ToString();

                    _clubPointsRepo.Update(currentPoints);
                }
                else
                {
                    _clubPointsRepo.Insert(new ClubPoints()
                    {
                        Id = Guid.NewGuid(),
                        ClubId = club.Id,
                        UserId = _uId,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _uId.ToString(),
                        IsActive = true,
                        ClubPointsLibraryId = childProgressActivity.Id,
                        Month = scoringMonth,
                        Year = DateTime.Now.Year,
                        Points = (int)pointsScored,
                        PointsYTD = prevScore + (int)pointsScored
                    });
                }
            }
        }

        public void CalculateCompleteCaregiverReportBack()
        {
            var caregiverMeetingActivity = _clubPointsLibraryRepo.GetAll()
                .Where(x => x.Activity == Constants.ClubSettings.child_progress_reports 
                    && x.Type == Constants.ClubSettings.name_purple
                    && x.SubActivity == Constants.ClubSettings.sub_caregiver_meeting)
                .FirstOrDefault();
            
            // Twice a year: by 31 July and 30 November
            var startDate = DateTime.Now.Month <= 7 ? DateTime.Now.GetStartOfYear() : DateTime.Now.GetStartOfYear().AddMonths(7);
            var reportsMonth = DateTime.Now.Month < 8
                ? 7
                : 11;

            // Get all active purple clubs
            var purpleClubs = _clubRepo.GetAll()
                .Where(x => x.IsActive && x.League.LeagueType.Name == Constants.ClubSettings.name_purple)
                .Include(x => x.ClubMembers.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .Include(x => x.ClubLeaders.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .Include(x => x.ClubSupport.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .ToList();

            foreach (var club in purpleClubs)
            {
                // Get report back meeting for period
                var lastCaregiverMeetingForClub = _clubMeetingRepo.GetAll()
                   .Where(x => x.MeetingType.Name == Constants.ClubSettings.meeting_type_caregiver_meeting && x.ClubId == club.Id)
                   .OrderByDescending(x => x.MeetingDate)
                   .Include(x => x.ClubMeetingRegister)
                   .FirstOrDefault();

                var pointsEarned = 0;
                // Check if we have added the meeting yet
                if (lastCaregiverMeetingForClub != null
                    && lastCaregiverMeetingForClub.MeetingDate.HasValue && lastCaregiverMeetingForClub.MeetingDate.Value.Year == DateTime.Now.Year
                    && lastCaregiverMeetingForClub.MeetingDate.HasValue && lastCaregiverMeetingForClub.MeetingDate.Value.Month == reportsMonth
                    && lastCaregiverMeetingForClub.ClubMeetingRegister.Any())
                {
                    // Check attendance
                    var attended = lastCaregiverMeetingForClub.ClubMeetingRegister.Where(x => x.Attended).Count();

                    pointsEarned = (int)Math.Round(caregiverMeetingActivity.Points * (attended / (double)lastCaregiverMeetingForClub.ClubMeetingRegister.Count()));
                }

                var clubPoints = _clubPointsRepo.GetAll().Where(x =>
                        x.ClubId == club.Id
                        && x.ClubPointsLibraryId == caregiverMeetingActivity.Id
                        && x.Month == reportsMonth
                        && x.Year == DateTime.Now.Year)
                    .FirstOrDefault();

                var prevScore = 0;
                if (reportsMonth > 7)
                {
                    // Get previous score for YTD total
                    prevScore = _clubPointsRepo.GetAll().Where(x =>
                        x.ClubId == club.Id
                        && x.ClubPointsLibraryId == caregiverMeetingActivity.Id
                        && x.Month == 7
                        && x.Year == DateTime.Now.Year).FirstOrDefault()?.Points ?? 0;
                }

                if (clubPoints != null)
                {
                    clubPoints.Points = pointsEarned;
                    clubPoints.PointsYTD = prevScore + pointsEarned;
                    clubPoints.UpdatedDate = DateTime.Now;
                    clubPoints.UpdatedBy = _uId.ToString();

                    _clubPointsRepo.Update(clubPoints);
                }
                else
                {
                    _clubPointsRepo.Insert(new ClubPoints()
                    {
                        Id = Guid.NewGuid(),
                        ClubId = club.Id,
                        UserId = _uId,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _uId.ToString(),
                        IsActive = true,
                        ClubPointsLibraryId = caregiverMeetingActivity.Id,
                        Month = reportsMonth,
                        Year = DateTime.Now.Year,
                        Points = pointsEarned,
                        PointsYTD = prevScore + pointsEarned
                    });
                }
            }
        }

        public bool CalculateMeetRegularly(Guid clubId, Guid clubMeetingId)
        {
            // Can only be scored April - November
            if (DateTime.Now.Month < 4 || DateTime.Now.Month == 12)
            {
                return true;
            }

            ClubMeeting clubMeeting = _clubMeetingRepo.GetAll()
                                        .Where(x => x.Id == clubMeetingId && x.IsActive == true)
                                        .Include(x => x.ClubMeetingRegister.Where(x => x.IsActive))
                                        .FirstOrDefault();

            Club club = _clubRepo.GetAll()
                .Where(x => x.Id == clubId)
                .Include(x => x.ClubPoints.Where(x => x.Year == clubMeeting.MeetingDate.Value.Year))
                .FirstOrDefault();

            ClubPointsLibrary clubPointsLibrary = new ClubPointsLibrary();
            if (club?.League.LeagueType.Name == Constants.ClubSettings.name_purple)
            {
                clubPointsLibrary = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.meet_regularly && x.Type == Constants.ClubSettings.name_purple).FirstOrDefault();
            }
            else
            {
                clubPointsLibrary = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.meet_regularly && x.Type != Constants.ClubSettings.name_purple).FirstOrDefault();
            }

            int totalAbsent = 0;
            int totalAttended = 0;
            double meetingAttendancePerc = 0.0;
            int totalYearPoints = 0;
           
            totalAttended = clubMeeting.ClubMeetingRegister.Where(x => x.Attended && x.IsActive).Select(x => x.PractitionerId.ToString()).Count();
            totalAbsent = clubMeeting.ClubMeetingRegister.Where(x => x.Attended == false && x.IsActive).Select(x => x.PractitionerId.ToString()).Count();

            meetingAttendancePerc = Math.Round((totalAttended + totalAbsent) == 0 ? 0 : ((double)totalAttended / (double)(totalAttended + totalAbsent)) * 100, 0);

            // check to see if we have a points record for the meeting
            ClubPoints monthPoints = club.ClubPoints.Where(x => x.ClubId == clubId && 
                                                    x.Year == clubMeeting.MeetingDate.Value.Year && 
                                                    x.Month == clubMeeting.MeetingDate.Value.Month && 
                                                    x.ClubPointsLibraryId == clubPointsLibrary.Id && 
                                                    x.IsActive == true).FirstOrDefault();

            if (monthPoints == null)
            {
                totalYearPoints = club.ClubPoints.Where(x => x.ClubId == clubId &&
                                                            x.Year == clubMeeting.MeetingDate.Value.Year &&
                                                            x.ClubPointsLibraryId == clubPointsLibrary.Id &&
                                                            x.IsActive == true).Select(x => x.Points).Sum();

                if (meetingAttendancePerc + totalYearPoints > clubPointsLibrary.MaxPointsYearly)
                {
                    meetingAttendancePerc = clubPointsLibrary.MaxPointsYearly - totalYearPoints;
                    totalYearPoints = clubPointsLibrary.MaxPointsYearly;
                } 
                else
                {
                    totalYearPoints = totalYearPoints + (int)meetingAttendancePerc;
                }

                _clubPointsRepo.Insert(new ClubPoints()
                {
                    Id = Guid.NewGuid(),
                    ClubId = clubId,
                    UserId = _uId,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = _uId.ToString(),
                    IsActive = true,
                    ClubPointsLibraryId = clubPointsLibrary.Id,
                    Month = clubMeeting.MeetingDate.Value.Month,
                    Year = clubMeeting.MeetingDate.Value.Year,
                    Points = (int)meetingAttendancePerc,
                    PointsYTD = totalYearPoints
                });
            }
            return true;
        }
        
        public bool CalculateBeCreative(Guid clubId, string userId, DateTime today)
        {
            Club club = _clubRepo.GetById(clubId);
            ClubPointsLibrary clubPointsLibrary = new ClubPointsLibrary();
            if (club?.League.LeagueType.Name == Constants.ClubSettings.name_purple)
            {
                clubPointsLibrary = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.be_creative && x.Type == Constants.ClubSettings.name_purple).FirstOrDefault();
            }
            else
            {
                clubPointsLibrary = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.be_creative && x.Type != Constants.ClubSettings.name_purple).FirstOrDefault();
            }

            int totalClubPoints = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId && x.Year == today.Year && x.ClubPointsLibraryId == clubPointsLibrary.Id).Select(x => x.Points).Sum();
            if (clubPointsLibrary.MaxPointsYearly >= (clubPointsLibrary.MaxPointsYearly - clubPointsLibrary.Points))
            {
                totalClubPoints += clubPointsLibrary.Points;
                _clubPointsRepo.Insert(new ClubPoints()
                {
                    Id = Guid.NewGuid(),
                    ClubId = clubId,
                    UserId = Guid.Parse(userId),
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = _uId.ToString(),
                    IsActive = true,
                    ClubPointsLibraryId = clubPointsLibrary.Id,
                    Month = today.Month,
                    Year = today.Year,
                    Points = clubPointsLibrary.Points,
                    PointsYTD = totalClubPoints
                });
            }
            return true;
        }

        public void CalculateClubChildAttendance()
        {
            var startDate = DateTime.Now.GetStartOfPreviousMonth();
            var endDate = DateTime.Now.GetEndOfPreviousMonth();

            var clubAttendanceActivity = _clubPointsLibraryRepo.GetAll()
                .Where(x => x.Activity == Constants.ClubSettings.capture_child_attendance 
                    && x.Type == Constants.ClubSettings.name_purple)
                .FirstOrDefault();

            var userAttendanceActivity = GetPointsLibraryForActivity(
                    Constants.PointsEngineSettings.child_data_collection, 
                    Constants.PointsEngineSettings.child_data_collection_ac3)
                .FirstOrDefault();

            // Get all active purple clubs
            var allClubs = _clubRepo.GetAll()
                .Where(x => x.IsActive && x.LeagueId.HasValue && x.League.LeagueType.Name == Constants.ClubSettings.name_purple)
                .Include(x => x.ClubPoints.Where(x => x.Year == DateTime.Now.Year && x.ClubPointsLibraryId == clubAttendanceActivity.Id))
                .Include(x => x.ClubMembers.Where(x => x.IsActive))
                .Include(x => x.ClubLeaders.Where(x => x.IsActive && x.DateAccepted.HasValue))
                .Include(x => x.ClubSupport.Where(x => x.IsActive))
                .ToList();

            foreach (var item in allClubs)
            {                
                var allPractitioners = new List<Practitioner>();
                allPractitioners.AddRange(item.ClubMembers.Select(x => x.Practitioner));
                allPractitioners.AddRange(item.ClubLeaders.Select(x => x.Practitioner));
                allPractitioners.AddRange(item.ClubSupport.Select(x => x.Practitioner));
                allPractitioners = allPractitioners.Distinct().ToList();

                if (!allPractitioners.Any())
                {
                    continue;
                }

                var principalUserIds = allPractitioners
                    .Where(x => (x.IsPrincipal.HasValue && x.IsPrincipal.Value) || (x.IsFundaAppAdmin.HasValue && x.IsFundaAppAdmin.Value))
                    .Select(x => x.UserId).ToList();

                var nonPrincipalUserIds = allPractitioners
                    .Where(x => (!x.IsPrincipal.HasValue || !x.IsPrincipal.Value) && (!x.IsFundaAppAdmin.HasValue || !x.IsFundaAppAdmin.Value))
                    .Select(x => x.UserId).ToList();

                var totalPrincipalsWithMaxPoints = _pointsUserSummaryRepo.GetAll()
                    .Where(x => principalUserIds.Contains(x.UserId) 
                        && x.PointsLibraryId == userAttendanceActivity.Id 
                        && x.Month == startDate.Month 
                        && x.Year == startDate.Year
                        && x.PointsTotal == userAttendanceActivity.MaxPointsPrincipalMonthly)
                    .Select(x => x.UserId).Distinct().Count();

                var totalNonPrincipalsWithMaxPoints = _pointsUserSummaryRepo.GetAll()
                    .Where(x => nonPrincipalUserIds.Contains(x.UserId)
                        && x.PointsLibraryId == userAttendanceActivity.Id
                        && x.Month == startDate.Month
                        && x.Year == startDate.Year
                        && x.PointsTotal == userAttendanceActivity.MaxPointsNonPrincipalMonthly)
                    .Select(x => x.UserId).Distinct().Count();

                var pointsScored = (int) Math.Round(clubAttendanceActivity.Points * (
                    (totalPrincipalsWithMaxPoints + totalNonPrincipalsWithMaxPoints) / (double)allPractitioners.Count));

                _clubPointsRepo.Insert(new ClubPoints()
                {
                    Id = Guid.NewGuid(),
                    ClubId = item.Id,
                    UserId = _uId,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = _uId.ToString(),
                    IsActive = true,
                    ClubPointsLibraryId = clubAttendanceActivity.Id,
                    Month = startDate.Month,
                    Year = startDate.Year,
                    Points = pointsScored,
                    PointsYTD = item.ClubPoints.Select(x => x.Points).Sum() + pointsScored
                });
            }
        }

        #endregion
    
    
        public ClinicPointsModel GetPointsDetailsForClinic(Guid clinicId)
        {
            // Get clinic with HCWs
            var clinic = _clinicRepo.GetAll().Where(x => x.Id == clinicId).FirstOrDefault();

            if (clinic == null)
            {
                return null;
            }

            // Get active league
            var league = clinic.Leagues.FirstOrDefault(x => x.IsActive);
            if (league == null)
            {
                return null;
            }

            var healthCareWorkerUserIds = clinic.HealthCareWorkers.Select(x => x.UserId).ToList();

            // Get all points for all users for the current quarter
            var userPoints = _pointsUserSummaryRepo.GetAll().Where(x
                => healthCareWorkerUserIds.Contains(x.UserId)
                && x.DateScored >= DateTimeHelper.GetCurrentGrowGreatQuarterStart()
                && x.DateScored <= DateTimeHelper.GetCurrentGrowGreatQuarterEnd()).ToList();

            // Get clinic points
            var clinicPoints = _pointsClinicSummaryRepo.GetAll().Where(x => 
                x.ClinicId == clinicId
                && x.DateScored >= DateTimeHelper.GetCurrentGrowGreatQuarterStart()
                && x.DateScored <= DateTimeHelper.GetCurrentGrowGreatQuarterEnd()).ToList();

            var totalPoints = userPoints.Sum(x => x.PointsTotal) + clinicPoints.Sum(x => x.PointsTotal);

            var leagueWithRankings = GetLeagueWithClinicRankings(league.LeagueId);
            var clinicRanking = leagueWithRankings.Clinics.First(x => x.ClinicId == clinicId);

            var allCategories = _pointsCategoryRepo.GetAll().ToList();

            // Note: for clinics, we group the activities by category before returning the total
            var pointCategoryModels = new List<PointsCategoryModel>();
            foreach (var category in allCategories)
            {
                var categoryPoints = 
                    userPoints.Where(x => x.PointsActivity.PointsCategoryId == category.Id).Sum(x => x.PointsTotal)
                    + clinicPoints.Where(x => x.PointsCategoryId == category.Id).Sum(x => x.PointsTotal);

                pointCategoryModels.Add(new PointsCategoryModel()
                {
                    PointsCategoryId = category.Id,
                    CategoryName = category.Name,
                    PointsTotal = categoryPoints,
                });
            }

            return new ClinicPointsModel()
            {
                LeagueRanking = clinicRanking.LeagueRankingForQuarter,
                Points = pointCategoryModels,
                PointsTotal = totalPoints,
                MaxPointsTotal = league.League.LeagueType.MaxPoints,
            };
        }

        public LeagueClinicsModel GetLeagueWithClinicRankings(Guid leagueId, DateTime? quarterStart = null, DateTime? quarterEnd = null)
        {
            var league = _leagueRepo.GetAll()
                .Where(x => x.Id == leagueId)
                .Include(x => x.LeagueType)
                .FirstOrDefault();

            var clinicsWithUsers = _clinicRepo.GetAll()
                .Where(x => x.Leagues.Any(y => y.LeagueId == league.Id && y.IsActive))
                .Select(x => new { ClinicId = x.Id, ClinicName = x.Name, UserIds = x.HealthCareWorkers.Select(x => x.UserId) })
                .ToList();

            var allUserIds = clinicsWithUsers
                .SelectMany(x => x.UserIds)
                .Where(x => x.HasValue)
                .Select(x => x.Value)
                .ToList();

            var allUserPoints = _pointsUserSummaryRepo.GetAll().Where(x
                => x.UserId.HasValue
                && allUserIds.Contains(x.UserId.Value)
                && x.DateScored >= league.StartDate
                && x.DateScored <= league.EndDate)
                .ToList();

            // Get clinic points
            var allClinicPoints = _pointsClinicSummaryRepo.GetAll().Where(x =>
                clinicsWithUsers.Select(x => x.ClinicId).Contains(x.ClinicId)
                && x.DateScored >= league.StartDate
                && x.DateScored <= league.EndDate).ToList();

            if (!quarterStart.HasValue)
            {
                quarterStart = DateTimeHelper.GetCurrentGrowGreatQuarterStart();
            }

            if(!quarterEnd.HasValue)
            {
                quarterEnd = DateTimeHelper.GetCurrentGrowGreatQuarterEnd();
            }

            var clinicList = new List<LeagueClinicPointsModel>();
            foreach (var clinic in clinicsWithUsers)
            {
                var pointsTotalForYear = 
                    allUserPoints.Where(x => clinic.UserIds.Contains(x.UserId)).Sum(x => x.PointsTotal)
                    + allClinicPoints.Where(x => x.ClinicId == clinic.ClinicId).Sum(x => x.PointsTotal);

                var pointsTotalForQuarter = allUserPoints.Where(x => clinic.UserIds.Contains(x.UserId) && x.DateScored >= quarterStart.Value && x.DateScored <= quarterEnd.Value).Sum(x => x.PointsTotal)
                    + allClinicPoints.Where(x => clinic.ClinicId == x.ClinicId && x.DateScored >= quarterStart.Value && x.DateScored <= quarterEnd.Value).Sum(x => x.PointsTotal);

                clinicList.Add(new LeagueClinicPointsModel()
                {
                    ClinicId = clinic.ClinicId,
                    ClinicName = clinic.ClinicName,
                    PointsTotalForYear = pointsTotalForYear,
                    PointsTotalForQuarter = pointsTotalForQuarter,
                });
            }

            // Set league ranks for year, keeping highest rank for all that have equal points
            clinicList = clinicList.OrderByDescending(x => x.PointsTotalForYear).ToList();
            clinicList[0].LeagueRankingForYear = 1;
            for (int i = 1; i < clinicList.Count; i++)
            {
                if (clinicList[i].PointsTotalForYear == clinicList[i - 1].PointsTotalForYear)
                {
                    clinicList[i].LeagueRankingForYear = clinicList[i - 1].LeagueRankingForYear;
                }
                else
                {
                    clinicList[i].LeagueRankingForYear = i + 1;
                }
            }

            // Set league ranks for year, keeping highest rank for all that have equal points
            clinicList = clinicList.OrderByDescending(x => x.PointsTotalForQuarter).ToList();
            clinicList[0].LeagueRankingForQuarter = 1;
            for (int i = 1; i < clinicList.Count; i++)
            {
                if (clinicList[i].PointsTotalForQuarter == clinicList[i - 1].PointsTotalForQuarter)
                {
                    clinicList[i].LeagueRankingForQuarter = clinicList[i - 1].LeagueRankingForQuarter;
                }
                else
                {
                    clinicList[i].LeagueRankingForQuarter = i + 1;
                }
            }

            return new LeagueClinicsModel()
            {
                Id = league.Id,
                StartDate = league.StartDate.HasValue ? league.StartDate.Value : DateTime.Now,
                EndDate = league.EndDate.HasValue ? league.EndDate.Value : DateTime.Now,
                LeagueTypeId = league.LeagueTypeId,
                LeagueTypeName = league.LeagueType.Name,
                Name = league.Name,
                Clinics = clinicList
            };
        }

        public List<PointsPointsTodoItemModel> GetHealthCareWorkerPointsTodoItems(Guid healthCareWorkerId)
        {
            var pointsTodoItems = new List<PointsPointsTodoItemModel>();

            var monthStart = DateTime.Now.GetStartOfMonth();
            var monthEnd = DateTime.Now.GetEndOfMonth();

            #region Complete due visits

            var dueVisits = _visitRepo.GetAll().Where(x => x.Attended == false                    
                    && ((
                            // Any incomplete visits to a mother due before the end of the month (including past visits)
                            x.Mother.IsActive == true
                            && x.Mother.HealthCareWorker.Id == healthCareWorkerId
                            && x.DueDate <= monthEnd
                        ) || (
                            // Any incomplete infant visits due within the current month
                            x.Infant.IsActive
                            && x.Infant.Caregiver.HealthCareWorkerId.HasValue
                            && x.Infant.Caregiver.HealthCareWorkerId.Value == healthCareWorkerId
                            && x.DueDate >= monthStart
                            && x.DueDate <= monthEnd)))
                .Select(x => new { x.Id, IsInfantVisit = x.InfantId.HasValue })
                .ToList();

            if(dueVisits.Any())
            {
                var visitsCompletedThisMonth = _visitRepo.GetAll().Where(x => x.Attended == true
                    && x.DueDate >= monthStart
                    && x.DueDate <= monthEnd
                    && (
                        (
                            x.Mother.IsActive == true
                            && x.Mother.HealthCareWorker.Id == healthCareWorkerId
                        )
                        || (
                            x.Infant.IsActive
                            && x.Infant.Caregiver.HealthCareWorkerId.HasValue
                            && x.Infant.Caregiver.HealthCareWorkerId.Value == healthCareWorkerId)))
                .Count();

                var dueInfantVisits = dueVisits.Where(x => x.IsInfantVisit).Count();
                var dueMotherVisits = dueVisits.Where(x => !x.IsInfantVisit).Count();

                var count = dueInfantVisits + dueMotherVisits;

                pointsTodoItems.Add(new PointsPointsTodoItemModel
                {
                    Message = $"Complete {count} visits due this month",
                    Points = (dueInfantVisits > 0 ? 260 : 0) + (dueMotherVisits > 0 ? 200 : 0),
                    Count = count,
                    PercentageComplete = (int)((float)visitsCompletedThisMonth / (count + visitsCompletedThisMonth) * 100),
                });
            }

            #endregion

            #region Complete referrals

            var motherReferrals = _visitDataStatusRepo.GetAll()
                .Where(x =>
                    x.VisitData.Visit.Mother.HealthCareWorkerId == healthCareWorkerId
                    && (x.VisitData.VisitSection == GGSettings.MaternalDistressScreening
                        || x.VisitData.VisitSection == GGSettings.MotherNutritionMUACMeasurement)
                    && x.Type == GGSettings.visit_data_client_referral
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd)
                .Select(x => new { x.Id, x.VisitData.VisitSection, x.IsCompleted })
                .Distinct()
                .ToList();

            var infantReferrals = _visitDataStatusRepo.GetAll()
                .Where(x =>
                    x.VisitData.Visit.Infant.Caregiver.HealthCareWorkerId.HasValue 
                    && x.VisitData.Visit.Infant.Caregiver.HealthCareWorkerId.Value == healthCareWorkerId
                    && (x.VisitData.Question == GGSettings.QuestionLength
                        || x.VisitData.Question == GGSettings.QuestionWeight
                        || x.VisitData.Question == GGSettings.QuestionMUAC)
                    && (x.Section == GGSettings.refer_to_clinic || x.Section == GGSettings.refer_to_clinic_urgently)
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd)
                .Select(x => new { x.Id, x.VisitData.Question, x.IsCompleted })
                .Distinct()
                .ToList();

            var missedReferrals = motherReferrals.Count(x => !x.IsCompleted) + infantReferrals.Count(x => !x.IsCompleted);
            if (missedReferrals > 0)
            {
                var motherMissedReferralTypes = motherReferrals.Select(x => x.VisitSection).Distinct().Count();
                var infantMissedReferralTypes = infantReferrals.Select(x => x.Question).Distinct().Count();

                pointsTodoItems.Add(new PointsPointsTodoItemModel
                {
                    Message = $"Make {missedReferrals} referrals",
                    Points = (motherMissedReferralTypes * 20) + (infantMissedReferralTypes * 20),
                    Count = missedReferrals,
                    PercentageComplete = (int)((float)missedReferrals / (infantReferrals.Count() + motherReferrals.Count()) * 100),
                });
            }

            #endregion

            #region Open mother folder

            var mothers = _motherRepo.GetAll()
                .Where(x => x.HealthCareWorker.Id == healthCareWorkerId
                    && x.IsActive == true
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd
                    && x.ExpectedDateOfDelivery != null)
                .Count();

            if (mothers < 2)
            {
                var count = 2 - mothers;
                pointsTodoItems.Add(new PointsPointsTodoItemModel
                {
                    Message = $"Open {count} pregnant mom folders",
                    Points = 50,
                    Count = count,
                    PercentageComplete = (int)((float)mothers / 2 * 100),
                });
            }


            #endregion

            #region Open infant folder

            var twoYearsAgo = DateTime.Now.AddYears(-2);
            var infants = _infantRepo.GetAll()
                .Where(x => x.Caregiver.HealthCareWorkerId.HasValue
                    && x.Caregiver.HealthCareWorkerId.Value == healthCareWorkerId
                    && x.IsActive == true
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd
                    && x.User.DateOfBirth > twoYearsAgo).Count();

            if (infants < 5)
            {
                var count = 5 - infants;
                pointsTodoItems.Add(new PointsPointsTodoItemModel
                {
                    Message = $"Open {count} child folders",
                    Points = 100,
                    Count = count,
                    PercentageComplete = (int)((float)infants / 5 * 100),
                });
            }

            #endregion

            return pointsTodoItems;
        }

        public LeagueClinicsModel GetClinicRankingsForOpeningFolders(Guid leagueId, Guid pointsActivityId, Guid pointsCategoryId)
        {
            var league = _leagueRepo.GetAll()
                .Where(x => x.Id == leagueId)
                .Include(x => x.LeagueType)
                .FirstOrDefault();

            var clinicsWithUsers = _clinicRepo.GetAll()
                .Where(x => x.Leagues.Any(y => y.LeagueId == league.Id && y.IsActive))
                .Select(x => new { ClinicId = x.Id, ClinicName = x.Name, UserIds = x.HealthCareWorkers.Select(x => x.UserId) })
                .ToList();

            var allUserIds = clinicsWithUsers
                .SelectMany(x => x.UserIds)
                .Where(x => x.HasValue)
                .Select(x => x.Value)
                .ToList();

            var allUserPoints = _pointsUserSummaryRepo.GetAll().Where(x
                => x.UserId.HasValue
                && allUserIds.Contains(x.UserId.Value)
                && x.PointsActivityId == pointsActivityId
                && x.DateScored >= league.StartDate
                && x.DateScored <= league.EndDate)
                .ToList();

            // Get clinic points
            var allClinicPoints = _pointsClinicSummaryRepo.GetAll().Where(x =>
                clinicsWithUsers.Select(x => x.ClinicId).Contains(x.ClinicId)
                && x.PointsCategoryId == pointsCategoryId
                && x.DateScored >= league.StartDate
                && x.DateScored <= league.EndDate).ToList();

            var quarterStart = DateTimeHelper.GetCurrentGrowGreatQuarterStart();
            var quarterEnd = DateTimeHelper.GetCurrentGrowGreatQuarterEnd();

            var clinicList = new List<LeagueClinicPointsModel>();
            foreach (var clinic in clinicsWithUsers)
            {
                var pointsTotalForYear =
                    allUserPoints.Where(x => clinic.UserIds.Contains(x.UserId)).Sum(x => x.PointsTotal)
                    + allClinicPoints.Where(x => x.ClinicId == clinic.ClinicId).Sum(x => x.PointsTotal);

                var pointsTotalForQuarter = allUserPoints.Where(x => clinic.UserIds.Contains(x.UserId) && x.DateScored >= quarterStart && x.DateScored <= quarterEnd).Sum(x => x.PointsTotal)
                    + allClinicPoints.Where(x => clinic.ClinicId == x.ClinicId && x.DateScored >= quarterStart && x.DateScored <= quarterEnd).Sum(x => x.PointsTotal);

                clinicList.Add(new LeagueClinicPointsModel()
                {
                    ClinicId = clinic.ClinicId,
                    ClinicName = clinic.ClinicName,
                    PointsTotalForYear = pointsTotalForYear,
                    PointsTotalForQuarter = pointsTotalForQuarter,
                });
            }

            // Set league ranks for year, keeping highest rank for all that have equal points
            clinicList = clinicList.OrderByDescending(x => x.PointsTotalForYear).ToList();
            clinicList[0].LeagueRankingForYear = 1;
            for (int i = 1; i < clinicList.Count; i++)
            {
                if (clinicList[i].PointsTotalForYear == clinicList[i - 1].PointsTotalForYear)
                {
                    clinicList[i].LeagueRankingForYear = clinicList[i - 1].LeagueRankingForYear;
                }
                else
                {
                    clinicList[i].LeagueRankingForYear = i + 1;
                }
            }

            // Set league ranks for year, keeping highest rank for all that have equal points
            clinicList = clinicList.OrderByDescending(x => x.PointsTotalForQuarter).ToList();
            clinicList[0].LeagueRankingForQuarter = 1;
            for (int i = 1; i < clinicList.Count; i++)
            {
                if (clinicList[i].PointsTotalForQuarter == clinicList[i - 1].PointsTotalForQuarter)
                {
                    clinicList[i].LeagueRankingForQuarter = clinicList[i - 1].LeagueRankingForQuarter;
                }
                else
                {
                    clinicList[i].LeagueRankingForQuarter = i + 1;
                }
            }

            return new LeagueClinicsModel()
            {
                Id = league.Id,
                StartDate = league.StartDate.HasValue ? league.StartDate.Value : DateTime.Now,
                EndDate = league.EndDate.HasValue ? league.EndDate.Value : DateTime.Now,
                LeagueTypeId = league.LeagueTypeId,
                LeagueTypeName = league.LeagueType.Name,
                Name = league.Name,
                Clinics = clinicList
            };
        }

    }
}
