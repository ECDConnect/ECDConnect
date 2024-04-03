using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using static EcdLink.Api.CoreApi.Constants;

namespace EcdLink.Api.CoreApi.Services.PointsEngine
{
    public class GrowGreatPointsCalculationService : IGrowGreatPointsCalculationsService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private readonly IGenericRepository<Infant, Guid> _infantRepo;
        private readonly IGenericRepository<Mother, Guid> _motherRepo;

        private readonly IGenericRepository<HealthCareWorker, Guid> _healthCareWorkerRepo;

        private readonly IGenericRepository<Visit, Guid> _visitRepo;
        private readonly IGenericRepository<VisitData, Guid> _visitDataRepo;
        private readonly IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;

        private readonly IGenericRepository<PointsActivity, Guid> _pointsActivityRepo;
        private readonly IGenericRepository<PointsClinicSummary, Guid> _pointsClinicSummaryRepo;
        private readonly IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;

        private HierarchyEngine _hierarchyEngine;
        private INotificationService _notificationService;
        private IPointsEngineService _pointsEngineService;
        private IClinicService _clinicService;

        private readonly Guid _uId;


        public GrowGreatPointsCalculationService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            HierarchyEngine hierarchyEngine,
            [Service] INotificationService notificationService,
            [Service] IPointsEngineService pointsEngineService,
            [Service] IClinicService clinicService)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _uId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().GetValueOrDefault());

            _infantRepo = _repositoryFactory.CreateGenericRepository<Infant>(userContext: _uId);
            _motherRepo = _repositoryFactory.CreateGenericRepository<Mother>(userContext: _uId);

            _healthCareWorkerRepo = _repositoryFactory.CreateGenericRepository<HealthCareWorker>(userContext: _uId);

            _visitRepo = _repositoryFactory.CreateGenericRepository<Visit>(userContext: _uId);
            _visitDataRepo = _repositoryFactory.CreateGenericRepository<VisitData>(userContext: _uId);
            _visitDataStatusRepo = _repositoryFactory.CreateGenericRepository<VisitDataStatus>(userContext: _uId);

            _pointsActivityRepo = _repositoryFactory.CreateGenericRepository<PointsActivity>(userContext: _uId);
            _pointsClinicSummaryRepo = _repositoryFactory.CreateGenericRepository<PointsClinicSummary>(userContext: _uId);
            _pointsUserSummaryRepo  = _repositoryFactory.CreateGenericRepository<PointsUserSummary>(userContext: _uId);

            _notificationService = notificationService;
            _pointsEngineService = pointsEngineService;
            _clinicService = clinicService;
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

        public void CalculatePregnantMomClientRegistration(Guid userId)
        {
            var activities =  _pointsActivityRepo.GetAll().Where(x => 
                x.Id == PointsActivityConstants.PregnantMomFolderOpenedActivityId
                || x.Id == PointsActivityConstants.EarlyPregnacyIdentificationActivityId).ToList();

            var newMothersActivity = activities.Single(x => x.Id == PointsActivityConstants.PregnantMomFolderOpenedActivityId);

            var monthStart = DateTime.Now.GetStartOfMonth();
            var monthEnd = DateTime.Now.GetEndOfMonth();
            var mothers = _motherRepo.GetAll()
                .Where(x => x.HealthCareWorker.UserId == userId 
                    && x.IsActive == true
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd 
                    && x.ExpectedDateOfDelivery != null).ToList();

            // Register pregnant mothers
            AddOrUpdatePoints(
                PointsActivityConstants.PregnantMomFolderOpenedActivityId,
                userId,
                mothers.Count >= 2 ? newMothersActivity.Points : 0,
                mothers.Count);

            // Early pregnancy identification
            if (mothers.Count > 0)
            {
                var earlyIdentificationActivity = activities.Single(x => x.Id == PointsActivityConstants.EarlyPregnacyIdentificationActivityId);

                // Mother with more than 20 of 40 weeks remaining from today to expected delivery
                var motherssLessThat20WeeksPregnant = mothers.Where(x => (x.ExpectedDateOfDelivery - DateTime.Now).Value.TotalDays > 120).Count();

                if (motherssLessThat20WeeksPregnant == 0)
                {
                    return;
                }

                // (NOTE: CHW can get either 0, 50, or 200 points should be awarded for this item)

                // Registered 1 - 2 pregnant clients who are less than 20 weeks into pregnancy (50 points)
                // Register 3 or more pregnant clients who are less than 20 weeks into pregnancy (200 points)
                var pointsTotal = 0;
                if (motherssLessThat20WeeksPregnant <= 2)
                {
                    pointsTotal = 50;
                }
                else if (motherssLessThat20WeeksPregnant >= 3)
                {
                    pointsTotal = 200;
                }

                AddOrUpdatePoints(
                   PointsActivityConstants.EarlyPregnacyIdentificationActivityId,
                   userId,
                   pointsTotal,
                   motherssLessThat20WeeksPregnant);
            }
        }

        /// <summary>
        /// Complete the client registration flow for 5 or more children under the age of 2 years old
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void CalculateInfantClientRegistration(Guid userId)
        {
            var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildFoldersOpenedActivityId);

            var monthStart = DateTime.Now.GetStartOfMonth();
            var monthEnd = DateTime.Now.GetEndOfMonth();
            var twoYearsAgo = DateTime.Now.AddYears(-2);

            var newInfantsCount = _infantRepo.GetAll()
                .Where(x => x.Caregiver.HealthCareWorker.User.Id == userId 
                    && x.IsActive == true 
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd
                    && x.User.DateOfBirth > twoYearsAgo).Count();

            AddOrUpdatePoints(
                PointsActivityConstants.ChildFoldersOpenedActivityId,
                userId,
                newInfantsCount >= 5 ? activity.Points : 0,
                newInfantsCount);
        }

        /// <summary>
        /// Calculates points scored for completing referrals that have been recommended after a visit to a pregnant mother
        /// 1. Referral made for maternal distress
        /// 2. Referral made for low MUAC score
        /// </summary>
        /// <param name="userId">User Id of CHW to calculate points for</param>
        public void CalculatePregnantMotherReferralPoints(Guid userId)
        {
            var monthStart = DateTime.Now.GetStartOfMonth();
            var monthEnd = DateTime.Now.GetEndOfMonth();

            //"If one of the following referral boxes were checked for at least 1 client:
            //-Lethabo had thoughts and plans to harm herself or commit suicide
            //-Lethabo was experiencing maternal distress user earns 20 points." - flag
            // "Monthly total (capped at 20) Points added as soon as goal reached within the month"
            var distressReferralCount = _visitDataStatusRepo.GetAll()
                .Where(x => 
                    x.VisitData.Visit.Mother.HealthCareWorker.UserId == userId 
                    && x.VisitData.VisitSection == GGSettings.MaternalDistressScreening 
                    && x.Type == GGSettings.visit_data_client_referral 
                    && x.IsCompleted
                    && x.InsertedDate >= monthStart 
                    && x.InsertedDate <= monthEnd)
                .Select(x => x.Id)
                .Distinct()
                .Count();

            if (distressReferralCount > 0)
            {
                var distressReferralActivity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.PregnantMotherReferralForMaternalDistressActivityId);
                AddOrUpdatePoints(
                    PointsActivityConstants.PregnantMotherReferralForMaternalDistressActivityId,
                    userId,
                    distressReferralActivity.Points,
                    distressReferralCount);
            }


            //"If a referral is made (ie, referral box checked) for MUAC under 22cm for at least 1 client then user earns 20 points.
            // That is, the following referral box is checked within the current month:
            // -May be underweight -MUAC less than 22cm"
            //"Monthly total (capped at 20) Points added as soon as goal reached within the month"
            var malnutritionReferralCount = _visitDataStatusRepo.GetAll()
                .Where(x => 
                    x.VisitData.Visit.Mother.HealthCareWorker.UserId == userId 
                    && x.VisitData.VisitSection == GGSettings.MotherNutritionMUACMeasurement 
                    && x.Type == GGSettings.visit_data_client_referral
                    && x.IsCompleted
                    && x.InsertedDate >= monthStart 
                    && x.InsertedDate <= monthEnd)
                .Select(x => x.Id)
                .Distinct()
                .Count();

            if (malnutritionReferralCount > 0)
            {
                var malnutritionReferralActivity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.PregnantMotherReferralForMaternalMalnutritionActivityId);
                AddOrUpdatePoints(
                    PointsActivityConstants.PregnantMotherReferralForMaternalMalnutritionActivityId,
                    userId,
                    malnutritionReferralActivity.Points,
                    malnutritionReferralCount);
            }
        }

        /// <summary>
        /// Calculates points scored for actions during a visit to an infant or after completing referrals
        /// </summary>
        /// <param name="userId">User Id of CHW to calculate points for</param>
        public void CalculateInfantVisitAndReferralPoints(Guid userId)
        {
            var monthStart = DateTime.Now.GetStartOfMonth();
            var monthEnd = DateTime.Now.GetEndOfMonth();
                                    
            #region Measure childs growth length

            var lengthMeasurementsMade = _visitDataRepo.GetAll()
               .Where(x =>
                   x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId
                   && x.Question == GGSettings.QuestionLength
                   && x.VisitSection != GGSettings.child_road_to_health // Not a growth measurement, just the initial baby measurement
                   && x.InsertedDate >= monthStart
                   && x.InsertedDate <= monthEnd)
               .Select(x => x.VisitId)
               .Distinct()
               .Count();

            if (lengthMeasurementsMade > 0)
            {
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildLengthMeasuredActivityId);
                AddOrUpdatePoints(
                    PointsActivityConstants.ChildLengthMeasuredActivityId,
                    userId,
                    activity.Points * lengthMeasurementsMade,
                    lengthMeasurementsMade);
            }

            #endregion

            #region Measuring childrens' growth length - Action not required or referral made

            var lengthMeasuredNoAction = _visitDataStatusRepo.GetAll()
                .Where(x =>
                    x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId
                    && x.VisitData.Question == GGSettings.QuestionLength
                    && x.VisitData.VisitSection != GGSettings.child_road_to_health // Not a growth measurement, just the initial baby measurement
                    && x.Comment == GGSettings.NormalComment
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd)
                .Select(x => x.VisitData.VisitId)
                .Distinct()
                .Count();

            var lengthMeasuredReferralMade = _visitDataStatusRepo.GetAll()
                .Where(x =>
                    x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId
                    && x.VisitData.Question == GGSettings.QuestionLength
                    && (x.Section == GGSettings.refer_to_clinic || x.Section == GGSettings.refer_to_clinic_urgently)
                    && x.IsCompleted == true
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd)
                .Select(x => x.VisitData.VisitId)
                .Distinct()
                .Count();

            var lengthTotal = lengthMeasuredNoAction + lengthMeasuredReferralMade;
            if (lengthTotal > 0)
            {
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildLengthMeasuredActionTakenOrNotRequiredActivityId);
                AddOrUpdatePoints(
                    PointsActivityConstants.ChildLengthMeasuredActionTakenOrNotRequiredActivityId,
                    userId,
                    activity.Points * lengthTotal,
                    lengthTotal);
            }

            #endregion

            #region Measuring childrens' growth weight

            var weightMeasurementsMade = _visitDataRepo.GetAll()
               .Where(x =>
                   x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId
                   && x.Question == GGSettings.QuestionWeight
                   && x.VisitSection != GGSettings.child_road_to_health // Not a growth measurement, just the initial baby measurement
                   && x.InsertedDate >= monthStart
                   && x.InsertedDate <= monthEnd)
               .Select(x => x.VisitId)
               .Distinct()
               .Count();

            if (weightMeasurementsMade > 0)
            {
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildWeightMeasuredActivityId);
                AddOrUpdatePoints(
                    PointsActivityConstants.ChildWeightMeasuredActivityId,
                    userId,
                    activity.Points * weightMeasurementsMade,
                    weightMeasurementsMade);
            }

            #endregion

            #region Measuring childrens' growth length - Action not required or referral made

            var weightMeasuredNoAction = _visitDataStatusRepo.GetAll()
                .Where(x =>
                    x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId
                    && x.VisitData.Question == GGSettings.QuestionWeight
                    && x.VisitData.VisitSection != GGSettings.child_road_to_health // Not a growth measurement, just the initial baby measurement
                    && x.Comment == GGSettings.NormalComment
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd)
                .Select(x => x.VisitData.VisitId)
                .Distinct()
                .Count();

            var weightMeasuredReferralMade = _visitDataStatusRepo.GetAll()
                .Where(x =>
                    x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId
                    && x.VisitData.Question == GGSettings.QuestionWeight
                    && (x.Section == GGSettings.refer_to_clinic || x.Section == GGSettings.refer_to_clinic_urgently)
                    && x.IsCompleted == true
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd)
                .Select(x => x.VisitData.VisitId)
                .Distinct()
                .Count();

            var weightTotal = weightMeasuredNoAction + weightMeasuredReferralMade;
            if (weightTotal > 0)
            {
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildWeightMeasuredActionTakenOrNotRequiredActivityId);
                AddOrUpdatePoints(
                    PointsActivityConstants.ChildWeightMeasuredActionTakenOrNotRequiredActivityId,
                    userId,
                    activity.Points * weightTotal,
                    weightTotal);
            }

            #endregion

            #region Measuring childrens' MUAC

            var muacMeasurementsMade = _visitDataRepo.GetAll()
               .Where(x =>
                   x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId
                   && x.Question == GGSettings.QuestionMUAC
                   && x.VisitSection != GGSettings.child_road_to_health // Not a growth measurement, just the initial baby measurement
                   && x.InsertedDate >= monthStart
                   && x.InsertedDate <= monthEnd)
               .Select(x => x.VisitId)
               .Distinct()
               .Count();

            if (muacMeasurementsMade > 0)
            {
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildMuacMeasuredActivityId);
                AddOrUpdatePoints(
                    PointsActivityConstants.ChildMuacMeasuredActivityId,
                    userId,
                    activity.Points * muacMeasurementsMade,
                    muacMeasurementsMade);
            }

            #endregion

            #region Measuring childrens' MUAC - Action not required or referral made

            var muacMeasuredNoAction = _visitDataStatusRepo.GetAll()
                .Where(x =>
                    x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId
                    && x.VisitData.Question == GGSettings.QuestionMUAC
                    && x.VisitData.VisitSection != GGSettings.child_road_to_health // Not a growth measurement, just the initial baby measurement
                    && x.Comment == GGSettings.NormalComment
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd)
                .Select(x => x.VisitData.VisitId)
                .Distinct()
                .Count();

            var muacMeasuredReferralMade = _visitDataStatusRepo.GetAll()
                .Where(x =>
                    x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId
                    && x.VisitData.Question == GGSettings.QuestionMUAC
                    && (x.Section == GGSettings.refer_to_clinic || x.Section == GGSettings.refer_to_clinic_urgently)
                    && x.IsCompleted == true
                    && x.InsertedDate >= monthStart
                    && x.InsertedDate <= monthEnd)
                .Select(x => x.VisitData.VisitId)
                .Distinct()
                .Count();

            var muacTotal = muacMeasuredNoAction + muacMeasuredReferralMade;
            if (muacTotal > 0)
            {
                var activity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildMuacMeasuredActionTakenOrNotRequiredActivityId);
                AddOrUpdatePoints(
                    PointsActivityConstants.ChildMuacMeasuredActionTakenOrNotRequiredActivityId,
                    userId,
                    activity.Points * muacTotal,
                    muacTotal);
            }

            #endregion
        }

        /// <summary>
        /// Calculates points for all CHWs for completing required monthly visits for mothers
        /// </summary>
        /// <returns></returns>
        public void CalculatePregnantMotherVisitsCompletedPoints()
        {
            // Calculate for previous month
            var monthStart = DateTime.Now.GetStartOfPreviousMonth();
            var monthEnd = DateTime.Now.GetEndOfPreviousMonth();

            var healthCareWorkerUserIds = _healthCareWorkerRepo.GetAll().Where(x => x.IsActive && x.User.IsActive).Select(x => x.UserId).ToList();

            var maternalDistressVisitsActivity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.MotherMaternalStressVisitsUpToDateActivityId);
            var malnutritionVisitsActivity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.MotherMalnutritionVisitsUpToDateActivityId);
            var alchoholAbuseVisitsActivity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.MotherAlcoholAbuseVisitsUpToDateActivityId);

            foreach (var userId in healthCareWorkerUserIds)
            {
                if (!_motherRepo.GetAll().Any(x => x.HealthCareWorker.UserId == userId && x.IsActive == true))
                {
                    continue;
                }

                var allMonthlyVisits = _visitRepo.GetAll()
                    .Where(x => 
                        x.Mother.HealthCareWorker.UserId == userId
                        && ((x.DueDate.HasValue && x.DueDate >= monthStart && x.DueDate <= monthEnd)
                            || (x.ActualVisitDate.HasValue && x.ActualVisitDate.Value >= monthStart && x.ActualVisitDate.Value <= monthEnd)))
                    .Select(x => new { Id = x.Id, Type = x.VisitType.Name, x.Attended, x.ActualVisitDate, x.DueDate })
                    .ToList();

                var totalVisits = allMonthlyVisits.Where(x => x.Attended && x.ActualVisitDate.HasValue && x.ActualVisitDate.Value >= monthStart && x.ActualVisitDate.Value <= monthEnd).Count();
                var missedVisits = allMonthlyVisits.Where(x => x.Attended == false).Count();

                if (missedVisits == 0)
                {
                    AddOrUpdatePoints(
                        PointsActivityConstants.MotherMaternalStressVisitsUpToDateActivityId,
                        userId.Value,
                        maternalDistressVisitsActivity.Points,
                        totalVisits,
                        monthStart);

                    AddOrUpdatePoints(
                        PointsActivityConstants.MotherAlcoholAbuseVisitsUpToDateActivityId,
                        userId.Value,
                        alchoholAbuseVisitsActivity.Points,
                        totalVisits,
                        monthStart);
                }

                var totalVisit1s = allMonthlyVisits
                    .Where(x => 
                        x.Type == GGSettings.visit1 
                        && x.Attended 
                        && x.ActualVisitDate.HasValue 
                        && x.ActualVisitDate.Value >= monthStart 
                        && x.ActualVisitDate.Value <= monthEnd)
                    .Count();

                var missedVisit1s = allMonthlyVisits.Where(x => x.Type == GGSettings.visit1 && x.Attended == false).Count();

                if (missedVisit1s == 0)
                {
                    AddOrUpdatePoints(
                        PointsActivityConstants.MotherMalnutritionVisitsUpToDateActivityId,
                        userId.Value,
                        malnutritionVisitsActivity.Points,
                        totalVisit1s,
                        monthStart);
                }
            }
        }

        public void CalculateInfantVisitsCompletedPoints()
        {
            // Calculate for previous month
            var monthStart = DateTime.Now.GetStartOfPreviousMonth();
            var monthEnd = DateTime.Now.GetEndOfPreviousMonth();

            var healthCareWorkerUserIds = _healthCareWorkerRepo.GetAll().Where(x => x.IsActive && x.User.IsActive).Select(x => x.UserId).ToList();

            var childrenAllReceivingCSGActivity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildrenAllReceivingCSGActivityId); 
            var childrenDevelopmentScreeningUpToDateActivity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildrenDevelopmentScreeningUpToDateActivityId);
            var childrenVitaminAUpToDateActivity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildrenVitaminAUpToDateActivityId);
            var childrenDewormingUpToDateActivity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildrenDewormingUpToDateActivityId);
            var childrenImmunisationsUpToDateActivity = _pointsActivityRepo.GetAll().Single(x => x.Id == PointsActivityConstants.ChildrenImmunisationsUpToDateActivityId);

            foreach (var userId in healthCareWorkerUserIds)
            {
                var infantIds = _infantRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId == userId && x.IsActive == true).Select(x => x.Id).ToList();

                if (!infantIds.Any())
                {
                    continue;
                }

                #region Children receiving CSG grants

                var childLatestCSGAnswer = _visitRepo.GetAll()
                    // All visits where we check the CSG status
                    .Where(x =>
                        x.InfantId.HasValue
                        && infantIds.Contains(x.InfantId.Value)
                        // Filter out any who don't qualify
                        && !x.VisitData.Any(y => y.Question == GGSettings.QuestionCSGQualification && y.QuestionAnswer == GGSettings.AnswerNo)
                        && x.VisitData.Any(y => y.Question == GGSettings.QuestionReceivingCSG))
                    .Select(x => new { 
                        x.Id, 
                        x.InfantId, 
                        x.ActualVisitDate, 
                        ReceivingGrant = x.VisitData.Any(y => y.Question == GGSettings.QuestionReceivingCSG && y.QuestionAnswer == GGSettings.AnswerYes)
                    })
                    .GroupBy(x => x.InfantId)
                    // Take only the latest visit
                    .Select(x => x.OrderByDescending(x => x.ActualVisitDate).FirstOrDefault())
                    // Select the CSG status
                    .ToList();

                var childrenElligible = childLatestCSGAnswer.Count();
                var allReceivingCSG = !childLatestCSGAnswer.Any(x => x.ReceivingGrant == false);

                if (childrenElligible > 0 && allReceivingCSG)
                {
                    AddOrUpdatePoints(
                        PointsActivityConstants.ChildrenAllReceivingCSGActivityId,
                        userId.Value,
                        childrenAllReceivingCSGActivity.Points,
                        childrenElligible,
                        monthStart);
                }

                #endregion

                // Get last three visits that have already been due
                var visitsByChild = _visitRepo.GetAll()
                    .Where(x =>
                        x.DueDate.HasValue
                        && x.InfantId.HasValue
                        && infantIds.Contains(x.InfantId.Value)
                        && x.VisitType.Name != GGSettings.VisitTypeAdditionalVisit
                        && ((x.DueDate.HasValue && x.DueDate <= monthEnd && x.DueDate >= x.Infant.InsertedDate) // Restrict to visits after they were created, so not penalised for visits that could never be completed
                            || (x.ActualVisitDate.HasValue && x.ActualVisitDate.Value >= monthStart && x.ActualVisitDate.Value <= monthEnd))
                        )
                    .Select(x => new PointsVisit 
                    { 
                        VisitId = x.Id, 
                        InfantId = x.InfantId.Value, 
                        DueDate = x.DueDate.Value, 
                        ActualVisitDate = x.ActualVisitDate,
                        VisitType = x.VisitType.Name, 
                        Attended = x.Attended 
                    })
                    .GroupBy(x => x.InfantId)
                    .Select(x => x.OrderByDescending(y => y.DueDate).ToList())
                    .ToList();

                #region All developmental screenings completed

                var totalDevelopmentVisits = visitsByChild.Where(x => x.Any(y =>
                    y.ActualVisitDate.HasValue && y.ActualVisitDate.Value >= monthStart && y.ActualVisitDate.Value <= monthEnd)).Count();

                var missedDevelopmentVisits = visitsByChild.Any(x => !IsDevelopmentalScreeningUpToDate(x));

                if (!missedDevelopmentVisits)
                {
                    AddOrUpdatePoints(
                        PointsActivityConstants.ChildrenDevelopmentScreeningUpToDateActivityId,
                        userId.Value,
                        childrenDevelopmentScreeningUpToDateActivity.Points,
                        totalDevelopmentVisits,
                        monthStart);
                }

                #endregion

                #region All Vitamin A up to date

                var missedVitaminAVisits = visitsByChild.Any(x => !IsVitaminAScreeningUpToDate(x));

                if (!missedVitaminAVisits)
                {
                    // Check all are up to date
                    var childLatestVitaminAAnswer = _visitRepo.GetAll()
                        // All visits where we check the CSG status
                        .Where(x =>
                            x.InfantId.HasValue
                            && infantIds.Contains(x.InfantId.Value)
                            && x.VisitData.Any(y => y.Question == GGSettings.QuestionVitaminA))
                        // Select the CSG status
                        .Select(x => new
                        {
                            InfantId = x.InfantId.Value,
                            ActualVisitDate = x.ActualVisitDate,
                            UpToDate = x.VisitData.Any(y =>
                                y.Question == GGSettings.QuestionVitaminA
                                && y.QuestionAnswer != GGSettings.AnswerNo) // Seems in cases we don't ask the question we still save it with an answer of undefined, so checking for yes does not work
                        })
                        // Group by child
                        .GroupBy(x => x.InfantId)
                        // Take only the latest visit
                        .Select(x => x.OrderByDescending(x => x.ActualVisitDate).FirstOrDefault())
                        .ToList();

                    var totalVitaminAChildren = childLatestVitaminAAnswer
                        .Where(x => 
                            x.UpToDate 
                            && x.ActualVisitDate.HasValue 
                            && x.ActualVisitDate.Value >= monthStart 
                            && x.ActualVisitDate.Value <= monthEnd)
                        .Count();

                    var vitaminAUpToDate = !childLatestVitaminAAnswer.Any(x => x.UpToDate == false);

                    if (infantIds.Any() && vitaminAUpToDate)
                    {
                        AddOrUpdatePoints(
                            PointsActivityConstants.ChildrenVitaminAUpToDateActivityId,
                            userId.Value,
                            childrenVitaminAUpToDateActivity.Points,
                            totalVitaminAChildren,
                            monthStart);
                    }
                }

                #endregion

                #region All deworming up to date

                var missedDewormingVisits = visitsByChild.Any(x => !IsDewormingScreeningUpToDate(x));

                if (!missedDewormingVisits)
                {
                    // Check all are up to date
                    var childLatestDewormingAnswer = _visitRepo.GetAll()
                        // All visits where we check the CSG status
                        .Where(x =>
                            x.InfantId.HasValue
                            && infantIds.Contains(x.InfantId.Value)
                            && x.VisitData.Any(y => y.Question == GGSettings.QuestionDeworming))
                        .Select(x => new
                        {
                            InfantId = x.InfantId.Value,
                            ActualVisitDate = x.ActualVisitDate,
                            UpToDate = x.VisitData.Any(y =>
                                y.Question == GGSettings.QuestionDeworming
                                && y.QuestionAnswer != GGSettings.AnswerNo) // Seems in cases we don't ask the question we still save it with an answer of undefined, so checking for yes does not work
                        })
                        // Group by child
                        .GroupBy(x => x.InfantId)
                        // Take only the latest visit
                        .Select(x => x.OrderByDescending(x => x.ActualVisitDate).FirstOrDefault())
                        .ToList();

                    var totalDewormingChildren = childLatestDewormingAnswer
                        .Where(x => 
                            x.UpToDate 
                            && x.ActualVisitDate.HasValue 
                            && x.ActualVisitDate.Value >= monthStart 
                            && x.ActualVisitDate.Value <= monthEnd)
                        .Count();

                    var dewormingUpToDate = !childLatestDewormingAnswer.Any(x => x.UpToDate == false);

                    if (infantIds.Any() && dewormingUpToDate)
                    {
                        AddOrUpdatePoints(
                            PointsActivityConstants.ChildrenDewormingUpToDateActivityId,
                            userId.Value,
                            childrenDewormingUpToDateActivity.Points,
                            totalDewormingChildren,
                            monthStart);
                    }
                }

                #endregion

                #region All immunisations up to date

                var missedImmunisationVisits = visitsByChild.Any(x => !IsImmunisationScreeningUpToDate(x));

                if (!missedImmunisationVisits)
                {
                    // Check all are up to date
                    var childImmunisationAnswer = _visitRepo.GetAll()
                        // All visits where we check the CSG status
                        .Where(x =>
                            x.InfantId.HasValue
                            && infantIds.Contains(x.InfantId.Value)
                            && x.VisitData.Any(y => y.Question == GGSettings.QuestionImmunisation))
                        .Select(x => new
                        {
                            InfantId = x.InfantId.Value,
                            ActualVisitDate = x.ActualVisitDate,
                            UpToDate = x.VisitData.Any(y =>
                                y.Question == GGSettings.QuestionImmunisation
                                && y.QuestionAnswer != GGSettings.AnswerNo) // Seems in cases we don't ask the question we still save it with an answer of undefined, so checking for yes does not work
                        })
                        // Group by child
                        .GroupBy(x => x.InfantId)
                        // Take only the latest visit
                        .Select(x => x.OrderByDescending(x => x.ActualVisitDate).FirstOrDefault())
                        .ToList();

                    var totalImmunisationChildren = childImmunisationAnswer
                        .Where(x => 
                            x.UpToDate 
                            && x.ActualVisitDate.HasValue 
                            && x.ActualVisitDate.Value >= monthStart 
                            && x.ActualVisitDate.Value <= monthEnd)
                        .Count();

                    var immunisationsUpToDate = !childImmunisationAnswer.Any(x => x.UpToDate == false);

                    if (infantIds.Any() && immunisationsUpToDate)
                    {
                        AddOrUpdatePoints(
                            PointsActivityConstants.ChildrenImmunisationsUpToDateActivityId,
                            userId.Value,
                            childrenImmunisationsUpToDateActivity.Points,
                            totalImmunisationChildren,
                            monthStart);
                    }
                }

                #endregion
            }
        }

        public void CalculateBreastFeedingClubPoints(Guid clinicId)
        {
            var breastFeedingClubsForClinic = _clinicService.GetBreastFeedingClubs(clinicId);

            var qualifyingClubs = breastFeedingClubsForClinic.Where(x => 
                x.MeetingDate >= DateTime.Now.GetStartOfMonth()
                && x.MeetingDate <= DateTime.Now.GetEndOfMonth()
                && x.Clients.Count() >= 4
                && x.Clients.Count() <= 6)
                .Count();

            var pointsForMonth = 0;

            if (qualifyingClubs == 1) 
            {
                pointsForMonth = 10;
            }
            else if (qualifyingClubs == 2)
            {
                pointsForMonth = 20;
            }
            else if (qualifyingClubs == 3)
            {
                pointsForMonth = 50;
            }
            else if (qualifyingClubs >= 4)
            {
                pointsForMonth = 200;
            }

            var monthStart = DateTime.Now.GetStartOfMonth();
            var monthEnd = DateTime.Now.GetEndOfMonth();
            var currentPoints = _pointsClinicSummaryRepo.GetAll().Where(x => 
                x.ClinicId == clinicId 
                && x.PointsCategoryId == PointsCategoryConstants.BreastFeedingClubCategoryId
                && x.DateScored >= monthStart
                && x.DateScored <= monthEnd)
                .FirstOrDefault();

            if (currentPoints == null)
            {
                _pointsClinicSummaryRepo.Insert(new PointsClinicSummary
                {
                    DateScored = DateTime.Now.GetStartOfMonth(),
                    ClinicId = clinicId,
                    PointsCategoryId = PointsCategoryConstants.BreastFeedingClubCategoryId,
                    TimesScored = qualifyingClubs,
                    PointsTotal = pointsForMonth,
                });
            }
            else
            {
                currentPoints.TimesScored = qualifyingClubs;
                currentPoints.PointsTotal = pointsForMonth;

                _pointsClinicSummaryRepo.Update(currentPoints);
            }
        }
    
        private bool IsDevelopmentalScreeningUpToDate(IEnumerable<PointsVisit> visitsForChild)
        {
            // No visits yet, so up to date
            if (!visitsForChild.Any())
            {
                return true;
            }

            var visit1 = visitsForChild.First();

            // Last visit was attended, so must be up to date
            if (visit1.Attended)
            {
                return true;
            }

            // If last visit was missed and is one of the 3,6,9,12,18 months, we are not up to date
            if (visit1.VisitType == GGSettings.VisitTypeThreeMonths
                || visit1.VisitType == GGSettings.VisitTypeSixMonths
                || visit1.VisitType == GGSettings.VisitTypeNineMonths
                || visit1.VisitType == GGSettings.VisitTypeTwelveMonths
                || visit1.VisitType == GGSettings.VisitTypeEighteenMonths)
            {
                return false;
            }

            // If month 4 missed, month 3 must be attended
            if (visit1.VisitType == GGSettings.VisitTypeFourMonths)
            {
                return visitsForChild.Any(x => x.VisitType == GGSettings.VisitTypeThreeMonths && x.Attended);
            }

            // If month 5 missed, month 3 or 4 must be attended
            if (visit1.VisitType == GGSettings.VisitTypeFiveMonths)
            {
                return visitsForChild.Any(x => x.Attended
                    && (x.VisitType == GGSettings.VisitTypeThreeMonths || x.VisitType == GGSettings.VisitTypeFourMonths));
            }

            // If 15 month missed, month 12 must be attened
            if (visit1.VisitType == GGSettings.VisitTypeFifteenMonths)
            {
                return visitsForChild.Any(x => x.VisitType == GGSettings.VisitTypeTwelveMonths && x.Attended);
            }

            return true;
        }

        private bool IsVitaminAScreeningUpToDate(IEnumerable<PointsVisit> visitsForChild)
        {
            // No visits yet, so up to date
            if (!visitsForChild.Any())
            {
                return true;
            }

            var visit1 = visitsForChild.First();

            // Last visit was attended, so must be up to date
            if (visit1.Attended)
            {
                return true;
            }

            // If last visit was missed and is one of the 3,6,9,12,18 months, we are not up to date
            if (visit1.VisitType == GGSettings.VisitTypeSixMonths
                || visit1.VisitType == GGSettings.VisitTypeTwelveMonths
                || visit1.VisitType == GGSettings.VisitTypeEighteenMonths
                || visit1.VisitType == GGSettings.VisitTypeTwentyFourMonths)
            {
                return false;
            }

            // If month 9 missed, month 6 must be attended
            if (visit1.VisitType == GGSettings.VisitTypeNineMonths)
            {
                return visitsForChild.Any(x => x.VisitType == GGSettings.VisitTypeSixMonths && x.Attended);
            }

            // If month 15 missed, month 12 must be attended
            if (visit1.VisitType == GGSettings.VisitTypeFifteenMonths)
            {
                return visitsForChild.Any(x => x.VisitType == GGSettings.VisitTypeTwelveMonths && x.Attended);
            }

            // If 21 month missed, month 18 must be attened
            if (visit1.VisitType == GGSettings.VisitTypeTwentyOneMonths)
            {
                return visitsForChild.Any(x => x.VisitType == GGSettings.VisitTypeEighteenMonths && x.Attended);
            }

            return true;
        }

        private bool IsDewormingScreeningUpToDate(IEnumerable<PointsVisit> visitsForChild)
        {
            // No visits yet, so up to date
            if (!visitsForChild.Any())
            {
                return true;
            }

            var visit1 = visitsForChild.First();

            // Last visit was attended, so must be up to date
            if (visit1.Attended)
            {
                return true;
            }

            // If last visit was missed and is one of the 3,6,9,12,18 months, we are not up to date
            if (visit1.VisitType == GGSettings.VisitTypeTwelveMonths
                || visit1.VisitType == GGSettings.VisitTypeEighteenMonths
                || visit1.VisitType == GGSettings.VisitTypeTwentyFourMonths)
            {
                return false;
            }

            // If month 15 missed, month 12 must be attended
            if (visit1.VisitType == GGSettings.VisitTypeFifteenMonths)
            {
                return visitsForChild.Any(x => x.VisitType == GGSettings.VisitTypeTwelveMonths && x.Attended);
            }

            // If 21 month missed, month 18 must be attened
            if (visit1.VisitType == GGSettings.VisitTypeTwentyOneMonths)
            {
                return visitsForChild.Any(x => x.VisitType == GGSettings.VisitTypeEighteenMonths && x.Attended);
            }

            return true;
        }

        private bool IsImmunisationScreeningUpToDate(IEnumerable<PointsVisit> visitsForChild)
        {
            // No visits yet, so up to date
            if (!visitsForChild.Any())
            {
                return true;
            }

            var visit1 = visitsForChild.First();

            // Last visit was attended, so must be up to date
            if (visit1.Attended)
            {
                return true;
            }

            // If last visit was missed and is one of the following, we are not up to date
            if (visit1.VisitType == GGSettings.VisitTypeWeekSevenToEight
                || visit1.VisitType == GGSettings.VisitTypeThreeMonths
                || visit1.VisitType == GGSettings.VisitTypeFourMonths
                || visit1.VisitType == GGSettings.VisitTypeSixMonths
                || visit1.VisitType == GGSettings.VisitTypeNineMonths
                || visit1.VisitType == GGSettings.VisitTypeTwelveMonths
                || visit1.VisitType == GGSettings.VisitTypeEighteenMonths)
            {
                return false;
            }

            // If month 5 missed, month 4 must be attended
            if (visit1.VisitType == GGSettings.VisitTypeFiveMonths)
            {
                return visitsForChild.Any(x => x.VisitType == GGSettings.VisitTypeFourMonths && x.Attended);
            }

            // If month 15 missed, month 12 must be attended
            if (visit1.VisitType == GGSettings.VisitTypeFifteenMonths)
            {
                return visitsForChild.Any(x => x.VisitType == GGSettings.VisitTypeTwelveMonths && x.Attended);
            }

            return true;
        }

        private class PointsVisit
        {
            public Guid VisitId { get; set; }
            public Guid InfantId { get; set; }
            public DateTime DueDate { get; set; }
            public DateTime? ActualVisitDate { get; set; }
            public string VisitType { get; set; }
            public bool Attended { get; set; }
        }    
    }
}
