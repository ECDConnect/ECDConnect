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
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class JourneyQueryExtension
    {
        [Permission(PermissionGroups.JOURNEY, GraphActionEnum.View)]
        public async Task<List<JourneyTimeline>> GetJourneyTimelineAsync(
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            Guid userId)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var timeline = new List<JourneyTimeline>();

            var practitioner = await dbContext.Practitioners
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == userId && x.IsActive);

            if (practitioner == null)
                return timeline; // or throw if this should never happen

            var startOfYear = new DateTime(DateTime.Now.Year, 1, 1);
            var endOfYear = new DateTime(DateTime.Now.Year, 12, 31);

            var courses = await dbContext.UserTrainingCourses
                .AsNoTracking()
                .Where(x => x.UserId == userId && x.IsActive &&
                            x.CompletedDate >= startOfYear && x.CompletedDate <= endOfYear)
                .OrderByDescending(x => x.CompletedDate)
                .Select(x => new
                {
                    x.CourseName,
                    x.CompletedDate
                })
                .ToListAsync();

            timeline.AddRange(courses.Select(x => new JourneyTimeline
            {
                Name = $"Course completed: {x.CourseName}",
                DateCompleted = x.CompletedDate.ToString("dd MMMM yyyy"),
                IconName = "AcademicCapIcon",
                DateValue = x.CompletedDate,
                Type = "Course"
            }));

            var selfAssessments = await dbContext.Visits
                .AsNoTracking()
                .Where(x => x.VisitType.Name == Constants.SSSettings.visitType_self_assessment &&
                            x.PractitionerId == practitioner.Id && x.IsActive)
                .OrderByDescending(x => x.ActualVisitDate)
                .Select(x => new
                {
                    x.Id,
                    x.ActualVisitDate
                })
                .ToListAsync();

            timeline.AddRange(selfAssessments
                .Where(x => x.ActualVisitDate.HasValue)
                .Select(x => new JourneyTimeline
                {
                    Name = "Self-assessment form completed",
                    DateCompleted = x.ActualVisitDate.Value.ToString("dd MMMM yyyy"),
                    IconName = "CheckIcon",
                    DateValue = x.ActualVisitDate.Value,
                    Type = "Self-assessment",
                    VisitId = x.Id
                }));

            return timeline.OrderBy(x => x.DateValue).ToList();
        }


        [Permission(PermissionGroups.JOURNEY, GraphActionEnum.View)]
        public async Task<List<AssessmentForm>> GetJourneyPublishedAssessmentFormsAsync(
            [Service] ContentManagementRepository contentRepo,
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext)
        {
            var english = dbContext.Languages.FirstOrDefault(x => x.Description == "English"); 
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var userRoleIds = dbContext.UserRoles.Where(x => x.UserId == userId).Select(x => x.RoleId.ToString()).ToList();

            var contentTypeId = contentRepo.GetContentTypeIdForName(ContentTypeConstants.Form);
            return contentRepo.GetAll(contentTypeId, english.Id)
                            .Select(x => new AssessmentForm(x))
                            .Where(x => x.IsPublished == "true" 
                                && x.RoleIds.Split(',').Any(roleId => userRoleIds.Contains(roleId)))
                            .ToList();

        }

        [Permission(PermissionGroups.JOURNEY, GraphActionEnum.View)]
        public AssessmentForm GetJourneyAssessmentFormData(
            [Service] ContentManagementRepository contentRepo,
            AuthenticationDbContext dbContext,
            int id)
        {
            var english = dbContext.Languages.FirstOrDefault(x => x.Description == "English"); 
            var assessmentForm = new AssessmentForm(contentRepo.GetById(id, english.Id));

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
                    .GetByIds(pageContentTypeId, english.Id, pageContentIds)
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
                            .GetByIds(questionContentTypeId, english.Id, questionContentIds)
                            .Select(x => new AssessmentQuestion(x))
                            .ToList();

                        foreach (var question in form.FormQuestions)
                        {
                            if (question.FormQuestionOptionsIds?.Any() == true)
                            {
                                var optionContentIds = ParseIds(question.FormQuestionOptionsIds);
                                question.FormQuestionOptions = contentRepo
                                    .GetByIds(optionContentTypeId, english.Id, optionContentIds)
                                    .Select(x => new AssessmentOption(x))
                                    .ToList();
                            }
                        }
                    }
                }
            }

            return assessmentForm;
        }
        
        [Permission(PermissionGroups.JOURNEY, GraphActionEnum.View)]
        public AssessmentReport GetJourneyAssessmentReport([Service] IJourneyService journeyService, Guid visitId)
        {
            return journeyService.GetJourneyAssessmentReport(visitId);
        }
    }
}
