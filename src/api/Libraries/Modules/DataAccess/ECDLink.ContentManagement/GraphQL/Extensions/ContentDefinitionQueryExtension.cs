using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Enums;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.ContentManagement.GraphQL.Extensions
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ContentDefinitionQueryExtension
    {
        public IEnumerable<ContentDefinitionModel> GetContentDefinitions([Service] ContentDefinitionRepository repository)
        {
            return repository.GetContentDefinitions();
        }

        [Permission(PermissionGroups.GENERAL, GraphActionEnum.Create)]
        public async Task<FileModel> ContentDefinitionsExcelTemplateGenerator(
          [Service] ContentDefinitionRepository repository,
          [Service] IFileGenerationService fileService,
          IGenericRepositoryFactory repoFactory,
          int contentTypeId)
        {
            var contentType = repository.GetContentTypeById(contentTypeId);

            var languageRepo = repoFactory.CreateRepository<Language>();
            var languages = languageRepo.GetAll().ToList();

            var fieldList = new List<string>();
            var fieldDefinitionList = new Dictionary<string, string>();
            var languageList = new Dictionary<string, string>();
            languages.ForEach(x => languageList.Add(x.Locale, x.Description));

            fieldList.Add("ID");
            fieldList.Add("Locale");

            foreach (var contentField in contentType.Fields.OrderBy(x => x.FieldOrder))
            {
                if (contentField.FieldType.Id != (int)FieldTypeEnum.DynamicRelation && contentField.FieldType.Id != (int)FieldTypeEnum.StaticRelation)
                {
                    fieldList.Add(contentField.FieldName);
                    fieldDefinitionList.Add(contentField.FieldName, contentField.FieldType.Name);
                }
            }

            var reportName = $"{contentType.Name} Template";
            return await fileService.FieldsToExcelTemplate(fieldList, fieldDefinitionList, languageList, reportName);
        }
    }
}
