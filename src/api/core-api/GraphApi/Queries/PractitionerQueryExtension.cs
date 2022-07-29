using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.ContentManagement.Entities;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Enums;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ECDLink.Security.Extensions;
using Microsoft.AspNetCore.Identity;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class PractitionerQueryExtension
    {
        public PractitionerQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]

        public Practitioner GetPractitionerByUserId([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practiRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = new Practitioner();
            List<Practitioner> practitioners = practiRepo.GetAll().Where(x => x.UserId.Contains(userId)).ToList();
            if (practitioners.Count > 0) { 
                practitioner = practitioners.FirstOrDefault(); 
            }

            return practitioner;
        }

        public ApplicationUser GetPractitionerByIdNumber([Service] IHttpContextAccessor contextAccessor, 
            [Service] UserManager<ApplicationUser> userManager,
             [Service] RoleManager<IdentityRole> roleManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string idNumber)
        {

            var practionerUser = userManager.FindByNameAsync(idNumber).Result;//find practitioner by Username/Id number, if exists, add coach to practitioner

            if (practionerUser != null)
            {
                return new UserQueryTypeExtension().GetUserById(userManager, roleManager, contextAccessor, dbFactory, repoFactory, practionerUser.Id);
            }
            return default(ApplicationUser);
        }

        public async Task<FileModel> PractitionerExcelTemplateGenerator(
          [Service] IFileGenerationService fileService,
          [Service] IGenericRepositoryFactory repoFactory)
        {
            var languageRepo = repoFactory.CreateRepository<Language>();
            var languages = languageRepo.GetAll().ToList();

            var fieldList = new List<string>();
            var fieldDefinitionList = new Dictionary<string, string>();
            fieldDefinitionList.Add("FirstName", "Text");
            fieldDefinitionList.Add("Surname", "Text");
            fieldDefinitionList.Add("Cellphone Number", "Text");
            fieldDefinitionList.Add("ID / Passport Number", "Text");
            fieldDefinitionList.Add("Consent For Photo", "Yes / No");
            fieldDefinitionList.Add("Language Used in group", "Language Name");
            fieldDefinitionList.Add("Parent Fees", "Number");
            fieldDefinitionList.Add("StartDate", "Date Text (E.g 2019/10/23)");
            fieldDefinitionList.Add("MaxChildren", "Number");

            var languageList = new Dictionary<string, string>();
            languages.ForEach(x => languageList.Add(x.Locale, x.Description));

            fieldList.Add("FirstName");
            fieldList.Add("Surname");
            fieldList.Add("Cellphone Number");
            fieldList.Add("ID / Passport Number");
            fieldList.Add("Consent For Photo");
            fieldList.Add("Language Used in group");
            fieldList.Add("Parent Fees");
            fieldList.Add("StartDate");
            fieldList.Add("MaxChildren");

            var reportName = $"Practitioner Template";
            return await fileService.FieldsToExcelTemplate(fieldList, fieldDefinitionList, languageList, reportName);
        }

        public List<Child> GetAllChildrenForPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var practitionerrRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioner = practitionerrRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
            List<Child> children = childRepo.GetAll().Where(x => x.Hierarchy.Contains(practitioner.FirstOrDefault().Hierarchy)).ToList();

            return children;
        }
    }
}
