using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using static iTextSharp.text.pdf.AcroFields;

namespace EcdLink.Api.CoreApi.Services
{
    public class PointsEngineService : IPointsEngineService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private readonly IGenericRepository<PointsLibrary, Guid> _pointsLibraryRepo;
        private readonly IGenericRepository<PointsUser, Guid> _pointsUserRepo;
        private readonly IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;

        private readonly IGenericRepository<Infant, Guid> _infantRepo;
        private readonly IGenericRepository<Mother, Guid> _motherRepo;
        private readonly IGenericRepository<Child, Guid> _childRepo;
        private readonly IGenericRepository<Practitioner, Guid> _practitionerRepo;

        private readonly IGenericRepository<Visit, Guid> _visitRepo;
        private readonly IGenericRepository<VisitData, Guid> _visitDataRepo;
        private readonly IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;

        private readonly IGenericRepository<Classroom, Guid> _classRepo;

        private readonly IGenericRepository<StatementsIncomeStatement, Guid> _statementsIncomeStatementRepo;
        private readonly IGenericRepository<StatementsIncome, Guid> _statementsIncomeRepo;
        private readonly IGenericRepository<StatementsIncomeType, Guid> _statementsIncomeTypeRepo;
        private readonly IGenericRepository<StatementsContributionType, Guid> _statementsContributionTypeRepo;

        private readonly IGenericRepository<IntegrationAudit, Guid> _integrationAuditRepo;

        private readonly IGenericRepository<Club, Guid> _clubRepo;
        private readonly IGenericRepository<ClubMember, Guid> _clubMemberRepo;
        private readonly IGenericRepository<ClubLeader, Guid> _clubLeaderRepo;
        private readonly IGenericRepository<ClubSupport, Guid> _clubSupportRepo;
        private readonly IGenericRepository<PQARating, Guid> _pqaRatingRepo;
        private readonly IGenericRepository<ClubPoints, Guid> _clubPointsRepo;
        private readonly IGenericRepository<ClubPointsLibrary, Guid> _clubPointsLibraryRepo;

        private readonly ChildAttendanceReport _childAttendanceReport;

        private VisitManager _visitManager;

        private readonly string _uId;

