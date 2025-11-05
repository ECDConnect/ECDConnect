using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Constants;
using ECDLink.ContentManagement.Repositories;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class JourneyQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<JourneyTimeline> GetJourneyTimeline(
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            Guid userId)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var timeline = new List<JourneyTimeline>();
            var practitioner = dbContext.Practitioners.FirstOrDefault(x => x.UserId == userId && x.IsActive);

            // Registration
            timeline.Add(new JourneyTimeline()
            {
                Name = $"Registered for {TenantExecutionContext.Tenant.ApplicationName}",
                DateCompleted = practitioner.StartDate.Value.ToString("dd MMMM yyyy"),
                IconName = "CheckIcon",
                DateValue = practitioner.StartDate.Value,
                Type = "Registration"
            });

            // Courses completed
            var courses = dbContext.UserTrainingCourses.Where(x => x.UserId == userId && x.IsActive && x.CompletedDate.Year == DateTime.Now.Year)
                                                        .OrderByDescending(x => x.CompletedDate)
                                                        .Select(x => new JourneyTimeline
                                                        {
                                                            Name = $"Course completed: {x.CourseName}",
                                                            DateCompleted = x.CompletedDate.ToString("dd MMMM yyyy"),
                                                            IconName = "AcademicCapIcon",
                                                            DateValue = x.CompletedDate,
                                                            Type = "Course"
                                                        });
            if (courses.Any())
            {
                timeline.AddRange(courses);
            }
            // Self-assessment completed
            var selfAssessments = dbContext.Visits.Where(x => x.VisitType.Name == Constants.SSSettings.visitType_self_assessment && x.PractitionerId == practitioner.Id && x.IsActive)
                                                    .OrderByDescending(x => x.ActualVisitDate)
                                                    .Select(x => new JourneyTimeline
                                                    {
                                                        Name = "Self-assessment form completed",
                                                        DateCompleted = x.ActualVisitDate.Value.ToString("dd MMMM yyyy"),
                                                        IconName = "CheckIcon",
                                                        DateValue = x.ActualVisitDate.Value,
                                                        Type = "Self-assessment",
                                                        VisitId = x.Id
                                                    }); ;

            if (selfAssessments.Any())
            {
                timeline.AddRange(selfAssessments);
            }

            return timeline
                .OrderBy(x => x.DateValue)
                .ToList();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<List<AssessmentForm>> GetJourneyPublishedAssessmentFormsAsync(
            [Service] ContentManagementRepository contentRepo,
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext)
        {
            var englishId = new Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var userRoleIds = dbContext.UserRoles.Where(x => x.UserId == userId).Select(x => x.RoleId.ToString()).ToList();

            var contentTypeId = contentRepo.GetContentTypeIdForName(ContentTypeConstants.Form);
            return contentRepo.GetAll(contentTypeId, englishId)
                            .Select(x => new AssessmentForm(x))
                            .Where(x => x.IsPublished == "true" 
                                && x.RoleIds.Split(',').Any(roleId => userRoleIds.Contains(roleId)))
                            .ToList();

        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public AssessmentForm GetJourneyAssessmentFormData(
            [Service] ContentManagementRepository contentRepo,
            int id)
        {
            var englishId = new Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            var assessmentForm = new AssessmentForm(contentRepo.GetById(id, englishId));

            // Helper local function to parse CSV safely
            static int[] ParseIds(string csv) =>
                csv?.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => int.TryParse(s, out var id) ? id : (int?)null)
                    .Where(id => id.HasValue)
                    .Select(id => id.Value)
                    .ToArray() ?? Array.Empty<int>();

            // Form Pages
            if (assessmentForm.FormPagesIds?.Any() == true)
            {
                var pageContentTypeId = contentRepo.GetContentTypeIdForName(ContentTypeConstants.FormPage);
                var pageContentIds = ParseIds(assessmentForm.FormPagesIds);
                assessmentForm.FormPages = contentRepo
                    .GetByIds(pageContentTypeId, englishId, pageContentIds)
                    .Select(x => new AssessmentPage(x))
                    .ToList();

                var questionContentTypeId = contentRepo.GetContentTypeIdForName(ContentTypeConstants.FormQuestion);
                var optionContentTypeId = contentRepo.GetContentTypeIdForName(ContentTypeConstants.FormQuestionOption);

                foreach (var form in assessmentForm.FormPages)
                {
                    if (form.FormQuestionsIds?.Any() == true)
                    {
                        var questionContentIds = ParseIds(form.FormQuestionsIds);
                        form.FormQuestions = contentRepo
                            .GetByIds(questionContentTypeId, englishId, questionContentIds)
                            .Select(x => new AssessmentQuestion(x))
                            .ToList();

                        foreach (var question in form.FormQuestions)
                        {
                            if (question.FormQuestionOptionsIds?.Any() == true)
                            {
                                var optionContentIds = ParseIds(question.FormQuestionOptionsIds);
                                question.FormQuestionOptions = contentRepo
                                    .GetByIds(optionContentTypeId, englishId, optionContentIds)
                                    .Select(x => new AssessmentOption(x))
                                    .ToList();
                            }
                        }
                    }
                }
            }

            return assessmentForm;
        }

        public AssessmentReport GetJourneyAssessmentReport([Service] IJourneyService journeyService, Guid visitId)
        {
            return journeyService.GetJourneyAssessmentReport(visitId);
        }
    }
}
