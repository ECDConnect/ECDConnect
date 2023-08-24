using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class StaticQueryExtension
    {
        public StaticQueryExtension()
        {
        }

        [UseSorting]
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public IQueryable<Document> GetAllDocument(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId,
            string[] showOnlyTypes,
            PagedQueryInput pagingInput)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var docRepo = repoFactory.CreateRepository<Document>(userContext: uId);
            var docsQuery = docRepo.GetAll();

            if (!string.IsNullOrWhiteSpace(userId))
                docsQuery = docsQuery.Where(x => x.UserId == userId);
            
            if (showOnlyTypes is not null && showOnlyTypes.Length > 0)
                docsQuery = docsQuery
                    .Include(d => d.DocumentType)
                    .Where(x => showOnlyTypes.Contains(x.DocumentType.Name));

            if (pagingInput?.FilterBy is not null)
            {
                docsQuery = PaginationHelper.AddFiltering(pagingInput?.FilterBy, docsQuery);
            }

            return docsQuery;
        }

    }
}
