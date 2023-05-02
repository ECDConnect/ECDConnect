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

        public TenantType TenantType { get; set; } = TenantType.Tenant;
        public string ThemePathVar { get; set; }
        public string Var1 { get; set; }
        public string Var2 { get; set; }
        public string TestSiteAddress { get; set; }
        public string AdminTestSiteAddress { get; set; }
        public string MoodleUrlVar { get; set; }
        public string MoodleConfigVar { get; set; }
    }
}
