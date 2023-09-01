using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.ContentManagement.Entities
{
    [Table(nameof(ContentValue))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ContentValue
    {
        public int Id { get; set; }

        [ForeignKey(nameof(ContentId))]
        public Content Content { get; set; }
        public int ContentId { get; set; }

        public Guid LocaleId { get; set; }

        [ForeignKey(nameof(ContentTypeFieldId))]
        public ContentTypeField ContentTypeField { get; set; }
        public int ContentTypeFieldId { get; set; }

        public string Value { get; set; }

        [ForeignKey(nameof(StatusId))]
        public virtual ContentStatus Status { get; set; }
        public int? StatusId { get; set; }

        [GraphQLIgnore]
        [ForeignKey(nameof(TenantId))]
        public Guid? TenantId { get; set; }

        public DateTime? InsertedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
