using ECDLink.DataAccessLayer.Entities.Visits;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class VisitDataModel
    {
        public Guid? VisitId { get; set; }
        public Visit Visit { get; set; }
        public int? CmsVisitNameTypeId { get; set; }
        public int? CmsVisitQuestionnaireTypeId { get; set; }
        public int? CmsVisitQuestionTypeId { get; set; }
        public int? CmsVisitAnswerTypeId { get; set; }
        public int? CmsContentId { get; set; }
        public int? CmsContentTypeFieldId { get; set; }
        public string CmsContentValue { get; set; }
        public string QuestionAnswer { get; set; }
    }
}

