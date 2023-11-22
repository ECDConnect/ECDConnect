using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Documents;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
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

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
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
            PagedQueryInput pagingInput = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var docRepo = repoFactory.CreateGenericRepository<Document>(userContext: uId);
            var cgRepo = repoFactory.CreateGenericRepository<Caregiver>(userContext: uId);
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>();

            var docsQuery = docRepo.GetAll();

            if (showOnlyTypes == null) {
                showOnlyTypes = new[] { DocumentTypeConstants.MaternalCaseRecord, DocumentTypeConstants.RoadToHealthBook };
                docsQuery = docsQuery
                    .Include(d => d.DocumentType)
                    .Where(x => showOnlyTypes.Contains(x.DocumentType.Name));
            }

            if (pagingInput?.FilterBy is not null)
            {
                docsQuery = PaginationHelper.AddFiltering(pagingInput?.FilterBy, docsQuery);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                docsQuery = docsQuery.Where(x => EF.Functions.ILike(x.User.FirstName, $"%{search}%") || EF.Functions.ILike(x.User.Surname, $"%{search}%")
                 || EF.Functions.ILike(x.Name, search));

                docsQuery = docsQuery.Where(x => x.CreatedUser != null)
                        .Where(x => EF.Functions.ILike(x.CreatedUser.FirstName, $"%{search}%") || EF.Functions.ILike(x.CreatedUser.Surname, $"%{search}%")
                     || EF.Functions.ILike(x.Name, search));
            }

            var docs = docsQuery.OrderByDescending(x => x.UpdatedDate).ToList();

            //populate additional user info based on usertypes - createduser is HCW, userid is child/mother
            //TODO: Completing logic based on doc types determines users link
            //foreach (var doc in docs)
            //{
            //    //check client
            //}

            return docs;
        }

    }
}
