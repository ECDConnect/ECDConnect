using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitDataMutationExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool AddVisitData([Service] VisitDataManager visitDataManager, [Service] VisitManager visitManager, CMSVisitDataInputModel input)
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
            }
            else if (input.TraineeId != null)
            {
                visitDataManager.AddTraineeVisitData(input);
            }
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
        public bool AddCoachVisitData([Service] VisitDataManager visitDataManager, CMSVisitDataInputModel input)
        {
            return visitDataManager.AddCoachData(input);
        }
            
    }
}
