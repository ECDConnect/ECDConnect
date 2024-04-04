using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Constants;
using EcdLink.Api.CoreApi.Services;
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
using Microsoft.AspNetCore.Identity;
using ECDLink.DataAccessLayer.Managers;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
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
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_mother) && x.Name == Constants.GGSettings.VisitTypeAdditionalVisit).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Mother mother = motherRepo.GetAll().Where(x => x.UserId.ToString() == input.MotherId.ToString()).FirstOrDefault();

            input.VisitType = visitType;
            input.Attended = false;
            input.InfantId = null;
            input.MotherId = mother.Id;
            input.LinkedVisitId = null;
            input.PractitionerId = null;
            if (input.PlannedVisitDate != default)
            {
                input.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            }

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
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_child) && x.Name == Constants.GGSettings.VisitTypeAdditionalVisit).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Infant infant = infantRepo.GetAll().Where(x => x.UserId.ToString() == input.InfantId.ToString()).FirstOrDefault();


            input.VisitType = visitType;
            input.Attended = false;
            input.MotherId = null;
            input.InfantId = infant.Id;
            input.LinkedVisitId = null;
            input.PractitionerId = null;
            if (input.PlannedVisitDate != default)
            {
                input.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            }

            return visitManager.AddAdditionalVisit(input);
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
            visitModel.MotherId = null;
            visitModel.InfantId = null;
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
            visitModel.MotherId = null;
            visitModel.InfantId = null;
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
            visitModel.MotherId = null;
            visitModel.InfantId = null;
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
            visitModel.MotherId = null;
            visitModel.InfantId = null;
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
            visitModel.MotherId = null;
            visitModel.InfantId = null;
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

        #region Trainees

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddSSChecklistForTrainee(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            [Service] ApplicationUserManager userManager,
            [Service] INotificationService notificationService,
            SSChecklistVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_trainee) && x.Name == Constants.SSSettings.visitType_smart_space_checklist).FirstOrDefault();
            Trainee trainee = traineeRepo.GetAll().Where(x => x.UserId.ToString() == input.TraineeId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = null;
            visitModel.TraineeId = trainee.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForTrainee(visitModel);
            // Add VisitData for visit
            input.ChecklistData.VisitId = visit.Id.ToString();
            input.ChecklistData.TraineeId = trainee.Id.ToString();
            visitDataManager.AddTraineeVisitData(input.ChecklistData);

            List<TagsReplacements> replacements = new List<TagsReplacements>();
            replacements.Add(new TagsReplacements()
            {
                FindValue = "SupportDate",
                ReplacementValue = trainee.InsertedDate.AddDays(21).ToShortDateString(),
            });

            var userToSend = userManager.FindByIdAsync(trainee.UserId).Result;
            notificationService.SendNotificationAsync(null, TemplateTypeConstants.GainCommunitySupport, DateTime.Now.Date, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(31), false,true,null, trainee.UserId.ToString());


            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddStartupSupportAgreementForTrainee(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SupportVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_trainee) && x.Name == Constants.SSSettings.visitType_startup_support_agreement).FirstOrDefault();
            Trainee trainee = traineeRepo.GetAll().Where(x => x.UserId.ToString() == input.TraineeId.ToString()).FirstOrDefault();

            // Add Visit
            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = null;
            visitModel.TraineeId = trainee.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForTrainee(visitModel);
            // Add VisitData for visit
            input.SupportData.VisitId = visit.Id.ToString();
            input.SupportData.TraineeId = trainee.Id.ToString();
            visitDataManager.AddTraineeVisitData(input.SupportData);

            return visit;
        }

        #endregion

        #region Coaches

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddCoachVisitInviteForTrainee(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SSChecklistVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: applicationUserId);
            var traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_coach) && x.Name == Constants.SSSettings.visitType_trainee_visit).FirstOrDefault();
            Coach coach = coachRepo.GetAll().Where(x => x.UserId.ToString() == input.CoachId.ToString()).FirstOrDefault();
            Trainee trainee = traineeRepo.GetAll().Where(x => x.UserId.ToString() == input.TraineeId.ToString()).FirstOrDefault();

            if (input.CoachId == null || input.TraineeId == null)
            {
                return new Visit();
            }

            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = null;
            visitModel.CoachId = coach.Id;
            visitModel.TraineeId = trainee.Id;
            visitModel.Attended = (bool)input.Attended;
            visitModel.PlannedVisitDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            visitModel.DueDate = Convert.ToDateTime(input.PlannedVisitDate, CultureInfo.InvariantCulture);
            if ((bool)input.Attended == true)
            {
                visitModel.ActualVisitDate = DateTime.Now;
            }

            Visit visit = visitManager.AddVisitForCoach(visitModel);
            // Add VisitData for visit
            input.ChecklistData.VisitId = visit.Id.ToString();
            input.ChecklistData.TraineeId = trainee.Id.ToString();
            input.ChecklistData.CoachId = coach.Id.ToString();
            visitDataManager.AddTraineeVisitData(input.ChecklistData);

            return visit;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddCoachFranchiseeAgreementForTrainee(
            [Service] IIntegrationService integrationService,
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            [Service] VisitDataManager visitDataManager,
            SSChecklistVisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: applicationUserId);
            var traineeRepo = repoFactory.CreateGenericRepository<Trainee>(userContext: applicationUserId);

            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_coach) && x.Name == Constants.SSSettings.visitType_coach_franchisee_agreement).FirstOrDefault();
            Coach coach = coachRepo.GetAll().Where(x => x.UserId.ToString() == input.CoachId.ToString()).FirstOrDefault();
            Trainee trainee = traineeRepo.GetAll().Where(x => x.UserId.ToString() == input.TraineeId.ToString()).FirstOrDefault();

            if (input.CoachId == null || input.TraineeId == null)
            {
                return new Visit();
            }

            var visitModel = new VisitModel();
            visitModel.VisitType = visitType;
            visitModel.LinkedVisitId = null;
            visitModel.CoachId = coach.UserId;
            visitModel.TraineeId = trainee.UserId;
            visitModel.PlannedVisitDate = DateTime.Now;
            visitModel.DueDate = DateTime.Now;
            visitModel.ActualVisitDate = DateTime.Now;
            visitModel.Attended = true;

            Visit visit = visitManager.AddVisitForCoach(visitModel);
            // Add VisitData for visit
            input.ChecklistData.VisitId = visit.Id.ToString();
            input.ChecklistData.TraineeId = trainee.Id.ToString();
            input.ChecklistData.CoachId = coach.Id.ToString();

            Visit updatedVisit = visitDataManager.AddCoachData(input.ChecklistData);
            return visit;
        }

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
