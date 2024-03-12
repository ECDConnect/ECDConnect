using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Services.PointsEngine.Interfaces;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using GreenDonut;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]

    public class VisitDataStatusMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool UpdateVisitDataStatus(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IGrowGreatPointsCalculationsService pointsCalculationService,
            IGenericRepositoryFactory repoFactory,
            VisitDataStatusReferral input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var visitDataStatusRepo = repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: applicationUserId);

            foreach (VisitDataStatusModel inputItem in input.Referrals)
            {
                var entityToUpdate = visitDataStatusRepo.GetAll().Where(x => x.Id.ToString() == inputItem.Id).OrderBy(x => x.Id).FirstOrDefault();
                entityToUpdate.UpdatedDate = DateTime.Now;
                entityToUpdate.UpdatedBy = applicationUserId.ToString();
                entityToUpdate.IsCompleted = (bool)inputItem.IsCompleted;// If we require this value to be passed in, then it should not be nullable on the input
                entityToUpdate.ReferralDateCompleted = (bool)inputItem.IsCompleted ? DateTime.Now : null;
                visitDataStatusRepo.Update(entityToUpdate);

                //update generated G4/G9  item
                var entityToUpdateG4 = visitDataStatusRepo.GetAll().Where(x => x.VisitDataId == entityToUpdate.VisitDataId
                && (x.Type.Equals(Constants.GGSettings.visit_data_client_dashboard) || x.Type.Equals(Constants.GGSettings.visit_data_client_summary)))
                    .OrderBy(x => x.Id).FirstOrDefault();

                if (entityToUpdateG4 != null)
                {
                    entityToUpdateG4.UpdatedDate = DateTime.Now;
                    entityToUpdateG4.UpdatedBy = applicationUserId.ToString();
                    entityToUpdateG4.IsCompleted = (bool)inputItem.IsCompleted;
                    entityToUpdateG4.ReferralDateCompleted = (bool)inputItem.IsCompleted ? DateTime.Now : null;
                    visitDataStatusRepo.Update(entityToUpdateG4);
                }
            }

             pointsCalculationService.CalculatePregnantMotherReferralPoints(applicationUserId);
            // TODO -> Add child referral points calculation
            
            return true;
        }
    }
}
