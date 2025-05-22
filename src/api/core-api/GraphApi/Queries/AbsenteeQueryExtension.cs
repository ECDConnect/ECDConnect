using ECDLink.Abstractrions.GraphQL.Enums;
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
using System;
using System.Collections.Generic;
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
        IGenericRepositoryFactory repoFactory,
        string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);
            List<Absentees> absents = dbRepo.GetAll().Where(x => x.UserId.ToString().Contains(userId)).ToList();
            foreach (var absent in absents)
            {
                if (absent.ReassignedClass != null)
                {
                    var classRepo = repoFactory.CreateRepository<Programme>(userContext: uId);
                    absent.Program = classRepo.GetAll().Where(x => x.Id == Guid.Parse(absent.ReassignedClass)).OrderBy(x => x.Id).FirstOrDefault();
                }
                if (absent.ReassignedToPractitioner != null)
                {
                    var practRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
                    absent.Practitioner = practRepo.GetAll().Where(x => x.UserId.ToString().Contains(absent.ReassignedToPractitioner)).OrderBy(x => x.Id).FirstOrDefault();
                }
            }

            return absents;
        }

        public int GetTotalDaysAbsent([Service] IHttpContextAccessor contextAccessor,
        IGenericRepositoryFactory repoFactory,
        string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);
            List<Absentees> absents = dbRepo.GetAll().Where(x => x.UserId.ToString().Contains(userId)).ToList();

            return absents.Count();
        }

        public List<Absentees> GetAbsentees(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId,
            DateTime fromDate,
            DateTime toDate)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var absenteeRepo = repoFactory.CreateRepository<Absentees>(userContext: uId);

            var absentees = absenteeRepo.GetAll().Where(x => x.UserId.ToString() == userId).ToList();
            return absentees.Where(x => x.AbsentDate >= fromDate && x.AbsentDate <= toDate).ToList();
        }

    }
}
