using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(Education))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Education : Education<Guid>
    {
    }

    public class Education<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface EducationJoin<TKey>
    {
        [ForeignKey(nameof(EducationId))]
        public Education Education { get; set; }
        public TKey EducationId { get; set; }
    }
}
