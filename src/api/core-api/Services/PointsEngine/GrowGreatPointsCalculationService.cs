using EcdLink.Api.CoreApi.Services.PointsEngine.Interfaces;
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
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Diagnostics;
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
            _uId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().GetValueOrDefault());

            _infantRepo = _repositoryFactory.CreateGenericRepository<Infant>(userContext: _uId);
            _motherRepo = _repositoryFactory.CreateGenericRepository<Mother>(userContext: _uId);

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


        // TODO - Need to fix this
        private void UpdateUserSummaryPoints(string userId, DateTime today)
        {
            var allRecords = _pointsEngineService.GetPointsLibraryForTenant();

            foreach (var activity in allRecords)
            {
                _pointsEngineService.UpdateUserSummaryPoints(userId, activity, today);
            }
        }

        private void AddOrUpdatePoints(Guid activityId, Guid userId, int pointsTotal, int? timesScored = null)
        {
            var monthStart = DateTime.Now.GetStartOfMonth();
            var monthEnd = DateTime.Now.GetEndOfMonth();
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
                    DateScored = DateTime.Now.GetStartOfMonth(),
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

                var pointsTotal = 0;

                // (NOTE: CHW can get either 0, 50, or 200 points should be awarded for this item)

                // Registered 1 - 2 pregnant clients who are less than 20 weeks into pregnancy (50 points)
                // Register 3 or more pregnant clients who are less than 20 weeks into pregnancy (200 points)
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
        /// Calculates points scored immediately for visits (DOES NOT INCLUDE MONTH END POINTS)
        /// 1. Referral made for self harm or maternal distress
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

        public bool CalculatePregnantMomVisits(string userId, DateTime today)
        {
            bool hasMothers = _motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId.ToString() == userId && x.IsActive == true).Count() != 0;

            if (hasMothers)
            {
                List<PointsLibrary> pointsLibraries = _pointsEngineService.GetPointsLibraryForActivity(Constants.PointsEngineSettings.pregnant_mom_clients);
                PointsLibrary activity1 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.pregnant_mom_clients_ac1).FirstOrDefault();
                PointsLibrary activity2 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.pregnant_mom_clients_ac2).FirstOrDefault();
                PointsLibrary activity3 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.pregnant_mom_clients_ac3).FirstOrDefault();
                PointsLibrary activity4 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.pregnant_mom_clients_ac4).FirstOrDefault();
                PointsLibrary activity5 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.pregnant_mom_clients_ac5).FirstOrDefault();

                // 1
                // If no visits overdue or missing for pregnant mom clients by the end of the month, user earns 50 points.
                //"Monthly total (capped at 50) Calculated at the end of the month."
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    int monthVisits = _visitRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.Attended == false &&
                                                                x.DueDate.HasValue &&
                                                                x.DueDate.Value.Year == today.Year &&
                                                                x.DueDate.Value.Month == today.Month).Select(x => x.Id).Distinct().Count();

                    if (monthVisits == 0)
                    {
                        //int activity1_records = GetIndividualUserPoints(activity1.Id, userId, today.Month, today.Year).Count;
                        //if (activity1_records == 0)
                        //{
                        //    InsertIndividualUserPoints(
                        //        new PointsUser
                        //        {
                        //            Id = Guid.NewGuid(),
                        //            IsActive = true,
                        //            InsertedDate = DateTime.Now,
                        //            UpdatedBy = _uId.ToString(),
                        //            Month = today.Month,
                        //            Year = today.Year,
                        //            Points = activity1.Points,
                        //            UserId = new Guid(userId),
                        //            PointsLibraryId = activity1.Id,
                        //            Comment = "Total: " + monthVisits
                        //        }
                        //    );
                        //}
                    }
                }


                // 3
                //"If no ""Visit 1""s for pregnant moms are overdue or have been missed by the end of the month, user earns 50 points.
                //(This means the question on G6.2.1 is answered for all new clients; any ideas of how to make this easier to calculate ?) "
                //"Monthly total (capped at 50)  Calculated at the end of the month."
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    int visit1_count = _visitDataRepo.GetAll().Where(x => x.Visit.Mother.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.Visit.Attended == false &&
                                                                x.Visit.VisitType.Name == Constants.GGSettings.visit1 &&
                                                                x.InsertedDate.Year == today.Year &&
                                                                x.InsertedDate.Month == today.Month).Select(x => x.Id).Distinct().Count();
                    if (visit1_count == 0)
                    {
                        //int activity3_records = GetIndividualUserPoints(activity3.Id, userId, today.Month, today.Year).Count;
                        //if (activity3_records == 0)
                        //{
                        //    InsertIndividualUserPoints(
                        //        new PointsUser
                        //        {
                        //            Id = Guid.NewGuid(),
                        //            IsActive = true,
                        //            InsertedDate = DateTime.Now,
                        //            UpdatedBy = _uId.ToString(),
                        //            Month = today.Month,
                        //            Year = today.Year,
                        //            Points = activity3.Points,
                        //            UserId = new Guid(userId),
                        //            PointsLibraryId = activity3.Id,
                        //            Comment = "Total: " + visit1_count
                        //        }
                        //    );
                        //}
                    }
                }

                // 5
                // Screening for substance abuse "up to date"
                // If no visits overdue or missing for pregnant mom clients by the end of the month, user earns 50 points.
                // "Monthly total (capped at 50) Calculated at the end of the month."
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    int abuseVisits = _visitDataRepo.GetAll().Where(x => x.Visit.Mother.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.Visit.DueDate.HasValue &&
                                                                x.Visit.DueDate.Value.Year == today.Year &&
                                                                x.Visit.DueDate.Value.Month == today.Month).Select(x => x.Id).Distinct().Count();
                    if (abuseVisits == 0)
                    {
                        //int activity5_records = GetIndividualUserPoints(activity5.Id, userId, today.Month, today.Year).Count;
                        //if (activity5_records == 0)
                        //{
                        //    InsertIndividualUserPoints(
                        //        new PointsUser
                        //        {
                        //            Id = Guid.NewGuid(),
                        //            IsActive = true,
                        //            InsertedDate = DateTime.Now,
                        //            UpdatedBy = _uId.ToString(),
                        //            Month = today.Month,
                        //            Year = today.Year,
                        //            Points = activity5.Points,
                        //            UserId = new Guid(userId),
                        //            PointsLibraryId = activity5.Id,
                        //            Comment = "Total: " + abuseVisits
                        //        }
                        //    );
                        //}
                    }
                }
                UpdateUserSummaryPoints(userId, today);
            }
            return true;
        }

        public bool CalculateInfantVisits(string userId, DateTime today)
        {
            bool hasChildren = _infantRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId.ToString() == userId && x.IsActive == true).Count() != 0;

            if (hasChildren)
            {
                List<PointsLibrary> pointsLibraries = _pointsEngineService.GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_clients);
                PointsLibrary activity1 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac1).FirstOrDefault();
                PointsLibrary activity2 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac2).FirstOrDefault();
                PointsLibrary activity3 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac3).FirstOrDefault();
                PointsLibrary activity4 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac4).FirstOrDefault();
                PointsLibrary activity5 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac5).FirstOrDefault();
                PointsLibrary activity6 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac6).FirstOrDefault();
                PointsLibrary activity7 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac7).FirstOrDefault();
                PointsLibrary activity8 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac8).FirstOrDefault();
                PointsLibrary activity9 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac9).FirstOrDefault();
                PointsLibrary activity10 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac10).FirstOrDefault();
                PointsLibrary activity11 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac11).FirstOrDefault();
                PointsLibrary activity12 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac12).FirstOrDefault();
                PointsLibrary activity13 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac13).FirstOrDefault();
                PointsLibrary activity14 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_clients_ac14).FirstOrDefault();

                var comment = "";

                // 1
                // Child support grant - all eligible children accessing the CSG
                // Monthly total (capped at 100) Calculated at the end of the month.
                // IF any of the children who have ever been marked eligible (""Yes"" response to ""Does Themba qualify....""), if they are not receiving CSG according to the most recent response,
                // the CHW does not receive points for this item.
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    List<VisitData> ac1 = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                (x.Question == Constants.GGSettings.q_csg_receiving && x.QuestionAnswer == Constants.GGSettings.answer_yes) &&
                                                                (x.InsertedDate.Year == today.Year &&
                                                                x.InsertedDate.Month == today.Month)).ToList();

                    if (ac1.Count > 0)
                    {
                        var names = ac1.Select(x => x.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                        comment = "Total: " + ac1.Count + " - " + string.Join(",", names);

                        //int activity1_records = GetIndividualUserPoints(activity1.Id, userId, today.Month, today.Year).Count;
                        //if (activity1_records == 0)
                        //{
                        //    InsertIndividualUserPoints(
                        //        new PointsUser
                        //        {
                        //            Id = Guid.NewGuid(),
                        //            IsActive = true,
                        //            InsertedDate = DateTime.Now,
                        //            UpdatedBy = _uId.ToString(),
                        //            Month = today.Month,
                        //            Year = today.Year,
                        //            Points = activity1.Points,
                        //            UserId = new Guid(userId),
                        //            PointsLibraryId = activity1.Id,
                        //            Comment = comment
                        //        }
                        //    );
                        //}
                    }
                }

                // 2
                // "Love, play and talk for healthy development guide All children screened"
                // "Monthly total (capped at 100) Calculated at the end of the month."
                // 14 week; 6 month; 9 month; 12 month; 18 month
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    List<VisitData> completed_pillar2Data = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.VisitName == Constants.GGSettings.pillar2_db &&
                                                                (x.InsertedDate.Year == today.Year &&
                                                                x.InsertedDate.Month == today.Month)
                                                                ).ToList();

                    List<Visit> due_pillar2Data = _visitRepo.GetAll().Where(x => x.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId && x.InfantId != null && x.Attended == false &&
                                                                (x.DueDate.HasValue && x.DueDate.Value.Year == today.Year && x.DueDate.Value.Month == today.Month)).ToList();


                    int activity2_records = 0;//GetIndividualUserPoints(activity2.Id, userId, today.Month, today.Year).Count;
                    if (activity2_records == 0)
                    {
                        if (due_pillar2Data.Count != 0)
                        {
                            List<Visit> due_children = new List<Visit>();
                            foreach (var item in due_pillar2Data)
                            {
                                TimeSpan difference = today.Date.Subtract(item.Infant.User.DateOfBirth.Date);
                                double weeks = System.Math.Ceiling(difference.TotalDays / 7);

                                if (weeks <= 78.21)
                                {
                                    due_children.Add(item);
                                }
                            }
                            // if no visits are due, we give points
                            if (due_children.Count == 0)
                            {
                                var names = due_children.Select(x => x.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                                comment = "Total: " + due_children.Count + " - " + string.Join(",", names);
                                //InsertIndividualUserPoints(
                                //     new PointsUser
                                //     {
                                //         Id = Guid.NewGuid(),
                                //         IsActive = true,
                                //         InsertedDate = DateTime.Now,
                                //         UpdatedBy = _uId.ToString(),
                                //         Month = today.Month,
                                //         Year = today.Year,
                                //         Points = activity2.Points,
                                //         UserId = new Guid(userId),
                                //         PointsLibraryId = activity2.Id,
                                //         Comment = comment
                                //     }
                                // );
                            }
                        }
                        else
                        {
                            if (completed_pillar2Data.Count != 0)
                            {
                                var names = completed_pillar2Data.Select(x => x.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                                comment = "Total: " + completed_pillar2Data.Count + " - " + string.Join(",", names);
                                //InsertIndividualUserPoints(
                                //    new PointsUser
                                //    {
                                //        Id = Guid.NewGuid(),
                                //        IsActive = true,
                                //        InsertedDate = DateTime.Now,
                                //        UpdatedBy = _uId.ToString(),
                                //        Month = today.Month,
                                //        Year = today.Year,
                                //        Points = activity2.Points,
                                //        UserId = new Guid(userId),
                                //        PointsLibraryId = activity2.Id,
                                //        Comment = comment
                                //    }
                                //);
                            }
                        }
                    }
                }

                // 3 
                // Measuring childrens' growth length - normal measure count for month
                // no cap

                List<VisitDataStatus> ac3 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_length &&
                                                                x.VisitData.VisitSection != Constants.GGSettings.child_road_to_health &&
                                                                x.Comment == Constants.GGSettings.normal_comment &&
                                                                x.Type == Constants.GGSettings.visit_data_client_progress &&
                                                                (x.VisitData.InsertedDate.Year == today.Year &&
                                                                x.VisitData.InsertedDate.Month == today.Month)).ToList();

                if (ac3.Count > 0)
                {
                    var activity3_points = ac3.Count * activity3.Points;
                    var names = ac3.Select(x => x.VisitData.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                    comment = "Total: " + ac3.Count + " - " + string.Join(",", names);

                    //PointsUser activity3_record = GetIndividualUserPoints(activity3.Id, userId, today.Month, today.Year).FirstOrDefault();
                    //if (activity3_record == null)
                    //{
                    //    InsertIndividualUserPoints(
                    //        new PointsUser
                    //        {
                    //            Id = Guid.NewGuid(),
                    //            IsActive = true,
                    //            InsertedDate = DateTime.Now,
                    //            UpdatedBy = _uId.ToString(),
                    //            Month = today.Month,
                    //            Year = today.Year,
                    //            Points = activity3_points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity3.Id,
                    //            Comment = comment
                    //        }
                    //    );
                    //} else
                    //{
                    //    activity3_record.Points = activity3_points;
                    //    activity3_record.UpdatedDate = DateTime.Now;
                    //    activity3_record.UpdatedBy = _uId.ToString();
                    //    activity3_record.Comment = comment;
                    //    UpdateIndividualUserPoints(activity3_record);
                    //}
                }

                // 4 
                // Measuring childrens' growth length - referral not required
                // no cap
                List<VisitDataStatus> ac4 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_length &&
                                                                x.VisitData.VisitSection != Constants.GGSettings.child_road_to_health &&
                                                                x.Comment != Constants.GGSettings.stunted &&
                                                                x.Comment != Constants.GGSettings.severely_stunted &&
                                                                x.Section != Constants.GGSettings.refer_to_clinic &&
                                                                x.Section != Constants.GGSettings.refer_to_clinic_urgently &&
                                                                x.Type == Constants.GGSettings.visit_data_client_progress &&
                                                                (x.VisitData.InsertedDate.Year == today.Year &&
                                                                x.VisitData.InsertedDate.Month == today.Month)).ToList();
                if (ac4.Count > 0)
                {
                    var activity4_points = ac4.Count * activity4.Points;
                    var names = ac4.Select(x => x.VisitData.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                    comment = "Total: " + ac4.Count + " - " + string.Join(",", names);

                    //PointsUser activity4_record = GetIndividualUserPoints(activity4.Id, userId, today.Month, today.Year).FirstOrDefault();
                    //if (activity4_record == null)
                    //{
                    //    InsertIndividualUserPoints(
                    //        new PointsUser
                    //        {
                    //            Id = Guid.NewGuid(),
                    //            IsActive = true,
                    //            InsertedDate = DateTime.Now,
                    //            UpdatedBy = _uId.ToString(),
                    //            Month = today.Month,
                    //            Year = today.Year,
                    //            Points = activity4_points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity4.Id,
                    //            Comment = comment
                    //        }
                    //    );
                    //}
                    //else
                    //{
                    //    activity4_record.Points = activity4_points;
                    //    activity4_record.UpdatedDate = DateTime.Now;
                    //    activity4_record.UpdatedBy = _uId.ToString()            ;
                    //    activity4_record.Comment = comment;
                    //    UpdateIndividualUserPoints(activity4_record);
                    //}
                }

                // 5
                // Measuring childrens' growth length - referral required
                // no cap
                List<VisitDataStatus> ac5 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_length &&
                                                                x.Comment == Constants.GGSettings.stunted &&
                                                                x.Comment == Constants.GGSettings.severely_stunted &&
                                                                x.Section == Constants.GGSettings.refer_to_clinic &&
                                                                x.Section == Constants.GGSettings.refer_to_clinic_urgently &&
                                                                x.Type == Constants.GGSettings.visit_data_client_progress &&
                                                                x.VisitData.VisitSection != Constants.GGSettings.child_road_to_health &&
                                                                (x.VisitData.InsertedDate.Year == today.Year &&
                                                                x.VisitData.InsertedDate.Month == today.Month)).ToList();
                if (ac5.Count > 0)
                {
                    var activity5_points = ac5.Count * activity5.Points;
                    var names = ac5.Select(x => x.VisitData.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                    comment = "Total: " + ac5.Count + " - " + string.Join(",", names);

                    //PointsUser activity5_record = GetIndividualUserPoints(activity5.Id, userId, today.Month, today.Year).FirstOrDefault();
                    //if (activity5_record == null)
                    //{
                    //    InsertIndividualUserPoints(
                    //        new PointsUser
                    //        {
                    //            Id = Guid.NewGuid(),
                    //            IsActive = true,
                    //            InsertedDate = DateTime.Now,
                    //            UpdatedBy = _uId.ToString(),
                    //            Month = today.Month,
                    //            Year = today.Year,
                    //            Points = activity5_points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity5.Id,
                    //            Comment = comment
                    //        }
                    //    );
                    //}
                    //else
                    //{
                    //    activity5_record.Points = activity5_points;
                    //    activity5_record.UpdatedDate = DateTime.Now;
                    //    activity5_record.UpdatedBy = _uId.ToString();
                    //    activity5_record.Comment = comment;
                    //    UpdateIndividualUserPoints(activity5_record);
                    //}
                }

                // 6
                // Measuring childrens' growth weight - normal measure count for month
                // no cap
                List<VisitDataStatus> ac6 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_weight &&
                                                                x.VisitData.VisitSection != Constants.GGSettings.child_road_to_health &&
                                                                x.Comment == Constants.GGSettings.normal_comment &&
                                                                x.Type == Constants.GGSettings.visit_data_client_progress &&
                                                                (x.VisitData.InsertedDate.Year == today.Year &&
                                                                x.VisitData.InsertedDate.Month == today.Month)).ToList();

                if (ac6.Count > 0)
                {
                    var activity6_points = ac6.Count * activity6.Points;
                    var names = ac6.Select(x => x.VisitData.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                    comment = "Total: " + ac6.Count + " - " + string.Join(",", names);

                    //PointsUser activity6_record = GetIndividualUserPoints(activity6.Id, userId, today.Month, today.Year).FirstOrDefault();
                    //if (activity6_record == null)
                    //{
                    //    InsertIndividualUserPoints(
                    //        new PointsUser
                    //        {
                    //            Id = Guid.NewGuid(),
                    //            IsActive = true,
                    //            InsertedDate = DateTime.Now,
                    //            UpdatedBy = _uId.ToString(),
                    //            Month = today.Month,
                    //            Year = today.Year,
                    //            Points = activity6_points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity6.Id,
                    //            Comment = comment
                    //        }
                    //    );
                    //}
                    //else
                    //{
                    //    activity6_record.Points = activity6_points;
                    //    activity6_record.UpdatedDate = DateTime.Now;
                    //    activity6_record.UpdatedBy = _uId.ToString();
                    //    activity6_record.Comment = comment;
                    //    UpdateIndividualUserPoints(activity6_record);
                    //}
                }

                // 7 
                // Measuring childrens' growth weight - referral not required
                // no cap
                List<VisitDataStatus> ac7 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_weight &&
                                                                x.Comment != Constants.GGSettings.severely_underweight &&
                                                                x.Comment != Constants.GGSettings.growth_faltering &&
                                                                x.Comment != Constants.GGSettings.underweight3 &&
                                                                x.Comment != Constants.GGSettings.overweight &&
                                                                x.Comment != Constants.GGSettings.obese &&
                                                                x.Type == Constants.GGSettings.visit_data_client_progress &&
                                                                x.VisitData.VisitSection != Constants.GGSettings.child_road_to_health &&
                                                               (x.VisitData.InsertedDate.Year == today.Year &&
                                                                x.VisitData.InsertedDate.Month == today.Month)).ToList();
                if (ac7.Count > 0)
                {
                    var activity7_points = ac7.Count * activity7.Points;
                    var names = ac7.Select(x => x.VisitData.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                    comment = "Total: " + ac7.Count + " - " + string.Join(",", names);

                    //PointsUser activity7_record = GetIndividualUserPoints(activity7.Id, userId, today.Month, today.Year).FirstOrDefault();
                    //if (activity7_record == null)
                    //{
                    //    InsertIndividualUserPoints(
                    //        new PointsUser
                    //        {
                    //            Id = Guid.NewGuid(),
                    //            IsActive = true,
                    //            InsertedDate = DateTime.Now,
                    //            UpdatedBy = _uId.ToString(),
                    //            Month = today.Month,
                    //            Year = today.Year,
                    //            Points = activity7_points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity7.Id,
                    //            Comment = comment
                    //        }
                    //    );
                    //}
                    //else
                    //{
                    //    activity7_record.Points = activity7_points;
                    //    activity7_record.UpdatedDate = DateTime.Now;
                    //    activity7_record.UpdatedBy = _uId.ToString();
                    //    activity7_record.Comment = comment;
                    //    UpdateIndividualUserPoints(activity7_record);
                    //}
                }

                // 8 
                // Measuring childrens' growth weight - referral required
                // no cap
                List<VisitDataStatus> ac8 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_weight &&
                                                                x.Comment == Constants.GGSettings.severely_underweight &&
                                                                x.Comment == Constants.GGSettings.growth_faltering &&
                                                                x.Comment == Constants.GGSettings.underweight3 &&
                                                                x.Comment == Constants.GGSettings.overweight &&
                                                                x.Comment == Constants.GGSettings.obese &&
                                                                x.Type == Constants.GGSettings.visit_data_client_progress &&
                                                                x.VisitData.VisitSection != Constants.GGSettings.child_road_to_health &&
                                                                (x.VisitData.InsertedDate.Year == today.Year &&
                                                                x.VisitData.InsertedDate.Month == today.Month)).ToList();
                if (ac8.Count > 0)
                {
                    var activity8_points = ac8.Count * activity8.Points;
                    var names = ac8.Select(x => x.VisitData.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                    comment = "Total: " + ac8.Count + " - " + string.Join(",", names);

                    //PointsUser activity8_record = GetIndividualUserPoints(activity8.Id, userId, today.Month, today.Year).FirstOrDefault();
                    //if (activity8_record == null)
                    //{
                    //    InsertIndividualUserPoints(
                    //        new PointsUser
                    //        {
                    //            Id = Guid.NewGuid(),
                    //            IsActive = true,
                    //            InsertedDate = DateTime.Now,
                    //            UpdatedBy = _uId.ToString(),
                    //            Month = today.Month,
                    //            Year = today.Year,
                    //            Points = activity8_points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity8.Id,
                    //            Comment = comment
                    //        }
                    //    );
                    //}
                    //else
                    //{
                    //    activity8_record.Points = activity8_points;
                    //    activity8_record.UpdatedDate = DateTime.Now;
                    //    activity8_record.UpdatedBy = _uId.ToString();
                    //    activity8_record.Comment = comment;
                    //    UpdateIndividualUserPoints(activity8_record);
                    //}
                }

                // 9
                // Measuring childrens' growth MUAC - normal
                // no cap
                List<VisitDataStatus> ac9 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_muac &&
                                                                x.Comment == Constants.GGSettings.normal_comment &&
                                                                (x.VisitData.InsertedDate.Year == today.Year &&
                                                                x.Type == Constants.GGSettings.visit_data_client_progress &&
                                                                x.VisitData.InsertedDate.Month == today.Month)).ToList();

                if (ac9.Count > 0)
                {
                    var activity9_points = ac9.Count * activity9.Points;
                    var names = ac9.Select(x => x.VisitData.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                    comment = "Total: " + ac9.Count + " - " + string.Join(",", names);

                    //PointsUser activity9_record = GetIndividualUserPoints(activity9.Id, userId, today.Month, today.Year).FirstOrDefault();
                    //if (activity9_record == null)
                    //{
                    //    InsertIndividualUserPoints(
                    //        new PointsUser
                    //        {
                    //            Id = Guid.NewGuid(),
                    //            IsActive = true,
                    //            InsertedDate = DateTime.Now,
                    //            UpdatedBy = _uId.ToString(),
                    //            Month = today.Month,
                    //            Year = today.Year,
                    //            Points = activity9_points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity9.Id,
                    //            Comment = comment
                    //        }
                    //    );
                    //}
                    //else
                    //{
                    //    activity9_record.Points = activity9_points;
                    //    activity9_record.UpdatedDate = DateTime.Now;
                    //    activity9_record.UpdatedBy = _uId.ToString();
                    //    activity9_record.Comment = comment;
                    //    UpdateIndividualUserPoints(activity9_record);
                    //}
                }

                // 10
                // Measuring childrens' growth MUAC - referral not required
                // no cap
                List<VisitDataStatus> ac10 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_muac &&
                                                                x.Comment != Constants.GGSettings.severe_acute_malnutrition &&
                                                                x.Comment != Constants.GGSettings.moderate_acute_malnutrition &&
                                                                x.Type == Constants.GGSettings.visit_data_client_progress &&
                                                                (x.VisitData.InsertedDate.Year == today.Year &&
                                                                x.VisitData.InsertedDate.Month == today.Month)).ToList();

                if (ac10.Count > 0)
                {
                    var activity10_points = ac10.Count * activity10.Points;
                    var names = ac10.Select(x => x.VisitData.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                    comment = "Total: " + ac10.Count + " - " + string.Join(",", names);

                    //PointsUser activity10_record = GetIndividualUserPoints(activity10.Id, userId, today.Month, today.Year).FirstOrDefault();
                    //if (activity10_record == null)
                    //{
                    //    InsertIndividualUserPoints(
                    //    new PointsUser
                    //    {
                    //        Id = Guid.NewGuid(),
                    //        IsActive = true,
                    //        InsertedDate = DateTime.Now,
                    //        UpdatedBy = _uId.ToString(),
                    //        Month = today.Month,
                    //        Year = today.Year,
                    //        Points = activity10_points,
                    //        UserId = new Guid(userId),
                    //        PointsLibraryId = activity10.Id,
                    //        Comment = comment
                    //    }
                    //   );
                    //}
                    //else
                    //{
                    //    activity10_record.Points = activity10_points;
                    //    activity10_record.UpdatedDate = DateTime.Now;
                    //    activity10_record.UpdatedBy = _uId.ToString();
                    //    activity10_record.Comment = comment;
                    //    UpdateIndividualUserPoints(activity10_record);
                    //}
                }

                // 11
                // Measuring childrens' growth MUAC - referral required
                // no cap
                List<VisitDataStatus> ac11 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_muac &&
                                                                x.Comment == Constants.GGSettings.severe_acute_malnutrition &&
                                                                x.Comment == Constants.GGSettings.moderate_acute_malnutrition &&
                                                                x.Type == Constants.GGSettings.visit_data_client_progress &&
                                                                (x.VisitData.InsertedDate.Year == today.Year &&
                                                                x.VisitData.InsertedDate.Month == today.Month)).ToList();

                if (ac11.Count > 0)
                {
                    var activity11_points = ac11.Count * activity11.Points;
                    var names = ac11.Select(x => x.VisitData.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                    comment = "Total: " + ac11.Count + " - " + string.Join(",", names);

                    //PointsUser activity11_record = GetIndividualUserPoints(activity11.Id, userId, today.Month, today.Year).FirstOrDefault();
                    //if (activity11_record == null)
                    //{
                    //    InsertIndividualUserPoints(
                    //        new PointsUser
                    //        {
                    //            Id = Guid.NewGuid(),
                    //            IsActive = true,
                    //            InsertedDate = DateTime.Now,
                    //            UpdatedBy = _uId.ToString(),
                    //            Month = today.Month,
                    //            Year = today.Year,
                    //            Points = activity11_points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity11.Id,
                    //            Comment = comment
                    //        }
                    //    );
                    //}
                    //else
                    //{
                    //    activity11_record.Points = activity11_points;
                    //    activity11_record.UpdatedDate = DateTime.Now;
                    //    activity11_record.UpdatedBy = _uId.ToString();
                    //    activity11_record.Comment = comment;
                    //    UpdateIndividualUserPoints(activity11_record);
                    //}
                }

                // 12
                // Vitamin A
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    List<VisitData> ac12 = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                (x.Question == Constants.GGSettings.q_vitamin_a && x.Question == Constants.GGSettings.answer_no) &&
                                                                (x.InsertedDate.Year == today.Year &&
                                                                x.InsertedDate.Month == today.Month)).ToList();

                    if (ac12.Count == 0)
                    {
                        comment = "Total: " + ac12.Count;

                        //int activity12_records = GetIndividualUserPoints(activity12.Id, userId, today.Month, today.Year).Count;
                        //if (activity12_records == 0)
                        //{
                        //    InsertIndividualUserPoints(
                        //        new PointsUser
                        //        {
                        //            Id = Guid.NewGuid(),
                        //            IsActive = true,
                        //            InsertedDate = DateTime.Now,
                        //            UpdatedBy = _uId.ToString(),
                        //            Month = today.Month,
                        //            Year = today.Year,
                        //            Points = activity12.Points,
                        //            UserId = new Guid(userId),
                        //            PointsLibraryId = activity12.Id,
                        //            Comment = comment
                        //        }
                        //    );
                        //}
                    }
                }

                // 13
                // Deworming
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    List<VisitData> ac13 = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                (x.Question == Constants.GGSettings.q_deworming && x.Question == Constants.GGSettings.answer_no) &&
                                                                (x.InsertedDate.Year == today.Year &&
                                                                x.InsertedDate.Month == today.Month)).ToList();

                    if (ac13.Count == 0)
                    {
                        comment = "Total: " + ac13.Count;

                        //int activity13_records = GetIndividualUserPoints(activity13.Id, userId, today.Month, today.Year).Count;
                        //if (activity13_records == 0)
                        //{
                        //    InsertIndividualUserPoints(
                        //        new PointsUser
                        //        {
                        //            Id = Guid.NewGuid(),
                        //            IsActive = true,
                        //            InsertedDate = DateTime.Now,
                        //            UpdatedBy = _uId.ToString(),
                        //            Month = today.Month,
                        //            Year = today.Year,
                        //            Points = activity13.Points,
                        //            UserId = new Guid(userId),
                        //            PointsLibraryId = activity13.Id,
                        //            Comment = comment
                        //        }
                        //    );
                        //}
                    }
                }

                // 14
                // Immunisations
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    List<VisitData> ac14 = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId.ToString() == userId &&
                                                                            (x.Question == Constants.GGSettings.q_immunisation && x.Question == Constants.GGSettings.answer_no) &&
                                                                            (x.InsertedDate.Year == today.Year &&
                                                                            x.InsertedDate.Month == today.Month)).ToList();

                    if (ac14.Count == 0)
                    {
                        comment = "Total: " + ac14.Count;

                        //int activity14_records = GetIndividualUserPoints(activity14.Id, userId, today.Month, today.Year).Count;
                        //if (activity14_records == 0)
                        //{
                        //    InsertIndividualUserPoints(
                        //        new PointsUser
                        //        {
                        //            Id = Guid.NewGuid(),
                        //            IsActive = true,
                        //            InsertedDate = DateTime.Now,
                        //            UpdatedBy = _uId.ToString(),
                        //            Month = today.Month,
                        //            Year = today.Year,
                        //            Points = activity14.Points,
                        //            UserId = new Guid(userId),
                        //            PointsLibraryId = activity14.Id,
                        //            Comment = comment
                        //        }
                        //    );
                        //}
                    }
                }
                UpdateUserSummaryPoints(userId, today);
            }
            return true;
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
    }
}
