using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Reporting;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.SmartStart.GraphQL.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ChildProgressReportMutation
    {
        [Permission(PermissionGroups.REPORTING, GraphActionEnum.Create)]
        public async Task<bool> UploadChildProgressReport(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IFileService _fileService,
            IGenericRepositoryFactory repoFactory,
            string report)
        {
            var documentTypeRepo = repoFactory.CreateRepository<DocumentType>();
            var documentType = documentTypeRepo
                                .GetAll()
                                .Where(x => x.EnumId == FileTypeEnum.ReportTemplates)
                                .Where(x => string.Equals(x.Name, ReportConstants.ChildProgressReport))
                                .FirstOrDefault();

            if (documentType == default)
            {
                return false;
            }

            var document = await _fileService.UploadBase64StringFileAsync(report, ReportConstants.ChildProgressReport, FileTypeEnum.ReportTemplates);

            var documentRepo = repoFactory.CreateRepository<Document>();
            var existingDocument = documentRepo
                                    .GetAll()
                                    .Where(x => x.DocumentTypeId == documentType.Id
                                                && string.Equals(x.Name, ReportConstants.ChildProgressReport)
                                                && x.IsActive == true)
                                    .FirstOrDefault();

            if (existingDocument != default)
            {
                existingDocument.IsActive = false;
                documentRepo.Update(existingDocument);
            }

            var workflowRepo = repoFactory.CreateRepository<WorkflowStatus>();
            var workflow = workflowRepo.GetAll().Where(x => x.EnumId == WorkflowStatusEnum.DocumentVerified).First();

            documentRepo.Insert(new Document
            {
                CreatedUserId = httpContextAccessor.HttpContext.GetUser().Id,
                DocumentTypeId = documentType.Id,
                //Id = Guid.NewGuid(),
                Name = ReportConstants.ChildProgressReport,
                Reference = document.Url.TrimEnd('/'),
                WorkflowStatusId = workflow.Id
            });

            return true;
        }
    }
}
