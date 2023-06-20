using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class TeamLeadQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<TeamLead> GetAllTeamLeads([Service] IHttpContextAccessor contextAccessor,
         [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
         IGenericRepositoryFactory repoFactory)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateRepository<TeamLead>(userContext: uId);
            List<TeamLead> teamLeads = healthCareWorkerRepo.GetAll().ToList();

            return teamLeads;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<FileModel> TeamLeadTemplateGenerator(
          [Service] IFileGenerationService fileService,
          IGenericRepositoryFactory repoFactory)
        {
            var languageRepo = repoFactory.CreateRepository<Language>();
            var languages = languageRepo.GetAll().ToList();

            var languageList = new Dictionary<string, string>();
            languages.ForEach(x => languageList.Add(x.Locale, x.Description));

            var fieldDefinitionList = new List<List<string>>
            {
                new List<string> { "Column", "Type Description"},
                new List<string> { "Type of identification", "Text, (Must be: 'id' or 'passport')"},
                new List<string> { "ID number", "Number, (required if type of identification is 'id'; must be 13 digits)"},
                new List<string> {"Passport", "Number, (required if type of identification is 'passport')"},
                new List<string> {"First name", "Text, (required)"},
                new List<string> {"Surname", "Text, (required)"},
                new List<string> {"Cellphone number", "Number, (required, 10 digits)"},
                new List<string> {"Email address", "email, (optional)"}
            };
            var fieldDefinitionSheet = $"Field Definition";

            var templateHeaders = new List<List<string>>()
            {
                new List<string> { 
                    "Type of identification",
                    "ID number",
                    "Passport",
                     "First name",
                    "Surname",
                    "Cellphone number",
                    "Email address" 
                }
            };
            var templateHeaderSheet = $"Team Lead Template";

            var spreadSheets = new Dictionary<string, List<List<string>>>() { 
                { templateHeaderSheet, templateHeaders },
                { fieldDefinitionSheet, fieldDefinitionList } 
            };
            
            var fileName = templateHeaderSheet.Replace(" ", "_");
            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }
    }
}
