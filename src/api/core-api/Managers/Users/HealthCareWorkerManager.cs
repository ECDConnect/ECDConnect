using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users
{
    public class HealthCareWorkerManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;

        public HealthCareWorkerManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
        }

        public Guid? GetHealthCareWorkerIdByUserId(string userId)
        {
            var uId = _contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = _repoFactory.CreateRepository<HealthCareWorker>(userContext: uId);
            var healthCareWorker = healthCareWorkerRepo.GetAll().Where(x => x.UserId.Contains(userId)).FirstOrDefault();
            if (healthCareWorker != null)
            {
                return healthCareWorker.Id;
            }
            return null;
        }
    }
}

