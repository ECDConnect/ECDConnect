using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class TeamLeadMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public TeamLead AddTeamLead(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            TeamLeadModel input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;

            var teamLead = new TeamLead()
            {
                Id = new Guid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = applicationUserId.ToString(),
                UserId = new Guid(input.UserId),
                ClinicId = input.ClinicId,
                JobTitle = input.JobTitle
            };

            var teamLeadRepo = repoFactory.CreateRepository<TeamLead>(userContext: applicationUserId);
            return teamLeadRepo.Insert(teamLead);

        }

    }
}
