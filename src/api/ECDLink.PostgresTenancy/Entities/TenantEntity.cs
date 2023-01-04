using ECDLink.PostgresTenancy.Entities.Base;
using ECDLink.Tenancy.Enums;
using ECDLink.Tenancy.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.PostgresTenancy.Entities
{
    [Table("Tenant")]
    public class TenantEntity : EntityBase
    {
        public string ApplicationName { get; set; }

        public string SiteAddress { get; set; }

        public string OrganisationName { get; set; }

        public string Server { get; set; }

        public string DbProvider { get; set; }

        public string DatabaseName { get; set; }

        public string ConnectionString { get; set; }

        public TenantType TenantType { get; set; }
        public string AdminSiteAddress { get; set; }
        public string ThemePathVar { get; set; }
        public string Var1 { get; set; }
        public string Var2 { get; set; }
        public string TestSiteAddress { get; set; }
        public string AdminTestSiteAddress { get; set; }

        public string MoodleUrlVar { get; set; }

    }
}
