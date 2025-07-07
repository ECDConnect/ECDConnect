using ECDLink.Tenancy.Enums;
using System;

namespace ECDLink.Tenancy.Model
{
    public class TenantInternalModel
    {
        public Guid Id { get; set; }
        public string SiteAddress { get; set; }
        public string SiteAddress2 { get; set; }
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
        public string OrganisationEmail { get; set; }
        public string DefaultSystemSettings { get; set; }
        public string BlobStorageAddress { get; set; }

        public string GetClaimString()
        {
            return string.Format("{0}|{1}", this.Id.ToString(), this.SiteAddress);
        }
    }
}
