using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [Table(nameof(Language))]
    [EntityPermission(PermissionGroups.GENERAL)]
    public class Language : Language<Guid>
    {
    }

    public class Language<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Locale { get; set; }
        public string Description { get; set; }
    }

    public interface LanguageJoin<TKey>
    {
        [ForeignKey(nameof(LanguageId))]
        public Language Language { get; set; }
        public TKey LanguageId { get; set; }
    }
}
