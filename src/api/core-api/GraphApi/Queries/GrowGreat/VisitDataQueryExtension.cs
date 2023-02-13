using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Repositories;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class VisitDataQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitData> GetVisitDataForVisit(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string visitId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: uId);

            List<VisitData> visitData = visitDataRepo.GetAll().Where(x => x.VisitId == new Guid(visitId)).ToList();

            return visitData;
        }

    }
}