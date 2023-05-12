using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Users
{
    public class UserLicenseManager
    {
        private IHttpContextAccessor _contextAccessor;
        private IGenericRepositoryFactory _repoFactory;
        private string _applicationUserId;

        private IGenericRepository<LicenseType, Guid> _licenseTypeRepo;
        private IGenericRepository<License, Guid> _licenseRepo;

        public UserLicenseManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;

            _applicationUserId = _contextAccessor.HttpContext.GetUser().Id;

            _licenseTypeRepo = _repoFactory.CreateGenericRepository<LicenseType>(userContext: _applicationUserId);
            _licenseRepo = _repoFactory.CreateGenericRepository<License>(userContext: _applicationUserId);
        }

        public List<License> GetLicensesForUser(string userId)
        {
            return (
                from license in _licenseRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true)
                join licenseType in _licenseTypeRepo.GetAll() on license.LicenseTypeId equals licenseType.Id
                select license
            ).ToList();
        }

        public License GetLicenseForUserForType(string userId, string type)
        {
            return (
                from license in _licenseRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true)
                join licenseType in _licenseTypeRepo.GetAll().Where(y => y.Name == type) on license.LicenseTypeId equals licenseType.Id
                select license
            ).FirstOrDefault();
        }

    }
}

