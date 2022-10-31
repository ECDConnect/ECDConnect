using ECDLink.PostgresTenancy.Context;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.PostgresTenancy.Repository;
using ECDLink.Tenancy.Enums;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

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
            var tenants = _repository.GetAll().ToList();

            var tenantList = new List<TenantModel>();

            foreach (var tenant in tenants)
            {
                tenantList.Add(Cast(tenant));
            }

            return tenantList;
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

            //if (string.IsNullOrWhiteSpace(tenant.ConnectionString) && tenant.TenantType == Tenancy.Enums.TenantType.Tenant)
            //{
            //    throw new InvalidOperationException("No connection string provided");
            //}

            //var connection = new NpgsqlConnectionStringBuilder(tenant.ConnectionString);

            var entity =_repository.Insert(new TenantEntity
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
                AdminTestSiteAddress = tenant.AdminTestSiteAddress
            });

            return Cast(entity);
        }

        private TenantModel Cast(TenantEntity tenantEntity)
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
                AdminTestSiteAddress = tenantEntity.AdminTestSiteAddress
            };
        }
    }
}