        public PointsEngineService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            ChildAttendanceReport childAttendanceReport,
            VisitManager visitManager
            )
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _uId = _contextAccessor.HttpContext.GetUser()?.Id;
            
            _pointsLibraryRepo = _repositoryFactory.CreateGenericRepository<PointsLibrary>(userContext: _uId);
            _pointsUserRepo = _repositoryFactory.CreateGenericRepository<PointsUser>(userContext: _uId);
            _pointsUserSummaryRepo = _repositoryFactory.CreateGenericRepository<PointsUserSummary>(userContext: _uId);

            _infantRepo = _repositoryFactory.CreateGenericRepository<Infant>(userContext: _uId);
            _motherRepo = _repositoryFactory.CreateGenericRepository<Mother>(userContext: _uId);
            _practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
            _childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);

            _visitRepo = _repositoryFactory.CreateGenericRepository<Visit>(userContext: _uId);
            _visitDataRepo = _repositoryFactory.CreateGenericRepository<VisitData>(userContext: _uId);
            _visitDataStatusRepo = _repositoryFactory.CreateGenericRepository<VisitDataStatus>(userContext: _uId);

            _statementsIncomeStatementRepo = _repositoryFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _uId);
            _statementsIncomeRepo = _repositoryFactory.CreateGenericRepository<StatementsIncome>(userContext: _uId);
            _statementsIncomeTypeRepo = _repositoryFactory.CreateGenericRepository<StatementsIncomeType>(userContext: _uId);
            _statementsContributionTypeRepo = _repositoryFactory.CreateGenericRepository<StatementsContributionType>(userContext: _uId);

            _classRepo = _repositoryFactory.CreateGenericRepository<Classroom>(userContext: _uId);
            _integrationAuditRepo = _repositoryFactory.CreateRepository<IntegrationAudit>(userContext: _uId);

            _clubMemberRepo = _repositoryFactory.CreateGenericRepository<ClubMember>(userContext: _uId);

            _childAttendanceReport = childAttendanceReport;
            _clubRepo = _repositoryFactory.CreateGenericRepository<Club>(userContext: _uId);
            _clubMemberRepo = _repositoryFactory.CreateGenericRepository<ClubMember>(userContext: _uId);
            _clubLeaderRepo = _repositoryFactory.CreateGenericRepository<ClubLeader>(userContext: _uId);
            _clubSupportRepo = _repositoryFactory.CreateGenericRepository<ClubSupport>(userContext: _uId);
            _clubPointsRepo = _repositoryFactory.CreateGenericRepository<ClubPoints>(userContext: _uId);
            _clubPointsLibraryRepo = _repositoryFactory.CreateGenericRepository<ClubPointsLibrary>(userContext: _uId);

            _pqaRatingRepo = _repositoryFactory.CreateGenericRepository<PQARating>(userContext: _uId);

            _childAttendanceReport = childAttendanceReport;
            _visitManager = visitManager;
        }

        #region PointsLibrary

        public List<PointsLibrary> GetPointsLibraryForActivity(string activity)
        {
            return _pointsLibraryRepo.GetAll().Where(x => x.Activity == activity).ToList();
        }

        public List<PointsLibrary> GetPointsLibraryForTenant()
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return _pointsLibraryRepo.GetAll().Where(x => x.TenantId == tenantId).ToList();
        }

        public List<PointsUser> GetIndividualUserPoints(Guid pointsLibraryId, string userId, int month, int year)
        {
            return _pointsUserRepo.GetAll().Where(x => x.PointsLibraryId == pointsLibraryId && x.UserId == userId && x.Month == month && x.Year == year).ToList();
        }

        public List<PointsUserSummary> GetSummaryUserPoints(string userId, DateTime startDate, DateTime? endDate = null)
        {
            return _pointsUserSummaryRepo.GetAll().Where(
                x => x.UserId == userId &&
                // After the start
                (x.Year > startDate.Year || (x.Year == startDate.Year && x.Month >= startDate.Month)) &&
                // Before the end or no end date
                (!endDate.HasValue || x.Year < endDate.Value.Year || (x.Year == endDate.Value.Year && x.Month <= endDate.Value.Month))).ToList();
        }

        public PointsUser InsertIndividualUserPoints(PointsUser input)
        {
            return _pointsUserRepo.Insert(input);
        }

        public PointsUser UpdateIndividualUserPoints(PointsUser input)
        {
            return _pointsUserRepo.Update(input);
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

        #region GG_ClientRegistration

        public bool CalculatePregnantMomClientRegistration(string userId, DateTime today)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.client_registration);
            PointsLibrary activity2 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac2).FirstOrDefault();
            PointsLibrary activity3 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac3).FirstOrDefault();
            PointsLibrary activity4 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac4).FirstOrDefault();

            var mothers = _motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId == userId &&
                                          x.IsActive == true &&
                                          x.InsertedDate.Year == today.Year &&
                                          x.InsertedDate.Month == today.Month &&
                                          x.ExpectedDateOfDelivery != null).ToList();
            if (mothers.Count > 0) {

                // Complete client registration flow for 2 or more pregnant women
                if (mothers.Count >= 2)
                {
                    int activity2_records = GetIndividualUserPoints(activity2.Id, userId, today.Month, today.Year).Count;

                    if (activity2_records == 0)
                    {
                     var result =   InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity2.Points,
                                UserId = userId,
                                PointsLibraryId = activity2.Id,
                                Comment = "Total: " + mothers.Count
                            }
                        );
                    }
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
                    int activity3_records = GetIndividualUserPoints(activity3.Id, userId, today.Month, today.Year).Count;
                    if (activity3_records == 0) {
                        InsertIndividualUserPoints(
                        new PointsUser
                        {
                            Id = Guid.NewGuid(),
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            UpdatedBy = _uId,
                            Month = today.Month,
                            Year = today.Year,
                            Points = activity3.Points,
                            UserId = userId,
                            PointsLibraryId = activity3.Id,
                            Comment = "Total: " + lessThan20Weeks
                        }
                        );
                    }
                }
                // Complete the client registration flow for 3 or more pregnant clients who are less than 20 weeks into pregnancy.
                if (lessThan20Weeks >= 3)
                {
                    int activity4_records = GetIndividualUserPoints(activity4.Id, userId, today.Month, today.Year).Count;
                    if (activity4_records == 0)
                    {
                        InsertIndividualUserPoints(
                        new PointsUser
                        {
                            Id = Guid.NewGuid(),
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            UpdatedBy = _uId,
                            Month = today.Month,
                            Year = today.Year,
                            Points = activity4.Points,
                            UserId = userId,
                            PointsLibraryId = activity4.Id,
                            Comment = "Total: " + lessThan20Weeks
                        }
                        );
                    }
                }
                UpdateUserSummaryPoints(userId, today);
            }
            return true;
        }

        public bool CalculateInfantClientRegistration(string userId, DateTime today)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.client_registration);
            PointsLibrary activity1 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac1).FirstOrDefault();

            // Complete the client registration flow for 5 or more children under the age of 2 years old
            var childData = _infantRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.User.Id == userId &&
                                               x.IsActive == true &&
                                               x.InsertedDate.Year == today.Year &&
                                               x.InsertedDate.Month == today.Month).ToList();

            var childrenCount = childData.Where(x => x.User.Age > 0 && x.User.Age <= 2).Select(x => x.Id).Distinct().Count();

            if (childrenCount >= 5)
            {
                // Get user records for userId
                int activity1_records = GetIndividualUserPoints(activity1.Id, userId, today.Month, today.Year).Count;
                if (activity1_records == 0)
                {
                    InsertIndividualUserPoints(
                        new PointsUser
                        {
                            Id = Guid.NewGuid(),
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            UpdatedBy = _uId,
                            Month = today.Month,
                            Year = today.Year,
                            Points = activity1.Points,
                            UserId = userId,
                            PointsLibraryId = activity1.Id,
                            Comment = "Total: " + childrenCount
                        }
                    );
                }
                UpdateUserSummaryPoints(userId, today);
            }

            return true;
        }

        #endregion

        #region GG_PregnantMom_Visits

        public bool CalculatePregnantMomVisits(string userId, DateTime today)
        {
            bool hasMothers = _motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId == userId && x.IsActive == true).Count() != 0;

            if (hasMothers)
            {
                List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.pregnant_mom_clients);
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
                    int monthVisits = _visitRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId == userId && 
                                                                x.Attended == false && 
                                                                x.DueDate.HasValue &&
                                                                x.DueDate.Value.Year == today.Year &&
                                                                x.DueDate.Value.Month == today.Month).Select(x => x.Id).Distinct().Count();

                    if (monthVisits == 0)
                    {
                        int activity1_records = GetIndividualUserPoints(activity1.Id, userId, today.Month, today.Year).Count;
                        if (activity1_records == 0)
                        {
                            InsertIndividualUserPoints(
                                new PointsUser
                                {
                                    Id = Guid.NewGuid(),
                                    IsActive = true,
                                    InsertedDate = DateTime.Now,
                                    UpdatedBy = _uId,
                                    Month = today.Month,
                                    Year = today.Year,
                                    Points = activity1.Points,
                                    UserId = userId,
                                    PointsLibraryId = activity1.Id,
                                    Comment = "Total: " + monthVisits
                                }
                            );
                        }
                    }
                }

                // 2
                //"If one of the following referral boxes were checked for at least 1 client:
                //-Lethabo had thoughts and plans to harm herself or commit suicide
                //-Lethabo was experiencing maternal distress user earns 20 points." - flag
                // "Monthly total (capped at 20) Points added as soon as goal reached within the month"
                int maternal_referrals = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Mother.HealthCareWorker.UserId == userId &&
                                                                    x.VisitData.VisitSection == Constants.GGSettings.maternal_distress_screening &&
                                                                    x.Type == Constants.GGSettings.visit_data_client_referral &&
                                                                    x.InsertedDate.Year == today.Year &&
                                                                    x.InsertedDate.Month == today.Month).Select(x => x.Id).Distinct().Count();

                if (maternal_referrals > 0 )
                {
                    int activity2_records = GetIndividualUserPoints(activity2.Id, userId, today.Month, today.Year).Count;
                    if (activity2_records == 0 )
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity2.Points,
                                UserId = userId,
                                PointsLibraryId = activity2.Id,
                                Comment = "Total: " + maternal_referrals
                            }
                        );
                    }
                }


                // 3
                //"If no ""Visit 1""s for pregnant moms are overdue or have been missed by the end of the month, user earns 50 points.
                //(This means the question on G6.2.1 is answered for all new clients; any ideas of how to make this easier to calculate ?) "
                //"Monthly total (capped at 50)  Calculated at the end of the month."
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    int visit1_count = _visitDataRepo.GetAll().Where(x => x.Visit.Mother.HealthCareWorker.UserId == userId &&
                                                                x.Visit.Attended == false &&
                                                                x.Visit.VisitType.Name == Constants.GGSettings.visit1 &&
                                                                x.InsertedDate.Year == today.Year &&
                                                                x.InsertedDate.Month == today.Month).Select(x => x.Id).Distinct().Count();
                    if (visit1_count == 0)
                    {
                        int activity3_records = GetIndividualUserPoints(activity3.Id, userId, today.Month, today.Year).Count;
                        if (activity3_records == 0)
                        {
                            InsertIndividualUserPoints(
                                new PointsUser
                                {
                                    Id = Guid.NewGuid(),
                                    IsActive = true,
                                    InsertedDate = DateTime.Now,
                                    UpdatedBy = _uId,
                                    Month = today.Month,
                                    Year = today.Year,
                                    Points = activity3.Points,
                                    UserId = userId,
                                    PointsLibraryId = activity3.Id,
                                    Comment = "Total: " + visit1_count
                                }
                            );
                        }
                    }
                }

                // 4
                //"If a referral is made (ie, referral box checked) for MUAC under 22cm for at least 1 client then user earns 20 points.
                // That is, the following referral box is checked within the current month:
                // -May be underweight -MUAC less than 22cm"
                //"Monthly total (capped at 20) Points added as soon as goal reached within the month"

                int muac_referrals = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Mother.HealthCareWorker.UserId == userId &&
                                                                    x.VisitData.VisitSection == Constants.GGSettings.mother_growth &&
                                                                    x.Type == Constants.GGSettings.visit_data_client_referral &&
                                                                    x.InsertedDate.Year == today.Year &&
                                                                    x.InsertedDate.Month == today.Month).Select(x => x.Id).Distinct().Count();
                if (muac_referrals > 0)
                {
                    int activity4_records = GetIndividualUserPoints(activity4.Id, userId, today.Month, today.Year).Count;
                    if (activity4_records == 0)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity4.Points,
                                UserId = userId,
                                PointsLibraryId = activity4.Id,
                                Comment = "Total: " + muac_referrals
                            }
                        );
                    }
                }

                // 5
                // Screening for substance abuse "up to date"
                // If no visits overdue or missing for pregnant mom clients by the end of the month, user earns 50 points.
                // "Monthly total (capped at 50) Calculated at the end of the month."
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    int abuseVisits = _visitDataRepo.GetAll().Where(x => x.Visit.Mother.HealthCareWorker.UserId == userId &&
                                                                x.Visit.DueDate.HasValue && 
                                                                x.Visit.DueDate.Value.Year == today.Year &&
                                                                x.Visit.DueDate.Value.Month == today.Month).Select(x => x.Id).Distinct().Count();
                    if (abuseVisits == 0)
                    {
                        int activity5_records = GetIndividualUserPoints(activity5.Id, userId, today.Month, today.Year).Count;
                        if (activity5_records == 0)
                        {
                            InsertIndividualUserPoints(
                                new PointsUser
                                {
                                    Id = Guid.NewGuid(),
                                    IsActive = true,
                                    InsertedDate = DateTime.Now,
                                    UpdatedBy = _uId,
                                    Month = today.Month,
                                    Year = today.Year,
                                    Points = activity5.Points,
                                    UserId = userId,
                                    PointsLibraryId = activity5.Id,
                                    Comment = "Total: " + abuseVisits
                                }
                            );
                        }
                    }
                }
                UpdateUserSummaryPoints(userId, today);
            }
            return true;
        }

        #endregion

        #region GG_Infants

        public bool CalculateInfantVisits(string userId, DateTime today)
        {
            bool hasChildren = _infantRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId == userId && x.IsActive == true).Count() != 0;

            if (hasChildren)
            {
                List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_clients);
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
                    List<VisitData> ac1 = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                (x.Question == Constants.GGSettings.q_csg_receiving && x.QuestionAnswer == Constants.GGSettings.answer_yes) &&
                                                                (x.InsertedDate.Year == today.Year &&
                                                                x.InsertedDate.Month == today.Month)).ToList();

                    if (ac1.Count > 0)
                    {
                        var names = ac1.Select(x => x.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                        comment = "Total: " + ac1.Count + " - " + string.Join(",", names);

                        int activity1_records = GetIndividualUserPoints(activity1.Id, userId, today.Month, today.Year).Count;
                        if (activity1_records == 0)
                        {
                            InsertIndividualUserPoints(
                                new PointsUser
                                {
                                    Id = Guid.NewGuid(),
                                    IsActive = true,
                                    InsertedDate = DateTime.Now,
                                    UpdatedBy = _uId,
                                    Month = today.Month,
                                    Year = today.Year,
                                    Points = activity1.Points,
                                    UserId = userId,
                                    PointsLibraryId = activity1.Id,
                                    Comment = comment
                                }
                            );
                        }
                    }
                }

                // 2
                // "Love, play and talk for healthy development guide All children screened"
                // "Monthly total (capped at 100) Calculated at the end of the month."
                // 14 week; 6 month; 9 month; 12 month; 18 month
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    List<VisitData> completed_pillar2Data = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitName == Constants.GGSettings.pillar2_db &&
                                                                (x.InsertedDate.Year == today.Year &&
                                                                x.InsertedDate.Month == today.Month)
                                                                ).ToList();
                    
                    List<Visit> due_pillar2Data = _visitRepo.GetAll().Where(x => x.Infant.Caregiver.HealthCareWorker.UserId == userId && x.InfantId != null && x.Attended == false && 
                                                                (x.DueDate.HasValue && x.DueDate.Value.Year == today.Year &&  x.DueDate.Value.Month == today.Month)).ToList();


                    int activity2_records = GetIndividualUserPoints(activity2.Id, userId, today.Month, today.Year).Count;
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
                                InsertIndividualUserPoints(
                                     new PointsUser
                                     {
                                         Id = Guid.NewGuid(),
                                         IsActive = true,
                                         InsertedDate = DateTime.Now,
                                         UpdatedBy = _uId,
                                         Month = today.Month,
                                         Year = today.Year,
                                         Points = activity2.Points,
                                         UserId = userId,
                                         PointsLibraryId = activity2.Id,
                                         Comment = comment
                                     }
                                 );
                            }
                        } else
                        {
                            if (completed_pillar2Data.Count != 0)
                            {
                                var names = completed_pillar2Data.Select(x => x.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                                comment = "Total: " + completed_pillar2Data.Count + " - " + string.Join(",", names);
                                InsertIndividualUserPoints(
                                    new PointsUser
                                    {
                                        Id = Guid.NewGuid(),
                                        IsActive = true,
                                        InsertedDate = DateTime.Now,
                                        UpdatedBy = _uId,
                                        Month = today.Month,
                                        Year = today.Year,
                                        Points = activity2.Points,
                                        UserId = userId,
                                        PointsLibraryId = activity2.Id,
                                        Comment = comment
                                    }
                                );
                            }
                        }
                    }
                }

                // 3 
                // Measuring childrens' growth length - normal measure count for month
                // no cap

                List<VisitDataStatus> ac3 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_length &&
                                                                x.VisitData.VisitSection != Constants.GGSettings.child_road_to_health &&
                                                                x.Comment == Constants.GGSettings.normal_comment &&
                                                                x.Type == Constants.GGSettings.visit_data_client_progress &&
                                                                (x.VisitData.InsertedDate.Year == today.Year &&
                                                                x.VisitData.InsertedDate.Month == today.Month)).ToList();

                if (ac3.Count > 0 )
                {
                    var activity3_points = ac3.Count * activity3.Points;
                    var names = ac3.Select(x => x.VisitData.Visit.Infant.User.FirstName).Distinct().OrderBy(x => x).ToList();
                    comment = "Total: " + ac3.Count + " - " + string.Join(",", names);

                    PointsUser activity3_record = GetIndividualUserPoints(activity3.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity3_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity3_points,
                                UserId = userId,
                                PointsLibraryId = activity3.Id,
                                Comment = comment
                            }
                        );
                    } else
                    {
                        activity3_record.Points = activity3_points;
                        activity3_record.UpdatedDate = DateTime.Now;
                        activity3_record.UpdatedBy = _uId;
                        activity3_record.Comment = comment;
                        UpdateIndividualUserPoints(activity3_record);
                    }
                }

                // 4 
                // Measuring childrens' growth length - referral not required
                // no cap
                List<VisitDataStatus> ac4 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
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

                    PointsUser activity4_record = GetIndividualUserPoints(activity4.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity4_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity4_points,
                                UserId = userId,
                                PointsLibraryId = activity4.Id,
                                Comment = comment
                            }
                        );
                    }
                    else
                    {
                        activity4_record.Points = activity4_points;
                        activity4_record.UpdatedDate = DateTime.Now;
                        activity4_record.UpdatedBy = _uId;
                        activity4_record.Comment = comment;
                        UpdateIndividualUserPoints(activity4_record);
                    }
                }

                // 5
                // Measuring childrens' growth length - referral required
                // no cap
                List<VisitDataStatus> ac5 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
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

                    PointsUser activity5_record = GetIndividualUserPoints(activity5.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity5_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity5_points,
                                UserId = userId,
                                PointsLibraryId = activity5.Id,
                                Comment = comment
                            }
                        );
                    }
                    else
                    {
                        activity5_record.Points = activity5_points;
                        activity5_record.UpdatedDate = DateTime.Now;
                        activity5_record.UpdatedBy = _uId;
                        activity5_record.Comment = comment;
                        UpdateIndividualUserPoints(activity5_record);
                    }
                }

                // 6
                // Measuring childrens' growth weight - normal measure count for month
                // no cap
                List<VisitDataStatus> ac6 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
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

                    PointsUser activity6_record = GetIndividualUserPoints(activity6.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity6_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity6_points,
                                UserId = userId,
                                PointsLibraryId = activity6.Id,
                                Comment = comment
                            }
                        );
                    }
                    else
                    {
                        activity6_record.Points = activity6_points;
                        activity6_record.UpdatedDate = DateTime.Now;
                        activity6_record.UpdatedBy = _uId;
                        activity6_record.Comment = comment;
                        UpdateIndividualUserPoints(activity6_record);
                    }
                }

                // 7 
                // Measuring childrens' growth weight - referral not required
                // no cap
                List<VisitDataStatus> ac7 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
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

                    PointsUser activity7_record = GetIndividualUserPoints(activity7.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity7_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity7_points,
                                UserId = userId,
                                PointsLibraryId = activity7.Id,
                                Comment = comment
                            }
                        );
                    }
                    else
                    {
                        activity7_record.Points = activity7_points;
                        activity7_record.UpdatedDate = DateTime.Now;
                        activity7_record.UpdatedBy = _uId;
                        activity7_record.Comment = comment;
                        UpdateIndividualUserPoints(activity7_record);
                    }
                }

                // 8 
                // Measuring childrens' growth weight - referral required
                // no cap
                List<VisitDataStatus> ac8 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
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

                    PointsUser activity8_record = GetIndividualUserPoints(activity8.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity8_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity8_points,
                                UserId = userId,
                                PointsLibraryId = activity8.Id,
                                Comment = comment
                            }
                        );
                    }
                    else
                    {
                        activity8_record.Points = activity8_points;
                        activity8_record.UpdatedDate = DateTime.Now;
                        activity8_record.UpdatedBy = _uId;
                        activity8_record.Comment = comment;
                        UpdateIndividualUserPoints(activity8_record);
                    }
                }

                // 9
                // Measuring childrens' growth MUAC - normal
                // no cap
                List<VisitDataStatus> ac9 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
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

                    PointsUser activity9_record = GetIndividualUserPoints(activity9.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity9_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity9_points,
                                UserId = userId,
                                PointsLibraryId = activity9.Id,
                                Comment = comment
                            }
                        );
                    }
                    else
                    {
                        activity9_record.Points = activity9_points;
                        activity9_record.UpdatedDate = DateTime.Now;
                        activity9_record.UpdatedBy = _uId;
                        activity9_record.Comment = comment;
                        UpdateIndividualUserPoints(activity9_record);
                    }
                }

                // 10
                // Measuring childrens' growth MUAC - referral not required
                // no cap
                List<VisitDataStatus> ac10 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
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

                    PointsUser activity10_record = GetIndividualUserPoints(activity10.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity10_record == null)
                    {
                        InsertIndividualUserPoints(
                        new PointsUser
                        {
                            Id = Guid.NewGuid(),
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            UpdatedBy = _uId,
                            Month = today.Month,
                            Year = today.Year,
                            Points = activity10_points,
                            UserId = userId,
                            PointsLibraryId = activity10.Id,
                            Comment = comment
                        }
                       );
                    }
                    else
                    {
                        activity10_record.Points = activity10_points;
                        activity10_record.UpdatedDate = DateTime.Now;
                        activity10_record.UpdatedBy = _uId;
                        activity10_record.Comment = comment;
                        UpdateIndividualUserPoints(activity10_record);
                    }
                }

                // 11
                // Measuring childrens' growth MUAC - referral required
                // no cap
                List<VisitDataStatus> ac11 = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
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

                    PointsUser activity11_record = GetIndividualUserPoints(activity11.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity11_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity11_points,
                                UserId = userId,
                                PointsLibraryId = activity11.Id,
                                Comment = comment
                            }
                        );
                    }
                    else
                    {
                        activity11_record.Points = activity11_points;
                        activity11_record.UpdatedDate = DateTime.Now;
                        activity11_record.UpdatedBy = _uId;
                        activity11_record.Comment = comment;
                        UpdateIndividualUserPoints(activity11_record);
                    }
                }

                // 12
                // Vitamin A
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    List<VisitData> ac12 = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                (x.Question == Constants.GGSettings.q_vitamin_a && x.Question == Constants.GGSettings.answer_no) &&
                                                                (x.InsertedDate.Year == today.Year &&
                                                                x.InsertedDate.Month == today.Month)).ToList();

                    if (ac12.Count == 0)
                    {
                        comment = "Total: " + ac12.Count;

                        int activity12_records = GetIndividualUserPoints(activity12.Id, userId, today.Month, today.Year).Count;
                        if (activity12_records == 0)
                        {
                            InsertIndividualUserPoints(
                                new PointsUser
                                {
                                    Id = Guid.NewGuid(),
                                    IsActive = true,
                                    InsertedDate = DateTime.Now,
                                    UpdatedBy = _uId,
                                    Month = today.Month,
                                    Year = today.Year,
                                    Points = activity12.Points,
                                    UserId = userId,
                                    PointsLibraryId = activity12.Id,
                                    Comment = comment
                                }
                            );
                        }
                    }
                }

                // 13
                // Deworming
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    List<VisitData> ac13 = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                (x.Question == Constants.GGSettings.q_deworming && x.Question == Constants.GGSettings.answer_no) &&
                                                                (x.InsertedDate.Year == today.Year &&
                                                                x.InsertedDate.Month == today.Month)).ToList();

                    if (ac13.Count == 0)
                    {
                        comment = "Total: " + ac13.Count;

                        int activity13_records = GetIndividualUserPoints(activity13.Id, userId, today.Month, today.Year).Count;
                        if (activity13_records == 0)
                        {
                            InsertIndividualUserPoints(
                                new PointsUser
                                {
                                    Id = Guid.NewGuid(),
                                    IsActive = true,
                                    InsertedDate = DateTime.Now,
                                    UpdatedBy = _uId,
                                    Month = today.Month,
                                    Year = today.Year,
                                    Points = activity13.Points,
                                    UserId = userId,
                                    PointsLibraryId = activity13.Id,
                                    Comment = comment
                                }
                            );
                        }
                    }
                }
            
                // 14
                // Immunisations
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    List<VisitData> ac14 = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                            (x.Question == Constants.GGSettings.q_immunisation && x.Question == Constants.GGSettings.answer_no) &&
                                                                            (x.InsertedDate.Year == today.Year &&
                                                                            x.InsertedDate.Month == today.Month)).ToList();

                    if (ac14.Count == 0)
                    {
                        comment = "Total: " + ac14.Count;

                        int activity14_records = GetIndividualUserPoints(activity14.Id, userId, today.Month, today.Year).Count;
                        if (activity14_records == 0)
                        {
                            InsertIndividualUserPoints(
                                new PointsUser
                                {
                                    Id = Guid.NewGuid(),
                                    IsActive = true,
                                    InsertedDate = DateTime.Now,
                                    UpdatedBy = _uId,
                                    Month = today.Month,
                                    Year = today.Year,
                                    Points = activity14.Points,
                                    UserId = userId,
                                    PointsLibraryId = activity14.Id,
                                    Comment = comment
                                }
                            );
                        }
                    }
                }
                UpdateUserSummaryPoints(userId, today);
            }
            return true;
        }

        #endregion

        #region UserSummary

        // Used for grow great, where multiple categories are scored at once
        private void UpdateUserSummaryPoints(string userId, DateTime today)
        {
            var allRecords = GetPointsLibraryForTenant();

            foreach (var activity in allRecords) 
            {
                UpdateUserSummaryPoints(userId, activity, today);
            }
        }

        private void UpdateUserSummaryPoints(string userId, PointsLibrary activity, DateTime today, bool isPrincipalOrAdmin = false)
        {
            var pointsScoredThisYear = _pointsUserRepo.GetAll().Where(x => x.UserId == userId && x.Year == today.Year && x.PointsLibraryId == activity.Id).ToList();

            int monthTotal = pointsScoredThisYear.Where(x => x.Month == today.Month).Select(x => x.Points).Sum();
            int ytdTotal = pointsScoredThisYear.Select(x => x.Points).Sum();

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
                var record = _pointsUserSummaryRepo.GetAll().Where(x => x.UserId == userId && x.Month == today.Month && x.Year == today.Year && x.PointsLibraryId == activity.Id).FirstOrDefault();
                if (record == null)
                {
                    InsertIndividualSummaryUserPoints(
                        new PointsUserSummary
                        {
                            Id = Guid.NewGuid(),
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            UpdatedBy = _uId,
                            Month = today.Month,
                            Year = today.Year,
                            UserId = userId,
                            PointsLibraryId = activity.Id,
                            PointsTotal = monthTotal,
                            PointsYTD = ytdTotal,
                            TimesScored = 1,
                        }
                    );
                } else
                {
                    record.PointsTotal = monthTotal;
                    record.PointsYTD = ytdTotal;
                    record.UpdatedDate = DateTime.Now;
                    record.UpdatedBy = _uId;
                    record.TimesScored = record.TimesScored + 1;

                    UpdateIndividualSummaryUserPoints(record);
                }
            }
        }

        #endregion

        #region SS_Children

        public bool CalculateChildrenRegistrationAdd(string userId, DateTime today)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_data_collection);
            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac1).FirstOrDefault();

            Practitioner practitioner = _practitionerRepo.GetByUserId(userId);

            var children = _childRepo.GetAll().Where(x => x.User.IsActive == true && x.Hierarchy.StartsWith(practitioner.Hierarchy)).ToList(); ;
            var childCount = children.Where(x => x.InsertedDate.Year == today.Year && x.InsertedDate.Month == today.Month).Select(x => x.Id).Distinct().Count();

            if (childCount > 0)
            {
                PointsUser activity_record = GetIndividualUserPoints(activity.Id, userId, today.Month, today.Year).FirstOrDefault();
                int activityPoints = childCount * activity.Points;

                if (activity_record == null)
                {
                    InsertIndividualUserPoints(
                        new PointsUser
                        {
                            Id = Guid.NewGuid(),
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            UpdatedBy = _uId,
                            Month = today.Month,
                            Year = today.Year,
                            Points = activityPoints,
                            UserId = userId,
                            PointsLibraryId = activity.Id,
                            Comment = "Total: " + childCount
                        }
                    );
                }
                else
                {
                    activity_record.Points = activityPoints;
                    activity_record.UpdatedDate = DateTime.Now;
                    activity_record.UpdatedBy = _uId;
                    UpdateIndividualUserPoints(activity_record);
                }
                UpdateUserSummaryPoints(
                    userId, 
                    activity, 
                    today, 
                    (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value) || (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value));
            }
            return true;
        }

        public bool CalculateChildrenRegistrationRemoval(string userId, DateTime today)
        {
            Practitioner practitioner = _practitionerRepo.GetByUserId(userId);
            if (practitioner != null && !string.IsNullOrEmpty(practitioner.Hierarchy))
            {
                // Reading from audit table to retrieve data for practitioner 
                var childCount = (from integrationAudit in _integrationAuditRepo.GetAll().Where(x => x.Entity == "Child" &&
                                                                                              x.Property == "IsActive" &&
                                                                                              x.ValueBefore == "True" &&
                                                                                              x.ValueAfter == "False" &&
                                                                                              x.UpdatedDate.Year == today.Year &&
                                                                                              x.UpdatedDate.Month == today.Month).OrderBy(x => x.InsertedDate)
                                  join child in _childRepo.GetAll().Where(x => x.Hierarchy.StartsWith(practitioner.Hierarchy)) on integrationAudit.RelatedId equals child.Id.ToString()
                                  select child
                                ).Select(x => x.Id).Distinct().Count();

                if (childCount > 0)
                {
                    List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_data_collection);
                    PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac2).FirstOrDefault();

                    PointsUser activity_record = GetIndividualUserPoints(activity.Id, userId, today.Month, today.Year).FirstOrDefault();
                    int activityPoints = childCount * activity.Points;

                    if (activity_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activityPoints,
                                UserId = userId,
                                PointsLibraryId = activity.Id,
                                Comment = "Total: " + childCount
                            }
                        );
                    }
                    else
                    {
                        activity_record.Points = activityPoints;
                        activity_record.UpdatedDate = DateTime.Now;
                        activity_record.UpdatedBy = _uId;
                        activity_record.Comment = "Total: " + childCount;
                        UpdateIndividualUserPoints(activity_record);
                    }
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
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_data_collection);
            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac3).FirstOrDefault();
            List<Classroom> classrooms = _classRepo.GetListByUserId(userId);

            var totalExpectedAttendance = 0;
            var totalChildrenAttendedSessions = 0;
            foreach (var item in classrooms)
            {
                if (item.IsActive)
                {
                    var result = _childAttendanceReport.GetClassroomAttendanceOverView(item.Id, userId, today.GetStartOfMonth(), today.GetEndOfDay());

                    totalExpectedAttendance += result.TotalAttendanceStatsReport.TotalSessions;
                    totalChildrenAttendedSessions += result.TotalAttendanceStatsReport.TotalChildrenAttendedSessions;
                }
            }

            // Calculation: points awarded per the percentage of attendance registers submitted.
            // less than 50 % = 0 points

            var perc = 0.0;
            if (totalChildrenAttendedSessions != 0 && totalExpectedAttendance != 0)
            {
               perc = Math.Round((double)(totalChildrenAttendedSessions/ (double)(totalExpectedAttendance)) * 100);
            }

            if (perc > 50)
            {
                PointsUser activity_record = GetIndividualUserPoints(activity.Id, userId, today.Month, today.Year).FirstOrDefault();
                if (activity_record == null)
                {
                    InsertIndividualUserPoints(
                        new PointsUser
                        {
                            Id = Guid.NewGuid(),
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            UpdatedBy = _uId,
                            Month = today.Month,
                            Year = today.Year,
                            Points = (int)perc,
                            UserId = userId,
                            PointsLibraryId = activity.Id,
                            Comment = "Total: " + perc
                        }
                    );
                }
                else
                {
                    activity_record.Points = (int)perc;
                    activity_record.UpdatedDate = DateTime.Now;
                    activity_record.UpdatedBy = _uId;
                    activity_record.Comment = "Total: " + perc;
                    UpdateIndividualUserPoints(activity_record);
                }

                var practitioner = _practitionerRepo.GetByUserId(userId);
                UpdateUserSummaryPoints(
                    userId,
                    activity,
                    today,
                    (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value) || (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value));
            }
            return true;
        }

        #endregion

        #region SS_IncomeStatements

        public bool CalculateIncomeStatements(string userId, DateTime today)
        {
            CalculateIncomeStatementsSubmitted(userId, today);
            CalculateIncomeStatementPreSchoolFees(userId, today);
            CalculateThreeConsecutiveIncomeStatementsSubmitted(userId, today);
            return true;
        }

        public bool CalculateIncomeStatementsSubmitted(string userId, DateTime today)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.income_statement);
            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.income_statement_ac3).FirstOrDefault();

            DateTime deadline = today.GetStartOfMonth().AddDays(7);
            DateTime previousMonth = today.GetEndOfPreviousMonth().Date;

            Practitioner practitioner = _practitionerRepo.GetByUserId(userId);

            if (practitioner.IsFundaAppAdmin == true || practitioner.IsPrincipal == true)
            {
                List<StatementsIncomeStatement> rows = _statementsIncomeStatementRepo.GetAll().Where(x => x.UserId == userId && 
                                                                                                     x.Year == previousMonth.Year && 
                                                                                                     x.Month == previousMonth.Month && 
                                                                                                     x.Submitted == true && 
                                                                                                     x.IsActive == true &&
                                                                                                     x.SubmittedDate.Date >= today.GetStartOfMonth().Date &&
                                                                                                     x.SubmittedDate.Date <= deadline.Date).ToList();

                if (rows.Count > 0)
                {
                    PointsUser activity_record = GetIndividualUserPoints(activity.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity.Points,
                                UserId = userId,
                                PointsLibraryId = activity.Id,
                                Comment = "Total: " + rows.Count
                            }
                        );
                    }
                    else
                    {
                        activity_record.Points = activity.Points;
                        activity_record.UpdatedDate = DateTime.Now;
                        activity_record.UpdatedBy = _uId;
                        activity_record.Comment = "Total: " + rows.Count;
                        UpdateIndividualUserPoints(activity_record);
                    }

                    UpdateUserSummaryPoints(
                        userId,
                        activity,
                        today,
                        (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value) || (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value));
                }
            }
            return true;
        }

        public bool CalculateIncomeStatementPreSchoolFees(string userId, DateTime today)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.income_statement);
            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.income_statement_ac2).FirstOrDefault();
            
            DateTime deadline = today.GetStartOfMonth().AddDays(7);
            DateTime previousMonth = today.GetEndOfPreviousMonth().Date;

            Practitioner practitioner = _practitionerRepo.GetByUserId(userId);

            if (practitioner.IsFundaAppAdmin == true || practitioner.IsPrincipal == true)
            {
                var totalPractitionerChildren = _childRepo.GetAll().Where(x => x.User.IsActive == false && x.Hierarchy.StartsWith(practitioner.Hierarchy)).Count();

                List<StatementsIncomeType> incomeTypes = GetAllStatementIncomeTypes(userId, previousMonth.Year, previousMonth.Month);
                List<StatementsContributionType> contributionTypes = GetAllStatementContributionTypes(userId, previousMonth.Year, previousMonth.Month);

                var preschoolFeeId = incomeTypes.Where(x => x.Description == IncomeExpensePDF.PRESCHOOL_FEE).Select(y => y.Id).FirstOrDefault();
                var moneyId = contributionTypes.Where(x => x.Description == IncomeExpensePDF.MONEY).Select(y => y.Id).FirstOrDefault();

                var money_preschoolData = _statementsIncomeRepo.GetAll().Where(x => string.Equals(x.UserId, userId) && x.IsActive == true
                                                                                && x.DateReceived.Year.Equals(previousMonth.Year)
                                                                                && x.DateReceived.Month.Equals(previousMonth.Month)
                                                                                && x.Submitted.Equals(true)
                                                                                && x.IncomeTypeId == preschoolFeeId.ToString()
                                                                                && x.ContributionTypeId == moneyId.ToString())
                                                                                .Select(x => x.ChildUserId).Distinct().ToList();

                var non_money_preschoolData = _statementsIncomeRepo.GetAll().Where(x => string.Equals(x.UserId, userId) && x.IsActive == true
                                                                                && x.DateReceived.Year.Equals(previousMonth.Year)
                                                                                && x.DateReceived.Month.Equals(previousMonth.Month)
                                                                                && x.Submitted.Equals(true)
                                                                                && x.IncomeTypeId == preschoolFeeId.ToString()
                                                                                && x.ContributionTypeId != moneyId.ToString())
                                                                                .Select(x => x.ChildUserId).Distinct().ToList();

               // This excludes duplicates from the return set
               var all_children = money_preschoolData.Union(non_money_preschoolData).Count();
               if (totalPractitionerChildren == all_children) {
                    
                    PointsUser activity_record = GetIndividualUserPoints(activity.Id, userId, today.Month, today.Year).FirstOrDefault();
                    if (activity_record == null)
                    {
                        InsertIndividualUserPoints(
                            new PointsUser
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                InsertedDate = DateTime.Now,
                                UpdatedBy = _uId,
                                Month = today.Month,
                                Year = today.Year,
                                Points = activity.Points,
                                UserId = userId,
                                PointsLibraryId = activity.Id,
                                Comment = "Total: " + totalPractitionerChildren + " | " + all_children
                            }
                        ); ;
                    }
                    else
                    {
                        activity_record.Points = activity.Points;
                        activity_record.UpdatedDate = DateTime.Now;
                        activity_record.UpdatedBy = _uId;
                        activity_record.Comment = "Total: " + totalPractitionerChildren + " | " + all_children;
                        UpdateIndividualUserPoints(activity_record);
                    }
                }

                UpdateUserSummaryPoints(
                    userId,
                    activity,
                    today,
                    (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value) || (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value));
            }
            return true;
        }

        private List<StatementsIncomeType> GetAllStatementIncomeTypes(string userId, int year, int month)
        {
            // Only return types linked to incomes for params
            return
            (
                from statementsIncome in _statementsIncomeRepo.GetAll().Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DateReceived.Year.Equals(year) && x.DateReceived.Month.Equals(month) && x.Submitted.Equals(true))
                join statementIncomeType in _statementsIncomeTypeRepo.GetAll().Where(x => x.IsActive == true).OrderBy(z => z.Description) on statementsIncome.IncomeTypeId equals statementIncomeType.Id.ToString()
                select statementIncomeType
            ).Distinct().ToList();
        }

        private List<StatementsContributionType> GetAllStatementContributionTypes(string userId, int year, int month)
        {
            // Only return types linked to incomes for params
            return
            (
                from statementsIncome in _statementsIncomeRepo.GetAll().Where(x => string.Equals(x.UserId, userId) && x.IsActive == true && x.DateReceived.Year.Equals(year) && x.DateReceived.Month.Equals(month) && x.Submitted.Equals(true))
                join statementContributionType in _statementsContributionTypeRepo.GetAll().Where(x => x.IsActive == true).OrderBy(z => z.Description) on statementsIncome.ContributionTypeId equals statementContributionType.Id.ToString()
                select statementContributionType
            ).Distinct().ToList();
        }

        public bool CalculateThreeConsecutiveIncomeStatementsSubmitted(string userId, DateTime today)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.income_statement);
            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.income_statement_ac4).FirstOrDefault();

            Practitioner practitioner = _practitionerRepo.GetByUserId(userId);

            if (practitioner.IsFundaAppAdmin == true || practitioner.IsPrincipal == true)
            {
                List<int> rows = _statementsIncomeStatementRepo.GetAll().Where(x => x.UserId == userId && x.Year == today.Year &&
                                                                                x.Submitted == true && x.IsActive == true).Select(x => x.SubmittedDate.Month).Distinct().ToList();
                rows.Sort();

                if (rows.Count > 1)
                {
                    // Split sorted months into batches of 3
                    int nSize = 3;
                    var subList = new List<List<int>>();
                    for (var i = 0; i < rows.Count; i += nSize)
                    {
                        var answer = rows.GetRange(i, Math.Min(nSize, rows.Count - i));
                        subList.Add(answer);
                    }

                    // Find consecutive numbers
                    var total = 0;
                    foreach (var row in subList)
                    {
                        var _answer = !row.Select((i, j) => i - j).Distinct().Skip(1).Any();
                        if (_answer)
                        {
                            total++;
                        }
                    }

                    if (total > 0)
                    {
                        var totalPoints = total * activity.Points;
                        PointsUser activity_record = GetIndividualUserPoints(activity.Id, userId, today.Month, today.Year).FirstOrDefault();
                        if (activity_record == null)
                        {
                            InsertIndividualUserPoints(
                                new PointsUser
                                {
                                    Id = Guid.NewGuid(),
                                    IsActive = true,
                                    InsertedDate = DateTime.Now,
                                    UpdatedBy = _uId,
                                    Month = today.Month,
                                    Year = today.Year,
                                    Points = totalPoints,
                                    UserId = userId,
                                    PointsLibraryId = activity.Id,
                                    Comment = "Total: " + total
                                }
                            );
                        }
                        else
                        {
                            activity_record.Points = totalPoints;
                            activity_record.UpdatedDate = DateTime.Now;
                            activity_record.UpdatedBy = _uId;
                            activity_record.Comment = "Total: " + total;
                            UpdateIndividualUserPoints(activity_record);
                        }
                    }

                    UpdateUserSummaryPoints(
                        userId,
                        activity,
                        today,
                        (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal.Value) || (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin.Value));
                }
            }
            return true;
        }

        public bool CalculatePreSchoolFees(string userId, DateTime today)
        {
            PointsLibrary activity = GetPointsLibraryForActivity(Constants.PointsEngineSettings.income_statement).Where(x => x.SubActivity == Constants.PointsEngineSettings.income_statement_ac1).FirstOrDefault();
            PointsUser activity_record = _pointsUserRepo.GetAll().Where(x => x.PointsLibraryId == activity.Id && x.UserId == userId && x.Year == today.Year).FirstOrDefault();

            if (activity_record == null)
            {
                InsertIndividualUserPoints(
                    new PointsUser
                    {
                        Id = Guid.NewGuid(),
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedBy = _uId,
                        Month = today.Month,
                        Year = today.Year,
                        Points = activity.Points,
                        UserId = userId,
                        PointsLibraryId = activity.Id
                    }
                );
                UpdateUserSummaryPoints(userId, activity, today);
            }

            return true;
        }

        #endregion

        /// <summary>
        /// Gets the percentile standing of a user within relative to others within the club
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public UserClubStandingModel GetUserClubStanding(string userId)
        {
            var practitionerId = _practitionerRepo.GetByUserId(userId).Id;
            ClubMember clubMember = _clubMemberRepo.GetAll().Where(x => x.IsActive && x.PractitionerId == practitionerId).FirstOrDefault();

            if (clubMember == null)
            {
                return new UserClubStandingModel();
            }

            var clubUserIds = _clubMemberRepo.GetAll()
                .Include(x => x.Practitioner)
                .Where(x => x.ClubId == clubMember.ClubId)
                .Select(x => x.Practitioner.UserId).ToList();

            var usersPoints = _pointsUserSummaryRepo.GetAll()
                .Where(x => clubUserIds.Contains(x.UserId))
                .GroupBy(x => x.UserId)
                .Select(x => new { UserId = x.First().UserId, PointsSummaries = x.Select(y => new { y.Month, y.PointsTotal }) })
                .ToList();

            var usersByMonth = usersPoints.Select(x => new { x.UserId, PointsTotal = x.PointsSummaries.Where(y => y.Month == DateTime.Now.Month).Sum(z => z.PointsTotal) }).ToList();
            var usersByYear = usersPoints.Select(x => new { x.UserId, PointsTotal = x.PointsSummaries.Sum(y => y.PointsTotal) }).ToList();

            var userMonthPosition = usersByMonth.FindIndex(x => x.UserId == userId);
            var userYearPosition = usersByYear.FindIndex(x => x.UserId == userId);

            var standing = new UserClubStandingModel();

            var totalMembers = clubUserIds.Count();

            // Check for first place tie
            var standingForCurrentMonth = userMonthPosition == 0 && usersByMonth.Count() > 1 && usersByMonth[0].PointsTotal == usersByMonth[1].PointsTotal
                    ? 99
                    : (totalMembers - userMonthPosition) * 100 / totalMembers;

            var standingForCurrentYear = userYearPosition == 0 && usersByYear.Count() > 1 && usersByYear[0].PointsTotal == usersByYear[1].PointsTotal
                    ? 99
                    : (totalMembers - userYearPosition) * 100 / totalMembers;


            return new UserClubStandingModel
            {
                PercentileStandingForCurrentMonth = standingForCurrentMonth,
                PercentileStandingForCurrentYear = standingForCurrentYear,
            };
        }
        #region Clubs

        // Yearly, calculate by 30 November and will be triggered by a cron job
        public bool CalculateLeaveNoOneBehind(Guid clubId, string coachUserId, DateTime today) 
        {
            List<string> practitioners = new List<string>();
            
            // get all participants linked to this club, to calculate PQA ratings
            List<string> clubMembers = _clubMemberRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive).Select(x => x.Practitioner.UserId).ToList();
            practitioners.AddRange(clubMembers);

            List<string> clubLeaders = _clubLeaderRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive).Select(x => x.Practitioner.UserId).ToList();
            practitioners.AddRange(clubLeaders);

            string clubSupport = _clubSupportRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive).Select(x => x.Practitioner.UserId).FirstOrDefault();
            practitioners.Add(clubSupport);

            // ensure we don't have any duplicate user Ids
            practitioners = practitioners.Distinct().ToList();

            Club club = _clubRepo.GetById(clubId);
            double greenRatings = 0;
            double orangeRatings = 0;
            double redRatings = 0;
            double finalRating = 0;
            List<Visit> allVisits = new List<Visit>();
            List<PQARating> pqaRatings = new List<PQARating>();
            Guid clubPointsLibraryId = new Guid();

            if (club?.League.LeagueType.Name == Constants.ClubSettings.name_purple)
            {
                clubPointsLibraryId = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.leave_no_one_behind && x.Type == Constants.ClubSettings.name_purple).Select(x => x.Id).FirstOrDefault();
                foreach (var practitionerUserId in practitioners)
                {
                    allVisits = _visitManager.GetPQAVisitsForPractitioner(practitionerUserId);
                    pqaRatings = _pqaRatingRepo.GetAll().Where(x => allVisits.Select(y => y.Id).Contains(x.VisitId)).ToList();
                    greenRatings += pqaRatings.Where(x => x.OverallRatingColor == MetricsColorEnum.Success.ToString()).Count();
                    orangeRatings += pqaRatings.Where(x => x.OverallRatingColor == MetricsColorEnum.Warning.ToString()).Count();
                    redRatings += pqaRatings.Where(x => x.OverallRatingColor == MetricsColorEnum.Error.ToString()).Count();
                }
            }
            else
            {
                clubPointsLibraryId = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.leave_no_one_behind && x.Type != Constants.ClubSettings.name_purple).Select(x => x.Id).FirstOrDefault();
                foreach (var practitionerUserId in practitioners)
                {
                    allVisits = _visitManager.GetReAccreditationVisitsForPractitioner(practitionerUserId);
                    pqaRatings = _pqaRatingRepo.GetAll().Where(x => allVisits.Select(y => y.Id).Contains(x.VisitId)).ToList();
                    greenRatings += pqaRatings.Where(x => x.OverallRatingColor == MetricsColorEnum.Success.ToString()).Count();
                    orangeRatings += pqaRatings.Where(x => x.OverallRatingColor == MetricsColorEnum.Warning.ToString()).Count();
                    redRatings += pqaRatings.Where(x => x.OverallRatingColor == MetricsColorEnum.Error.ToString()).Count();
                }
            }

            finalRating = greenRatings / (greenRatings + orangeRatings + redRatings);
            _clubPointsRepo.Insert(new ClubPoints()
            {
                Id = Guid.NewGuid(),
                ClubId = clubId,
                UserId = coachUserId,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _uId,
                IsActive = true,
                ClubPointsLibraryId = clubPointsLibraryId,
                Month = today.Month,
                Year = today.Year,
                Points = (int)finalRating,
                PointsYTD = (int)finalRating
            });

            return true;
        }

        public bool CalculateHostFamilyDays(Guid clubId, string userId, DateTime today)
        {
            Club club = _clubRepo.GetById(clubId);
            Guid clubPointsLibraryId = new Guid();
            if (club?.League.LeagueType.Name == Constants.ClubSettings.name_purple)
            {
                clubPointsLibraryId = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.host_family_days && x.Type == Constants.ClubSettings.name_purple).Select(x => x.Id).FirstOrDefault();
            } else
            {
                clubPointsLibraryId = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.host_family_days && x.Type != Constants.ClubSettings.name_purple).Select(x => x.Id).FirstOrDefault();
            }

            return true;
        }

        public bool CalculateCompleteChildProgressReports(Guid clubId, string userId, DateTime today)
        {
            Club club = _clubRepo.GetById(clubId);
            Guid clubPointsLibraryId = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.child_progress_reports && x.Type == Constants.ClubSettings.name_purple).Select(x => x.Id).FirstOrDefault();
            return true;
        }
        public bool CalculateCaptureChildAttendance(Guid clubId, string userId, DateTime today)
        {
            Club club = _clubRepo.GetById(clubId);
            Guid clubPointsLibraryId = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.capture_child_attendance && x.Type == Constants.ClubSettings.name_purple).Select(x => x.Id).FirstOrDefault();
            return true;
        }
        public bool CalculateMeetRegularly(Guid clubId, string userId, DateTime today)
        {
            Club club = _clubRepo.GetById(clubId);
            Guid clubPointsLibraryId = new Guid();
            if (club?.League.LeagueType.Name == Constants.ClubSettings.name_purple)
            {
                clubPointsLibraryId = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.meet_regularly && x.Type == Constants.ClubSettings.name_purple).Select(x => x.Id).FirstOrDefault();
            }
            else
            {
                clubPointsLibraryId = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.meet_regularly && x.Type != Constants.ClubSettings.name_purple).Select(x => x.Id).FirstOrDefault();
            }


            return true;
        }
        public bool CalculateBeCreative(Guid clubId, string userId, DateTime today)
        {
            Club club = _clubRepo.GetById(clubId);
            Guid clubPointsLibraryId = new Guid();
            if (club?.League.LeagueType.Name == Constants.ClubSettings.name_purple)
            {
                clubPointsLibraryId = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.be_creative && x.Type == Constants.ClubSettings.name_purple).Select(x => x.Id).FirstOrDefault();
            }
            else
            {
                clubPointsLibraryId = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.be_creative && x.Type != Constants.ClubSettings.name_purple).Select(x => x.Id).FirstOrDefault();
            }
            return true;
        }
        #endregion


    }
}
