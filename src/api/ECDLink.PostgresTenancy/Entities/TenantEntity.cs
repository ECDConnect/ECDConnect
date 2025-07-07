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
        public string SiteAddress2 { get; set; }
        public string OrganisationName { get; set; }
        public TenantType TenantTypeId { get; set; }
        public string AdminSiteAddress { get; set; }
        public string ThemePath { get; set; }
        public string TestSiteAddress { get; set; }
        public string AdminTestSiteAddress { get; set; }
        public string MoodleUrl { get; set; }
        public string MoodleConfig { get; set; }
        public string GoogleAnalyticsTag { get; set; }
        public string GoogleTagManager { get; set; }
        public string OrganisationEmail { get; set; }
        public string DefaultSystemSettings { get; set; }
        public string BlobStorageAddress { get; set; }
    }
}
