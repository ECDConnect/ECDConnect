using ECDLink.ContentManagement.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.ContentManagement.Entities
{
    [Table(nameof(Content))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Content : EntityBase
    {
        [ForeignKey(nameof(ContentTypeId))]
        public ContentType ContentType { get; set; }
        public int ContentTypeId { get; set; }

        public ICollection<ContentValue> ContentValues { get; set; }

        public bool IsActive { get; set; }
    }
}
