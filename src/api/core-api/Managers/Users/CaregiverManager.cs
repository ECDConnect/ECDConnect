using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security.Extensions;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.Managers.Users
{
    public class CaregiverManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private Guid? _applicationUserId;
        private IGenericRepository<Caregiver, Guid> _caregiverRepo;

        public CaregiverManager( 
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser()?.Id;
            _caregiverRepo = _repoFactory.CreateGenericRepository<Caregiver>(userContext: _applicationUserId);
        }

    }
}

