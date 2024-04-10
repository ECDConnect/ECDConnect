using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits
{
    [Table(nameof(VisitDataStatus))]
    public class VisitDataStatus : VisitDataStatus<Guid>
    {
    }

    public class VisitDataStatus<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public TKey VisitDataId { get; set; }
        [ForeignKey(nameof(VisitDataId))]
        public virtual VisitData VisitData { get; set; }
        public string Comment { get; set; }
        public string Color { get; set; }
        public string Type { get; set; }
        public string Section { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? ReferralDateCompleted { get; set; }
        public bool BackReferralCompleted { get; set; }
        public DateTime? BackReferralDateCompleted { get; set; }
        public string BackReferralAdminComment { get; set; }
        [NotMapped]
        public virtual VisitBackReferral BackReferral { get; set; }
        [NotMapped]
        public virtual ICollection<VisitDataStatusReferralType> VisitDataStatusReferralTypes { get; set; }
        [NotMapped]
        public virtual ICollection<ReferralType> ReferralTypes { get; set; }
    }

    public interface VisitDataStatusJoin<TKey>
    {
        [ForeignKey(nameof(VisitDataStatusId))]
        public VisitDataStatus VisitDataStatus { get; set; }
        public TKey VisitDataStatusId { get; set; }
    }

    
}
