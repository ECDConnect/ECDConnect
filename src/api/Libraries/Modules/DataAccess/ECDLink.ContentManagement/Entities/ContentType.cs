using ECDLink.ContentManagement.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.ContentManagement.Entities
{
    [Table(nameof(ContentType))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ContentType : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public ICollection<ContentTypeField> Fields { get; set; }

        public ICollection<Content> Content { get; set; }

        public string MetaData { get; set; }

        public bool IsActive { get; set; }

        public bool IsVisiblePortal { get; set; }

        public int PortalDisplayOrder { get; set; }
    }
}
