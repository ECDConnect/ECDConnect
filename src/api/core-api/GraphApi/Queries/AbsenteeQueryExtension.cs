using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
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
using System.IO;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class AbsenteeQueryExtension
    {
        public AbsenteeQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Absentees> GetAbsenteeByUserId([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            using var scope = dbFactory.CreateDbContext();            
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);
            List<Absentees> absents = dbRepo.GetAll().Where(x => x.UserId.Contains(userId)).ToList();
            foreach (var absent in absents)
            {
                if (absent.ReassignedClass != null)
                {
                    var classRepo = repoFactory.CreateRepository<Programme>(userContext: uId);
                    absent.Program = classRepo.GetAll().Where(x => x.Id.Equals(absent.ReassignedClass)).FirstOrDefault();
                }
                if (absent.ReassignedToPractitioner != null)
                {
                    var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
                    absent.Practitioner = practRepo.GetAll().Where(x => x.UserId.Contains(absent.ReassignedToPractitioner)).FirstOrDefault();
                }
            }

            return absents;
        }

        public int GetTotalDaysAbsent([Service] IHttpContextAccessor contextAccessor,
        [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        [Service] IGenericRepositoryFactory repoFactory,
        string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);
            List<Absentees> absents = dbRepo.GetAll().Where(x => x.UserId.Contains(userId)).ToList();

            return absents.Count();
        }

    }
}
