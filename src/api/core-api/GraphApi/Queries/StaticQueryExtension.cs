using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Constants;
using ECDLink.ContentManagement.Repositories;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class StaticQueryExtension
    {
        public StaticQueryExtension()
        {
        }

        [UseSorting]
        [Permission(PermissionGroups.DOCUMENTS, GraphActionEnum.View)]
        public IQueryable<Document> GetAllDocument(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId,
            string[] showOnlyTypes,
            string search = null,
            PagedQueryInput pagingInput = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var docRepo = repoFactory.CreateRepository<Document>(userContext: uId);
            var docsQuery = docRepo.GetAll();

            if (!string.IsNullOrWhiteSpace(userId))
                docsQuery = docsQuery.Where(x => x.UserId.ToString() == userId).Include(x => x.User);
                
            if (showOnlyTypes is not null && showOnlyTypes.Length > 0)
                docsQuery = docsQuery
                    .Include(d => d.DocumentType)
                    .Where(x => showOnlyTypes.Contains(x.DocumentType.Name));

            if (pagingInput?.FilterBy is not null)
            {
                docsQuery = PaginationHelper.AddFiltering(pagingInput?.FilterBy, docsQuery);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                docsQuery = docsQuery.Where(x => EF.Functions.ILike(x.User.FirstName, $"%{search}%") || EF.Functions.ILike(x.User.Surname, $"%{search}%")
                 || EF.Functions.ILike(x.Name, search));
            }

            return docsQuery;
        }

        [Permission(PermissionGroups.USERCONSENT, GraphActionEnum.View)]
        public async Task<CmsSyncStatus> GetCmsSyncStatus(
            [Service] ContentManagementRepository contentRepo,
            AuthenticationDbContext dbContext,
            DateTime lastSync)
        {

            var cmsSyncStatus = await contentRepo.GetCmsSyncStatus(lastSync);
            
            // update holiday count
            var holidayCount = await dbContext.Holidays.FromSql($@"
            SELECT h.""Id""
            FROM ""Holidays"" h 
            ").CountAsync();
            
            cmsSyncStatus.SyncHolidays = holidayCount > 12;

            return cmsSyncStatus;
        }

    }
}
