using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Repositories;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
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
        public async Task<string> SaveCertificateDetails(
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            string certificateName,
            string certificateRegNr,
            Guid? visitId = null,
            Guid? userTrainingCourseId = null)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser()?.Id;
            if (applicationUserId == null)
                return null;

            // a certificate is always issued for either a visit or a completed course
            if (visitId == null && userTrainingCourseId == null)
                return null;

            if (visitId != null && !dbContext.Visits.Any(x => x.Id == visitId.Value))
                return null;

            if (userTrainingCourseId != null &&
                !dbContext.UserTrainingCourses.Any(x => x.Id == userTrainingCourseId.Value &&
                                                        x.UserId == applicationUserId.Value))
                return null;

            // the visit or the course identifies the certificate, so this finds the one already
            // on record however it was downloaded before
            var certificatesOnRecord = visitId != null
                ? dbContext.UserCertificate.Where(x => x.VisitId == visitId.Value)
                : dbContext.UserCertificate.Where(x => x.UserTrainingCourseId == userTrainingCourseId.Value);

            var existingCertificate = certificatesOnRecord
                .OrderByDescending(x => x.InsertedDate)
                .FirstOrDefault();

            if (existingCertificate != null)
            {
                // keep the number this certificate was first issued with, the name may have changed
                existingCertificate.CertificateName = certificateName;
                existingCertificate.UpdatedDate = DateTime.Now;
                existingCertificate.UpdatedBy = applicationUserId.ToString();
            }
            else
            {
                dbContext.UserCertificate.Add(new UserCertificate
                {
                    Id = Guid.NewGuid(),
                    VisitId = visitId,
                    UserTrainingCourseId = userTrainingCourseId,
                    CertificateName = certificateName,
                    CertificateRegNr = certificateRegNr,
                    UserId = applicationUserId.Value,
                    UpdatedBy = applicationUserId.ToString(),
                    TenantId = TenantExecutionContext.Tenant.Id
                });
            }

            await dbContext.SaveChangesAsync();

            return existingCertificate?.CertificateRegNr ?? certificateRegNr;
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
