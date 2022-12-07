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
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class CaregiveQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Caregiver> GetAllCaregiver([Service] IHttpContextAccessor contextAccessor,
    [Service] IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var careGiverRepo = repoFactory.CreateRepository<Caregiver>(userContext: uId);
            var practitionerrRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerrRepo.GetAll().Where(x => x.UserId.Equals(uId)).ToList();
            if (practitioners.Count > 0)
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
            }
            else
            {
                return careGiverRepo.GetAll().ToList();
            }
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Caregiver> GetAllCaregiverByPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId)
        {
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

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Caregiver> GetAllCaregiversForHealthCareWorker([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string id)
        {
            var healtCareWorkerIdGuid = new Guid(id);
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var careGiverRepo = repoFactory.CreateGenericRepository<Caregiver>(userContext: uId);
            List<Caregiver> caregivers = new List<Caregiver>();

            if (healtCareWorkerIdGuid != null)
            {
                caregivers = careGiverRepo.GetAll().Where(x => x.HealthCareWorkerId.Equals(healtCareWorkerIdGuid)).ToList();
            }

            return caregivers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<UserGrant> GetCaregiverGrants([Service]
        AuthenticationDbContext context,
    Guid careGiverId)
        {
            return context.UserGrants.Where(x => x.UserId == careGiverId.ToString()).ToList();
        }

    }
}
