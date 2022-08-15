using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Caregiver;
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
    public class CaregiveQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Caregiver> GetAllCaregiverByPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var careGiverRepo = repoFactory.CreateRepository<Caregiver>(userContext: uId);
            var practitionerrRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerrRepo.GetAll().Where(x => x.UserId.Equals(practitionerId)).ToList();            
            if (practitioners.Count>0)
            {
                List<Child> children = childRepo.GetAll().Where(x => x.Hierarchy.Contains(practitioners.FirstOrDefault().Hierarchy)).ToList();
                List<Caregiver> caregivers = new List<Caregiver>();
                foreach (var child in children)
                {
                    if (child.CaregiverId != null)
                    {
                        Caregiver cg = careGiverRepo.GetById((Guid)child.CaregiverId);
                        caregivers.Add(cg);
                    }
                }
                return caregivers;
            } else {
                return careGiverRepo.GetAll().ToList();
            }
        }
    }
}
