using System;
using System.Collections.Generic;
using NPOI.SS.Formula.Functions;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class JourneyTimeline
    {
        public string Name { get; set; }
        public string DateCompleted { get; set; }
        public string IconName { get; set; }
        public DateTime? DateValue { get; set; }
        public string Type { get; set; }
        public Guid? VisitId { get; set; }
        public string SecondaryText { get; set; }
    }

    public class AssessmentForm
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string RoleIds { get; set; }
        public string IsPublished { get; set; }
        public string PublishedDate { get; set; }
        public string LogoUrl { get; set; }
        public string FormPagesIds { get; set; }
        public List<AssessmentPage> FormPages { get; set; }
        public string Provider { get; set; }
        public AssessmentForm(Object record)
        {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);
            item.TryGetValue("description", out var description);
            item.TryGetValue("roleIds", out var roleIds);
            item.TryGetValue("isPublished", out var isPublished);
            item.TryGetValue("publishedDate", out var publishedDate);
            item.TryGetValue("logoUrl", out var logoUrl);
            item.TryGetValue("provider", out var provider);
            item.TryGetValue("formPages", out var formPages);

            Id = id.ToString();
            Name = name != null ? name.ToString() : "";
            Description = description != null ? description.ToString() : "";
            RoleIds = roleIds != null ? roleIds.ToString() : "";
            IsPublished = isPublished != null ? isPublished.ToString() : "";
            PublishedDate = publishedDate != null ? publishedDate.ToString() : "";
            LogoUrl = logoUrl != null ? logoUrl.ToString() : "";
            Provider = provider != null ? provider.ToString() : "";
            FormPagesIds = formPages != null ? formPages.ToString(): "";
        }
    }

    public class AssessmentPage
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string StepNr { get; set; }
        public string FormQuestionsIds { get; set; }

        public string Info { get; set; }

        public string IsScored { get; set; }
        public string IsScoreResult { get; set; }
        public string CanSkip { get; set; }         
        public string MultiAnswers { get; set; }        
        public List<AssessmentQuestion> FormQuestions { get; set; }
        public AssessmentPage(Object record)
        {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);
            item.TryGetValue("description", out var description);
            item.TryGetValue("stepNr", out var stepNr);
            item.TryGetValue("isScored", out var isScored);
            item.TryGetValue("isScoreResult", out var isScoreResult);
            item.TryGetValue("canSkip", out var canSkip);
            item.TryGetValue("multiAnswers", out var multiAnswers);
            item.TryGetValue("formQuestions", out var formQuestions);
            item.TryGetValue("info", out var info);

            Id = id.ToString();
            Name = name != null ? name.ToString() : "";
            Description = description != null ? description.ToString() : "";
            StepNr = stepNr != null ? stepNr.ToString() : "";
            Info = info != null ? info.ToString() : "";
            IsScored = isScored != null ? isScored.ToString() : "";
            IsScoreResult = isScoreResult != null ? isScoreResult.ToString() : "";
            CanSkip = canSkip != null ? canSkip.ToString() : "";
            MultiAnswers = multiAnswers != null ? multiAnswers.ToString() : "";
            FormQuestionsIds = formQuestions != null ? formQuestions.ToString() : "";
        }
    }

    public class AssessmentQuestion
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string AnswerType { get; set; }

        public string NameDescription { get; set; }
        public int MinValue { get; set; } = 0;
        public string FormQuestionOptionsIds { get; set; }
        public List<AssessmentOption> FormQuestionOptions { get; set; }
        public string Answer { get; set; }
        public AssessmentQuestion(Object record)
        {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);
            item.TryGetValue("description", out var description);
            item.TryGetValue("answerType", out var answerType);
            item.TryGetValue("formQuestionOptions", out var formQuestionOptions);
            item.TryGetValue("minValue", out var minValue);
            item.TryGetValue("nameDescription", out var nameDescription);
            Id = id.ToString();
            Name = name != null ? name.ToString() : "";
            Description = description != null ? description.ToString() : "";
            AnswerType = answerType != null ? answerType.ToString() : "";
            FormQuestionOptionsIds = formQuestionOptions != null ? formQuestionOptions.ToString() : "";
            NameDescription = nameDescription != null ? nameDescription.ToString() : "";
            MinValue = minValue != null ? Convert.ToInt32(minValue) : 0;
        }
    }

    public class AssessmentOption
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public AssessmentOption(Object record)
        {
            var item = (IDictionary<string, object>)record;
            item.TryGetValue("id", out var id);
            item.TryGetValue("name", out var name);

            Id = id.ToString();
            Name = name != null ? name.ToString() : "";
        }
    }

    public class AssessmentReport
    {
        public string Name { get; set; }
        public List<string> GreenQuestions { get; set; } = new();
        public List<string> BlueQuestions { get; set; } = new();
        public List<string> AmberQuestions { get; set; } = new();
        public List<string> DailyActivities { get; set; } = new();
        public List<string> SkippedActivities { get; set; } = new();
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public string TextQuestion { get; set; }
        public string TextAnswer { get; set; }
        public string CertificateName { get; set; }
        public string CertificateRegNr { get; set; }
        public DateTime? VisitCompletedDate { get; set; }
        public Guid VisitId { get; set; }
        public List<string> PreschoolDetail { get; set; } = new();
        public List<string> ClassroomDetail { get; set; } = new();
        public List<string> SafetyStandards { get; set; } = new();
        public AssessmentReport()
        {
        }
    }

    public class AssessmentPageInput
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<AssessmentQuestionInput> FormQuestions { get; set; }
    }

     public class AssessmentQuestionInput
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Answer { get; set; }
        public string AnswerId { get; set; }
    }
    

}
