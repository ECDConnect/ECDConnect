using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users
{
    public class InfantManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private HealthCareWorkerManager _healthCareWorkerManager;

        public InfantManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HealthCareWorkerManager healthCareWorkerManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _healthCareWorkerManager = healthCareWorkerManager;
        }

        // GG BUSINESS RULES FOR CREATING A CHILD AND SELECTING AN EXISTING CAREGIVER

        // This existing caregiver is of type mother.
        // Then we populate MotherCaregiverId on the Infant table to indicate that the mom is linked to this child
        // If existing caregiver is not of type mother
        // Then we populate CaregiverId on the Infant table

        public Infant AddInfant(InfantModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var infantUser = GetUserFromInputModel(input);
            var infant = new Infant();

            // The caregiverId arriving here, could be a caregiver or mother from select box when adding an infant
            var caregiverRepo = _repoFactory.CreateGenericRepository<Caregiver>(userContext: applicationUserId);
            Caregiver caregiver = (Caregiver)caregiverRepo.GetAll().Where(x => x.Id.Equals(input.CaregiverId)).FirstOrDefault();

            var motherRepo = _repoFactory.CreateGenericRepository<Mother>(userContext: applicationUserId);
            Mother mother = (Mother)motherRepo.GetAll().Where(x => x.UserId.Equals(input.CaregiverId.ToString())).FirstOrDefault();

            // if both are null we create a new caregiver from request data
            if (caregiver == null && mother == null)
            {
                caregiver = GetCaregiverFromInput(input);

                infant = new Infant()
                {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = applicationUserId,
                    UserId = input.UserId,
                    User = infantUser,
                    CaregiverId = caregiver.Id,
                    Caregiver = caregiver,
                    GenderId = input.GenderId,
                    WeightAtBirth = input.WeightAtBirth,
                    LengthAtBirth = input.LengthAtBirth
                };
            }
            else
            {
                if (mother != null)
                {
                    infant = new Infant()
                    {
                        Id = Guid.NewGuid(),
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = applicationUserId,
                        UserId = input.UserId,
                        User = infantUser,
                        MotherCaregiverId = mother.Id,
                        Mother = mother,
                        GenderId = input.GenderId,
                        WeightAtBirth = input.WeightAtBirth,
                        LengthAtBirth = input.LengthAtBirth
                    };
                }
                else
                {
                    infant = new Infant()
                    {
                        Id = Guid.NewGuid(),
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = applicationUserId,
                        UserId = input.UserId,
                        User = infantUser,
                        CaregiverId = caregiver.Id,
                        Caregiver = caregiver,
                        GenderId = input.GenderId,
                        WeightAtBirth = input.WeightAtBirth,
                        LengthAtBirth = input.LengthAtBirth
                    };
                }
            }


            var infantRepo = _repoFactory.CreateGenericRepository<Infant>(userContext: applicationUserId);
            try
            {
                return infantRepo.Insert(infant);
            }
            catch (Exception e)
            {
                return new Infant();
            }
        }

        public Infant UpdateInfant(string id, InfantModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var infantRepo = _repoFactory.CreateRepository<Infant>(userContext: applicationUserId);
            var infantToUpdate = infantRepo.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).FirstOrDefault();
            var infantUser = GetUserFromInputModel(input);

            infantToUpdate.UpdatedDate = DateTime.Now;
            infantToUpdate.UpdatedBy = applicationUserId;
            infantToUpdate.UserId = input.UserId;
            infantToUpdate.User = infantUser;
            infantToUpdate.CaregiverId = input.CaregiverId;
            infantToUpdate.Caregiver = GetCaregiverFromInput(input);
            infantToUpdate.GenderId = input.GenderId;
            infantToUpdate.WeightAtBirth = input.WeightAtBirth;
            infantToUpdate.LengthAtBirth = input.LengthAtBirth;

            return infantRepo.Update(infantToUpdate);
        }

        private ApplicationUser GetUserFromInputModel(InfantModel input)
        {
            return new ApplicationUser()
            {
                Id = GetUserIdOrGenerateNew(input.UserId),
                FirstName = input.FirstName,
                DateOfBirth = input.DateOfBirth,
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

        private Caregiver GetCaregiverFromInput(InfantModel input)
        {
            var caregiverInput = input.Caregiver;
            if (caregiverInput == null)
            {
                return null;
            }

            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var addressRepo = _repoFactory.CreateRepository<SiteAddress>(userContext: applicationUserId);
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var healthCareWorkerId = _healthCareWorkerManager.GetHealthCareWorkerIdByUserId(applicationUserId);
            if (healthCareWorkerId != null)
            {
                caregiverInput.HealthCareWorkerId = healthCareWorkerId;
            }
            SiteAddress siteAddress = (SiteAddress)addressRepo.GetAll().Where(x => x.Id.Equals(caregiverInput.SiteAddress.Id)).FirstOrDefault();
            if (siteAddress == null)
            {
                caregiverInput.SiteAddress.Id = Guid.NewGuid();
            }
            else
            {
                caregiverInput.SiteAddress = siteAddress;
            }

            return new Caregiver()
            {
                Id = GetCaregiverIdOrGenerateNew(input.CaregiverId),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId,
                JoinReferencePanel = false,
                Contribution = false,
                FirstName = caregiverInput.FirstName,
                Surname = caregiverInput.Surname,
                PhoneNumber = caregiverInput.PhoneNumber,
                RelationId = caregiverInput.RelationId,
                Age = caregiverInput.Age,
                WhatsAppNumber = caregiverInput.WhatsAppNumber,
                HealthCareWorkerId = caregiverInput.HealthCareWorkerId,
                SiteAddressId = caregiverInput.SiteAddressId,
                SiteAddress = caregiverInput.SiteAddress,
                TenantId = tenantId
            };

        }

        private Guid GetCaregiverIdOrGenerateNew(Guid? caregiverId)
        {
            return caregiverId ?? Guid.NewGuid();
        }

        public int GetChildCountForMother(Guid motherId)
        {
            var uId = _contextAccessor.HttpContext.GetUser().Id;
            var childRepo = _repoFactory.CreateGenericRepository<Infant>(userContext: uId);

            return childRepo.GetAll().Where(x => x.MotherCaregiverId.Equals(motherId)).Count();
        }

        public DisplaySet GetStatusInfo(Infant child)
        {
            DisplaySet statusInfo = new DisplaySet();

            statusInfo.Notes = "child";

            //
            // Green Alerts
            //
            // Visit 2 due/booked 12 April:- show if the visit deadline is 7 days or further away (replace "Visit 2" with the name of the visit; this is relevant for both pregnant mom and child clients)
            // show "booked" if a visit has been scheduled in the calendar 
            // don't show a visit date if the booked date has passed; or if the last possible day to conduct that visit has passed (see timing in G5 & G6)
            // Growing well:- for child clients only, show if the child's weight, length, and MUAC measurements are all in the normal range and the child's growth is NOT faltering (ie, growth has increased in the previous 2 visits)
            // Icon and Color -> MetricsIconEnum.Success.ToString()
            statusInfo.Color = MetricsIconEnum.Success.ToString();
            statusInfo.Icon = MetricsIconEnum.Success.ToString();
            statusInfo.Subject = "Growing well";
           
            //
            // Orange Alerts
            //
            // Refer to the clinic:-show if any of these referral items are flagged for child client: Underweight, Growth faltering, Stunted, Obese, Overweight(see G3.8)
            // Refer to Home Affairs:- show if the referral item No CSG/birth certificate is relevant -- only if no birth certificate
            // Refer to SASSA:- Show if client is eligible for CSG but has not applied (see G5.7.1 Child documentation)
            // Visit 2 due 12 April:- show if the visit deadline is less than 7 days away (replace "Visit 2" with the name of the visit; this is relevant for both pregnant mom and child clients)
            // Icon and Color -> MetricsIconEnum.Warning.ToString()
            if (child.WeightAtBirth == null)
            {
                statusInfo.Color = MetricsIconEnum.Warning.ToString();
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Subject = "Low birth weight";
            }
            if (child.LengthAtBirth == null)
            {
                statusInfo.Color = MetricsIconEnum.Warning.ToString();
                statusInfo.Icon = MetricsIconEnum.Warning.ToString();
                statusInfo.Subject = "Growth faltering";
            }

            //
            // Red Alerts
            //
            // Icon and Color -> MetricsIconEnum.Error.ToString()

            return statusInfo;
        }
    }
}