using System;
using System.Linq;
using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EcdLink.Api.CoreApi.Managers.Users
{
    public class InfantManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IDbContextFactory<AuthenticationDbContext> _dbFactory;
        private IGenericRepositoryFactory _repoFactory;
        private MotherManager _motherManager;
        private HealthCareWorkerManager _healthCareWorkerManager;

        public InfantManager(
            IHttpContextAccessor contextAccessor,
            IDbContextFactory<AuthenticationDbContext> dbFactory,
            IGenericRepositoryFactory repoFactory,
            MotherManager motherManager,
            HealthCareWorkerManager healthCareWorkerManager)
        {
            _contextAccessor = contextAccessor;
            _dbFactory = dbFactory;
            _repoFactory = repoFactory;
            _motherManager = motherManager;
            _healthCareWorkerManager = healthCareWorkerManager;
        }

        public Infant AddInfant(InfantModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var infantUser = GetUserFromInputModel(input);
            var caregiver = GetCaregiverFromInput(input);

            var infant = new Infant()
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId,
                UserId = input.UserId,
                User = infantUser,
                CaregiverId = input.CaregiverId,
                Caregiver = caregiver,
                GenderId = input.GenderId,
                WeightAtBirth = input.WeightAtBirth,
                LengthAtBirth = input.LengthAtBirth
            };

            var infantRepo = _repoFactory.CreateRepository<Infant>(userContext: applicationUserId);

            try
            {
                return infantRepo.Insert(infant);
            } catch(Exception e)
            {
                return null;
            }
        }

        public Infant UpdateInfant(string id, InfantModel input)
        {
            var applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            var infantRepo = _repoFactory.CreateRepository<Infant>(userContext: applicationUserId);
            var infantToUpdate = infantRepo.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).FirstOrDefault();
            var infantUser = GetUserFromInputModel(input);
            //var mother = _motherManager.GetMotherFromInputModel(input.Mother);

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
            var healthCareWorkerId = _healthCareWorkerManager.GetHealthCareWorkerIdByUserId(applicationUserId);

            return new Caregiver()
            {
                Id = input.CaregiverId ?? Guid.NewGuid(),
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
                HealthCareWorkerId = healthCareWorkerId,
                SiteAddressId = caregiverInput.SiteAddressId,
                SiteAddress = caregiverInput.SiteAddress,
            };
        }
    }
}

