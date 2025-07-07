using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(Gender))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Gender : Gender<Guid>
    {
    }

    public class Gender<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface GenderJoin<TKey>
    {
        [ForeignKey(nameof(GenderId))]
        public Gender Gender { get; set; }
        public TKey GenderId { get; set; }
    }
}
