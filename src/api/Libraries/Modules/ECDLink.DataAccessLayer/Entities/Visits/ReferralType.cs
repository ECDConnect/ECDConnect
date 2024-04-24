using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits
{
    [Table(nameof(ReferralType))]
    public class ReferralType : ReferralType<Guid>
    {
    }

    public class ReferralType<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public string Name { get; set; }

        public virtual ICollection<VisitDataStatusReferralType> VisitDataStatus { get; set; }
    }
}
