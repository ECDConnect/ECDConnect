using ECDLink.DataAccessLayer.Entities.Visits;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class VisitDataModel
    {
        public Guid? VisitId { get; set; }
        public Visit Visit { get; set; }

        public int CmsVisitNameContentId { get; set; }
        public int CmsQuestionnaireContentId { get; set; }
        public int CmsQuestionContentId { get; set; }
        public int CmsAnswerContentId { get; set; }
        public string QuestionAnswer { get; set; }
    }

    public class CMSVisit
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public string Sequence { get; set; }
        public string Color { get; set; }
        public Boolean IsCompleted { get; set; }
        public virtual ICollection<CMSQuestionnaire> LinkedQuestionnaires { get; set; }
    }

    public class CMSQuestionnaire
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Heading { get; set; }
        public string SubHeading { get; set; }
        public string Type { get; set; }
        public virtual ICollection<CMSQuestion> LinkedQuestions { get; set; }
    }

    public class CMSQuestion
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Heading { get; set; }
        public string SubHeading { get; set; }
        public string Type { get; set; }
        public string Sequence { get; set; }
        public virtual ICollection<CMSAnswerOption> LinkedAnswerOptions { get; set; }
        public string QuestionAnswer { get; set; }  // this is the actual answer captured against question
    }


    public class CMSAnswerOption
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Sequence { get; set; }
        public string Image { get; set; }
        public string Type { get; set; }
        public string Video { get; set; }
    }
}

