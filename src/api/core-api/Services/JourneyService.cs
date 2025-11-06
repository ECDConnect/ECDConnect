using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.ContentManagement.Constants;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services
{
    public class JourneyService : Interfaces.IJourneyService
    {

        private readonly AuthenticationDbContext _dbContext;
         private readonly ContentManagementDbContext _CMSContext;
        private Guid? _applicationUserId;

        public JourneyService(
            IHttpContextAccessor contextAccessor,
            HierarchyEngine hierarchyEngine,
            [Service] AuthenticationDbContext dbContext,
            [Service] ContentManagementDbContext cmsContext
            )
        {
            _applicationUserId = (contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId());
            _dbContext = dbContext;
            _CMSContext = cmsContext;
        }

        // -----------------------------
        // 🔹 Constants
        // -----------------------------
        
        private static class VisitTypes
        {
            public const string SelfAssessment = "self_assessment";
        }

        private static class AnswerCategories
        {
            public const string AllTheTime = "All the time";
            public const string MostOfTheTime = "Most of the time";
            public const string Sometimes = "Sometimes";
        }

        private static class Questions
        {
            public const string DailyActivities = "Which activities do you do every day?";
            public const string DiffrentQuestion = "Things you would like to do differently or get better at:";
        }

        public AssessmentReport GetJourneyAssessmentReport(Guid visitId)
        {
            var visit = _dbContext.Visits.AsNoTracking().FirstOrDefault(x => x.Id == visitId);

            if (visit == null)
                return null;

            if (visit.VisitType?.Name == VisitTypes.SelfAssessment)
                return GetSelfAssessmentReport(visitId);

            return null;
        }
        
        private AssessmentReport GetSelfAssessmentReport(Guid visitId)
        {
            var generalAnswers = new[]
            {
                AnswerCategories.AllTheTime,
                AnswerCategories.MostOfTheTime,
                AnswerCategories.Sometimes
            };

            var visitData = _dbContext.VisitData
                .AsNoTracking()
                .Where(x => x.VisitId == visitId)
                .ToList();

            var formOptionsTypeId = _CMSContext.ContentTypes.AsNoTracking()
                .Where(x => x.Name == ContentTypeConstants.FormQuestionOption)
                .Select(x => x.Id)
                .FirstOrDefault();

            var allFormOptions = _CMSContext.ContentValues.AsNoTracking()
                .Where(x => x.Content.ContentTypeId == formOptionsTypeId
                            && x.TenantId == TenantExecutionContext.Tenant.Id
                            && !generalAnswers.Contains(x.Value))
                .Select(x => x.Value)
                .ToList();

            var formName = visitData.Select(x => x.VisitName).FirstOrDefault();
            var textAnswer = visitData.FirstOrDefault(x => x.AnswerContentId == "text");

            var greenAnswers = visitData
                .Where(x => x.QuestionAnswer == AnswerCategories.AllTheTime)
                .Select(x => x.Question)
                .ToList();

            var blueAnswers = visitData
                .Where(x => x.QuestionAnswer == AnswerCategories.MostOfTheTime)
                .Select(x => x.Question)
                .ToList();

            var amberAnswers = visitData
                .Where(x => x.QuestionAnswer == AnswerCategories.Sometimes)
                .Select(x => x.Question)
                .ToList();

            // Handle activities and exclude "None"
            var doActivitiesAnswer = visitData
                .FirstOrDefault(x => x.Question == Questions.DailyActivities)
                ?.QuestionAnswer;

            var doActivities = (doActivitiesAnswer?
                .Split('|', StringSplitOptions.RemoveEmptyEntries)
                .Where(x => !string.Equals(x, "None", StringComparison.OrdinalIgnoreCase))
                .ToList()) ?? new List<string>();

            var dontActivities = allFormOptions
                .Where(x => !doActivities.Contains(x, StringComparer.OrdinalIgnoreCase)
                            && !string.Equals(x, "None", StringComparison.OrdinalIgnoreCase))
                .ToList();

            return new AssessmentReport
            {
                Name = formName,
                GreenQuestions = greenAnswers,
                BlueQuestions = blueAnswers,
                AmberQuestions = amberAnswers,
                DailyActivities = doActivities,
                SkippedActivities = dontActivities,
                TextQuestion = Questions.DiffrentQuestion,
                TextAnswer = textAnswer?.QuestionAnswer,
                VisitId = visitId
            };
        }


    }
}
