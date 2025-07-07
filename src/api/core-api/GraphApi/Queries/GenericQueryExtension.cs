using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Documents;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class GenericQueryExtension
    {
        [UseSorting]
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Document> GetAllClientRecords(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string search = null,
            string[] showOnlyTypes = null,
            string[] showOnlyStatus = null,
            PagedQueryInput pagingInput = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var docRepo = repoFactory.CreateGenericRepository<Document>(userContext: uId);
            var caregiverRepo = repoFactory.CreateGenericRepository<Caregiver>(userContext: uId);

            if (showOnlyTypes == null)
            {
                showOnlyTypes = new[] { DocumentTypeConstants.MaternalCaseRecord, DocumentTypeConstants.RoadToHealthBook };
            }

            var docsQuery = docRepo.GetAll().Include(d => d.DocumentType).Where(x => showOnlyTypes.Contains(x.DocumentType.Name)).Where(x => x.UserId != null);

            if (pagingInput is not null)
            {
                if (pagingInput.PageSize is not null)
                    docsQuery = PaginationHelper.AddPaging(pagingInput?.RowOffset ?? 0, pagingInput?.PageSize ?? 100, docsQuery);
                docsQuery = PaginationHelper.AddFiltering(pagingInput?.FilterBy, docsQuery);
            }

            var docsList = docsQuery.OrderByDescending(x => x.UpdatedDate).ToList();

            if (showOnlyStatus == null)
            {
                showOnlyStatus = new[] { "Active", "Inactive" };
            }
            docsList = docsList.Where(x => showOnlyStatus.Contains(x.ClientStatus)).ToList();

            if (!string.IsNullOrWhiteSpace(search))
            {
                docsList = docsList.Where(x => (x.ClientName!= null && x.ClientName.Contains(search, StringComparison.OrdinalIgnoreCase)) || (x.CreatedByName != null && x.CreatedByName.Contains(search, StringComparison.OrdinalIgnoreCase))).ToList(); 
            }

            return docsList;
        }

    }
}
