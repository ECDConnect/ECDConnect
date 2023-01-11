using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Documents;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class InfantQueryExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Infant> GetAllInfants([Service] IHttpContextAccessor contextAccessor,
         [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
         [Service] IGenericRepositoryFactory repoFactory)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Infant>(userContext: uId);
            List<Infant> children = childRepo.GetAll().ToList();

            return children;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Infant> GetAllInfantsForHealthCareWorker([Service] IHttpContextAccessor contextAccessor,
         [Service] IGenericRepositoryFactory repoFactory,
         string id)
        {
            List<Infant> infants = new List<Infant>();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            List<Infant> children = childRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId.Equals(id)).ToList();
            List<Infant> childrenMother = childRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.Equals(id)).ToList();


            var i = 0;
            foreach (var child in children)
            {
                var icon = i % 2 == 0 ? MetricsIconEnum.Error.ToString() : MetricsIconEnum.Warning.ToString();
                var subject = i % 2 == 0 ? "Refer to clinic" : "Low birth weight";

                child.statusInfo.Icon = icon;
                child.statusInfo.Color = icon;
                child.statusInfo.Subject = subject;
                child.statusInfo.Notes = "child";

                i++;
            }

            i = 0;
            foreach (var child in childrenMother)
            {
                var icon = i % 2 == 0 ? MetricsIconEnum.Error.ToString() : MetricsIconEnum.Warning.ToString();
                var subject = i % 2 == 0 ? "Refer to clinic" : "Low birth weight";

                child.statusInfo.Icon = icon;
                child.statusInfo.Color = icon;
                child.statusInfo.Subject = subject;
                child.statusInfo.Notes = "child";

                i++;
            }

            infants.AddRange(children);
            infants.AddRange(childrenMother);
            return infants;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public int GetInfantCountForHealthCareWorkerForMonth([Service] IHttpContextAccessor contextAccessor,
         [Service] IGenericRepositoryFactory repoFactory,
         string userId)
        {
            DateTime today = DateTime.Today;

            var childCount = 0;
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            List<Infant> childrenCaregiver = childRepo.GetAll().Where(x => x.Caregiver.HealthCareWorker.UserId.Equals(userId) && (
                                                                            x.InsertedDate.Month == today.Month &&
                                                                            x.InsertedDate.Year == today.Year)).ToList();
            List<Infant> childrenMother = childRepo.GetAll().Where(x => x.Mother.HealthCareWorker.UserId.Equals(userId) &&
                                                                            x.InsertedDate.Month == today.Month &&
                                                                            x.InsertedDate.Year == today.Year).ToList();

            childCount = childrenCaregiver.Count + childrenMother.Count;

            return childCount;
        }

    }
}
