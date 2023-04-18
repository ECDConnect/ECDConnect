using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Documents;
using ECDLink.Core.Reporting;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.PostgresTenancy.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedFunctions
{
    public class DocumentTypeSeed
    {
        private readonly IServiceProvider _serviceProvider;

        public DocumentTypeSeed(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;

            SeedDocumentTypes();
        }

        private void SeedDocumentTypes()
        {
            var repositoryFactory = _serviceProvider.GetService<IGenericRepositoryFactory>();
            var documentTypeRepo = repositoryFactory.CreateRepository<DocumentType>();

            var documentTypes = new List<Tuple<string, string, FileTypeEnum>>()
           {
               Tuple.Create("Theme", "Theme", FileTypeEnum.Theme),
               Tuple.Create("Child", "Child", FileTypeEnum.Child),
               Tuple.Create("Practitioner", "Practitioner", FileTypeEnum.Practitioner),
               Tuple.Create("ProfilePicture", "ProfilePicture", FileTypeEnum.ProfileImage),
               Tuple.Create("ClassroomProfile", "ClassroomProfile", FileTypeEnum.ClassroomProfile),
               Tuple.Create(ReportConstants.ChildProgressReport, "A PDF template with fillable fields that represents the child progress report." , FileTypeEnum.ReportTemplates),
               Tuple.Create(DocumentTypeConstants.MaternalCaseRecord, "A maternity case record document." , FileTypeEnum.MaternalCaseRecord),
               Tuple.Create(DocumentTypeConstants.RoadToHealthBook, "Road to health book." , FileTypeEnum.RoadToHealthBook),
               Tuple.Create(DocumentTypeConstants.ContentImage, "An image uploaded into a Content document." , FileTypeEnum.ContentImage)
           };

            var allDocumentTypes = documentTypeRepo.GetAll();

            foreach (var documentType in documentTypes)
            {
                if (!allDocumentTypes.Any(x => x.Name == documentType.Item1))
                {
                    documentTypeRepo.Insert(new DocumentType
                    {
                        Name = documentType.Item1,
                        Description = documentType.Item2,
                        EnumId = documentType.Item3,
                        TenantId = null
                    });
                }
            }
        }
    }
}
