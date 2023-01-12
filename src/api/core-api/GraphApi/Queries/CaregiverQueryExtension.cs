using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
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
        public List<Caregiver> GetAllCaregiversForHealthCareWorker([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string id)
        {
            var healtCareWorkerIdGuid = new Guid(id);
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var careGiverRepo = repoFactory.CreateGenericRepository<Caregiver>(userContext: uId);
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);

            List<Caregiver> caregivers = new List<Caregiver>();
            List<Mother> mother_caregivers = new List<Mother>();

            if (healtCareWorkerIdGuid != null)
            {
                // get all caregivers linked to HCW
                caregivers = careGiverRepo.GetAll().Where(x => x.HealthCareWorkerId.Equals(healtCareWorkerIdGuid)).ToList();

                // get all mothers linked to HCW that is also registered as caregivers
                mother_caregivers = motherRepo.GetAll().Where(x => x.HealthCareWorkerId.Equals(healtCareWorkerIdGuid) && x.LinkedCaregiverId.HasValue).ToList();

                // loop through both lists and mark the caregiver as a mother
                foreach (var caregiver in caregivers)
                {
                    foreach (var mother in mother_caregivers)
                    {
                        if (caregiver.Id == mother.LinkedCaregiverId)
                        {
                            caregiver.isMother = true;
                        }
                    }
                }
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
