using EcdLink.Api.CoreApi.Managers.Users;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
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

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class MotherQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Mother> GetAllMothers(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            List<Mother> mothers = motherRepo.GetAll().ToList();

            return mothers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Mother> GetAllMothersForHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            [Service] MotherManager motherManager,
            string id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            List<Mother> mothers = motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId.Equals(id)).ToList();

            foreach (var mother in mothers)
            {
                mother.StatusInfo = motherManager.GetStatusInfo(mother.Id);
            }

            return mothers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Mother GetMotherById(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            Mother mother = motherRepo.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).FirstOrDefault();

            return mother;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public int GetMotherCountForHealthCareWorkerForMonth(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string id)
        {
            DateTime today = DateTime.Today;

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            List<Mother> mothers = motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId.Equals(id) && (
                                                                  x.InsertedDate.Month == today.Month &&
                                                                  x.InsertedDate.Year == today.Year)).ToList();

            return mothers.Count;
        }



    }
}
