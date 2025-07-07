using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(Relation))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Relation : Relation<Guid>
    {
    }

    public class Relation<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Description { get; set; }
    }

    public interface RelationJoin<TKey>
    {
        [ForeignKey(nameof(RelationId))]
        public Relation Relation { get; set; }
        public TKey RelationId { get; set; }
    }
}
