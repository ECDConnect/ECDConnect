using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits {

    [Table(nameof(VisitBackReferral))]
    public class VisitBackReferral : VisitBackReferral<Guid> {
    }

    public class VisitBackReferral<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey> {
        public TKey VisitDataStatusId { get; set; }
        [ForeignKey(nameof(VisitDataStatusId))]
        public virtual VisitDataStatus VisitDataStatus { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public string Comment { get; set; }
    }

    public interface VisitBackReferralJoin<TKey> {
        [ForeignKey(nameof(VisitBackReferralId))]
        public VisitBackReferral VisitBackReferral { get; set; }
        public TKey VisitBackReferralId { get; set; }
    }
}
