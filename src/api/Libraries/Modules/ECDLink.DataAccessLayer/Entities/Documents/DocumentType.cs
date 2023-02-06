using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Documents
{
    [Table(nameof(DocumentType))]
    [EntityPermission(PermissionGroups.DOCUMENTS)]
    public class DocumentType : DocumentType<Guid>
    {
    }

    public class DocumentType<TKey> : EntityBase<TKey>, IEnumType<FileTypeEnum>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public FileTypeEnum EnumId { get; set; }
    }

    public interface DocumentTypeJoin<TKey>
    {
        [ForeignKey(nameof(DocumentTypeId))]
        public DocumentType DocumentType { get; set; }
        public TKey DocumentTypeId { get; set; }
    }
}
