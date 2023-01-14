using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using iTextSharp.text;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users
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
            
            AddVisits(mother.Id, mother.ExpectedDateOfDelivery, mother.InsertedDate);
            return repository.Insert(mother);
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

            // Get all visit types linked to mother excluding other
            List <VisitType> visitTypes = visitTypeRepo.GetAll().Where(x => x.Type.Equals(_type) && x.Name != "other").OrderBy(x => x.Order).ToList();
            
            // Get dates for each visit
            List <VisitModel> visits = getVisitDates(ExpectedDateOfDelivery, InsertedDate, visitTypes);

            if (visits.Count > 0)
            {
                foreach (var visit in visits)
                {
                    visit.MotherId = motherId;
                    visit.Risk = "normal";
                    _visitManager.AddVisit(visit);
                }
            }
        }

        private List<VisitModel> getVisitDates(
            DateTime? ExpectedDateOfDelivery, 
            DateTime RegisteredDate,
            List<VisitType> visitTypes)
        {
            
            // Visit 1
            // Scenario 1: day 97
            // Scenario 2: registered day + 7 days
            // Scenario 3: registered day + 1 month
            // Scenario 4: registered day + 7 days
            // Scenario 5: registered day + 7 days

            // Visit 2
            // Scenario 1: day 168
            // Scenario 2: day 168
            // Scenario 3: registered day + 2 month
            // Scenario 4: registered day + 14 days
            // Scenario 5: registered day + 14 days

            // Visit 3
            // Scenario 1: day 196
            // Scenario 2: day 196
            // Scenario 3: registered day + 3 month
            // Scenario 4: registered day + 21 days
            // Scenario 5: day before delivery date

            // Visit 4
            // Scenario 1: day before delivery date
            // Scenario 2: day before delivery date
            // Scenario 3: day before delivery date
            // Scenario 4: day before delivery date
            // Scenario 5: day before delivery date

            var dateList = new List<VisitModel>();

            if (ExpectedDateOfDelivery.HasValue) {

                // Calculation: Pregnancy term calculated: "expected delivery date" - "280 days (40 weeks)"
                DateTime endTermDate = ExpectedDateOfDelivery.Value;
                DateTime startTermDate = endTermDate.AddDays(-280);

                DateTime day98 = startTermDate.AddDays(98);
                DateTime day153 = startTermDate.AddDays(153);

                DateTime day154 = startTermDate.AddDays(154);
                DateTime day182 = startTermDate.AddDays(182);

                DateTime day183 = startTermDate.AddDays(183);
                DateTime day258 = startTermDate.AddDays(258);
                
                DateTime today = DateTime.Today;

                var visit1Date = today;
                var visit2Date = today;
                var visit3Date = today;
                var visit4Date = today;

                var visitDaySet1 = new VisitModel();
                var visitDaySet2 = new VisitModel();
                var visitDaySet3 = new VisitModel();
                var visitDaySet4 = new VisitModel();

                // Scenario 1: client registered before 98 days
                if (RegisteredDate < day98)
                {
                    visit1Date = startTermDate.AddDays(97);
                    visit2Date = startTermDate.AddDays(168);
                    visit3Date = startTermDate.AddDays(196);
                    visit4Date = startTermDate.AddDays(279);
                    
                } // Scenario 2: client registered between 98 and 153
                else if (RegisteredDate >= day98 && RegisteredDate <= day153)
                {
                    visit1Date = RegisteredDate.AddDays(7);
                    visit2Date = startTermDate.AddDays(168);
                    visit3Date = startTermDate.AddDays(196);
                    visit4Date = startTermDate.AddDays(279);
                } // Scenario 3: client registered between 154 and 182
                else if (RegisteredDate >= day154 && RegisteredDate <= day182)
                {
                    visit1Date = RegisteredDate.AddMonths(1);
                    visit2Date = RegisteredDate.AddMonths(2);
                    visit3Date = RegisteredDate.AddMonths(3);
                    visit4Date = startTermDate.AddDays(279);
                } // Scenario 4: client registered between 1193 and 258
                else if (RegisteredDate >= day183 && RegisteredDate <= day258)
                {
                    visit1Date = RegisteredDate.AddDays(7);
                    visit2Date = RegisteredDate.AddDays(14);
                    visit3Date = RegisteredDate.AddDays(21);
                    visit4Date = startTermDate.AddDays(279);
                } // Scenario 5: client registered after day 258
                else if (RegisteredDate > day258 && RegisteredDate <= endTermDate)
                {
                    visit1Date = RegisteredDate.AddDays(7);
                    visit2Date = RegisteredDate.AddDays(14);
                    visit3Date = startTermDate.AddDays(279);
                    visit4Date = startTermDate.AddDays(279);
                }

                visitDaySet1.PlannedVisitDate = visit1Date;
                visitDaySet1.VisitType = visitTypes[0];

                visitDaySet2.PlannedVisitDate = visit2Date;
                visitDaySet2.VisitType = visitTypes[1];

                visitDaySet3.PlannedVisitDate = visit3Date;
                visitDaySet3.VisitType = visitTypes[2];

                visitDaySet4.PlannedVisitDate = visit4Date;
                visitDaySet4.VisitType = visitTypes[3];

                dateList.Add(visitDaySet1);
                dateList.Add(visitDaySet2);
                dateList.Add(visitDaySet3);
                dateList.Add(visitDaySet4);

                dateList = dateList.OrderBy(x => x.VisitType.Order).ToList();
            }

            return dateList;
        }

        public DisplaySet GetStatusInfo(Guid motherId)
        {
            DisplaySet statusInfo = new DisplaySet();
            DateTime today = DateTime.Today;

            // Determine note display for mother
            var note = "Pregnant mom";
            var childrenCount = _infantManager.GetChildCountForMother(motherId);
            if (childrenCount == 1)
            {
                note = "Pregnant mom and child";
            }
            else if (childrenCount > 1)
            {
                note = "Multiple children";
            }

            statusInfo.Notes = note;

            //
            // Green Alerts
            //

            // 1. show if the visit deadline is 7 days or further away (replace "Visit 2" with the name of the visit;) -> Development pending 12 Jan 2023
            // 2. show "booked" if a visit has been scheduled in the calendar -> Development pending 12 Jan 2023
            // 3. don't show a visit date if the booked date has passed; or if the last possible day to conduct that visit has passed (see timing in G5 & G6) -> Development pending 12 Jan 2023
            // 4. Healthy:- for pregnant mom clients only, show if there are no alerts/flags raised for the mom.

            statusInfo.Icon = MetricsIconEnum.Success.ToString();
            statusInfo.Color = MetricsColorEnum.Success.ToString();
            statusInfo.Subject = "Healthy";

            //
            // Orange Alerts
            //

            // 1. show if the visit deadline is less than 7 days away (replace "Visit 2" with the name of the visit;) -> Development pending 12 Jan 2023
            // Icon and Color -> MetricsIconEnum.Warning.ToString()

            //
            // Red Alerts
            //

            // 1. Missed visits for pregnant mom - it could be Visit 1, 2, 3, or 4 
            var missedVisit = _visitManager.GetFirstMissedVisitForMother(motherId);
            if (missedVisit != "")
            {
                statusInfo.Icon = MetricsIconEnum.Error.ToString();
                statusInfo.Color = MetricsColorEnum.Error.ToString();
                statusInfo.Subject = missedVisit;
            }


            return statusInfo;
        }
    }
}

