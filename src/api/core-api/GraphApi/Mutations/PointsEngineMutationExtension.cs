using ECDLink.Core.Services.Interfaces;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class PointsEngineMutationExtension
    {
        public bool TestPointEngine(
             [Service] IPointsEngineService pointsEngineService,
             string userId,
             DateTime today,
             string type
             )
         {
             //if (type == "CalculatePregnantMomClientRegistration")
             //{
             //    return pointsEngineService.CalculatePregnantMomClientRegistration(userId, today);
             //} 
             //else if (type == "CalculateInfantClientRegistration")
             //{
             //    return pointsEngineService.CalculateInfantClientRegistration(userId, today);
             //}
             //else if (type == "CalculatePregnantMomVisits")
             //{
             //    return pointsEngineService.CalculatePregnantMomVisits(userId, today);
             //}
             //else if (type == "CalculateInfantVisits")
             //{
             //    return pointsEngineService.CalculateInfantVisits(userId, today);
             //}
             //else 
             if (type == "CalculateChildrenRegistrationAdd")
             {
                 return pointsEngineService.CalculateChildrenRegistrationAdd(userId);
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

        public bool AddChildRegistrationPoints([Service] IPointsEngineService pointsEngineService, string userId)
        {
            return pointsEngineService.CalculateChildrenRegistrationAdd(userId);
        }

        public bool CalculateLeaveNoOneBehind([Service] IPointsService pointsEngineService)
        {
            pointsEngineService.CalculateLeaveNoOneBehind();
            return true;
        }
        
        public bool CalculateMeetRegularly([Service] IPointsEngineService pointsEngineService, Guid clubId, Guid clubMeetingId)
        {
            return pointsEngineService.CalculateMeetRegularly(clubId, clubMeetingId);
        }

        public bool CalculateProgressReports([Service] IPointsService pointsEngineService)
        {
            pointsEngineService.CalculateCompleteChildProgressReports();
            return true;
        }

        public bool CalculateCaregiverReportBack([Service] IPointsService pointsEngineService)
        {
            pointsEngineService.CalculateCompleteCaregiverReportBack();
            return true;
        }

        public bool CalculateClubChildAttendance([Service] IPointsService pointsEngineService)
        {
            pointsEngineService.CalculateClubChildAttendance();
            return true;
        }
    }
}
