using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users.GrowGreat
{
    public class CaregiverManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private IGenericRepository<Caregiver, Guid> _caregiverRepo;

        public CaregiverManager( 
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;
            _caregiverRepo = _repoFactory.CreateGenericRepository<Caregiver>(userContext: _applicationUserId);
        }

        public List<Caregiver> GetAllCaregiversForHCW(Guid userId, int recordsPerPage, int pageNumber)
        {
            return _caregiverRepo.GetAll().Where(x => x.HealthCareWorker.User.Id == userId).OrderBy(x => x.Id).ToList()
                .Skip((pageNumber - 1) * recordsPerPage) //Skip Logic
                .Take(recordsPerPage).ToList(); //Take Logic;
        }
    }
}

