using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities.Visits
{
    [Table(nameof(VisitData))]
    public class VisitData : VisitData<Guid>
    {
    }

    public class VisitData<TKey> : EntityBase<TKey>, VisitJoin<TKey>
         where TKey : IEquatable<TKey>
    {
        public TKey VisitId { get; set; }
        [ForeignKey(nameof(VisitId))]
        public virtual Visit Visit { get; set; }
        public string VisitName { get; set; }
        public string VisitSection { get; set; }
        public string Question { get; set; }
        public string QuestionAnswer { get; set; }

        public virtual ICollection<VisitDataStatus> VisitDataStatus { get; set; }
    }

    public interface VisitDataJoin<TKey>
    {
        [ForeignKey(nameof(VisitDataId))]
        public VisitData VisitData { get; set; }
        public TKey VisitDataId { get; set; }
    }
}
