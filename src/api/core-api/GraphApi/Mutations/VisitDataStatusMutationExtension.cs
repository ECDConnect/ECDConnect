using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
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
                entityToUpdate.IsCompleted = (bool)inputItem.IsCompleted;
                entityToUpdate.ReferralDateCompleted = (bool)inputItem.IsCompleted ? DateTime.Now : null;
                visitDataStatusRepo.Update(entityToUpdate);

                //update generated G4/G9  item
                var otherVisitReferrals = visitDataStatusRepo.GetAll().Where(x => 
                    x.VisitData.VisitId == entityToUpdate.VisitData.VisitId
                    && (x.Type.Equals(Constants.GGSettings.visit_data_client_dashboard) || x.Type.Equals(Constants.GGSettings.visit_data_client_summary)))
                    .ToList();

                foreach (var referral in otherVisitReferrals)
                {
                    referral.UpdatedDate = DateTime.Now;
                    referral.UpdatedBy = applicationUserId.ToString();
                    referral.IsCompleted = (bool)inputItem.IsCompleted;
                    referral.ReferralDateCompleted = (bool)inputItem.IsCompleted ? DateTime.Now : null;
                    visitDataStatusRepo.Update(referral);
                }
            }

            // TODO: check which needs to be called based on the referrals made
            pointsCalculationService.CalculatePregnantMotherReferralPoints(applicationUserId);
            pointsCalculationService.CalculateInfantVisitAndReferralPoints(applicationUserId);
            
            return true;
        }
    }
}
