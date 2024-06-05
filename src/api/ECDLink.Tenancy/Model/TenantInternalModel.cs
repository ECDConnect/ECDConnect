using ECDLink.Tenancy.Enums;
using System;
using System.Collections.Generic;

namespace ECDLink.Tenancy.Model
{
    public class TenantInternalModel
    {
        public Guid Id { get; set; }
        public string SiteAddress { get; set; }
        public string AdminSiteAddress { get; set; }
        public string ApplicationName { get; set; }
        public string OrganisationName { get; set; }
        public TenantType TenantType { get; set; } = TenantType.WhiteLabel;
        public string ThemePath { get; set; }
        public string TestSiteAddress { get; set; }
        public string AdminTestSiteAddress { get; set; }
        public string MoodleUrl { get; set; }
        public string MoodleConfig { get; set; }
        public string Path { get; set; }
        public string Host { get; set; }
        public TenantModuleModel Modules { get; set; }
        public string GoogleAnalyticsTag { get; set; }
        public string GoogleTagManager { get; set; }
    }
}
