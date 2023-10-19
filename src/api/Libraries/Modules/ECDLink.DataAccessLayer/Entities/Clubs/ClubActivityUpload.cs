using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Clubs
{
    [Table(nameof(ClubActivityUpload))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class ClubActivityUpload : ClubActivityUpload<Guid>
    {

    }

    public class ClubActivityUpload<TKey> : EntityBase<TKey>, ClubJoin<TKey>
        where TKey : IEquatable<TKey>
    {
        public TKey ClubId { get; set; }
        [ForeignKey(nameof(ClubId))]
        public virtual Club Club { get; set; }
        public Guid DocumentId { get; set; }
        public virtual Document Document { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string Description { get; set; }
        public string ActivityType { get; set; }
    }

    public interface ClubActivityUploadJoin<TKey>
    {
        [ForeignKey(nameof(ClubActivityUploadId))]
        public ClubActivityUpload ClubActivityUpload { get; set; }
        public TKey ClubActivityUploadId { get; set; }
    }
}
