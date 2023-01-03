using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Classroom;
using System.Collections.Generic;
using ECDLink.DataAccessLayer.Hierarchy;
using Microsoft.Azure.Documents;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using static ECDLink.Core.SystemSettings.SettingGroups;
using Microsoft.Extensions.DependencyInjection;
using EcdLink.Api.CoreApi.Services;
using System.Drawing;
using ECDLink.Core.Services;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Entities.DataIngestion;
using NPOI.SS.Formula.Functions;
using ECDLink.Core.Helpers;
using Azure.Storage.Blobs.Models;
using EcdLink.Api.CoreApi.GraphApi.Queries;
using static NPOI.HSSF.Util.HSSFColor;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationMapping;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class IntegrationMutationExtension
    {
        #region Service Calls       


        public async Task<List<MappedCoach>> IntegrationByFranchisor(
        [Service] IIntegrationService integrationService,
        [Service] IGenericRepositoryFactory repoFactory,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] UserManager<ApplicationUser> userManager,
        string franchisorId, bool isNew = false
        )
        {
            List<MappedCoach> coaches = await integrationService.GetCoaches(franchisorId);
            var uId = httpContextAccessor.HttpContext.GetUser().Id;            
            foreach (var coach in coaches)
            {
                if (isNew)
                {
                    //Insert Coaches to Ingestion Script
                    MappedCoach newMappedCoach = new MappedCoach()
                    {
                        FirstName = coach.FirstName,
                        Surname = coach.Surname,
                        ContactNumber = coach.ContactNumber,
                        FullName = coach.FullName,
                        IdNumber = coach.IdNumber,
                        Status = coach.Status,
                    };
                    Coach newCoach = new PractitionerMutationExtension().CreateCoachUser(repoFactory, httpContextAccessor, userManager, newMappedCoach, franchisorId);

                    //now map to IntegrationMapping table with both guids
                    var dbRepo = repoFactory.CreateRepository<IntegrationMapping>(userContext: uId);
                    IntegrationMapping cc = new IntegrationMapping()
                    {
                        LocalEntity = "Coach",
                        LocalId = newCoach.Id.ToString(),
                        RemoteEntity = "Coach",
                        RemoteId = coach.Guid,
                        UpdatedBy = uId,
                        UpdatedDate = DateTime.Now,
                        LastCheckedDate = DateTime.Now,
                        LastUpdatedDate = DateTime.Now,
                        IntegrationSystem = "SmartLink",
                        InsertedDate = DateTime.Now,
                        UserId = uId
                    };
                    dbRepo.Insert(cc);

                }
            }
            return coaches;
        }

        #endregion
    }
}
