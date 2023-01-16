using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users
{
    public class MotherManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private HealthCareWorkerManager _healthCareWorkerManager;
        private InfantManager _infantManager;

        public MotherManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HealthCareWorkerManager healthCareWorkerManager,
            InfantManager infantManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _healthCareWorkerManager = healthCareWorkerManager;
            _infantManager = infantManager;
        }

        // GG BUSINESS RULES FOR CREATING A MOTHER AND SELECTING AN EXISTING CAREGIVER

        // We save the caregiver's id to column LinkedCaregiverId on the Mother table to indicate that this mother is linked to an exisiting caregiver.
        // When a caregiver is 'marked/linked' to a mother, we mark the caregiver with a boolean 'isMother' for the FE to exclude from step 2 of 5.

        public Mother AddMother(MotherModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var mother = GetMotherFromInputModel(input);

            var repository = _repoFactory.CreateRepository<Mother>(userContext: applicationUserId);
            return repository.Insert(mother);
        }

        public Mother UpdateMother(string id, MotherModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var repository = _repoFactory.CreateRepository<Mother>(userContext: applicationUserId);
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

        public DisplaySet GetStatusInfo(Guid motherId)
        {
            DisplaySet statusInfo = new DisplaySet();

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
            // 3. don't show a visit date if the booked date has passed; or if the last possible day to conduct that visit has passed (see timing in G5 & G6)
            // 4. Healthy:- for pregnant mom clients only, show if there are no alerts/flags raised for the mom.
            // Icon and Color -> MetricsIconEnum.Success.ToString()
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

            // 1. Missed visits for pregnant mom - it could be Visit 1, 2, 3, or 4 -> Development pending 12 Jan 2023
            // Icon and Color -> MetricsIconEnum.Error.ToString()


            return statusInfo;
        }
    }
}

