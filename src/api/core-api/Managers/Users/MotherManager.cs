using System;
using System.Linq;
using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EcdLink.Api.CoreApi.Managers.Users
{
    public class MotherManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private HealthCareWorkerManager _healthCareWorkerManager;

        public MotherManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            HealthCareWorkerManager healthCareWorkerManager)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _healthCareWorkerManager = healthCareWorkerManager;
        }

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
        
    }
}

