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
            string[] showOnlyStatus = null,
            PagedQueryInput pagingInput = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var docRepo = repoFactory.CreateGenericRepository<Document>(userContext: uId);
            var infantRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            var healthCareWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);

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

            //populate additional user info based on usertypes - createduser is HCW, userid is infant/mother
            foreach (var doc in docsList)
            {
                if (doc.CreatedUserId != null)
                {
                    HealthCareWorker hcw = healthCareWorkerRepo.GetAll().Where(x => x.UserId == doc.CreatedUserId).FirstOrDefault();
                    if (hcw != null && hcw.User != null)
                    {
                        doc.CreatedUser = hcw.User;
                        doc.CreatedByName = hcw.User.FirstName + " " + hcw.User.Surname; 
                    }
                }

                if (doc.DocumentType.Name == DocumentTypeConstants.MaternalCaseRecord)
                {
                    //mother
                    Mother mother = motherRepo.GetAll().Where(x => x.UserId == doc.UserId).FirstOrDefault();
                    if (mother != null && mother.User != null)
                    {
                        doc.ClientName = mother.User.FirstName + " " + mother.User.Surname;
                        doc.ClientStatus = (mother.IsActive ? "Active" : "Inactive");
                    }
                } 
                else if (doc.DocumentType.Name == DocumentTypeConstants.RoadToHealthBook)
                {
                    //infants
                    Infant infant = infantRepo.GetAll().Where(x => x.UserId == doc.UserId).FirstOrDefault();
                    if (infant != null && infant.Caregiver != null)
                    {
                        doc.ClientName = infant.Caregiver.FirstName + " " + infant.Caregiver.Surname + " & " + infant.User.FirstName;
                        doc.ClientStatus = (infant.Caregiver.IsActive ? "Active" : "Inactive");
                    }
                }
            }

            if (showOnlyStatus == null)
            {
                showOnlyStatus = new[] { "Active", "Inactive" };
            }
            docsList = docsList.Where(x => showOnlyStatus.Contains(x.ClientStatus)).ToList();

            if (!string.IsNullOrWhiteSpace(search))
            {
                docsList = docsList.Where(x => (x.ClientName!= null && x.ClientName.Contains(search)) || (x.CreatedByName != null && x.CreatedByName.Contains(search))).ToList(); 
            }

            return docsList;
        }

    }
}
