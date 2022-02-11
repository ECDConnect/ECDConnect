using ECDLink.Abstractrions.Enums;
using ECDLink.Core.Reporting;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedFunctions
{
    public class DocumentTypeSeed
    {
        private readonly IServiceProvider serviceProvider;

        public DocumentTypeSeed(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;

            SeedDocumentTypes();
        }

        private void SeedDocumentTypes()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();
            var documentTypeManager = repositoryFactory.CreateRepository<DocumentType>();

            var documentTypes = new List<Tuple<string, string, FileTypeEnum>>()
           {
               Tuple.Create("Theme", "Theme", FileTypeEnum.Theme),
               Tuple.Create("Child", "Child", FileTypeEnum.Child),
               Tuple.Create("Practitioner", "Practitioner", FileTypeEnum.Practitioner),
               Tuple.Create("ProfilePicture", "ProfilePicture", FileTypeEnum.ProfileImage),
               Tuple.Create("ClassroomProfile", "ClassroomProfile", FileTypeEnum.ClassroomProfile),
               Tuple.Create(ReportConstants.ChildProgressReport, "A PDF template with fillable fields that represents the child progress report." , FileTypeEnum.ReportTemplates)
           };

            var allDocumentTypes = documentTypeManager.GetAll();

            foreach (var documentType in documentTypes)
            {
                if (!allDocumentTypes.Any(x => x.Name == documentType.Item1))
                {
                    documentTypeManager.Insert(new DocumentType
                    {
                        Name = documentType.Item1,
                        Description = documentType.Item2,
                        EnumId = documentType.Item3
                    });
                }
            }
        }
    }
}
