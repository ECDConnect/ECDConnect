using ECDLink.Tenancy.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Tenancy.Model
{
    public class TenantModel
    {
        public string Id { get; set; }

        public string SiteAddress { get; set; }

        public string ApplicationName { get; set; }

        public string OrganisationName { get; set; }

        // DB Configuration
        public string ConnectionString { get; set; }

        public string DbProvider { get; set; }

        public TenantType TenantType { get; set; } = TenantType.Tenant;
    }
}
