using ECDLink.PostgresTenancy.Entities.Base;
using ECDLink.Tenancy.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.PostgresTenancy.Entities
{
    [Table("Tenant")]
    public class TenantEntity : EntityBase
    {
        public string ApplicationName { get; set; }

        public string SiteAddress { get; set; }

        public string OrganisationName { get; set; }

        public TenantType TenantTypeId { get; set; }
        public string AdminSiteAddress { get; set; }
        public string ThemePath { get; set; }
        public string TestSiteAddress { get; set; }
        public string AdminTestSiteAddress { get; set; }
        public string MoodleUrl { get; set; }
        public string MoodleConfig { get; set; }
    }
}
