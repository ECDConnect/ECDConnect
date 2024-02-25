using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Services;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitDataMutationExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool AddVisitData([Service] VisitDataManager visitDataManager, [Service] VisitManager visitManager, HierarchyEngine hierarchyEngine, [Service] INotificationService notificationService, CMSVisitDataInputModel input)
        {
            if (input.MotherId != null)
            {
                visitDataManager.AddAntenatalVisitData(input);
            }
            else if (input.InfantId != null)
            {
                visitDataManager.AddChildVisitData(input);
            }
            else if (input.PractitionerId != null)
            {
                var visit = visitDataManager.AddPractitionerVisitData(input, true);
                // PQA Rating
                if (visit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1 || visit.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_follow_up)
                {
                    var pqaRating = visitDataManager.CalculateAndSavePractitionerPQARating(visit);
                    visitManager.AddNextPQAOrFollowUpVisit(pqaRating.OverallRatingColor, visit.PractitionerId.Value, visit);
                } 
                if (visit.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1 || visit.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_follow_up)
                {
                    var pqaRating = visitDataManager.CalculateAndSaveReAccreditationRating(visit);
                    visitManager.AddNextReAccreditationOrFollowUpVisit(pqaRating.OverallRatingColor, visit.PractitionerId.Value, visit);
                }
                var parentUser = hierarchyEngine.GetUserParentUserId(new Guid(input.PractitionerId));
                if (parentUser != null)
                {
                    notificationService.ExpireNotificationsTypesForUser(parentUser.ToString(), TemplateTypeConstants.CoachVisitRequested, null, null, input.PractitionerId);
                }
            }
            else if (input.TraineeId != null)
            {
                visitDataManager.AddTraineeVisitData(input);
                var parentUser = hierarchyEngine.GetUserParentUserId(new Guid(input.TraineeId));
                if (parentUser != null)
                {
                    notificationService.ExpireNotificationsTypesForUser(parentUser.ToString(), TemplateTypeConstants.CoachVisitRequested, null, null, input.TraineeId);
                }
            }
            //remove visit notifications for this user from the coach
            

            return true;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool EditVisitData([Service] VisitDataManager visitDataManager, CMSVisitDataInputModel input)
        {
            return visitDataManager.EditVisitData(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool AddSupportVisitData([Service] VisitDataManager visitDataManager, CMSVisitDataInputModel input)
        {
            return visitDataManager.AddSupportVisitData(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool AddCoachVisitData([Service] IIntegrationService integrationService, [Service] VisitDataManager visitDataManager, CMSVisitDataInputModel input)
        {
            Visit visit = visitDataManager.AddCoachData(input);
            return true;
        }
            
    }
}
