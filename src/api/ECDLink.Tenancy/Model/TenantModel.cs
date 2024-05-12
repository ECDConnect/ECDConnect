using ECDLink.Tenancy.Enums;
using System;

namespace ECDLink.Tenancy.Model
{
    public class TenantModel
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
    }
}
