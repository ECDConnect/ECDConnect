using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(ClubActivityUploadType))]
    [EntityPermission(PermissionGroups.DOCUMENTS)]
    public class ClubActivityUploadType : ClubActivityUploadType<Guid>
    {
    }

    public class ClubActivityUploadType<TKey> : EntityBase<TKey>, IEnumType<FileTypeEnum>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public FileTypeEnum EnumId { get; set; }
    }

    public interface ClubActivityUploadTypeJoin<TKey>
    {
        [ForeignKey(nameof(ClubActivityUploadTypeId))]
        public ClubActivityUploadType ClubActivityUploadType { get; set; }
        public TKey ClubActivityUploadTypeId { get; set; }
    }
}
