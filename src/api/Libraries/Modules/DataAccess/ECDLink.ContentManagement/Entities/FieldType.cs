using ECDLink.ContentManagement.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.ContentManagement.Entities
{
    [Table("ContentFieldType")]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class FieldType : EntityBase
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string DataType { get; set; }

        public string AssemblyDataType { get; set; }

        public string GraphQLDataType { get; set; }
    }
}
