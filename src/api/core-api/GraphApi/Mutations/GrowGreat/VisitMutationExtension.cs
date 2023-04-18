using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddAdditionalVisitForMother(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            VisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: applicationUserId);
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_mother) && x.Name == Constants.GGSettings.additional_visits).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Mother mother = motherRepo.GetAll().Where(x => x.UserId == input.MotherId.ToString()).FirstOrDefault();

            input.VisitType = visitType;
            input.Attended = false;
            input.InfantId = null;
            input.MotherId = mother.Id;

            return visitManager.AddAdditionalVisit(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddAdditionalVisitForInfant(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            VisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var infantRepo = repoFactory.CreateGenericRepository<Infant>(userContext: applicationUserId);
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_child) && x.Name == Constants.GGSettings.additional_visits).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Infant infant = infantRepo.GetAll().Where(x => x.UserId == input.InfantId.ToString()).FirstOrDefault();


            input.VisitType = visitType;
            input.Attended = false;
            input.MotherId = null;
            input.InfantId = infant.Id;

            return visitManager.AddAdditionalVisit(input);
        }
    }
}
