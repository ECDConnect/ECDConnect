using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users.GrowGreat
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
            var healthCareWorkerRepo = _repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: userId);
            var healthCareWorker = healthCareWorkerRepo.GetAll().Where(x => x.UserId.ToString() == userId.ToString()).OrderBy(x => x.Id).FirstOrDefault();
            if (healthCareWorker != null)
            {
                return healthCareWorker.Id;
            }
            return null;
        }
    }
}

