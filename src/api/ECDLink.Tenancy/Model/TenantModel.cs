using ECDLink.Tenancy.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Tenancy.Model
{
    public class TenantModel
    {
        public Guid Id { get; set; }

        public string SiteAddress { get; set; }

        public string AdminSiteAddress { get; set; }

        public string ApplicationName { get; set; }

        public string OrganisationName { get; set; }

        // DB Configuration
        //public string ConnectionString { get; set; }

        //public string DbProvider { get; set; }

        public TenantType TenantType { get; set; } = TenantType.Tenant;
        public string ThemePathVar { get; set; }
        public string Var1 { get; set; }
        public string Var2 { get; set; }
    }
}
