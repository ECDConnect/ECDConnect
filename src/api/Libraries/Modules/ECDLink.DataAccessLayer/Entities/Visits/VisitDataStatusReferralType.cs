using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits
{
    [Table(nameof(VisitDataStatusReferralType))]
    public class VisitDataStatusReferralType : VisitDataStatusReferralType<Guid>
    {
    }

    public class VisitDataStatusReferralType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public Guid ReferralTypeId { get; set; }
        public Guid VisitDataStatusId { get; set; }

        public virtual ReferralType ReferralType { get; set; }
        public virtual VisitDataStatus VisitDataStatus { get; set; }
    }
}
