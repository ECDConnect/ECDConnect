using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
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
    public class CaregiveQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Caregiver> GetAllCaregiver(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] PersonnelService personnelManager,
            IGenericRepositoryFactory repoFactory,
            AuthenticationDbContext dbContext)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var careGiverRepo = repoFactory.CreateRepository<Caregiver>(userContext: uId);
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practitionerRepo.GetByUserId(uId);

            //return all caregivers for all the children if its a principal
            if (practitioner?.IsPrincipal == true)
            {
                List<Caregiver> caregivers = new List<Caregiver>();
                var practitioners = personnelManager.GetPractitionerPeers(practitioner.UserId.ToString());
                if (practitioners != null)
                {
                    foreach (var practi in practitioners)
                    {
                        List<Child> children = childRepo.GetAll().Where(x => x.Hierarchy.Contains(practi.Hierarchy)).ToList();
                        foreach (var child in children)
                        {
                            if (child.CaregiverId != null)
                            {
                                Caregiver cg = careGiverRepo.GetById((Guid)child.CaregiverId);
                                caregivers.Add(cg);
                            }
                        }
                    }
                }
                return caregivers;
            }
            else
            {
                //return all caregivers for the practitioner's children
                if (practitioner != null && practitioner.Hierarchy != null)
                {
                    List<Child> children = childRepo.GetAll().Where(x => x.Hierarchy.Contains(practitioner.Hierarchy)).ToList();
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
                     List<Caregiver> caregivers = dbContext.Caregivers.FromSql($@"
                                        SELECT cg.* 
                                        FROM ""Caregiver"" cg 
                                        JOIN ""Child"" c ON cg.""Id"" = c.""CaregiverId""
                                        JOIN ""Practitioner"" p ON c.""Hierarchy"" LIKE p.""Hierarchy"" || '%'
                                        WHERE p.""CoachHierarchy"" = '{uId}'::uuid
                                        ").ToList();
                    return caregivers;
                }
            }
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Caregiver> GetAllCaregiverByPractitioner(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string practitionerId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var careGiverRepo = repoFactory.CreateRepository<Caregiver>(userContext: uId);
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            List<Practitioner> practitioners = practitionerRepo.GetAll().Where(x => x.UserId == Guid.Parse(practitionerId)).ToList();

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
        public List<UserGrant> GetCaregiverGrants(
            [Service] AuthenticationDbContext context,
            Guid careGiverId)
        {
            return context.UserGrants.Where(x => x.UserId == careGiverId).ToList();
        }
    }
}
