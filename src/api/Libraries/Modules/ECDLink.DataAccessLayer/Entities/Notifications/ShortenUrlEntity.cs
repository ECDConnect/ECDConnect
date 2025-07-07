using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using HotChocolate;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Notifications
{
    [Table("ShortUrl")]
    public class ShortenUrlEntity : ShortenUrlEntity<Guid>
    {
    }

    public class ShortenUrlEntity<TKey> : EntityBase<TKey>, IUserScoped
         where TKey : IEquatable<TKey>
    {
        public Guid? UserId { get; set; }
        public string MessageType { get; set; }
        public string URL { get; set; }
        public int Clicked { get; set; } = 0;
        public int? NotificationResult { get; set; }

        [GraphQLIgnore]
        public string Hierarchy { get; set; }
    }

    public interface ShortenUrlEntityJoin<TKey>
    {
        [ForeignKey(nameof(ShortenUrlEntityId))]
        public ShortenUrlEntity ShortenUrlEntity { get; set; }
        public TKey ShortenUrlEntityId { get; set; }
    }
}
