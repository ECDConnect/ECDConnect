using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.SmartStart.Reports;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services
{
    public class PointsEngineService : IPointsEngineService
    {
        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private IGenericRepository<ServiceScheduler, Guid> _schedulerRepo;
        private IGenericRepository<PointsLibrary, Guid> _pointsLibraryRepo;
        private IGenericRepository<PointsUser, Guid> _pointsUserRepo;
        private IGenericRepository<PointsUserSummary, Guid> _pointsUserSummaryRepo;

        private IGenericRepository<Infant, Guid> _infantRepo;
        private IGenericRepository<Mother, Guid> _motherRepo;
        private IGenericRepository<Child, Guid> _childRepo;

        private IGenericRepository<Visit, Guid> _visitRepo;
        private IGenericRepository<VisitData, Guid> _visitDataRepo;
        private IGenericRepository<VisitDataStatus, Guid> _visitDataStatusRepo;

        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private IGenericRepository<StatementsIncomeStatement, Guid> _statementsIncomeStatementRepo;


        private PersonnelService _personnelService;
        private ChildAttendanceReport _childAttendanceReport;

        private string _uId;

        public PointsEngineService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            PersonnelService personnelService,
            ChildAttendanceReport childAttendanceReport)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _uId = _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : null;
            
            _schedulerRepo = _repositoryFactory.CreateGenericRepository<ServiceScheduler>(userContext: _uId);

            _pointsLibraryRepo = _repositoryFactory.CreateGenericRepository<PointsLibrary>(userContext: _uId);
            _pointsUserRepo = _repositoryFactory.CreateGenericRepository<PointsUser>(userContext: _uId);
            _pointsUserSummaryRepo = _repositoryFactory.CreateGenericRepository<PointsUserSummary>(userContext: _uId);

            _infantRepo = _repositoryFactory.CreateGenericRepository<Infant>(userContext: _uId);
            _motherRepo = _repositoryFactory.CreateGenericRepository<Mother>(userContext: _uId);

            _visitRepo = _repositoryFactory.CreateGenericRepository<Visit>(userContext: _uId);
            _visitDataRepo = _repositoryFactory.CreateGenericRepository<VisitData>(userContext: _uId);
            _visitDataStatusRepo = _repositoryFactory.CreateGenericRepository<VisitDataStatus>(userContext: _uId);

            _practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _uId);
            _childRepo = _repositoryFactory.CreateGenericRepository<Child>(userContext: _uId);
            _statementsIncomeStatementRepo = _repositoryFactory.CreateGenericRepository<StatementsIncomeStatement>(userContext: _uId);

            _personnelService = personnelService;
            _childAttendanceReport = childAttendanceReport;

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

        public List<PointsUser> GetIndividualUserPoints(string subActivity, string userId, int month, int year)
        {
            return _pointsUserRepo.GetAll().Where(x => x.PointsLibrary.SubActivity == subActivity && x.UserId == userId && x.Month == month && x.Year == year).ToList();
        }

        public List<PointsUserSummary> GetSummaryUserPoints(string userId, int year)
        {
            return _pointsUserSummaryRepo.GetAll().Where(x => x.UserId == userId && x.Year == year).ToList();
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

        public bool ManagePregnantMomClientRegistration(string userId)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.client_registration);
            PointsLibrary activity2 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac2).FirstOrDefault();
            PointsLibrary activity3 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac3).FirstOrDefault();
            PointsLibrary activity4 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac4).FirstOrDefault();

            DateTime today = DateTime.Now.Date;

            var mothers = _motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId == userId && 
                                                     x.IsActive == true && 
                                                     x.InsertedDate.Year == today.Year && 
                                                     x.InsertedDate.Month == today.Month && 
                                                     x.ExpectedDateOfDelivery != null).ToList();
            if (mothers.Count > 0) {

                // Complete client registration flow for 2 or more pregnant women
                if (mothers.Count >= 2)
                {
                    int activity2_records = GetIndividualUserPoints(activity2.SubActivity, userId, today.Month, today.Year).Count();

                    if (activity2_records == 0)
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
                            PointsLibraryId = activity2.Id
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
                    int activity3_records = GetIndividualUserPoints(activity3.SubActivity, userId, today.Month, today.Year).Count();
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
                            PointsLibraryId = activity3.Id
                        }
                        );
                    }
                }
                // Complete the client registration flow for 3 or more pregnant clients who are less than 20 weeks into pregnancy.
                if (lessThan20Weeks >= 3)
                {
                    int activity4_records = GetIndividualUserPoints(activity4.SubActivity, userId, today.Month, today.Year).Count();
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
                            PointsLibraryId = activity4.Id
                        }
                        );
                    }
                }
            }

            UpdateUserSummaryPoints(userId);
            return true;
        }

        public bool ManageInfantClientRegistration(string userId)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.client_registration);
            PointsLibrary activity1 = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.client_registration_ac1).FirstOrDefault();

            DateTime today = DateTime.Now.Date;

            // Complete the client registration flow for 5 or more children under the age of 2 years old
            var childrenCount = _infantRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId == userId &&
                                                           x.IsActive == true &&
                                                           x.InsertedDate.Year == today.Year &&
                                                           x.InsertedDate.Month == today.Month && x.User.Age < 2).Select(x => x.Id).Distinct().Count();
            if (childrenCount >= 5)
            {
                // Get user records for userId
                int activity1_records = GetIndividualUserPoints(activity1.SubActivity, userId, today.Month, today.Year).Count();
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
                            PointsLibraryId = activity1.Id
                        }
                    );
                }
            }

            UpdateUserSummaryPoints(userId);
            return true;
        }

        #endregion

        #region GG_PregnantMom_Visits

        public bool ManagePregnantMomVisits(string userId)
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

                DateTime today = DateTime.Now.Date;

                // 1
                // If no visits overdue or missing for pregnant mom clients by the end of the month, user earns 50 points.
                //"Monthly total (capped at 50) Calculated at the end of the month."
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    int monthVisits = _visitRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId == userId && 
                                                                x.Attended == false && 
                                                                x.DueDate.HasValue &&
                                                                (x.DueDate.Value.Year == today.Year &&
                                                                x.DueDate.Value.Month == today.Month)).Select(x => x.Id).Distinct().Count();

                    if (monthVisits == 0)
                    {
                        int activity1_records = GetIndividualUserPoints(activity1.SubActivity, userId, today.Month, today.Year).Count();
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
                                    PointsLibraryId = activity1.Id
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
                    int activity2_records = GetIndividualUserPoints(activity2.SubActivity, userId, today.Month, today.Year).Count();
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
                                PointsLibraryId = activity2.Id
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
                                                                x.VisitSection == Constants.GGSettings.mother_growth &&
                                                                x.Visit.DueDate.HasValue &&
                                                                (x.Visit.DueDate.Value.Year == today.Year &&
                                                                x.Visit.DueDate.Value.Month == today.Month)).Select(x => x.Id).Distinct().Count();
                    if (visit1_count > 0)
                    {
                        int activity3_records = GetIndividualUserPoints(activity3.SubActivity, userId, today.Month, today.Year).Count();
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
                                    PointsLibraryId = activity3.Id
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
                    int activity4_records = GetIndividualUserPoints(activity4.SubActivity, userId, today.Month, today.Year).Count();
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
                                PointsLibraryId = activity4.Id
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
                                                                x.Visit.Attended == false &&
                                                                x.VisitSection == Constants.GGSettings.alcohol_use &&
                                                                x.Visit.DueDate.HasValue &&
                                                                (x.Visit.DueDate.Value.Year == today.Year &&
                                                                x.Visit.DueDate.Value.Month == today.Month)).Select(x => x.Id).Distinct().Count();
                    if (abuseVisits == 0)
                    {
                        int activity5_records = GetIndividualUserPoints(activity5.SubActivity, userId, today.Month, today.Year).Count();
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
                                    PointsLibraryId = activity5.Id
                                }
                            );
                        }
                    }
                }
            }
            UpdateUserSummaryPoints(userId);
            return true;
        }

        #endregion

        #region GG_Infants

        public bool ManageInfantVisits(string userId)
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

                DateTime today = DateTime.Now.Date;


                // 1
                // Child support grant - all eligible children accessing the CSG
                // Monthly total (capped at 100) Calculated at the end of the month.
                // IF any of the children who have ever been marked eligible (""Yes"" response to ""Does Themba qualify....""), if they are not receiving CSG according to the most recent response,
                // the CHW does not receive points for this item.
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    int ac1_count = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                (x.Question == Constants.GGSettings.q_csg_qualify && x.Question == Constants.GGSettings.answer_yes) &&
                                                                (x.Question == Constants.GGSettings.q_csg_qualify && x.Question == Constants.GGSettings.answer_yes) &&
                                                                x.Visit.DueDate.HasValue &&
                                                                (x.Visit.DueDate.Value.Year == today.Year &&
                                                                x.Visit.DueDate.Value.Month == today.Month)).Select(x => x.Id).Distinct().Count();

                    if (ac1_count > 0)
                    {
                        int activity1_records = GetIndividualUserPoints(activity1.SubActivity, userId, today.Month, today.Year).Count();
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
                                    PointsLibraryId = activity1.Id
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
                    List<VisitData> pillar2Data = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.Visit.Attended == true &&
                                                                x.VisitSection == Constants.GGSettings.pillar2_db &&
                                                                x.Visit.DueDate.HasValue &&
                                                                (x.Visit.DueDate.Value.Year == today.Year &&
                                                                x.Visit.DueDate.Value.Month == today.Month)).ToList();

                    int activity2_records = GetIndividualUserPoints(activity2.SubActivity, userId, today.Month, today.Year).Count();
                    if (activity2_records == 0)
                    {
                        if (pillar2Data.Count == 0)
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
                                    PointsLibraryId = activity2.Id
                                }
                            );
                        } else
                        {
                            List<VisitData> children = new List<VisitData>();
                            foreach (var item in pillar2Data)
                            {
                                TimeSpan difference = today.Date.Subtract(item.Visit.Infant.User.DateOfBirth.Date);
                                double weeks = System.Math.Ceiling(difference.TotalDays / 7);

                                if (weeks <= 78.21)
                                {
                                    children.Add(item);
                                }
                            }

                            if (children.Count > 0 )
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
                                     PointsLibraryId = activity2.Id
                                 }
                             );
                            }

                        }
                    }
                }

                // 3 
                // Measuring childrens' growth length - normal measure count for month
                // no cap

                int ac3_count = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_length &&
                                                                x.Comment == Constants.GGSettings.normal_comment &&
                                                                x.VisitData.Visit.DueDate.HasValue &&
                                                                (x.VisitData.Visit.DueDate.Value.Year == today.Year &&
                                                                x.VisitData.Visit.DueDate.Value.Month == today.Month)).Select(x => x.VisitData.Visit.InfantId).Distinct().Count();

                if (ac3_count > 0 )
                {
                    var activity3_points = ac3_count * activity3.Points;
                    PointsUser activity3_record = GetIndividualUserPoints(activity3.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
                    if ( activity3_record == null)
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
                                     PointsLibraryId = activity3.Id
                                 }
                             );
                    } else
                    {
                        activity3_record.Points = activity3_points;
                        activity3_record.UpdatedDate = DateTime.Now;
                        activity3_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity3_record);
                    }
                }

                // 4 
                // Measuring childrens' growth length - referral not required
                // no cap
                int ac4_count = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_length &&
                                                                x.Comment != Constants.GGSettings.stunted &&
                                                                x.Comment != Constants.GGSettings.severely_stunted &&
                                                                x.Section != Constants.GGSettings.refer_to_clinic &&
                                                                x.Section != Constants.GGSettings.refer_to_clinic_urgently &&
                                                                x.VisitData.Visit.DueDate.HasValue &&
                                                                (x.VisitData.Visit.DueDate.Value.Year == today.Year &&
                                                                x.VisitData.Visit.DueDate.Value.Month == today.Month)).Select(x => x.VisitData.Visit.InfantId).Distinct().Count();
                if (ac4_count > 0)
                {
                    var activity4_points = ac4_count * activity4.Points;
                    PointsUser activity4_record = GetIndividualUserPoints(activity4.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                                     PointsLibraryId = activity4.Id
                                 }
                             );
                    }
                    else
                    {
                        activity4_record.Points = activity4_points;
                        activity4_record.UpdatedDate = DateTime.Now;
                        activity4_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity4_record);
                    }
                }

                // 5
                // Measuring childrens' growth length - referral required
                // no cap
                int ac5_count = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_length &&
                                                                x.Comment == Constants.GGSettings.stunted &&
                                                                x.Comment == Constants.GGSettings.severely_stunted &&
                                                                x.Section == Constants.GGSettings.refer_to_clinic &&
                                                                x.Section == Constants.GGSettings.refer_to_clinic_urgently &&
                                                                x.VisitData.Visit.DueDate.HasValue &&
                                                                (x.VisitData.Visit.DueDate.Value.Year == today.Year &&
                                                                x.VisitData.Visit.DueDate.Value.Month == today.Month)).Select(x => x.VisitData.Visit.InfantId).Distinct().Count();
                if (ac5_count > 0)
                {
                    var activity5_points = ac5_count * activity5.Points;
                    PointsUser activity5_record = GetIndividualUserPoints(activity5.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                                     PointsLibraryId = activity5.Id
                                 }
                             );
                    }
                    else
                    {
                        activity5_record.Points = activity5_points;
                        activity5_record.UpdatedDate = DateTime.Now;
                        activity5_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity5_record);
                    }
                }

                // 6
                // Measuring childrens' growth weight - normal measure count for month
                // no cap
                int ac6_count = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_weight &&
                                                                x.Comment == Constants.GGSettings.normal_comment &&
                                                                x.VisitData.Visit.DueDate.HasValue &&
                                                                (x.VisitData.Visit.DueDate.Value.Year == today.Year &&
                                                                x.VisitData.Visit.DueDate.Value.Month == today.Month)).Select(x => x.VisitData.Visit.InfantId).Distinct().Count();

                if (ac6_count > 0)
                {
                    var activity6_points = ac6_count * activity6.Points;
                    PointsUser activity6_record = GetIndividualUserPoints(activity6.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                                     PointsLibraryId = activity6.Id
                                 }
                             );
                    }
                    else
                    {
                        activity6_record.Points = activity6_points;
                        activity6_record.UpdatedDate = DateTime.Now;
                        activity6_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity6_record);
                    }
                }

                // 7 
                // Measuring childrens' growth weight - referral not required
                // no cap
                int ac7_count = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_weight &&
                                                                x.Comment != Constants.GGSettings.severely_underweight &&
                                                                x.Comment != Constants.GGSettings.growth_faltering &&
                                                                x.Comment != Constants.GGSettings.underweight3 &&
                                                                x.Comment != Constants.GGSettings.overweight &&
                                                                x.Comment != Constants.GGSettings.obese &&
                                                                x.VisitData.Visit.DueDate.HasValue &&
                                                                (x.VisitData.Visit.DueDate.Value.Year == today.Year &&
                                                                x.VisitData.Visit.DueDate.Value.Month == today.Month)).Select(x => x.VisitData.Visit.InfantId).Distinct().Count();
                if (ac7_count > 0)
                {
                    var activity7_points = ac7_count * activity7.Points;
                    PointsUser activity7_record = GetIndividualUserPoints(activity7.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                                     PointsLibraryId = activity7.Id
                                 }
                             );
                    }
                    else
                    {
                        activity7_record.Points = activity7_points;
                        activity7_record.UpdatedDate = DateTime.Now;
                        activity7_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity7_record);
                    }
                }

                // 8 
                // Measuring childrens' growth weight - referral required
                // no cap
                int ac8_count = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_weight &&
                                                                x.Comment == Constants.GGSettings.severely_underweight &&
                                                                x.Comment == Constants.GGSettings.growth_faltering &&
                                                                x.Comment == Constants.GGSettings.underweight3 &&
                                                                x.Comment == Constants.GGSettings.overweight &&
                                                                x.Comment == Constants.GGSettings.obese &&
                                                                x.VisitData.Visit.DueDate.HasValue &&
                                                                (x.VisitData.Visit.DueDate.Value.Year == today.Year &&
                                                                x.VisitData.Visit.DueDate.Value.Month == today.Month)).Select(x => x.VisitData.Visit.InfantId).Distinct().Count();
                if (ac8_count > 0)
                {
                    var activity8_points = ac8_count * activity8.Points;
                    PointsUser activity8_record = GetIndividualUserPoints(activity8.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                                     PointsLibraryId = activity8.Id
                                 }
                             );
                    }
                    else
                    {
                        activity8_record.Points = activity8_points;
                        activity8_record.UpdatedDate = DateTime.Now;
                        activity8_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity8_record);
                    }
                }

                // 9
                // Measuring childrens' growth MUAC - normal
                // no cap
                int ac9_count = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_muac &&
                                                                x.Comment == Constants.GGSettings.normal_comment &&
                                                                x.VisitData.Visit.DueDate.HasValue &&
                                                                (x.VisitData.Visit.DueDate.Value.Year == today.Year &&
                                                                x.VisitData.Visit.DueDate.Value.Month == today.Month)).Select(x => x.VisitData.Visit.InfantId).Distinct().Count();

                if (ac9_count > 0)
                {
                    var activity9_points = ac9_count * activity9.Points;
                    PointsUser activity9_record = GetIndividualUserPoints(activity9.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                                     PointsLibraryId = activity9.Id
                                 }
                             );
                    }
                    else
                    {
                        activity9_record.Points = activity9_points;
                        activity9_record.UpdatedDate = DateTime.Now;
                        activity9_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity9_record);
                    }
                }

                // 10
                // Measuring childrens' growth MUAC - referral not required
                // no cap
                int ac10_count = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_muac &&
                                                                x.Comment != Constants.GGSettings.severe_acute_malnutrition &&
                                                                x.Comment != Constants.GGSettings.moderate_acute_malnutrition &&
                                                                x.VisitData.Visit.DueDate.HasValue &&
                                                                (x.VisitData.Visit.DueDate.Value.Year == today.Year &&
                                                                x.VisitData.Visit.DueDate.Value.Month == today.Month)).Select(x => x.VisitData.Visit.InfantId).Distinct().Count();

                if (ac10_count > 0)
                {
                    var activity10_points = ac10_count * activity10.Points;
                    PointsUser activity10_record = GetIndividualUserPoints(activity10.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                                     PointsLibraryId = activity10.Id
                                 }
                             );
                    }
                    else
                    {
                        activity10_record.Points = activity10_points;
                        activity10_record.UpdatedDate = DateTime.Now;
                        activity10_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity10_record);
                    }
                }

                // 11
                // Measuring childrens' growth MUAC - referral required
                // no cap
                int ac11_count = _visitDataStatusRepo.GetAll().Where(x => x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                x.VisitData.Question == Constants.GGSettings.q_muac &&
                                                                x.Comment == Constants.GGSettings.severe_acute_malnutrition &&
                                                                x.Comment == Constants.GGSettings.moderate_acute_malnutrition &&
                                                                x.VisitData.Visit.DueDate.HasValue &&
                                                                (x.VisitData.Visit.DueDate.Value.Year == today.Year &&
                                                                x.VisitData.Visit.DueDate.Value.Month == today.Month)).Select(x => x.VisitData.Visit.InfantId).Distinct().Count();

                if (ac11_count > 0)
                {
                    var activity11_points = ac11_count * activity11.Points;
                    PointsUser activity11_record = GetIndividualUserPoints(activity11.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                                     PointsLibraryId = activity11.Id
                                 }
                             );
                    }
                    else
                    {
                        activity11_record.Points = activity11_points;
                        activity11_record.UpdatedDate = DateTime.Now;
                        activity11_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity11_record);
                    }
                }

                // 12
                // Vitamin A
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    int ac12_count = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                (x.Question == Constants.GGSettings.q_vitamin_a && x.Question == Constants.GGSettings.answer_no) &&
                                                                x.Visit.DueDate.HasValue &&
                                                                (x.Visit.DueDate.Value.Year == today.Year &&
                                                                x.Visit.DueDate.Value.Month == today.Month)).Select(x => x.Id).Distinct().Count();

                    if (ac12_count == 0)
                    {
                        int activity12_records = GetIndividualUserPoints(activity12.SubActivity, userId, today.Month, today.Year).Count();
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
                                    PointsLibraryId = activity12.Id
                                }
                            );
                        }
                    }
                }

                // 13
                // Deworming
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    int ac13_count = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                (x.Question == Constants.GGSettings.q_deworming && x.Question == Constants.GGSettings.answer_no) &&
                                                                x.Visit.DueDate.HasValue &&
                                                                (x.Visit.DueDate.Value.Year == today.Year &&
                                                                x.Visit.DueDate.Value.Month == today.Month)).Select(x => x.Id).Distinct().Count();

                    if (ac13_count == 0)
                    {
                        int activity13_records = GetIndividualUserPoints(activity13.SubActivity, userId, today.Month, today.Year).Count();
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
                                    PointsLibraryId = activity13.Id
                                }
                            );
                        }
                    }
                }
            
                // 14
                // Immunisations
                if (today.Date == today.GetEndOfMonth().Date)
                {
                    int ac14_count = _visitDataRepo.GetAll().Where(x => x.Visit.Infant.Caregiver.HealthCareWorker.UserId == userId &&
                                                                            (x.Question == Constants.GGSettings.q_immunisation && x.Question == Constants.GGSettings.answer_no) &&
                                                                            x.Visit.DueDate.HasValue &&
                                                                            (x.Visit.DueDate.Value.Year == today.Year &&
                                                                            x.Visit.DueDate.Value.Month == today.Month)).Select(x => x.Id).Distinct().Count();

                    if (ac14_count == 0)
                    {
                        int activity14_records = GetIndividualUserPoints(activity14.SubActivity, userId, today.Month, today.Year).Count();
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
                                    PointsLibraryId = activity14.Id
                                }
                            );
                        }
                    }
                }
            }

            UpdateUserSummaryPoints(userId);
            return true;
        }

        #endregion

        #region UserSummary

        public bool UpdateUserSummaryPoints(string userId)
        {
            DateTime today = DateTime.Now.Date;
            List<PointsLibrary> allRecords = GetPointsLibraryForTenant();

            foreach (var item in allRecords)
            {
                int monthTotal = _pointsUserRepo.GetAll().Where(x => x.UserId == userId && x.Month == today.Month && x.Year == today.Year && x.PointsLibraryId == item.Id).Select(x => x.Points).Sum();
                int ytdTotal = _pointsUserRepo.GetAll().Where(x => x.UserId == userId && x.Year == today.Year && x.PointsLibraryId == item.Id).Select(x => x.Points).Sum();

                // ss max point implementation
                if (item.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac3)
                {
                    if (ytdTotal > 1200)
                    {
                        ytdTotal = 1200;
                    }
                }
                if (item.SubActivity == Constants.PointsEngineSettings.income_statement_ac3)
                {
                    if (ytdTotal > 300)
                    {
                        ytdTotal = 300;
                    }
                }
                if (item.SubActivity == Constants.PointsEngineSettings.income_statement_ac4)
                {
                    if (ytdTotal > 100)
                    {
                        ytdTotal = 100;
                    }
                }

                var record = _pointsUserSummaryRepo.GetAll().Where(x => x.UserId == userId && x.Month == today.Month && x.Year == today.Year && x.PointsLibraryId == item.Id).FirstOrDefault();
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
                            PointsLibraryId = item.Id,
                            PointsTotal = monthTotal,
                            PointsYTD = ytdTotal
                        }
                    );
                } else
                {
                    record.PointsTotal = monthTotal;
                    record.PointsYTD = ytdTotal;
                    record.UpdatedDate = DateTime.Now;
                    record.UpdatedBy = _uId;
                    UpdateIndividualSummaryUserPoints(record);
                }
            }
            return true;
        }

        #endregion

        #region SS_Children

        public bool AddChildrenRegistration(string userId)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_data_collection);
            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac1).FirstOrDefault();

            DateTime today = DateTime.Now.Date;

            var children = _personnelService.GetAllChildrenForPractitioner(userId);
            var childCount = children.Where(x => x.InsertedDate.Year == today.Year && x.InsertedDate.Month == today.Month).Select(x => x.Id).Distinct().Count();

            if (childCount > 0)
            {
                PointsUser activity_record = GetIndividualUserPoints(activity.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                            PointsLibraryId = activity.Id
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
            }
            UpdateUserSummaryPoints(userId);
            return true;
        }

        public bool RemoveChildrenRegistration(string userId)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_data_collection);
            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac2).FirstOrDefault();

            DateTime today = DateTime.Now.Date;

            Practitioner practitioner = _practitionerRepo.GetByUserId(userId);
            if (practitioner != null && !string.IsNullOrEmpty(practitioner.Hierarchy))
            {
                var children = _childRepo.GetAll().Where(x => x.User.IsActive == false && x.Hierarchy.StartsWith(practitioner.Hierarchy)).ToList();
                var childCount = children.Where(x => x.User.UpdatedDate.Year == today.Year && x.User.UpdatedDate.Month == today.Month).Select(x => x.Id).Distinct().Count();

                if (childCount > 0)
                {
                    PointsUser activity_record = GetIndividualUserPoints(activity.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                                PointsLibraryId = activity.Id
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
                }
            }
            UpdateUserSummaryPoints(userId);
            return true;
        }

        #endregion

        #region SS_Attendance
        public bool ManageAttendanceSubmitted(string userId)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.child_data_collection);
            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.child_data_collection_ac3).FirstOrDefault();
            List<Classroom> classrooms = _personnelService.GetAllClassroomsForPractitioner(userId);

            DateTime today = DateTime.Now.Date;

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

            var perc = Math.Round((double)(totalExpectedAttendance / (double)(totalChildrenAttendedSessions)) * 100);
            if (perc > 50)
            {
                PointsUser activity_record = GetIndividualUserPoints(activity.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                            PointsLibraryId = activity.Id
                        }
                    );
                }
                else
                {
                    activity_record.Points = (int)perc;
                    activity_record.UpdatedDate = DateTime.Now;
                    activity_record.UpdatedBy = _uId;
                    UpdateIndividualUserPoints(activity_record);
                }
            }
            UpdateUserSummaryPoints(userId);
            return true;
        }

        #endregion

        #region SS_IncomeStatements

        public bool ManageIncomeStatementsSubmitted(string userId)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.income_statement);
            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.income_statement_ac3).FirstOrDefault();

            DateTime today = DateTime.Now.Date;
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
                    PointsUser activity_record = GetIndividualUserPoints(activity.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                    }
                    else
                    {
                        activity_record.Points = activity.Points;
                        activity_record.UpdatedDate = DateTime.Now;
                        activity_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity_record);
                    }
                }

                UpdateUserSummaryPoints(userId);
            }
            return true;
        }

        public bool ManageThreeConsecutiveIncomeStatementsSubmitted(string userId)
        {
            List<PointsLibrary> pointsLibraries = GetPointsLibraryForActivity(Constants.PointsEngineSettings.income_statement);
            PointsLibrary activity = pointsLibraries.Where(x => x.SubActivity == Constants.PointsEngineSettings.income_statement_ac3).FirstOrDefault();

            DateTime today = DateTime.Now.Date;
            DateTime deadline = today.GetStartOfMonth().AddDays(7);
            DateTime previousMonth = today.GetEndOfPreviousMonth().Date;

            var comboRanges = new List<int>();
            comboRanges.AddRange(new List<int> { 1, 2, 3 });
            comboRanges.AddRange(new List<int> { 2, 3, 4 });
            comboRanges.AddRange(new List<int> { 3, 4, 5 });
            comboRanges.AddRange(new List<int> { 4, 5, 6 });
            comboRanges.AddRange(new List<int> { 5, 6, 7 });
            comboRanges.AddRange(new List<int> { 6, 7, 8 });
            comboRanges.AddRange(new List<int> { 7, 8, 9 });
            comboRanges.AddRange(new List<int> { 8, 9, 10 });
            comboRanges.AddRange(new List<int> { 9, 10, 11 });
            comboRanges.AddRange(new List<int> { 10, 11, 12 });
            

            Practitioner practitioner = _practitionerRepo.GetByUserId(userId);

            if (practitioner.IsFundaAppAdmin == true || practitioner.IsPrincipal == true)
            {
                List<int> rows = _statementsIncomeStatementRepo.GetAll().Where(x => x.UserId == userId &&
                                                                                x.Year == today.Year &&
                                                                                x.Submitted == true &&
                                                                                x.IsActive == true &&
                                                                                x.SubmittedDate.Date >= x.SubmittedDate.GetStartOfMonth().Date &&
                                                                                x.SubmittedDate.Date <= x.SubmittedDate.GetStartOfMonth().AddDays(7).Date)
                                                                                .Select(x => x.SubmittedDate.Month).Distinct().ToList();
                rows.Sort();

                var results = rows.ToDictionary(k => k, v => rows.Count(x => x == v))
                .Where(x => x.Value == 3)
                .Select(x => x.Key);






                if (rows.Count > 0)
                {
                    PointsUser activity_record = GetIndividualUserPoints(activity.SubActivity, userId, today.Month, today.Year).FirstOrDefault();
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
                    }
                    else
                    {
                        activity_record.Points = activity.Points;
                        activity_record.UpdatedDate = DateTime.Now;
                        activity_record.UpdatedBy = _uId;
                        UpdateIndividualUserPoints(activity_record);
                    }
                }

                UpdateUserSummaryPoints(userId);
            }
            return true;
        }

        #endregion


    }
}
