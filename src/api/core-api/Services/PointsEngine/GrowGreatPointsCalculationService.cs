using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Services.Interfaces;
using EcdLink.Api.CoreApi.Services.PointsEngine.Interfaces;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services.PointsEngine
{
    public class GrowGreatPointsCalculationService : IGrowGreatPointsCalculationsService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private readonly IGenericRepository<PointsLibrary, Guid> _pointsLibraryRepo;
        private readonly IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;

        private readonly IGenericRepository<Infant, Guid> _infantRepo;
        private readonly IGenericRepository<Mother, Guid> _motherRepo;

        private readonly IGenericRepository<Visit, Guid> _visitRepo;
        private readonly IGenericRepository<VisitData, Guid> _visitDataRepo;
        private readonly IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;

        private HierarchyEngine _hierarchyEngine;
        private INotificationService _notificationService;
        private IPointsEngineService _pointsEngineService;


        private readonly Guid _uId;

        public GrowGreatPointsCalculationService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            HierarchyEngine hierarchyEngine,
            [Service] INotificationService notificationService,
            [Service] IPointsEngineService pointsEngineService)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _uId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetIntegrationUserId().GetValueOrDefault());

            _pointsLibraryRepo = _repositoryFactory.CreateGenericRepository<PointsLibrary>(userContext: _uId);
            _pointsUserSummaryRepo = _repositoryFactory.CreateGenericRepository<PointsUserSummary>(userContext: _uId);

            _infantRepo = _repositoryFactory.CreateGenericRepository<Infant>(userContext: _uId);
            _motherRepo = _repositoryFactory.CreateGenericRepository<Mother>(userContext: _uId);

            _visitRepo = _repositoryFactory.CreateGenericRepository<Visit>(userContext: _uId);
            _visitDataRepo = _repositoryFactory.CreateGenericRepository<VisitData>(userContext: _uId);
            _visitDataStatusRepo = _repositoryFactory.CreateGenericRepository<VisitDataStatus>(userContext: _uId);

            _notificationService = notificationService;
            _pointsEngineService = pointsEngineService;
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

        public bool CalculatePregnantMomClientRegistration(string userId, DateTime today)
        {
            List<PointsLibrary> pointsLibraries = _pointsEngineService.GetPointsLibraryForActivity(Constants.PointsEngineSettings.client_registration);
            PointsLibrary activity2 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac2).FirstOrDefault();
            PointsLibrary activity3 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac3).FirstOrDefault();
            PointsLibrary activity4 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac4).FirstOrDefault();

            var mothers = _motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId.ToString() == userId &&
                                          x.IsActive == true &&
                                          x.InsertedDate.Year == today.Year &&
                                          x.InsertedDate.Month == today.Month &&
                                          x.ExpectedDateOfDelivery != null).ToList();
            if (mothers.Count > 0)
            {

                // Complete client registration flow for 2 or more pregnant women
                if (mothers.Count >= 2)
                {
                    //int activity2_records = GetIndividualUserPoints(activity2.Id, userId, today.Month, today.Year).Count;

                    //if (activity2_records == 0)
                    //{
                    // var result =   InsertIndividualUserPoints(
                    //        new PointsUser
                    //        {
                    //            Id = Guid.NewGuid(),
                    //            IsActive = true,
                    //            InsertedDate = DateTime.Now,
                    //            UpdatedBy = _uId.ToString(),
                    //            Month = today.Month,
                    //            Year = today.Year,
                    //            Points = activity2.Points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity2.Id,
                    //            Comment = "Total: " + mothers.Count
                    //        }
                    //    );
                    //}
                }

                // (NOTE: CHW can get either 0, 50, or 200 points should be awarded for this item)
                var lessThan20Weeks = 0;
                foreach (Mother item in mothers)
                {
                    var diff = (DateTime)item.ExpectedDateOfDelivery - item.InsertedDate;
                    var weeks = diff.TotalDays / 7;

                    if (weeks < 20)
                    {
                        lessThan20Weeks++;
                    }

                }
                // Complete the client registration flow for 1 - 2 pregnant clients who are less than 20 weeks into pregnancy.
                if (lessThan20Weeks <= 2)
                {
                    //int activity3_records = GetIndividualUserPoints(activity3.Id, userId, today.Month, today.Year).Count;
                    //if (activity3_records == 0) {
                    //    InsertIndividualUserPoints(
                    //    new PointsUser
                    //    {
                    //        Id = Guid.NewGuid(),
                    //        IsActive = true,
                    //        InsertedDate = DateTime.Now,
                    //        UpdatedBy = _uId.ToString(),
                    //        Month = today.Month,
                    //        Year = today.Year,
                    //        Points = activity3.Points,
                    //        UserId = new Guid(userId),
                    //        PointsLibraryId = activity3.Id,
                    //        Comment = "Total: " + lessThan20Weeks
                    //    }
                    //    );
                    //}
                }
                // Complete the client registration flow for 3 or more pregnant clients who are less than 20 weeks into pregnancy.
                if (lessThan20Weeks >= 3)
                {
                    //int activity4_records = GetIndividualUserPoints(activity4.Id, userId, today.Month, today.Year).Count;
                    //if (activity4_records == 0)
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
                    //        Points = activity4.Points,
                    //        UserId = new Guid(userId),
                    //        PointsLibraryId = activity4.Id,
                    //        Comment = "Total: " + lessThan20Weeks
                    //    }
                    //    );
                    //}
                }
                UpdateUserSummaryPoints(userId, today);
            }
            return true;
        }

        public bool CalculateInfantClientRegistration(string userId, DateTime today)
        {
            List<PointsLibrary> pointsLibraries = _pointsEngineService.GetPointsLibraryForActivity(Constants.PointsEngineSettings.client_registration);
            PointsLibrary activity1 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac1).FirstOrDefault();

            // Complete the client registration flow for 5 or more children under the age of 2 years old
            var childData = _infantRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.User.Id == Guid.Parse(userId) &&
                                               x.IsActive == true &&
                                               x.InsertedDate.Year == today.Year &&
                                               x.InsertedDate.Month == today.Month).ToList();

            var childrenCount = childData.Where(x => x.User.Age > 0 && x.User.Age <= 2).Select(x => x.Id).Distinct().Count();

            if (childrenCount >= 5)
            {
                // Get user records for userId
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
                //            Comment = "Total: " + childrenCount
                //        }
                //    );
                //}
                UpdateUserSummaryPoints(userId, today);
            }

            return true;
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

                // 2
                //"If one of the following referral boxes were checked for at least 1 client:
                //-Lethabo had thoughts and plans to harm herself or commit suicide
                //-Lethabo was experiencing maternal distress user earns 20 points." - flag
                // "Monthly total (capped at 20) Points added as soon as goal reached within the month"
                int maternal_referrals = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Mother.HealthCareWorker.UserId.ToString() == userId &&
                                                                    x.VisitData.VisitSection == Constants.GGSettings.maternal_distress_screening &&
                                                                    x.Type == Constants.GGSettings.visit_data_client_referral &&
                                                                    x.InsertedDate.Year == today.Year &&
                                                                    x.InsertedDate.Month == today.Month).Select(x => x.Id).Distinct().Count();

                if (maternal_referrals > 0)
                {
                    //int activity2_records = GetIndividualUserPoints(activity2.Id, userId, today.Month, today.Year).Count;
                    //if (activity2_records == 0 )
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
                    //            Points = activity2.Points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity2.Id,
                    //            Comment = "Total: " + maternal_referrals
                    //        }
                    //    );
                    //}
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

                // 4
                //"If a referral is made (ie, referral box checked) for MUAC under 22cm for at least 1 client then user earns 20 points.
                // That is, the following referral box is checked within the current month:
                // -May be underweight -MUAC less than 22cm"
                //"Monthly total (capped at 20) Points added as soon as goal reached within the month"

                int muac_referrals = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Mother.HealthCareWorker.UserId.ToString() == userId &&
                                                                    x.VisitData.VisitSection == Constants.GGSettings.mother_growth &&
                                                                    x.Type == Constants.GGSettings.visit_data_client_referral &&
                                                                    x.InsertedDate.Year == today.Year &&
                                                                    x.InsertedDate.Month == today.Month).Select(x => x.Id).Distinct().Count();
                if (muac_referrals > 0)
                {
                    //int activity4_records = GetIndividualUserPoints(activity4.Id, userId, today.Month, today.Year).Count;
                    //if (activity4_records == 0)
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
                    //            Points = activity4.Points,
                    //            UserId = new Guid(userId),
                    //            PointsLibraryId = activity4.Id,
                    //            Comment = "Total: " + muac_referrals
                    //        }
                    //    );
                    //}
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

    }
}
