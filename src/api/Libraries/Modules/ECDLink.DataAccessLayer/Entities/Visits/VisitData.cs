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

        public int? CmsVisitNameTypeId { get; set; }
        public int? CmsVisitQuestionnaireTypeId { get; set; }
        public int? CmsVisitQuestionTypeId { get; set; }
        public int? CmsVisitAnswerTypeId { get; set; }
        public int? CmsContentId { get; set; }
        public int? CmsContentTypeFieldId { get; set; }
        public string CmsContentValue { get; set; }
        public string QuestionAnswer { get; set; }
    }

    public interface VisitDataJoin<TKey>
    {
        [ForeignKey(nameof(VisitDataId))]
        public VisitData VisitData { get; set; }
        public TKey VisitDataId { get; set; }
    }
}
