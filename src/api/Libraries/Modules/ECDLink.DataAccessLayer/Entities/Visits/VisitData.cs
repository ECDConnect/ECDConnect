using ECDLink.DataAccessLayer.Entities.Base;
using System;
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
        public int CmsVisitNameContentId { get; set; }
        public int CmsQuestionnaireContentId { get; set; }
        public int CmsQuestionContentId { get; set; }
        public int CmsAnswerContentId { get; set; }
        public string QuestionAnswer { get; set; }
    }

    public interface VisitDataJoin<TKey>
    {
        [ForeignKey(nameof(VisitDataId))]
        public VisitData VisitData { get; set; }
        public TKey VisitDataId { get; set; }
    }
}
