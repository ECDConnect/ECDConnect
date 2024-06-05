using ECDLink.PostgresTenancy.Entities;
using ECDLink.PostgresTenancy.Repository;
using ECDLink.Tenancy.Model;
using Microsoft.EntityFrameworkCore;
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

        public IEnumerable<TenantInternalModel> GetAllTenants()
        {
            var tenants = _repository.GetAll().ToList();
            var tenantModules = _repository.GetSet<TenantHasModule>().ToList();

            var results = new List<TenantInternalModel>();
            foreach (var dbTenant in tenants)
            {
                var tenant = Cast(dbTenant);
                var modules = tenantModules.Where(x => x.TenantId == tenant.Id).Select(x => x.Module);
                if ((tenant.TenantType == Tenancy.Enums.TenantType.WhiteLabel) || (tenant.TenantType == Tenancy.Enums.TenantType.WhiteLabelTemplate))
                {
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

        //public TenantInternalModel GetTenantById(string id)
        //{
        //    var tenant = _repository.GetById(id);
        //    if (tenant == null)
        //    {
        //        return default;
        //    }
        //    return Cast(tenant);
        //}

        public TenantInternalModel GetTenantByUrl(string url)
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

        public TenantInternalModel AddTenant(TenantInternalModel tenant)
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
                TenantTypeId = tenant.TenantType,
                TestSiteAddress = tenant.TestSiteAddress,
                AdminTestSiteAddress = tenant.AdminTestSiteAddress,
                MoodleUrl = tenant.MoodleUrl,
                MoodleConfig = tenant.MoodleConfig,
                GoogleAnalyticsTag = tenant.GoogleAnalyticsTag,
                GoogleTagManager = tenant.GoogleTagManager
            });

            return Cast(entity);
        }

        private static TenantInternalModel Cast(TenantEntity tenantEntity)
        {
            return new TenantInternalModel
            {
                Id = tenantEntity.Id,
                OrganisationName = tenantEntity.OrganisationName,
                ApplicationName = tenantEntity.ApplicationName,
                SiteAddress = tenantEntity.SiteAddress,
                AdminSiteAddress = tenantEntity.AdminSiteAddress,
                TenantType = tenantEntity.TenantTypeId,
                ThemePath = tenantEntity.ThemePath,
                TestSiteAddress = tenantEntity.TestSiteAddress,
                AdminTestSiteAddress = tenantEntity.AdminTestSiteAddress,
                MoodleUrl = tenantEntity.MoodleUrl,
                MoodleConfig = tenantEntity.MoodleConfig,
                GoogleAnalyticsTag = tenantEntity.GoogleAnalyticsTag,
                GoogleTagManager = tenantEntity.GoogleTagManager
            };
        }
    }
}
