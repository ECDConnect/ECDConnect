using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits
{
    [Table(nameof(VisitType))]
    public class VisitType : VisitType<Guid>
    {
    }

    public class VisitType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public string Type { get; set; }

    }

    public interface VisitTypeJoin<TKey>
    {
        [ForeignKey(nameof(VisitTypeId))]
        public VisitType VisitType { get; set; }
        public TKey VisitTypeId { get; set; }
    }
}
