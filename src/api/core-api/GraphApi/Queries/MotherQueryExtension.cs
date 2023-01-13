using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class MotherQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Mother> GetAllMothers([Service] IHttpContextAccessor contextAccessor,
         [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
         [Service] IGenericRepositoryFactory repoFactory)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateRepository<Mother>(userContext: uId);
            List<Mother> mothers = motherRepo.GetAll().ToList();

            return mothers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Mother> GetAllMothersForHealthCareWorker([Service] IHttpContextAccessor contextAccessor,
         [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
         [Service] IGenericRepositoryFactory repoFactory,
         string id)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateRepository<Mother>(userContext: uId);
            List<Mother> mothers = motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId.Equals(id)).ToList();

            var i = 0;
            foreach (var mother in mothers)
            {
                var icon = i % 2 == 0 ? MetricsIconEnum.Error.ToString() : MetricsIconEnum.Warning.ToString();
                var note = i % 2 == 0 ? "pregnant mom" : "pregnant mom and child";
                var subject = i % 2 == 0 ? "Refer to clinic" : "Visit 1 overdue";

                mother.StatusInfo.Icon = icon;
                mother.StatusInfo.Color = icon;
                mother.StatusInfo.Subject = subject;
                mother.StatusInfo.Notes = note;

                i++;
            }

            return mothers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Mother GetMotherById([Service] IHttpContextAccessor contextAccessor,
         [Service] IGenericRepositoryFactory repoFactory,
         string id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateRepository<Mother>(userContext: uId);
            Mother mother = motherRepo.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).FirstOrDefault();

            return mother;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public int GetMotherCountForHealthCareWorkerForMonth([Service] IHttpContextAccessor contextAccessor,
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
