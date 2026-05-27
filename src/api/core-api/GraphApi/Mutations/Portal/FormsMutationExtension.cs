using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Repositories;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Visits;
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

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.Portal
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class FormsMutationExtension
    {
        [Permission(PermissionGroups.PORTAL, GraphActionEnum.Update)]
        public bool UpdatePublishStatus(
            [Service] ContentManagementRepository contentRepo,
            string contentId,
            string isPublished)
        {
            var englishId = new Guid("9688cd08-adef-408c-9d34-5d75ae5c44df");
            Dictionary<string, object> updateDict = new Dictionary<string, object>
            {
                { "isPublished", isPublished },
                { "publishedDate", isPublished == "true" ? DateTime.Now.Date : ""}
            };
            contentRepo.Update(int.Parse(contentId), englishId, updateDict);
            return true;
        }
        [Permission(PermissionGroups.JOURNEY, GraphActionEnum.Update)]
        public async Task<bool> SaveHealthCertificateDetails(
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            Guid visitId,
            string certificateName,
            string certificateRegNr)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser()?.Id;
            var visit = dbContext.Visits.FirstOrDefault(x => x.Id == visitId);
            if (visit == null)
                return false;
            
            // update visit with certificate details
            visit.CertificateRegNr = certificateRegNr;
            dbContext.Visits.Update(visit);
            
            // add new certificate entry
            dbContext.VisitCertificates.Add(new VisitCertificate
            {
                Id = Guid.NewGuid(),
                VisitId = visitId,
                CertificateName = certificateName,
                UpdatedBy = applicationUserId.ToString(),
                TenantId = TenantExecutionContext.Tenant.Id
            });

            await dbContext.SaveChangesAsync();

            return true;
        }

        [Permission(PermissionGroups.JOURNEY, GraphActionEnum.Create)]
        public async Task<AssessmentReport> SubmitJourneyAssessmentFormData(
            [Service] IJourneyService journeyService,
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            string formId,
            string formName,
            List<AssessmentPageInput> input)
        {
            if (!input.Any())
                return null;

            var applicationUserId = contextAccessor.HttpContext.GetUser()?.Id;
            if (applicationUserId == null) return null;

            var visitType = dbContext.VisitTypes.FirstOrDefault(x => x.NormalizedName.ToLower() == formName.ToLower() && x.TenantId == TenantExecutionContext.Tenant.Id);
            var practitioner = dbContext.Practitioners.FirstOrDefault(x => x.UserId == applicationUserId);

            if (visitType == null || practitioner == null)
                return null;

            if (!int.TryParse(formId, out var parsedFormId))
                return null;

            var newVisit = new Visit
            {
                Id = Guid.NewGuid(),
                VisitTypeId = visitType.Id,
                PractitionerId = practitioner.Id,
                Attended = true,
                PlannedVisitDate = DateTime.Now,
                ActualVisitDate = DateTime.Now,
                DueDate = DateTime.Now,
                FormContentId = parsedFormId,
                TenantId = TenantExecutionContext.Tenant.Id,
                Risk = "normal"
            };

            await dbContext.Visits.AddAsync(newVisit);

            var visitData = input.SelectMany(page => page.FormQuestions.Select(question =>
            {
                int.TryParse(question.Id, out int questionContentId);
                return new VisitData
                {
                    Id = Guid.NewGuid(),
                    VisitId = newVisit.Id,
                    VisitName = formName,
                    VisitSection = page.Name,
                    Question = question.Name,
                    QuestionContentId = questionContentId,
                    QuestionAnswer = question.Answer,
                    AnswerContentId = question.AnswerId,
                    TenantId = TenantExecutionContext.Tenant.Id
                };
            })).ToList();

            await dbContext.VisitData.AddRangeAsync(visitData);

            await dbContext.SaveChangesAsync();

            return journeyService.GetJourneyAssessmentReport(newVisit.Id);
        }
    }

}
