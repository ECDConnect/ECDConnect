using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer
{
    [Table(nameof(MeetingType))]
    public class MeetingType : MeetingType<Guid>
    {
    }

    public class MeetingType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string Description { get; set; }
    }

    public interface MeetingTypeJoin<TKey>
    {
        [ForeignKey(nameof(MeetingTypeId))]
        public MeetingType MeetingType { get; set; }
        public TKey MeetingTypeId { get; set; }
    }
}
