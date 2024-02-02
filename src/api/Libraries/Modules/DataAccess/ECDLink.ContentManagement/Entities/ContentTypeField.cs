using ECDLink.ContentManagement.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.ContentManagement.Entities
{
    [Table(nameof(ContentTypeField))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ContentTypeField : EntityBase
    {
        public int FieldOrder { get; set; }
        public string FieldName { get; set; }
        public int FieldTypeId { get; set; }
        

        [ForeignKey(nameof(FieldTypeId))]
        public FieldType FieldType { get; set; }

        public int ContentTypeId { get; set; }
        [ForeignKey(nameof(ContentTypeId))]
        public ContentType ContentType { get; set; }

        public bool IsActive { get; set; }

        public string DataLinkName { get; set; }

        public string DisplayName { get; set; }
        public bool DisplayMainTable { get; set; }
        public bool DisplayPage { get; set; }
        public bool IsRequired { get; set; }
    }
}
