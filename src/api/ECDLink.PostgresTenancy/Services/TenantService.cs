using ECDLink.PostgresTenancy.Entities;
using ECDLink.PostgresTenancy.Repository;
using ECDLink.Tenancy.Model;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.PostgresTenancy.Services
{
    public class TenantService
    {
        private readonly ITenancyRepository<TenantEntity> _repository;

        public TenantService(ITenancyRepository<TenantEntity> repository)
        {
            _repository = repository;
        }

        private IEnumerable<TenantInternalModel> GetAllTenants(Guid? tenantId, string siteAddress, bool includeModules = true)
        {
            List<TenantEntity> tenants = null;
            List<TenantHasModule> tenantModules = null;

            var tenantQuery = _repository.GetAll();
            var tenantModulesQuery = includeModules ? _repository.GetSet<TenantHasModule>().AsQueryable() : null;
            if (tenantId.HasValue)
            {
                tenantQuery = tenantQuery.Where(x => x.Id == tenantId.Value);
                if (!string.IsNullOrEmpty(siteAddress)) tenantQuery = tenantQuery.Where(x => x.SiteAddress == siteAddress || x.TestSiteAddress == siteAddress || x.AdminSiteAddress == siteAddress || x.AdminTestSiteAddress == siteAddress || x.SiteAddress2 == siteAddress);
                tenants = tenantQuery.ToList();
                if (includeModules)
                {
                    tenantModulesQuery = tenantModulesQuery.Where(x => x.TenantId == tenantId.Value);
                    tenantModules = tenantModulesQuery.ToList();
                }
            }
            else if (!string.IsNullOrEmpty(siteAddress))
            {
                tenantQuery = tenantQuery.Where(x => x.SiteAddress == siteAddress || x.TestSiteAddress == siteAddress || x.AdminSiteAddress == siteAddress || x.AdminTestSiteAddress == siteAddress || x.SiteAddress2 == siteAddress);
                tenants = tenantQuery.ToList();
                if (includeModules)
                {
                    if (tenants.Count > 0) tenantModulesQuery = tenantModulesQuery.Where(x => x.TenantId == tenants[0].Id);
                    tenantModules = tenantModulesQuery.ToList();
                }
            }
            else if (siteAddress == null)
            {
                tenants = tenantQuery.ToList();
                if (includeModules)
                {
                    tenantModulesQuery = tenantModulesQuery.Where(x => x.TenantId == tenantId.Value);
                    tenantModules = tenantModulesQuery.ToList();
                }
            }

            var results = new List<TenantInternalModel>();
            foreach (var dbTenant in tenants)
            {
                var tenant = Cast(dbTenant);
                if (includeModules)
                {
                    var modules = tenantModules.Where(x => x.TenantId == tenant.Id).Select(x => x.Module);
                    //if ((tenant.TenantType == Tenancy.Enums.TenantType.WhiteLabel) || (tenant.TenantType == Tenancy.Enums.TenantType.WhiteLabelTemplate))
                    tenant.Modules = new TenantModuleModel();
                    if (modules != null && modules.Count() > 0)
                    {
                        foreach (var item in modules)
                        {
                            if (item.NormalizedName == "COACH ROLE")
                            {
                                tenant.Modules.CoachRoleName = "Coach";
                                tenant.Modules.CoachRoleEnabled = true;
                            }
                            if (item.NormalizedName == "CLASSROOM ACTIVITIES") tenant.Modules.ClassroomActivitiesEnabled = true;
                            if (item.NormalizedName == "PROGRESS") tenant.Modules.ProgressEnabled = true;
                            if (item.NormalizedName == "ATTENDANCE") tenant.Modules.AttendanceEnabled = true;
                            if (item.NormalizedName == "CALENDAR") tenant.Modules.CalendarEnabled = true;
                            if (item.NormalizedName == "TRAINING") tenant.Modules.TrainingEnabled = true;
                            if (item.NormalizedName == "BUSINESS") tenant.Modules.BusinessEnabled = true;
                        }
                    }
                }
                results.Add(tenant);
            }

            return results;
        }

        public IEnumerable<TenantInternalModel> GetAllTenants(bool includeModules = true)
        {
            return GetAllTenants(null, null, includeModules);
        }

        public IEnumerable<TenantInternalModel> GetTenantById(Guid tenantId, string siteAddress = null, bool includeModules = true)
        {
            return GetAllTenants(tenantId, siteAddress, includeModules);
        }

        public IEnumerable<TenantInternalModel> GetTenantBySiteAddress(string siteAddress, bool includeModules = true)
        {
            return GetAllTenants(null, siteAddress, includeModules);
        }

        public TenantInternalModel UpdateTenantInfo(Guid? tenantId, TenantInfoInputModel input)
        {
            var tenantToUpdate = _repository.GetAll().Where(t => t.Id == tenantId).FirstOrDefault();

            tenantToUpdate.OrganisationEmail = string.IsNullOrEmpty(input.OrganisationEmail) ? tenantToUpdate.OrganisationEmail : input.OrganisationEmail;
            tenantToUpdate.OrganisationName = string.IsNullOrEmpty(input.OrganisationName) ? tenantToUpdate.OrganisationName : input.OrganisationName;
            tenantToUpdate.ApplicationName = string.IsNullOrEmpty(input.ApplicationName) ? tenantToUpdate.ApplicationName : input.ApplicationName;

            return Cast(_repository.Update(tenantToUpdate));
        }

        public TenantInternalModel UpdateTenantThemePath(Guid? tenantId, string themePath)
        {
            var tenantToUpdate = _repository.GetAll().Where(t => t.Id == tenantId).FirstOrDefault();
            tenantToUpdate.ThemePath = themePath;
            return Cast(_repository.Update(tenantToUpdate));
        }

        public bool ValidateNewTenantName(string applicationName)
        {
            var tenant = _repository.GetAll().Where(t => t.SiteAddress.StartsWith(applicationName)).FirstOrDefault();
            return tenant == null ? true : false;
        }

        private static TenantInternalModel Cast(TenantEntity tenantEntity)
        {
            return new TenantInternalModel
            {
                Id = tenantEntity.Id,
                OrganisationName = tenantEntity.OrganisationName,
                ApplicationName = tenantEntity.ApplicationName,
                SiteAddress = tenantEntity.SiteAddress,
                SiteAddress2 = tenantEntity.SiteAddress2,
                AdminSiteAddress = tenantEntity.AdminSiteAddress,
                TenantType = tenantEntity.TenantTypeId,
                ThemePath = tenantEntity.ThemePath,
                TestSiteAddress = tenantEntity.TestSiteAddress,
                AdminTestSiteAddress = tenantEntity.AdminTestSiteAddress,
                MoodleUrl = tenantEntity.MoodleUrl,
                MoodleConfig = tenantEntity.MoodleConfig,
                GoogleAnalyticsTag = tenantEntity.GoogleAnalyticsTag,
                GoogleTagManager = tenantEntity.GoogleTagManager,
                OrganisationEmail = tenantEntity.OrganisationEmail,
                DefaultSystemSettings = tenantEntity.DefaultSystemSettings,
                BlobStorageAddress = tenantEntity.BlobStorageAddress
            };
        }
    }
}
