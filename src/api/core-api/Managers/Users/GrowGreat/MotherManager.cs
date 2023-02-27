using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users.GrowGreat
{
    public class MotherManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private HealthCareWorkerManager _healthCareWorkerManager;
        private InfantManager _infantManager;
        private VisitManager _visitManager;

        public MotherManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HealthCareWorkerManager healthCareWorkerManager,
            InfantManager infantManager,
            VisitManager visitManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _healthCareWorkerManager = healthCareWorkerManager;
            _infantManager = infantManager;
            _visitManager = visitManager;
        }

        // GG BUSINESS RULES FOR CREATING A MOTHER AND SELECTING AN EXISTING CAREGIVER

        // We save the caregiver's id to column LinkedCaregiverId on the Mother table to indicate that this mother is linked to an exisiting caregiver.
        // When a caregiver is 'marked/linked' to a mother, we mark the caregiver with a boolean 'isMother' for the FE to exclude from step 2 of 5.

        public Mother AddMother(MotherModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var mother = GetMotherFromInputModel(input);
            var repository = _repoFactory.CreateGenericRepository<Mother>(userContext: applicationUserId);
            var createdMom = repository.Insert(mother);
            if (createdMom != null)
            {
                AddVisits(createdMom.Id, createdMom.ExpectedDateOfDelivery, createdMom.InsertedDate);
            }
            return createdMom;
        }

        public Mother UpdateMother(string id, MotherModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateGenericRepository<Mother>(userContext: applicationUserId);
            var entityToUpdate = repository.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).FirstOrDefault();
            var motherUser = GetUserFromInputModel(input);

            entityToUpdate.UpdatedDate = DateTime.Now;
            entityToUpdate.UpdatedBy = applicationUserId;
            entityToUpdate.UserId = input.UserId;
            entityToUpdate.User = motherUser;
            entityToUpdate.WhatsAppNumber = input.WhatsAppNumber;
            entityToUpdate.ExpectedDateOfDelivery = input.ExpectedDateOfDelivery;
            entityToUpdate.HealthCareWorkerId = input.HealthCareWorkerId;
            entityToUpdate.SiteAddress = input.SiteAddress;

            return repository.Update(entityToUpdate);
        }

        public Mother GetMotherFromInputModel(MotherModel input)
        {
            if (input == null)
            {
                return null;
            }

            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerId = _healthCareWorkerManager.GetHealthCareWorkerIdByUserId(applicationUserId);
            var motherUser = GetUserFromInputModel(input);

            // Populate province id with N/A option when site address is null
            if (input.SiteAddressId == null)
            {
                var repository = _repoFactory.CreateGenericRepository<Province>(userContext: applicationUserId);
                var naProvince = repository.GetAll().Where(x => x.Description.Equals("N/A")).FirstOrDefault();
                input.SiteAddress.ProvinceId = naProvince.Id;
            }

            return new Mother()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId,
                UserId = input.UserId,
                User = motherUser,
                Age = input.Age,
                WhatsAppNumber = input.WhatsAppNumber,
                ExpectedDateOfDelivery = input.ExpectedDateOfDelivery,
                HealthCareWorkerId = healthCareWorkerId,
                SiteAddress = input.SiteAddress,
                LinkedCaregiverId = input.LinkedCaregiverId
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
            var _type = "mother";

            // Get all visit types linked to mother excluding additional_visits
            List<VisitType> visitTypes = visitTypeRepo.GetAll().Where(x => x.Type.Equals(_type) && x.Name != Constants.GGSettings.additional_visits).OrderBy(x => x.Order).ToList();

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

        public DisplaySet GetStatusInfo(Guid motherId, Boolean withinWeek)
        {
            DisplaySet statusInfo = new DisplaySet();
            DateTime today = DateTime.Today;

            // Determine note display for mother
            var note = Constants.GGSettings.client_pregnant_mom;
            var childrenCount = _infantManager.GetChildCountForMother(motherId);
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

            // Default green status
            statusInfo.Icon = MetricsIconEnum.Success.ToString();
            statusInfo.Color = MetricsColorEnum.Success.ToString();
            statusInfo.Subject = "Healthy";

            // No color alert notification
            var nextVisitAfter7Days = _visitManager.GetNextVisitMoreThan7DaysAway(motherId, Constants.GGSettings.client_mother);
            if (nextVisitAfter7Days != "")
            {
                statusInfo.Icon = MetricsIconEnum.None.ToString();
                statusInfo.Color = MetricsColorEnum.None.ToString();
                statusInfo.Subject = nextVisitAfter7Days;
            }

            //
            // Orange Alerts
            //

            // 1. show if the visit deadline is less than 7 days away
            var nextVisitWithin7Days = _visitManager.GetNextVisitLessThan7DaysAway(motherId, Constants.GGSettings.client_mother, withinWeek);
            if (nextVisitWithin7Days != "")
            {
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Color = MetricsColorEnum.Warning.ToString();
                statusInfo.Subject = nextVisitWithin7Days;
            }

            //
            // Red Alerts
            //

            // 1. Missed visits for pregnant mom - it could be Visit 1, 2, 3, or 4 
            var missedVisit = _visitManager.GetFirstMissedVisit(motherId, Constants.GGSettings.client_mother);
            if (missedVisit != "")
            {
                statusInfo.Icon = MetricsIconEnum.Error.ToString();
                statusInfo.Color = MetricsColorEnum.Error.ToString();
                statusInfo.Subject = missedVisit;
            }

            return statusInfo;
        }

        public DateTime? GetClientsNextVisitDate(Guid motherId)
        {
            return _visitManager.GetClientsNextVisitDate(motherId, Constants.GGSettings.client_mother);
        }
    }
}

