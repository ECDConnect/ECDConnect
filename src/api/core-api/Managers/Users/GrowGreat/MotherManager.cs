using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using FileSignatures.Formats;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users.GrowGreat
{
    public class MotherManager : BaseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private HealthCareWorkerManager _healthCareWorkerManager;
        private InfantManager _infantManager;
        private VisitManager _visitManager;
        private VisitDataStatusManager _visitDataStatusManager;
        private IPointsEngineService _pointsEngineService;

        private string _applicationUserId;
        private IGenericRepository<Mother, Guid> _motherRepo;
        private IGenericRepository<Infant, Guid> _infantRepo;
        private IGenericRepository<Document, Guid> _documentRepo;

        public MotherManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HealthCareWorkerManager healthCareWorkerManager,
            InfantManager infantManager,
            VisitManager visitManager,
            VisitDataStatusManager visitDataStatusManager,
            [Service] IPointsEngineService pointsEngineService
            )
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _healthCareWorkerManager = healthCareWorkerManager;
            _infantManager = infantManager;
            _visitManager = visitManager;
            _visitDataStatusManager = visitDataStatusManager;
            _pointsEngineService = pointsEngineService;

            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            _motherRepo = _repoFactory.CreateGenericRepository<Mother>(userContext: _applicationUserId);
            _infantRepo = _repoFactory.CreateGenericRepository<Infant>(userContext: _applicationUserId);
            _documentRepo = _repoFactory.CreateGenericRepository<Document>(userContext: _applicationUserId);
        }

        // GG BUSINESS RULES FOR CREATING A MOTHER AND SELECTING AN EXISTING CAREGIVER

        // We save the caregiver's id to column LinkedCaregiverId on the Mother table to indicate that this mother is linked to an existing caregiver.
        // When a caregiver is 'marked/linked' to a mother, we mark the caregiver with a boolean 'isMother' for the FE to exclude from step 2 of 5.

        public Mother AddMother(MotherModel input)
        {
            var mother = GetMotherFromInputModel(input);
            var createdMom = _motherRepo.Insert(mother);

            // When the linkedInfantId is available and contains a guid, then we know that a mother is created from 'Record an event' - EC-246 (post conditions)
            // and we need to link the newly created mother to an existing child.
            if (input.LinkedInfantId != null)
            {
                _infantManager.UpdateInfantCaregiverToMother(input.LinkedInfantId, mother.Id);
            }

            if (createdMom != null && input.ExpectedDateOfDelivery != null)
            {
                AddVisits(createdMom.Id, createdMom.ExpectedDateOfDelivery, createdMom.InsertedDate);
            }

            // Call points engine for hcw
            _pointsEngineService.CalculatePregnantMomClientRegistration(_applicationUserId, DateTime.UtcNow);
            return createdMom;
        }

        public Mother UpdateMotherDeliveryDate(string id, DateTime? expectedDateOfDelivery)
        {
            if (expectedDateOfDelivery != null || expectedDateOfDelivery != default(DateTime))
            {
                var entityToUpdate = _motherRepo.GetAll().Where(x => x.UserId == id).FirstOrDefault();
                entityToUpdate.UpdatedDate = DateTime.Now;
                entityToUpdate.UpdatedBy = _applicationUserId;
                entityToUpdate.ExpectedDateOfDelivery = Convert.ToDateTime(expectedDateOfDelivery, CultureInfo.InvariantCulture); ;
                AddVisits(entityToUpdate.Id, entityToUpdate.ExpectedDateOfDelivery, entityToUpdate.InsertedDate);

                // Call points engine for hcw
                _pointsEngineService.CalculatePregnantMomClientRegistration(_applicationUserId, DateTime.UtcNow);
                
                return _motherRepo.Update(entityToUpdate);
            }
            return null;
        }

        public Mother UpdateMother(string id, MotherModel input)
        {
            var entityToUpdate = _motherRepo.GetAll().Where(x => x.UserId == id).FirstOrDefault();
            var motherUser = GetUserFromInputModel(input);

            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId;

            if (input.UserId != null)
            {
                entityToUpdate.UserId = input.UserId;
                entityToUpdate.User = motherUser;
            }
            if (input.WhatsAppNumber != null) { 
                entityToUpdate.WhatsAppNumber = input.WhatsAppNumber;
            }
            if (input.ExpectedDateOfDelivery != null)
            {
                entityToUpdate.ExpectedDateOfDelivery = input.ExpectedDateOfDelivery;
            }
            if (input.HealthCareWorkerId != null)
            {
                entityToUpdate.HealthCareWorkerId = input.HealthCareWorkerId;
            }
            if (input.SiteAddress != null)
            {
                entityToUpdate.SiteAddress = input.SiteAddress;
            }
            if (input.ClickedVisitTab != null)
            {
                entityToUpdate.ClickedVisitTab = input.ClickedVisitTab;
            }
            if (input.ClickedProgressTab != null)
            {
                entityToUpdate.ClickedProgressTab = input.ClickedProgressTab;
            }
            if (input.ClickedReferralsTab != null)
            {
                entityToUpdate.ClickedReferralsTab = input.ClickedReferralsTab;
            }
            if (input.ClickedContactTab != null)
            {
                entityToUpdate.ClickedContactTab = input.ClickedContactTab;
            }

            return _motherRepo.Update(entityToUpdate);
        }


        public Boolean ArchiveMotherProfilesWithoutMaternalRecord(string hcwId)
        {
            // set today to validate 60 days from registration date
            DateTime today = DateTime.Today;
            List<Mother> mothers = _motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId.Equals(hcwId) && x.IsActive.Equals(true)).ToList();
            foreach (Mother mother in mothers)
            {
                var registrationDate = mother.InsertedDate;
                var next60Days = registrationDate.AddDays(60);

                if (today > next60Days)
                {
                    // if we are past 60 days and there is still no record for the mother with the name 'maternalcaserecord.png' then we archive the mother
                    var total = _documentRepo.GetAll().Where(x => x.CreatedUserId.Equals(hcwId) && x.UserId.Equals(mother.UserId) && x.Name == Constants.GGSettings.maternal_record_name).Count();
                    if (total == 0)
                    {
                        mother.IsActive = false;
                        mother.UpdatedBy = _applicationUserId;
                        _motherRepo.Update(mother);
                    }
                }

            }
            return true;
        }

        public Mother UpdateContactDetails(string id, MotherModel input) {
            var entityToUpdate = _motherRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();

            var user = entityToUpdate.User;
            user.Id = input.UserId;
            user.PhoneNumber = input.PhoneNumber;

            entityToUpdate.UpdatedBy = _applicationUserId;
            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.WhatsAppNumber = input.WhatsAppNumber;
            entityToUpdate.UserId = user.Id;
            entityToUpdate.User = user;
            return _motherRepo.Update(entityToUpdate);
        }

        public Mother UpdateMotherAddress(string id, MotherModel input)
        {
            var entityToUpdate = _motherRepo.GetAll().Where(x => x.User.Id == id).FirstOrDefault();

            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = _applicationUserId;
            entityToUpdate.SiteAddress = input.SiteAddress;
            return _motherRepo.Update(entityToUpdate);
        }

        public Mother GetMotherFromInputModel(MotherModel input)
        {
            if (input == null)
            {
                return null;
            }
            // EC-797 - if this infant is not the first client, we set the tab values to true;
            int totalClients = _motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId == _applicationUserId && (x.ClickedVisitTab == true || x.ClickedProgressTab == true || x.ClickedReferralsTab == true || x.ClickedContactTab == true)).Count()
                            + _infantRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId == _applicationUserId && (x.ClickedVisitTab == true || x.ClickedProgressTab == true || x.ClickedReferralsTab == true || x.ClickedContactTab == true)).Count();


            var healthCareWorkerId = _healthCareWorkerManager.GetHealthCareWorkerIdByUserId(_applicationUserId);
            var motherUser = GetUserFromInputModel(input);

            // Populate province id with N/A option when site address is null
            if (input.SiteAddressId == null)
            {
                var repository = _repoFactory.CreateGenericRepository<Province>(userContext: _applicationUserId);
                var naProvince = repository.GetAll().Where(x => x.Description.Equals("N/A")).FirstOrDefault();
                input.SiteAddress.ProvinceId = naProvince.Id;
            }

            return new Mother()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId,
                UserId = input.UserId,
                User = motherUser,
                Age = input.Age,
                WhatsAppNumber = input.WhatsAppNumber,
                ExpectedDateOfDelivery = input.ExpectedDateOfDelivery,
                HealthCareWorkerId = healthCareWorkerId,
                SiteAddress = input.SiteAddress,
                LinkedCaregiverId = input.LinkedCaregiverId,
                ClickedVisitTab = totalClients != 0,
                ClickedProgressTab = totalClients != 0,
                ClickedReferralsTab = totalClients != 0,
                ClickedContactTab = totalClients != 0
            };
        }

        private ApplicationUser GetUserFromInputModel(MotherModel input)
        {
            return new ApplicationUser()
            {
                Id = GetUserIdOrGenerateNew(input.UserId),
                FirstName = input.FirstName,
                Surname = input.Surname,
                PhoneNumber = input.PhoneNumber,
                EmailConfirmed = false,
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                IsSouthAfricanCitizen = false,
                VerifiedByHomeAffairs = false,
                IsActive = true,
                LastSeen = DateTime.Now,
                IsImported = false
            };
        }

        private string GetUserIdOrGenerateNew(string userId)
        {
            return userId ?? Guid.NewGuid().ToString();
        }

        private void AddVisits(Guid motherId, DateTime? ExpectedDateOfDelivery, DateTime InsertedDate)
        {

            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = _repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);

            // Get all visit types linked to mother excluding additional_visits
            List<VisitType> visitTypes = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_mother) && x.Name != Constants.GGSettings.additional_visits).OrderBy(x => x.Order).ToList();

            // Get dates for each visit
            List<VisitModel> visits = getVisitDates(ExpectedDateOfDelivery, InsertedDate, visitTypes);

            if (visits.Count > 0)
            {   // Add visits for mother
                foreach (var visit in visits)
                {
                    visit.MotherId = motherId;
                    visit.Risk = "normal";
                    visit.InfantId = null;
                    visit.Attended = false;
                    _visitManager.AddVisit(visit);
                }
                UpdateDueDates(motherId.ToString());
            }
        }

        private List<VisitModel> getVisitDates(
            DateTime? ExpectedDateOfDelivery,
            DateTime RegisteredDate,
            List<VisitType> visitTypes)
        {
            // Business rules implemented -> https://ecd-connect.atlassian.net/jira/software/projects/EC/boards/1?selectedIssue=EC-56

            var dateList = new List<VisitModel>();

            if (ExpectedDateOfDelivery.HasValue)
            {
                // Calculation: Pregnancy term calculated: "expected delivery date" - "280 days (40 weeks)"
                DateTime endTermDate = ExpectedDateOfDelivery.Value;
                DateTime startTermDate = endTermDate.AddDays(-280);

                DateTime day98 = startTermDate.AddDays(98);
                DateTime day153 = startTermDate.AddDays(153);

                DateTime day154 = startTermDate.AddDays(154);
                DateTime day182 = startTermDate.AddDays(182);

                DateTime day183 = startTermDate.AddDays(183);
                DateTime day258 = startTermDate.AddDays(258);

                DateTime day259 = startTermDate.AddDays(259);
                DateTime day265 = startTermDate.AddDays(265);

                DateTime day266 = startTermDate.AddDays(266);
                DateTime day273 = startTermDate.AddDays(273);

                DateTime today = DateTime.Today;

                var visit1Date = today;
                var visit2Date = today;
                var visit3Date = today;
                var visit4Date = today;

                var visitDaySet1 = new VisitModel();
                var visitDaySet2 = new VisitModel();
                var visitDaySet3 = new VisitModel();
                var visitDaySet4 = new VisitModel();

                var bAddVisit1 = true;
                var bAddVisit2 = true;
                var bAddVisit3 = true;
                var bAddVisit4 = true;

                // Scenario 1: client registered before 98 days
                if (RegisteredDate.Date < day98.Date)
                {
                    visit1Date = startTermDate.AddDays(97);
                    visit2Date = startTermDate.AddDays(168);
                    visit3Date = startTermDate.AddDays(196);
                    visit4Date = startTermDate.AddDays(279);
                    bAddVisit1 = bAddVisit2 = bAddVisit3 = bAddVisit4 = true;
                } // Scenario 2: client registered between 98 and 153
                else if (RegisteredDate.Date >= day98.Date && RegisteredDate.Date <= day153.Date)
                {
                    visit1Date = RegisteredDate.AddDays(7);
                    visit2Date = startTermDate.AddDays(168);
                    visit3Date = startTermDate.AddDays(196);
                    visit4Date = startTermDate.AddDays(279);
                    bAddVisit1 = bAddVisit2 = bAddVisit3 = bAddVisit4 = true;
                } // Scenario 3: client registered between 154 and 182
                else if (RegisteredDate.Date >= day154.Date && RegisteredDate.Date <= day182.Date)
                {
                    visit1Date = RegisteredDate.AddMonths(1);
                    visit2Date = RegisteredDate.AddMonths(2);
                    visit3Date = RegisteredDate.AddMonths(3);
                    visit4Date = startTermDate.AddDays(279);
                    bAddVisit1 = bAddVisit2 = bAddVisit3 = bAddVisit4 = true;
                } // Scenario 4: client registered between 183 and 258
                else if (RegisteredDate.Date >= day183.Date && RegisteredDate.Date <= day258.Date)
                {
                    visit1Date = RegisteredDate.AddDays(7);
                    visit2Date = RegisteredDate.AddDays(14);
                    visit3Date = RegisteredDate.AddDays(21);
                    visit4Date = startTermDate.AddDays(279);
                    bAddVisit1 = bAddVisit2 = bAddVisit3 = bAddVisit4 = true;
                } // Scenario 5: client registered between 258 and 266
                else if (RegisteredDate.Date >= day259.Date && RegisteredDate.Date <= day265.Date)
                {
                    visit1Date = RegisteredDate.AddDays(7);
                    visit2Date = RegisteredDate.AddDays(14);
                    visit3Date = startTermDate.AddDays(279);
                    visit4Date = startTermDate.AddDays(279);
                    bAddVisit1 = bAddVisit2 = bAddVisit3 = bAddVisit4 = true;
                }// Scenario 6: client registered between 266 and day273
                else if (RegisteredDate.Date >= day266.Date && RegisteredDate.Date <= day273.Date)
                {
                    visit1Date = startTermDate.AddDays(279);
                    visit2Date = startTermDate.AddDays(279);
                    bAddVisit3 = bAddVisit4 = false;
                }// Scenario 7: client registered after day273
                else if (RegisteredDate.Date > day273.Date)
                {
                    visit1Date = startTermDate.AddDays(279);
                    bAddVisit2 = bAddVisit3 = bAddVisit4 = false;
                }

                // visit types are ordered, thus we can work on index
                if (bAddVisit1)
                {
                    visitDaySet1.PlannedVisitDate = visit1Date;
                    visitDaySet1.VisitType = visitTypes[0];
                    dateList.Add(visitDaySet1);
                }

                if (bAddVisit2)
                {
                    visitDaySet2.PlannedVisitDate = visit2Date;
                    visitDaySet2.VisitType = visitTypes[1];
                    dateList.Add(visitDaySet2);
                }

                if (bAddVisit3)
                {
                    visitDaySet3.PlannedVisitDate = visit3Date;
                    visitDaySet3.VisitType = visitTypes[2];
                    dateList.Add(visitDaySet3);
                }

                if (bAddVisit4)
                {
                    visitDaySet4.PlannedVisitDate = visit4Date;
                    visitDaySet4.VisitType = visitTypes[3];
                    dateList.Add(visitDaySet4);
                }

                dateList = dateList.OrderBy(x => x.VisitType.Order).ToList();
            }

            return dateList;
        }

        public Boolean UpdateDueDates(string motherId)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = _repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            List<Visit> visitList = visitRepo.GetAll().Where(x => x.MotherId.ToString() == motherId).ToList();

            foreach (var _visit in visitList)
            {
                if (_visit.VisitType.Name == Constants.GGSettings.visit1)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.visit2).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.visit2)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.visit3).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.visit3)
                {
                    _visit.DueDate = visitList.Where(x => x.VisitType.Name == Constants.GGSettings.visit4).Select(y => y.PlannedVisitDate).FirstOrDefault();
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
                else if (_visit.VisitType.Name == Constants.GGSettings.visit4)
                {
                    _visit.DueDate = _visit.PlannedVisitDate;
                    _visit.DueDate = (_visit.DueDate != default(DateTime) ? _visit?.DueDate.Value.AddDays(-1).Date : null);
                    visitRepo.Update(_visit);
                }
            }
            return true;
        }

        public DisplaySet GetStatusInfo(Mother mother, Boolean withinWeek)
        {
            DisplaySet statusInfo = new DisplaySet();
            DateTime today = DateTime.Today;

            var totalMonths = ((today.Year - mother.InsertedDate.Year) * 12) + today.Month - mother.InsertedDate.Month;

            // Determine note display for mother
            var note = Constants.GGSettings.client_pregnant_mom;
            var childrenCount = _infantManager.GetChildCountForMother(mother.Id);
            if (childrenCount == 1)
            {
                note = Constants.GGSettings.client_pregnant_mom_and_child;
            }
            else if (childrenCount > 1)
            {
                note = Constants.GGSettings.client_pregnant_mom_multiple_children;
            }

            statusInfo.Notes = note;

            //
            // Green Alerts
            //

            // 1. show if the visit deadline is 7 days or further away
            // 2. show "booked" if a visit has been scheduled in the calendar -> DEVELOPMENT PENDING 
            // 3. don't show a visit date if the booked date has passed; or if the last possible day to conduct that visit has passed (see timing in G5 & G6) -> DEVELOPMENT PENDING
            // 4. Healthy:- for pregnant mom clients only, show if there are no alerts/flags raised for the mom.

            // No color alert notification
            var nextVisitAfter7Days = _visitManager.GetNextVisitMoreThan7DaysAway(mother.Id, Constants.GGSettings.client_mother);
            if (nextVisitAfter7Days != "")
            {
                statusInfo.Icon = MetricsIconEnum.None.ToString();
                statusInfo.Color = MetricsColorEnum.None.ToString();
                statusInfo.Subject = nextVisitAfter7Days;
            }

            //
            // Green Alerts
            //
            var healthMom = _visitDataStatusManager.GetAlertsForMother(mother.Id.ToString());
            if (healthMom == "")
            {
                statusInfo.Icon = MetricsIconEnum.Success.ToString();
                statusInfo.Color = MetricsColorEnum.Success.ToString();
                statusInfo.Subject = "Healthy";
            }

            if (totalMonths <= 3)
            {
                var lastVisit = _visitManager.GetLastCompletedVisitId(mother.Id.ToString(), Constants.GGSettings.client_mother);
                if (lastVisit == Guid.Empty)
                {
                    if (mother.Age != null && Int32.Parse(mother.Age) < 20)
                    {
                        statusInfo.Color = MetricsIconEnum.Warning.ToString();
                        statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                        statusInfo.Subject = Constants.GGSettings.client_teenager;
                    }
                    else
                    {
                        statusInfo.Color = MetricsIconEnum.Success.ToString();
                        statusInfo.Icon = MetricsIconEnum.Success.ToString();
                        statusInfo.Subject = Constants.GGSettings.client_new;
                    }

                }
            }

            //
            // Orange Alerts
            //


            // 4 clinicReferral
            var clinicReferral = _visitDataStatusManager.GetClinicReferralForUser(mother.UserId, Constants.GGSettings.client_mother) ;
            if (clinicReferral != "")
            {
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Color = MetricsColorEnum.Warning.ToString();
                statusInfo.Subject = clinicReferral;
            }

            // 3 homeAffairsReferral
            var homeAffairsReferral = _visitDataStatusManager.GetHomeAffairsReferralForUser(mother.UserId, Constants.GGSettings.client_mother) ;
            if (homeAffairsReferral != "")
            {
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Color = MetricsColorEnum.Warning.ToString();
                statusInfo.Subject = homeAffairsReferral;
            }

            // 2 sassaReferral
            var sassaReferral = _visitDataStatusManager.GetSassaReferralForUser(mother.UserId, Constants.GGSettings.client_mother);
            if (sassaReferral != "")
            {
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Color = MetricsColorEnum.Warning.ToString();
                statusInfo.Subject = sassaReferral;
            }

            // 1 show if the visit deadline is less than 7 days away
            var nextVisitWithin7Days = _visitManager.GetNextVisitLessThan7DaysAway(mother.Id, Constants.GGSettings.client_mother, withinWeek);
            if (nextVisitWithin7Days != "")
            {
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Color = MetricsColorEnum.Warning.ToString();
                statusInfo.Subject = nextVisitWithin7Days;
            }

            //
            // Red Alerts
            //

            // 3. Missed visits for pregnant mom - it could be Visit 1, 2, 3, or 4 
            var missedVisit = _visitManager.GetFirstMissedVisit(mother.Id, Constants.GGSettings.client_mother);
            if (missedVisit != "")
            {
                statusInfo.Icon = MetricsIconEnum.Error.ToString();
                statusInfo.Color = MetricsColorEnum.Error.ToString();
                statusInfo.Subject = missedVisit;
            }

            // 2. Upload maternal case record
            if (!GetMaternalCaseRecordStatus(mother.UserId))
            {
                statusInfo.Icon = MetricsIconEnum.Error.ToString();
                statusInfo.Color = MetricsColorEnum.Error.ToString();
                statusInfo.Subject = Constants.GGSettings.upload_maternal_case_record;
            }


            // 1. Refer to the clinic urgently
            var redAlert = _visitDataStatusManager.GetRedAlertsForUser(mother.UserId, Constants.GGSettings.client_mother);
            if (redAlert != "")
            {
                statusInfo.Icon = MetricsIconEnum.Error.ToString();
                statusInfo.Color = MetricsColorEnum.Error.ToString();
                statusInfo.Subject = redAlert;
            }

           

            return statusInfo;
        }

        private Boolean GetMaternalCaseRecordStatus(string UserId)
        {
            int total = _documentRepo.GetAll().Where(x =>  x.UserId.Equals(UserId) && x.Name == Constants.GGSettings.maternal_record_name).Count();
            if (total == 0)
            {
                return false;
            }
            return true;
        }

        public DateTime? GetClientsNextVisitDate(Guid motherId)
        {
            return _visitManager.GetClientsNextVisitDate(motherId, Constants.GGSettings.client_mother);
        }

        public int GetTotalNewMothersForWeek(string id, Boolean currentWeek)
        {
            DateTime today = DateTime.Today;
            var monday = StartOfWeek(today, DayOfWeek.Monday);
            var next7Days = monday.AddDays(6);

            if (!currentWeek)
            {
                int days = DateTime.Now.DayOfWeek - DayOfWeek.Sunday;
                DateTime pastDate = DateTime.Now.AddDays(-days);
                monday = StartOfWeek(pastDate, DayOfWeek.Monday);
                next7Days = monday.AddDays(6);
            }

            return _motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId.Equals(id) && x.IsActive.Equals(true) && x.InsertedDate >= monday && x.InsertedDate <= next7Days)
                .Select(x => x.Id)
                .Distinct()
                .Count();
        }

        public int GetTotalNewClientsForPeriod(string id, DateTime startDate, DateTime endDate)
        {
            var motherCount = _motherRepo.GetAll()
                .Where(m => m.HealthCareWorker.UserId == id
                && m.IsActive.Equals(true) 
                && m.InsertedDate >= startDate
                && m.InsertedDate <= endDate)
                .Select(x => x.Id)
                    .Distinct()
                    .Count();

            var infantCount = _infantRepo.GetAll()
                .Where(i => i.Caregiver.HealthCareWorker.UserId == id
                && i.IsActive.Equals(true)
                && i.InsertedDate >= startDate
                && i.InsertedDate <= endDate)
                .Select(x => x.Id)
                    .Distinct()
                    .Count();

            return motherCount + infantCount;
        }

        public int GetTotalPregnantMothers(
            string heathCareWorkerUserId,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            // Things that have been painted these color are urgent...
            var motherRepo = _repoFactory.CreateGenericRepository<Mother>();
            var mothers = motherRepo.GetAll()
                .Where(m => m.IsActive == true
                && m.HealthCareWorker.UserId == heathCareWorkerUserId);

            if (startDate is not null)
                mothers = mothers.Where(m => m.InsertedDate >= startDate);

            if (endDate is not null)
                mothers = mothers.Where(m => m.InsertedDate <= endDate);

            return mothers
                .Select(m => m.Id)
                .Distinct()
                .Count();
        }

        public Mother GetMotherForCaregiver(string caregiverId)
        {
            Mother mother = _motherRepo.GetAll().Where(x => x.LinkedCaregiverId.ToString() == caregiverId).FirstOrDefault();
            if (mother != null)
            {
                mother.StatusInfo = GetStatusInfo(mother, true);
                mother.NextVisitDate = GetClientsNextVisitDate(mother.Id);
            }
            return mother;
        }
    }
}

