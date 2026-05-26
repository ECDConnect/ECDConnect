using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.ContentManagement.Constants;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using MathNet.Numerics.Statistics;
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
        private readonly IClassroomService _classroomService;
        private Guid? _applicationUserId;

        public JourneyService(
            IHttpContextAccessor contextAccessor,
            HierarchyEngine hierarchyEngine,
            [Service] AuthenticationDbContext dbContext,
            [Service] ContentManagementDbContext cmsContext,
              [Service] IClassroomService classroomService
            )
        {
            _applicationUserId = (contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId());
            _dbContext = dbContext;
            _CMSContext = cmsContext;
            _classroomService = classroomService;
        }

        // -----------------------------
        // 🔹 Constants
        // -----------------------------

        private static class VisitTypes
        {
            public const string SelfAssessment = "self_assessment";
            public const string HealthCheck = "health_and_safety_check";
        }

        private static class AnswerCategories
        {
            public const string AllTheTime = "All the time";
            public const string MostOfTheTime = "Most of the time";
            public const string Sometimes = "Sometimes";
        }

        private static class VisitSteps
        {
            public const string Step1 = "1";
            public const string Step2 = "2";
            public const string Step3 = "3";
            public const string Step4 = "4";
            public const string Step5 = "5";
            public const string Step6 = "6";
        }


        private static class Questions
        {
            public const string DailyActivities = "Which activities do you do every day?";
            public const string DiffrentQuestion = "Things you would like to do differently or get better at:";
            public const string NextStepQuestion = "Notes / next steps";
            public const string AssistantQuestion = "How many assistants support this class?";
            public const string LongSideQuestion = "How many cms is the long side of the room?";
            public const string ShortSideQuestion = "How many cms is the short side of the room?";
        }

        public AssessmentReport GetJourneyAssessmentReport(Guid visitId)
        {
            var visit = _dbContext.Visits.AsNoTracking().FirstOrDefault(x => x.Id == visitId);

            if (visit == null)
                return null;

            if (visit.VisitType?.Name == VisitTypes.SelfAssessment)
                return GetSelfAssessmentReport(visitId);

            if (visit.VisitType?.Name == VisitTypes.HealthCheck)
                return GetHealthCheckReport(visitId, visit);

            return null;
        }

        private AssessmentReport GetHealthCheckReport(Guid visitId, Visit visit = null)
        {
            var practitioner = _dbContext.Practitioners.AsNoTracking().
            Where(x => x.Id == visit.PractitionerId)
            .FirstOrDefault();

            if (practitioner == null)
                return null;

            var classroom = _classroomService.GetClassroomForUser((Guid)practitioner.UserId);

            var visitData = _dbContext.VisitData
            .Include(x => x.Visit)
            .AsNoTracking()
            .Where(x => x.VisitId == visitId)
            .ToList();

            var formName = visitData.Select(x => x.VisitName).FirstOrDefault();
            var certificateName = visitData.Select(x => x.Visit.CertificateName).FirstOrDefault();
            var certificateRegNr = visitData.Select(x => x.Visit.CertificateRegNr).FirstOrDefault();
            var visitCompletedDate = visitData.Select(x => x.Visit.ActualVisitDate).FirstOrDefault();

            var healthAndSafetyAnswers = visitData
                .Where(x => (x.VisitSection == VisitSteps.Step1 ||
                            x.VisitSection == VisitSteps.Step2 ||
                            x.VisitSection == VisitSteps.Step3) && x.QuestionAnswer != "true")
                .Select(x => x.Question)
                .ToList();

            var addressAnswer = visitData
                .Where(x => x.VisitSection == VisitSteps.Step6)
                .Select(x => x.QuestionAnswer)
                .FirstOrDefault();

            var preschoolDetailLines = new List<string>
            {
                $"<b>Preschool:</b> {classroom.Name}",
                $"<b>Location:</b> {addressAnswer}",
                $"<b>Check completed:</b> {visit?.ActualVisitDate?.ToString("dd MMMM yyyy") ?? "—"}"
            };

            // Get all Step 5 related answers (any classroom)
            var step5Answers = _dbContext.VisitData
                .AsNoTracking()
                .Where(x => x.VisitId == visitId
                         && x.VisitSection.StartsWith("5."))   // catches "5.1", "5.2", "5.10", etc.
                .ToList();

            // Parse the instance number and group by it
            var groupedByClassroom = step5Answers
                .Select(x => new
                {
                    Record = x,
                    InstanceStr = x.VisitSection.Substring(2),           // "1", "2", "10", ...
                    InstanceNum = int.TryParse(x.VisitSection.Substring(2), out int n) ? n : 0
                })
                .Where(x => x.InstanceNum > 0)   // skip malformed entries
                .GroupBy(x => x.InstanceNum)
                .OrderBy(g => g.Key)             // classrooms in correct order: 1, 2, 3, ...
                .ToList();

            var classroomDetail = new List<string>();

            if (step5Answers.Any())
            {
                var groups = step5Answers
                    .Select((ans, index) => new { Answer = ans, Index = index })
                    .GroupBy(x => x.Index / 3)
                    .Select(g => g.Select(x => x.Answer).ToList())
                    .ToList();

                foreach (var group in groupedByClassroom)
                {
                    int classroomNumber = group.Key;

                    classroomDetail.Add($"Classroom {classroomNumber}");

                    var answers = group
                         .Select(x => x.Record)
                         .OrderBy(x => x.Id)  
                        .ToList();

                    if (answers.Count == 3)
                    {
                        string assistantsRaw = "0";
                        string shortSideRaw = "0";
                        string longSideRaw = "0";

                        foreach (var ans in answers)
                        {
                            var question = ans.Question?.Trim();
                            var answer = ans.QuestionAnswer?.Trim() ?? "0";

                            if (question == Questions.AssistantQuestion)
                                assistantsRaw = answer;
                            else if (question == Questions.ShortSideQuestion)
                                shortSideRaw = answer;
                            else if (question == Questions.LongSideQuestion)
                                longSideRaw = answer;
                        }

                        // Parse values safely
                        int assistants = int.TryParse(assistantsRaw, out int a) ? a : 0;

                        double shortCm = double.TryParse(shortSideRaw,
                            System.Globalization.NumberStyles.Any,
                            System.Globalization.CultureInfo.InvariantCulture, out double s) ? s : 0;

                        double longCm = double.TryParse(longSideRaw,
                            System.Globalization.NumberStyles.Any,
                            System.Globalization.CultureInfo.InvariantCulture, out double l) ? l : 0;

                        double areaM2 = (shortCm * longCm) / 10_000.0;

                        int capacityFromArea = (int)Math.Floor(areaM2);
                        int adults = assistants + 1;
                        int capacityFromAdults = adults * 10;
                        int finalCapacity = Math.Min(capacityFromArea, capacityFromAdults);

                        string areaFormatted = areaM2.ToString("N1", System.Globalization.CultureInfo.InvariantCulture);

                        classroomDetail.AddRange(new[]
                        {
                            $"  Total squared meters available: {areaFormatted} m²",
                            $"  Assistants: {assistants}",
                            $"  Capacity: <b>{finalCapacity} children</b>",
                            "<br>"
                        });
                    }
                }
            }

            var nextStepAnswer = visitData
                .Where(x => x.VisitSection == VisitSteps.Step4)
                .Select(x => x.QuestionAnswer)
                .FirstOrDefault();

            return new AssessmentReport
            {
                Name = formName,
                PreschoolDetail = preschoolDetailLines,
                VisitId = visitId,
                SafetyStandards = healthAndSafetyAnswers,
                ClassroomDetail = classroomDetail,
                TextQuestion = Questions.NextStepQuestion,
                TextAnswer = nextStepAnswer,
                CertificateName = certificateName ?? "",
                CertificateRegNr = certificateRegNr ?? "",
                VisitCompletedDate = visitCompletedDate
            };
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
