using ECDLink.Core.Services.Interfaces;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class PointsEngineMutationExtension
    {
        public bool TestPointEngine(
             [Service] IHttpContextAccessor contextAccessor,
             [Service] IPointsEngineService pointsEngineService,
             string userId,
             DateTime today,
             string type
             )
         {
             if (type == "CalculatePregnantMomClientRegistration")
             {
                 return pointsEngineService.CalculatePregnantMomClientRegistration(userId, today);
             } 
             else if (type == "CalculateInfantClientRegistration")
             {
                 return pointsEngineService.CalculateInfantClientRegistration(userId, today);
             }
             else if (type == "CalculatePregnantMomVisits")
             {
                 return pointsEngineService.CalculatePregnantMomVisits(userId, today);
             }
             else if (type == "CalculateInfantVisits")
             {
                 return pointsEngineService.CalculateInfantVisits(userId, today);
             }
             else if (type == "CalculateChildrenRegistrationAdd")
             {
                 return pointsEngineService.CalculateChildrenRegistrationAdd(userId, today);
             }
             else if (type == "CalculateChildrenRegistrationRemoval")
             {
                 return pointsEngineService.CalculateChildrenRegistrationRemoval(userId, today);
             }
             else if (type == "CalculateAttendanceSubmitted")
             {
                 return pointsEngineService.CalculateAttendanceSubmitted(userId, today);
             }

             return false;
         }

        public bool CalculateLeaveNoOneBehind([Service] IPointsEngineService pointsEngineService)
        {
            return pointsEngineService.CalculateLeaveNoOneBehind();
        }


    }
}
