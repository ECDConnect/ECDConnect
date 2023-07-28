using ECDLink.PostgresTenancy.Entities;
using ECDLink.PostgresTenancy.Repository;
using ECDLink.Tenancy.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.PostgresTenancy.Services
{
    public class TenantService
    {
        private readonly ITenancyRepository _repository;

        public TenantService(ITenancyRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<TenantModel> GetAllTenants()
        {
            return _repository.GetAll().Select(t => Cast(t)).ToList();
        }

        public TenantModel GetTenantById(string id)
        {
            var tenant = _repository.GetById(id);

            if (tenant == null)
            {
                return default;
            }

            return Cast(tenant);
        }

        public TenantModel GetTenantByUrl(string url)
        {
            var tenant = _repository.GetAll()
                            .Where(x => url.Contains(x.SiteAddress) || url.Contains(x.AdminSiteAddress) || url.Contains(x.TestSiteAddress) || url.Contains(x.AdminTestSiteAddress))
                            .OrderBy(x => x.Id)
                            .FirstOrDefault();

            if (tenant == null)
            {
                return default;
            }

            return Cast(tenant);
        }

        public TenantModel AddTenant(TenantModel tenant)
        {
            if (tenant == null)
            {
                return default;
            }

            var entity = _repository.Insert(new TenantEntity
            {
                ApplicationName = tenant.ApplicationName,
                InsertedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                OrganisationName = tenant.OrganisationName,
                SiteAddress = tenant.SiteAddress,
                AdminSiteAddress = tenant.AdminSiteAddress,
                //DatabaseName = connection["Database"]?.ToString() ?? string.Empty,
                //Server = connection["Server"]?.ToString() ?? string.Empty,
                //ConnectionString = tenant.ConnectionString,
                DbProvider = "postgressql",
                TenantType = tenant.TenantType,
                TestSiteAddress = tenant.TestSiteAddress,
                AdminTestSiteAddress = tenant.AdminTestSiteAddress,
                MoodleUrlVar = tenant.MoodleUrlVar,
                MoodleConfigVar = tenant.MoodleConfigVar
            });

            return Cast(entity);
        }

        private static TenantModel Cast(TenantEntity tenantEntity)
        {
            return new TenantModel
            {
                Id = tenantEntity.Id,
                OrganisationName = tenantEntity.OrganisationName,
                ApplicationName = tenantEntity.ApplicationName,
                SiteAddress = tenantEntity.SiteAddress,
                AdminSiteAddress = tenantEntity.AdminSiteAddress,
                TenantType = tenantEntity.TenantType,
                ThemePathVar = tenantEntity.ThemePathVar,
                Var1 = tenantEntity.Var1,
                Var2 = tenantEntity.Var2,
                TestSiteAddress = tenantEntity.TestSiteAddress,
                AdminTestSiteAddress = tenantEntity.AdminTestSiteAddress,
                MoodleUrlVar = tenantEntity.MoodleUrlVar,
                MoodleConfigVar = tenantEntity.MoodleConfigVar

            };
        }
    }
}
