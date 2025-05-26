using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
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
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using EcdLink.Api.CoreApi.GraphApi.Models.Visits;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public BasicVisitModel RestartVisit(
            [Service] VisitManager visitManager,
            Guid existingVisitId)
        {           
            var visit = visitManager.RestartVisit(existingVisitId);

            var visitModel = new BasicVisitModel
            {
                Id = visit.Id,
                Attended = visit.Attended,
                IsCancelled = visit.IsCancelled,
                ActualVisitDate = visit.ActualVisitDate,
                PlannedVisitDate = visit.PlannedVisitDate,
                Comment = visit.Comment,
                DueDate = visit.DueDate,
                EventId = visit.EventId,
                OrderDate = visit.DueDate.HasValue 
                    ? visit.DueDate.Value
                    : visit.PlannedVisitDate,
                Risk = visit.Risk,
                StartedDate = visit.VisitData == null || !visit.VisitData.Any()
                   ? null
                   : visit.VisitData.OrderBy(x => x.InsertedDate).First().InsertedDate,
                VisitType = new BasicVisitTypeModel
                {
                    Id = visit.VisitType.Id,
                    Description = visit.VisitType.Description,
                    Name = visit.VisitType.Name,
                    NormalizedName = visit.VisitType.NormalizedName,
                    Order = visit.VisitType.Order,
                }
            };

            return visitModel;
        }

        #region Practitioners

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddSupportVisitForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SupportVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);
            VisitType visitType;
            if (input.isSupportCall == true)
            {
                visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_call).OrderBy(x => x.NormalizedName).FirstOrDefault();
            }
            else
            {
                visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_support).OrderBy(x => x.NormalizedName).FirstOrDefault();
            }

            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId.ToString() == input.PractitionerId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = null;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.SupportData.VisitId = visit.Id.ToString();
            input.SupportData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.SupportData, false);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddFollowUpVisitForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            FollowUpVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_pqa_visit_follow_up).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId.ToString() == input.PractitionerId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = input.LinkedVisitId;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.FollowUpData.VisitId = visit.Id.ToString();
            input.FollowUpData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.FollowUpData, false);

            // PQA Rating
            var pqaRating = visitDataManager.CalculateAndSavePractitionerPQARating(visit);
            visitManager.AddNextPQAOrFollowUpVisit(pqaRating.OverallRatingColor, practitioner.Id, visit);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddReAccreditationFollowUpVisitForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            FollowUpVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_re_accreditation_follow_up).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId.ToString() == input.PractitionerId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = input.LinkedVisitId;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.FollowUpData.VisitId = visit.Id.ToString();
            input.FollowUpData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.FollowUpData, false);

            // PQA Rating
            PQARating pqaRating = visitDataManager.CalculateAndSaveReAccreditationRating(visit);
            visitManager.AddNextReAccreditationOrFollowUpVisit(pqaRating.OverallRatingColor, practitioner.Id, visit);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddReAccreditationVisitForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            ReAccreditationVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId.ToString() == input.PractitionerId.ToString()).FirstOrDefault();
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_re_accreditation_1).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = input.LinkedVisitId;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            if (input.PlannedVisitDate.ToString() != "")
            {
                visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
                visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);

            }
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.ReAccreditationData.VisitId = visit.Id.ToString();
            input.ReAccreditationData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.ReAccreditationData, false);

            // PQA Rating
            PQARating pqaRating = visitDataManager.CalculateAndSaveReAccreditationRating(visit);
            visitManager.AddNextReAccreditationOrFollowUpVisit(pqaRating.OverallRatingColor, practitioner.Id, visit);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddSelfAssessmentForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SupportVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type == Constants.SSSettings.client_practitioner && x.Name == Constants.SSSettings.visitType_self_assessment).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId.ToString() == input.PractitionerId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = input.LinkedVisitId;
            visitModel.PractitionerId = practitioner.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForPractitioner(visitModel);
            // Add VisitData for visit
            input.SupportData.VisitId = visit.Id.ToString();
            input.SupportData.PractitionerId = practitioner.Id.ToString();
            visitDataManager.AddPractitionerVisitData(input.SupportData, false);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit UpdateVisitPlannedVisitDate(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            UpdateVisitPlannedVisitDateModel input)
        {
            return visitManager.UpdateVisitPlannedVisitDate(input);
        }

        #endregion

        #region Coaches
                
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddCoachVisitInviteForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            [Service] INotificationService notificationService,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            VisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);

            VisitType visitType;
            if (input.EventId.HasValue)
            {
                visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_support).OrderBy(x => x.NormalizedName).FirstOrDefault();
            }
            else if (input.isSupportCall == true)
            {
                visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_coach) && x.Name == Constants.SSSettings.visitType_practitioner_call).OrderBy(x => x.NormalizedName).FirstOrDefault();
            }
            else
            {
                visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_coach) && x.Name == Constants.SSSettings.visitType_practitioner_visit).OrderBy(x => x.NormalizedName).FirstOrDefault();
            }

            Coach coach = coachRepo.GetAll().Where(x => x.Id == input.CoachId).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId.ToString() == input.PractitionerId.ToString()).FirstOrDefault();

            if (coach == null || practitioner == null)
            {
                return new Visit();
            }

            input.VisitType = visitType;
            input.Attended = false;
            input.CoachId = coach.UserId;
            input.PractitionerId = practitioner.UserId;
            input.LinkedVisitId = input.LinkedVisitId;
            input.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            input.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            return visitManager.AddVisitForCoach(input);
        }

        #endregion
    }
}
