using ECDLink.DataAccessLayer.Entities.Visits;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class VisitDataModel
    {
        public string VisitId { get; set; }
        public Visit Visit { get; set; }
        public int CmsVisitNameContentId { get; set; }
        public int CmsQuestionnaireContentId { get; set; }
        public int CmsQuestionContentId { get; set; }
        public int CmsAnswerContentId { get; set; }
        public string QuestionAnswer { get; set; }
    }

    public class VisitDataStatusModel
    {
        public string VisitDataId { get; set; }
        public VisitData VisitData { get; set; }
        public string Comment { get; set; }
        public string Color { get; set; }
        public string Type { get; set; }
    }
    
    public class CMSQuestion
    {
        public string Name { get; set; }
        public string QuestionAnswer { get; set; }  // this is the actual answer captured against question
    }

}

