using EcdLink.Api.CoreApi.GraphApi.Mutations.SmartStart;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.Integration
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class IntegrationMutationExtension
    {
        #region Service Calls       


        //public async Task<List<MappedCoach>> IntegrationByFranchisor(
        //[Service] IIntegrationService integrationService,
        //IGenericRepositoryFactory repoFactory,
        //[Service] IHttpContextAccessor httpContextAccessor,
        //[Service] UserManager<ApplicationUser> userManager,
        //string franchisorId, bool isNew = false
        //)
        //{
        //    List<MappedCoach> coaches = await integrationService.GetCoaches(franchisorId);
        //    var uId = httpContextAccessor.HttpContext.GetUser().Id;
        //    foreach (var coach in coaches)
        //    {
        //        if (isNew)
        //        {
        //            //Insert Coaches to Ingestion Script
        //            MappedCoach newMappedCoach = new MappedCoach()
        //            {
        //                FirstName = coach.FirstName,
        //                Surname = coach.Surname,
        //                ContactNumber = coach.ContactNumber,
        //                FullName = coach.FullName,
        //                IdNumber = coach.IdNumber,
        //                Status = coach.Status,
        //            };
        //            Coach newCoach = new PractitionerMutationExtension().CreateCoachUser(repoFactory, httpContextAccessor, userManager, newMappedCoach, franchisorId);

        //            //now map to IntegrationEntityMapping table with both guids
        //            var dbRepo = repoFactory.CreateRepository<IntegrationEntityMapping>(userContext: uId);
        //            IntegrationEntityMapping cc = new IntegrationEntityMapping()
        //            {
        //                LocalEntity = "Coach",
        //                LocalId = newCoach.Id.ToString(),
        //                RemoteEntity = "Coach",
        //                RemoteId = coach.Guid,
        //                UpdatedBy = uId,
        //                UpdatedDate = DateTime.Now,
        //                LastCheckedDate = DateTime.Now,
        //                LastUpdatedDate = DateTime.Now,
        //                IntegrationSystem = "SmartLink",
        //                InsertedDate = DateTime.Now,
        //                UserId = uId
        //            };
        //            dbRepo.Insert(cc);

        //        }
        //    }
        //    return coaches;
        //}

        public async Task<bool> IntegrationByMappedCoach([Service] IIntegrationService integrationService)
        {
            return await integrationService.IntegrationByMappedCoach();
        }

        #endregion
    }
}
