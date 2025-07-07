using ECDLink.ContentManagement.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.ContentManagement.Entities
{
    [Table(nameof(ContentStatus))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ContentStatus : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
